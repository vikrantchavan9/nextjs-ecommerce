// app/api/products/route.js

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct

export async function GET(request) {

     const { searchParams } = new URL(request.url);
     const sortBy = searchParams.get('sortBy');
     const category = searchParams.get('category');
     const section = searchParams.get('section');

     const allowedSortValues = ['price_asc', 'price_desc'];
     let query = supabase
          .from('products')
          .select('*');

     if (category) {
          query = query.eq('category', category);
     }

     if (section) {
          query = query.eq('section', section);
     }

     if (sortBy && allowedSortValues.includes(sortBy)) {
          if (sortBy === 'price_asc') {
               query = query.order('price', { ascending: true });
          } else if (sortBy === 'price_desc') {
               query = query.order('price', { ascending: false });
          }
     } else {
          query = query.order('id', { ascending: true });
     }

     const { data, error } = await query;

     if (error) {
          console.error('Error fetching products:', error.message);
          return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
     }

     return NextResponse.json(data);
}
