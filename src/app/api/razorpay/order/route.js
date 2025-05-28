// app/api/razorpay/verify/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
     try {
          const body = await request.json();
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

          if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
               return NextResponse.json(
                    { message: 'Missing required payment verification fields.' },
                    { status: 400 }
               );
          }

          const generated_signature = crypto
               .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
               .update(`${razorpay_order_id}|${razorpay_payment_id}`)
               .digest('hex');

          const isValid = generated_signature === razorpay_signature;

          if (isValid) {
               // Optionally: log, save to DB, etc.
               return NextResponse.json({ verified: true }, { status: 200 });
          } else {
               return NextResponse.json({ verified: false, message: 'Invalid signature.' }, { status: 400 });
          }
     } catch (error) {
          console.error('Payment verification failed:', error);
          return NextResponse.json(
               { message: 'Internal server error.', error: error.message },
               { status: 500 }
          );
     }
}
