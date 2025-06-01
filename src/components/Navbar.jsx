'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSectionsDropdownOpen, setIsSectionsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleAuthAction = async () => {
    if (user) {
      await supabase.auth.signOut();
      setUser(null);
      router.refresh();
    } else {
      router.push('/login');
    }
  };

  return (
    <nav className="bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center relative"> {/* Add relative here for absolute positioning */}
        <Link href="/" className="text-2xl font-bold">
          MyStore
        </Link>

        {/* Desktop Menu - No changes needed here */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/shop" className="hover:text-gray-300">Browse Products</Link>
          <Link href="/cart" className="hover:text-gray-300">Cart</Link>
          <Link href="/orders" className="hover:text-gray-300">My Orders</Link>
          <Link href="/about" className="hover:text-gray-300">About</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          <button onClick={handleAuthAction} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
            {user ? 'Logout' : 'Login'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu - POSITIONED ABSOLUTELY */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden bg-gray-900 absolute top-full left-0 right-0 p-4 shadow-lg"
            // Optional: You might want to make it span full width or adjust based on your design
            // If you want it to cover content (overlay), consider z-index as well.
          >
            <Link href="/" className="block pl-2 py-2 hover:bg-gray-600 rounded">Home</Link>
            <Link href="/about" className="block pl-2 py-2 hover:bg-gray-600 rounded">About</Link>
            <Link href="/shop" className="block pl-2 py-2 hover:bg-gray-600 rounded">View Products</Link>
            <div className="">
              <button
                onClick={() => setIsSectionsDropdownOpen(!isSectionsDropdownOpen)}
                className="w-full text-left pl-2 py-2 hover:bg-gray-600 rounded flex items-center justify-between"
              >
                Browse by Section
                <svg
                  className={`h-4 w-4 transform transition-transform duration-200 ${
                    isSectionsDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {isSectionsDropdownOpen && (
                <div className="pl-4 mt-2">
                  <Link href="/shop?section=men" className="block py-2 hover:bg-gray-600 rounded">Men</Link>
                  <Link href="/shop?section=women" className="block py-2 hover:bg-gray-600 rounded">Women</Link>
                  <Link href="/shop?section=kids" className="block py-2 hover:bg-gray-600 rounded">Kids</Link>
                  <Link href="/shop?section=unisex" className="block py-2 hover:bg-gray-600 rounded">Unisex</Link>
                </div>
              )}
            </div>
            <Link href="/cart" className="block pl-2 py-2 hover:bg-gray-600 rounded">My Cart</Link>
            <Link href="/orders" className="block pl-2 py-2 hover:bg-gray-600 rounded">My Orders</Link>
            <Link href="/contact" className="block pl-2 py-2 hover:bg-gray-600 rounded">Contact</Link>
            <button onClick={handleAuthAction} className="bg-gray-700 text-white mt-2 px-4 py-2 rounded hover:bg-gray-600">
              {user ? 'Logout' : 'Login'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;