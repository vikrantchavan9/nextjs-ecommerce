'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signInWithGoogle } from '@/lib/auth';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const user = await signIn(email, password);
    if (user?.error) {
      setError(user.error);
    } else {
      router.push('/'); // Redirect after login
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-black">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2">
          Sign In
        </button>
      </form>
      <button onClick={signInWithGoogle} className="mt-2 w-full bg-red-600 text-white py-2">
        Sign in with Google
      </button>
    </div>
  );
}
