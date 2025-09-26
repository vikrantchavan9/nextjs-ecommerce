'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const CheckoutForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_line: '', // Fixed to match your addresses schema
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });
  const [userLoading, setUserLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const supabase = createClientComponentClient();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      setUserLoading(true);
      
      const userIdCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userId='));

      if (!userIdCookie) {
        setUserLoading(false);
        return;
      }

      const userIdFromCookie = userIdCookie.split('=')[1];
      setUserId(userIdFromCookie);

      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('first_name, last_name, phone')
          .eq('id', userIdFromCookie)
          .single();

        if (userData && !error) {
          setFormData(prev => ({
            ...prev,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            phone: userData.phone || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserDetails();
  }, [supabase]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Update users table with first_name and last_name
    if (userId) {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone

          })
          .eq('id', userId);

        if (error) {
          console.error('Error updating user details:', error);
          // You can choose to show an alert or continue anyway
          // alert('Failed to update user details, but proceeding with payment...');
        }
      } catch (error) {
        console.error('Error updating user details:', error);
      }
    }

    // Pass data to parent (CartPage)
    onSubmit(formData);
  };

  if (userLoading) {
    return (
      <div className="space-y-4 w-full text-gray-800">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded mt-6 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full text-gray-800">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Details</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50"
        />
      </div>
      
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-gray-50"
      />

      <h2 className="text-lg font-bold text-gray-900 mt-6 mb-4">Shipping Address</h2>
      <textarea
        name="address_line"
        placeholder="Street Address"
        value={formData.address_line}
        onChange={handleChange}
        required
        rows={3}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="zip"
          placeholder="ZIP Code"
          value={formData.zip}
          onChange={handleChange}
          required
          maxLength={6}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="India">India</option>
          <option value="United States">United States</option>
          <option value="Australia">Australia</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </form>
  );
};

export default CheckoutForm;
