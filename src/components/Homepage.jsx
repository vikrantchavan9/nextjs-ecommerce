import ProductCard from "./ProductCard";
import Link from "next/link";

export default async function Homepage () {
       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: 'no-store',
  });
  const products = await res.json();
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-24 text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Explore Summer Collection</h1>
        <p className="max-w-lg mx-auto text-lg mb-6">
          Hand-picked products for your summer vibes. Limited stock only!
        </p>
        <Link href="/shop">
          <button className="px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition">
            Shop Now
          </button>
        </Link>
      </section>

      {/* Product Grid */}
              <h2 className="text-2xl text-black pt-8 px-8 font-bold">Featured Products</h2>
      <section className="max-w-7xl mx-auto py-8 px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No products found.</p>
          )}
        </div>
      </section>
    </>
  );
}
