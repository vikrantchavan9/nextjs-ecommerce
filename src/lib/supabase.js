// lib/supabaseClient.js
// Updated to use @supabase/auth-helpers-nextjs for client-side components

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Export a function that creates the client.
// This is necessary because createClientComponentClient needs to be called
// within a component or hook where the window object is available,
// or at least when it's clear it's running in a client environment.
// For consistency and future-proofing (e.g., if you ever move to server components
// that need a different client for auth), this is a good pattern.
export const getSupabaseClient = () => {
     if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase URL or Key is not defined in environment variables.');
     }
     return createClientComponentClient({ supabaseUrl, supabaseKey });
};

// If you need a direct 'supabase' export for convenience (e.g., for Auth UI),
// you can still do this, but be mindful of SSR contexts.
// The Auth UI component typically requires a direct client instance.
// For auth-ui, createClientComponentClient is also okay.
// However, the best practice is to pass a client created within a 'use client' component.
// For simplicity with your current Auth UI usage, we'll keep a direct export,
// but ensure it's compatible with client-side execution.

// This 'supabase' instance will be the one used by your loginClient.jsx
// and should now properly interact with cookies.
export const supabase = createClientComponentClient({
     supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
     supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});