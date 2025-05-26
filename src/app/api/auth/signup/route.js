import { supabase } from '@/lib/supabase';

export async function POST(req) {
     const { email, password } = await req.json();

     const { user, error } = await supabase.auth.signUp({ email, password });

     if (error) {
          return Response.json({ error: error.message }, { status: 400 });
     }

     return Response.json({ user }, { status: 201 });
}
