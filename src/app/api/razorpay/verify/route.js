// components/RazorpayButton.jsx
"use client";

import React, { useState, useEffect } from 'react';

export default function RazorpayButton({ amount, currency, orderIdPrefix = 'order_receipt_' }) {
     const [loading, setLoading] = useState(true);
     const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', 'pending'
     const [message, setMessage] = useState('');

     // Dynamically load Razorpay SDK script
     useEffect(() => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
               setLoading(false);
          };
          script.onerror = () => {
               setMessage('Failed to load Razorpay SDK. Please try again.');
               setLoading(false);
          };
          document.body.appendChild(script);

          return () => {
               document.body.removeChild(script);
          };
     }, []);

     const handlePayment = async () => {
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
                    name: 'Your Store Name',
                    description: 'Product Purchase',
                    order_id: orderData.id, // Order ID from your backend
                    handler: async function (response) {
                         // This handler is called when payment is successful or failed in Razorpay popup
                         setMessage('Verifying payment...');
                         setPaymentStatus('pending');

                         try {
                              // 3. Verify Payment on your backend
                              const verifyResponse = await fetch('/api/razorpay/verify', {
                                   method: 'POST',
                                   headers: { 'Content-Type': 'application/json' },
                                   body: JSON.stringify(response), // Contains razorpay_payment_id, razorpay_order_id, razorpay_signature
                              });

                              const verifyData = await verifyResponse.json();

                              if (verifyResponse.ok) {
                                   setPaymentStatus('success');
                                   setMessage(verifyData.message || 'Payment successful!');
                                   // Here you would typically redirect the user to a success page
                                   // router.push('/payment-success');
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
                         // Optional: Pre-fill user details
                         name: 'John Doe',
                         email: 'john.doe@example.com',
                         contact: '9999999999',
                    },
                    notes: {
                         address: 'Razorpay Corporate Office',
                    },
                    theme: {
                         color: '#3399CC', // Customize checkout theme color
                    },
               };

               const rzp1 = new window.Razorpay(options);

               rzp1.on('payment.failed', function (response) {
                    setPaymentStatus('failed');
                    setMessage(
                         response.error.description || 'Payment failed. Please try again.'
                    );
                    console.error('Razorpay payment failed:', response.error);
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
                    disabled={loading || paymentStatus === 'pending'}
                    className={`py-3 px-8 rounded-md text-lg font-semibold text-white transition-all duration-300 ease-in-out
          ${loading || paymentStatus === 'pending'
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                         }
          shadow-md hover:shadow-lg`}
               >
                    {loading ? 'Loading Payment...' : paymentStatus === 'pending' ? 'Processing Payment...' : `Pay ${currency} ${amount}`}
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
