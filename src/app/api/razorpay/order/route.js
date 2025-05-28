import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req) {
     const { cartItems, totalAmount } = await req.json();
     console.log("cart items:", cartItems);

     const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
     });

     const options = {
          amount: Number(totalAmount * 100), // amount in paise
          currency: 'INR',
          receipt: `receipt_order_${Math.random() * 10000}`,
     };

     try {
          const order = await razorpay.orders.create(options);
          return NextResponse.json({ success: true, order });
     } catch (err) {
          return NextResponse.json({ success: false, error: err.message }, { status: 500 });
     }
}
