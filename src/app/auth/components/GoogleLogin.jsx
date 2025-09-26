"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // only for DB access

export default function GoogleLogin() {
  const router = useRouter();

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-login"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  async function handleCredentialResponse(response) {
    // decode JWT from Google
    const base64Url = response.credential.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedData = JSON.parse(window.atob(base64));

    const email = decodedData.email;
    const name = decodedData.name;

    // check if user exists in our custom table
    let { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!existingUser) {
      // insert new user
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            name,
            email,
            password: null, // no password for Google users
            role: "user",
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError.message);
        return;
      }
      existingUser = newUser;
    }

    // set cookie for role
    document.cookie = `role=${existingUser.role}; path=/`;

    // redirect based on role
    if (existingUser.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/main");
    }
  }

  return <div id="google-login" />;
}
