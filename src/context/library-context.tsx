'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Book, Category, LibraryServiceItem, LoanRequest, SiteSettings } from '@/types';
import {
  INITIAL_BOOKS,
  INITIAL_CATEGORIES,
  INITIAL_SERVICES,
  INITIAL_SETTINGS,
} from '@/lib/data';

export const getAvailableStock = (book: Book): number => {
  return Math.max(0, book.stock_total - book.stock_borrowed - book.stock_reserved);
};

interface SubmitLoanParams {
  borrower_name: string;
  phone: string;
  email?: string;
  notes?: string;
}

interface LibraryContextType {
  books: Book[];
  categories: Category[];
  services: LibraryServiceItem[];
  loanRequests: LoanRequest[];
  siteSettings: SiteSettings;
  borrowTray: Book[];
  isLoading: boolean;
  refreshBooks: () => Promise<void>;
  refreshRequests: () => Promise<void>;
  addToTray: (book: Book) => { success: boolean; message: string };
  removeFromTray: (bookId: string) => void;
  clearTray: () => void;
  submitLoanRequest: (params: SubmitLoanParams) => Promise<{ success: boolean; request?: LoanRequest; message: string }>;
  getLoanRequestByCode: (code: string) => Promise<LoanRequest | undefined>;
  adminApproveRequest: (id: string, note?: string) => Promise<{ success: boolean; message: string }>;
  adminRejectRequest: (id: string, reason: string) => Promise<{ success: boolean; message: string }>;
  adminHandoverBook: (id: string) => Promise<{ success: boolean; message: string }>;
  adminReturnBook: (id: string) => Promise<{ success: boolean; message: string }>;
  adminAddBook: (book: Omit<Book, 'id'>) => Promise<void>;
  adminUpdateBook: (id: string, book: Partial<Book>) => Promise<void>;
  adminToggleBookActive: (id: string) => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const STORAGE_KEY_TRAY = 'pustakamodern_tray_v2';

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [services, setServices] = useState<LibraryServiceItem[]>(INITIAL_SERVICES);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [borrowTray, setBorrowTray] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore tray from localStorage (tray is session-local UX, not persisted in DB)
  useEffect(() => {
    try {
      const savedTray = localStorage.getItem(STORAGE_KEY_TRAY);
      if (savedTray) setBorrowTray(JSON.parse(savedTray));
    } catch { /* ignore */ }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_TRAY, JSON.stringify(borrowTray));
    } catch { /* ignore */ }
  }, [borrowTray, isHydrated]);

  // Fetch all data from API on mount
  const refreshBooks = useCallback(async () => {
    try {
      const res = await fetch('/api/books?active=false');
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch { /* use initial data */ }
  }, []);

  const refreshRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/loan-requests');
      if (res.ok) {
        const data = await res.json();
        setLoanRequests(data);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([
        refreshBooks(),
        (async () => {
          try {
            const res = await fetch('/api/categories');
            if (res.ok) setCategories(await res.json());
          } catch { /* use initial */ }
        })(),
        (async () => {
          try {
            const res = await fetch('/api/services');
            if (res.ok) setServices(await res.json());
          } catch { /* use initial */ }
        })(),
        (async () => {
          try {
            const res = await fetch('/api/settings');
            if (res.ok) setSiteSettings(await res.json());
          } catch { /* use initial */ }
        })(),
        refreshRequests(),
      ]);
      setIsLoading(false);
    };
    init();
  }, [refreshBooks, refreshRequests]);

  // ── Tray operations (client-only) ──────────────────────────────────────────

  const addToTray = (book: Book): { success: boolean; message: string } => {
    const currentBook = books.find((b) => b.id === book.id) || book;
    const available = getAvailableStock(currentBook);

    if (available <= 0) {
      return { success: false, message: 'Buku ini sedang habis dan tidak tersedia di rak!' };
    }
    if (borrowTray.some((item) => item.id === book.id)) {
      return { success: false, message: 'Buku ini sudah ada di dalam kantong peminjaman Anda.' };
    }
    if (borrowTray.length >= siteSettings.max_books_per_loan) {
      return {
        success: false,
        message: `Batas maksimum per pengajuan adalah ${siteSettings.max_books_per_loan} buku.`,
      };
    }

    setBorrowTray((prev) => [...prev, currentBook]);
    return { success: true, message: `"${book.title}" berhasil ditambahkan ke kantong peminjaman.` };
  };

  const removeFromTray = (bookId: string) => {
    setBorrowTray((prev) => prev.filter((b) => b.id !== bookId));
  };

  const clearTray = () => setBorrowTray([]);

  // ── API operations ──────────────────────────────────────────────────────────

  const submitLoanRequest = async (
    params: SubmitLoanParams
  ): Promise<{ success: boolean; request?: LoanRequest; message: string }> => {
    if (borrowTray.length === 0) {
      return { success: false, message: 'Kantong peminjaman masih kosong!' };
    }
    if (!params.borrower_name.trim() || !params.phone.trim()) {
      return { success: false, message: 'Nama dan nomor telepon wajib diisi.' };
    }

    try {
      const res = await fetch('/api/loan-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrower_name: params.borrower_name.trim(),
          phone: params.phone.trim(),
          email: params.email?.trim() || undefined,
          items: borrowTray.map((b) => ({ book_id: b.id, quantity: 1 })),
        }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error ?? 'Terjadi kesalahan.' };

      clearTray();
      await refreshBooks();
      await refreshRequests();
      return { success: true, request: data, message: `Pengajuan berhasil! Kode tiket: ${data.request_code}` };
    } catch {
      return { success: false, message: 'Gagal menghubungi server. Cek koneksi internet Anda.' };
    }
  };

  const getLoanRequestByCode = async (code: string): Promise<LoanRequest | undefined> => {
    try {
      const res = await fetch(`/api/loan-requests/track?code=${encodeURIComponent(code)}`);
      if (!res.ok) return undefined;
      return await res.json();
    } catch {
      return undefined;
    }
  };

  const adminApproveRequest = async (id: string, note?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/loan-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', note }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error ?? 'Gagal menyetujui.' };
      await refreshBooks();
      await refreshRequests();
      return { success: true, message: `Pengajuan berhasil disetujui.` };
    } catch {
      return { success: false, message: 'Gagal menghubungi server.' };
    }
  };

  const adminRejectRequest = async (id: string, reason: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/loan-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', reason }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error ?? 'Gagal menolak.' };
      await refreshBooks();
      await refreshRequests();
      return { success: true, message: `Pengajuan berhasil ditolak.` };
    } catch {
      return { success: false, message: 'Gagal menghubungi server.' };
    }
  };

  const adminHandoverBook = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/loan-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'handover' }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error ?? 'Gagal handover.' };
      await refreshBooks();
      await refreshRequests();
      return { success: true, message: `Buku berhasil diserahkan ke peminjam.` };
    } catch {
      return { success: false, message: 'Gagal menghubungi server.' };
    }
  };

  const adminReturnBook = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/loan-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'return' }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error ?? 'Gagal konfirmasi kembali.' };
      await refreshBooks();
      await refreshRequests();
      return { success: true, message: `Pengembalian buku berhasil dicatat.` };
    } catch {
      return { success: false, message: 'Gagal menghubungi server.' };
    }
  };

  const adminAddBook = async (newBookData: Omit<Book, 'id'>): Promise<void> => {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookData),
      });
      if (res.ok) await refreshBooks();
    } catch { /* ignore */ }
  };

  const adminUpdateBook = async (id: string, partial: Partial<Book>): Promise<void> => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      });
      if (res.ok) await refreshBooks();
    } catch { /* ignore */ }
  };

  const adminToggleBookActive = async (id: string): Promise<void> => {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !book.is_active }),
      });
      if (res.ok) await refreshBooks();
    } catch { /* ignore */ }
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        categories,
        services,
        loanRequests,
        siteSettings,
        borrowTray,
        isLoading,
        refreshBooks,
        refreshRequests,
        addToTray,
        removeFromTray,
        clearTray,
        submitLoanRequest,
        getLoanRequestByCode,
        adminApproveRequest,
        adminRejectRequest,
        adminHandoverBook,
        adminReturnBook,
        adminAddBook,
        adminUpdateBook,
        adminToggleBookActive,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}
