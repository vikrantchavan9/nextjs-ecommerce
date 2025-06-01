// src/app/payment-success/page.jsx
'use client'; // This is a client component

import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function PaymentSuccessPage() {
  const router = useRouter();

  const handleViewOrders = () => {
    // Redirect to your orders page. Make sure you have an /orders route implemented.
    router.push('/orders');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-3xl font-bold mt-4">Payment Successful!</h1>
        <p className="text-gray-700 mt-2">Thank you for your purchase.</p>
        <button
          onClick={handleViewOrders}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          View Your Orders
        </button>
      </div>
    </div>
  );
}