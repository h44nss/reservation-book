'use client';

import React from 'react';
import Link from 'next/link';
import { useLibrary } from '@/context/library-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import {
  Sparkles,
  Radio,
  Zap,
  Database,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function ServicesPage() {
  const { services, siteSettings } = useLibrary();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio':
        return <Radio className="w-6 h-6 text-[#132E20]" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-[#C25E38]" />;
      case 'Database':
        return <Database className="w-6 h-6 text-[#0F4C5C]" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-6 h-6 text-[#B48C36]" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F2] text-[#18221B]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-8 pb-24 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl space-y-2 pb-4 border-b border-[#E5E3D8]">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C25E38]">
            FASILITAS & RUANG BACA
          </span>
          <h1 className="font-serif-title text-3xl sm:text-5xl font-normal text-[#18221B]">
            Layanan & Fasilitas Perpustakaan
          </h1>
          <p className="text-xs sm:text-sm text-[#57655B] leading-relaxed">
            Menghadirkan perpaduan antara ruang belajar fisik yang tenang dan layanan sirkulasi peminjaman digital kilat untuk seluruh pembaca.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-5 sm:p-8 rounded-3xl bg-white border border-[#E5E3D8] hover:shadow-lg transition-all space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8] flex items-center justify-center">
                  {getServiceIcon(service.icon)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F8F7F2] text-[#57655B] border border-[#E5E3D8]">
                  {service.tag}
                </span>
              </div>

              <div>
                <h3 className="font-serif-title text-2xl font-normal text-[#18221B]">{service.title}</h3>
                <p className="text-xs sm:text-sm text-[#57655B] mt-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0EEE6] space-y-2.5">
                <span className="text-[10px] font-bold text-[#8A968E] uppercase tracking-widest block">
                  KEUNGGULAN FASILITAS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#18221B]">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Operational Hours Banner */}
        <div className="p-5 sm:p-10 rounded-3xl bg-white border border-[#E5E3D8] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="font-serif-title text-2xl font-normal text-[#18221B]">
              Kunjungi Perpustakaan Kami Langsung
            </h3>
            <p className="text-xs text-[#57655B] max-w-xl leading-relaxed">
              Alamat: {siteSettings.address} • Jam Operasional: {siteSettings.operating_hours}
            </p>
          </div>

          <Link
            href="/books"
            className="px-6 py-3 rounded-xl bg-[#132E20] hover:bg-[#0D2016] text-white font-bold text-xs transition-all shrink-0 shadow-xs flex items-center gap-2 active:scale-95"
          >
            <span>Eksplorasi Katalog Buku</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
