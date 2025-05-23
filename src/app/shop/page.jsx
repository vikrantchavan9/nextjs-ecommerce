// shop/page.jsx (App Router)
import ProductCard from '@/components/ProductCard';
import SortFilterControls from '@/components/SortFilterControls'; // Import the client component
import { Suspense } from 'react';

export default async function ShopPage({ searchParams }) {
  const sortBy = searchParams.sortBy || '';
  const category = searchParams.category || '';
  const section = searchParams.section || '';

  // Construct the URL for the API call
  const queryParams = new URLSearchParams();
  if (sortBy) queryParams.set('sortBy', sortBy);
  if (category) queryParams.set('category', category);
  if (section) queryParams.set('section', section);

  // Ensure process.env.NEXT_PUBLIC_BASE_URL is defined in .env.local
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?${queryParams.toString()}`;

  let products = [];
  try {
    // 'no-store' ensures data is always fresh, not cached statically by Next.js
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    products = await res.json();
  } catch (error) {
    console.error('Error fetching products in ShopPage:', error);
    // In a production app, you might want a more user-friendly error display
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Our Products</h1>
      <Suspense fallback={<div>Loading filters...</div>}>
        {/* Render the client component without passing functions as props */}
        <SortFilterControls />
      </Suspense>

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