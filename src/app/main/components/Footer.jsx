'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Twitter, Instagram, Facebook } from 'lucide-react';
import NewsletterSignup from '../components/Newsletter'; // Make sure this path is correct

// Data for the footer links to keep the JSX clean
const footerLinks = {
  shop: [
    { name: 'Tees', href: '/main/shop?category=t-shirt' },
    { name: 'Men', href: '/main/shop?section=men' },
    { name: 'Women', href: 'shop?section=women' },
  ],
  support: [
    { name: 'Track Order', href: '/orders' },
    { name: 'Contact Us', href: '/contact' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Community', href: '/about#community' },
  ],
};

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to a certain amount
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set up event listener for scrolling
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* 1. Newsletter Section */}
      <section className="bg-background py-12">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>

      {/* 2. Main Footer */}
      <footer className="bg-text-primary text-background">
        <div className="container mx-auto px-4 py-16">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-2 pr-8">
              <h3 className="text-2xl font-bold">Celestial Threads</h3>
              <p className="mt-4 text-text-muted max-w-xs">
                Conscious comfort, crafted for you. Timeless apparel that feels good and does good.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-text-muted hover:text-white"><Facebook size={20} /></a>
                <a href="#" className="text-text-muted hover:text-white"><Instagram size={20} /></a>
                <a href="#" className="text-text-muted hover:text-white"><Twitter size={20} /></a>
              </div>
            </div>

            {/* Link Columns */}
            <div>
              <h4 className="font-bold tracking-wider uppercase">Shop</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.shop.map(link => (
                  <li key={link.name}><Link href={link.href} className="text-text-muted hover:text-white transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold tracking-wider uppercase">Support</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.support.map(link => (
                  <li key={link.name}><Link href={link.href} className="text-text-muted hover:text-white transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold tracking-wider uppercase">Company</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.company.map(link => (
                  <li key={link.name}><Link href={link.href} className="text-text-muted hover:text-white transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Sub-Footer */}
        <div className="border-t border-accent/20 py-6">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
            <p>&copy; {new Date().getFullYear()} Celestial Threads. All Rights Reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 4. Back-to-Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-accent text-white p-3 rounded-full shadow-lg hover:bg-accent-dark transition-colors z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;