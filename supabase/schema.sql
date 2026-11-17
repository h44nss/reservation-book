-- =============================================
-- NEO-PUSTAKA Database Schema for Supabase
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: admin_users
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE: categories
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT NOT NULL DEFAULT 'Book',
  color TEXT NOT NULL DEFAULT '#1E3A2B',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE: books
-- =============================================
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  category_name TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  publisher TEXT NOT NULL,
  publication_year INTEGER NOT NULL,
  isbn TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  stock_total INTEGER NOT NULL DEFAULT 1,
  stock_borrowed INTEGER NOT NULL DEFAULT 0,
  stock_reserved INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  pages INTEGER,
  badge TEXT CHECK (badge IN ('Staff Pick','Hot Sci-Fi','Masterpiece','Terpopuler','Baru')),
  color_accent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE: services
-- =============================================
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'Star',
  features TEXT[] NOT NULL DEFAULT '{}',
  tag TEXT NOT NULL DEFAULT 'Layanan',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE: site_settings (single row)
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  library_name TEXT NOT NULL DEFAULT 'NEO-PUSTAKA',
  tagline TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  operating_hours TEXT,
  open_status TEXT NOT NULL DEFAULT 'OPEN' CHECK (open_status IN ('OPEN','CLOSED')),
  max_books_per_loan INTEGER NOT NULL DEFAULT 3,
  loan_duration_days INTEGER NOT NULL DEFAULT 7,
  pickup_deadline_hours INTEGER NOT NULL DEFAULT 48,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE: loan_requests
