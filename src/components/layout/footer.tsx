'use client';

import React from 'react';
import Link from 'next/link';
import { useLibrary } from '@/context/library-context';
import { BookOpen, MapPin, Phone, Clock, ShieldCheck, Heart } from 'lucide-react';
import { SiteLogoMark } from '@/components/ui/site-logo';

export function Footer() {
  const { siteSettings } = useLibrary();

  return (
    <footer className="mt-auto border-t border-[#E5E3D8] bg-[#F4F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Archival Mission */}
          <div className="md:col-span-1 space-y-3.5">
            <div className="flex items-center gap-3">
              <SiteLogoMark size={38} />
              <div className="flex flex-col">
                <span className="font-serif-title font-bold text-[#18221B] text-xl tracking-tight leading-none">
                  {siteSettings.library_name || 'PUSTAKA MODERN'}
                </span>
                <span className="font-mono-code text-[9px] tracking-widest text-[#8A968E] uppercase mt-1">
                  ARSIP &amp; SIRKULASI RESMI
                </span>
              </div>
            </div>
            <p className="text-xs text-[#57655B] leading-relaxed">
              {siteSettings.description ||
                'Pusat literasi dan peminjaman buku fisik modern. Menghubungkan pembaca dengan karya sastra dan sains berkualitas melalui reservasi kilat tanpa ribet.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E3D8] text-[11px] text-[#57655B] shadow-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  siteSettings.open_status === 'OPEN' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <span className="font-medium">
                {siteSettings.open_status === 'OPEN' ? 'Pelayanan Loket Aktif' : 'Pelayanan Libur'}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#18221B] mb-4">
              Jelajahi Arsip
            </h4>
            <ul className="space-y-2.5 text-xs text-[#57655B]">
              <li>
                <Link href="/books" className="hover:text-[#132E20] transition-colors">
                  Katalog Koleksi Buku
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#132E20] transition-colors">
                  Layanan & Bilik Baca
                </Link>
              </li>
              <li>
                <Link href="/borrowing-guide" className="hover:text-[#132E20] transition-colors">
                  Panduan Sirkulasi
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-[#132E20] transition-colors">
                  Pelacakan Tiket Digital
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Operational */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#18221B] mb-4">
              Lokasi & Meja Layanan
            </h4>
            <ul className="space-y-3 text-xs text-[#57655B]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8A968E] shrink-0 mt-0.5" />
                <span>{siteSettings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#132E20] shrink-0" />
                <span>{siteSettings.operating_hours}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8A968E] shrink-0" />
                <a
                  href={`https://wa.me/${siteSettings.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-code hover:text-[#132E20] hover:underline"
                  title="Hubungi WhatsApp Perpustakaan"
                >
                  {siteSettings.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Admin Portal */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#18221B] mb-4">
              Petugas Loket
            </h4>
            <p className="text-xs text-[#57655B] leading-relaxed">
              Pengunjung umum dapat meminjam tanpa login. Portal internal diperuntukkan bagi petugas verifikasi penyerahan buku.
            </p>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#EAE7DC] text-xs font-semibold text-[#18221B] transition-all border border-[#E5E3D8] shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#132E20]" />
              Masuk Meja Kontrol Admin
            </Link>
          </div>

        </div>

        <div className="pt-8 border-t border-[#E5E3D8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8A968E]">
          <p>© 2026 {siteSettings.library_name}. Seluruh Hak Cipta Dilindungi.</p>
          <p className="font-mono-code text-[11px]">
            {siteSettings.tagline || 'Sistem Sirkulasi & Arsip Modern'}
          </p>
        </div>
      </div>
    </footer>
  );
}
