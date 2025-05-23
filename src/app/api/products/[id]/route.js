// app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/products';

export async function GET(request) {
     try {
          // 1. Get the full URL from the request
          const url = new URL(request.url);

          // 2. Extract the 'id' from the URL path
          const pathSegments = url.pathname.split('/');  // Split the path into segments
          const id = pathSegments[pathSegments.length - 1]; // Get the last segment

          // 3. Check if id exists
          if (!id) {
               return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
          }

          const result = await query('SELECT * FROM products WHERE id = $1', [id]);

          if (result.rows.length === 0) {
               return NextResponse.json({ error: 'Product not found' }, { status: 404 });
          }

          return NextResponse.json(result.rows[0], {
               status: 200,
               headers: { 'Content-Type': 'application/json' },
          });
     } catch (error) {
          console.error("Error in GET:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
