'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useCart } from '../../context/cart-context';
import RazorpayButton from '@/app/main/components/RazorpayButton';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, MapPin, ChevronDown, ChevronUp, UserIcon } from 'lucide-react';
import CheckoutForm from '../components/CheckoutForm';

const CartPage = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // Add user details state
  const supabase = createClientComponentClient();

  // Fetch user details from users table
  const fetchUserDetails = async (userId) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user details:', error);
        return;
      }

      if (data) {
        setUserDetails(data);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch user addresses from Supabase
  const fetchAddresses = async (userId) => {
    if (!userId) return;
    
    setLoadingAddresses(true);
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAddresses(data || []);
      
      // Auto-select the first address if available
      if (data && data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    const getUserFromCookie = () => {
      setLoadingUser(true);
      
      // Get userId from cookie (your custom auth system)
      const userIdCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userId='));
      
      if (userIdCookie) {
        const userId = userIdCookie.split('=')[1];
        setUserId(userId);
        fetchAddresses(userId); // Fetch addresses when user is found
        fetchUserDetails(userId); // Fetch user details when user is found
        console.log('Found userId in cookie:', userId);
      } else {
        setUserId(null);
        console.log('No userId cookie found');
      }
      
      setLoadingUser(false);
    };
    
    getUserFromCookie();
  }, []);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressList(false);
  };

  const handleNewAddressSubmit = async (formData) => {
    try {
      // Save address to database
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: userId,
          address_line: formData.address_line,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country || 'India'
        })
        .select()
        .single();

      if (error) throw error;

      // Add to addresses list and select it
      setAddresses(prev => [data, ...prev]);
      setSelectedAddress(data);
      setShowAddressForm(false);
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    }
  };

  // Get full name for display
  const getFullName = () => {
    if (!userDetails) return '';
    const fullName = `${userDetails.first_name || ''} ${userDetails.last_name || ''}`.trim();
    return fullName || 'User';
  };

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
        <Link href="/main/shop">
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
          
          <div className="mt-6">
            {loadingUser ? (
              <p className="text-center text-gray-600">Loading user details...</p>
            ) : userId ? (
              <>
                {/* User Name Display */}
                {userDetails && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Ordering for: {getFullName()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Address Selection Section */}
                {!showAddressForm && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                      >
                        + Add New
                      </button>
                    </div>

                    {loadingAddresses ? (
                      <div className="text-center text-gray-600 py-4">Loading addresses...</div>
                    ) : addresses.length === 0 ? (
                      // No addresses - show add address prompt
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No saved addresses</h4>
                        <p className="text-gray-500 mb-4">Add your delivery address to continue</p>
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                        >
                          Add Address
                        </button>
                      </div>
                    ) : (
                      // Show selected address with dropdown
                      <div className="space-y-3">
                        {/* Selected Address Display */}
                        <div 
                          className="border-2 border-gray-900 rounded-lg p-4 cursor-pointer bg-gray-50"
                          onClick={() => setShowAddressList(!showAddressList)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 font-medium">
                                {selectedAddress?.address_line}
                              </p>
                              <p className="text-sm text-gray-700">
                                {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.zip}
                              </p>
                              <p className="text-sm text-gray-600">
                                {selectedAddress?.country}
                              </p>
                            </div>
                            {showAddressList ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>

                        {/* Address List (Dropdown) */}
                        {showAddressList && addresses.length > 1 && (
                          <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                            {addresses
                              .filter(addr => addr.id !== selectedAddress?.id)
                              .map((address) => (
                                <div
                                  key={address.id}
                                  className="p-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b last:border-b-0"
                                  onClick={() => handleAddressSelect(address)}
                                >
                                  <p className="text-sm text-gray-700 font-medium">
                                    {address.address_line}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    {address.city}, {address.state} - {address.zip}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {address.country}
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Show address form or payment button */}
                {showAddressForm ? (
                  <CheckoutForm 
                    onSubmit={handleNewAddressSubmit}
                    onCancel={() => setShowAddressForm(false)}
                  />
                ) : selectedAddress ? (
                  <RazorpayButton
                    amount={grandTotal}
                    currency={currency}
                    userId={userId}
                    cartItems={cartItems}
                    selectedAddress={selectedAddress} // Pass selected address
                  />
                ) : (
                  <p className="text-center text-sm text-gray-600">Please select a delivery address to proceed.</p>
                )}
              </>
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
