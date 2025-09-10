// components/ProductImageSlider.jsx
'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

export default function ProductImageSlider({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (!images.length) return <p className="text-gray-500 p-4">No images available</p>;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Main Image Viewer (Smooth & Sleek) */}
      <div
        {...swipeHandlers}
        className="relative w-full lg:w-lg lg:ml-20 overflow-hidden aspect-square rounded-xl shadow-2xl group cursor-grab active:cursor-grabbing"
      >
        {/* Image Container with Smooth Transition */}
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                // Enforce cover and rounded corners for a modern look
                className="w-full h-full object-cover" 
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Hidden until hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm text-gray-800 rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm text-gray-800 rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>
          </>
        )}
      </div>

      {/* 2. Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex justify-center gap-3 overflow-x-auto p-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`View image ${index + 1}`}
              className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-800 ${
                index === currentIndex
                  ? 'border-gray-900 shadow-md scale-105' // Active thumbnail style
                  : 'border-gray-200 hover:border-gray-400' // Inactive thumbnail style
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}