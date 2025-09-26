// components/Navbar.jsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { logout } from '@/lib/auth';
import { useScrollDirection } from '../hooks/useScrollDirection';

import {
  Menu, X, ShoppingCart, User, LogIn, LogOut, UserCheck
} from 'lucide-react';

// Define navigation items for easier management
const navItems = [
  { name: 'Shop', href: '/main/shop' },
  { name: 'Orders', href: '/main/orders' },
  { name: 'Profile', href: '/main/profile' },
  { name: 'About', href: '/main/about' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const scrollDirection = useScrollDirection();

  // --- Side Effects ---
  useEffect(() => {
    // Check for user role from cookie
    const roleCookie = document.cookie.split('; ').find(row => row.startsWith('role='));
    setUser(roleCookie ? { role: roleCookie.split('=')[1] } : null);
  }, []);

  useEffect(() => {
    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Handlers ---
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  const handleAuthAction = async () => {
    if (user) {
      await logout();
      setUser(null);
      router.push("/auth/login");
    } else {
      router.push("/auth/login");
    }
    closeAllMenus();
  };
  
  // --- Render ---
  return (
    <>
      <header
        className={clsx(
          'fixed top-4 left-0 right-0 z-50 mx-auto w-[98%] max-w-screen-xl transition-transform duration-300',
          { 'translate-y-[-200%]': scrollDirection === 'down' }
        )}
      >
        <nav className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/40 p-4 shadow-lg backdrop-blur-md">
          {/* Logo */}
          <Link href="/main" className="text-xl font-bold tracking-tight text-slate-800">
            Celestial Threads
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'relative text-sm font-medium text-slate-600 transition-colors hover:text-slate-900',
                  { 'text-slate-900': pathname === item.href }
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <motion.span
                    layoutId="underline"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-slate-900"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Actions: Cart, User */}
          <div className="flex items-center gap-2">
            <Link href="/main/cart" aria-label="Open cart" className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900">
              <ShoppingCart size={20} />
            </Link>
            
            {user ? (
              // MODIFIED: Added `hidden md:block` to hide on mobile
              <div ref={dropdownRef} className="relative hidden md:block">
                <button
                  onClick={() => setIsUserDropdownOpen(prev => !prev)}
                  aria-label="User menu"
                  className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                >
                  <UserCheck size={20} />
                </button>
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-slate-200 bg-white shadow-lg"
                    >
                      <Link href="/main/profile" onClick={closeAllMenus} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                        <User size={16} /> Profile
                      </Link>
                      <button onClick={handleAuthAction} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // MODIFIED: Changed `sm:flex` to `md:flex` to hide on mobile
              <button onClick={handleAuthAction} className="hidden items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 md:flex">
                <LogIn size={16} />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-200 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Curtain */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl text-slate-800 font-bold">Celestial Threads</span>
                <button onClick={toggleMobileMenu} aria-label="Close menu" className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-200">
                  <X size={20} />
                </button>
              </div>
              <div className="mt-8 flex flex-col gap-4">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={toggleMobileMenu}
                      className="block rounded-lg px-4 py-3 text-lg font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                 <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <button onClick={handleAuthAction} className="flex w-full items-center gap-3 rounded-lg bg-slate-800 px-4 py-3 text-lg font-semibold text-white transition-colors hover:bg-slate-700">
                      {user ? <><LogOut size={20} /> Logout</> : <><LogIn size={20} /> Login</>}
                    </button>
                  </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}