"use client";

import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSectionsDropdownOpen, setIsSectionsDropdownOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          MyStore
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>

           <Link href="/shop" className="hover:text-gray-300">
            Shop
          </Link>

          {/* Sections Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsSectionsDropdownOpen(true)}
            onMouseLeave={() => setIsSectionsDropdownOpen(false)}
          >
            <button className="hover:text-gray-300 focus:outline-none flex items-center">
              Sections
              <svg
                className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${
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
              <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10">
                <Link href="/shop?section=men" className="block px-4 py-2 hover:bg-gray-100">
                  Men
                </Link>
                <Link href="/shop?section=women" className="block px-4 py-2 hover:bg-gray-100">
                  Women
                </Link>
                <Link href="/shop?section=kids" className="block px-4 py-2 hover:bg-gray-100">
                  Kids
                </Link>
                <Link href="/shop?section=unisex" className="block px-4 py-2 hover:bg-gray-100">
                  Unisex
                </Link>
              </div>
            )}
          </div>

          <Link href="/cart" className="hover:text-gray-300">
            Cart
          </Link>
          <Link href="/order" className="hover:text-gray-300">
            Your Orders
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-300">
            Contact
          </Link>
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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-700 mt-2 p-4">
          <Link href="/" className="block py-2 hover:bg-gray-600 rounded">
            Home
          </Link>
          <Link href="/shop" className="block py-2 hover:bg-gray-600 rounded">
            Explore
          </Link>
          <div className="py-2">
            <button
              onClick={() => setIsSectionsDropdownOpen(!isSectionsDropdownOpen)}
              className="w-full text-left py-2 hover:bg-gray-600 rounded flex items-center justify-between"
            >
              Sections
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
                <Link href="/shop?section=men" className="block py-2 hover:bg-gray-600 rounded">
                  Men
                </Link>
                <Link href="/shop?section=women" className="block py-2 hover:bg-gray-600 rounded">
                  Women
                </Link>
                <Link href="/shop?section=kids" className="block py-2 hover:bg-gray-600 rounded">
                  Kids
                </Link>
                <Link href="/shop?section=unisex" className="block py-2 hover:bg-gray-600 rounded">
                  Unisex
                </Link>
              </div>
            )}
          </div>
          <Link href="/cart" className="block py-2 hover:bg-gray-600 rounded">
            Cart
          </Link>
          <Link href="/order" className="block py-2 hover:bg-gray-600 rounded">
            Your Orders
          </Link>
          <Link href="/about" className="block py-2 hover:bg-gray-600 rounded">
            About
          </Link>
          <Link href="/contact" className="block py-2 hover:bg-gray-600 rounded">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;