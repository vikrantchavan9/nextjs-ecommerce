// app/api/razorpay/order/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // For server-side Supabase
import { cookies } from 'next/headers'; // To access cookies for Supabase auth

// Initialize Razorpay client
const razorpay = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
     try {
          const { amount, currency, userId, cartItems } = await req.json();

          // Validate input
          if (!amount || !currency || !userId || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
               return NextResponse.json({ error: 'Invalid input: amount, currency, userId, or cartItems are missing/invalid.' }, { status: 400 });
          }

          // --- Security Check: Verify User ID using Supabase on the server ---
          const supabase = createRouteHandlerClient({ cookies });
          const { data: { user }, error: authError } = await supabase.auth.getUser();

          if (authError || !user || user.id !== userId) {
               console.error('Authentication Error:', authError?.message || 'Unauthorized user ID mismatch.');
               return NextResponse.json({ error: 'Unauthorized or invalid user ID.' }, { status: 401 });
          }
          // --- End Security Check ---

          const options = {
               amount: amount, // amount in the smallest currency unit (e.g., paisa for INR)
               currency: currency,
               receipt: `receipt_order_${Date.now()}`, // Unique receipt ID
               payment_capture: 1, // Auto-capture payment after success
               notes: {
                    userId: userId,
                    // You can add more notes here, like specific product IDs etc.
               },
          };

          console.log('Attempting to create Razorpay order with options:', options); // Debugging

          const order = await razorpay.orders.create(options);
          console.log('Razorpay Order created successfully:', order); // Debugging

          // Optionally, save the initial order details to your database with 'pending' status
          // This is useful for tracking orders even if payment isn't completed immediately.
          const { data, error: dbError } = await supabase
               .from('orders')
               .insert({
                    user_id: userId,
                    total_amount: (amount / 100).toFixed(2), // Convert back to rupees for storage
                    currency: currency,
                    status: 'pending',
                    razorpay_order_id: order.id,
                    items: cartItems, // Store the structured cart items
               })
               .select();

          if (dbError) {
               console.error('Error inserting pending order into Supabase:', dbError);
               // You might want to handle this error more gracefully, but we return the order anyway
               // as Razorpay order creation was successful.
          } else {
               console.log('Pending order inserted into Supabase:', data); // Debugging
          }

          return NextResponse.json(order);

     } catch (error) {
          console.error('Error creating Razorpay order:', error); // Debugging
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}