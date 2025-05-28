// app/api/order/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import shortid from 'shortid';
import { supabase } from '@/lib/supabase'; // Import your server-side Supabase client

const razorpay = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
     if (req.method !== 'POST') {
          return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
     }

     try {
          const { amount, currency = 'INR', cartItems } = await req.json();

          // 1. Authenticate User on Server-Side
          const { data: { user }, error: authError } = await supabase.auth.getUser();

          if (authError || !user) {
               console.error('Authentication Error:', authError?.message);
               return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
          }

          if (!amount || amount <= 0) {
               return NextResponse.json({ message: 'Amount is required and must be positive' }, { status: 400 });
          }

          if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
               return NextResponse.json({ message: 'Cart items are required' }, { status: 400 });
          }

          // Razorpay amount is in smallest currency unit (e.g., paise for INR)
          const razorpayAmount = Math.round(amount * 100); // Ensure integer for Razorpay

          const options = {
               amount: razorpayAmount,
               currency,
               receipt: shortid.generate(), // Unique receipt for your internal tracking
               notes: {
                    userId: user.id, // Associate order with user
                    // You might want to save a summary of cart items here if it's small,
                    // otherwise rely on the 'items' column in orders table
               },
               payment_capture: 1, // Auto capture payment
          };

          const order = await razorpay.orders.create(options);

          return NextResponse.json({
               orderId: order.id,
               currency: order.currency,
               amount: order.amount,
               receipt: order.receipt,
          }, { status: 200 });

     } catch (error) {
          console.error('Error creating Razorpay order:', error);
          return NextResponse.json({ message: 'Failed to create order', error: error.message }, { status: 500 });
     }
}