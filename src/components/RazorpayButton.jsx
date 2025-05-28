// components/RazorpayButton.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RazorpayButton({ amount = 1000, currency = "INR", cartItems = [], orderIdPrefix = 'order_receipt_' }) {
  const [loading, setLoading] = useState(true);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      setSdkLoaded(true);
      setLoading(false);
    };
    script.onerror = () => {
      setMessage('Failed to load Razorpay SDK.');
      setLoading(false);
      setSdkLoaded(false);
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      setMessage('Razorpay SDK not loaded.');
      setPaymentStatus('failed');
      return;
    }

    setPaymentStatus('pending');
    setMessage('Initiating payment...');

    try {
      const receiptId = orderIdPrefix + Date.now();

      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          receipt: receiptId,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        console.error("Order creation failed:", orderData);
        setMessage(orderData.message || 'Failed to create order.');
        setPaymentStatus('failed');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your Store Name',
        description: 'Product Purchase',
        order_id: orderData.id,
        handler: async function (response) {
          setMessage('Verifying payment...');
          setPaymentStatus('pending');

          try {
            const verifyResponse = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                cartItems: cartItems,
                totalAmount: amount,
                currency: currency
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              setPaymentStatus('success');
              setMessage(verifyData.message || 'Payment successful!');
              router.push('/orders?status=success&orderId=' + response.razorpay_order_id);
            } else {
              setPaymentStatus('failed');
              setMessage(verifyData.message || 'Payment verification failed.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            setPaymentStatus('failed');
            setMessage('Payment verification failed due to network error.');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Customer Address Details',
        },
        theme: {
          color: '#3399CC',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        setPaymentStatus('failed');
        setMessage(response.error.description || 'Payment failed.');
        router.push('/orders?status=failed');
      });
      rzp1.open();
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setMessage('Error initiating payment.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        onClick={handlePayment}
        disabled={!sdkLoaded || paymentStatus === 'pending'}
        className={`py-3 px-8 rounded-md text-lg font-semibold text-white transition-all duration-300
          ${!sdkLoaded || paymentStatus === 'pending'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'}
          shadow-md hover:shadow-lg`}
      >
        {!sdkLoaded
          ? 'Loading Payment...'
          : paymentStatus === 'pending'
          ? 'Processing...'
          : `Pay ${currency} ${amount}`}
      </button>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-center w-full max-w-sm
          ${paymentStatus === 'success' ? 'bg-green-100 text-green-700' :
            paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
