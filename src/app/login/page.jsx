'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/'; // Default to homepage

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setIsAuthenticated(true);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath); // Redirect based on initial request
    }
  }, [isAuthenticated]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Auth
        supabaseClient={supabase}
        providers={['google']}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
      />
    </div>
  );
}
