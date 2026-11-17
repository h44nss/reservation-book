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

async function BookDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookDetailClient id={id} />;
}

export default function BookDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F2]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-6 sm:pt-8 pb-20">
        <Suspense
          fallback={
            <div className="flex-1 flex flex-col items-center justify-center p-16 text-center space-y-4">
              <div className="w-8 h-8 rounded-full border-2 border-[#132E20] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-[#57655B] font-medium">Memuat rincian buku...</p>
            </div>
          }
        >
          <BookDetailContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
