'use client';

import { loadRazorpayScript } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const RazorpayButton = ({ amount, currency, userId, cartItems, selectedAddress }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const displayRazorpay = async () => {
    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      // 🔹 Step 1: Create Razorpay order via your API
      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency,
          userId,
          cartItems: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.images?.[0] || null,
          })),
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create Razorpay order');
      }

      const orderData = await orderResponse.json();

      // 🔹 Step 2: Open Razorpay payment widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your E-commerce Store',
        description: 'Payment for your order',
        order_id: orderData.id,
        handler: async function (response) {
          if (!response.razorpay_payment_id || !response.razorpay_signature) {
            alert('Payment failed or was incomplete. Please try again.');
            setLoading(false);
            return;
          }

          // 🔹 Step 3: Verify payment with backend
          const verifyResponse = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: userId,
            }),
          });

          if (verifyResponse.ok) {
            // ✅ Payment successful 
            const { data, error } = await supabase
            .from('orders')
            .update({
              status: 'paid',
              payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            .eq('razorpay_order_id', response.razorpay_order_id) // update the same order
            .select();


            if (error) {
              console.error('Error saving order to DB:', error);
              alert('Payment received but failed to save order. Please contact support.');
            } else {
              console.log('Order saved successfully with address_id:', selectedAddress.id);
              alert('Payment successful! Your order has been placed.');
              router.push('/main/payment-success');
            }
          } else {
            alert('Payment verification failed. Please contact support.');
          }

          setLoading(false);
        },
        prefill: {
          // Since your addresses table doesn't have name/email/phone,
          // you might want to get these from a user profile table or skip prefill
          // name: '', // Not available in addresses schema
          // email: '', // Not available in addresses schema  
          // contact: '', // Not available in addresses schema
        },
        notes: {
          address_id: selectedAddress.id,
          user_id: userId,
          address_line: selectedAddress.address_line,
          city: selectedAddress.city,
          state: selectedAddress.state,
        },
        theme: { color: '#3399CC' },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Error during Razorpay process:', error);
      alert(`Payment failed: ${error.message}`);
      setLoading(false);
    }
  };

  // Show selected address details
  return (
    <div>
      {/* <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Delivering to:</h4>
        <p className="text-sm text-gray-700">
          {selectedAddress.address_line}
        </p>
        <p className="text-sm text-gray-600">
          {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip}
        </p>
        <p className="text-sm text-gray-600">
          {selectedAddress.country}
        </p>
      </div> */}
      
      <button
        onClick={displayRazorpay}
        disabled={loading || amount <= 0 || !selectedAddress}
        className="w-full bg-blue-700 text-white text-sm px-8 py-3 rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay with Razorpay (₹${amount.toFixed(2)})`}
      </button>
    </div>
  );
};

export default RazorpayButton;
