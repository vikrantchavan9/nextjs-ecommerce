// src/components/RazorpayButton.jsx
"use client";

import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function RazorpayButton({ product }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load Razorpay's checkout.js script once per component instance
  // or ideally in your root layout for broader availability
  // (though placing it here is okay if this button is often present)

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Create order on your backend (Razorpay specific order)
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: product.price,
          currency: 'INR',
          receiptId: `receipt_${product.id}_${Date.now()}`,
          notes: { productId: product.id, productName: product.name },
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create Razorpay order');
      }

      const { orderId, amount, currency } = await orderResponse.json(); // This is Razorpay's orderId (order_xxxx)

      // 2. Configure and open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Your Store Name",
        description: `Payment for ${product.name}`,
        order_id: orderId,
        handler: async function (response) {
          // This handler is called on successful payment from Razorpay's end
          console.log("Razorpay handler response:", response);

          // 3. Verify payment on your backend (CRUCIAL SECURITY STEP)
          const verifyResponse = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response), // Pass all response data for verification
          });

          if (!verifyResponse.ok) {
            const errorData = await verifyResponse.json();
            alert(`Payment verification failed: ${errorData.message || 'Server error'}`);
            console.error('Payment verification failed - Server Error:', errorData);
            setLoading(false); // Make sure loading is reset here
            return;
          }

          const verificationResult = await verifyResponse.json();

          if (verificationResult.success) {
            console.log('Payment verified successfully on server!');

            // 4. Create the final order in your Supabase DB using your new API route
            // Send Razorpay's details along with cart items
            const createOrderInDbResponse = await fetch('/api/order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cartItems: [{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1 // Assuming 1 quantity for a direct product page purchase
                }],
                userId: null, // Replace with actual user ID if logged in
                totalAmount: product.price,
                paymentId: response.razorpay_payment_id, // The ID from Razorpay's successful payment
                razorpayOrderId: response.razorpay_order_id, // The order ID from Razorpay
              }),
            });

            if (!createOrderInDbResponse.ok) {
              const errorData = await createOrderInDbResponse.json();
              alert(`Failed to save order: ${errorData.message || 'Server error'}`);
              console.error('Error saving order to DB:', errorData);
              setLoading(false); // Make sure loading is reset here
              return;
            }

            const dbOrderResult = await createOrderInDbResponse.json();
            console.log('Order successfully saved to DB:', dbOrderResult);

            alert('Payment successful and order saved!');
            router.push(`/order-success?orderId=${dbOrderResult.orderId}&paymentId=${response.razorpay_payment_id}`);

          } else {
            alert('Payment verification failed. Please contact support.');
            console.error('Payment verification failed:', verificationResult.message);
          }
        },
        prefill: { /* ... your prefill data ... */ },
        notes: { /* ... your notes ... */ },
        theme: { color: "#3399CC" },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on('payment.failed', function (response) {
        alert(response.error.description || 'Payment Failed');
        console.error('Razorpay Payment Failed:', response.error);
        setLoading(false); // Reset loading on failure
      });

      rzp1.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      alert(error.message || 'Payment failed to initiate. Please try again.');
    } finally {
      // setLoading(false); // Handled within handler/failure now.
      // This finally block will run immediately after rzp1.open(),
      // but before the handler is called, so it's often better to
      // manage loading inside the handler or failure callbacks.
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="mt-6 px-6 py-3 bg-black text-white rounded hover:bg-slate-800 transition"
      >
        {loading ? 'Processing...' : `Pay Now (₹${product.price})`}
      </button>
    </>
  );
}