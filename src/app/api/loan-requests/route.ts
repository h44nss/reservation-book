import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// Helper: fetch loan request with items + books joined
async function fetchLoanRequestById(supabase: ReturnType<typeof createServerClient>, id: string) {
  const { data: req, error } = await supabase
    .from('loan_requests')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !req) return null;

  const { data: items } = await supabase
    .from('loan_items')
    .select('*, book:books(*)')
    .eq('loan_request_id', id);

  return { ...req, items: items ?? [] };
}

export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');

  let query = supabase
    .from('loan_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data: requests, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Fetch items for each request
  const withItems = await Promise.all(
    (requests ?? []).map(async (req) => {
      const { data: items } = await supabase
        .from('loan_items')
        .select('*, book:books(*)')
        .eq('loan_request_id', req.id);
      return { ...req, items: items ?? [] };
    })
  );

  return Response.json(withItems);
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const body: {
    borrower_name: string;
    phone: string;
    email?: string;
    items: { book_id: string; quantity: number }[];
  } = await request.json();

  if (!body.borrower_name || !body.phone || !body.items?.length) {
    return Response.json({ error: 'Data tidak lengkap.' }, { status: 400 });
  }

  // Check stock availability for each item
  for (const item of body.items) {
    const { data: book } = await supabase
      .from('books')
      .select('stock_total, stock_borrowed, stock_reserved, title')
      .eq('id', item.book_id)
      .single();

    if (!book) {
      return Response.json({ error: `Buku ID ${item.book_id} tidak ditemukan.` }, { status: 400 });
    }
    const available = book.stock_total - book.stock_borrowed - book.stock_reserved;
    if (available < item.quantity) {
      return Response.json({ error: `Stok "${book.title}" tidak mencukupi.` }, { status: 400 });
    }
  }

  // Generate request code
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const request_code = `LIB-${randomNum}-${randomChar}`;
  const id = `req-${Date.now()}`;
  const now = new Date().toISOString();

  // Insert loan request
  const { data: newReq, error: reqError } = await supabase
    .from('loan_requests')
    .insert({
      id,
      request_code,
      borrower_name: body.borrower_name,
      phone: body.phone,
      email: body.email ?? null,
      status: 'Pending',
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (reqError) return Response.json({ error: reqError.message }, { status: 500 });

  // Insert loan items
  const loanItems = body.items.map((item, i) => ({
    id: `item-${Date.now()}-${i}`,
    loan_request_id: id,
    book_id: item.book_id,
    quantity: item.quantity,
    created_at: now,
  }));

  const { error: itemsError } = await supabase.from('loan_items').insert(loanItems);
  if (itemsError) return Response.json({ error: itemsError.message }, { status: 500 });

  const result = await fetchLoanRequestById(supabase, id);
  return Response.json(result, { status: 201 });
}
