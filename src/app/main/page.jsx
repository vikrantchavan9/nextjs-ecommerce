import HomepageClient from './components/HomepageClient'; // Import the new client component

export const dynamic = 'force-dynamic';

export default async function Homepage() {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_BASE_URL;

  // 1. Fetch data on the server
  const res = await fetch(`${baseUrl}/api/products`, {
    cache: 'no-store',
  });
  const products = await res.json();

  // 2. Pass the data as a prop to the Client Component
  return <HomepageClient products={products} />;
}