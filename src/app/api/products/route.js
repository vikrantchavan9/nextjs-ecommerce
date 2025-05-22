// app/api/products/route.js
import { NextResponse } from 'next/server';
import { query } from '../../../lib/db'; // Adjust path as needed

export async function GET(request) {
     const { searchParams } = new URL(request.url);
     const sortBy = searchParams.get('sortBy');
     const category = searchParams.get('category');
     const section = searchParams.get('section');

     let orderBy = '';
     let whereClauses = [];
     let params = [];
     let paramIndex = 1;

     // Sorting
     if (sortBy) {
          if (sortBy === 'price_asc') {
               orderBy = 'ORDER BY price ASC';
          } else if (sortBy === 'price_desc') {
               orderBy = 'ORDER BY price DESC';
          }
          // For category and section sorting, PostgreSQL's ORDER BY works alphabetically by default
          // If you want a specific order for categories/sections, you'd need a more complex CASE statement or a join to a lookup table.
          // For now, we'll just add them as filters if specified.
     }

     // Filtering by category
     if (category) {
          whereClauses.push(`category = $${paramIndex++}`);
          params.push(category);
     }

     // Filtering by section
     if (section) {
          whereClauses.push(`section = $${paramIndex++}`);
          params.push(section);
     }

     let whereClause = '';
     if (whereClauses.length > 0) {
          whereClause = `WHERE ${whereClauses.join(' AND ')}`;
     }

     try {
          const products = await query(`SELECT * FROM products ${whereClause} ${orderBy}`, params);
          return NextResponse.json(products.rows);
     } catch (error) {
          console.error('Error fetching products:', error);
          return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
     }
}