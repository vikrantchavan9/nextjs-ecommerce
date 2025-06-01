import { supabase } from './supabase';

// Email Sign-Up
export async function signUp(email, password) {
     const { user, error } = await supabase.auth.signUp({ email, password });
     return { user, error };
}

// Email Login
export async function signIn(email, password) {
     const { user, error } = await supabase.auth.signInWithPassword({ email, password });
     return { user, error };
}

// Google OAuth Login
export async function signInWithGoogle() {
     const { user, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
     return { user, error };
}

// Logout
export async function signOut() {
     await supabase.auth.signOut();
}
