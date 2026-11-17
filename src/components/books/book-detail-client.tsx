'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLibrary, getAvailableStock } from '@/context/library-context';
import { BookCard3D } from '@/components/ui/book-card-3d';
import { BookCover } from '@/components/ui/book-cover';
import { Book } from '@/types';
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  Share2,
  BookOpen,
  Calendar,
  Layers,
  Barcode,
  Building,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export function BookDetailClient({ id }: { id: string }) {
  const { books, addToTray, borrowTray, isLoading } = useLibrary();

  const [localBook, setLocalBook] = useState<Book | null>(null);
  const [isFetchingLocal, setIsFetchingLocal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // If in context, use it; otherwise fallback to localBook fetched from API
  const book = books.find((b) => b.id === id) || localBook;

  useEffect(() => {
    if (!books.find((b) => b.id === id) && id) {
      setIsFetchingLocal(true);
      fetch(`/api/books/${encodeURIComponent(id)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && !data.error) {
            setLocalBook(data);
          }
        })
        .catch(() => {})
        .finally(() => setIsFetchingLocal(false));
    }
  }, [id, books]);

  if ((isLoading || isFetchingLocal) && !book) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#132E20] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-[#57655B] font-medium">Mengambil catatan buku dari arsip...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-16 text-center space-y-4">
        <h2 className="font-serif-title text-2xl font-normal text-[#18221B]">Buku Tidak Ditemukan</h2>
        <p className="text-xs text-[#57655B]">Data buku yang Anda tuju mungkin sudah diarsipkan atau dipindahkan raknya.</p>
        <Link
          href="/books"
          className="px-5 py-2.5 rounded-xl bg-[#132E20] text-white font-semibold text-xs"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const available = getAvailableStock(book);
  const isAvailable = available > 0;
  const inTray = borrowTray.some((item) => item.id === book.id);

  const handleAdd = () => {
    if (!isAvailable) return;
    const res = addToTray(book);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } else {
      setFeedbackMsg(res.message);
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: book.title,
        text: `Lihat buku "${book.title}" di Pustaka Modern!`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const relatedBooks = books
    .filter((b) => b.category_id === book.category_id && b.id !== book.id && b.is_active)
    .slice(0, 4);

  return (
    <div className="space-y-14">
      
      {/* Back Button & Share */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E3D8]">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#57655B] hover:text-[#18221B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Koleksi</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E3D8] text-xs text-[#57655B] hover:text-[#18221B] shadow-xs transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Tautan Disalin!' : 'Bagikan Judul'}</span>
        </button>
      </div>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Hardcover Presentation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative mx-auto max-w-sm">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-[#EFECE4] border border-[#D2CEC0]/60 -z-10" />
            
            <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-[#E5E3D8] book-spine-effect shadow-xl bg-[#F4F2EB]">
              <BookCover
                src={book.cover_image}
                title={book.title}
                author={book.author}
                categoryName={book.category_name}
              />
            </div>
          </div>

          {/* Quick Specs Strip */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E3D8] space-y-1 shadow-xs">
              <span className="text-[10px] font-bold text-[#8A968E] uppercase tracking-wider block">
                STATUS KETERSEDIAAN
              </span>
              <span
                className={`font-extrabold text-sm ${
                  isAvailable ? 'text-emerald-800' : 'text-rose-700'
                }`}
              >
                {isAvailable ? `${available} Eksemplar Siap` : 'Sedang Habis'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E3D8] space-y-1 shadow-xs">
              <span className="text-[10px] font-bold text-[#8A968E] uppercase tracking-wider block">
                TOTAL EKSEMPLAR
              </span>
              <span className="font-extrabold text-[#18221B] text-sm font-mono-code">
                {book.stock_total} Buku Fisik
              </span>
            </div>
          </div>
        </div>

        {/* Right: Book Details & Action */}
        <div className="lg:col-span-7 space-y-7">
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#132E20] text-emerald-200 text-xs font-bold uppercase tracking-wider">
                {book.category_name}
              </span>
              {book.badge && (
                <span className="px-2.5 py-1 rounded-md bg-[#C25E38] text-white text-xs font-bold uppercase tracking-wider">
                  {book.badge}
                </span>
              )}
            </div>

            <h1 className="font-serif-title text-2xl sm:text-4xl lg:text-5xl font-normal text-[#18221B] leading-tight">
              {book.title}
            </h1>

            <p className="text-base text-[#57655B] font-medium">
              Karya Sastra / Penulis: <strong className="text-[#18221B]">{book.author}</strong>
            </p>
          </div>

          {feedbackMsg && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              {feedbackMsg}
            </div>
          )}

          {/* Action Card */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#E5E3D8] shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#8A968E] uppercase tracking-widest font-bold block">
                  STATUS SIRKULASI
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-sm sm:text-base font-bold text-[#18221B]">
                    {isAvailable ? `${available} Buku Dapat Diajukan` : 'Semua Buku Sedang Dipinjam'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                {inTray ? (
                  <button
                    disabled
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#F4F2EB] text-[#57655B] font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-[#E5E3D8]"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Sudah di Kantong</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAdd}
                    disabled={!isAvailable}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                      isAvailable
                        ? justAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#132E20] hover:bg-[#0D2016] text-white active:scale-95'
                        : 'bg-[#F4F2EB] text-[#8A968E] cursor-not-allowed border border-[#E5E3D8]'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Dimasukkan!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-emerald-300" />
                        <span>+ Masukkan Kantong Pinjam</span>
                      </>
                    )}
                  </button>
                )}

                <Link
                  href="/borrow"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#F4F2EB] hover:bg-[#EAE7DC] border border-[#E5E3D8] text-[#18221B] font-semibold text-xs transition-colors text-center"
                >
                  Ajukan Pinjam
                </Link>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#18221B] uppercase tracking-widest">
              Sinopsis & Catatan Kurasi
            </h3>
            <p className="text-sm text-[#57655B] leading-relaxed whitespace-pre-line font-normal">
              {book.description}
            </p>
          </div>

          {/* Book Metadata Grid */}
          <div className="space-y-3 pt-6 border-t border-[#E5E3D8]">
            <h3 className="text-xs font-bold text-[#18221B] uppercase tracking-widest">
              Catatan Bibliografi
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-[#E5E3D8] space-y-1">
                <span className="text-[10px] text-[#8A968E] flex items-center gap-1 font-medium">
                  <Building className="w-3.5 h-3.5 text-[#8A968E]" /> Penerbit
                </span>
                <p className="font-bold text-[#18221B] truncate">{book.publisher}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E5E3D8] space-y-1">
                <span className="text-[10px] text-[#8A968E] flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#8A968E]" /> Tahun Terbit
                </span>
                <p className="font-bold text-[#18221B] font-mono-code">{book.publication_year}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E5E3D8] space-y-1">
                <span className="text-[10px] text-[#8A968E] flex items-center gap-1 font-medium">
                  <Layers className="w-3.5 h-3.5 text-[#8A968E]" /> Ketebalan
                </span>
                <p className="font-bold text-[#18221B] font-mono-code">{book.pages ? `${book.pages} Hlm` : 'N/A'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E5E3D8] space-y-1">
                <span className="text-[10px] text-[#8A968E] flex items-center gap-1 font-medium">
                  <Barcode className="w-3.5 h-3.5 text-[#8A968E]" /> ISBN
                </span>
                <p className="font-bold text-[#18221B] font-mono-code text-[11px] truncate">{book.isbn}</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-[#E5E3D8]">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C25E38]">
              REKOMENDASI SEJENIS
            </span>
            <h2 className="font-serif-title text-3xl font-normal text-[#18221B]">
              Koleksi Lain dalam Kategori {book.category_name}
            </h2>
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard3D key={relBook.id} book={relBook} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
