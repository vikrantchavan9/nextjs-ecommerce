// src/app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request) {
     try {
          const { name, email, password, role = "user" } = await request.json();

          const hashedPassword = await bcrypt.hash(password, 10);

          const { data, error } = await supabase
               .from("users")
               .insert([{ name, email, password: hashedPassword, role }])
               .select()
               .single();

          if (error) {
               return NextResponse.json({ error: error.message }, { status: 400 });
          }

          return NextResponse.json(data);
     } catch (error) {
          return NextResponse.json({ error: "Signup failed" }, { status: 500 });
     }
}
