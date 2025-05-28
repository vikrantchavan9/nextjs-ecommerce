// components/RazorpayButton.jsx
'use client';

import { useState } from 'react';
import { useCart } from '../app/context/cart-context'; // Adjust path as needed

const RazorpayButton = ({ amount, currency, cartItems, userDetails }) => {
  const [loading, setLoading] = useState(false);
  const { clearCart } = useCart(); // Assuming you have a clearCart function in your context

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    // 1. Create Order on your backend
    let order;
    try {
      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
      order = await orderResponse.json();
    } catch (error) {
      console.error('Order creation error:', error);
      alert(`Error: ${error.message}`);
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount, // Amount is in currency subunits. Default currency is INR.
      currency: order.currency,
      name: 'Your E-commerce Store', //
      description: 'Cart Payment',
      image: '/your-logo.png', // Optional: Add your logo URL
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        // 2. Verify Payment on your backend
        try {
          const verificationResponse = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              totalAmount: amount, // Original grand total from cart
              currency: currency,
              cartItems: cartItems,
            }),
          });

          const verificationData = await verificationResponse.json();

          if (verificationResponse.ok && verificationData.success) {
            alert('Payment successful! Order placed.');
            // TODO: Redirect to an order confirmation page
            // router.push(`/order-confirmation?orderId=${verificationData.orderId}`);
            clearCart(); // Clear the cart after successful payment
          } else {
            alert(verificationData.error || 'Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('Verification error:', error);
          alert('Payment verification failed after Razorpay success. Please contact support.');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        // Optional: Prefill user details if available
        name: userDetails?.name || '',
        email: userDetails?.email || '',
        contact: userDetails?.phone || '',
      },
      notes: {
        address: userDetails?.address || 'No address provided',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      console.error('Razorpay payment failed:', response.error);
      alert(
        `Payment Failed: ${response.error.description} (Reason: ${response.error.reason}, Step: ${response.error.step})`
      );
      setLoading(false);
    });
    paymentObject.open();
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 disabled:bg-gray-400 w-full mt-4"
    >
      {loading ? 'Processing...' : `Pay ₹${amount.toFixed(2)} with Razorpay`}
    </button>
  );
};

export default RazorpayButton;