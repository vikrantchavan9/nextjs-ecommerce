// app/api/verify/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
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
          const {
               razorpay_order_id,
               razorpay_payment_id,
               razorpay_signature,
               // You must send these details from the client after successful payment
               cartItems, // The original cart items from the client
               totalAmount, // The total amount from the client
               currency,
          } = await req.json();

          // 1. Server-Side User Authentication (again, for security)
          const { data: { user }, error: authError } = await supabase.auth.getUser();

          if (authError || !user) {
               console.error('Verification Auth Error:', authError?.message);
               return NextResponse.json({ message: 'Authentication required for verification' }, { status: 401 });
          }

          if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !cartItems || !totalAmount) {
               return NextResponse.json({ message: 'Missing payment or cart details for verification' }, { status: 400 });
          }

          // 2. Verify Razorpay Signature
          const body = razorpay_order_id + "|" + razorpay_payment_id;
          const expectedSignature = crypto
               .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
               .update(body)
               .digest('hex');

          const isAuthentic = expectedSignature === razorpay_signature;

          if (!isAuthentic) {
               console.error('Payment verification failed: Signature mismatch');
               return NextResponse.json({ message: 'Payment verification failed: Signature mismatch', success: false }, { status: 400 });
          }

          // 3. (Optional but Recommended) Fetch Payment details from Razorpay API
          //    This adds an extra layer of security and gets definitive status
          let paymentDetails;
          try {
               paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
               if (paymentDetails.status !== 'captured') {
                    console.error(`Payment not captured: ${paymentDetails.status}`);
                    return NextResponse.json({ message: 'Payment not captured', success: false }, { status: 400 });
               }
          } catch (fetchError) {
               console.error('Error fetching payment details from Razorpay:', fetchError);
               return NextResponse.json({ message: 'Failed to fetch payment details from gateway', success: false }, { status: 500 });
          }


          // 4. Payment is genuine. Insert into 'orders' table.
          const { data: orderData, error: dbError } = await supabase
               .from('orders')
               .insert([
                    {
                         user_id: user.id,
                         total_amount: totalAmount, // Use the amount passed from client
                         currency: currency || 'INR', // Default to INR if not provided
                         status: 'completed', // Or 'captured'
                         payment_id: razorpay_payment_id,
                         razorpay_order_id: razorpay_order_id,
                         razorpay_signature: razorpay_signature,
                         items: cartItems, // Store the entire cart items as JSONB
                    },
               ])
               .select(); // Use .select() to return the inserted data

          if (dbError) {
               console.error('Error inserting order into database:', dbError.message);
               return NextResponse.json({ message: 'Failed to save order to database', success: false, error: dbError.message }, { status: 500 });
          }

          console.log('Payment verified and order saved successfully!', orderData);
          return NextResponse.json({ message: 'Payment verified and order saved successfully', success: true, order: orderData[0] }, { status: 200 });

     } catch (error) {
          console.error('Error in payment verification route:', error);
          return NextResponse.json({ message: 'Internal server error during verification', error: error.message }, { status: 500 });
     }
}