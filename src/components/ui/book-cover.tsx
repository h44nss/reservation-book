'use client';

import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  src?: string;
  title: string;
  author?: string;
  categoryName?: string;
  className?: string;
  priority?: boolean;
}

// Deterministic cover gradient & palette based on title
function getCoverTheme(title: string) {
  const themes = [
    {
      bg: 'from-[#1E3A2B] to-[#0F2017]',
      accent: 'border-emerald-500/40',
      pill: 'bg-emerald-500/20 text-emerald-200',
    },
    {
      bg: 'from-[#1E293B] to-[#0F172A]',
      accent: 'border-blue-500/40',
      pill: 'bg-blue-500/20 text-blue-200',
    },
    {
      bg: 'from-[#7C2D12] to-[#431407]',
      accent: 'border-amber-500/40',
      pill: 'bg-amber-500/20 text-amber-200',
    },
    {
      bg: 'from-[#4C1D95] to-[#2E1065]',
      accent: 'border-purple-500/40',
      pill: 'bg-purple-500/20 text-purple-200',
    },
    {
      bg: 'from-[#134E4A] to-[#042F2E]',
      accent: 'border-teal-500/40',
      pill: 'bg-teal-500/20 text-teal-200',
    },
    {
      bg: 'from-[#831843] to-[#500724]',
      accent: 'border-rose-500/40',
      pill: 'bg-rose-500/20 text-rose-200',
    },
  ];

  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % themes.length;
  return themes[index];
}

export function BookCover({
  src,
  title,
  author,
  categoryName,
  className = '',
}: BookCoverProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const theme = getCoverTheme(title);

  // If no src or error loading, show editorial stylized book jacket
  if (!src || hasError) {
    return (
      <div
        className={`relative w-full h-full bg-gradient-to-br ${theme.bg} text-white p-3 sm:p-4 flex flex-col justify-between overflow-hidden select-none border-l-4 border-l-black/30 ${className}`}
      >
        {/* Embossed spine shadow */}
        <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />

        {/* Top: Category Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <span
            className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${theme.pill}`}
          >
            {categoryName || 'Buku Pilihan'}
          </span>
          <BookOpen className="w-3.5 h-3.5 opacity-60" />
        </div>

        {/* Center: Title & Ornament */}
        <div className="relative z-10 my-auto py-2">
          <div className={`w-8 h-0.5 bg-white/40 mb-2 ${theme.accent}`} />
          <h4 className="font-extrabold text-xs sm:text-sm leading-snug line-clamp-3 text-white drop-shadow-xs">
            {title}
          </h4>
          {author && (
            <p className="text-[10px] sm:text-[11px] text-white/70 line-clamp-1 mt-1 font-medium">
              {author}
            </p>
          )}
        </div>

        {/* Bottom: Library Edition Stamp */}
        <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-[9px] text-white/60">
          <span>EDISI PERPUSTAKAAN</span>
          <span className="font-mono">★ ASLI</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-100 ${className}`}>
      {/* Background stylized placeholder while image loads */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.bg} text-white p-3 flex flex-col justify-between`}
        >
          <span className="text-[9px] opacity-70 uppercase font-semibold">Memuat cover...</span>
          <h5 className="font-bold text-xs line-clamp-2">{title}</h5>
        </div>
      )}

      <img
        src={src}
        alt={title}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
      />
    </div>
  );
}
