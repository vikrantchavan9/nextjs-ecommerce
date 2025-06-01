export const dynamic = 'force-dynamic';
import ProductCard from "./ProductCard";
import Link from "next/link";
import Image from 'next/image';
import heroicon from "@/assets/images/heroicon.jpg";
import WhyShopWithUs from "./WhyShopWithUs";
import CustomerTestimonials from "./CustomerTestimonials";
import NewsletterSignup from "./Newsletter";

export default async function Homepage () {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/products`, {
    cache: 'no-store',
  });

  const products = await res.json();

  return (
    <>
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[50vh] md:h-[70vh] flex items-center justify-center text-white overflow-hidden">
        {/* Parallax Background */}
        <div className="fixed top-0 left-0 w-full h-[80vh] -z-10">
          <Image
            src={heroicon}
            className="mt-10"
            alt="Ecommerce background with various products"
            fill
            style={{
              objectFit: 'cover',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
            quality={100}
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black opacity-50" />
        </div>

        {/* Content Overlay */}
        <div className="mt-10 relative text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
            Discover Your Next Favorite Style
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            Hand-picked products for your summer vibes. Limited stock only!
          </p>
          <Link href="/shop" passHref>
            <button className="inline-block bg-gray-900 hover:bg-gray-900 border border-gray-800 text-white py-3 px-8 rounded transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      {/* Product Grid */}
      <div className="product-grid-container bg-gray-50">
      <h2 className="text-2xl text-black pt-8 px-8 font-semibold">Featured Products</h2>
      <section className="max-w-7xl mx-auto py-8 px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No products found.</p>
          )}
        </div>
      </section>

      <WhyShopWithUs/>
      <CustomerTestimonials />
      <NewsletterSignup />
      </div>
    </>
  );
}
