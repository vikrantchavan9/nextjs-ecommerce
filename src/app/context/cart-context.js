'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
     const [cartItems, setCartItems] = useState([]);

     // Load cart from localStorage when component mounts
     useEffect(() => {
          try {
               const storedCart = localStorage.getItem('cart');
               if (storedCart) {
                    setCartItems(JSON.parse(storedCart));
               }
          } catch (err) {
               console.error('Failed to load cart from localStorage', err);
          }
     }, []);

     // Save to localStorage whenever cartItems changes
     useEffect(() => {
          try {
               localStorage.setItem('cart', JSON.stringify(cartItems));
               console.log('Cart updated:', cartItems);
          } catch (err) {
               console.error('Failed to save cart to localStorage', err);
          }
     }, [cartItems]);

     // Add item to cart (or increase quantity if already added)
     const addToCart = (product) => {
          setCartItems((prev) => {
               const existingProduct = prev.find((item) => item.id === product.id);

               if (existingProduct) {
                    return prev.map((item) =>
                         item.id === product.id
                              ? { ...item, quantity: item.quantity + 1 }
                              : item
                    );
               } else {
                    return [...prev, { ...product, quantity: 1, price: Number(product.price) }];
               }
          });
     };


     // New function: Completely remove a product from the cart
     const removeFromCart = (id) => {
          setCartItems((prev) => prev.filter((item) => item.id !== id));
     };

     // New function: Decrease quantity or remove if quantity becomes zero
     const decreaseQuantity = (id) => {
          setCartItems((prev) =>
               prev
                    .map((item) =>
                         item.id === id
                              ? { ...item, quantity: item.quantity - 1 }
                              : item
                    )
                    .filter((item) => item.quantity > 0)
          );
     };


     const grandTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

     const productPrice = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
     );

     const increaseQuantity = (id) => {
          setCartItems((prev) =>
               prev.map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
               )
          );
     };


     return (
          <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
               {children}
          </CartContext.Provider>
     );
};

export const useCart = () => useContext(CartContext);
