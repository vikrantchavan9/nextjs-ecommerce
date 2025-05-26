'use client';

import { useCart } from '../app/context/cart-context';
import { useState, useEffect } from 'react'; // Import useState and useEffect

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility

  const handleAddToCart = () => {
    addToCart(product);
    console.log("Product added:", product);
    setShowAlert(true); // Show the alert
  };

  // Effect to hide the alert after a few seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [showAlert]);

  return (
    <div>
      <button
        className='mt-8 px-6 py-2 bg-black text-white rounded hover:bg-slate-800 transition'
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>

      {/* Custom Modern Alert */}
      {showAlert && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Added to cart successfully!</span>
        </div>
      )}

      {/* Basic Tailwind CSS for the fade-in-up animation (add to your global CSS or a dedicated CSS file) */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}