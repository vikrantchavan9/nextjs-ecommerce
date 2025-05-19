// src/app/api/products/[id]/route.js

import { query } from '@/lib/db';

export async function GET(request, { params }) {
     const { id } = params;

     try {
          const result = await query('SELECT * FROM products WHERE id = $1', [id]);

          if (result.rows.length === 0) {
               return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
          }

          return new Response(JSON.stringify(result.rows[0]), {
               status: 200,
               headers: { 'Content-Type': 'application/json' },
          });
     } catch (err) {
          console.error('DB Error:', err);
          return new Response(JSON.stringify({ error: 'Failed to fetch product' }), {
               status: 500,
          });
     }
}
