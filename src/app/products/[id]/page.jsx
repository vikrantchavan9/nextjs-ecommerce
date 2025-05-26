import AddToCartButton from "@/components/AddToCartButton";
import ProductImageSlider from "@/components/ProductImageSlider";

export default async function ProductPage({ params }) {
params = await params;  // resolves promise if it is one, no harm if it's not
const { id } = params;
  let product = null;

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
    <div className="bg-gray-200 max-w-5xl mx-auto py-12 px-4 grid md:grid-cols-2 gap-8">
      {/* Client-side Image Slider */}
      <ProductImageSlider images={product.images} />
      
      <div className="p-2">
        <h1 className="text-sm mb-8 text-black">⭐⭐⭐⭐☆ (4.2/5 based on 12 reviews)</h1>
        <h1 className="text-2xl text-black font-semibold ">{product.name}</h1>
        <p className="text-lg font-semibold text-slate-900">₹{product.price}</p>
        
        <AddToCartButton product={product} />

        <p className="text-black text-sm my-10 h-2h">Description: <br />{product.description}</p>
        <p className="text-black text-sm my-10 h-2h">Delivered in 3-5 days | Easy 7-day return</p>
      </div>
      
    </div>
  );
}
