import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const code = request.nextUrl.searchParams.get('code');

  if (!code) return Response.json({ error: 'Kode tiket wajib diisi.' }, { status: 400 });

  const { data: req, error } = await supabase
    .from('loan_requests')
    .select('*')
    .eq('request_code', code.toUpperCase())
    .single();

  if (error || !req) return Response.json({ error: 'Tiket tidak ditemukan.' }, { status: 404 });

  const { data: items } = await supabase
    .from('loan_items')
    .select('*, book:books(*)')
    .eq('loan_request_id', req.id);

  return Response.json({ ...req, items: items ?? [] });
}
