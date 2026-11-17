# Product Requirements Document (PRD)

## Website Informasi & Layanan Perpustakaan

**Versi:** 1.0\
**Tanggal:** 17 November 2026\
**Status:** Draft untuk validasi client

------------------------------------------------------------------------

## Informasi Produk

  Item                 Detail
  -------------------- ----------------------------------------------------
  Nama produk          Website Informasi & Layanan Perpustakaan
  Product type         Library Information & Borrowing Website
  Platform             Web responsive
  Frontend             Next.js + TypeScript
  Styling              Tailwind CSS
  Backend / Database   Supabase + PostgreSQL
  Authentication       Supabase Auth
  Deployment           Vercel
  Target pengguna      Pengunjung, calon peminjam, dan admin perpustakaan

### Tujuan Produk

Menyediakan website yang memudahkan masyarakat mendapatkan informasi
perpustakaan, mencari koleksi buku, melihat ketersediaan, serta
mengajukan peminjaman buku secara online tanpa harus membuat akun.

------------------------------------------------------------------------

# 1. Product Overview

## 1.1 Latar Belakang

Perpustakaan membutuhkan media informasi digital yang dapat digunakan
pengunjung untuk mengetahui informasi koleksi buku, layanan
perpustakaan, prosedur peminjaman, serta informasi operasional lainnya.

Website ini menyediakan katalog buku digital yang dilengkapi informasi
ketersediaan stok. Pengunjung dapat mengajukan peminjaman melalui
formulir online dan memantau perkembangan pengajuan menggunakan kode
tracking.

Administrator memiliki dashboard untuk mengelola koleksi buku, kategori,
pengajuan peminjaman, transaksi peminjaman, serta konten informasi
website.

## 1.2 Product Objectives

1.  Menyediakan pusat informasi perpustakaan secara online.
2.  Memudahkan pencarian dan penelusuran koleksi buku.
3.  Memberikan informasi ketersediaan buku secara aktual.
4.  Memfasilitasi pengajuan peminjaman buku secara online.
5.  Mempermudah admin mengelola koleksi dan transaksi peminjaman.
6.  Menyediakan tracking status pengajuan tanpa registrasi pengunjung.

## 1.3 Target Users

  Pengguna         Kebutuhan
  ---------------- --------------------------------------------------------
  Pengunjung       Melihat informasi perpustakaan dan katalog buku
  Calon peminjam   Mengajukan peminjaman dan mengecek status
  Admin            Mengelola buku, stok, pengajuan, dan informasi website

------------------------------------------------------------------------

# 2. Scope of Product

## 2.1 In Scope --- MVP

### Public Website

-   Beranda dan informasi utama perpustakaan.
-   Katalog dan pencarian buku.
-   Filter kategori buku.
-   Detail informasi buku.
-   Informasi stok dan ketersediaan.
-   Informasi layanan perpustakaan.
-   Panduan peminjaman dan pengembalian.
-   Formulir pengajuan peminjaman.
-   Kode pengajuan otomatis.
-   Tracking status pengajuan.
-   Profil, alamat, jam operasional, dan kontak perpustakaan.

### Admin Panel

-   Login administrator.
-   Dashboard ringkasan.
-   CRUD buku dan kategori.
-   Pengelolaan stok buku.
-   Pengelolaan pengajuan peminjaman.
-   Persetujuan dan penolakan pengajuan.
-   Konfirmasi pengambilan buku.
-   Konfirmasi pengembalian buku.
-   Pengelolaan layanan dan panduan.
-   Pengaturan profil website.

## 2.2 Out of Scope

Fitur berikut tidak termasuk dalam MVP: - Registrasi dan login
pengunjung. - Akun anggota perpustakaan. - Pembayaran online. - Denda
otomatis. - Perpanjangan masa pinjam online. - Notifikasi WhatsApp
otomatis. - Integrasi payment gateway. - Reservasi antrean buku. -
Aplikasi mobile native. - Multi-cabang perpustakaan.

------------------------------------------------------------------------

# 3. Functional Requirements

## FR-01 --- Homepage

