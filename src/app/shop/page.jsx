// app/shop/page.jsx
import ProductCard from '@/components/ProductCard';
import { fetchAllProducts } from '@/lib/products';

export default async function ShopPage() {
  const products = await fetchAllProducts();

  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
