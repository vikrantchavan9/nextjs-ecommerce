// src/lib/products.js

import { query } from './db'; // your DB query function

export async function fetchAllProducts({
     sortBy = 'id',
     sortOrder = 'ASC',
     category,
     section,
} = {}) {
     try {
          const allowedSortFields = ['id', 'price', 'name'];
          const allowedSortOrders = ['ASC', 'DESC'];

          // Validate sort inputs
          if (!allowedSortFields.includes(sortBy)) sortBy = 'id';
          if (!allowedSortOrders.includes(sortOrder.toUpperCase())) sortOrder = 'ASC';

          // Build query dynamically
          let queryString = `
      SELECT id, name, description, price, images, category, section
      FROM products
    `;
          const values = [];
          const conditions = [];

          if (category) {
               values.push(category);
               conditions.push(`category = $${values.length}`);
          }

          if (section) {
               values.push(section);
               conditions.push(`section = $${values.length}`);
          }

          if (conditions.length > 0) {
               queryString += ' WHERE ' + conditions.join(' AND ');
          }

          queryString += ` ORDER BY ${sortBy} ${sortOrder}`;

          const result = await query(queryString, values);

          const products = result.rows.map((row) => ({
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
