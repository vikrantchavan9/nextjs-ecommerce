'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useCart } from '../context/cart-context';
import RazorpayButton from '@/components/RazorpayButton';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      setLoadingUser(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
      setLoadingUser(false);
    };
    getUser();
  }, []);

  const grandTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const currency = 'INR';

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white rounded-xl shadow-lg m-4 sm:m-8">
        <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your cart is empty.</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/shop">
          <button className="bg-gray-900 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-800">
            Start Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Cart Items List (Main Content) --- */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const totalPrice = Number(item.price) * item.quantity;
            return (
              <div
                key={item.id}
                className="flex items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative w-28 h-36 md:w-36 md:h-48 flex-shrink-0 mr-4 rounded-lg overflow-hidden">
                  <Image
                    src={item.images?.[0] || 'https://placehold.co/150x200/e2e8f0/64748b?text=No+Image'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 150px, 200px"
                    className="object-cover"
                  />
                </div>
                
                <div className="flex flex-col flex-grow">
                  <h2 className="text-md md:text-lg font-semibold text-gray-800 line-clamp-2">{item.name}</h2>
                  <p className="text-[14px] text-gray-500 mb-2">Color: <span className="text-gray-900 font-medium">{item.color || 'Black'}</span></p>
                  <p className="text-md md:text-lg font-bold text-gray-900">₹{totalPrice.toFixed(2)}</p>

                  <div className="flex items-center space-x-2 mt-4">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold text-gray-800 w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-auto p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                  aria-label="Remove item"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            );
          })}
        </div>

        {/* --- Summary and Checkout (Sticky on large screens) --- */}
        <div className="lg:col-span-1 lg:sticky lg:top-28 self-start bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Order Summary</h2>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm md:text-md text-gray-600">Subtotal ({cartItems.length} items)</p>
            <p className="text-sm md:text-md font-semibold text-gray-900">₹{grandTotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm md:text-md text-gray-600">Shipping</p>
            <p className="text-sm md:text-md font-semibold text-gray-900">Free</p>
          </div>
          <div className="flex justify-between items-center border-t border-dashed border-gray-300 pt-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900">Grand Total</h3>
            <h3 className="text-lg font-bold text-gray-900">₹{grandTotal.toFixed(2)}</h3>
          </div>
          <div className="mt-6 flex flex-col items-center justify-center">
            {loadingUser ? (
              <p className="text-center text-gray-600">Loading user details...</p>
            ) : userId ? (
              <RazorpayButton
                amount={grandTotal}
                currency={currency}
                userId={userId}
                cartItems={cartItems}
              />
            ) : (
              <p className="text-center text-sm text-gray-600">Please log in to proceed with payment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
