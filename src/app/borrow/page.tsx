'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLibrary, getAvailableStock } from '@/context/library-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CyberTicket } from '@/components/ui/cyber-ticket';
import { BookCover } from '@/components/ui/book-cover';
import { LoanRequest } from '@/types';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Info,
} from 'lucide-react';

export default function BorrowPage() {
  const { borrowTray, removeFromTray, clearTray, submitLoanRequest, siteSettings } = useLibrary();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Field touch tracking for showing errors on blur
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean; email?: boolean }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<LoanRequest | null>(null);

  // Field validation functions
  const validateName = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) return 'Nama lengkap peminjam wajib diisi.';
    if (trimmed.length < 3) return 'Nama harus memiliki minimal 3 karakter.';
    if (!/^[a-zA-Z\s'.,-]+$/.test(trimmed)) {
      return 'Nama hanya boleh mengandung huruf, spasi, dan tanda baca umum.';
    }
    return null;
  };

  const validatePhone = (val: string): string | null => {
    const trimmed = val.trim().replace(/[\s-]/g, '');
    if (!trimmed) return 'Nomor WhatsApp / HP wajib diisi untuk verifikasi.';
    // Valid Indonesian phone formats: 08xxx or 628xxx or +628xxx (10 to 14 digits)
    const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/;
    if (!phoneRegex.test(trimmed)) {
      return 'Nomor tidak valid. Gunakan format WhatsApp aktif (contoh: 081234567890).';
    }
    return null;
  };

  const validateEmail = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) return null; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Format email tidak valid (contoh: nama@email.com).';
    }
    return null;
  };

  // Strictly filter out letters, spaces, and non-numeric characters from phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Strip everything except digits and '+'
    let cleaned = raw.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.slice(1).replace(/\+/g, '');
    } else {
      cleaned = cleaned.replace(/\+/g, '');
    }
    // Limit maximum length to 15 characters
    if (cleaned.length <= 15) {
      setPhone(cleaned);
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigational and control keys
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Home' ||
      e.key === 'End' ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }

    // Allow '+' only as the first character
    if (e.key === '+') {
      if (e.currentTarget.selectionStart === 0 && !e.currentTarget.value.includes('+')) {
        return;
      }
    }

    // Allow digits 0-9
    if (/^[0-9]$/.test(e.key)) {
      return;
    }

    // Block any letter or unauthorized symbol keypress
    e.preventDefault();
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    let cleaned = pasted.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) {
      cleaned = '+' + cleaned.slice(1).replace(/\+/g, '');
    } else {
      cleaned = cleaned.replace(/\+/g, '');
    }
    const input = e.currentTarget;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const current = phone;
    let next = current.slice(0, start) + cleaned + current.slice(end);
    if (next.startsWith('+')) {
      next = '+' + next.slice(1).replace(/\+/g, '');
    } else {
      next = next.replace(/\+/g, '');
    }
    if (next.length <= 15) {
      setPhone(next);
    }
  };

  const nameError = validateName(name);
  const phoneError = validatePhone(phone);
  const emailError = validateEmail(email);

  // Complete form validity
  const isFormValid =
    !nameError &&
    !phoneError &&
    !emailError &&
    agreeTerms &&
    borrowTray.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Mark all as touched on submit attempt
    setTouched({ name: true, phone: true, email: true });

    if (nameError) {
      setErrorMsg(nameError);
      return;
    }
    if (phoneError) {
      setErrorMsg(phoneError);
      return;
    }
    if (emailError) {
      setErrorMsg(emailError);
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Harap setujui ketentuan sirkulasi perpustakaan sebelum melanjutkan.');
      return;
    }
    if (borrowTray.length === 0) {
      setErrorMsg('Kantong peminjaman Anda masih kosong.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await submitLoanRequest({
        borrower_name: name.trim(),
        phone: phone.trim().replace(/[\s-]/g, ''),
        email: email.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      if (res.success && res.request) {
        setSubmittedRequest(res.request);
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat memproses tiket.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F2] text-[#18221B]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-3.5 sm:px-6 w-full pt-6 sm:pt-8 pb-24 space-y-6 sm:space-y-8">
        
        {submittedRequest ? (
          /* SUCCESS STATE */
          <div className="space-y-6 pt-2 sm:pt-4">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                TIKET RESMI BERHASIL DITERBITKAN
              </span>
              <h1 className="font-serif-title text-2xl sm:text-4xl font-normal text-[#18221B]">
                Peminjaman Anda Telah Terdaftar!
              </h1>
              <p className="text-xs sm:text-sm text-[#57655B] max-w-lg mx-auto leading-relaxed">
                Simpan nomor tiket berikut atau tangkap layar (screenshot). Tunjukkan kepada petugas loket untuk serah terima buku fisik.
              </p>
            </div>

            <CyberTicket request={submittedRequest} />

            <div className="text-center pt-4">
              <Link
                href="/books"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#132E20] hover:text-[#C25E38] transition-colors"
              >
                <span>← Eksplorasi Buku Lainnya di Katalog</span>
              </Link>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <div className="space-y-6 sm:space-y-8">
            
            {/* Header */}
            <div className="pb-4 border-b border-[#E5E3D8]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C25E38]">
                PROSEDUR CEPAT
              </span>
              <h1 className="font-serif-title text-2xl sm:text-4xl font-normal text-[#18221B] mt-1">
                Formulir Peminjaman Koleksi
              </h1>
              <p className="text-xs sm:text-sm text-[#57655B] mt-1">
                Tanpa perlu registrasi akun. Lengkapi kontak WhatsApp untuk verifikasi pengambilan buku di meja loket perpustakaan.
              </p>
            </div>

            {borrowTray.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-[#E5E3D8] text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#F8F7F2] flex items-center justify-center text-[#8A968E] mx-auto border border-[#E5E3D8]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif-title font-normal text-xl text-[#18221B]">Kantong Peminjaman Masih Kosong</h3>
                <p className="text-xs text-[#57655B] max-w-sm mx-auto leading-relaxed">
                  Anda belum memilih buku untuk dipinjam. Buka katalog koleksi dan pilih hingga {siteSettings.max_books_per_loan} judul buku yang Anda inginkan.
                </p>
                <Link
                  href="/books"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#132E20] text-white font-semibold text-xs hover:bg-[#0D2016] transition-all shadow-xs"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Jelajahi Katalog Buku</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Book Tray Review */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E3D8] shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0EEE6]">
                      <span className="text-xs text-[#18221B] font-bold uppercase tracking-wider">
                        Buku yang Dipilih ({borrowTray.length})
                      </span>
                      <button
                        onClick={clearTray}
                        className="text-xs text-rose-700 hover:text-rose-800 font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Kosongkan
                      </button>
                    </div>

                    <div className="space-y-3">
                      {borrowTray.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8]"
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
                            <span className="text-[9px] font-bold text-[#C25E38] uppercase tracking-wider">
                              {book.category_name}
                            </span>
                            <h4 className="font-bold text-xs text-[#18221B] truncate">{book.title}</h4>
                            <p className="text-[11px] text-[#57655B] truncate">{book.author}</p>
                            <span className="text-[10px] text-[#8A968E] block mt-0.5">
                              Stok di rak: {getAvailableStock(book)}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromTray(book.id)}
                            className="p-1.5 rounded-lg text-[#8A968E] hover:text-rose-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 text-xs text-[#57655B] space-y-2 border-t border-[#F0EEE6]">
                      <div className="flex justify-between">
                        <span>Durasi Peminjaman:</span>
                        <span className="text-[#18221B] font-bold font-mono-code">{siteSettings.loan_duration_days} Hari Kalender</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Batas Ambil Setelah Disetujui:</span>
                        <span className="text-[#C25E38] font-bold font-mono-code">{siteSettings.pickup_deadline_hours} Jam</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Identity Form */}
                <div className="lg:col-span-7">
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="p-4 sm:p-8 rounded-3xl bg-white border border-[#E5E3D8] shadow-sm space-y-5"
                  >
                    <h3 className="font-serif-title font-normal text-xl text-[#18221B]">
                      Data Pengajuan Peminjam
                    </h3>

                    {errorMsg && (
                      <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Nama Lengkap */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs text-[#18221B] font-bold">
                            Nama Lengkap Peminjam <span className="text-rose-600">*</span>
                          </label>
                          {touched.name && nameError && (
                            <span className="text-[11px] text-rose-600 font-medium">
                              {nameError}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                          placeholder="Contoh: Rian Pratama"
                          className={`w-full px-4 py-2.5 rounded-xl border text-[#18221B] placeholder-[#8A968E] text-xs sm:text-sm focus:outline-none transition-all ${
                            touched.name && nameError
                              ? 'bg-rose-50/40 border-rose-300 focus:border-rose-500'
                              : 'bg-[#F8F7F2] border-[#E5E3D8] focus:border-[#132E20] focus:bg-white'
                          }`}
                        />
                      </div>

                      {/* Nomor WhatsApp */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs text-[#18221B] font-bold">
                            Nomor WhatsApp Aktif <span className="text-rose-600">*</span>
                          </label>
                          {touched.phone && phoneError && (
                            <span className="text-[11px] text-rose-600 font-medium">
                              {phoneError}
                            </span>
                          )}
                        </div>
                        <input
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          pattern="[0-9+]*"
                          required
                          value={phone}
                          onChange={handlePhoneChange}
                          onKeyDown={handlePhoneKeyDown}
                          onPaste={handlePhonePaste}
                          onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                          placeholder="Contoh: 081234567890"
                          className={`w-full px-4 py-2.5 rounded-xl border text-[#18221B] placeholder-[#8A968E] text-xs sm:text-sm focus:outline-none transition-all font-mono-code ${
                            touched.phone && phoneError
                              ? 'bg-rose-50/40 border-rose-300 focus:border-rose-500'
                              : 'bg-[#F8F7F2] border-[#E5E3D8] focus:border-[#132E20] focus:bg-white'
                          }`}
                        />
                        <span className="text-[11px] text-[#8A968E] mt-1 block">
                          Digunakan petugas untuk konfirmasi dan serah terima buku di loket.
                        </span>
                      </div>

                      {/* Email (Opsional) */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs text-[#57655B] font-medium">
                            Email (Opsional)
                          </label>
                          {touched.email && emailError && (
                            <span className="text-[11px] text-rose-600 font-medium">
                              {emailError}
                            </span>
                          )}
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                          placeholder="Contoh: rian@example.com"
                          className={`w-full px-4 py-2.5 rounded-xl border text-[#18221B] placeholder-[#8A968E] text-xs sm:text-sm focus:outline-none transition-all ${
                            touched.email && emailError
                              ? 'bg-rose-50/40 border-rose-300 focus:border-rose-500'
                              : 'bg-[#F8F7F2] border-[#E5E3D8] focus:border-[#132E20] focus:bg-white'
                          }`}
                        />
                      </div>

                      {/* Catatan */}
                      <div>
                        <label className="block text-xs text-[#57655B] mb-1.5 font-medium">
                          Catatan Tambahan untuk Petugas (Opsional)
                        </label>
                        <textarea
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Misal: Saya akan mengambil sepulang kerja sekitar jam 17:00..."
                          className="w-full px-4 py-2 rounded-xl bg-[#F8F7F2] border border-[#E5E3D8] text-[#18221B] placeholder-[#8A968E] text-xs sm:text-sm focus:outline-none focus:border-[#132E20] focus:bg-white transition-all"
                        />
                      </div>

                      {/* Terms Checklist (Wajib Dicentang) */}
                      <div className="pt-2">
                        <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8] hover:border-[#D2CEC0] transition-colors">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="mt-0.5 rounded accent-[#132E20] w-4 h-4 shrink-0 cursor-pointer"
                          />
                          <span className="text-xs text-[#57655B] leading-relaxed">
                            <strong className="text-[#18221B]">Saya menyetujui ketentuan perpustakaan:</strong> menjaga kondisi fisik buku, mengambil sebelum batas {siteSettings.pickup_deadline_hours} jam, dan mengembalikan dalam {siteSettings.loan_duration_days} hari kalender.
                          </span>
                        </label>
                      </div>

                      {/* Submit Button (Disabled jika belum dicentang atau form belum valid) */}
                      <div className="space-y-2 pt-2">
                        <button
                          type="submit"
                          disabled={!isFormValid || isLoading}
                          className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                            !isFormValid || isLoading
                              ? 'bg-[#EAE7DC] text-[#8A968E] cursor-not-allowed border border-[#D2CEC0]'
                              : 'bg-[#132E20] hover:bg-[#0D2016] text-white shadow-xs active:scale-[0.99] cursor-pointer'
                          }`}
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#8A968E] border-t-transparent animate-spin" />
                              <span>Menerbitkan Tiket Peminjaman...</span>
                            </span>
                          ) : (
                            <>
                              <span>Terbitkan Tiket Peminjaman</span>
                              <ArrowRight className="w-4 h-4 text-emerald-300" />
                            </>
                          )}
                        </button>

                        {/* Helper guidance when button is disabled */}
                        {!agreeTerms && (
                          <p className="text-[11px] text-[#C25E38] text-center font-medium flex items-center justify-center gap-1">
                            <Info className="w-3.5 h-3.5" />
                            <span>Centang kotak persetujuan ketentuan di atas untuk mengaktifkan tombol.</span>
                          </p>
                        )}
                        {agreeTerms && (!name.trim() || !phone.trim()) && (
                          <p className="text-[11px] text-[#8A968E] text-center">
                            * Lengkapi nama lengkap dan nomor WhatsApp aktif Anda untuk melanjutkan.
                          </p>
                        )}
                      </div>
                    </div>
                  </form>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
