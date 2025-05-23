import Homepage from "@/components/Homepage";

async function getProducts() {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error(`Fetch failed with status ${res.status}`);
      throw new Error('Failed to fetch products');
    }

    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return []; // fallback to empty array to avoid crash
  }
}

export default async function Page() {
  const products = await getProducts();
  return <Homepage products={products} />;
}
