'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function LoginPage() {
     const router = useRouter();

     useEffect(() => {
          const checkUser = async () => {
               const { data: { user } } = await supabase.auth.getUser();
               if (user) router.push('/shop'); // Redirect if logged in
          };
          checkUser();
     }, []);

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
