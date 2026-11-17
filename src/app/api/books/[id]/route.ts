import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { Book } from '@/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerClient();
  const { id } = await params;

  const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
  if (error) return Response.json({ error: 'Buku tidak ditemukan.' }, { status: 404 });
  return Response.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerClient();
  const { id } = await params;
  const body: Partial<Book> = await request.json();

  const { data, error } = await supabase
    .from('books')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerClient();
  const { id } = await params;
  const body: { is_active?: boolean } & Partial<Book> = await request.json();

  const { data, error } = await supabase
    .from('books')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
