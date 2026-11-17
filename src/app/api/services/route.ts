import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('services').select('*').order('id');
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
