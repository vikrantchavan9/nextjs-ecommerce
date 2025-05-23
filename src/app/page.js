// src/app/page.jsx
import Homepage from "@/components/Homepage";

async function getProducts() {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/api/products`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export default async function Page() {
  const products = await getProducts();

  return (
    <>
      <Homepage products={products} />
    </>
  );
}
