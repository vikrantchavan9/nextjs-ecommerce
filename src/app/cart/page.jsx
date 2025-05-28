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

  // You can keep this handleCheckout for other non-payment checkout logic if needed,
  // but the payment initiation will now be handled by RazorpayButton.
  const handleCheckout = () => {
    console.log('Proceeding to checkout with:', cartItems);
    // Any other pre-payment checkout logic can go here
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-black text-2xl font-bold mb-4">Your Cart</h1>
        <p className='text-black'>Your cart is empty.</p>
      </div>
    );
  }

  // Determine the currency. For Razorpay, 'INR' is a common choice.
  // You might want to make this dynamic based on user's region or store settings.
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
            </li>
          );
        })}
      </ul>
      <div className="mt-4 text-right">
        <h3>Grand Total: ₹{grandTotal.toFixed(2)}</h3>
        {/* Replace the old Checkout button with the RazorpayButton */}
        {/* Ensure amount is an integer for Razorpay (e.g., 500 for INR 5.00) */}
<RazorpayButton cartItems={cartItems} totalAmount={grandTotal} />


        {/* You can still have a regular checkout button if Razorpay is optional or for other payment methods */}
        {/* <button
          onClick={handleCheckout}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 ml-2"
        >
          Regular Checkout
        </button> */}
      </div>
    </div>
  );
};

export default CartPage;
