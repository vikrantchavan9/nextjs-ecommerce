'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote, Rocket, Store, Users, Leaf, Heart } from 'lucide-react';

// Reusable component for scroll-triggered animations
const AnimatedSection = ({ children, className = '' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- DATA (Replace with your own) ---
const teamMembers = [
  {
    name: 'Jane Doe',
    role: 'Founder & Visionary',
    image: 'https://images.unsplash.com/photo-1694215685811-62b2972e3f68?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    fact: 'Loves hiking with her golden retriever, Sunny.',
  },
  {
    name: 'John Smith',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    fact: 'An amateur barista who makes the best coffee in the office.',
  },
  {
    name: 'Emily White',
    role: 'Lead Designer',
    image: 'https://images.unsplash.com/photo-1675904628456-aa3cdcb3daab?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    fact: 'Finds inspiration in vintage films and architecture.',
  },
];

const timelineEvents = [
    { year: '2021', title: 'The Spark', description: 'Jane sketches the first designs in her notebook, dreaming of a better way to create fashion.', icon: <Rocket /> },
    { year: '2022', title: 'We Launched!', description: 'Celestial Threads opens its digital doors, shipping the first 100 orders from a small garage.', icon: <Store /> },
    { year: '2023', title: 'Our First Hire', description: 'John joins the team, bringing order to the beautiful chaos of a growing brand.', icon: <Users /> },
    { year: '2025', title: 'Our Mission Today', description: 'Continuing to build a community around conscious comfort and timeless style.', icon: <Heart /> },
];

export default function AboutPage() {
  return (
    <div className="bg-background text-text-primary">
      {/* 1. HERO SECTION (The Hook) */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">More Than Just Clothes.</h1>
            <p className="mt-4 text-lg text-text-muted">We're a community dedicated to conscious comfort and timeless style, crafting pieces that tell a story—yours and ours.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="relative h-80 md:h-[500px]"
          >
            <div className="absolute top-0 right-0 w-4/5 h-4/5 bg-accent/20 rounded-2xl rotate-6"></div>
            <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden shadow-2xl rounded-2xl -rotate-3">
              <Image src="https://images.unsplash.com/photo-1716541424893-734612ddcabb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Behind the scenes of the brand" fill style={{ objectFit: 'cover' }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FOUNDER'S STORY (The Origin) */}
      <AnimatedSection className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-4 grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-2">
                 <div className="relative w-full aspect-square shadow-xl rounded-lg overflow-hidden rotate-2">
                    <Image src={teamMembers[0].image} alt="Founder Jane Doe" fill style={{ objectFit: 'cover' }} />
                 </div>
            </div>
            <div className="md:col-span-3">
                <Quote className="text-accent/30 w-16 h-16" />
                <p className="text-2xl md:text-3xl font-medium text-text-primary mt-4">"I started Celestial Threads because I was tired of choosing between style and sustainability. I wanted to create something beautiful that people could feel genuinely good about wearing—a piece of art with a conscience."</p>
                <p className="mt-6 font-bold text-text-primary">- Jane Doe, Founder</p>
            </div>
        </div>
      </AnimatedSection>
      
      {/* 3. INTERACTIVE TIMELINE (The Journey) */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-16">Our Journey So Far</h2>
        <div className="relative max-w-2xl mx-auto">
          {/* The line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-accent/20 -translate-x-1/2"></div>
          {timelineEvents.map((event, index) => (
            <AnimatedSection key={index}>
              <div className={`relative mb-12 flex w-full items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <p className="text-sm font-semibold text-accent">{event.year}</p>
                  <h3 className="text-xl font-bold text-text-primary mt-1">{event.title}</h3>
                  <p className="text-text-muted mt-2">{event.description}</p>
                </div>
                 {/* The dot and icon */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="flex items-center justify-center w-12 h-12 bg-background border-2 border-accent rounded-full">
                        <div className="text-accent">{event.icon}</div>
                    </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* 4. OUR VALUES (The "Why") */}
      <AnimatedSection className="bg-white py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold">What We Stand For</h2>
              <div className="grid md:grid-cols-3 gap-12 mt-16 max-w-5xl mx-auto">
                  <div className="flex flex-col items-center">
                      <div className="p-4 rounded-full bg-accent/10 text-accent"><Leaf size={32}/></div>
                      <h3 className="mt-4 text-xl font-bold">Sustainability</h3>
                      <p className="mt-2 text-text-muted">Mindfully sourced materials and eco-friendly practices are at the core of everything we create.</p>
                  </div>
                   <div className="flex flex-col items-center">
                      <div className="p-4 rounded-full bg-accent/10 text-accent"><Heart size={32}/></div>
                      <h3 className="mt-4 text-xl font-bold">Authenticity</h3>
                      <p className="mt-2 text-text-muted">We celebrate real style for real people, embracing imperfection and genuine self-expression.</p>
                  </div>
                   <div className="flex flex-col items-center">
                      <div className="p-4 rounded-full bg-accent/10 text-accent"><Users size={32}/></div>
                      <h3 className="mt-4 text-xl font-bold">Community</h3>
                      <p className="mt-2 text-text-muted">We're more than a brand; we're a collective of individuals connected by shared values and style.</p>
                  </div>
              </div>
          </div>
      </AnimatedSection>

      {/* 5. MEET THE TEAM (The People) */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-16">The People Behind the Seams</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
                <AnimatedSection key={member.name} className="group text-center">
                    <div className="relative w-full aspect-square mx-auto overflow-hidden rounded-lg shadow-lg">
                        <Image src={member.image} alt={member.name} fill style={{ objectFit: 'cover' }} className="transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
                    <p className="text-accent font-semibold">{member.role}</p>
                    <p className="text-text-muted mt-2 text-sm">{member.fact}</p>
                </AnimatedSection>
            ))}
        </div>
      </section>
    </div>
  );
}