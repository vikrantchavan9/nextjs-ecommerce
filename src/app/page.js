
import Homepage from "@/components/Homepage";

async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: 'no-store', // ensure freshness in dev
  });
  return res.json();
}

export default async function Page() {
  const products = await getProducts();

  return (
    <>
      <Homepage />

    </>

  );
}
