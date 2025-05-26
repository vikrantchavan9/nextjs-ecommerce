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

  // Check user authentication state
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  // Handle login/logout
  const handleAuthAction = async () => {
    if (user) {
      await supabase.auth.signOut();
      setUser(null);
      router.refresh(); // Refresh navbar state
    } else {
      router.push('/login'); // Redirect guests to login
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          MyStore
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/shop" className="hover:text-gray-300">Shop</Link>

          {/* Sections Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsSectionsDropdownOpen(true)}
            onMouseLeave={() => setIsSectionsDropdownOpen(false)}
          >
            <button className="hover:text-gray-300 flex items-center">
              Sections
              <svg className={`ml-1 h-4 w-4 transition-transform duration-200 ${isSectionsDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {isSectionsDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1">
                <Link href="/shop?section=men" className="block px-4 py-2 hover:bg-gray-100">Men</Link>
                <Link href="/shop?section=women" className="block px-4 py-2 hover:bg-gray-100">Women</Link>
                <Link href="/shop?section=kids" className="block px-4 py-2 hover:bg-gray-100">Kids</Link>
                <Link href="/shop?section=unisex" className="block px-4 py-2 hover:bg-gray-100">Unisex</Link>
              </div>
            )}
          </div>

          <Link href="/cart" className="hover:text-gray-300">Cart</Link>
          <Link href="/orders" className="hover:text-gray-300">Your Orders</Link>
          <Link href="/about" className="hover:text-gray-300">About</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>

          {/* Login/Logout Button */}
          <button onClick={handleAuthAction} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
            {user ? 'Logout' : 'Login'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
