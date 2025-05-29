// components/RazorpayButton.jsx
'use client';

import { loadRazorpayScript } from '@/lib/utils';
import { useState } from 'react';
import { useCart } from '@/app/context/cart-context'; // Assuming you want to clear cart after successful payment

const RazorpayButton = ({ amount, currency, userId, cartItems }) => {
  const [loading, setLoading] = useState(false);
  const { clearCart } = useCart(); // Get clearCart from context

  const displayRazorpay = async () => {
    setLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order on your backend
      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Razorpay expects amount in paisa
          currency,
          userId,
          cartItems: cartItems.map(item => ({ // Format cart items for the database
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.images?.[0] || null, // Ensure image is included or null
          })),
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create Razorpay order');
      }

      const orderData = await orderResponse.json();
      console.log('Razorpay Order Created:', orderData); // Debugging

      // 2. Configure Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC for client-side access
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your E-commerce Store', // Your business name
        description: 'Payment for your order',
        order_id: orderData.id, // This is the Razorpay order ID
        handler: async function (response) {
          // 3. Verify Payment on your backend
          console.log('Razorpay payment response:', response); // Debugging

          const verifyResponse = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: userId, // Pass userId for database update security
            }),
          });

          if (verifyResponse.ok) {
            alert('Payment Successful!');
            clearCart(); // Clear the cart after successful payment
            // Optionally, redirect to a success page
            // router.push('/order-success');
          } else {
            const errorVerifyData = await verifyResponse.json();
            alert(`Payment Verification Failed: ${errorVerifyData.error}`);
            console.error('Payment Verification Error:', errorVerifyData); // Debugging
          }
        },
        prefill: {
          // You can prefill customer details if available
          // name: 'John Doe',
          // email: 'john.doe@example.com',
          // contact: '9999999999',
        },
        notes: {
          address: 'Your Shop Address',
        },
        theme: {
          color: '#3399CC',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Error during Razorpay process:', error); // Debugging
      alert(`Payment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={displayRazorpay}
      disabled={loading || amount <= 0} // Disable if loading or amount is zero
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : `Pay with Razorpay (₹${amount.toFixed(2)})`}
    </button>
  );
};

export default RazorpayButton;