'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLibrary } from '@/context/library-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CyberTicket } from '@/components/ui/cyber-ticket';
import { LoanRequest } from '@/types';
import {
  Search,
  Scan,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

function TrackingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const { getLoanRequestByCode, loanRequests } = useLibrary();
  const [code, setCode] = useState(initialCode);
  const [isScanning, setIsScanning] = useState(false);
  const [searchedRequest, setSearchedRequest] = useState<LoanRequest | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode.trim()) {
      handleSearch(initialCode.trim());
    }
  }, [initialCode]);

  const handleSearch = async (targetCode: string) => {
    if (!targetCode.trim()) return;

    setIsScanning(true);
    setErrorMsg(null);
    setHasSearched(true);

    const found = await getLoanRequestByCode(targetCode);
    if (found) {
      setSearchedRequest(found);
    } else {
      setSearchedRequest(null);
      setErrorMsg(`Kode tiket "${targetCode.toUpperCase()}" tidak ditemukan dalam catatan sistem perpustakaan.`);
    }
    setIsScanning(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/tracking?code=${encodeURIComponent(code.trim().toUpperCase())}`);
      handleSearch(code);
    }
  };

  const handleSampleClick = (sampleCode: string) => {
    setCode(sampleCode);
    router.push(`/tracking?code=${sampleCode}`);
    handleSearch(sampleCode);
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 w-full pt-8 pb-24 space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Scan className="w-3.5 h-3.5" />
          PELACAKAN TIKET RESMI
        </span>
        <h1 className="font-serif-title text-2xl sm:text-4xl lg:text-5xl font-normal text-[#18221B]">
          Pelacakan Status Peminjaman
        </h1>
        <p className="text-xs sm:text-sm text-[#57655B] max-w-md mx-auto leading-relaxed">
          Masukkan kode tiket yang Anda peroleh saat mengajukan peminjaman (contoh: <code className="font-mono-code font-bold text-[#132E20]">LIB-7742-X</code>).
        </p>
      </div>

      {/* Search Input Box Card */}
      <div className="p-4 sm:p-8 rounded-3xl bg-white border border-[#E5E3D8] shadow-sm max-w-2xl mx-auto space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Label with Clear Context */}
          <div className="flex items-center justify-between">
            <label htmlFor="tracking-code-input" className="text-xs font-bold uppercase tracking-wider text-[#18221B] flex items-center gap-1.5">
              <Scan className="w-3.5 h-3.5 text-[#C25E38]" />
              <span>Kode Tiket Peminjaman</span>
            </label>
            <span className="text-[11px] text-[#8A968E] hidden xs:inline">
              Format: LIB-XXXX-X
            </span>
          </div>

          {/* Search Input & Button - Mobile Stacked, Desktop Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 sm:w-5 h-4 sm:h-5 text-[#8A968E] absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="tracking-code-input"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Contoh: LIB-7742-X"
                className="w-full h-12 sm:h-13 pl-10 sm:pl-12 pr-10 rounded-xl sm:rounded-2xl bg-[#F8F7F2] border border-[#E5E3D8] text-[#18221B] font-mono-code font-bold tracking-wider placeholder-[#8A968E] text-xs sm:text-sm focus:outline-none focus:border-[#132E20] focus:bg-white focus:ring-2 focus:ring-[#132E20]/10 transition-all"
              />
              {code && (
                <button
                  type="button"
                  onClick={() => setCode('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8A968E] hover:text-[#18221B] p-1"
                  aria-label="Bersihkan input"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isScanning || !code.trim()}
              className="w-full md:w-auto h-12 px-6 rounded-xl sm:rounded-2xl bg-[#132E20] hover:bg-[#0D2016] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] shadow-xs shrink-0 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Mengecek...</span>
                </>
              ) : (
                <>
                  <span>Lacak Tiket</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Code Pills */}
          <div className="pt-3 border-t border-[#F0EEE6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-[#8A968E] uppercase tracking-wider shrink-0">
              Contoh kode demo:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {loanRequests.slice(0, 3).map((req) => (
                <button
                  key={req.request_code}
                  type="button"
                  onClick={() => handleSampleClick(req.request_code)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#F8F7F2] hover:bg-[#EAE7DC] text-[#18221B] border border-[#E5E3D8] font-mono-code text-[11px] sm:text-xs transition-colors flex items-center gap-1.5 active:scale-95"
                >
                  <span>{req.request_code}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    req.status === 'Approved' ? 'bg-emerald-500' :
                    req.status === 'Borrowed' ? 'bg-sky-500' : 'bg-amber-500'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Results / Error Area */}
      {isScanning ? (
        <div className="p-16 text-center space-y-3 text-[#57655B]">
          <div className="w-8 h-8 rounded-full border-2 border-[#132E20] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-medium">Memeriksa catatan sirkulasi tiket...</p>
        </div>
      ) : searchedRequest ? (
        <div className="space-y-6 pt-2">
          <CyberTicket request={searchedRequest} />
        </div>
      ) : hasSearched && errorMsg ? (
        <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-3 max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="font-serif-title text-xl font-normal text-[#18221B]">Tiket Tidak Ditemukan</h3>
          <p className="text-xs text-rose-800 leading-relaxed">{errorMsg}</p>
          <p className="text-[11px] text-[#57655B]">
            Pastikan huruf kapital dan tanda hubung sudah sesuai format (contoh: <code className="font-mono-code">LIB-7742-X</code>).
          </p>
        </div>
      ) : null}

      {/* Help Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E3D8] max-w-2xl mx-auto space-y-2.5 text-xs text-[#57655B] shadow-xs">
        <h4 className="font-bold text-[#18221B] flex items-center gap-2 text-sm">
          <HelpCircle className="w-4 h-4 text-[#132E20]" />
          Petunjuk Serah Terima Buku Fisik
        </h4>
        <p className="leading-relaxed">
          Setelah status tiket Anda berubah menjadi <strong>Disetujui</strong>, Anda dapat langsung datang ke meja loket perpustakaan kami. Tunjukkan kode tiket atau tangkapan layar kepada petugas untuk serah terima buku.
        </p>
      </div>

    </main>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F2]">
      <Navbar />
      <Suspense fallback={<div className="p-16 text-center text-[#8A968E]">Memuat Pelacak Tiket...</div>}>
        <TrackingContent />
      </Suspense>
      <Footer />
    </div>
  );
}
