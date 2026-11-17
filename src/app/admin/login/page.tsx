'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { SiteLogoMark } from '@/components/ui/site-logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Autentikasi gagal. Silakan periksa kembali data Anda.');
        setLoading(false);
        return;
      }

      // Store in localStorage as instant client-side session backup
      try {
        localStorage.setItem('pustaka_admin_user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('pustaka_admin_token', data.token);
        }
      } catch {
        // ignore storage quota error
      }

      setSuccessMsg(`Selamat datang, ${data.user.name}! Mengalihkan...`);
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 500);
    } catch {
      setError('Gagal menghubungi server autentikasi.');
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Harap masukkan email dan kata sandi admin.');
      return;
    }
    performLogin(email.trim(), password);
  };

  const handleQuickDemo = (demoType: 'super' | 'staff') => {
    const demoEmail = demoType === 'super' ? 'admin@pustakamodern.id' : 'petugas@pustakamodern.id';
    const demoPass = 'Admin123!';
    setEmail(demoEmail);
    setPassword(demoPass);
    performLogin(demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8FAFC] relative text-slate-900">
      
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        
        {/* Back to public */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Website Publik</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2.5">
          <SiteLogoMark size={48} className="mx-auto" />
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Masuk Panel Petugas
          </h1>
          <p className="text-xs text-slate-500">
            Akses portal internal petugas loket sirkulasi perpustakaan.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 mb-1.5 font-bold">Email Administrator</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pustakamodern.id"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3A2B] focus:bg-white transition-all text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1.5 font-bold">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3A2B] focus:bg-white transition-all text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#1E3A2B] hover:bg-[#162C21] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Memverifikasi Sesi...</span>
              </span>
            ) : (
              <>
                <span>Masuk ke Meja Kontrol</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Shortcut */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2.5">
          <span className="text-[11px] text-slate-400 block font-medium">
            Kredensial Pengujian (Demo):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('super')}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Super Admin</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('staff')}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold border border-slate-200 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Petugas Loket</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Kata sandi default: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">Admin123!</code>
          </p>
        </div>

      </div>
    </div>
  );
}
