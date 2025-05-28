// app/order-success/page.jsx
'use client'; // This can be a Client Component

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto px-4 py-12 text-center text-black">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-lg mb-6">Your order has been placed successfully.</p>
      {orderId && (
        <p className="text-md mb-8">
          Your Order ID: <span className="font-semibold">{orderId}</span>
        </p>
      )}
      <Link href="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
        Continue Shopping
      </Link>
    </div>
  );
}