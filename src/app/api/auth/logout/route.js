import { supabase } from '@/lib/supabase';

export async function POST() {
     await supabase.auth.signOut();
     return Response.json({ message: 'Logged out successfully' }, { status: 200 });
}
