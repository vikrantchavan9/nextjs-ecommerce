"use client";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition">
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
        <div className="p-4">
          <h3 className="text-sm text-black font-medium">{product.name}</h3>
          <p className="text-xs text-black">{product.category}</p>
          <p className="mt-2 font-semibold text-slate-900">₹{product.price}</p>
        </div>
      </div>
    </Link>
  );
}
