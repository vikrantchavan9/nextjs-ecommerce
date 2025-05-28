// app/api/order/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Import your Supabase client

export async function POST(req) {
     if (req.method !== 'POST') {
          return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
     }

     try {
          const { cartItems, userId = null, totalAmount, paymentId, razorpayOrderId } = await req.json();

          // Basic validation
          if (!cartItems || cartItems.length === 0 || !totalAmount || totalAmount <= 0) {
               console.error('Validation Error: Missing or invalid order details.', { cartItems, totalAmount });
               return NextResponse.json({ message: 'Missing or invalid order details (cartItems or totalAmount)' }, { status: 400 });
          }

          // --- 1. Insert into 'orders' table ---
          const { data: orderData, error: orderError } = await supabase
               .from('orders')
               .insert([
                    {
                         user_id: userId, // Will be null if user is not logged in
                         total_amount: totalAmount,
                         payment_id: paymentId, // This is Razorpay's payment ID (rp_pay_xyz) after successful payment
                         razorpay_order_id: razorpayOrderId, // This is Razorpay's order ID (order_xyz)
                         status: 'created', // Initial status. Will be updated to 'paid' by webhook or verify API
                         // created_at will default to NOW() if set in Supabase table definition
                    },
               ])
               .select(); // Use select() to return the inserted data

          if (orderError) {
               console.error('Supabase Error creating order:', orderError);
               return NextResponse.json({ message: 'Failed to create order in DB', error: orderError.message }, { status: 500 });
          }

          const newOrder = orderData[0]; // Get the first (and only) inserted order

          // --- 2. Insert into 'order_items' table ---
          const orderItemsToInsert = cartItems.map(item => ({
               order_id: newOrder.id,
               product_id: item.id, // Assuming item has 'id' for product_id
               quantity: item.quantity || 1, // Default quantity to 1 if not provided
               price_at_purchase: item.price, // Store the price at the time of purchase
          }));

          const { error: orderItemsError } = await supabase
               .from('order_items')
               .insert(orderItemsToInsert);

          if (orderItemsError) {
               console.error('Supabase Error creating order items:', orderItemsError);
               // You might want to implement rollback logic here for the order
               return NextResponse.json({ message: 'Failed to create order items in DB', error: orderItemsError.message }, { status: 500 });
          }

          console.log('Order and order items successfully created in Supabase:', newOrder);
          return NextResponse.json({ message: 'Order created successfully', orderId: newOrder.id }, { status: 201 });

     } catch (error) {
          console.error('General Error in /api/order/route.js POST:', error);
          return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
     }
}