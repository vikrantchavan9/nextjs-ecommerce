// src/app/orders/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClientComponentClient();

   useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      // Get user ID from cookie
      const userIdCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userId='));
        
      if (!userIdCookie) {
        setError('Please log in to view your orders.');
        setLoading(false);
        return;
      }
      
      const userId = userIdCookie.split('=')[1];

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-black">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-black">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-black">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Order ID: {order.razorpay_order_id}</h2>
            <p className="text-gray-700">Total: ₹{parseFloat(order.total_amount).toFixed(2)}</p>
            <p className="text-gray-700">Status: <span className={`font-medium ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</span></p>
            <p className="text-gray-700 text-sm">Date: {new Date(order.created_at).toLocaleDateString()}</p>
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Items:</h3>
              <ul className="list-disc list-inside">
                {order.items && order.items.map((item, index) => (
                  <li key={index} className="text-gray-600 text-sm">
                    {item.name} x {item.quantity} (₹{item.price})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}