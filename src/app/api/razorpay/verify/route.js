// app/api/razorpay/verify/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto'; // Node.js built-in module for crypto operations
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Initialize Razorpay client (ensure key_secret is loaded)
const razorpay = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
     try {
          const {
               razorpay_payment_id,
               razorpay_order_id,
               razorpay_signature,
               userId, // Passed from frontend for security check
          } = await req.json();

          // Validate input
          if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !userId) {
               return NextResponse.json({ error: 'Missing payment verification data.' }, { status: 400 });
          }

          // --- Security Check: Verify User ID using Supabase on the server ---
          const supabase = createRouteHandlerClient({ cookies });
          const { data: { user }, error: authError } = await supabase.auth.getUser();

          if (authError || !user || user.id !== userId) {
               console.error('Authentication Error during verification:', authError?.message || 'Unauthorized user ID mismatch.');
               return NextResponse.json({ error: 'Unauthorized or invalid user ID for verification.' }, { status: 401 });
          }
          // --- End Security Check ---

          // 1. Verify the payment signature
          const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
          shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
          const digest = shasum.digest('hex');

          if (digest !== razorpay_signature) {
               console.error('Signature mismatch: Invalid payment signature.'); // Debugging
               return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 });
          }

          console.log('Payment Signature Verified Successfully.'); // Debugging

          // 2. Update the order in Supabase
          const { data, error: dbError } = await supabase
               .from('orders')
               .update({
                    status: 'completed',
                    payment_id: razorpay_payment_id,
                    razorpay_signature: razorpay_signature,
                    updated_at: new Date().toISOString(), // Update timestamp
               })
               .eq('razorpay_order_id', razorpay_order_id)
               .eq('user_id', userId) // Important: ensure order belongs to the user
               .select();

          if (dbError) {
               console.error('Error updating order status in Supabase:', dbError); // Debugging
               return NextResponse.json({ error: 'Failed to update order status in database.' }, { status: 500 });
          }

          if (!data || data.length === 0) {
               console.error('Order not found or not updated for Razorpay Order ID:', razorpay_order_id); // Debugging
               return NextResponse.json({ error: 'Order not found or already processed.' }, { status: 404 });
          }

          console.log('Order status updated in Supabase:', data); // Debugging

          return NextResponse.json({ message: 'Payment successful and order updated.' });

     } catch (error) {
          console.error('Error during payment verification:', error); // Debugging
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}