**Deskripsi:** Menampilkan informasi utama perpustakaan.

  ID         Requirement
  ---------- ---------------------------------------------
  FR-01.01   Menampilkan nama dan identitas perpustakaan
  FR-01.02   Menampilkan deskripsi singkat perpustakaan
  FR-01.03   Menampilkan highlight koleksi buku
  FR-01.04   Menampilkan informasi layanan
  FR-01.05   Menampilkan jam operasional
  FR-01.06   Menampilkan alamat dan kontak

**Acceptance Criteria:** - Homepage dapat diakses tanpa login. -
Informasi yang ditampilkan berasal dari pengaturan website. - Buku
unggulan hanya menampilkan data buku aktif. - Navigasi menuju halaman
lain berfungsi.

## FR-02 --- Book Catalog

**Deskripsi:** Menyediakan katalog koleksi buku.

  ID         Requirement
  ---------- ------------------------------------------------------
  FR-02.01   Menampilkan daftar buku
  FR-02.02   Menampilkan cover buku
  FR-02.03   Menampilkan judul dan penulis
  FR-02.04   Menampilkan kategori buku
  FR-02.05   Menampilkan tahun terbit
  FR-02.06   Menampilkan jumlah stok tersedia
  FR-02.07   Menampilkan status ketersediaan
  FR-02.08   Menyediakan pencarian berdasarkan judul atau penulis
  FR-02.09   Menyediakan filter berdasarkan kategori
  FR-02.10   Menyediakan halaman detail buku

**Business Rules:** - Buku dengan stok tersedia lebih dari 0 berstatus
`Tersedia`. - Buku dengan stok tersedia 0 berstatus `Tidak Tersedia`. -
Buku nonaktif tidak ditampilkan pada katalog publik. - Buku yang tidak
tersedia tetap dapat dilihat detailnya, tetapi tidak dapat diajukan.

**Acceptance Criteria:** - Pencarian menghasilkan buku sesuai kata
kunci. - Filter kategori bekerja sesuai kategori yang dipilih. - Jumlah
stok sesuai data database. - Buku tidak tersedia tidak dapat ditambahkan
ke pengajuan.

## FR-03 --- Library Services

**Deskripsi:** Menampilkan informasi layanan perpustakaan.

  ID         Requirement
  ---------- --------------------------------------
  FR-03.01   Menampilkan daftar layanan
  FR-03.02   Menampilkan nama layanan
  FR-03.03   Menampilkan deskripsi layanan
  FR-03.04   Menampilkan gambar atau ikon layanan
  FR-03.05   Admin dapat mengelola layanan

**Acceptance Criteria:** - Pengunjung dapat melihat layanan tanpa
login. - Admin dapat menambah, mengedit, dan menghapus layanan. -
Layanan nonaktif tidak ditampilkan pada website.

## FR-04 --- Borrowing Guide

**Deskripsi:** Menyediakan panduan peminjaman dan pengembalian buku.

Informasi yang ditampilkan: - Persyaratan peminjaman. - Langkah
pengajuan. - Maksimal jumlah buku. - Durasi peminjaman. - Batas waktu
pengambilan. - Prosedur pengembalian. - Ketentuan keterlambatan.

**Acceptance Criteria:** - Pengunjung dapat membaca panduan tanpa
login. - Admin dapat memperbarui ketentuan peminjaman. - Perubahan
informasi diperbarui pada halaman publik.

## FR-05 --- Online Borrowing Request

**Deskripsi:** Pengunjung dapat mengajukan peminjaman buku melalui
website tanpa membuat akun.

### Formulir Pengajuan

  Field                   Tipe           Wajib
  ----------------------- -------------- -------
  Nama peminjam           Text           Ya
  Nomor HP                Tel            Ya
  Email                   Email          Tidak
  Pilihan buku            Multi-select   Ya
  Jumlah buku             Number         Ya
  Persetujuan ketentuan   Checkbox       Ya

### Business Rules

1.  Pengunjung tidak perlu login.
2.  Satu pengajuan dapat berisi beberapa judul buku.
3.  Jumlah buku tidak boleh melebihi stok tersedia.
4.  Jumlah buku tidak boleh melebihi batas peminjaman yang ditetapkan.
5.  Pengajuan baru memiliki status `Pending`.
6.  Sistem menghasilkan kode pengajuan unik.
7.  Pengajuan disimpan ke database.
8.  Sistem menampilkan kode pengajuan setelah berhasil disimpan.

