// app/api/razorpay/verify/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req) {
     const supabase = createRouteHandlerClient({ cookies });

     try {
          const {
               razorpay_order_id,
               razorpay_payment_id,
               razorpay_signature,
               totalAmount, // This is the grandTotal from your cart
               currency,
               cartItems,
          } = await req.json();

          if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !cartItems || !totalAmount || !currency) {
               return NextResponse.json({ error: 'Missing required payment verification data' }, { status: 400 });
          }

          const body = razorpay_order_id + '|' + razorpay_payment_id;

          const expectedSignature = crypto
               .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
               .update(body.toString())
               .digest('hex');

          const isAuthentic = expectedSignature === razorpay_signature;

          if (isAuthentic) {
               // Payment is authentic, now get user and save order to Supabase
               const { data: { user }, error: authError } = await supabase.auth.getUser();

               if (authError || !user) {
                    console.error('Supabase auth error:', authError);
                    return NextResponse.json({ error: 'User not authenticated or session error. Please log in again.' }, { status: 401 });
               }

               // Prepare items for Supabase (ensure it's a valid JSON structure)
               const orderItems = cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: Number(item.price),
                    quantity: item.quantity,
                    image: item.images?.[0] || null, // Storing the first image
               }));


               const { data: orderData, error: dbError } = await supabase
                    .from('orders')
                    .insert([
                         {
                              user_id: user.id,
                              total_amount: parseFloat(totalAmount).toFixed(2),
                              currency: currency,
                              status: 'successful', // Or 'paid', 'completed'
                              payment_id: razorpay_payment_id,
                              razorpay_order_id: razorpay_order_id,
                              razorpay_signature: razorpay_signature,
                              items: orderItems, // Store the structured cart items
                         },
                    ])
                    .select() // Optionally select the inserted data to return or use
                    .single(); // Assuming you expect one row back

               if (dbError) {
                    console.error('Supabase DB error:', dbError);
                    return NextResponse.json({ error: 'Failed to save order to database.', details: dbError.message }, { status: 500 });
               }

               return NextResponse.json({ success: true, message: 'Payment verified and order saved.', orderId: orderData?.id }, { status: 200 });

          } else {
               return NextResponse.json({ success: false, error: 'Invalid payment signature.' }, { status: 400 });
          }
     } catch (error) {
          console.error('Razorpay verification API error:', error);
          return NextResponse.json(
               { success: false, error: 'Internal Server Error', details: error.message },
               { status: 500 }
          );
     }
}