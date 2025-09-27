'use client';

import Link from "next/link";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Import your actual components
import ProductCard from "../shop/components/ProductCard";
import NewsletterSignup from "./Newsletter";

import heroicon from "@/assets/images/heroicon.jpg";
import { ArrowRight, Star, Truck, ShieldCheck, MessageSquareHeart } from "lucide-react";

// A reusable component for scroll-triggered animations
const AnimatedSection = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// The component now accepts `products` as a prop
export default function HomepageClient({ products }) {
  const features = [
    { icon: <Truck size={32} />, title: "Sustainable Shipping", description: "Every order is packaged and shipped with the planet in mind." },
    { icon: <ShieldCheck size={32} />, title: "Lasting Quality", description: "Timeless pieces crafted from materials designed to endure." },
    { icon: <MessageSquareHeart size={32} />, title: "Community Focused", description: "Proudly supporting artisans and makers with every purchase." },
  ];

  return (
    <div className="bg-background text-text-primary">
      {/* 1. Full-Height Hero Section */}
      <section className="relative flex items-center min-h-screen px-4 py-6 overflow-hidden">
        <div className="container grid items-center grid-cols-1 gap-12 mx-auto md:grid-cols-2">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Conscious Comfort, Crafted for You.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-md mx-auto mt-4 text-lg md:mx-0 text-text-muted"
            >
              Discover timeless apparel that feels good and does good. Thoughtfully designed for the modern minimalist.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8"
            >
              <Link href="/main/shop" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white transition-colors rounded-full shadow-lg bg-accent hover:bg-accent-dark">
                Explore The Collection <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
          
          {/* Asymmetrical "Scrapbook" Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1]}}
            className="relative w-full h-full min-h-[300px] md:min-h-[500px]"
          >
            <div className="absolute top-0 left-0 w-4/5 h-4/5 bg-accent/20 rounded-2xl -rotate-6"></div>
            <div className="absolute bottom-0 right-0 w-full h-full overflow-hidden shadow-2xl rounded-2xl rotate-3">
              <Image src="https://images.unsplash.com/photo-1666358071025-37e33a56a596?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="homepage-thumbnail" fill style={{ objectFit: 'cover' }} priority />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main>
        {/* ... (rest of the sections: Features, Products, Testimonials etc.) ... */}
         {/* 2. Feature Highlights Section */}
        <AnimatedSection>
          <section className="container px-4 py-20 mx-auto text-center md:py-32">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why You'll Love It Here</h2>
            <p className="max-w-2xl mx-auto mt-4 text-text-muted">We believe in quality, sustainability, and exceptional design.</p>
            <div className="grid grid-cols-1 gap-12 mt-16 md:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center p-8 transition-transform transform bg-white border shadow-sm rounded-xl border-accent/10 hover:-translate-y-2">
                  <div className="p-4 rounded-full bg-accent/10 text-accent">{feature.icon}</div>
                  <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-text-muted">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
        
        {/* 3. Featured Products (Interactive) */}
        <AnimatedSection>
          <section className="container px-4 py-20 mx-auto md:py-32">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Freshly Curated</h2>
              <Link href="/main/shop" className="font-bold text-accent hover:text-accent-dark">
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
              {Array.isArray(products) && products.length > 0 ? (
                products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-center text-text-muted">No products available at the moment.</p>
              )}
            </div>
          </section>
        </AnimatedSection>
        
        {/* 4. Social Proof / Testimonials */}
        <AnimatedSection>
          <section className="px-4 py-20 overflow-hidden bg-white md:py-32">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-center md:text-4xl">Words From Our Community</h2>
              {/* On mobile, this will be a horizontally scrollable container */}
              <div className="flex gap-8 pb-4 mt-16 overflow-x-auto">
                {/* Dummy Testimonials - Replace with your data */}
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col flex-shrink-0 w-4/5 p-8 border shadow-lg bg-background rounded-xl md:w-1/3 border-accent/10">
                    <div className="flex text-accent">{[...Array(5)].map((_, j) => <Star key={j} fill="currentColor" />)}</div>
                    <p className="mt-4 text-lg font-medium">"This is the best purchase I've made all year. The quality is simply unmatched and I feel great wearing it."</p>
                    <p className="mt-6 font-bold">- Alex Johnson</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>
    </div>
  );
}