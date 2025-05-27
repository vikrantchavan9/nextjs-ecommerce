// app/api/razorpay/verify/route.js
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
// Razorpay SDK is usually not needed for webhook validation,
// as you're validating the signature yourself with crypto.
// import Razorpay from 'razorpay';
import crypto from 'crypto'; // Node.js crypto module for signature verification

// This should be RAZORPAY_KEY_SECRET (your private key from Razorpay Dashboard)
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
// This is the SECRET you set in your Razorpay webhook configuration in the Dashboard
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

// Ensure keys are present at server startup (important check)
if (!RAZORPAY_KEY_SECRET || !RAZORPAY_WEBHOOK_SECRET) {
     // Log an error if secrets are missing. In production, you might want to crash or monitor this.
     console.error('CRITICAL ERROR: Missing RAZORPAY_KEY_SECRET or RAZORPAY_WEBHOOK_SECRET environment variables.');
     // Note: This check runs on server startup. Actual request errors are handled below.
}

// --- IMPORTANT: Change from default export to named export for POST method ---
export async function POST(request) { // This function handles POST requests to /api/razorpay/verify
     // Get the JSON body from the incoming request (this contains payment_id, order_id, signature, etc.)
     const requestBody = await request.json();

     const {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          cartItems,   // Passed from client for saving to DB
          totalAmount  // Passed from client for saving to DB
     } = requestBody;

     // Basic validation of incoming data
     if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !cartItems || totalAmount === undefined) {
          console.error('Missing required payment or order details in verify request.');
          return NextResponse.json(
               { message: 'Missing required payment or order details.' },
               { status: 400 } // Bad Request
          );
     }

     // --- 1. Verify Payment Signature (Crucial for Security!) ---
     // This is where you verify that the payment callback is authentic from Razorpay.
     // The string to be signed is a concatenation of razorpay_order_id and razorpay_payment_id.
     const generated_signature = crypto
          .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET) // Use your webhook secret (set in Razorpay Dashboard)
          .update(razorpay_order_id + '|' + razorpay_payment_id)
          .digest('hex');

     const isAuthentic = generated_signature === razorpay_signature;

     if (!isAuthentic) {
          console.error('Razorpay signature verification failed. Possible tampering or incorrect secret.');
          return NextResponse.json({ message: 'Signature verification failed.' }, { status: 400 });
     }

     // --- 2. Authenticate User & Save Order to Supabase (only if signature is authentic) ---
     const supabase = await createServerSupabaseClient(); // Get the server-side Supabase client
     const { data: userData, error: userError } = await supabase.auth.getUser(); // Get the authenticated user

     if (userError || !userData?.user) {
          console.error('User not authenticated for order creation during verification:', userError?.message || 'No user data.');
          return NextResponse.json({ message: 'User not authenticated for order creation.' }, { status: 401 }); // Unauthorized
     }

     const userId = userData.user.id; // Get the authenticated user's ID (UUID)

     try {
          const { data: newOrder, error: insertError } = await supabase
               .from('orders')
               .insert({
                    user_id: userId,          // Link order to the authenticated user
                    total_amount: totalAmount,
                    order_details: cartItems, // Store cart items (array of objects) as JSONB
                    payment_id: razorpay_payment_id,
                    order_id: razorpay_order_id, // Razorpay order ID (from their system)
                    signature: razorpay_signature, // Razorpay signature (for record-keeping, optional)
                    status: 'captured',       // Indicate successful payment capture
                    payment_method: 'Razorpay' // Or 'Online Payment'
               })
               .select(); // Select the inserted row(s) to confirm insertion

          if (insertError) {
               console.error('Supabase order insertion error:', insertError);
               return NextResponse.json(
                    { message: 'Failed to save order to database.', error: insertError.message },
                    { status: 500 } // Internal Server Error
               );
          }

          console.log('Order successfully saved:', newOrder);

          // --- 3. Respond to client with success ---
          return NextResponse.json(
               { message: 'Payment verified and order saved successfully!', order: newOrder[0] },
               { status: 200 } // OK
          );

     } catch (dbOperationError) {
          // Catch any unexpected errors during database operations
          console.error('Unexpected database operation error during order saving:', dbOperationError);
          return NextResponse.json(
               { message: 'An unexpected database error occurred during order saving.', error: dbOperationError.message },
               { status: 500 }
          );
     }
}
