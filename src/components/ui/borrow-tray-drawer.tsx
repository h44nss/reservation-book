'use client';

import React from 'react';
import Link from 'next/link';
import { useLibrary, getAvailableStock } from '@/context/library-context';
import { BookCover } from '@/components/ui/book-cover';
import { X, Trash2, ArrowRight, BookOpen } from 'lucide-react';

interface BorrowTrayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BorrowTrayDrawer({ isOpen, onClose }: BorrowTrayDrawerProps) {
  const { borrowTray, removeFromTray, clearTray, siteSettings } = useLibrary();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-[#18221B]">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#132E20]/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F7F2] border-l border-[#E5E3D8] shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#E5E3D8] bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#132E20] flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-serif-title font-normal text-xl text-[#18221B]">
                  Kantong Peminjaman
                </h3>
                <p className="text-xs text-[#57655B]">
                  {borrowTray.length} dari {siteSettings.max_books_per_loan} kuota buku terisi
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#8A968E] hover:text-[#18221B] hover:bg-[#F4F2EB] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Book List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {borrowTray.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#57655B] space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#E5E3D8] flex items-center justify-center text-[#8A968E] shadow-xs">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h4 className="font-serif-title text-xl text-[#18221B]">Kantong Masih Kosong</h4>
                <p className="text-xs text-[#57655B] max-w-xs leading-relaxed">
                  Pilih buku yang ingin Anda baca di katalog dan klik <strong>Pinjam</strong> untuk menyimpannya di sini.
                </p>
                <Link
                  href="/books"
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#132E20] text-white font-semibold text-xs hover:bg-[#0D2016] transition-all shadow-xs"
                >
                  Buka Katalog Buku
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#8A968E] pb-2 border-b border-[#E5E3D8]">
                  <span className="font-bold uppercase tracking-wider text-[10px]">DAFTAR KOLEKSI TERPILIH</span>
                  <button
                    onClick={clearTray}
                    className="text-rose-700 hover:text-rose-800 flex items-center gap-1 font-semibold text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Kosongkan
                  </button>
                </div>

                {borrowTray.map((book) => {
                  return (
                    <div
                      key={book.id}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#E5E3D8] shadow-xs"
                    >
                      <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-[#E5E3D8] book-spine-effect">
                        <BookCover
                          src={book.cover_image}
                          title={book.title}
                          author={book.author}
                          categoryName={book.category_name}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#C25E38]">
                          {book.category_name}
                        </span>
                        <h4 className="font-bold text-xs text-[#18221B] truncate">{book.title}</h4>
                        <p className="text-[11px] text-[#57655B] truncate">{book.author}</p>
                        <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
                          ✓ Siap diajukan
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromTray(book.id)}
                        className="p-1.5 rounded-lg text-[#8A968E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus dari kantong"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}

                {/* Quota Progress Bar */}
                <div className="p-4 rounded-2xl bg-white border border-[#E5E3D8] space-y-2 mt-4 shadow-xs">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#57655B] font-medium">Batas Maksimal Kuota</span>
                    <span className="text-[#18221B] font-bold font-mono-code">
                      {borrowTray.length} / {siteSettings.max_books_per_loan} Judul
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EFECE4] overflow-hidden">
                    <div
                      className="h-full bg-[#132E20] transition-all duration-300"
                      style={{
                        width: `${(borrowTray.length / siteSettings.max_books_per_loan) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-[#8A968E] leading-tight">
                    * Maksimal {siteSettings.max_books_per_loan} judul buku per transaksi peminjaman aktif.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          {borrowTray.length > 0 && (
            <div className="p-6 border-t border-[#E5E3D8] bg-white space-y-3">
              <Link
                href="/borrow"
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-xl bg-[#132E20] hover:bg-[#0D2016] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
              >
                <span>Lanjut Formulir Peminjaman</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </Link>
              <button
                onClick={onClose}
                className="w-full py-2 text-xs text-[#57655B] hover:text-[#18221B] text-center font-medium"
              >
                + Tambah Koleksi Lainnya
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
