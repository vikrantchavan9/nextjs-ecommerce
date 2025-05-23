// app/api/test/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
     const { data, error } = await supabase.from('products').select('*').limit(1);
     if (error) {
          console.error(error);
          return NextResponse.json({ error: error.message }, { status: 500 });
     }
     return NextResponse.json({ message: 'Success!', product: data });
}
