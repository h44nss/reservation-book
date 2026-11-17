'use client';

import React, { useState } from 'react';
import { useLibrary, getAvailableStock } from '@/context/library-context';
import { AdminLayout } from '@/components/layout/admin-layout';
import { BookCover } from '@/components/ui/book-cover';
import { Book } from '@/types';
import {
  Plus,
  Search,
  X,
} from 'lucide-react';

export default function AdminBooksPage() {
  const { books, categories, adminAddBook, adminUpdateBook, adminToggleBookActive } = useLibrary();

  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPublisher, setNewPublisher] = useState('');
  const [newYear, setNewYear] = useState<number>(2024);
  const [newIsbn, setNewIsbn] = useState('');
  const [newCatId, setNewCatId] = useState(categories[0]?.id || '');
  const [newStock, setNewStock] = useState<number>(3);
  const [newDesc, setNewDesc] = useState('');
  const [newCover, setNewCover] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800');
  const [newBadge, setNewBadge] = useState<Book['badge']>('Baru');

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;

    const cat = categories.find((c) => c.id === newCatId);

    await adminAddBook({
      title: newTitle.trim(),
      author: newAuthor.trim(),
      publisher: newPublisher.trim() || 'Pustaka Mandiri',
      publication_year: Number(newYear) || 2024,
      isbn: newIsbn.trim() || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      category_id: newCatId,
      category_name: cat?.name || 'Umum',
      stock_total: Number(newStock) || 1,
      stock_borrowed: 0,
      stock_reserved: 0,
      is_active: true,
      description: newDesc.trim() || 'Deskripsi buku belum ditambahkan.',
      cover_image: newCover.trim(),
      badge: newBadge,
    });

    showFeedback(`Buku "${newTitle}" berhasil ditambahkan ke katalog!`);
    setIsAddOpen(false);

    setNewTitle('');
    setNewAuthor('');
    setNewDesc('');
  };

  const filteredBooks = books.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q) ||
      b.category_name.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              INVENTARIS FISIK
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
              Manajemen Koleksi Buku
            </h1>
            <p className="text-xs text-slate-500">
              Kelola judul buku, penyesuaian stok fisik, dan status aktif publik.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162C21] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Judul Buku Baru</span>
          </button>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            {feedback}
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan judul, penulis, atau ISBN..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3A2B] shadow-xs"
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold text-slate-500 uppercase text-[10px]">
                  <th className="py-3.5 px-4">Cover & Judul</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Tahun</th>
                  <th className="py-3.5 px-4 text-center">Total Fisik</th>
                  <th className="py-3.5 px-4 text-center">Reserved</th>
                  <th className="py-3.5 px-4 text-center">Dipinjam</th>
                  <th className="py-3.5 px-4 text-center">Tersedia</th>
                  <th className="py-3.5 px-4">Status Publik</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.map((book) => {
                  const available = getAvailableStock(book);
                  return (
                    <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-12 rounded overflow-hidden shrink-0 border border-slate-200">
                            <BookCover
                              src={book.cover_image}
                              title={book.title}
                              author={book.author}
                              categoryName={book.category_name}
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate max-w-xs">{book.title}</h4>
                            <p className="text-[11px] text-slate-500 truncate">{book.author}</p>
                            <span className="text-[10px] text-slate-400">ISBN: {book.isbn}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {book.category_name}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {book.publication_year}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                        {book.stock_total}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-amber-700">
                        {book.stock_reserved}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-blue-700">
                        {book.stock_borrowed}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            available > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {available}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => adminToggleBookActive(book.id)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors ${
                            book.is_active
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {book.is_active ? '● Aktif' : '○ Nonaktif'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              adminUpdateBook(book.id, {
                                stock_total: book.stock_total + 1,
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium"
                            title="Tambah 1 Stok Fisik"
                          >
                            +1 Stok
                          </button>
                          {book.stock_total > book.stock_borrowed + book.stock_reserved && (
                            <button
                              onClick={() =>
                                adminUpdateBook(book.id, {
                                  stock_total: Math.max(1, book.stock_total - 1),
                                })
                              }
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium"
                              title="Kurangi 1 Stok Fisik"
                            >
                              -1
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Book Modal */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-lg">
                  Tambah Judul Buku Baru
                </h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 mb-1 font-bold">Judul Buku *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Contoh: Sang Pemimpi"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E3A2B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Penulis *</label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Contoh: Andrea Hirata"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E3A2B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Penerbit</label>
                    <input
                      type="text"
                      value={newPublisher}
                      onChange={(e) => setNewPublisher(e.target.value)}
                      placeholder="Contoh: Bentang Pustaka"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E3A2B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Kategori</label>
                    <select
                      value={newCatId}
                      onChange={(e) => setNewCatId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E3A2B] focus:bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Jumlah Stok Fisik</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E3A2B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Tahun Terbit</label>
                    <input
                      type="number"
                      value={newYear}
                      onChange={(e) => setNewYear(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E3A2B] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-medium">Label Badge</label>
                    <select
                      value={newBadge}
                      onChange={(e: any) => setNewBadge(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E3A2B] focus:bg-white"
                    >
                      <option value="Baru">Baru</option>
                      <option value="Staff Pick">Staff Pick</option>
                      <option value="Hot Sci-Fi">Hot Sci-Fi</option>
                      <option value="Masterpiece">Masterpiece</option>
                      <option value="Terpopuler">Terpopuler</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 mb-1 font-medium">URL Cover Buku</label>
                    <input
                      type="url"
                      value={newCover}
                      onChange={(e) => setNewCover(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E3A2B] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 mb-1 font-medium">Deskripsi & Sinopsis</label>
                    <textarea
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Sinopsis singkat buku..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#1E3A2B] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#1E3A2B] text-white font-bold hover:bg-[#162C21] shadow-xs"
                  >
                    Simpan Buku
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