**Acceptance Criteria:** - Formulir tidak dapat dikirim jika field wajib
kosong. - Sistem menolak jumlah buku yang tidak valid. - Sistem
melakukan validasi ulang stok di database ketika pengajuan dibuat. -
Pengunjung menerima kode pengajuan setelah pengajuan berhasil. -
Pengunjung tidak dapat mengubah status pengajuan secara langsung.

## FR-06 --- Application Tracking

**Deskripsi:** Pengunjung dapat memantau status pengajuan menggunakan
kode pengajuan.

### Alur

1.  Pengunjung membuka halaman tracking.
2.  Pengunjung memasukkan kode pengajuan.
3.  Sistem memvalidasi kode.
4.  Sistem menampilkan status pengajuan.
5.  Sistem menampilkan detail buku dan informasi pengambilan jika
    disetujui.

### Informasi yang Ditampilkan

-   Kode pengajuan.
-   Tanggal pengajuan.
-   Status pengajuan.
-   Daftar buku yang diajukan.
-   Jumlah buku.
-   Catatan admin yang aman untuk ditampilkan.
-   Tanggal persetujuan.
-   Batas waktu pengambilan jika ada.
-   Tanggal pengembalian jika relevan.

**Acceptance Criteria:** - Kode valid menampilkan pengajuan yang
sesuai. - Kode tidak valid menampilkan pesan yang sesuai. - Data pribadi
tidak ditampilkan secara berlebihan. - Tracking tidak memungkinkan
pengunjung mengakses data pengajuan orang lain tanpa otorisasi.

## FR-07 --- Admin Authentication

**Deskripsi:** Menyediakan autentikasi administrator.

  -----------------------------------------------------------------------
  ID                                  Requirement
  ----------------------------------- -----------------------------------
  FR-07.01                            Admin dapat login

  FR-07.02                            Admin dapat logout

  FR-07.03                            Admin yang belum login tidak dapat
                                      mengakses dashboard

  FR-07.04                            Sistem melakukan validasi session

  FR-07.05                            Admin dapat mengganti password
                                      melalui mekanisme pemulihan yang
                                      aman
  -----------------------------------------------------------------------

**Acceptance Criteria:** - Login menggunakan kredensial valid
berhasil. - Kredensial salah menampilkan pesan error. - Session yang
tidak valid diarahkan kembali ke login. - Pengunjung tidak memiliki
akses ke halaman admin.

## FR-08 --- Admin Dashboard

**Deskripsi:** Menampilkan ringkasan informasi operasional perpustakaan.

Informasi dashboard: - Total koleksi buku. - Total kategori. - Total
buku tersedia. - Total buku sedang dipinjam. - Pengajuan menunggu
persetujuan. - Pengajuan disetujui. - Pengajuan ditolak. - Daftar
pengajuan terbaru.

**Acceptance Criteria:** - Data dashboard berasal dari database. -
Statistik berubah sesuai aktivitas. - Data tidak menggunakan angka dummy
pada production.

## FR-09 --- Book Management

**Deskripsi:** Admin dapat mengelola data buku.

  ID         Requirement
  ---------- -----------------------------
  FR-09.01   Tambah buku
  FR-09.02   Edit informasi buku
  FR-09.03   Hapus atau nonaktifkan buku
  FR-09.04   Upload cover buku
  FR-09.05   Mengatur kategori buku
  FR-09.06   Mengatur jumlah stok
  FR-09.07   Melihat status ketersediaan

**Acceptance Criteria:** - Buku dapat ditambahkan dengan data valid. -
Buku dapat diedit. - Buku yang memiliki transaksi aktif tidak dapat
dihapus permanen. - Perubahan stok tidak boleh membuat stok tersedia
bernilai negatif. - Buku nonaktif tidak muncul pada katalog publik.

## FR-10 --- Category Management

Admin dapat: - Menambah kategori. - Mengubah kategori. - Menghapus
kategori yang tidak digunakan. - Melihat jumlah buku dalam kategori.

Kategori yang masih digunakan oleh buku tidak boleh dihapus sebelum
relasinya diselesaikan.

## FR-11 --- Borrowing Request Management

