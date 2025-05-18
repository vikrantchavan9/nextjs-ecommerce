// app/products/[id]/page.jsx
// This is a Server Component. It fetches data on the server.

import { notFound } from 'next/navigation'; // For displaying 404
import { query } from '@/lib/db'; // Import server-side query function
import ProductDetailsClient from '@/components/ProductDetailsClient'; // Import the client component for interactivity

// Data fetching function (runs on the server)
async function getProductById(id) {
  try {
    console.log("Attempting to fetch product with ID:", id);
    const result = await query('SELECT id, name, price, description, image_url, image_gallery FROM products WHERE id = $1', [id]);
    console.log("DB Query Result for single product:", result.rows);

    if (result.rows.length > 0) {
      const product = result.rows[0];
      let images = [product.image_url]; // Default to main image_url

      // If image_gallery column exists and is a JSON string, parse it
      if (product.image_gallery) {
        try {
          const gallery = JSON.parse(product.image_gallery);
          if (Array.isArray(gallery) && gallery.length > 0) {
            images = gallery;
          }
        } catch (e) {
          console.warn('Failed to parse image_gallery as JSON for product ID:', id, e);
          // Fallback to single image_url if parsing fails
        }
      }

      return {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
        imageUrl: product.image_url, // Main image URL
        images: images, // Array of images for gallery
      };
    }
    console.log("Product not found in DB for ID:", id);
    return null; // Product not found in database
  } catch (error) {
    console.error(`ERROR: Failed to fetch product with ID ${id}:`, error);
    return null; // Return null on database error
  }
}

// Main page component for the dynamic route
export default async function SingleProductPage({ params }) {
  console.log("SingleProductPage rendering for params:", params);
  const { id } = params; // Extract the dynamic ID from the URL

  const product = await getProductById(id); // Fetch product data

  if (!product) {
    console.log("Calling notFound() for product ID:", id);
    notFound(); // Triggers Next.js's 404 page if product is not found
  }

  // Pass the fetched product data to the client component for rendering
  return (
    <ProductDetailsClient product={product} />
  );
}