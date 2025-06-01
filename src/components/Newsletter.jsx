// src/components/NewsletterSignup.jsx
'use client'; // This component will have client-side interactivity (useState)

import React, { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setMessageType('');

    if (!email) {
      setMessage('Please enter your email address.');
      setMessageType('error');
      return;
    }

    // Basic email validation (you might want a more robust regex)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    // --- INTEGRATION POINT: Send email to your backend/Supabase/email service ---
    // For demonstration, we'll simulate an API call.
    // In a real application, you'd make a fetch request here:
    // try {
    //   const response = await fetch('/api/subscribe-newsletter', { // Create this API route
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });

    //   if (response.ok) {
    //     setMessage('Thank you for subscribing! Check your inbox for updates.');
    //     setMessageType('success');
    //     setEmail(''); // Clear the input field
    //   } else {
    //     const errorData = await response.json();
    //     setMessage(errorData.message || 'Failed to subscribe. Please try again.');
    //     setMessageType('error');
    //   }
    // } catch (error) {
    //   console.error('Newsletter subscription error:', error);
    //   setMessage('An unexpected error occurred. Please try again later.');
    //   setMessageType('error');
    // }
    // --- END INTEGRATION POINT ---

    // SIMULATED SUCCESS (Remove this and uncomment the above fetch logic for production)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    setMessage('Thank you for subscribing! Check your inbox for exclusive offers.');
    setMessageType('success');
    setEmail(''); // Clear the input field
  };

  return (
    <section className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
          Stay Connected!
        </h2>
        <p className="text-gray-300 mb-8 max-w-prose mx-auto">
          Join our newsletter for exclusive discounts, new product announcements, and style tips straight to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-grow p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Subscribe
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-sm ${messageType === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

export default NewsletterSignup;