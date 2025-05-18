/** @type {import('next').NextConfig} */
const nextConfig = {
     images: {
          domains: [
               'res.cloudinary.com', // Add your Cloudinary domain here
               // Add any other external image domains you might use (e.g., 'fakestoreapi.com', 'example.com')
          ],
     },
};
export default nextConfig;
