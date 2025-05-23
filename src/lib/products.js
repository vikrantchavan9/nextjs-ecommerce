// src/lib/products.js

import { supabase } from './supabase';

export async function fetchAllProducts({
     sortBy = 'id',
     sortOrder = 'asc',
     category,
     section,
} = {}) {
     try {
          const allowedSortFields = ['id', 'price', 'name'];
          const allowedSortOrders = ['asc', 'desc'];

          // Validate inputs
          if (!allowedSortFields.includes(sortBy)) sortBy = 'id';
          if (!allowedSortOrders.includes(sortOrder.toLowerCase())) sortOrder = 'asc';

          let query = supabase
               .from('products')
               .select('id, name, description, price, images, category, section');

          if (category) {
               query = query.eq('category', category);
          }

          if (section) {
               query = query.eq('section', section);
          }

          query = query.order(sortBy, { ascending: sortOrder.toLowerCase() === 'asc' });

          const { data, error } = await query;

          if (error) throw error;

          const products = data.map((row) => ({
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
          console.error('Failed to fetch products:', error.message);
          return [];
     }
}
