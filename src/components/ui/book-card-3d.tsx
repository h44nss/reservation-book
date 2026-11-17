'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Book } from '@/types';
import { getAvailableStock, useLibrary } from '@/context/library-context';
import { BookCover } from '@/components/ui/book-cover';
import { Plus, Check, Eye, Bookmark, Sparkles } from 'lucide-react';

interface BookCardProps {
  book: Book;
  viewMode?: 'grid' | 'matrix';
}

export function BookCard3D({ book, viewMode = 'grid' }: BookCardProps) {
  const { addToTray, borrowTray } = useLibrary();
  const [justAdded, setJustAdded] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const availableStock = getAvailableStock(book);
  const isAvailable = availableStock > 0;
  const inTray = borrowTray.some((item) => item.id === book.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;

    const result = addToTray(book);
    if (result.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } else {
      setFeedbackMsg(result.message);
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Staff Pick':
        return 'bg-[#132E20] text-emerald-300 border-[#132E20]';
      case 'Masterpiece':
        return 'bg-[#C25E38] text-white border-[#C25E38]';
      case 'Hot Sci-Fi':
        return 'bg-[#0F4C5C] text-cyan-200 border-[#0F4C5C]';
      case 'Terpopuler':
        return 'bg-[#B48C36] text-white border-[#B48C36]';
      default:
        return 'bg-slate-800 text-white border-slate-800';
    }
  };

  if (viewMode === 'matrix') {
    return (
      <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white border border-[#E5E3D8] hover:border-[#C25E38]/40 hover:shadow-md transition-all gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-20 rounded-lg overflow-hidden shrink-0 border border-[#E5E3D8] book-spine-effect shadow-xs">
            <BookCover
              src={book.cover_image}
              title={book.title}
              author={book.author}
              categoryName={book.category_name}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#F4F2EB] text-[#57655B]">
                {book.category_name}
              </span>
              <span className="text-[11px] text-[#8A968E] font-mono-code">{book.publication_year}</span>
              {book.badge && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getBadgeStyle(book.badge)}`}>
                  {book.badge}
                </span>
              )}
            </div>
            <Link
              href={`/books/${book.id}`}
              className="font-bold text-base text-[#18221B] group-hover:text-[#132E20] transition-colors line-clamp-1"
            >
              {book.title}
            </Link>
            <p className="text-xs text-[#57655B]">{book.author}</p>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                availableStock > 1
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : availableStock === 1
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-[#F4F2EB] text-[#8A968E] border border-[#E5E3D8]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  availableStock > 0 ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
              {availableStock > 0 ? `${availableStock} di Rak` : 'Habis'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/books/${book.id}`}
              className="p-2 rounded-xl bg-[#F4F2EB] hover:bg-[#EAE7DC] text-[#57655B] transition-colors"
              title="Lihat Detail Buku"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={handleAdd}
              disabled={!isAvailable || inTray}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                inTray
                  ? 'bg-[#F4F2EB] text-[#8A968E] cursor-not-allowed'
                  : !isAvailable
                  ? 'bg-[#F4F2EB] text-[#8A968E] cursor-not-allowed'
                  : 'bg-[#132E20] hover:bg-[#0D2016] text-white shadow-xs active:scale-95'
              }`}
            >
              {inTray ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Di Kantong
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-emerald-300" /> Pinjam
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-[#E5E3D8] hover:border-[#132E20]/30 p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
      
      {/* Ribbon Bookmark Badge */}
      {book.badge && (
        <div className="absolute -top-1.5 right-5 z-20">
          <div
            className={`px-2.5 pt-1.5 pb-2 text-[9px] font-extrabold uppercase tracking-wider bookmark-ribbon shadow-sm flex items-center gap-1 ${getBadgeStyle(
              book.badge
            )}`}
          >
            <span>{book.badge}</span>
          </div>
        </div>
      )}

      {/* Book Cover Container with Spine Shader */}
      <Link
        href={`/books/${book.id}`}
        className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-3.5 block border border-[#E5E3D8] book-spine-effect group-hover:shadow-md transition-shadow bg-[#F4F2EB]"
      >
        <BookCover
          src={book.cover_image}
          title={book.title}
          author={book.author}
          categoryName={book.category_name}
        />

        {/* Category Pill Tag */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#18221B] shadow-xs border border-white/60 tracking-wider uppercase">
            {book.category_name}
          </span>
        </div>
      </Link>

      {/* Book Metadata */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between text-[11px] text-[#8A968E] font-medium mb-1">
          <span className="truncate max-w-[140px]">{book.publisher}</span>
          <span className="font-mono-code">{book.publication_year}</span>
        </div>

        <Link
          href={`/books/${book.id}`}
          className="font-bold text-sm text-[#18221B] group-hover:text-[#132E20] line-clamp-1 transition-colors mb-0.5 tracking-tight"
          title={book.title}
        >
          {book.title}
        </Link>
        <p className="text-xs text-[#57655B] line-clamp-1 mb-3.5">{book.author}</p>

        {/* Availability Strip & Borrow Action */}
        <div className="mt-auto pt-3 border-t border-[#F0EEE6] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                availableStock > 1
                  ? 'bg-emerald-500'
                  : availableStock === 1
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-slate-300'
              }`}
            />
            <span
              className={`text-[11px] font-bold ${
                availableStock > 1
                  ? 'text-emerald-800'
                  : availableStock === 1
                  ? 'text-amber-800'
                  : 'text-[#8A968E]'
              }`}
            >
              {availableStock > 1
                ? `${availableStock} di Rak`
                : availableStock === 1
                ? 'Sisa 1!'
                : 'Habis'}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={!isAvailable || inTray}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              inTray
                ? 'bg-[#F4F2EB] text-[#57655B] cursor-not-allowed border border-[#E5E3D8]'
                : !isAvailable
                ? 'bg-[#F4F2EB] text-[#8A968E] cursor-not-allowed border border-[#E5E3D8]'
                : justAdded
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-[#132E20] hover:bg-[#0D2016] text-white shadow-xs active:scale-95'
            }`}
          >
            {inTray ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Siap
              </>
            ) : justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Masuk!
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-emerald-300" /> Pinjam
              </>
            )}
          </button>
        </div>

        {feedbackMsg && (
          <p className="mt-2 text-[10px] text-[#C25E38] font-medium leading-tight">{feedbackMsg}</p>
        )}
      </div>
    </div>
  );
}
