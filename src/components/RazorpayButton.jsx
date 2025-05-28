// src/components/RazorpayButton.jsx
"use client";

import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/cart-context'; // Import your cart context

export default function RazorpayButton({ amount, currency, cartItems }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { clearCart } = useCart(); // Get clearCart from your context

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Create order on your backend
      const orderResponse = await fetch('/api/order', { // Changed to /api/order
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          cartItems: cartItems, // Send cart items to the server
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create Razorpay order');
      }

      const { orderId, amount: razorpayAmount, currency: razorpayCurrency } = await orderResponse.json();

      if (typeof window.Razorpay === 'undefined') {
        console.error("Razorpay SDK not loaded. Please ensure the script is loaded.");
        alert("Payment gateway not ready. Please try again.");
        setLoading(false);
        return;
      }

      // 3. Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayAmount, // Amount from your order API (in paise)
        currency: razorpayCurrency,
        name: "Your Ecommerce Store",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          // This function is called after successful payment
          console.log("Razorpay callback received:", response);

          // 4. Verify payment and save order on your backend
          const verifyResponse = await fetch('/api/verify', { // Changed to /api/verify
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...response, // Pass all Razorpay response data
              cartItems: cartItems, // Pass the original cart items again
              totalAmount: amount, // Pass the total amount again
              currency: currency,
            }),
          });

          if (verifyResponse.ok) {
            const result = await verifyResponse.json();
            if (result.success) {
              alert('Payment successful!');
              clearCart(); // Clear the cart after successful order
              router.push(`/order-success?orderId=${result.order.id}`); // Redirect to a success page
            } else {
              alert(result.message || 'Payment verification failed. Please contact support.');
              console.error('Payment verification failed:', result.message);
            }
          } else {
            const errorResult = await verifyResponse.json();
            alert(`Payment verification failed due to server error: ${errorResult.message || 'Unknown error'}`);
            console.error('Server error during verification:', errorResult);
          }
        },
        prefill: {
          // Optional: Prefill user details if available
          // name: "Customer Name", // You might fetch this from Supabase in Client Component
          // email: "customer@example.com",
          // contact: "9999999999",
        },
        theme: {
          color: "#3399CC",
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on('payment.failed', function (response) {
        alert(`Payment Failed: ${response.error.description || 'Unknown error'}`);
        console.error('Payment failed:', response.error);
        // You might want to log this failure on your server too via another API route
      });

      rzp1.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      alert(error.message || 'Payment failed to initiate. Please try again.');
    } finally {
      setLoading(false);
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
        disabled={loading || amount <= 0} // Disable if loading or amount is 0
        className="mt-6 px-6 py-3 bg-black text-white rounded hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay Now (₹${amount.toFixed(2)})`}
      </button>
    </>
  );
}