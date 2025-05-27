'use client';
import { useState } from 'react';

export default function CheckoutButton({ amount }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const res = await fetch('/api/razorpay/order', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });

    const { orderId } = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // use NEXT_PUBLIC_ for client
      amount: amount * 100,
      currency: 'INR',
      name: 'eShop Store',
      description: 'Test Transaction',
      order_id: orderId,
      handler: function (response) {
        alert(`Payment successful: ${response.razorpay_payment_id}`);
        // ✅ You can also send confirmation to backend here
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    setLoading(false);
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}