Admin dapat melihat seluruh pengajuan.

  ID         Requirement
  ---------- ---------------------------------------
  FR-11.01   Melihat daftar pengajuan
  FR-11.02   Melihat detail pengajuan
  FR-11.03   Menyetujui pengajuan
  FR-11.04   Menolak pengajuan
  FR-11.05   Memberikan catatan penolakan
  FR-11.06   Mengubah status pengajuan sesuai alur

**Business Rules:** - Pengajuan baru berstatus `Pending`. - Admin dapat
menyetujui pengajuan jika stok mencukupi. - Persetujuan mengalokasikan
stok melalui mekanisme reserved. - Admin wajib mengisi alasan jika
menolak pengajuan. - Pengajuan yang sudah diproses tidak boleh disetujui
atau ditolak ulang tanpa alur koreksi yang jelas.

## FR-12 --- Borrowing & Returning Management

Admin dapat: - Melihat transaksi buku yang sedang dipinjam. -
Mengonfirmasi pengambilan buku. - Menentukan tanggal jatuh tempo. -
Melihat daftar buku yang harus dikembalikan. - Mengonfirmasi
pengembalian. - Melihat riwayat peminjaman.

**Business Rules:** - Status `Approved` berubah menjadi `Borrowed`
ketika buku benar-benar diserahkan. - Stok reserved berkurang ketika
buku diserahkan. - Stok borrowed bertambah ketika buku diserahkan. -
Stok borrowed berkurang ketika buku dikembalikan. - Stok tersedia
bertambah ketika buku dikembalikan.

## FR-13 --- Website Content Management

Admin dapat mengelola: - Nama perpustakaan. - Deskripsi perpustakaan. -
Logo. - Alamat. - Nomor telepon. - Email. - Jam operasional. -
Layanan. - Panduan peminjaman. - Visi dan misi.

Untuk logo, sementara gunakan identitas teks dan ikon buku. Logo resmi
dapat diunggah kemudian.

------------------------------------------------------------------------

# 4. Non-Functional Requirements

  -----------------------------------------------------------------------
  ID                      Kategori                Requirement
  ----------------------- ----------------------- -----------------------
  NFR-01                  Performance             Halaman utama dan
                                                  katalog dioptimalkan
                                                  agar cepat dimuat

  NFR-02                  Responsive              Website mendukung
                                                  desktop, tablet, dan
                                                  mobile

  NFR-03                  Security                Menggunakan Supabase
                                                  Auth dan RLS

  NFR-04                  Security                Secret key tidak boleh
                                                  terekspos di frontend

  NFR-05                  Data Integrity          Perubahan stok harus
                                                  konsisten dan
                                                  transaksional

  NFR-06                  Usability               Navigasi mudah dipahami

  NFR-07                  Reliability             Error ditampilkan
                                                  dengan pesan informatif

  NFR-08                  SEO                     Menggunakan metadata
                                                  dan URL ramah mesin
                                                  pencari

  NFR-09                  Accessibility           Kontras dan label form
                                                  mudah dipahami

  NFR-10                  Maintainability         Struktur kode modular
                                                  dan mudah dikembangkan
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 5. Database Design

Database menggunakan PostgreSQL melalui Supabase.

## 5.1 Daftar Tabel

  Tabel                   Fungsi
  ----------------------- -----------------------------
  `admins`                Profil administrator
  `categories`            Kategori buku
  `books`                 Data koleksi buku
  `loan_requests`         Data pengajuan
  `loan_items`            Detail buku dalam pengajuan
  `services`              Informasi layanan
  `loan_rules`            Ketentuan peminjaman
  `site_settings`         Informasi website
  `loan_status_logs`      Histori perubahan status
  `stock_movements`       Histori perubahan stok
  `admin_activity_logs`   Aktivitas penting admin

## 5.2 Rancangan Field Utama

### Table: `categories`

  Field         Tipe        Keterangan
  ------------- ----------- ----------------
  id            UUID        Primary key
  name          VARCHAR     Nama kategori
  description   TEXT        Deskripsi
  created_at    TIMESTAMP   Tanggal dibuat

