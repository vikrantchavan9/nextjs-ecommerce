'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=orders'); // Redirect guests to login
        return;
      }
      setUser(user);
      
      // Fetch user-specific orders
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error.message);
      } else {
        setOrders(data || []);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p className='text-black'>No orders found.</p>;

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="border-b py-4">
            <p>Order ID: {order.id}</p>
            <p>Total: ₹{order.total_price}</p>
            <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
