"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleOAuthCallback } from "@/lib/auth";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function processOAuth() {
      try {
        const user = await handleOAuthCallback();
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("OAuth error:", err.message);
        router.push("/login");
      }
    }
    processOAuth();
  }, [router]);

  return <p className="p-10">Signing you in with Google...</p>;
}
