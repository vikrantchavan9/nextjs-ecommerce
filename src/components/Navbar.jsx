'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Menu, X, ShoppingCart, User, Globe, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSectionsDropdownOpen, setIsSectionsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    // Close mobile menu after action
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsSectionsDropdownOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-lg font-sans">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          MyStore
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/shop" className="hover:text-gray-300 transition-colors">Browse Products</Link>
          <Link href="/orders" className="hover:text-gray-300 transition-colors">My Orders</Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Go to cart">
            <ShoppingCart className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
          </Link>
          <button
            onClick={handleAuthAction}
            className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-full font-medium transition-colors hover:bg-gray-600"
          >
            <User size={18} />
            <span>{user ? 'Logout' : 'Login'}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Go to cart">
            <ShoppingCart className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-white focus:outline-none p-2 rounded-full transition-colors duration-300 hover:bg-gray-700"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        ref={menuRef}
        className={`fixed inset-y-0 right-0 w-64 bg-gray-900 shadow-lg p-6 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-full text-white hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex flex-col space-y-4 text-lg">
          <Link href="/" className="flex items-center space-x-3 py-3 rounded-lg hover:bg-gray-800 transition-colors" onClick={handleLinkClick}>
            <Globe className="w-5 h-5 text-gray-400" />
            <span>Home</span>
          </Link>
          <Link href="/shop" className="flex items-center space-x-3 py-3 rounded-lg hover:bg-gray-800 transition-colors" onClick={handleLinkClick}>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            <span>Browse Products</span>
          </Link>
          <Link href="/orders" className="flex items-center space-x-3 py-3 rounded-lg hover:bg-gray-800 transition-colors" onClick={handleLinkClick}>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            <span>My Orders</span>
          </Link>
          <Link href="/about" className="flex items-center space-x-3 py-3 rounded-lg hover:bg-gray-800 transition-colors" onClick={handleLinkClick}>
            <Globe className="w-5 h-5 text-gray-400" />
            <span>About</span>
          </Link>
          <Link href="/contact" className="flex items-center space-x-3 py-3 rounded-lg hover:bg-gray-800 transition-colors" onClick={handleLinkClick}>
            <Globe className="w-5 h-5 text-gray-400" />
            <span>Contact</span>
          </Link>

          {/* Sections Dropdown */}
          <button
            onClick={() => setIsSectionsDropdownOpen(!isSectionsDropdownOpen)}
            className="w-full text-left py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <span>Browse by Section</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isSectionsDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div 
            className={`flex flex-col pl-6 transition-all duration-300 ease-in-out overflow-hidden ${isSectionsDropdownOpen ? 'max-h-48' : 'max-h-0'}`}
          >
            <Link href="/shop?section=men" className="py-2 rounded-lg hover:bg-gray-800" onClick={handleLinkClick}>Men</Link>
            <Link href="/shop?section=women" className="py-2 rounded-lg hover:bg-gray-800" onClick={handleLinkClick}>Women</Link>
            <Link href="/shop?section=kids" className="py-2 rounded-lg hover:bg-gray-800" onClick={handleLinkClick}>Kids</Link>
            <Link href="/shop?section=unisex" className="py-2 rounded-lg hover:bg-gray-800" onClick={handleLinkClick}>Unisex</Link>
          </div>

          <button 
            onClick={handleAuthAction} 
            className="flex items-center justify-center space-x-2 bg-gray-700 text-white font-medium py-3 rounded-full transition-colors hover:bg-gray-600 mt-4"
          >
            <User size={18} />
            <span>{user ? 'Logout' : 'Login'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
