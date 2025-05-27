// components/RazorpayButton.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

export default function RazorpayButton({ amount, currency, cartItems, orderIdPrefix = 'order_receipt_' }) {
  const [loading, setLoading] = useState(true); // Indicates if initial setup (SDK load) is complete
  const [sdkLoaded, setSdkLoaded] = useState(false); // New state to track if Razorpay SDK is successfully loaded
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', 'pending'
  const [message, setMessage] = useState('');
  const router = useRouter(); // Initialize router

  // Dynamically load Razorpay SDK script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      setSdkLoaded(true); // SDK is loaded
      setLoading(false); // Initial setup complete
    };
    script.onerror = () => {
      setMessage('Failed to load Razorpay SDK. Please check your internet connection or try again.');
      setLoading(false); // Initial setup complete, but with error
      setSdkLoaded(false); // SDK not loaded
    };
    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  const handlePayment = async () => {
    // Ensure Razorpay object is available before proceeding
    if (!window.Razorpay) {
      setMessage('Razorpay SDK not loaded. Please wait or refresh the page.');
      setPaymentStatus('failed');
      console.error('window.Razorpay is not available.');
      return;
    }

    setPaymentStatus('pending');
    setMessage('Initiating payment...');

    try {
      // 1. Create Order on your backend
      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          receipt: orderIdPrefix + Date.now(), // Unique receipt ID
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        setMessage(orderData.message || 'Failed to create order.');
        setPaymentStatus('failed');
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC for client-side keys
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your Store Name', // Replace with your store name
        description: 'Product Purchase', // Customize description
        order_id: orderData.id, // Order ID from your backend
        handler: async function (response) {
          // This handler is called when payment is successful or failed in Razorpay popup
          setMessage('Verifying payment...');
          setPaymentStatus('pending');

          try {
            // 3. Verify Payment on your backend AND save order details
            const verifyResponse = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response, // Contains razorpay_payment_id, razorpay_order_id, razorpay_signature
                cartItems: cartItems, // Pass cart items to save to DB
                totalAmount: amount // Pass total amount to save to DB
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              setPaymentStatus('success');
              setMessage(verifyData.message || 'Payment successful!');
              // Redirect user to a success page or their orders page
              router.push('/orders?status=success&orderId=' + response.razorpay_order_id);
            } else {
              setPaymentStatus('failed');
              setMessage(verifyData.message || 'Payment verification failed.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus('failed');
            setMessage('Payment verification failed due to network error.');
          }
        },
        prefill: {
          // Optional: Pre-fill user details (replace with actual user data if available)
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Customer Address Details', // Optional notes for Razorpay dashboard
        },
        theme: {
          color: '#3399CC', // Customize checkout theme color
        },
      };

      const rzp1 = new window.Razorpay(options); // This line requires window.Razorpay to be defined

      rzp1.on('payment.failed', function (response) {
        setPaymentStatus('failed');
        setMessage(
          response.error.description || 'Payment failed. Please try again.'
        );
        console.error('Razorpay payment failed:', response.error);
        // Optionally redirect to a failure page
        router.push('/orders?status=failed');
      });

      rzp1.open(); // Open the Razorpay checkout form
    } catch (error) {
      console.error('Error during payment process:', error);
      setPaymentStatus('failed');
      setMessage('An error occurred during payment initiation.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <button
        onClick={handlePayment}
        // Button is disabled if SDK is not loaded, or if another payment is pending
        disabled={!sdkLoaded || paymentStatus === 'pending'}
        className={`py-3 px-8 rounded-md text-lg font-semibold text-white transition-all duration-300 ease-in-out
          ${!sdkLoaded || paymentStatus === 'pending'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }
          shadow-md hover:shadow-lg`}
      >
        {!sdkLoaded ? 'Loading Payment...' : paymentStatus === 'pending' ? 'Processing Payment...' : `Pay ${currency} ${amount}`}
      </button>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-center w-full max-w-sm
          ${paymentStatus === 'success' ? 'bg-green-100 text-green-700' :
            paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'}
          `}
        >
          {message}
        </div>
      )}
    </div>
  );
}
