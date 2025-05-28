// app/cart/page.jsx
'use client';

import { useCart } from '../context/cart-context';
import RazorpayButton from '@/components/RazorpayButton'; // Import the RazorpayButton component

const CartPage = () => {
  const { cartItems, removeFromCart, increaseQuantity } = useCart();

  // Calculate grand total of all items
  const grandTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-black text-2xl font-bold mb-4">Your Cart</h1>
        <p className='text-black'>Your cart is empty.</p>
      </div>
    );
  }

  // Determine the currency. For Razorpay, 'INR' is a common choice.
  const currency = 'INR';

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
              {/* Add a remove button for each item for full functionality */}
              <div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 text-right">
        <h3 className="font-bold text-xl">Grand Total: ₹{grandTotal.toFixed(2)}</h3>

        {/* Pass cart details to RazorpayButton */}
        <RazorpayButton
          amount={grandTotal}
          currency={currency}
          cartItems={cartItems} // Pass the entire cart items array
        />
      </div>
    </div>
  );
};

export default CartPage;