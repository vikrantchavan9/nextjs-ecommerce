// src/lib/products.js

import { query } from './db';  // your DB query function

export async function fetchAllProducts() {
     try {
          const queryString = `
      SELECT id, name, description, price, images, category, section
      FROM products
      ORDER BY id ASC
    `;

          const result = await query(queryString, []);

          const products = result.rows.map(row => ({
               id: row.id,
               name: row.name,
               description: row.description,
               price: parseFloat(row.price),
               category: row.category,
               section: row.section,
               images: (() => {
                    if (!row.images) return [];
                    if (Array.isArray(row.images)) return row.images;
                    if (typeof row.images === 'string') {
                         try {
                              return JSON.parse(row.images);
                         } catch {
                              return [row.images];
                         }
                    }
                    return [];
               })(),
          }));

          return products;

     } catch (error) {
          console.error('Failed to fetch products:', error);
          return [];
     }
}