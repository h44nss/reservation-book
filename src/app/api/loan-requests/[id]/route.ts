import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerClient();
  const { id } = await params;

  const { data: req, error } = await supabase
    .from('loan_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !req) return Response.json({ error: 'Tidak ditemukan.' }, { status: 404 });

  const { data: items } = await supabase
    .from('loan_items')
    .select('*, book:books(*)')
    .eq('loan_request_id', id);

  return Response.json({ ...req, items: items ?? [] });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServerClient();
  const { id } = await params;
  const body: { action: string; note?: string; reason?: string } = await request.json();

  // Fetch current request
  const { data: req, error: fetchError } = await supabase
    .from('loan_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !req) return Response.json({ error: 'Pengajuan tidak ditemukan.' }, { status: 404 });

  const { data: items } = await supabase
    .from('loan_items')
    .select('*, book:books(*)')
    .eq('loan_request_id', id);

  const now = new Date();

  if (body.action === 'approve') {
    if (req.status !== 'Pending') {
      return Response.json({ error: 'Hanya pengajuan Pending yang bisa disetujui.' }, { status: 400 });
    }

    // Check & reserve stock
    for (const item of items ?? []) {
      const book = item.book as { stock_total: number; stock_borrowed: number; stock_reserved: number; title: string };
      const available = book.stock_total - book.stock_borrowed - book.stock_reserved;
      if (available < item.quantity) {
        return Response.json({ error: `Stok "${book.title}" tidak mencukupi untuk disetujui.` }, { status: 400 });
      }
      await supabase
        .from('books')
        .update({
          stock_reserved: book.stock_reserved + item.quantity,
          updated_at: now.toISOString(),
        })
        .eq('id', item.book_id);
    }

    const pickupDeadline = new Date(now.getTime() + 48 * 3600 * 1000);
    const { error } = await supabase
      .from('loan_requests')
      .update({
        status: 'Approved',
        admin_note: body.note ?? 'Pengajuan Anda telah disetujui. Silakan ambil buku di loket.',
        pickup_deadline: pickupDeadline.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', id);

    if (error) return Response.json({ error: error.message }, { status: 500 });

  } else if (body.action === 'reject') {
    if (!['Pending', 'Approved'].includes(req.status)) {
      return Response.json({ error: 'Status tidak bisa ditolak.' }, { status: 400 });
    }

    // Release reserved stock if was approved
    if (req.status === 'Approved') {
      for (const item of items ?? []) {
        const book = item.book as { stock_reserved: number };
        await supabase
          .from('books')
          .update({
            stock_reserved: Math.max(0, book.stock_reserved - item.quantity),
            updated_at: now.toISOString(),
          })
          .eq('id', item.book_id);
      }
    }

    const { error } = await supabase
      .from('loan_requests')
      .update({
        status: 'Rejected',
        admin_note: body.reason ?? 'Pengajuan ditolak.',
        updated_at: now.toISOString(),
      })
      .eq('id', id);

    if (error) return Response.json({ error: error.message }, { status: 500 });

  } else if (body.action === 'handover') {
    if (req.status !== 'Approved') {
      return Response.json({ error: 'Hanya pengajuan Approved yang bisa diserahkan.' }, { status: 400 });
    }

    // Move: reserved -> borrowed
    for (const item of items ?? []) {
      const book = item.book as { stock_reserved: number; stock_borrowed: number };
      await supabase
        .from('books')
        .update({
          stock_reserved: Math.max(0, book.stock_reserved - item.quantity),
          stock_borrowed: book.stock_borrowed + item.quantity,
          updated_at: now.toISOString(),
        })
        .eq('id', item.book_id);
    }

    const dueDate = new Date(now.getTime() + 7 * 86400 * 1000);
    const { error } = await supabase
      .from('loan_requests')
      .update({
        status: 'Borrowed',
        borrowed_at: now.toISOString(),
        due_date: dueDate.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', id);

    if (error) return Response.json({ error: error.message }, { status: 500 });

  } else if (body.action === 'return') {
    if (req.status !== 'Borrowed') {
      return Response.json({ error: 'Hanya buku yang sedang dipinjam yang bisa dikembalikan.' }, { status: 400 });
    }

    // Release borrowed stock
    for (const item of items ?? []) {
      const book = item.book as { stock_borrowed: number };
      await supabase
        .from('books')
        .update({
          stock_borrowed: Math.max(0, book.stock_borrowed - item.quantity),
          updated_at: now.toISOString(),
        })
        .eq('id', item.book_id);
    }

    const { error } = await supabase
      .from('loan_requests')
      .update({
        status: 'Returned',
        returned_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', id);

    if (error) return Response.json({ error: error.message }, { status: 500 });

  } else {
    return Response.json({ error: 'Aksi tidak dikenal.' }, { status: 400 });
  }

  // Return updated request with items
  const { data: updatedReq } = await supabase
    .from('loan_requests')
    .select('*')
    .eq('id', id)
    .single();

  const { data: updatedItems } = await supabase
    .from('loan_items')
    .select('*, book:books(*)')
    .eq('loan_request_id', id);

  return Response.json({ ...updatedReq, items: updatedItems ?? [] });
}
