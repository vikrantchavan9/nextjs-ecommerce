import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL,
     process.env.SUPABASE_SERVICE_ROLE_KEY // use service key for insert ops
);

export async function POST(req) {
     const body = await req.json();
     const {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          cartItems,
          totalAmount,
     } = body;

     const sign = razorpay_order_id + '|' + razorpay_payment_id;
     const expectedSignature = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(sign.toString())
          .digest('hex');

     const isAuthentic = expectedSignature === razorpay_signature;

     if (!isAuthentic) {
          return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
     }

     const { data: { user } } = await supabase.auth.getUser();

     const { data, error } = await supabase.from('orders').insert([
          {
               user_id: user?.id || null,
               total_amount: totalAmount,
               currency: 'INR',
               status: 'paid',
               payment_id: razorpay_payment_id,
               razorpay_order_id,
               razorpay_signature,
               items: cartItems,
          },
     ]);

     if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
     }

     return NextResponse.json({ success: true });
}
