// app/cart/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useCart } from '../context/cart-context';
import RazorpayButton from '@/components/RazorpayButton';

const CartPage = () => {
  const { cartItems, removeFromCart, increaseQuantity, clearCart } = useCart();
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    console.log("useEffect started: Attempting to get user session..."); // Log start
    const getUser = async () => {
      setLoadingUser(true);
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Supabase getUser error:", error.message);
        // If there's an error, it might mean the session is expired or invalid
      } else if (user) {
        console.log("Supabase getUser success: User object received:", user); // Log the full user object
        console.log("Supabase getUser success: User ID:", user.id); // Log the ID specifically
        setUserId(user.id);
      } else {
        console.log("Supabase getUser: No user object returned. User is likely not logged in."); // Clear message if no user
      }
      setLoadingUser(false);
      console.log("useEffect finished: loadingUser is now", false); // Log end
    };

    getUser();
  }, []);

  // Calculate grand total of all items in the cart
  const grandTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const currency = 'INR';

  // --- Debugging logs for values passed to RazorpayButton ---
  console.log('CartPage - grandTotal:', grandTotal);
  console.log('CartPage - currency:', currency);
  console.log('CartPage - userId (from state):', userId); // Will be null initially, then updated
  console.log('CartPage - cartItems (length):', cartItems.length);
  if (cartItems.length > 0) {
    console.log('CartPage - cartItems (first item, if any):', cartItems[0]);
  }
  // --- End Debugging logs ---

  // Display message if the cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-black text-2xl font-bold mb-4">Your Cart</h1>
        <p className='text-black'>Your cart is empty.</p>
      </div>
    );
  }

  // Main cart display
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
                {/* Use optional chaining for images array to prevent errors if images is undefined */}
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
        <h3 className="text-xl font-bold mb-4">Grand Total: ₹{grandTotal.toFixed(2)}</h3>

        {/* Conditional rendering for RazorpayButton */}
        {loadingUser ? (
          <p className="text-gray-600">Loading user details...</p>
        ) : userId ? (
          // Render RazorpayButton only if userId is available and not loading
          <RazorpayButton
            amount={grandTotal}
            currency={currency}
            userId={userId}
            cartItems={cartItems} // Pass cart items to the button
          />
        ) : (
          // Display message if user is not logged in
          <p className="text-sm text-gray-600">Please log in to proceed with payment.</p>
        )}
      </div>
    </div>
  );
};

export default CartPage;