'use client';
import { Suspense } from 'react';
import ShopProducts from '@/app/context/shoppage';
import ProductCard from '@/components/ProductCard';
import SortFilterControls from '@/components/SortFilterControls';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Skeleton for product image */}
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

function ShopContent() {
  const { products, loading } = ShopProducts();

  return (
        <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Our Products</h1>
      <SortFilterControls />
      {loading ? (
        // Display skeleton loaders when loading is true
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
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

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
