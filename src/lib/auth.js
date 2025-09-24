// src/lib/auth.js
import { supabase } from "./supabase";

export async function loginWithGoogle() {
     const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
               redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
          },
     });

     if (error) throw error;
     return data;
}

export async function handleOAuthCallback() {
     console.log('=== OAUTH CALLBACK STARTED ===');

     const { data, error } = await supabase.auth.getUser();
     console.log('Supabase auth user:', { data, error });

     if (error || !data?.user) throw new Error("OAuth user not found");

     const { email, user_metadata } = data.user;
     console.log('User email from OAuth:', email);
     console.log('User metadata:', user_metadata);

     let { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

     console.log('Database user lookup:', { existingUser, fetchError });

     if (fetchError || !existingUser) {
          console.log('Creating new user...');
          const { data: newUser, error: insertError } = await supabase
               .from("users")
               .insert([
                    {
                         name: user_metadata.full_name || "Google User",
                         email,
                         password: null,
                         role: "user",
                    },
               ])
               .select()
               .single();

          if (insertError) throw insertError;
          existingUser = newUser;
          console.log('New user created:', existingUser);
     }

     console.log('=== SETTING COOKIES ===');
     console.log('User ID to set:', existingUser.id);
     console.log('User role to set:', existingUser.role);
     console.log('User ID type:', typeof existingUser.id);

     // Set both cookies
     document.cookie = `role=${existingUser.role}; path=/; max-age=${7 * 24 * 60 * 60}`;
     document.cookie = `userId=${existingUser.id}; path=/; max-age=${7 * 24 * 60 * 60}`;

     console.log('Cookies after setting:', document.cookie);

     // Verify cookies were set
     const roleCheck = document.cookie.split('; ').find(row => row.startsWith('role='));
     const userIdCheck = document.cookie.split('; ').find(row => row.startsWith('userId='));
     console.log('Role cookie check:', roleCheck);
     console.log('UserId cookie check:', userIdCheck);

     console.log('=== OAUTH CALLBACK COMPLETED ===');
     return existingUser;
}



export async function signUp(name, email, password, role = "user") {
     // Move bcrypt to API route as mentioned before
     const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role })
     });

     if (!response.ok) throw new Error('Signup failed');
     const data = await response.json();

     // FIX: Set BOTH cookies after signup
     document.cookie = `role=${data.role}; path=/; max-age=${7 * 24 * 60 * 60}`;
     document.cookie = `userId=${data.id}; path=/; max-age=${7 * 24 * 60 * 60}`;

     return data;
}

export async function login(email, password) {
     console.log('=== EMAIL LOGIN STARTED ===');
     console.log('Login attempt for email:', email);

     const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

     console.log('Database query result:', { data, error });

     if (error || !data) {
          console.error('User not found or error:', error);
          throw new Error("Invalid credentials");
     }

     console.log('User found:', data);
     console.log('All fields in user data:', Object.keys(data));
     console.log('User ID field:', data.id);
     console.log('User Role field:', data.role);

     // Check what the ID field is actually called
     if (!data.id && data.user_id) {
          console.log('Using user_id instead of id:', data.user_id);
     }

     // Password validation with bcrypt...
     // (Your existing password validation code here)

     // Set both cookies - use the correct ID field
     const userId = data.id || data.user_id || data.User_id; // Try different possible names
     console.log('Setting userId cookie with value:', userId);
     console.log('Setting role cookie with value:', data.role);

     document.cookie = `role=${data.role}; path=/; max-age=${7 * 24 * 60 * 60}`;
     document.cookie = `userId=${userId}; path=/; max-age=${7 * 24 * 60 * 60}`;

     console.log('Cookies after setting:', document.cookie);
     console.log('=== EMAIL LOGIN COMPLETED ===');

     return data;
}



export function logout() {
     // FIX: Clear BOTH cookies
     document.cookie = "role=; Max-Age=0; path=/";
     document.cookie = "userId=; Max-Age=0; path=/";
}
