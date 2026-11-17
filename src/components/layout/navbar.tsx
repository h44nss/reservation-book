'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLibrary } from '@/context/library-context';
import { ShoppingBag, ShieldCheck, Menu, X } from 'lucide-react';
import { BorrowTrayDrawer } from '@/components/ui/borrow-tray-drawer';
import { SiteLogoMark } from '@/components/ui/site-logo';

export function Navbar() {
  const pathname = usePathname();
  const { borrowTray, siteSettings } = useLibrary();
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/books', label: 'Katalog' },
    { href: '/services', label: 'Fasilitas' },
    { href: '/borrowing-guide', label: 'Panduan' },
    { href: '/tracking', label: 'Lacak Tiket' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#F8F7F2]/95 backdrop-blur-sm border-b border-[#E5E3D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Wordmark & Official Logo Mark */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <SiteLogoMark size={30} className="w-7 h-7 sm:w-8 sm:h-8" />
            <div className="flex items-center gap-1.5">
              <span className="font-serif-title text-lg sm:text-2xl font-bold tracking-tight text-[#18221B] group-hover:text-[#C25E38] transition-colors leading-none">
                {siteSettings.library_name || 'PUSTAKA'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C25E38] shrink-0" />
            </div>
          </Link>

          {/* Desktop Navigation: Understated editorial links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#57655B]">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors relative py-1 ${
                    active ? 'text-[#18221B] font-bold' : 'hover:text-[#18221B]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#18221B] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar: Minimal & Functional */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Borrow Tray Button */}
            <button
              onClick={() => setIsTrayOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-[#D2CEC0] hover:border-[#18221B] bg-white text-xs font-semibold text-[#18221B] transition-all shadow-xs active:scale-95"
              aria-label={`Kantong peminjaman, ${borrowTray.length} buku`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#57655B]" />
              <span className="hidden min-[420px]:inline">Kantong</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#132E20] text-[10px] text-white font-mono-code leading-none">
                {borrowTray.length}
              </span>
            </button>

            {/* Admin Portal Shortcut */}
            <Link
              href="/admin/dashboard"
              title="Meja Kontrol Petugas"
              className="p-1.5 rounded-full text-[#8A968E] hover:text-[#18221B] hover:bg-[#EAE7DC] transition-colors hidden sm:flex items-center justify-center"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#18221B] hover:bg-[#EAE7DC] active:bg-[#E2DFD2] transition-colors"
              aria-label="Menu Navigasi"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 py-4 bg-[#F8F7F2] border-b border-[#E5E3D8] flex flex-col gap-1.5 shadow-lg">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                    active
                      ? 'text-[#18221B] bg-white border border-[#E5E3D8] shadow-xs'
                      : 'text-[#57655B] hover:text-[#18221B] hover:bg-[#EAE7DC]/60'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#132E20]" />}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-[#E5E3D8] mt-1 flex items-center justify-between px-2 text-xs text-[#8A968E]">
              <Link
                href="/admin/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#132E20] font-semibold flex items-center gap-1.5 py-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk Meja Petugas</span>
              </Link>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                <span
                  className={`w-2 h-2 rounded-full ${
                    siteSettings.open_status === 'OPEN' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                {siteSettings.open_status === 'OPEN' ? 'Loket Buka' : 'Loket Libur'}
              </span>
            </div>
          </div>
        )}
      </header>

      <BorrowTrayDrawer isOpen={isTrayOpen} onClose={() => setIsTrayOpen(false)} />
    </>
  );
}
