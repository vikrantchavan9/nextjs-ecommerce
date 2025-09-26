"use client";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {

  return (
    <Link href={`/main/products/${product.id}`} className="block h-full"> 

      <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full min-h-[300px]">
        {/* Image Container: Fixed height */}
        <div className="relative h-52 w-full bg-gray-100">

          {product.images?.[0] ? (
            <Image src={product.images[0]} 
            alt={product.name} 
            fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
          <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
          )}
          </div>

        {/* Product Details Section: flex-grow ensures it takes remaining space */}
        <div className="p-4 flex flex-col flex-grow"> {/* Added flex flex-col flex-grow */}
          {/* Product Name: Limit to 2 lines with ellipsis */}
          <h3 className="text-sm text-black font-medium line-clamp-2"> {/* Added line-clamp-2 */}
            {product.name}
          </h3>
          {/* Product Category: Keep it as is, or add line-clamp if it varies a lot */}
          <p className="text-xs text-black">{product.category}</p>

          {/* Price: Use mt-auto to push it to the bottom */}
          <p className="mt-auto font-semibold text-slate-900 pt-2">₹{product.price}</p> {/* Added mt-auto pt-2 */}
        </div>
      </div>
    </Link>
  );
}
