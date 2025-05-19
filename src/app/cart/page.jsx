// app/cart/page.jsx
'use client';

import { useCart } from '../context/cart-context';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    console.log('Proceeding to checkout with:', cartItems);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-black text-2xl font-bold mb-4">Your Cart</h1>
        <p className='text-black'>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <ul>
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between py-2 border-b border-gray-200"
          >
            <div className="flex items-center">
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="w-20 h-20 object-cover rounded mr-4"
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-right">
        <p className="font-semibold">
          Total: $
          {cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
        </p>
        <button
          onClick={handleCheckout}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
