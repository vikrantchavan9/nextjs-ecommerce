'use client';

import ShopProducts from '@/app/context/shoppage';
import ProductCard from '@/components/ProductCard';
import SortFilterControls from '@/components/SortFilterControls';

export default function ShopPage() {
  const { products, loading } = ShopProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Our Products</h1>
      <SortFilterControls />

      {loading ? (
        <p className="text-center text-black">Loading products...</p>
      ) : products.length === 0 ? (
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
