// app/api/razorpay/order/route.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Initialize Razorpay client
const razorpay = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
     try {
          const { amount, currency, userId, cartItems, addressId } = await req.json();

          console.log('=== RAZORPAY ORDER API CALLED ===');
          console.log('Request data:', { amount, currency, userId, cartItems, addressId });

          // Validate input
          if (!amount || !currency || !userId || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
               return NextResponse.json(
                    { error: 'Invalid input: amount, currency, userId, or cartItems are missing/invalid.' },
                    { status: 400 }
               );
          }

          // --- Security Check: Verify User ID using Custom Authentication ---
          const supabase = createRouteHandlerClient({ cookies });

          // Get userId from cookies
          const cookieStore = cookies();
          const userIdCookie = cookieStore.get('userId');

          if (!userIdCookie) {
               return NextResponse.json({ error: 'Unauthorized: No userId cookie found' }, { status: 401 });
          }

          const cookieUserId = userIdCookie.value;

          if (cookieUserId !== userId) {
               return NextResponse.json({ error: 'Unauthorized: Cookie userId mismatch' }, { status: 401 });
          }

          // Validate that user exists in custom users table
          const { data: user, error: userError } = await supabase
               .from('users')
               .select('id, email, role')
               .eq('id', userId)
               .single();

          if (userError || !user) {
               return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
          }

          // --- End Security Check ---

          // Create Razorpay order
          const options = {
               amount: amount, // smallest unit (paise)
               currency: currency,
               receipt: `receipt_order_${Date.now()}`,
               payment_capture: 1,
               notes: {
                    userId,
                    userEmail: user.email,
                    addressId: addressId || null,
               },
          };

          const order = await razorpay.orders.create(options);

          // Save initial order in DB
          const { data, error: dbError } = await supabase
               .from('orders')
               .insert({
                    user_id: userId,
                    address_id: addressId || null, // ✅ NEW FIELD
                    total_amount: (amount / 100).toFixed(2),
                    currency: currency,
                    status: 'pending',
                    razorpay_order_id: order.id,
                    items: cartItems, // already structured
               })
               .select();

          if (dbError) {
               console.error('DB Error inserting order:', dbError);
               return NextResponse.json(
                    { error: 'Failed to create order record', details: dbError.message },
                    { status: 500 }
               );
          }

          console.log('Order inserted into DB:', data);
          return NextResponse.json(order);

     } catch (error) {
          console.error('Error creating Razorpay order:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
