'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();

  const handleViewOrders = () => {
    router.push('/main/orders');
  };

  const handleGoHome = () => {
    router.push('/main/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl text-center max-w-md w-full animate-fade-in transition-transform duration-500 transform hover:scale-[1.01]">
        
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle 
            className="w-20 h-20 text-green-500 animate-scale-in" 
            strokeWidth={1.5} 
          />
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mt-4 animate-slide-up">
          Payment Successful!
        </h1>
        <p className="text-sm md:text-md text-gray-600 mt-2 animate-slide-up animation-delay-100">
          Thank you for your purchase. We've sent a confirmation to your email.
        </p>

        <div className="mt-8 space-y-6 sm:space-x-4 sm:space-y-0 flex flex-col sm:flex-row justify-center">
          <button
            onClick={handleViewOrders}
            className="text-sm bg-gray-800 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-200"
          >
            View Orders
          </button>
          <button
            onClick={handleGoHome}
            className="text-sm bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:bg-gray-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Redirect to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
