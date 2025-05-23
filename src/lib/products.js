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

export async function fetchProductById(id) {
     try {
          const { data, error } = await supabase
               .from('products')
               .select('id, name, description, price, images, category, section')
               .eq('id', id)
               .single();

          if (error) throw error;

          if (!data) return null;

          return {
               id: data.id,
               name: data.name,
               description: data.description,
               price: parseFloat(data.price),
               category: data.category,
               section: data.section,
               images: (() => {
                    if (!data.images) return [];
                    if (Array.isArray(data.images)) return data.images;
                    if (typeof data.images === 'string') {
                         try {
                              return JSON.parse(data.images);
                         } catch {
                              return [data.images];
                         }
                    }
                    return [];
               })(),
          };
     } catch (error) {
          console.error('Failed to fetch product by id:', error.message);
          return null;
     }
}