### Table: `books`

  Field              Tipe        Keterangan
  ------------------ ----------- -------------------------------
  id                 UUID        Primary key
  category_id        UUID        Relasi kategori
  title              VARCHAR     Judul buku
  author             VARCHAR     Penulis
  publisher          VARCHAR     Penerbit
  publication_year   INT         Tahun terbit
  isbn               VARCHAR     Nomor ISBN
  description        TEXT        Deskripsi buku
  cover_image        TEXT        URL cover
  stock_total        INT         Total stok fisik
  stock_borrowed     INT         Buku sedang dipinjam
  stock_reserved     INT         Buku disetujui, belum diambil
  is_active          BOOLEAN     Status aktif
  created_at         TIMESTAMP   Tanggal dibuat
  updated_at         TIMESTAMP   Terakhir diperbarui

Stok tersedia dihitung dengan rumus:

`stock_available = stock_total - stock_borrowed - stock_reserved`

### Table: `loan_requests`

  Field             Tipe        Keterangan
  ----------------- ----------- -------------------------
  id                UUID        Primary key
  request_code      VARCHAR     Kode tracking unik
  borrower_name     VARCHAR     Nama peminjam
  phone             VARCHAR     Nomor HP
  email             VARCHAR     Email opsional
  status            VARCHAR     Status pengajuan
  admin_note        TEXT        Catatan admin
  approved_at       TIMESTAMP   Waktu persetujuan
  pickup_deadline   TIMESTAMP   Batas waktu pengambilan
  borrowed_at       TIMESTAMP   Waktu pengambilan
  due_date          DATE        Batas pengembalian
  returned_at       TIMESTAMP   Waktu pengembalian
  created_at        TIMESTAMP   Waktu pengajuan
  updated_at        TIMESTAMP   Terakhir diperbarui

### Table: `loan_items`

  Field             Tipe   Keterangan
  ----------------- ------ ------------------
  id                UUID   Primary key
  loan_request_id   UUID   Relasi pengajuan
  book_id           UUID   Relasi buku
  quantity          INT    Jumlah buku

### Table: `admins`

Gunakan Supabase Auth untuk autentikasi. Tabel profil admin menyimpan
data tambahan.

  Field        Tipe        Keterangan
  ------------ ----------- ----------------------------
  id           UUID        Mengacu ke `auth.users.id`
  full_name    VARCHAR     Nama admin
  role         VARCHAR     Role admin
  created_at   TIMESTAMP   Tanggal dibuat

### Tabel Konten Website

  Tabel             Fungsi
  ----------------- ---------------------------------------------
  `services`        Informasi layanan perpustakaan
  `site_settings`   Nama, deskripsi, alamat, kontak, logo
  `loan_rules`      Durasi, maksimal buku, ketentuan peminjaman

## 5.3 Relasi Database

-   Satu kategori dapat memiliki banyak buku.
-   Satu pengajuan memiliki satu atau lebih item buku.
-   Satu item pengajuan mengacu pada satu buku.
-   Satu pengajuan dapat memiliki banyak catatan perubahan status.
-   Satu buku dapat memiliki banyak catatan perubahan stok.
-   Aktivitas admin dapat dicatat pada log aktivitas.

------------------------------------------------------------------------

# 6. Borrowing Workflow & Business Rules

## 6.1 Alur Pengunjung

1.  Pengunjung membuka website.
2.  Pengunjung mencari dan memilih buku.
3.  Pengunjung memeriksa stok.
4.  Pengunjung mengisi formulir peminjaman.
5.  Sistem memvalidasi stok dan data pengajuan.
6.  Sistem menyimpan pengajuan dengan status `Pending`.
7.  Sistem menghasilkan kode pengajuan unik.
8.  Pengunjung menyimpan kode tersebut.
9.  Pengunjung mengecek status melalui halaman tracking.

## 6.2 Alur Admin

1.  Admin login ke dashboard.
2.  Admin melihat pengajuan yang masuk.
3.  Admin memeriksa data peminjam dan stok buku.
4.  Admin menyetujui atau menolak pengajuan.
5.  Jika disetujui, pengunjung datang mengambil buku.
6.  Admin mengonfirmasi buku telah diserahkan.
7.  Sistem memperbarui stok.
8.  Setelah buku dikembalikan, admin mengonfirmasi pengembalian.
9.  Sistem memperbarui stok dan menyimpan histori.

