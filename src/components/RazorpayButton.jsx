// components/RazorpayButton.jsx
'use client';

import { loadRazorpayScript } from '@/lib/utils';
import { useState } from 'react';
import { useCart } from '@/app/context/cart-context';
import { useRouter } from 'next/navigation';

const RazorpayButton = ({ amount, currency, userId, cartItems }) => {
  const [loading, setLoading] = useState(false);
  // const { clearCart } = useCart();
  const router = useRouter();

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
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
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

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your E-commerce Store',
        description: 'Payment for your order',
        order_id: orderData.id,
        handler: async function (response) {
          if (!response.razorpay_payment_id || !response.razorpay_signature) {
            alert('Payment failed or was incomplete. Please try again.');
            setLoading(false);
            return;
          }

          // Verify payment
          const verifyResponse = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: userId,
            }),
          });

          if (verifyResponse.ok) {
            // Payment successful
            // clearCart();
            alert('Payment successful!');
            router.push('/payment-success');
          } else {
            // Payment verification failed
            alert('Payment verification failed. Please contact support.');
          }
          
          setLoading(false);
        },
        prefill: {
          // Add user details here if needed
        },
        theme: {
          color: '#3399CC',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
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
      className="bg-blue-700 text-white text-sm px-6 py-2 rounded hover:bg-blue-800 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : `Pay with Razorpay (₹${amount.toFixed(2)})`}
    </button>
  );
};

export default RazorpayButton;
