'use client';

import React from 'react';
import Link from 'next/link';

interface SiteLogoProps {
  size?: number;
  className?: string;
  variant?: 'mark' | 'full' | 'horizontal';
  href?: string;
  subtitle?: string;
}

export function SiteLogoMark({
  size = 32,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      aria-label="Logo Neo-Pustaka"
    >
      {/* Outer rounded squircle in deep forest noir */}
      <rect width="48" height="48" rx="12" fill="#132E20" />
      
      {/* Delicate border */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="10"
        stroke="#F8F7F2"
        strokeOpacity="0.15"
        strokeWidth="1.5"
      />

      {/* Terracotta Bookmark Ribbon dropping from top */}
      <path d="M22 6h4v10l-2-1.5-2 1.5V6z" fill="#C25E38" />

      {/* Left Open Page (Alabaster Paper) */}
      <path
        d="M24 35.5C20.5 33.2 14.5 33 11 34.5V17.5C14.5 16 20.5 16.2 24 18.5V35.5Z"
        fill="#F8F7F2"
      />

      {/* Right Open Page (Warm Tinted Parchment) */}
      <path
        d="M24 35.5C27.5 33.2 33.5 33 37 34.5V17.5C33.5 16 27.5 16.2 24 18.5V35.5Z"
        fill="#E8E4D5"
      />

      {/* Book Spine Center Seam */}
      <path
        d="M24 18.5V36.5"
        stroke="#132E20"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Archival Linear Engravings - Left Page */}
      <line
        x1="14"
        y1="22"
        x2="21"
        y2="23"
        stroke="#132E20"
        strokeOpacity="0.3"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="26"
        x2="21"
        y2="27"
        stroke="#132E20"
        strokeOpacity="0.3"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="30"
        x2="21"
        y2="31"
        stroke="#132E20"
        strokeOpacity="0.3"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Archival Linear Engravings - Right Page */}
      <line
        x1="27"
        y1="23"
        x2="34"
        y2="22"
        stroke="#132E20"
        strokeOpacity="0.3"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="27"
        y1="27"
        x2="34"
        y2="26"
        stroke="#132E20"
        strokeOpacity="0.3"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="27"
        y1="31"
        x2="34"
        y2="30"
        stroke="#132E20"
        strokeOpacity="0.3"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Beacon Light of Knowledge */}
      <circle cx="37" cy="11" r="2.2" fill="#E8B931" />
    </svg>
  );
}

export function SiteLogo({
  size = 32,
  className = '',
  variant = 'horizontal',
  href = '/',
  subtitle = 'ARSIP & SIRKULASI',
}: SiteLogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 group cursor-pointer select-none ${className}`}>
      <SiteLogoMark size={size} />
      
      {variant !== 'mark' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-tight text-[#18221B] group-hover:text-[#C25E38] transition-colors leading-none">
              NEO-PUSTAKA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C25E38] shrink-0" />
          </div>
          {variant === 'full' && (
            <span className="font-mono-code text-[9px] tracking-widest text-[#8A968E] uppercase mt-1">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
