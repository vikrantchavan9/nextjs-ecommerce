// --- RazorpayButton.jsx (Client Component)
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RazorpayButton({ amount, currency = 'INR', cartItems, orderIdPrefix = 'order_receipt_' }) {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setSdkLoaded(true);
    script.onerror = () => setMessage('Failed to load Razorpay SDK.');
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const handlePayment = async () => {
    if (!window.Razorpay || !sdkLoaded) {
      setMessage('Razorpay SDK not loaded yet.');
      return;
    }

    try {
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          receipt: orderIdPrefix + Date.now(),
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Order creation failed');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your Store',
        description: 'Order Payment',
        order_id: orderData.id,
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                cartItems,
                totalAmount: parseFloat(amount),
              }),
            });
            const data = await verifyRes.json();
            if (verifyRes.ok) {
              router.push('/orders?status=success&orderId=' + response.razorpay_order_id);
            } else {
              throw new Error(data.message);
            }
          } catch (err) {
            console.error('Verification failed:', err);
            setMessage('Payment verification failed.');
          }
        },
        theme: { color: '#3399CC' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        router.push('/orders?status=failed');
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Payment initiation failed');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button onClick={handlePayment} disabled={!sdkLoaded} className="bg-blue-600 text-white px-4 py-2 rounded-md">
        Pay ₹{amount}
      </button>
      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
}
