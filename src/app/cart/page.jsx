'use client';

import { useCart } from '../context/cart-context';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { cartItems, removeFromCart, increaseQuantity } = useCart();
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Fetch authenticated user
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  // Calculate grand total
  const grandTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=cart'); // Redirect guests to login
    } else {
      router.push('/payment'); // Redirect logged-in users to payment
    }
  };

  // Empty cart UI
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-black text-2xl font-bold mb-4">Your Cart</h1>
        <p className='text-black'>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="text-black container mx-auto px-3 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <ul>
        {cartItems.map((item) => {
          const totalPrice = Number(item.price) * item.quantity;

          return (
            <li
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-gray-200"
            >
              <div className="flex items-center">
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-24 h-32 object-cover rounded mr-4"
                />
                <div className='p-2'>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-black">₹{totalPrice.toFixed(2)}</p>
                  <p>Quantity</p>
                  <div className='flex my-2'>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <p className='mx-2'>{item.quantity}</p>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>              
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 text-right">
        <h3>Grand Total: ₹{grandTotal.toFixed(2)}</h3>
        <button
          onClick={handleCheckout}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          {user ? 'Proceed to Payment' : 'Login/Register to Checkout'}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