## 6.3 Status Pengajuan

  Status        Keterangan
  ------------- ---------------------------
  `Pending`     Pengajuan baru masuk
  `Approved`    Pengajuan disetujui admin
  `Rejected`    Pengajuan ditolak
  `Borrowed`    Buku sudah diserahkan
  `Returned`    Buku sudah dikembalikan
  `Cancelled`   Pengajuan dibatalkan

## 6.4 Aturan Perubahan Stok

Rumus:

`available = stock_total - stock_borrowed - stock_reserved`

  -----------------------------------------------------------------------
  Aktivitas                           Perubahan stok
  ----------------------------------- -----------------------------------
  Pengajuan baru                      Tidak ada perubahan

  Disetujui admin                     `stock_reserved` bertambah

  Ditolak admin                       `stock_reserved` dikurangi jika
                                      sebelumnya sudah dialokasikan

  Buku diserahkan                     `stock_reserved` berkurang dan
                                      `stock_borrowed` bertambah

  Buku dikembalikan                   `stock_borrowed` berkurang

  Pengajuan dibatalkan                `stock_reserved` dikurangi jika
                                      sebelumnya sudah dialokasikan
  -----------------------------------------------------------------------

**Ketentuan teknis:** - Perubahan status dan stok harus dilakukan dalam
satu transaksi database. - Gunakan PostgreSQL function/RPC atau
mekanisme server-side transaksional. - Validasi stok harus dilakukan
kembali di database saat pengajuan dibuat dan saat admin menyetujui. -
Jangan mempercayai jumlah stok yang dikirim dari frontend. - Cegah stok
tersedia bernilai negatif. - Catat setiap perubahan stok pada
`stock_movements`.

## 6.5 Edge Cases

  -----------------------------------------------------------------------
  ID                      Kondisi                 Expected Behavior
  ----------------------- ----------------------- -----------------------
  BR-01                   Stok buku habis         Pengunjung tidak bisa
                                                  mengajukan buku

  BR-02                   Stok berubah ketika     Sistem validasi ulang
                          form dikirim            sebelum menyimpan

  BR-03                   Dua pengunjung          Tidak terjadi
                          mengajukan buku         overselling
                          terakhir bersamaan      

  BR-04                   Admin menyetujui        Stok masuk reserved
                          pengajuan               

  BR-05                   Admin menolak pengajuan Reserved dilepaskan
                                                  jika sudah dialokasikan

  BR-06                   Buku sudah diserahkan   Stok reserved berpindah
                                                  menjadi borrowed

  BR-07                   Buku dikembalikan       Stok borrowed berkurang

  BR-08                   Buku dihapus tetapi     Hapus permanen ditolak
                          memiliki histori        

  BR-09                   Kode tracking salah     Pesan kode tidak
                                                  ditemukan

  BR-10                   Admin mengubah status   Sistem menolak
                          tidak valid             perubahan

  BR-11                   Pengajuan disetujui     Admin dapat membatalkan
                          tetapi tidak diambil    persetujuan dan melepas
                                                  stok dengan pencatatan

  BR-12                   Admin mengubah stok     Sistem mencatat
                          manual                  perubahan dan
                                                  memvalidasi jumlah stok
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 7. UI/UX Requirements

## 7.1 Design Direction

Konsep visual yang direkomendasikan: - Modern minimalist. - Clean dan
informatif. - Warna hijau olive dan krem sebagai palet awal. - Tipografi
mudah dibaca. - Navigasi sederhana. - Layout responsif. - Identitas
sementara menggunakan teks dan ikon buku karena logo resmi belum
tersedia.

## 7.2 Public Website Pages

  -----------------------------------------------------------------------
  Route                   Halaman                 Deskripsi
  ----------------------- ----------------------- -----------------------
  `/`                     Beranda                 Informasi utama
                                                  perpustakaan

  `/books`                Katalog buku            Daftar, pencarian, dan
                                                  filter buku

  `/books/[id]`           Detail buku             Informasi lengkap dan
                                                  stok

  `/services`             Layanan                 Daftar layanan
                                                  perpustakaan

  `/borrowing-guide`      Panduan peminjaman      Aturan dan langkah
                                                  peminjaman

  `/borrow`               Form pengajuan          Pengajuan peminjaman
                                                  online

  `/tracking`             Tracking                Cek status dengan kode

  `/about`                Tentang                 Profil perpustakaan

  `/contact`              Kontak                  Alamat, jam
                                                  operasional, kontak
  -----------------------------------------------------------------------

