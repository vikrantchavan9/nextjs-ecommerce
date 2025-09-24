// app/api/razorpay/verify/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Initialize Razorpay client
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
               userId,
          } = await req.json();

          console.log('=== PAYMENT VERIFICATION API CALLED ===');
          console.log('Verification data:', { razorpay_payment_id, razorpay_order_id, userId });

          // Validate input
          if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !userId) {
               console.error('Missing payment verification data');
               return NextResponse.json({ error: 'Missing payment verification data.' }, { status: 400 });
          }

          // --- FIXED: Use Custom Cookie Authentication (same as order route) ---
          const supabase = createRouteHandlerClient({ cookies });

          // Get userId from cookies instead of Supabase auth
          const cookieStore = cookies();
          const userIdCookie = cookieStore.get('userId');

          console.log('Cookie check - userIdCookie:', userIdCookie);

          if (!userIdCookie) {
               console.error('Authentication Error: No userId cookie found');
               return NextResponse.json({ error: 'Unauthorized or invalid user ID for verification.' }, { status: 401 });
          }

          const cookieUserId = userIdCookie.value;
          console.log('Verify: Found userId in cookie:', cookieUserId);
          console.log('Verify: userId from request:', userId);

          // Check if the userId from cookie matches the one sent in request
          if (cookieUserId !== userId) {
               console.error('Authentication Error: Cookie userId does not match request userId');
               return NextResponse.json({ error: 'Unauthorized or invalid user ID for verification.' }, { status: 401 });
          }

          // Validate that this user exists in YOUR custom users table
          console.log('Validating user in custom users table for verification...');
          const { data: user, error: userError } = await supabase
               .from('users')  // YOUR custom users table
               .select('id, email, role')
               .eq('id', userId)
               .single();

          if (userError || !user) {
               console.error('Authentication Error: User not found in custom users table:', userError);
               return NextResponse.json({ error: 'Unauthorized or invalid user ID for verification.' }, { status: 401 });
          }

          console.log('Verify: User validated from custom users table:', user);
          // --- End FIXED Security Check ---

          // 1. Verify the payment signature
          console.log('=== VERIFYING PAYMENT SIGNATURE ===');
          const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
          shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
          const digest = shasum.digest('hex');

          console.log('Generated digest:', digest);
          console.log('Received signature:', razorpay_signature);

          if (digest !== razorpay_signature) {
               console.error('Signature mismatch: Invalid payment signature.');
               return NextResponse.json({ error: 'Invalid payment signature.' }, { status: 400 });
          }

          console.log('Payment Signature Verified Successfully.');

          // 2. Update the order in Supabase
          console.log('=== UPDATING ORDER STATUS ===');
          const { data, error: dbError } = await supabase
               .from('orders')
               .update({
                    status: 'completed',
                    payment_id: razorpay_payment_id,
                    razorpay_signature: razorpay_signature,
                    updated_at: new Date().toISOString(),
               })
               .eq('razorpay_order_id', razorpay_order_id)
               .eq('user_id', userId)
               .select();

          if (dbError) {
               console.error('Error updating order status in Supabase:', dbError);
               return NextResponse.json({ error: 'Failed to update order status in database.' }, { status: 500 });
          }

          console.log('SUCCESS: Order status updated in Supabase:', data);

          return NextResponse.json({
               message: 'Payment successful and order updated.',
               order: data
          });

     } catch (error) {
          console.error('=== VERIFICATION ERROR ===');
          console.error('Error during payment verification:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
