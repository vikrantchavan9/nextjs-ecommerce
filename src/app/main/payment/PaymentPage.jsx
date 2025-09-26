'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);

    // 1. Create Razorpay order via API
    const res = await fetch('/api/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 500, // INR 500
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      })
    });

    const order = await res.json();
    if (!order || !order.id) {
      alert('Failed to create Razorpay order');
      setLoading(false);
      return;
    }

    // 2. Open Razorpay payment UI
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Public key
      amount: order.amount,
      currency: order.currency,
      name: 'My Store',
      description: 'Thank you for your purchase',
      order_id: order.id,
      handler: async function (response) {
        // 3. Verify payment
        const verifyRes = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        });

        const verify = await verifyRes.json();
        if (verify.success) {
          alert('Payment successful!');
          router.push('/success');
        } else {
          alert('Payment verification failed.');
          router.push('/failure');
        }
      },
      prefill: {
        name: 'Vikrant Chavan',
        email: 'vikrant@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#000000'
      }
    };

    const razor = new window.Razorpay(options);
    razor.open();
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        {loading ? 'Processing...' : 'Pay ₹500'}
      </button>
    </div>
  );
}
