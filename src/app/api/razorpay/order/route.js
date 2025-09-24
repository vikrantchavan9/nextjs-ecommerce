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
          const { amount, currency, userId, cartItems } = await req.json();

          console.log('=== RAZORPAY ORDER API CALLED ===');
          console.log('Request data:', { amount, currency, userId, cartItems });

          // Validate input
          if (!amount || !currency || !userId || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
               console.error('Invalid input validation failed');
               return NextResponse.json({ error: 'Invalid input: amount, currency, userId, or cartItems are missing/invalid.' }, { status: 400 });
          }

          // --- UPDATED Security Check: Verify User ID using Custom Authentication ---
          const supabase = createRouteHandlerClient({ cookies });

          // Get userId from cookies instead of Supabase auth
          const cookieStore = cookies();
          const userIdCookie = cookieStore.get('userId');

          console.log('Cookie check - userIdCookie:', userIdCookie);

          if (!userIdCookie) {
               console.error('Authentication Error: No userId cookie found');
               return NextResponse.json({ error: 'Unauthorized or invalid user ID.' }, { status: 401 });
          }

          const cookieUserId = userIdCookie.value;
          console.log('API: Found userId in cookie:', cookieUserId);
          console.log('API: userId from request:', userId);

          // Check if the userId from cookie matches the one sent in request
          if (cookieUserId !== userId) {
               console.error('Authentication Error: Cookie userId does not match request userId');
               console.error('Cookie userId:', cookieUserId, 'Request userId:', userId);
               return NextResponse.json({ error: 'Unauthorized or invalid user ID.' }, { status: 401 });
          }

          // Validate that this user exists in YOUR custom users table
          console.log('Validating user in custom users table...');
          const { data: user, error: userError } = await supabase
               .from('users')  // YOUR custom users table
               .select('id, email, role')
               .eq('id', userId)
               .single();

          console.log('User validation result - user:', user, 'error:', userError);

          if (userError || !user) {
               console.error('Authentication Error: User not found in custom users table:', userError);
               return NextResponse.json({ error: 'Unauthorized or invalid user ID.' }, { status: 401 });
          }

          console.log('API: User validated from custom users table:', user);
          // --- End UPDATED Security Check ---

          // Create Razorpay order
          const options = {
               amount: amount, // amount in the smallest currency unit (e.g., paisa for INR)
               currency: currency,
               receipt: `receipt_order_${Date.now()}`, // Unique receipt ID
               payment_capture: 1, // Auto-capture payment after success
               notes: {
                    userId: userId,
                    userEmail: user.email, // Now we have user email from custom table
               },
          };

          console.log('Attempting to create Razorpay order with options:', options);

          const order = await razorpay.orders.create(options);
          console.log('Razorpay Order created successfully:', order);

          // Save the initial order details to your database with 'pending' status
          console.log('=== DATABASE INSERT ATTEMPT ===');
          console.log('Attempting to insert order with data:', {
               user_id: userId,
               total_amount: (amount / 100).toFixed(2),
               currency: currency,
               status: 'pending',
               razorpay_order_id: order.id,
               items: cartItems,
          });

          const { data, error: dbError } = await supabase
               .from('orders')
               .insert({
                    user_id: userId,
                    total_amount: (amount / 100).toFixed(2), // Convert back to rupees for storage
                    currency: currency,
                    status: 'pending',
                    razorpay_order_id: order.id,
                    items: cartItems, // Store the structured cart items
               })
               .select();

          if (dbError) {
               console.error('=== DATABASE ERROR DETAILS ===');
               console.error('DETAILED Error inserting order into Supabase:', dbError);
               console.error('Error code:', dbError.code);
               console.error('Error message:', dbError.message);
               console.error('Error details:', dbError.details);
               console.error('Error hint:', dbError.hint);

               // Return error if we can't save to database
               return NextResponse.json({
                    error: 'Failed to create order record',
                    details: dbError.message,
                    code: dbError.code
               }, { status: 500 });
          } else {
               console.log('SUCCESS: Pending order inserted into Supabase:', data);
          }

          console.log('=== API SUCCESS - RETURNING ORDER ===');
          return NextResponse.json(order);

     } catch (error) {
          console.error('=== UNEXPECTED ERROR ===');
          console.error('Error creating Razorpay order:', error);
          console.error('Error stack:', error.stack);
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
