// src/components/WhyShopWithUs.jsx
import React from 'react';

// You might want to replace these SVG paths with actual SVG components or icons
// from a library like Heroicons (@heroicons/react) if you have them installed.
// For now, these are simple SVG placeholders.

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18s-3 3-3 5h6c0-2-3-5-3-5z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 014-4h10a4 4 0 014 4v7H3v-7z"></path>
      </svg>
    ),
    title: 'Fast & Free Shipping',
    description: 'Enjoy express delivery on all orders, absolutely free.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v1a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v1m-4 10l-4-4m0 0l-4 4m4-4V3"></path>
      </svg>
    ),
    title: 'Easy Returns & Refunds',
    description: 'Not satisfied? Return your items hassle-free within 30 days.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    ),
    title: '24/7 Customer Support',
    description: 'Our dedicated team is always here to assist you.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.944 12c0 2.879 1.146 5.519 3.04 7.618m-4.016-5.618A11.955 11.955 0 012.944 12c0 2.879 1.146 5.519 3.04 7.618M12 21.056A11.955 11.955 0 0121.056 12c0-2.879-1.146-5.519-3.04-7.618M4.944 12h14.112"></path>
      </svg>
    ),
    title: 'Secure Payments',
    description: 'Shop with confidence using our secure and encrypted payment gateway like RazorPay.',
  },
];

const WhyShopWithUs = () => {
  return (
    <section className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          Why Shop With Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center p-6 rounded-lg bg-gray-800 shadow-xl transition-transform duration-300 hover:scale-105">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm md:text-md text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyShopWithUs;