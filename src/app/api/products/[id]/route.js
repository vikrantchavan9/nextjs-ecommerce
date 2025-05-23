import { NextResponse } from 'next/server';
import { fetchProductById } from '@/lib/products';

export async function GET(request) {
     try {
          const url = new URL(request.url);

          const pathSegments = url.pathname.split('/');
          const id = pathSegments[pathSegments.length - 1];

          if (!id) {
               return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
          }

          const product = await fetchProductById(id);

          if (!product) {
               return NextResponse.json({ error: 'Product not found' }, { status: 404 });
          }

          // product is a single object, not inside .rows
          return NextResponse.json(product, {
               status: 200,
               headers: { 'Content-Type': 'application/json' },
          });
     } catch (error) {
          console.error("Error in GET:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
}