## 7.3 Admin Panel Pages

  Route                 Halaman
  --------------------- ----------------------
  `/admin/login`        Login admin
  `/admin/dashboard`    Dashboard
  `/admin/books`        Manajemen buku
  `/admin/categories`   Manajemen kategori
  `/admin/requests`     Pengajuan peminjaman
  `/admin/loans`        Data peminjaman
  `/admin/services`     Manajemen layanan
  `/admin/settings`     Pengaturan website

------------------------------------------------------------------------

# 8. Security Requirements

1.  Pengunjung hanya dapat membaca katalog dan informasi publik.
2.  Pengunjung dapat membuat pengajuan melalui proses server-side yang
    tervalidasi.
3.  Pengunjung tidak boleh membaca seluruh data peminjam.
4.  Tracking hanya mengembalikan informasi pengajuan berdasarkan kode
    yang valid.
5.  Admin wajib login menggunakan Supabase Auth.
6.  Semua operasi perubahan stok hanya boleh dilakukan melalui proses
    backend/database yang aman.
7.  Aktifkan RLS pada tabel yang terekspos melalui Supabase API.
8.  Jangan pernah meletakkan Supabase Service Role Key di frontend.
9.  Gunakan kode tracking acak yang sulit ditebak, bukan ID database.
10. Terapkan rate limiting pada endpoint pengajuan dan tracking.
11. Validasi dan sanitasi semua input pengguna.
12. Catat aktivitas penting administrator.

------------------------------------------------------------------------

# 9. API Requirements

Contoh endpoint jika menggunakan Next.js Route Handlers:

  Method   Endpoint                         Fungsi
  -------- -------------------------------- -------------------------
  GET      `/api/books`                     Menampilkan katalog
  GET      `/api/books/:id`                 Detail buku
  POST     `/api/loan-requests`             Membuat pengajuan
  POST     `/api/loan-requests/track`       Tracking pengajuan
  GET      `/api/admin/dashboard`           Statistik dashboard
  POST     `/api/admin/books`               Tambah buku
  PATCH    `/api/admin/books/:id`           Edit buku
  DELETE   `/api/admin/books/:id`           Hapus/nonaktifkan buku
  GET      `/api/admin/loan-requests`       Daftar pengajuan
  PATCH    `/api/admin/loan-requests/:id`   Proses status pengajuan

**Catatan:** Endpoint admin harus dilindungi autentikasi dan otorisasi.
Operasi yang mengubah status serta stok harus memanggil proses database
transaksional.

------------------------------------------------------------------------

# 10. QA & Acceptance Testing

  -----------------------------------------------------------------------
  TC ID                   Scenario                Expected Result
  ----------------------- ----------------------- -----------------------
  TC-001                  Membuka homepage        Homepage tampil normal

  TC-002                  Mencari buku            Buku yang sesuai
                          berdasarkan judul       ditampilkan

  TC-003                  Memfilter kategori      Buku sesuai kategori
                                                  ditampilkan

  TC-004                  Membuka detail buku     Detail buku tampil

  TC-005                  Mengajukan buku         Pengajuan berhasil
                          tersedia                

  TC-006                  Mengajukan buku habis   Pengajuan ditolak
                                                  sistem

  TC-007                  Mengirim form kosong    Validasi ditampilkan

  TC-008                  Mengirim jumlah         Sistem menolak
                          melebihi stok           

  TC-009                  Tracking kode valid     Status ditampilkan

  TC-010                  Tracking kode salah     Pesan error ditampilkan

  TC-011                  Admin login valid       Masuk dashboard

  TC-012                  Admin login salah       Login ditolak

  TC-013                  Admin menambahkan buku  Buku tersimpan

  TC-014                  Admin menyetujui        Status approved dan
                          pengajuan               stok reserved bertambah

  TC-015                  Admin menyerahkan buku  Status borrowed dan
                                                  stok diperbarui

  TC-016                  Admin mengonfirmasi     Status returned dan
                          pengembalian            stok tersedia bertambah

  TC-017                  Pengunjung membuka      Akses ditolak
                          halaman admin           

  TC-018                  Dua pengajuan berebut   Tidak terjadi
                          stok terakhir           overselling
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 11. Development Roadmap

  Phase     Scope                Deliverables
  --------- -------------------- -------------------------------------
  Phase 1   UI/UX                Public website dan admin UI
  Phase 2   Backend & Database   Schema, auth, CRUD
  Phase 3   Borrowing System     Pengajuan, tracking, approval, stok
  Phase 4   QA & Deployment      Testing, security check, production

