import { query } from '@/lib/db';

export async function GET(request) {
     try {
          console.log('API called with URL:', request.url);

          const { searchParams } = new URL(request.url);
          const sortBy = searchParams.get('sortBy');       // 'asc' or 'desc'
          const category = searchParams.get('category');   // e.g. 't-shirt'
          const section = searchParams.get('section');     // e.g. 'men'

          // Base SQL query and params array
          let sql = 'SELECT * FROM products';
          const params = [];
          const conditions = [];

          if (category) {
               params.push(category);
               conditions.push(`category = $${params.length}`);
          }

          if (section) {
               params.push(section);
               conditions.push(`section = $${params.length}`);
          }

          if (conditions.length > 0) {
               sql += ' WHERE ' + conditions.join(' AND ');
          }

          // Add sorting
          if (sortBy === 'asc') {
               sql += ' ORDER BY price ASC';
          } else if (sortBy === 'desc') {
               sql += ' ORDER BY price DESC';
          } else {
               sql += ' ORDER BY id ASC';
          }

          const result = await query(sql, params);

          console.log('Query result count:', result.rows.length);

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
