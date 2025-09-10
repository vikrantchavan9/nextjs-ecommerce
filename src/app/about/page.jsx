// src/app/about/page.jsx
import React from 'react';
import Link from 'next/link';
import AboutSection from '@/components/AboutSection'; // Adjust path if needed

// Optional: Team member data (you can expand this)
const teamMembers = [
  {
    id: 1,
    name: 'Jane Doe',
    role: 'Founder & CEO',
    image: 'https://randomuser.me/api/portraits/women/74.jpg', // Placeholder
    bio: 'With a passion for fashion and a vision for accessible style, Jane founded MyStore to bring quality apparel to everyone.'
  },
  {
    id: 2,
    name: 'John Smith',
    role: 'Head of Operations',
    image: 'https://randomuser.me/api/portraits/men/71.jpg', // Placeholder
    bio: 'John ensures every order is processed efficiently and delivered on time, making your shopping experience seamless.'
  },
  {
    id: 3,
    name: 'Emily White',
    role: 'Chief Designer',
    image: 'https://randomuser.me/api/portraits/women/71.jpg', // Placeholder
    bio: 'Emily curates our unique collections, ensuring every piece reflects the latest trends and highest quality standards.'
  },
];


export default function AboutPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section for About Us */}
      <section className="relative h-96 flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517457375827-80fdb7499684?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
        <div className="absolute inset-0 bg-white "></div> {/* Overlay for better text readability */}
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl text-gray-900 sm:text-6xl font-bold mb-4 animate-fade-in-up">
            Our Story
          </h1>
          <p className="text-md md:text-2xl text-gray-800 animate-fade-in-up delay-100">
            Passionately curated fashion for every unique individual.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <AboutSection
        title="Our Mission"
        content="At MyStore, our mission is to empower individuals through fashion by offering a diverse range of high-quality, stylish, and sustainable apparel. We believe that everyone deserves to feel confident and express their unique personality through what they wear, without compromising on comfort or ethical considerations. We are committed to curating collections that inspire and resonate with our global community."
        imageSrc="https://images.pexels.com/photos/9852958/pexels-photo-9852958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        imageAlt="Our Mission"
      />

      {/* Our Vision Section */}
      <section className="bg-gray-800 py-16"> {/* Slightly different background for contrast */}
        <AboutSection
          title="Our Vision"
          content="We envision MyStore as a leading global fashion destination, renowned for its innovative designs, commitment to sustainability, and exceptional customer experience. We strive to create a seamless shopping journey where fashion meets responsibility, fostering a community that values authenticity and individuality. Our goal is to set new benchmarks in the online retail space."
          imageSrc="https://images.pexels.com/photos/4621569/pexels-photo-4621569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          imageAlt="Our Vision"
          reverseOrder={true} // Reverse image and text order
        />
      </section>


      {/* Our Values Section */}
      <AboutSection
        title="Our Values"
        content="Integrity, innovation, and customer satisfaction are at the core of everything we do. We are dedicated to transparency in our processes, fostering creativity in our designs, and ensuring every customer interaction is met with excellence. We value ethical sourcing and strive to minimize our environmental footprint, building a brand that you can trust and feel good about supporting."
        imageSrc="https://images.pexels.com/photos/7691709/pexels-photo-7691709.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        imageAlt="Our Values"
      />

      {/* Meet Our Team Section (Optional) */}
      <section className="bg-gray-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-gray-900 p-6 rounded-lg shadow-xl flex flex-col items-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-gray-700"
                />
                <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-blue-400 text-sm mb-4">{member.role}</p>
                <p className="text-gray-300 text-center text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-900 py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Ready to Discover Your Style?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Explore our diverse collections and find the perfect pieces that reflect your unique personality.
          </p>
          <Link href="/shop" className="inline-block px-10 py-3 bg-blue-600 text-white text-md font-normal rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}