'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLibrary, getAvailableStock } from '@/context/library-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BookCard3D } from '@/components/ui/book-card-3d';
import {
  Search,
  LayoutGrid,
  List,
  RotateCcw,
  BookOpen,
  SlidersHorizontal,
} from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { books, categories } = useLibrary();
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'latest' | 'title' | 'stock'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => book.is_active)
      .filter((book) => {
        if (selectedCategory !== 'all' && book.category_id !== selectedCategory) {
          return false;
        }
        if (onlyAvailable && getAvailableStock(book) <= 0) {
          return false;
        }
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchPublisher = book.publisher.toLowerCase().includes(q);
          const matchIsbn = book.isbn.toLowerCase().includes(q);
          return matchTitle || matchAuthor || matchPublisher || matchIsbn;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'stock') return getAvailableStock(b) - getAvailableStock(a);
        return b.publication_year - a.publication_year;
      });
  }, [books, selectedCategory, onlyAvailable, search, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setOnlyAvailable(false);
    setSortBy('latest');
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-6 pb-24 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E3D8]">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-[#C25E38]">
            ARSIP BUKU FISIK
          </span>
          <h1 className="font-serif-title text-2xl sm:text-4xl lg:text-5xl font-normal text-[#18221B] mt-1">
            Katalog Koleksi Perpustakaan
          </h1>
          <p className="text-xs sm:text-sm text-[#57655B] mt-1.5 font-normal">
            Menampilkan {filteredBooks.length} dari total {books.length} judul terdaftar di basis data.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E3D8] shadow-xs self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-[#132E20] text-white shadow-xs'
                : 'text-[#57655B] hover:text-[#18221B]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid Rak</span>
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'matrix'
                ? 'bg-[#132E20] text-white shadow-xs'
                : 'text-[#57655B] hover:text-[#18221B]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Daftar Rinci</span>
          </button>
        </div>
      </div>

      {/* Control & Filter Deck */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#E5E3D8] shadow-xs space-y-4">
        
        {/* Search bar & Sorting */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          <div className="md:col-span-7 lg:col-span-8 relative">
            <Search className="w-4 h-4 text-[#8A968E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan judul, penulis, penerbit, atau ISBN..."
              className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-[#F8F7F2] border border-[#E5E3D8] text-[#18221B] placeholder-[#8A968E] text-xs sm:text-sm focus:outline-none focus:border-[#132E20] focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A968E] hover:text-[#18221B]"
              >
                Hapus
              </button>
            )}
          </div>

          <div className="md:col-span-5 lg:col-span-4 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#F8F7F2] border border-[#E5E3D8] text-[#18221B] text-xs font-medium focus:outline-none focus:border-[#132E20]"
            >
              <option value="latest">Urutan: Tahun</option>
              <option value="title">Urutan: Judul (A-Z)</option>
              <option value="stock">Urutan: Stok</option>
            </select>

            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`px-3 sm:px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                onlyAvailable
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-[#F8F7F2] text-[#57655B] border-[#E5E3D8] hover:bg-[#EAE7DC]'
              }`}
            >
              ✓ Siap Pinjam
            </button>
          </div>
        </div>

        {/* Category Filter Pills - Mobile Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#132E20] text-white shadow-xs'
                : 'bg-[#F8F7F2] text-[#57655B] border border-[#E5E3D8] hover:border-[#D2CEC0]'
            }`}
          >
            Semua ({books.length})
          </button>

          {categories.map((cat) => {
            const count = books.filter((b) => b.category_id === cat.id && b.is_active).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#132E20] text-white shadow-xs'
                    : 'bg-[#F8F7F2] text-[#57655B] border border-[#E5E3D8] hover:border-[#D2CEC0]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* Book Results */}
      {filteredBooks.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-[#E5E3D8] text-center space-y-4 max-w-md mx-auto my-12 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#F8F7F2] flex items-center justify-center text-[#8A968E] mx-auto border border-[#E5E3D8]">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif-title font-normal text-xl text-[#18221B]">Tidak Ada Koleksi yang Cocok</h3>
          <p className="text-xs text-[#57655B] leading-relaxed">
            Tidak ada buku yang sesuai dengan kata kunci pencarian Anda. Silakan coba kata kunci lain atau bersihkan filter.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#132E20] text-white font-semibold text-xs transition-all hover:bg-[#0D2016]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Seluruh Filter</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredBooks.map((book) => (
            <BookCard3D key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBooks.map((book) => (
            <BookCard3D key={book.id} book={book} viewMode="matrix" />
          ))}
        </div>
      )}

    </main>
  );
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F2]">
      <Navbar />
      <Suspense fallback={<div className="p-16 text-center text-[#8A968E]">Memuat Katalog Koleksi...</div>}>
        <CatalogContent />
      </Suspense>
      <Footer />
    </div>
  );
}
