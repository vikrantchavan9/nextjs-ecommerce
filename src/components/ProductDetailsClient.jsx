'use client';

import { useCart } from '../app/context/cart-context';

export default function ProductDetailsClient({ product }) {
  
  const { addToCart } = useCart();

const handleAddToCart = () => {
  addToCart(product);
  console.log("Product added:", product);
};

  return (
    <div>
      <button className='mt-6 px-6 py-3 bg-black text-white rounded hover:bg-slate-800 transition' onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
