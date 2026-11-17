'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLibrary, getAvailableStock } from '@/context/library-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BookCard3D } from '@/components/ui/book-card-3d';
import { BookCover } from '@/components/ui/book-cover';
import { SiteLogoMark } from '@/components/ui/site-logo';
import {
  Search,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Radio,
  Zap,
  Database,
  Bookmark,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { books, categories, services, siteSettings } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/books');
    }
  };

  const filteredFeaturedBooks = books
    .filter((b) => b.is_active)
    .filter((b) => {
      if (activeCategory === 'all') return true;
      return b.category_id === activeCategory;
    })
    .slice(0, 8);

  const totalAvailableBooks = books.reduce((acc, b) => acc + getAvailableStock(b), 0);
  const totalBorrowedBooks = books.reduce((acc, b) => acc + b.stock_borrowed, 0);

  // Pick highlight book dynamically
  const highlightBook =
    books.find((b) => b.badge === 'Masterpiece' || b.badge === 'Hot Sci-Fi' || b.badge === 'Staff Pick') ||
    books[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F2] text-[#18221B]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-6 pb-24 space-y-20">
        
        {/* HERO SECTION: Editorial Contemporary Bookstore */}
        <section className="pt-4 sm:pt-10">
          
          {/* Curated Archive Plaque */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#E5E3D8] text-xs text-[#57655B] mb-8 shadow-xs">
            <SiteLogoMark size={20} />
            <span className="font-extrabold uppercase tracking-wider text-[#132E20] text-[10px]">
              KATALOG FISIK RESMI:
            </span>
            <span className="font-semibold text-[#18221B]">{totalAvailableBooks} Eksemplar Tersedia</span>
            <span className="text-[#D2CEC0]">•</span>
            <span>{totalBorrowedBooks} Sedang Dipinjam</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Literary Typography & Search */}
            <div className="lg:col-span-7 space-y-7">
              <div className="space-y-4">
                <span className="text-xs font-bold tracking-widest uppercase text-[#C25E38] block">
                  KURASI LITERASI KONTEMPORER
                </span>
                <h1 className="font-serif-title text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#18221B] leading-[1.08]">
                  Koleksi Pilihan untuk Jiwa yang{' '}
                  <span className="italic text-[#132E20] font-serif underline decoration-[#C25E38]/30 decoration-wavy decoration-1 underline-offset-8">
                    Mengembara.
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg text-[#57655B] leading-relaxed max-w-xl font-normal pt-1">
                  Ruang literasi modern dengan karya sastra, filsafat, rekayasa teknologi, dan sains.
                  Pinjam buku fisik langsung tanpa registrasi akun yang berbelit.
                </p>
              </div>

              {/* Editorial Search Deck */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative max-w-xl flex items-center p-2 rounded-2xl bg-white border border-[#D2CEC0] shadow-sm focus-within:border-[#132E20] focus-within:ring-2 focus-within:ring-[#132E20]/10 transition-all"
              >
                <Search className="w-5 h-5 text-[#8A968E] ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul buku, penulis sastra, atau topik sains..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-[#18221B] placeholder-[#8A968E] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#132E20] hover:bg-[#0D2016] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-xs active:scale-95"
                >
                  <span>Cari Buku</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
              </form>

              {/* Category Pills Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-[#8A968E] font-medium mr-1">Eksplorasi Rak:</span>
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeCategory === 'all'
                      ? 'bg-[#132E20] text-white shadow-xs'
                      : 'bg-white text-[#57655B] border border-[#E5E3D8] hover:border-[#D2CEC0]'
                  }`}
                >
                  Semua Koleksi ({books.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeCategory === cat.id
                        ? 'bg-[#132E20] text-white shadow-xs'
                        : 'bg-white text-[#57655B] border border-[#E5E3D8] hover:border-[#D2CEC0]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

            </div>

            {/* Right Column: Tactile Book Showcase Feature */}
            {highlightBook && (
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-sm">
                  
                  {/* Subtle stacked book effect behind */}
                  <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-[#EFECE4] border border-[#D2CEC0]/60 -z-10" />
                  
                  <div className="rounded-3xl bg-white border border-[#E5E3D8] p-6 shadow-xl space-y-5">
                    
                    {/* Header info */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-3 py-1 rounded-full bg-[#132E20] text-emerald-200 font-bold text-[10px] tracking-wider uppercase">
                        ★ {highlightBook.badge || 'SOROTAN KURATOR'}
                      </span>
                      <span className="text-[#8A968E] font-mono-code text-[11px]">
                        EDISI {highlightBook.publication_year}
                      </span>
                    </div>

                    {/* Book Physical Presentation */}
                    <div className="aspect-[3/4] max-h-72 mx-auto rounded-2xl overflow-hidden border border-[#E5E3D8] book-spine-effect shadow-md bg-[#F4F2EB]">
                      <BookCover
                        src={highlightBook.cover_image}
                        title={highlightBook.title}
                        author={highlightBook.author}
                        categoryName={highlightBook.category_name}
                      />
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#C25E38] uppercase tracking-wider block">
                        {highlightBook.category_name}
                      </span>
                      <h3 className="font-serif-title font-normal text-2xl text-[#18221B] leading-snug line-clamp-1">
                        {highlightBook.title}
                      </h3>
                      <p className="text-xs text-[#57655B]">{highlightBook.author}</p>
                    </div>

                    {/* Availability Bar & Link */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#F0EEE6]">
                      <div className="text-xs">
                        <span className="text-[#8A968E] block text-[10px] uppercase font-bold tracking-wider">
                          KETERSEDIAAN RAK
                        </span>
                        <span className="text-emerald-800 font-bold text-sm">
                          {getAvailableStock(highlightBook)} Eksemplar Siap
                        </span>
                      </div>

                      <Link
                        href={`/books/${highlightBook.id}`}
                        className="px-4 py-2.5 rounded-xl bg-[#132E20] hover:bg-[#0D2016] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <span>Buka Detail</span>
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* CURATED BOOKSHELF GRID */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E5E3D8]">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C25E38] block">
                KATALOG TERPILIH
              </span>
              <h2 className="font-serif-title text-3xl sm:text-4xl text-[#18221B] font-normal">
                Rekomendasi Minggu Ini
              </h2>
            </div>

            <Link
              href="/books"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#132E20] hover:text-[#C25E38] transition-colors"
            >
              <span>Jelajahi Semua Koleksi ({books.length} Judul)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFeaturedBooks.map((book) => (
              <BookCard3D key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* ARCHIVAL CIRCULATION GUIDE (ANTI-SLOP REDESIGN) */}
        <section className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E5E3D8] shadow-sm space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-[#C25E38] uppercase tracking-widest">
              SISTEM SIRKULASI DIGITAL
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl text-[#18221B] font-normal">
              Peminjaman Tanpa Registrasi Rumit
            </h2>
            <p className="text-xs sm:text-sm text-[#57655B] leading-relaxed">
              Kami menghapus keharusan membuat akun dan mengingat kata sandi. Cukup 3 langkah sederhana:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 Card: Archival Pass Style */}
            <div className="p-6 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8] relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E3D8]">
                <span className="font-mono-code text-[11px] font-bold text-[#132E20]">
                  FASE // 01
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white border border-[#E5E3D8] text-[#57655B]">
                  PILIH BUKU
                </span>
              </div>
              <h3 className="font-bold text-base text-[#18221B]">Pilih di Katalog Online</h3>
              <p className="text-xs text-[#57655B] leading-relaxed">
                Pilih hingga {siteSettings.max_books_per_loan} judul buku yang Anda minati. Pastikan status ketersediaan di rak bertanda hijau.
              </p>
            </div>

            {/* Step 2 Card */}
            <div className="p-6 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8] relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E3D8]">
                <span className="font-mono-code text-[11px] font-bold text-[#C25E38]">
                  FASE // 02
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white border border-[#E5E3D8] text-[#57655B]">
                  TIKET DIGITAL
                </span>
              </div>
              <h3 className="font-bold text-base text-[#18221B]">Terbitkan Tiket Pengambilan</h3>
              <p className="text-xs text-[#57655B] leading-relaxed">
                Isi nama dan nomor WhatsApp aktif. Sistem otomatis menerbitkan kode tiket unik sebagai bukti reservasi buku Anda.
              </p>
            </div>

            {/* Step 3 Card */}
            <div className="p-6 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8] relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E3D8]">
                <span className="font-mono-code text-[11px] font-bold text-[#132E20]">
                  FASE // 03
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white border border-[#E5E3D8] text-[#57655B]">
                  SERAH TERIMA
                </span>
              </div>
              <h3 className="font-bold text-base text-[#18221B]">Ambil di Meja Loket</h3>
              <p className="text-xs text-[#57655B] leading-relaxed">
                Kunjungi perpustakaan dan tunjukkan kode tiket kepada petugas loket untuk serah terima buku fisik secara kilat.
              </p>
            </div>

          </div>

          <div className="pt-6 border-t border-[#E5E3D8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#8A968E]">
              Sudah memiliki tiket peminjaman aktif?
            </span>
            <Link
              href="/tracking"
              className="px-4 py-2 rounded-xl bg-[#F4F2EB] hover:bg-[#EAE7DC] text-[#18221B] text-xs font-semibold transition-all flex items-center gap-1.5 border border-[#E5E3D8]"
            >
              <span>Lacak Status Tiket Saya</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#57655B]" />
            </Link>
          </div>
        </section>

        {/* SERVICES / FACILITIES EXHIBIT */}
        <section className="space-y-8">
          <div className="space-y-1 pb-2 border-b border-[#E5E3D8]">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C25E38] block">
              RUANG BACA & ARSIP
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl text-[#18221B] font-normal">
              Fasilitas Perpustakaan Kami
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-6 rounded-2xl bg-white border border-[#E5E3D8] hover:border-[#132E20]/30 hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F4F2EB] text-[#57655B] border border-[#E5E3D8]">
                      {service.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#18221B]">{service.title}</h3>
                  <p className="text-xs text-[#57655B] leading-relaxed">{service.description}</p>
                </div>
                
                <ul className="pt-3 border-t border-[#F0EEE6] space-y-1.5 text-xs text-[#57655B]">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#132E20]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
