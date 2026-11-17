'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  ArrowLeft,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { SiteLogoMark } from '@/components/ui/site-logo';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Check local storage session first for instant render
    let cachedUser: AdminUser | null = null;
    let cachedToken: string | null = null;
    try {
      const stored = localStorage.getItem('pustaka_admin_user');
      cachedToken = localStorage.getItem('pustaka_admin_token');
      if (stored) {
        cachedUser = JSON.parse(stored);
        if (cachedUser?.email) {
          setAdminUser(cachedUser);
          setIsCheckingAuth(false);
        }
      }
    } catch {
      // ignore
    }

    // 2. Validate session with backend API
    const headers: Record<string, string> = {};
    if (cachedToken) {
      headers['Authorization'] = `Bearer ${cachedToken}`;
    }

    fetch('/api/auth/me', { headers })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.authenticated && data.user) {
            setAdminUser(data.user);
            try {
              localStorage.setItem('pustaka_admin_user', JSON.stringify(data.user));
            } catch { /* ignore */ }
          } else if (!cachedUser) {
            router.push('/admin/login');
          }
        }
      })
      .catch(() => {
        if (isMounted && !cachedUser) {
          router.push('/admin/login');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem('pustaka_admin_user');
      localStorage.removeItem('pustaka_admin_token');
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    window.location.href = '/admin/login';
  };

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { href: '/admin/requests', label: 'Pengajuan & Tiket', icon: ClipboardList },
    { href: '/admin/books', label: 'Manajemen Koleksi', icon: BookOpen },
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8FAFC]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1E3A2B] text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-5 h-5 text-emerald-300 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm">Memverifikasi Hak Akses Petugas...</h3>
            <p className="text-xs text-slate-400">Menghubungkan ke sesi aman portal administrasi.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] text-slate-900">
      
      {/* Sidebar for Desktop */}
      <aside className="w-64 border-r border-slate-200 bg-white p-5 hidden md:flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Admin Brand */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <SiteLogoMark size={36} />
            <div>
              <span className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                ADMIN PANEL
                <span className="text-[9px] uppercase px-1 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  LOKET
                </span>
              </span>
              <span className="text-[11px] text-slate-500 block truncate max-w-[130px]">
                {adminUser?.name || 'Petugas Loket'}
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#1E3A2B] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" /> Petugas:
              </span>
              <span className="text-emerald-700 font-bold text-[10px] uppercase">
                {adminUser?.role || 'Admin'}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 truncate font-semibold">
              {adminUser?.name || 'Petugas'}
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{adminUser?.email || 'admin@pustakamodern.id'}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Web Publik</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? 'Keluar...' : 'Keluar Sesi'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden p-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <SiteLogoMark size={28} />
          <div>
            <span className="font-bold text-slate-900 text-sm block leading-none">ADMIN LOKET</span>
            <span className="text-[10px] text-slate-500">{adminUser?.name || 'Petugas'}</span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-100 text-slate-700"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden p-4 bg-white border-b border-slate-200 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-xs font-bold ${
                isActive(link.href) ? 'bg-[#1E3A2B] text-white' : 'text-slate-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2 text-xs text-slate-600 font-medium"
            >
              ← Kembali ke Web Publik
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-xs font-bold text-rose-700"
            >
              Keluar Sesi Petugas
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

    </div>
  );
}
