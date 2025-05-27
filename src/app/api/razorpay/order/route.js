// app/api/razorpay/order/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay instance with your API keys
const razorpay = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
     try {
          const { amount, currency, receipt } = await request.json();

          if (!amount || !currency || !receipt) {
               return NextResponse.json(
                    { message: 'Amount, currency, and receipt are required.' },
                    { status: 400 }
               );
          }

          const options = {
               amount: amount * 100, // Razorpay expects amount in smallest currency unit (e.g., paisa for INR)
               currency,
               receipt,
               payment_capture: 1, // Auto capture payment
          };

          const order = await razorpay.orders.create(options);

          return NextResponse.json(order, { status: 200 });
     } catch (error) {
          console.error('Error creating Razorpay order:', error);
          return NextResponse.json(
               { message: 'Failed to create Razorpay order.', error: error.message },
               { status: 500 }
          );
     }
}
