// components/RazorpayButton.jsx
'use client';

import { loadRazorpayScript } from '@/lib/utils';
import { useState } from 'react';
import { useCart } from '@/app/context/cart-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link for navigation

const RazorpayButton = ({ amount, currency, userId, cartItems }) => {
  const [loading, setLoading] = useState(false);
  const { clearCart } = useCart();
  const router = useRouter();

  // Determine if the user is logged in based on userId
  const isLoggedIn = !!userId; // Convert userId to a boolean

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

          // --- CRITICAL DEBUGGING: Read these logs in your browser console ---
          console.log('Verify API response status:', verifyResponse.status);
          console.log('Verify API response ok:', verifyResponse.ok);

          if (verifyResponse.ok) {
            console.log('Payment verification successful! Attempting redirect...');
            clearCart(); // Uncomment if you want to clear cart on success
            router.push('/payment-success');
            console.log('Redirect initiated to /payment-success.');
          } else {
            // Attempt to parse error data only if response is not ok
            let errorVerifyData = { error: 'Unknown verification error' };
            try {
              errorVerifyData = await verifyResponse.json();
            } catch (jsonError) {
              console.error('Failed to parse verification error JSON:', jsonError);
            }
            alert(`Payment Verification Failed: ${errorVerifyData.error}`);
            console.error('Payment Verification Error Response:', errorVerifyData);
            console.log('Payment verification failed. No redirect.');
          }
          setLoading(false);
        },
        prefill: {
          // You might want to prefill name/email/contact here if you have user data
          // name: "John Doe",
          // email: "john.doe@example.com",
          // contact: "9999999999",
        },
        theme: {
          color: '#3399CC', // You can use your brand blue here
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

  // --- Conditional Rendering Logic ---
  if (!isLoggedIn) {
    return (
      <Link href="/login" // Or your register page, e.g., /register
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2 text-center"
      >
        Login / Register to Proceed
      </Link>
    );
  }

  // If logged in, render the Razorpay button
  return (
    <button
      onClick={displayRazorpay}
      disabled={loading || amount <= 0}
      // Adjusted disabled styling: bg-gray-400 for disabled, green for active hover
      className="bg-gray-900 text-white px-4 py-2 rounded ml-2
                 hover:bg-green-600
                 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : `Pay with Razorpay (₹${amount.toFixed(2)})`}
    </button>
  );
};

export default RazorpayButton;