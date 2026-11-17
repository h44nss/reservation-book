'use client';

import React, { useState } from 'react';
import { LoanRequest } from '@/types';
import { useLibrary } from '@/context/library-context';
import { BookCover } from '@/components/ui/book-cover';
import { SiteLogoMark } from '@/components/ui/site-logo';
import {
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Share2,
  BookOpen,
  Calendar,
  Phone,
  ShieldCheck,
  Bookmark,
} from 'lucide-react';

interface CyberTicketProps {
  request: LoanRequest;
}

export function CyberTicket({ request }: CyberTicketProps) {
  const { siteSettings } = useLibrary();
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(request.request_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo Petugas Loket Perpustakaan, saya ingin konfirmasi tiket peminjaman buku saya:\n\n*Kode Tiket:* ${request.request_code}\n*Nama Peminjam:* ${request.borrower_name}\n*Status:* ${request.status}\n\nTerima kasih!`
    );
    const rawPhone = siteSettings?.phone || '+62 877-7900-0411';
    let cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Approved':
        return {
          label: 'Disetujui • Siap Diambil di Loket',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dotClass: 'bg-emerald-600',
          stepIndex: 1,
        };
      case 'Borrowed':
        return {
          label: 'Sedang Dipinjam • Masa Aktif',
          badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
          dotClass: 'bg-sky-600',
          stepIndex: 2,
        };
      case 'Returned':
        return {
          label: 'Selesai Dikembalikan',
          badgeClass: 'bg-[#F4F2EB] text-[#57655B] border-[#E5E3D8]',
          dotClass: 'bg-slate-500',
          stepIndex: 3,
        };
      case 'Rejected':
        return {
          label: 'Pengajuan Ditolak',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
          dotClass: 'bg-rose-600',
          stepIndex: -1,
        };
      case 'Pending':
      default:
        return {
          label: 'Sedang Ditinjau Petugas',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          dotClass: 'bg-amber-600 animate-pulse',
          stepIndex: 0,
        };
    }
  };

  const statusConfig = getStatusConfig(request.status);

  const steps = [
    { label: 'Diajukan', desc: 'Validasi Sistem' },
    { label: 'Disetujui', desc: 'Siap di Loket' },
    { label: 'Diserahkan', desc: 'Masa Pinjam' },
    { label: 'Selesai', desc: 'Dikembalikan' },
  ];

  return (
    <div className="relative max-w-xl mx-auto rounded-3xl bg-white border border-[#E5E3D8] shadow-lg overflow-hidden text-[#18221B]">
      
      {/* Header Bar */}
      <div className="bg-[#F8F7F2] border-b border-[#E5E3D8] p-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <SiteLogoMark size={24} />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#18221B]">
            TIKET SIRKULASI RESMI PERPUSTAKAAN
          </span>
        </div>
        <span className="text-[10px] font-mono-code text-[#8A968E] uppercase tracking-wider">
          MEJA LOKET UTAMA
        </span>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Tracking Code & Status Box */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8]">
          <div>
            <span className="text-[10px] font-bold text-[#8A968E] uppercase tracking-widest block">
              KODE TIKET PELACAKAN
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono-code tracking-wider text-[#132E20]">
                {request.request_code}
              </span>
              <button
                onClick={copyCode}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#EAE7DC] text-[#18221B] border border-[#E5E3D8] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                title="Salin Kode Tracking"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-800 font-bold">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#57655B]" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-bold text-[#8A968E] uppercase tracking-widest block">
              STATUS SAAT INI
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 mt-1 rounded-full text-xs font-bold border ${statusConfig.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Progress Stepper */}
        {request.status !== 'Rejected' && (
          <div className="py-2">
            <div className="grid grid-cols-4 gap-2 relative">
              {steps.map((step, idx) => {
                const isPassed = idx <= statusConfig.stepIndex;
                const isCurrent = idx === statusConfig.stepIndex;
                return (
                  <div key={step.label} className="flex flex-col items-center text-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all font-mono-code ${
                        isCurrent
                          ? 'bg-[#132E20] text-white ring-4 ring-emerald-100'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-[#F4F2EB] text-[#8A968E]'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isPassed ? 'text-[#18221B]' : 'text-[#8A968E]'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[10px] text-[#8A968E] hidden sm:inline">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs p-4 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A968E] block">Nama Peminjam</span>
            <p className="font-bold text-[#18221B] text-sm mt-0.5">{request.borrower_name}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A968E] block">Nomor WhatsApp</span>
            <p className="font-bold text-[#18221B] font-mono-code text-sm mt-0.5">{request.phone}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A968E] block">Waktu Pengajuan</span>
            <p className="text-[#57655B] mt-0.5">
              {new Date(request.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })} WIB
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A968E] block">Batas Pengambilan</span>
            <p className="text-[#C25E38] font-bold mt-0.5">
              {request.pickup_deadline
                ? new Date(request.pickup_deadline).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) + ' WIB'
                : 'Menunggu Persetujuan'}
            </p>
          </div>
        </div>

        {/* Book Items List */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#18221B] block mb-2.5">
            DAFTAR BUKU DALAM TIKET ({request.items.length} Judul)
          </span>
          <div className="space-y-2.5">
            {request.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#E5E3D8]"
              >
                <div className="w-11 h-15 rounded-lg overflow-hidden shrink-0 border border-[#E5E3D8] book-spine-effect">
                  <BookCover
                    src={item.book.cover_image}
                    title={item.book.title}
                    author={item.book.author}
                    categoryName={item.book.category_name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold text-[#C25E38] uppercase tracking-wider">
                    {item.book.category_name}
                  </span>
                  <h4 className="font-bold text-xs text-[#18221B] truncate">{item.book.title}</h4>
                  <p className="text-[11px] text-[#57655B] truncate">{item.book.author}</p>
                </div>
                <span className="text-xs text-[#57655B] px-2.5 py-1 bg-[#F4F2EB] rounded-md font-medium border border-[#E5E3D8]">
                  1 Eks
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Note */}
        {request.admin_note && (
          <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8] text-xs">
            <span className="font-bold text-[#18221B] block mb-1">
              Catatan Petugas Loket:
            </span>
            <p className="text-[#57655B] leading-relaxed">{request.admin_note}</p>
          </div>
        )}

        {/* Authentic Barcode Strip */}
        <div className="pt-5 border-t border-dashed border-[#E5E3D8] flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-[3px] h-10 w-full justify-center max-w-xs opacity-80">
            {[3, 2, 4, 1, 3, 5, 2, 4, 1, 4, 2, 3, 4, 1, 3, 2, 5, 3, 1, 4, 3, 2, 3, 5, 1, 3].map(
              (weight, i) => (
                <div
                  key={i}
                  className="bg-[#18221B] rounded-[1px] h-full"
                  style={{ width: `${weight}px` }}
                />
              )
            )}
          </div>
          <span className="font-mono-code text-xs tracking-widest text-[#8A968E]">
            *{request.request_code}*
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={shareToWhatsApp}
            className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Konfirmasi ke WhatsApp Petugas</span>
          </button>
          <button
            onClick={copyCode}
            className="py-3 px-4 rounded-xl bg-[#F4F2EB] hover:bg-[#EAE7DC] text-[#18221B] font-semibold text-xs border border-[#E5E3D8] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Copy className="w-4 h-4 text-[#57655B]" />
            <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
