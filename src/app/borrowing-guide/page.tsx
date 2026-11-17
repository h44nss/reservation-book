'use client';

import React from 'react';
import Link from 'next/link';
import { useLibrary } from '@/context/library-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import {
  BookOpen,
  Calendar,
  Clock,
  Zap,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export default function BorrowingGuidePage() {
  const { siteSettings } = useLibrary();

  const rules = [
    {
      title: `Maksimal ${siteSettings.max_books_per_loan} Buku`,
      desc: `Setiap peminjam dapat mengajukan maksimal ${siteSettings.max_books_per_loan} judul buku sekaligus per transaksi aktif.`,
      icon: <BookOpen className="w-5 h-5 text-[#132E20]" />,
    },
    {
      title: `Durasi Pinjam ${siteSettings.loan_duration_days} Hari`,
      desc: `Masa peminjaman standar adalah ${siteSettings.loan_duration_days} hari kalender terhitung sejak penyerahan buku di loket.`,
      icon: <Calendar className="w-5 h-5 text-[#0F4C5C]" />,
    },
    {
      title: `Batas Ambil ${siteSettings.pickup_deadline_hours} Jam`,
      desc: `Setelah status tiket "Disetujui", buku di-reserve selama ${siteSettings.pickup_deadline_hours} jam sebelum dilepas kembali.`,
      icon: <Clock className="w-5 h-5 text-[#C25E38]" />,
    },
    {
      title: 'Bebas Akun & Password',
      desc: 'Cukup gunakan nama dan nomor WhatsApp aktif. Semua pelacakan dilakukan transparan via kode tiket unik.',
      icon: <Zap className="w-5 h-5 text-[#B48C36]" />,
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Pilih Koleksi Buku di Katalog',
      desc: 'Cari judul buku yang Anda inginkan. Pastikan buku berstatus "Tersedia". Klik tombol "+ Pinjam" untuk memasukkan buku ke dalam kantong peminjaman.',
    },
    {
      step: '02',
      title: 'Lengkapi Kontak & Terbitkan Tiket',
      desc: 'Buka kantong peminjaman, masukkan nama lengkap dan nomor WhatsApp aktif Anda, lalu klik "Terbitkan Tiket". Sistem akan menghasilkan kode tiket unik seperti LIB-7742-X.',
    },
    {
      step: '03',
      title: 'Tunggu Verifikasi Petugas Loket',
      desc: 'Petugas perpustakaan akan memeriksa ketersediaan fisik buku dan menyetujui pengajuan Anda. Pantau status tiket Anda di halaman Pelacakan.',
    },
    {
      step: '04',
      title: 'Pengambilan Fisik di Meja Loket',
      desc: 'Saat status tiket menjadi "Disetujui", kunjungi perpustakaan kami. Tunjukkan kode tiket kepada petugas untuk serah terima buku fisik.',
    },
    {
      step: '05',
      title: 'Masa Membaca & Pengembalian',
      desc: `Nikmati buku Anda selama ${siteSettings.loan_duration_days} hari. Kembalikan buku tepat waktu ke meja loket agar dapat dipinjam oleh pembaca lainnya.`,
    },
  ];

  const faqs = [
    {
      q: 'Apakah saya harus mendaftar akun terlebih dahulu?',
      a: 'Tidak perlu! Layanan perpustakaan kami menggunakan verifikasi nomor WhatsApp dan tiket peminjaman digital tanpa perlu membuat akun atau mengingat kata sandi.',
    },
    {
      q: 'Bagaimana jika saya lupa atau kehilangan kode tiket?',
      a: `Anda dapat menghubungi kontak WhatsApp petugas perpustakaan kami (${siteSettings.phone}) dengan menyebutkan nomor HP dan nama lengkap yang Anda daftarkan saat mengajukan peminjaman.`,
    },
    {
      q: 'Apakah pengambilan buku bisa diwakilkan?',
      a: 'Bisa, asalkan perwakilan Anda dapat menunjukkan gambar tiket peminjaman lengkap dengan kode tiket kepada petugas loket.',
    },
    {
      q: 'Apa yang terjadi jika saya terlambat mengambil buku yang sudah disetujui?',
      a: `Jika melewati batas ${siteSettings.pickup_deadline_hours} jam, sistem secara otomatis akan membatalkan reservasi dan buku akan dikembalikan ke status tersedia di rak umum untuk pengunjung lain.`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F2] text-[#18221B]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 w-full pt-8 pb-24 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            REGULASI SIRKULASI RESMI
          </span>
          <h1 className="font-serif-title text-3xl sm:text-5xl font-normal text-[#18221B]">
            Panduan & Kebijakan Peminjaman
          </h1>
          <p className="text-xs sm:text-sm text-[#57655B] leading-relaxed">
            Semua hal yang perlu Anda ketahui mengenai proses peminjaman buku, batas waktu pengembalian, dan regulasi perpustakaan {siteSettings.library_name}.
          </p>
        </div>

        {/* 4 Core Rules Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rules.map((rule) => (
            <div
              key={rule.title}
              className="p-6 rounded-3xl bg-white border border-[#E5E3D8] space-y-3.5 shadow-xs"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8] flex items-center justify-center">
                {rule.icon}
              </div>
              <h3 className="font-bold text-[#18221B] text-sm">{rule.title}</h3>
              <p className="text-xs text-[#57655B] leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>

        {/* Step by Step Timeline */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E5E3D8] space-y-8 shadow-xs">
          <div className="max-w-xl space-y-1 pb-2 border-b border-[#E5E3D8]">
            <span className="text-xs font-bold text-[#C25E38] uppercase tracking-widest">
              ALUR LENGKAP
            </span>
            <h2 className="font-serif-title text-3xl font-normal text-[#18221B]">
              5 Tahap Sirkulasi Peminjaman
            </h2>
          </div>

          <div className="space-y-6">
            {steps.map((st) => (
              <div key={st.step} className="flex items-start gap-4 sm:gap-6">
                <div className="w-10 h-10 rounded-2xl bg-[#132E20] text-white flex items-center justify-center font-bold text-sm font-mono-code shrink-0 shadow-xs">
                  {st.step}
                </div>
                <div className="space-y-1 flex-1 pb-6 border-b border-[#F0EEE6] last:border-b-0">
                  <h4 className="font-bold text-[#18221B] text-base">{st.title}</h4>
                  <p className="text-xs sm:text-sm text-[#57655B] leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <div className="max-w-xl space-y-1 pb-2 border-b border-[#E5E3D8]">
            <span className="text-xs font-bold text-[#C25E38] uppercase tracking-widest">
              PERTANYAAN UMUM
            </span>
            <h2 className="font-serif-title text-3xl font-normal text-[#18221B]">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E3D8] space-y-2.5 shadow-xs"
              >
                <h4 className="font-bold text-[#18221B] text-sm flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#132E20] shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-[#57655B] leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#132E20] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-serif-title font-normal text-2xl sm:text-3xl text-white">
              Siap Membawa Pulang Bacaan Favorit?
            </h3>
            <p className="text-xs text-emerald-200">
              Temukan buku pilihan Anda sekarang juga di katalog perpustakaan kami.
            </p>
          </div>

          <Link
            href="/books"
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#F8F7F2] text-[#132E20] font-bold text-xs flex items-center gap-2 transition-all shrink-0 shadow-xs active:scale-95"
          >
            <span>Buka Katalog Buku</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
