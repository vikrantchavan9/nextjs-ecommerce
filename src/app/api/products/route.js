// src/app/api/products/route.js

import { query } from '@/lib/db';

export async function GET(request) {
     try {
          const result = await query('SELECT * FROM products ORDER BY id ASC');
          return new Response(JSON.stringify(result.rows), {
               status: 200,
               headers: { 'Content-Type': 'application/json' },
          });
     } catch (err) {
          console.error('DB Error:', err);
          return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
               status: 500,
          });
     }
}
