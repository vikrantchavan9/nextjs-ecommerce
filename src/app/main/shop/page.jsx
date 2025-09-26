'use client';
import { Suspense } from 'react';
import Image from "next/image";
import Link from "next/link";
import ShopProducts from '@/app/context/shoppage';
import SortFilterControls from './components/SortFilterControls';

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
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-slate-800">Browse Products</h1>
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
              <Link key={product.id} href={`/main/products/${product.id}`} className="block h-full">
                <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full min-h-[300px]">
                  {/* Image Container: Fixed height */}
                  <div className="relative h-52 w-full bg-gray-100">
                    {product.images?.[0] ? (
                      <Image 
                        src={product.images[0]} 
                        alt={product.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                    )}
                  </div>

                  {/* Product Details Section: flex-grow ensures it takes remaining space */}
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Product Name: Limit to 2 lines with ellipsis */}
                    <h3 className="text-sm text-black font-medium line-clamp-2">
                      {product.name}
                    </h3>
                    {/* Product Category: Keep it as is, or add line-clamp if it varies a lot */}
                    <p className="text-xs text-black">{product.category}</p>

                    {/* Price: Use mt-auto to push it to the bottom */}
                    <p className="mt-auto font-semibold text-slate-900 pt-2">₹{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
