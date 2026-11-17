'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLibrary, getAvailableStock } from '@/context/library-context';
import { AdminLayout } from '@/components/layout/admin-layout';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Search,
  Scan,
  AlertCircle,
  PackageCheck,
  RotateCcw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    books,
    loanRequests,
    adminApproveRequest,
    adminRejectRequest,
    adminHandoverBook,
    adminReturnBook,
  } = useLibrary();

  const [scanQuery, setScanQuery] = useState('');
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const totalPhysicalBooks = books.reduce((acc, b) => acc + b.stock_total, 0);
  const totalAvailableStock = books.reduce((acc, b) => acc + getAvailableStock(b), 0);
  const totalBorrowedStock = books.reduce((acc, b) => acc + b.stock_borrowed, 0);
  const totalReservedStock = books.reduce((acc, b) => acc + b.stock_reserved, 0);

  const pendingRequests = loanRequests.filter((r) => r.status === 'Pending');
  const activeLoans = loanRequests.filter((r) => r.status === 'Borrowed');

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleApprove = async (id: string) => {
    const res = await adminApproveRequest(id);
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  };

  const handleOpenReject = (id: string) => {
    setRejectModalId(id);
    setRejectReason('Stok buku fisik sedang dalam perawatan / tidak layak pinjam');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalId) return;
    const res = await adminRejectRequest(rejectModalId, rejectReason);
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
    setRejectModalId(null);
  };

  const handleHandover = async (id: string) => {
    const res = await adminHandoverBook(id);
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  };

  const handleReturn = async (id: string) => {
    const res = await adminReturnBook(id);
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  };

  const displayedRequests = loanRequests.filter((r) => {
    if (!scanQuery.trim()) return true;
    const q = scanQuery.toLowerCase();
    return (
      r.request_code.toLowerCase().includes(q) ||
      r.borrower_name.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              DASHBOARD UTAMA
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
              Meja Layanan Loket Perpustakaan
            </h1>
            <p className="text-xs text-slate-500">
              Pengelolaan sirkulasi buku, validasi tiket, dan alokasi stok fisik secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/books"
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
            >
              + Kelola Data Buku
            </Link>
            <Link
              href="/admin/requests"
              className="px-4 py-2 rounded-xl bg-[#1E3A2B] text-white text-xs font-semibold hover:bg-[#162C21] shadow-xs transition-all"
            >
              Semua Tiket ({loanRequests.length})
            </Link>
          </div>
        </div>

        {/* Toast Feedback */}
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* 4 Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Buku Fisik</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{totalPhysicalBooks}</span>
              <span className="text-xs text-slate-400">Salinan</span>
            </div>
            <p className="text-[11px] text-slate-500">Di seluruh kategori</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase">Tersedia di Rak</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-700">
                {totalAvailableStock}
              </span>
              <span className="text-xs text-slate-400">Siap Pinjam</span>
            </div>
            <p className="text-[11px] text-slate-500">{totalReservedStock} Sedang di-reserve</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-blue-800 uppercase">Sedang Dipinjam</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-blue-700">
                {totalBorrowedStock}
              </span>
              <span className="text-xs text-slate-400">Buku</span>
            </div>
            <p className="text-[11px] text-slate-500">{activeLoans.length} Transaksi Aktif</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-amber-800 uppercase">Pending Review</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-700">
                {pendingRequests.length}
              </span>
              <span className="text-xs text-slate-400">Pengajuan</span>
            </div>
            <p className="text-[11px] text-slate-500">Perlu tindakan persetujuan</p>
          </div>

        </div>

        {/* Quick Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={scanQuery}
            onChange={(e) => setScanQuery(e.target.value)}
            placeholder="Cari kode tiket (misal: LIB-7742-X), nama peminjam, atau nomor HP..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {scanQuery && (
            <button
              onClick={() => setScanQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Reset
            </button>
          )}
        </div>

        {/* Requests Management Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">
              Antrean Pelayanan & Sirkulasi
            </h3>
            <span className="text-xs text-slate-500">
              {displayedRequests.length} Tiket Ditemukan
            </span>
          </div>

          {displayedRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Tidak ada antrean tiket yang cocok dengan pencarian.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold text-slate-500 uppercase text-[10px]">
                    <th className="py-3 px-4">Kode Tiket</th>
                    <th className="py-3 px-4">Peminjam</th>
                    <th className="py-3 px-4">Buku yang Diajukan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi Meja Loket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1E3A2B] whitespace-nowrap">
                        {req.request_code}
                      </td>

                      {/* Borrower info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{req.borrower_name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{req.phone}</div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          {req.items.map((i) => (
                            <div key={i.id} className="text-slate-600 truncate">
                              • <span className="font-medium text-slate-900">{i.book.title}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            req.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : req.status === 'Borrowed'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : req.status === 'Returned'
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : req.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {req.status === 'Pending' && (
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Setujui</span>
                            </button>
                            <button
                              onClick={() => handleOpenReject(req.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1 border border-rose-200 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Tolak</span>
                            </button>
                          </div>
                        )}

                        {req.status === 'Approved' && (
                          <button
                            onClick={() => handleHandover(req.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#1E3A2B] hover:bg-[#162C21] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all ml-auto"
                          >
                            <PackageCheck className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Serahkan Buku</span>
                          </button>
                        )}

                        {req.status === 'Borrowed' && (
                          <button
                            onClick={() => handleReturn(req.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 transition-all ml-auto"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Konfirmasi Kembali</span>
                          </button>
                        )}

                        {(req.status === 'Returned' || req.status === 'Rejected') && (
                          <span className="text-slate-400 text-xs">
                            {req.status === 'Returned' ? 'Selesai' : 'Ditolak'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reject Reason Modal */}
        {rejectModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                Tolak Pengajuan Tiket
              </h3>
              <p className="text-xs text-slate-600">
                Sesuai ketentuan, penolakan wajib menyertakan alasan yang jelas:
              </p>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#1E3A2B] focus:bg-white"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setRejectModalId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmReject}
                  disabled={!rejectReason.trim()}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  Konfirmasi Penolakan
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
