'use client';

import { useCart } from '../../../context/cart-context';
import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [showAlert, setShowAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState(null);

  const handleAddToCart = () => {
    addToCart(product);
    setAlertProduct(product);
    setShowAlert(true);
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
        setAlertProduct(null);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div className="relative">
      {/* Main Add to Cart Button */}
      <button
        className="w-full mt-6 px-8 py-3 bg-gray-900 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>

      {/* Modern, Sleek Alert */}
      {showAlert && alertProduct && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl backdrop-blur-md bg-white/80 flex items-center space-x-3 transform transition-all duration-300 animate-slide-in-up">
          <CheckCircle className="h-8 w-8 text-green-500 animate-pulse-once" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Success!</h3>
            <p className="text-sm text-gray-600">"{alertProduct.name}" added to cart.</p>
          </div>
        </div>
      )}
      
      {/* Custom Tailwind CSS keyframes for animations */}
      <style jsx>{`
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-once {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-pulse-once {
          animation: pulse-once 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
