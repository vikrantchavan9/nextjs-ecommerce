// components/RazorpayButton.jsx
'use client';

import { loadRazorpayScript } from '@/lib/utils';
import { useState } from 'react';
import { useCart } from '@/app/context/cart-context';
import { useRouter } from 'next/navigation'; // Import useRouter

const RazorpayButton = ({ amount, currency, userId, cartItems }) => {
  const [loading, setLoading] = useState(false);
  const { clearCart } = useCart();
  const router = useRouter(); // Initialize useRouter

  const displayRazorpay = async () => {
    setLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency,
          userId,
          cartItems: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.images?.[0] || null,
          })),
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create Razorpay order');
      }

      const orderData = await orderResponse.json();
      console.log('Razorpay Order Created (from /api/razorpay/order):', orderData);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your E-commerce Store',
        description: 'Payment for your order',
        order_id: orderData.id,
        handler: async function (response) {
          console.log('Razorpay handler called with response:', response);
          console.log('  response.razorpay_payment_id:', response.razorpay_payment_id);
          console.log('  response.razorpay_order_id:', response.razorpay_order_id);
          console.log('  response.razorpay_signature:', response.razorpay_signature);

          // Check if key payment IDs are present before proceeding
          if (!response.razorpay_payment_id || !response.razorpay_signature) {
              console.error('Handler received incomplete payment data. Payment likely failed or was incomplete.');
              alert('Payment failed or was incomplete. Please try again.');
              setLoading(false);
              return;
          }

          const verifyResponse = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: userId,
            }),
          });

          if (verifyResponse.ok) {
            // alert('Payment Successful!'); // Remove alert
            clearCart(); // Clear cart after successful payment
            router.push('/payment-success'); // Redirect to success page
          } else {
            const errorVerifyData = await verifyResponse.json();
            alert(`Payment Verification Failed: ${errorVerifyData.error}`);
            console.error('Payment Verification Error:', errorVerifyData);
          }
          setLoading(false);
        },
        prefill: {
          // You might want to prefill user details here if available from your user session
          // name: 'John Doe',
          // email: 'john.doe@example.com',
          // contact: '9999999999',
        },
        theme: {
          color: '#3399CC',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Error during Razorpay process:', error);
      alert(`Payment failed: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={displayRazorpay}
      disabled={loading || amount <= 0}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : `Pay with Razorpay (₹${amount.toFixed(2)})`}
    </button>
  );
};

export default RazorpayButton;