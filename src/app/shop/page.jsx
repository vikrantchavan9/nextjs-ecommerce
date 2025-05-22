'use client'; // needed for client-side interactivity (like event handlers)

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter/sort values from URL query params
  const sortBy = searchParams.get('sortBy') || '';
  const category = searchParams.get('category') || '';
  const section = searchParams.get('section') || '';

  // Local state to hold fetched products and loading/error states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products whenever filters or sorting change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams({
          sortBy,
          category,
          section,
        }).toString();

        const res = await fetch(`/api/products?${query}`);

        if (!res.ok) {
          throw new Error(`Failed to load products: ${res.statusText}`);
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [sortBy, category, section]);

  // Helper: update URL query params when user changes filters/sorting
  function updateFilters(newFilters) {
    const params = new URLSearchParams({
      sortBy,
      category,
      section,
      ...newFilters,
    });

    // Remove empty params for cleanliness
    for (const [key, value] of params.entries()) {
      if (!value) params.delete(key);
    }

    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="p-6">
      {/* Filter and sort controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Sort By Price */}
        <select
          value={sortBy}
          onChange={e => updateFilters({ sortBy: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Sort by price</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={e => updateFilters({ category: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="t-shirt">T-Shirt</option>
          <option value="trouser">Trouser</option>
          <option value="sweater">Sweater</option>
          <option value="skirt">Skirt</option>
          <option value="dress">Dress</option>
          <option value="accessories">Accessories</option>
        </select>

        {/* Section */}
        <select
          value={section}
          onChange={e => updateFilters({ section: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Sections</option>
          <option value="men">Men</option>
          <option value="woman">Woman</option>
          <option value="kids">Kids</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>

      {/* Loading/Error */}
      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {/* Products Grid */}
      {!loading && !error && products.length === 0 && (
        <p>No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
