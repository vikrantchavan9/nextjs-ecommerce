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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
    trackMouse: true, // allows mouse dragging as well
  });

  if (!images.length) return <p>No images available</p>;

  return (
    <div
      {...swipeHandlers}
      className="relative w-full max-w-xl mx-auto mb-6"
    >
      <img
        src={images[currentIndex]}
        alt={`Product image ${currentIndex + 1}`}
        className="w-full h-96 object-cover rounded-xl shadow"
      />

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600 rounded-full p-2 shadow hover:bg-gray-200"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 rounded-full p-2 shadow hover:bg-gray-200"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
