'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import SortFilterControls from '@/components/SortFilterControls';

export default function ShopPage() {
  const searchParams = useSearchParams();

  const sortBy = searchParams.get('sortBy') || '';
  const category = searchParams.get('category') || '';
  const section = searchParams.get('section') || '';

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
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
      }
    };

    fetchProducts();
  }, [sortBy, category, section]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Our Products</h1>
      <SortFilterControls />

      {products.length === 0 ? (
        <p className="text-center text-black">No products found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
