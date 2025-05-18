// app/products/page.jsx
// This is a Server Component, meaning it runs on the server before sending HTML to the browser.
// It directly fetches data from the database.

import ProductCard from '@/components/ProductCard'; // Import the component that displays each product
import { query } from '@/lib/db'; // Import our database query function

// 1. Data Fetching Logic (Server-Side)
async function getProducts() {
  try {
    // Construct a simple SQL query to get all products
    const queryString = 'SELECT id, name, price, image_url, description, section, category, image_gallery FROM products ORDER BY id ASC';

    // Execute the query using our database utility
    const result = await query(queryString, []); // No parameters needed for "all products"

    // Log the raw database result for debugging (check your terminal!)
    console.log("DB Query Result (products/page.jsx):", result.rows);

    // Transform the raw database rows into a more usable array of product objects
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price), // Ensure price is a number
      imageUrl: row.image_url,
      description: row.description,
      section: row.section,
      category: row.category,
      // Handle image_gallery: parse JSON if it exists, otherwise use main imageUrl
      images: row.image_gallery ? JSON.parse(row.image_gallery) : [row.image_url],
    }));

    // Log the transformed products for debugging
    console.log("Transformed Products (products/page.jsx):", products);

    return products; // Return the array of products
  } catch (error) {
    // If there's any error during database query, log it and return an empty array
    console.error('ERROR: Failed to fetch products for listing (products/page.jsx):', error);
    return []; // Return empty array so the page doesn't crash
  }
}

// 2. Page Component (Server-Side Rendering)
export default async function ProductListingPage() {
  // Call the data fetching function directly within the Server Component
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">All Products</h1>

      {/* 3. Conditional Rendering: Show products or "No products found" message */}
      {products.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No products found.</p>
      ) : (
        // 4. Render Product Cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}