'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ShopPage() {
     const searchParams = useSearchParams();

     const sortBy = searchParams.get('sortBy') || '';
     const category = searchParams.get('category') || '';
     const section = searchParams.get('section') || '';

     const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const fetchProducts = async () => {
               setLoading(true);
               const queryParams = new URLSearchParams();
               if (sortBy) queryParams.set('sortBy', sortBy);
               if (category) queryParams.set('category', category);
               if (section) queryParams.set('section', section);

               const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?${queryParams.toString()}`;

               try {
                    const res = await fetch(apiUrl, { cache: 'no-store' });
                    if (!res.ok) throw new Error('Failed to fetch');
                    const data = await res.json();
                    setProducts(data);
               } catch (err) {
                    console.error('Error fetching products:', err);
                    setProducts([]);
               } finally {
                    setLoading(false);
               }
          };

          fetchProducts();
     }, [sortBy, category, section]);

     return { products, loading };
}
