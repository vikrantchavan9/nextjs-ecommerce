import { useState } from 'react';
import ProductCard from './ProductCard'; // The new ProductCard

const ProductSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="aspect-[4/5] bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
    <div className="h-4 mt-2 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
    <div className="h-4 mt-1 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
  </div>
);

export default function ProductGrid({ products, loading }) {
  const [visibleCount, setVisibleCount] = useState(8);

  const loadMore = () => {
    setVisibleCount(prev => prev + 8);
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
        {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-center text-text-muted">No products found matching your criteria.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
        {products.slice(0, visibleCount).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {visibleCount < products.length && (
        <div className="text-center mt-12">
          <button 
            onClick={loadMore}
            className="px-8 py-3 font-bold text-white transition-colors rounded-full shadow-lg bg-accent hover:bg-accent-dark"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}