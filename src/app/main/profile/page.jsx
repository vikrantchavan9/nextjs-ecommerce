'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  ShoppingBagIcon,
  UserIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

export default function ProfileOverview() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' }); // Added missing state

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);

      // ✅ Get userId from cookie
      const userIdCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userId='));

      if (!userIdCookie) {
        setMessage({ type: 'error', text: 'Please log in to view your info.' });
        setLoading(false);
        return;
      }

      const userId = userIdCookie.split('=')[1];

      try {
        // ✅ Fetch user details from custom users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, first_name, last_name')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error(userError);
          setMessage({ type: 'error', text: 'Failed to load user data.' });
          setLoading(false);
          return;
        }
        setUser(userData);

        // ✅ Fetch orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error(ordersError);
          setMessage({ type: 'error', text: 'Failed to load orders.' });
          setLoading(false);
          return;
        }

        // Stats
        const totalOrders = orders?.length || 0;
        const pendingDeliveries = orders?.filter((o) =>
          ['Pending', 'In Transit'].includes(o.status)
        ).length || 0;

        setStats([
          {
            title: 'Total Orders',
            value: totalOrders,
            icon: ShoppingBagIcon,
            color: 'bg-blue-50 text-blue-600',
          },
          {
            title: 'Pending Deliveries',
            value: pendingDeliveries,
            icon: TruckIcon,
            color: 'bg-yellow-50 text-yellow-600',
          },
        ]);

        // ✅ Process recent orders 
        const processedOrders = orders?.slice(0, 3).map((order) => {
          // Handle items properly - check if it's an object or number
          let itemCount = 0;
          if (typeof order.items === 'number') {
            itemCount = order.items;
          } else if (Array.isArray(order.items)) {
            itemCount = order.items.length;
          } else if (order.items && typeof order.items === 'object') {
            // If items is an object, try to get the count from it
            itemCount = Object.keys(order.items).length || 0;
          }

          return {
            id: `#${order.id}`,
            date: new Date(order.created_at).toLocaleDateString(),
            items: itemCount,
            total: order.total_amount
              ? `₹${order.total_amount.toFixed(2)}`
              : '₹0.00',
            status: order.status || 'Unknown',
            statusColor:
              order.status === 'Delivered'
                ? 'bg-green-100 text-green-800'
                : order.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : order.status === 'In Transit'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800',
          };
        }) || [];

        setRecentOrders(processedOrders);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching profile data:', error);
        setMessage({ type: 'error', text: 'Something went wrong.' });
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [supabase, router]);

  const handleRedirect = () => {
    router.push('profile/personal-info');
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading your profile...</p>
      </div>
    );
  }

  // ✅ Show error message if there's an error
  if (message.type === 'error') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      {/* Welcome Section */}
      <div className="bg-gray-900 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.first_name || 'User'}!
        </h1>
        <p className="text-blue-100">
          You have {stats[1]?.value || 0} pending orders.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={`${stat.title}-${index}`} // ✅ Better key
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
       {/* Recent Orders - Fixed Layout */}
<div className="bg-white rounded-lg border border-gray-200">
  <div className="px-6 py-4 border-b border-gray-200">
    <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
  </div>
  <div className="divide-y divide-gray-200">
    {recentOrders.length > 0 ? (
      recentOrders.map((order, index) => (
        <div key={`${order.id}-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
          {/* Mobile-first responsive layout */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            
            {/* Left section - Order info */}
            <div className="flex-1 min-w-0"> {/* min-w-0 prevents overflow */}
              <div className="flex items-center justify-between sm:block">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {order.id}
                </p>
                <span className={`sm:hidden inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.statusColor}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {order.date} • {order.items} items
              </p>
            </div>
            
            {/* Right section - Amount and status */}
            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:space-y-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {order.total}
                </p>
              </div>
              <span className={`hidden sm:inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.statusColor}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="p-6 text-gray-500 text-sm text-center">
        No recent orders found.
      </div>
    )}
  </div>
  <div className="px-6 py-4 border-t border-gray-200">
    <button className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
      View all orders →
    </button>
  </div>
</div>


        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">

            <button
              onClick={handleRedirect}
              className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm font-medium text-gray-900">
                Edit Personal Information
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
