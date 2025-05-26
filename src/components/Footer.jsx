import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h3 className="text-xl font-bold mb-2">MyStore</h3>
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
          <Link href="/about" className="hover:text-gray-300 mb-1">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-gray-300 mb-1">
            Contact Us
          </Link>
          <Link href="/shop" className="hover:text-gray-300">
            View all Products
          </Link>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-lg font-semibold mb-2">Connect With Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300">
              Facebook
            </a>
            <a href="#" className="hover:text-gray-300">
              Twitter
            </a>
            <a href="#" className="hover:text-gray-300">
              Instagram
            </a>
          </div>
          <p className="mt-2">Email: vikrantchavan200@gmail.com</p>
          <p>Phone: +91 8208280387</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;