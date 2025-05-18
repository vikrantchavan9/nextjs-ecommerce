// components/ProductDetailsClient.jsx
"use client"; // This directive marks it as a client component

import Image from 'next/image';
import { useState } from 'react'; // useState requires a client component

const ProductDetailsClient = ({ product }) => {
  // Initialize mainImage state with the first image from the product data
  const [mainImage, setMainImage] = useState(product.images[0] || '');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="md:w-1/2">
          <div className="relative w-full h-96 mb-4 rounded-lg overflow-hidden shadow-md">
            <Image
              src={mainImage}
              alt={product.name}
              layout="fill"
              objectFit="contain" // Use 'contain' to ensure the full image is visible
              className="bg-gray-100" // A light background for transparent images
            />
          </div>
          <div className="flex gap-2 justify-center flex-wrap"> {/* flex-wrap for smaller screens */}
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`relative w-20 h-20 cursor-pointer border-2 ${
                  mainImage === img ? 'border-blue-500' : 'border-transparent'
                } rounded-md overflow-hidden transition-all duration-200`}
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-4xl font-extrabold text-blue-600 mb-6">${product.price.toFixed(2)}</p>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            {product.description}
          </p>

          <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg">
            Add to Cart
          </button>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-3">Product Information</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Material: 100% Cotton</li>
              <li>Care: Machine Washable</li>
              <li>Available Sizes: S, M, L, XL</li>
              <li>Shipping: 3-5 Business Days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsClient;