// app/cart/page.jsx
"use client"; // This component needs to be a client component for useState

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Dummy data for the cart. In a real app, this would come from a global state, API, or local storage.
const DUMMY_CART_ITEMS = [
  { id: 'prod1', name: 'Elegant Summer Dress', price: 79.99, imageUrl: '/images/product-placeholder.jpg', quantity: 1 },
  { id: 'prod2', name: 'Kids T-Shirt', price: 15.00, imageUrl: '/images/product-placeholder.jpg', quantity: 2 },
  { id: 'prod3', name: 'Stylish Sneakers', price: 120.00, imageUrl: '/images/product-placeholder.jpg', quantity: 1 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(DUMMY_CART_ITEMS); // Using dummy data for now

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Optional: You might want to load/save cart from/to localStorage in a real app
  // useEffect(() => {
  //   const savedCart = localStorage.getItem('myStoreCart');
  //   if (savedCart) {
  //     setCartItems(JSON.parse(savedCart));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('myStoreCart', JSON.stringify(cartItems));
  // }, [cartItems]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Your cart is empty. <Link href="/products" className="text-blue-600 hover:underline">Start shopping!</Link></p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
                <div className="w-24 h-24 relative flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="flex-grow ml-4">
                  <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <span className="bg-gray-100 text-gray-800 px-4 py-1 border-y border-gray-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300 transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-4 text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-4 border-b pb-3">Order Summary</h2>
            <div className="flex justify-between text-lg mb-2">
              <span>Subtotal:</span>
              <span>${calculateTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg mb-4">
              <span>Shipping:</span>
              <span>$5.00</span> {/* Example fixed shipping */}
            </div>
            <div className="flex justify-between text-2xl font-bold border-t pt-4">
              <span>Total:</span>
              <span>${(calculateTotalPrice() + 5.00).toFixed(2)}</span>
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-md mt-6 text-lg font-semibold hover:bg-green-700 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}