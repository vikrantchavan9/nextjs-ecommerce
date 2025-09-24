// src/app/signup/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signUp(name, email, password, "user"); // default role user
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Signup
        </button>
      </form>
    </div>
  );
}
