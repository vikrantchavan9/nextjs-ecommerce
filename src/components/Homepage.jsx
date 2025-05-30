export const dynamic = 'force-dynamic';
import ProductCard from "./ProductCard";
import Link from "next/link";
import Image from 'next/image';
import heroicon from "@/assets/images/heroicon.jpg";

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
      {/* Hero */}
    <section className="relative h-[50vh] md:h-[80vh] flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          // Assuming your image is in public/images/homepage2-min.jpg as discussed previously
          src={heroicon}
          alt="Ecommerce background with various products"
          fill // This makes the image fill the parent div
          style={{ objectFit: 'cover' }} // Ensures the image covers the area, like background-size: cover
          quality={100} // Adjust image quality if needed
          priority // Prioritize loading for a hero image
        />
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content Overlay */}
      <div className="mt-10 relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
          Discover Your Next Favorite Style
        </h1>

        {/* Paragraph */}
        <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
          Explore our handpicked collection of premium products, designed to elevate your everyday.
          Unleash your unique flair and find what truly moves you.
        </p>

        {/* CTA Button */}
        <Link href="/shop" passHref>
          <button className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out shadow-lg transform hover:scale-105">
            Shop the Latest Collection
          </button>
        </Link>
      </div>
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
