import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { Book } from '@/types';

export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const activeOnly = searchParams.get('active') !== 'false';

  let query = supabase.from('books').select('*').order('created_at', { ascending: false });

  if (activeOnly) query = query.eq('is_active', true);
  if (category) query = query.eq('category_id', category);
  if (search) query = query.ilike('title', `%${search}%`);

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const body: Omit<Book, 'id'> = await request.json();

  const id = `book-${Date.now()}`;
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('books')
    .insert({ ...body, id, created_at: now, updated_at: now })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
