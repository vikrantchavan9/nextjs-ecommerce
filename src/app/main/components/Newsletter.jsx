// src/components/NewsletterSignup.jsx
'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMessage('Please enter a valid email address.');
        setMessageType('error');
        return;
      }

      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));

      // On successful submission
      setMessage('Thank you for subscribing!');
      setMessageType('success');
      setEmail('');

    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
      <div className="grid md:grid-cols-2">
        {/* Left Side: Content */}
        <div className="p-8 md:p-12">
          <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-accent/10 text-accent md:mx-0">
            <Mail size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Join Our Circle
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Get exclusive discounts, new arrivals, and style inspiration delivered right to your inbox. No spam, ever.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col justify-center p-8 bg-background md:p-12">
          <form onSubmit={handleSubmit} className="w-full">
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="flex-grow w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-white/50 text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-bold text-white transition-colors rounded-md shadow-lg bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-accent/50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
          {message && (
            <div className={`flex items-center gap-2 mt-4 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {messageType === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;