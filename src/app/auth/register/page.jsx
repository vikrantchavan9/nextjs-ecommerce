"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth";
import { Loader2, AlertTriangle } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // UI STATE: For button loading
  const router = useRouter();

  // LOGIC PRESERVED: Your original signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signUp(name, email, password, "user");
      router.push("/auth/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-black/5">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-text-primary">Create an Account</h1>

        </div>

        {error && (
          <div className="flex items-center gap-3 p-3 mt-6 text-sm bg-red-500/10 text-red-700 border border-red-500/20 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="block w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-background text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="block w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-background text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              className="block w-full px-4 py-3 text-base duration-200 border rounded-md shadow-sm appearance-none bg-background text-text-primary border-accent/20 placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <p className="mt-2 text-text-muted">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-accent hover:text-accent-dark">
              Log in
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 font-bold text-white transition-colors rounded-full shadow-lg bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-accent/50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}