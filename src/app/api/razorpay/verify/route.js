// app/api/razorpay/verify/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import crypto from 'crypto';

export async function POST(request) {
     try {
          const body = await request.json();

          const {
               razorpay_payment_id,
               razorpay_order_id,
               razorpay_signature,
               items = [],
               total_amount,
               currency = 'INR',
               user_id = null
          } = body;

          if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
               return NextResponse.json({ success: false, message: 'Missing payment details' }, { status: 400 });
          }

          // Verify the signature
          const generatedSignature = crypto
               .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
               .update(`${razorpay_order_id}|${razorpay_payment_id}`)
               .digest('hex');

          if (generatedSignature !== razorpay_signature) {
               return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
          }

          // Insert order into Supabase
          const { data, error } = await supabase.from('orders').insert([
               {
                    user_id,
                    total_amount,
                    currency,
                    status: 'paid',
                    payment_id: razorpay_payment_id,
                    razorpay_order_id,
                    razorpay_signature,
                    items,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
               }
          ]);

          if (error) {
               console.error('Error inserting order:', error);
               return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
          }

          return NextResponse.json({ success: true, message: 'Payment verified and order saved', data });
     } catch (err) {
          console.error('Error verifying payment:', err);
          return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
     }
}
