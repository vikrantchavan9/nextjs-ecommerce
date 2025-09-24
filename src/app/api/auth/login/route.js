// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request) {
     try {
          const { email, password } = await request.json();

          const { data, error } = await supabase
               .from("users")
               .select("*")
               .eq("email", email)
               .single();

          if (error || !data) {
               return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
          }

          const match = await bcrypt.compare(password, data.password);
          if (!match) {
               return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
          }

          return NextResponse.json(data);
     } catch (error) {
          return NextResponse.json({ error: "Login failed" }, { status: 500 });
     }
}
