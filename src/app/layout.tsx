import type { Metadata } from 'next';
import './globals.css';
import { LibraryProvider } from '@/context/library-context';

export const metadata: Metadata = {
  title: 'Pustaka Modern | Layanan & Arsip Koleksi Buku',
  description: 'Kurasi buku fisik kontemporer, peminjaman kilat tanpa registrasi akun, dan pelacakan digital status pinjaman secara transparan.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#F8F7F2] text-[#18221B] selection:bg-[#132E20] selection:text-white antialiased">
        <LibraryProvider>
          {children}
        </LibraryProvider>
      </body>
    </html>
  );
}
