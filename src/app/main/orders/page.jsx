// src/app/orders/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  ShoppingBagIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  CreditCardIcon,
  CalendarIcon,
  ShoppingCartIcon,
  MapPinIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      const userIdCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userId='));
        
      if (!userIdCookie) {
        setError('Please log in to view your orders.');
        setLoading(false);
        return;
      }
      
      const userId = userIdCookie.split('=')[1];

      // 🔹 Updated query to include address information via foreign key
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          addresses (
            address_line,
            city,
            state,
            zip,
            country
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
      } else {
        // ✅ Fix: Ensure items is always an array
        const normalized = data.map(order => ({
          ...order,
          items: Array.isArray(order.items)
            ? order.items
            : typeof order.items === 'string'
              ? JSON.parse(order.items)
              : []
        }));
        setOrders(normalized);
        console.log('Orders with addresses:', normalized); // Debug log
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-amber-600" />;
      case 'processing':
        return <TruckIcon className="h-5 w-5 text-blue-600" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'paid':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'processing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'paid':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  // Loading skeleton component
  const OrderSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded-lg w-32"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-28"></div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{color: '#21323D'}}>Your Orders</h1>
            <p className="text-gray-600">Track and manage your recent purchases</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2" style={{color: '#21323D'}}>Oops! Something went wrong</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              style={{backgroundColor: '#21323D'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2a3f4d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#21323D'}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2" style={{color: '#21323D'}}>No Orders Yet</h1>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <button 
              onClick={() => window.location.href = '/main/shop'}
              className="font-semibold py-3 px-6 rounded-xl transition-all duration-200 inline-flex items-center gap-2 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              style={{backgroundColor: '#21323D'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2a3f4d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#21323D'}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{color: '#21323D'}}>Your Orders</h1>
          <p className="text-gray-600">Track and manage your recent purchases</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCardIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">Order ID</span>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">#{order.razorpay_order_id || order.id}</p>
                <p className="text-2xl font-bold" style={{color: '#21323D'}}>₹{parseFloat(order.total_amount).toFixed(2)}</p>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <CalendarIcon className="h-4 w-4" />
                <span>{new Date(order.created_at).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>

              {/* 🔹 Delivery Address Section */}
              {order.addresses && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <HomeIcon className="h-4 w-4 text-gray-500" />
                    <h4 className="font-semibold text-sm" style={{color: '#21323D'}}>Delivery Address</h4>
                  </div>
                  <div className="text-sm text-gray-700">
                    <p className="font-medium">{order.addresses.address_line}</p>
                    <p>{order.addresses.city}, {order.addresses.state} - {order.addresses.zip}</p>
                    <p className="text-gray-600">{order.addresses.country}</p>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBagIcon className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold text-sm" style={{color: '#21323D'}}>Items Ordered</h3>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar-light">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium truncate">{item.name}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold" style={{color: '#21323D'}}>₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Details Button */}
              <div className="mt-6">
                <button 
                  className="w-full bg-gray-50 hover:text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 text-sm border border-gray-200 hover:border-transparent"
                  style={{color: '#21323D'}}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#21323D';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.color = '#21323D';
                  }}
                >
                  View Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar-light::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb {
          background: #21323D;
          border-radius: 2px;
          opacity: 0.6;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
          background: #21323D;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
