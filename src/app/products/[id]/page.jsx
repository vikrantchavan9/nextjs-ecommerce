import Image from "next/image";

export default async function ProductPage({ params }) {
  const { id } = params;
  let product;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch product");

    product = await res.json();
  } catch (error) {
    console.error("Error:", error.message);
    return <div className="p-10 text-black">Failed to load product.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 grid md:grid-cols-2 gap-8">
      <div className="relative h-96 w-full bg-gray-100">
        <Image
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover rounded-xl"
        />
      </div>
      <div>
        <h1 className="text-2xl text-gray-900 font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-xl font-semibold text-slate-900">${product.price}</p>
        <button className="mt-6 px-6 py-3 bg-black text-white rounded hover:bg-slate-800 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
