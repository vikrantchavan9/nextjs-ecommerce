// app/api/razorpay/order/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req) {
     try {
          const { amount, currency } = await req.json();

          if (!amount || !currency) {
               return NextResponse.json({ error: 'Amount and currency are required' }, { status: 400 });
          }

          const razorpay = new Razorpay({
               key_id: process.env.RAZORPAY_KEY_ID,
               key_secret: process.env.RAZORPAY_KEY_SECRET,
          });

          const options = {
               amount: Math.round(amount * 100), // Amount in the smallest currency unit (e.g., paise for INR)
               currency: currency,
               receipt: `receipt_order_${new Date().getTime()}`, // Unique receipt ID
          };

          const order = await razorpay.orders.create(options);

          if (!order) {
               return NextResponse.json({ error: 'Razorpay order creation failed' }, { status: 500 });
          }

          return NextResponse.json(order, { status: 200 });
     } catch (error) {
          console.error('Razorpay order API error:', error);
          return NextResponse.json(
               { error: 'Internal Server Error', details: error.message },
               { status: 500 }
          );
     }
}