'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const RazorpayButton = ({ cartItems, totalAmount }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const res = await loadRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    // 1. Create order from server
    const orderRes = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems, totalAmount }),
    });

    const orderData = await orderRes.json();
    const { order } = orderData;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // public key
      amount: order.amount,
      currency: order.currency,
      name: 'Your Store',
      description: 'Thank you for your order',
      order_id: order.id,
      handler: async (response) => {
        const verifyRes = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            cartItems,
            totalAmount,
          }),
        });

        const verified = await verifyRes.json();
        if (verified.success) {
          alert('Payment successful!');
        } else {
          alert('Payment verification failed!');
        }
      },
      prefill: {
        name: 'Vikrant Chavan',
        email: 'test@example.com',
      },
      theme: {
        color: '#000',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        onClick={handlePayment}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay with Razorpay'}
      </button>
    </>
  );
};

export default RazorpayButton;