-- =============================================
CREATE TABLE IF NOT EXISTS loan_requests (
  id TEXT PRIMARY KEY,
  request_code TEXT NOT NULL UNIQUE,
  borrower_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Rejected','Borrowed','Returned','Cancelled')),
  admin_note TEXT,
  pickup_deadline TIMESTAMPTZ,
  borrowed_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE: loan_items
-- =============================================
CREATE TABLE IF NOT EXISTS loan_items (
  id TEXT PRIMARY KEY,
  loan_request_id TEXT NOT NULL REFERENCES loan_requests(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_active ON books(is_active);
CREATE INDEX IF NOT EXISTS idx_loan_requests_status ON loan_requests(status);
CREATE INDEX IF NOT EXISTS idx_loan_requests_code ON loan_requests(request_code);
CREATE INDEX IF NOT EXISTS idx_loan_items_request ON loan_items(loan_request_id);
CREATE INDEX IF NOT EXISTS idx_loan_items_book ON loan_items(book_id);

-- =============================================
-- ROW LEVEL SECURITY (disable for service role access)
-- Allow anon to read, service_role to write
-- =============================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read books" ON books FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read loan_requests" ON loan_requests FOR SELECT USING (true);
CREATE POLICY "Public read loan_items" ON loan_items FOR SELECT USING (true);

-- Public insert loan requests (borrowing flow)
CREATE POLICY "Public insert loan_requests" ON loan_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert loan_items" ON loan_items FOR INSERT WITH CHECK (true);

-- Service role full access (API routes use service role key)
CREATE POLICY "Service full access admin_users" ON admin_users USING (auth.role() = 'service_role');
CREATE POLICY "Service full access categories" ON categories USING (auth.role() = 'service_role');
CREATE POLICY "Service full access books" ON books USING (auth.role() = 'service_role');
CREATE POLICY "Service full access services" ON services USING (auth.role() = 'service_role');
CREATE POLICY "Service full access settings" ON site_settings USING (auth.role() = 'service_role');
CREATE POLICY "Service full access loan_requests" ON loan_requests USING (auth.role() = 'service_role');
CREATE POLICY "Service full access loan_items" ON loan_items USING (auth.role() = 'service_role');

-- =============================================
-- SEED: site_settings
-- =============================================
INSERT INTO site_settings (id, library_name, tagline, description, address, phone, email, operating_hours, open_status, max_books_per_loan, loan_duration_days, pickup_deadline_hours)
VALUES (1, 'NEO-PUSTAKA', 'Cyber Archive & Playful Bookstore Experience',
  'Ruang literasi masa depan dengan koleksi buku fisik terkurasi, peminjaman instan tanpa registrasi, dan pelacakan status digital berbasis tiket cyber.',
  'Sektor Literasi 07, Koridor Riset Digital No. 42, Jakarta Pusat',
  '+62 877-7900-0411', 'halo@neopustaka.id',
  'Senin - Sabtu: 08:30 - 20:00 WIB',
  'OPEN', 3, 7, 48)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SEED: categories
-- =============================================
INSERT INTO categories (id, name, slug, description, icon_name, color) VALUES
  ('cat-scifi', 'Sci-Fi & Cyberpunk', 'scifi', 'Petualangan melintasi waktu, realitas alternatif, dan kecerdasan artifisial masa depan.', 'Cpu', '#00F5A0'),
  ('cat-tech', 'Teknologi & Kode', 'teknologi', 'Arsitektur perangkat lunak, sains komputasi, dan rekayasa kecerdasan mesin.', 'Terminal', '#00D2FF'),
  ('cat-lit', 'Sastra & Fiksi Luhur', 'sastra', 'Karya sastra legendaris Indonesia dan dunia yang menggugah nurani dan imajinasi.', 'Feather', '#FF6B35'),
  ('cat-philo', 'Filsafat & Pikiran', 'filsafat', 'Eksplorasi ontologi, eksistensialisme, dan misteri kesadaran manusia.', 'Compass', '#7C3AED'),
  ('cat-design', 'Desain & Seni Visual', 'desain', 'Tipografi radikal, desain interaksi, arsitektur Bauhaus, dan estetika visual.', 'Palette', '#FFD23F')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SEED: books
-- =============================================
INSERT INTO books (id, category_id, category_name, title, author, publisher, publication_year, isbn, description, cover_image, stock_total, stock_borrowed, stock_reserved, is_active, pages, badge, color_accent) VALUES
  ('book-1', 'cat-scifi', 'Sci-Fi & Cyberpunk', 'Neuromancer: Edisi Arkais', 'William Gibson', 'Ace Cybernetics', 2024, '978-0-441-56959-5',
   'Karya agung cyberpunk yang melahirkan istilah Cyberspace. Mengikuti kisah Case, seorang peretas konsol yang dipekerjakan untuk misi peretasan mustahil ke inti AI superinteligensi bernama Wintermute.',
   'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
   6, 2, 1, true, 320, 'Hot Sci-Fi', '#00F5A0'),
  ('book-2', 'cat-lit', 'Sastra & Fiksi Luhur', 'Bumi Manusia', 'Pramoedya Ananta Toer', 'Lentera Dipantara', 2021, '978-979-97312-3-4',
   'Kisah Minke di awal abad ke-20, pergulatan martabat pribumi, cinta terhadap Annelies Mellema, dan perlawanan tanpa gentar Nyai Ontosoroh terhadap ketidakadilan hukum kolonial.',
   'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
   5, 3, 1, true, 535, 'Masterpiece', '#FF6B35'),
  ('book-3', 'cat-tech', 'Teknologi & Kode', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'O''Reilly Media', 2023, '978-1-449-37332-0',
   'Kitab suci rekayasa sistem terdistribusi, konsistensi data, replikasi, partisi, transaksi database, dan pemrosesan stream untuk arsitek perangkat lunak generasi modern.',
   'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=800',
   4, 1, 0, true, 616, 'Staff Pick', '#00D2FF'),
  ('book-4', 'cat-philo', 'Filsafat & Pikiran', 'Gödel, Escher, Bach: Tali Emas Abadi', 'Douglas Hofstadter', 'Basic Books', 2022, '978-0-465-02656-2',
   'Eksplorasi memukau tentang bagaimana pikiran, kesadaran, dan sistem formal saling berjalin melalui rekursi, logika matematika Gödel, karya visual Escher, dan fuga musik J.S. Bach.',
   'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
   3, 0, 1, true, 777, 'Staff Pick', '#7C3AED'),
  ('book-5', 'cat-design', 'Desain & Seni Visual', 'The Elements of Typographic Style', 'Robert Bringhurst', 'Hartley & Marks', 2023, '978-0-88179-205-5',
   'Alkitab tipografi dunia yang menggabungkan sejarah huruf, prinsip desain visual, dan filosofi estetika dalam satu karya definitif yang tak lekang oleh waktu.',
   'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800',
   4, 1, 0, true, 398, 'Staff Pick', '#FFD23F'),
  ('book-6', 'cat-scifi', 'Sci-Fi & Cyberpunk', 'Snow Crash', 'Neal Stephenson', 'Del Rey Books', 2022, '978-0-553-38095-9',
   'Novel visioner yang memprediksi Metaverse, avatar digital, dan dunia virtual immersive dua dekade sebelum istilah itu populer. Hiro Protagonist berjuang melawan virus bahasa yang meretas otak manusia.',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
   5, 2, 1, true, 440, 'Terpopuler', '#00F5A0'),
  ('book-7', 'cat-lit', 'Sastra & Fiksi Luhur', 'Cantik Itu Luka', 'Eka Kurniawan', 'Gramedia Pustaka Utama', 2022, '978-602-03-1258-2',
   'Kisah epik berbalut realisme magis tentang Dewi Ayu yang bangkit dari kubur setelah dua puluh satu tahun mati, menelusuri sejarah kelam Halimunda yang sarat mitos dan dendam.',
   'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=800',
   5, 2, 0, true, 508, 'Masterpiece', '#FF6B35'),
  ('book-8', 'cat-tech', 'Teknologi & Kode', 'Structure and Interpretation of Computer Programs', 'Harold Abelson & Gerald Jay Sussman', 'MIT Press', 2022, '978-0-262-54323-1',
   'Eksplorasi filosofis tentang abstraksi data, rekayasa interpreter, pemrograman fungsional, dan esensi komputasi melalui dialek Lisp/Scheme.',
   'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800',
   2, 0, 1, true, 657, 'Staff Pick', '#00F5A0')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SEED: services
-- =============================================
INSERT INTO services (id, title, description, icon, features, tag) VALUES
  ('serv-1', 'Holographic Study Pods', 'Bilik baca privat kedap suara dengan sistem pencahayaan sirkadian, filter udara hepa, dan terminal koneksi cepat untuk fokus maksimal.', 'Radio', ARRAY['Noise Cancelling 99%','Pencahayaan Eye-Care','Port Daya Cepat 100W'], 'Fasilitas Fisik'),
  ('serv-2', 'Express Book Checkout (Tanpa Akun)', 'Ajukan peminjaman buku favorit Anda dalam hitungan detik melalui web. Dapatkan kode tiket cyber dan ambil langsung di loket pengambilan kilat.', 'Zap', ARRAY['Tanpa Formulir Ribet','Tiket Barcode Instan','Stok Terjamin 48 Jam'], 'Layanan Digital'),
  ('serv-3', 'Digital Cyber-Archive & Naskah Kuno', 'Akses pindaian resolusi ultra tinggi manuskrip sejarah nusantara dan jurnal sains terbuka pada stasiun tablet arsip kami.', 'Database', ARRAY['Restorasi 8K','Catatan Kaki Anotasi','Free Wi-Fi Edukasi'], 'Riset & Arsip'),
  ('serv-4', 'Klub Diskusi & Peluncuran Karya', 'Forum temu mingguan antara pembaca, penulis, dan peneliti untuk membedah wacana kontemporer, fiksi spekulatif, dan teknologi.', 'Sparkles', ARRAY['Sesi Akhir Pekan','Kopi & Teh Gratis','Temu Penulis Eksklusif'], 'Komunitas')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SEED: sample loan_requests
-- =============================================
INSERT INTO loan_requests (id, request_code, borrower_name, phone, email, status, admin_note, pickup_deadline, created_at, updated_at) VALUES
  ('req-001', 'LIB-7742-X', 'Rian Pratama', '081234567890', 'rian.pratama@example.com', 'Approved',
   'Buku sudah disiapkan di Loket 2 (Rak Reserved A-3). Silakan tunjukkan kode ini kepada petugas.',
   NOW() + INTERVAL '36 hours', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '10 hours'),
  ('req-002', 'LIB-9901-C', 'Dinda Kirana', '085712345678', 'dinda@example.com', 'Pending',
   NULL, NULL, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
  ('req-003', 'LIB-3312-Z', 'Fauzan Hidayat', '081398765432', NULL, 'Borrowed',
   NULL, NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

UPDATE loan_requests SET borrowed_at = NOW() - INTERVAL '3 days', due_date = NOW() + INTERVAL '4 days' WHERE id = 'req-003';

INSERT INTO loan_items (id, loan_request_id, book_id, quantity) VALUES
  ('item-001', 'req-001', 'book-1', 1),
  ('item-002', 'req-001', 'book-2', 1),
  ('item-003', 'req-002', 'book-4', 1),
  ('item-004', 'req-003', 'book-3', 1)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SEED: admin_users
-- =============================================
INSERT INTO admin_users (id, email, password, name, role) VALUES
  ('admin-1', 'admin@pustakamodern.id', 'Admin123!', 'Petugas Utama Perpustakaan', 'superadmin'),
  ('admin-2', 'petugas@pustakamodern.id', 'Admin123!', 'Petugas Loket Sirkulasi', 'admin')
ON CONFLICT (id) DO NOTHING;
