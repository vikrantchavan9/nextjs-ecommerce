import AddToCartButton from "../components/AddToCartButton";
import ProductImageSlider from "../components/ProductImageSlider";

export default async function ProductPage({ params }) {
  const { id } = await params;
  let product = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch product");

    product = await res.json();
  } catch (error) {
    console.error("Error:", error.message);
    return <div className="flex justify-center items-center h-screen text-xl text-gray-600">Failed to load product. Please try again later.</div>;
  }


  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-start">

          {/* Image Slider Section */}
          <div className="md:p-10 lg:col-span-3"> 
            <ProductImageSlider images={product.images} />
          </div>

          {/* Product Details Section */}
           <div className="md:col-span-1 lg:col-span-2">
            
 
          {/* Description and Delivery Information */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h1 className="text-xl lg:text-4xl font-semibold text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center mb-2 text-sm text-gray-500">
              <span className="text-yellow-400 mr-1">⭐⭐⭐⭐☆</span>
              <span className="font-medium text-gray-800">4.2</span>
              <span className="ml-1 text-gray-400">(12 reviews)</span>
            </div>

              <p className="text-gray-600 text-sm md:text-md leading-relaxed whitespace-pre-wrap">{product.description}</p>
              <p className="text-xl font-bold text-gray-800 mt-5">₹{product.price}</p>
            </div>
          
          {/* Add to Cart Button */}
          <div className="mb-5">
            <AddToCartButton product={product} />
          </div>

            <div className="mt-6 text-sm text-gray-500 flex items-center gap-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.74-6.26a.75.75 0 01-1.06 1.06L6.5 11.06l-1.06 1.06a.75.75 0 01-1.06-1.06L5.44 10l-1.06-1.06a.75.75 0 011.06-1.06L6.5 8.94l1.06-1.06a.75.75 0 011.06 1.06L7.56 10l1.06 1.06z" clipRule="evenodd" />
                </svg>
                <span>Delivered in 3-5 days</span>
              </div>

              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 14h9a2 2 0 002-2V8.5L14 10h-2.5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5H14v-.5a.5.5 0 00-1 0v.5H7v-.5a.5.5 0 00-1 0v.5H4v-.5a.5.5 0 00-1 0V12a2 2 0 002 2zm10-5V5a2 2 0 00-2-2H5a2 2 0 00-2 2v4a.5.5 0 01.5.5h11a.5.5 0 01.5-.5z" />
                </svg>
                <span>Easy 7-day return</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}