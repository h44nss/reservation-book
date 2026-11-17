import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BookDetailClient } from '@/components/books/book-detail-client';

export function generateStaticParams() {
  return [
    { id: 'book-1' },
    { id: 'book-2' },
    { id: 'book-3' },
    { id: 'book-4' },
    { id: 'book-5' },
    { id: 'book-6' },
    { id: 'book-7' },
    { id: 'book-8' },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-8 pb-20">
        <Suspense
          fallback={
            <div className="flex-1 flex flex-col items-center justify-center p-16 text-center space-y-4">
              <div className="w-8 h-8 rounded-full border-2 border-[#1E3A2B] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Memuat rincian buku...</p>
            </div>
          }
        >
          <BookDetailClient id={id} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
