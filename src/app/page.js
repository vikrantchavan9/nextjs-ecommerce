
import Homepage from "@/components/Homepage";

async function getProducts() {
  const baseUrl = request.nextUrl.origin;
  const res = await fetch(`${baseUrl}/api/products`, {
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