## Prioritas Pengembangan

### P0 --- Wajib

-   Katalog buku.
-   Database buku.
-   Pengajuan peminjaman.
-   Tracking.
-   Autentikasi admin.
-   Pengelolaan stok.

### P1 --- Penting

-   Layanan perpustakaan.
-   Panduan peminjaman.
-   Dashboard.
-   Histori peminjaman.
-   Profil website.

### P2 --- Pengembangan Lanjutan

-   Notifikasi otomatis.
-   Laporan statistik lanjutan.
-   Pembatalan reservasi otomatis.

------------------------------------------------------------------------

# 12. Open Questions --- Konfirmasi Client

Hal-hal berikut belum dikonfirmasi dan perlu dipastikan sebelum
implementasi aturan bisnis final.

  Pertanyaan                           Status
  ------------------------------------ ------------------------------------
  Maksimal buku per pengajuan          Belum dikonfirmasi
  Durasi peminjaman                    Belum dikonfirmasi
  Batas waktu pengambilan              Belum dikonfirmasi
  Semua pengunjung atau anggota saja   Belum dikonfirmasi
  Identitas wajib peminjam             Nama dan nomor HP direkomendasikan
  Logo perpustakaan                    Belum tersedia
  Informasi profil dan layanan         Menunggu data client

### Asumsi Sementara

-   Pengunjung tidak perlu login.
-   Pengajuan menggunakan nama dan nomor HP; email opsional.
-   Status dapat dicek menggunakan kode pengajuan.
-   Buku diambil langsung di perpustakaan setelah disetujui.
-   Logo sementara menggunakan teks dan ikon buku.
-   Aturan jumlah buku, durasi, dan batas pengambilan harus dapat
    dikonfigurasi admin atau ditetapkan sebelum go-live.

------------------------------------------------------------------------

# 13. Definition of Done

MVP dapat dinyatakan selesai jika:

-   [ ] Seluruh halaman publik dapat diakses.
-   [ ] Katalog buku menampilkan data aktual.
-   [ ] Pencarian dan filter berfungsi.
-   [ ] Status stok tampil sesuai database.
-   [ ] Pengunjung dapat mengajukan peminjaman.
-   [ ] Kode tracking berhasil dibuat.
-   [ ] Tracking menampilkan status yang benar.
-   [ ] Admin dapat login dengan aman.
-   [ ] Admin dapat mengelola buku dan kategori.
-   [ ] Admin dapat menyetujui dan menolak pengajuan.
-   [ ] Admin dapat mengonfirmasi pengambilan dan pengembalian.
-   [ ] Stok tidak mengalami duplikasi atau nilai negatif.
-   [ ] RLS dan proteksi akses sudah diuji.
-   [ ] Website responsif pada mobile dan desktop.
-   [ ] Tidak ada critical atau high-priority bug yang belum
    diselesaikan.

------------------------------------------------------------------------

# 14. Implementation Notes

1.  Gunakan Next.js dan Supabase tanpa perlu membangun backend NestJS
    terpisah untuk MVP.
2.  Prioritaskan konsistensi stok. Seluruh perubahan status dan stok
    harus melalui database transaction/RPC.
3.  Pisahkan pengajuan dengan transaksi peminjaman aktual. Pengajuan
    yang disetujui belum tentu sudah diambil.
4.  Simpan histori perubahan status dan stok untuk kebutuhan audit.
5.  Jangan mengimplementasikan aturan peminjaman yang belum dikonfirmasi
    sebagai nilai permanen.
6.  Pastikan semua halaman memiliki loading, empty, success, dan error
    state.
7.  Gunakan data nyata dari database pada production, bukan dummy data.

------------------------------------------------------------------------

**Dokumen:** PRD Website Informasi & Layanan Perpustakaan\
**Versi:** 1.0\
**Status:** Draft untuk validasi client dan acuan development
