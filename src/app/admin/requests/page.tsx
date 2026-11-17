'use client';

import React, { useState } from 'react';
import { useLibrary } from '@/context/library-context';
import { AdminLayout } from '@/components/layout/admin-layout';
import { BookCover } from '@/components/ui/book-cover';
import { LoanRequest, LoanStatus } from '@/types';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  X,
} from 'lucide-react';

export default function AdminRequestsPage() {
  const {
    loanRequests,
    adminApproveRequest,
    adminRejectRequest,
    adminHandoverBook,
    adminReturnBook,
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'All' | LoanStatus>('All');
  const [search, setSearch] = useState('');
  const [selectedReq, setSelectedReq] = useState<LoanRequest | null>(null);

  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Stok buku fisik sedang dalam perawatan / tidak layak pinjam');
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const filtered = loanRequests.filter((req) => {
    if (activeTab !== 'All' && req.status !== activeTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        req.request_code.toLowerCase().includes(q) ||
        req.borrower_name.toLowerCase().includes(q) ||
        req.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setActionLoading(id + '_approve');
    const res = await adminApproveRequest(id);
    showFeedback(res.message);
    setSelectedReq(null);
    setActionLoading(null);
  };

  const handleConfirmReject = async () => {
    if (!rejectModalId) return;
    setActionLoading(rejectModalId + '_reject');
    const res = await adminRejectRequest(rejectModalId, rejectReason);
    showFeedback(res.message);
    setRejectModalId(null);
    setActionLoading(null);
  };

  const handleHandover = async (id: string) => {
    setActionLoading(id + '_handover');
    const res = await adminHandoverBook(id);
    showFeedback(res.message);
    setSelectedReq(null);
    setActionLoading(null);
  };

  const handleReturn = async (id: string) => {
    setActionLoading(id + '_return');
    const res = await adminReturnBook(id);
    showFeedback(res.message);
    setSelectedReq(null);
    setActionLoading(null);
  };

  const statusCounts = {
    All: loanRequests.length,
    Pending: loanRequests.filter((r) => r.status === 'Pending').length,
    Approved: loanRequests.filter((r) => r.status === 'Approved').length,
    Borrowed: loanRequests.filter((r) => r.status === 'Borrowed').length,
    Returned: loanRequests.filter((r) => r.status === 'Returned').length,
    Rejected: loanRequests.filter((r) => r.status === 'Rejected').length,
  };

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            DATA SIRKULASI
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
            Manajemen Pengajuan & Tiket
          </h1>
          <p className="text-xs text-slate-500">
            Daftar lengkap seluruh tiket pengajuan sirkulasi buku dari pengunjung publik.
          </p>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            {feedback}
          </div>
        )}

        {/* Tab Filters and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['All', 'Pending', 'Approved', 'Borrowed', 'Returned', 'Rejected'] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-[#1E3A2B] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'All' ? 'Semua' : tab} ({statusCounts[tab]})
                </button>
              )
            )}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode tiket, nama, nomor HP..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3A2B] shadow-xs"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold text-slate-500 uppercase text-[10px]">
                  <th className="py-3.5 px-4">Kode Tiket</th>
                  <th className="py-3.5 px-4">Peminjam</th>
                  <th className="py-3.5 px-4">Daftar Buku</th>
                  <th className="py-3.5 px-4">Waktu Pengajuan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1E3A2B]">
                      {req.request_code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{req.borrower_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{req.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 max-w-xs">
                        {req.items.map((it) => (
                          <div key={it.id} className="truncate text-slate-600">
                            • {it.book.title}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(req.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReq(req)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Rincian</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedReq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="w-full max-w-lg p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-500">
                    RINCIAN TIKET
                  </span>
                  <h3 className="text-xl font-bold font-mono text-[#1E3A2B]">
                    {selectedReq.request_code}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReq(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">PEMINJAM</span>
                  <span className="text-slate-900 font-bold">{selectedReq.borrower_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">NOMOR WHATSAPP</span>
                  <span className="text-slate-900 font-bold font-mono">{selectedReq.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">STATUS</span>
                  <span className="text-emerald-800 font-bold">{selectedReq.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">TANGGAL PENGAJUAN</span>
                  <span className="text-slate-600">
                    {new Date(selectedReq.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  DAFTAR BUKU TERPILIH
                </span>
                <div className="space-y-2">
                  {selectedReq.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="w-10 h-12 rounded overflow-hidden shrink-0 border border-slate-200">
                        <BookCover
                          src={it.book.cover_image}
                          title={it.book.title}
                          author={it.book.author}
                          categoryName={it.book.category_name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-slate-900 truncate">{it.book.title}</h5>
                        <p className="text-[11px] text-slate-500 truncate">{it.book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedReq.admin_note && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">
                    CATATAN PETUGAS:
                  </span>
                  <p className="text-slate-600">{selectedReq.admin_note}</p>
                </div>
              )}

              {/* Action buttons inside modal */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
                {selectedReq.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedReq.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                    >
                      Setujui Pengajuan
                    </button>
                    <button
                      onClick={() => {
                        setRejectModalId(selectedReq.id);
                        setSelectedReq(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-200 hover:bg-rose-100"
                    >
                      Tolak
                    </button>
                  </>
                )}

                {selectedReq.status === 'Approved' && (
                  <button
                    onClick={() => {
                      handleHandover(selectedReq.id);
                      setSelectedReq(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#162C21] text-white font-bold text-xs shadow-xs"
                  >
                    Serahkan Buku ke Peminjam
                  </button>
                )}

                {selectedReq.status === 'Borrowed' && (
                  <button
                    onClick={() => {
                      handleReturn(selectedReq.id);
                      setSelectedReq(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs"
                  >
                    Konfirmasi Pengembalian Buku
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {rejectModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                Tolak Pengajuan Tiket
              </h3>
              <p className="text-xs text-slate-600">
                Alasan penolakan untuk catatan peminjam:
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
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
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
