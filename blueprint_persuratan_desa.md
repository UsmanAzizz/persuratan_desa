Markdown
# PRD & TECHNICAL BLUEPRINT
### Sistem Informasi Layanan Persuratan Desa Kutasari (Hybrid Architecture)
**Tech Stack:** React JS (Vite) + CodeIgniter REST API + MySQL + Node.js (WhatsApp Gateway)
**Deployment Target:** Barebone Linux Ubuntu VPS (Murni Tanpa Control Panel)

---

## 1. Executive Summary & Konsep Sistem
Aplikasi ini mentransformasi layanan administrasi persuratan konvensional di Desa Kutasari menjadi sistem elektronik (E-Government). Sistem menggunakan arsitektur **Decoupled/Hybrid** di mana CodeIgniter bertindak murni sebagai RESTful API Server (mengembalikan JSON secara ketat), dan React JS + Vite + Tailwind CSS bertindak sebagai frontend Single Page Application (SPA). Infrastruktur berjalan di atas VPS Linux murni tanpa panel, terintegrasi dengan WhatsApp Gateway via Node.js microservice berbasis `whatsapp-web.js` untuk notifikasi *real-time asynchronous*.

## 2. Spesifikasi Teknologi (Tech Stack)
- **Backend API Server:** CodeIgniter Framework (PHP 8.1+), RESTful API Mode, JWT Authentication.
- **Frontend SPA Client:** React JS + Vite, Zustand (State Management dengan LocalStorage Persistence), Axios (API Client).
- **UI/UX Styling:** Tailwind CSS + Framer Motion (untuk transisi halaman dinamis & skeleton placeholder).
- **Database Engine:** MySQL Server dengan optimasi indexing ketat pada relasi Foreign Key dan `kode_tracking`.
- **WhatsApp Gateway Microservice:** Node.js + `whatsapp-web.js` (Port internal: 3000) berjalan secara headless via Chromium Linux.
- **Web Server / Reverse Proxy:** Nginx, PHP-FPM, dan PM2 Process Manager untuk Node.js.

## 3. Product Requirement Document (PRD) & Fitur Utama
### A. Aktor Pengguna & Hak Akses
1. **Warga (Public / Tanpa Auth):** Mengajukan surat lewat formulir dinamis, memantau status secara real-time via kode tracking unik, serta mengunduh berkas surat resmi PDF yang sudah divalidasi.
2. **Admin (Staf Desa / Auth JWT):** Memvalidasi berkas unggahan warga, mengubah status pengajuan (Diproses/Ditolak/Selesai), mengelola master data penduduk (Warga).
3. **Kepala Desa (Auth JWT):** Melakukan otorisasi akhir persuratan dalam bentuk TTD Digital berupa QR Code verifikasi dokumen otomatis.

### B. Modul Utama Sistem
- **Auth Engine & Token Management:** Otentikasi multi-role berbasis Secure JWT Bearer Token dilengkapi skema pembatalan token (*blacklist* saat logout).
- **Dynamic Form Handling:** Form input fleksibel menyesuaikan jenis surat (SKU, SKD, SKCK, SKTM) dengan kompresi penyimpanan kolom berbasis teks JSON di database.
- **Asynchronous WhatsApp Notification Engine:** Trigger otomatis notifikasi status surat secara background tanpa membebani performa aplikasi (*anti-blocking layout*).
- **PDF Template & QR Sign Verification:** Generasi berkas PDF formal menggunakan library `mPDF`/`Dompdf` yang menyematkan hash verifikasi kriptografi.

---

## 4. Struktur Basis Data Lengkap (MySQL Schema)

```sql
-- 1. Tabel Master Penduduk (Warga)
CREATE TABLE `warga` (
  `nik` VARCHAR(16) NOT NULL,
  `no_kk` VARCHAR(16) NOT NULL,
  `nama_lengkap` VARCHAR(100) NOT NULL,
  `no_hp` VARCHAR(15) NOT NULL,
  `alamat` TEXT NOT NULL,
  `rt` VARCHAR(3) NOT NULL,
  `rw` VARCHAR(3) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nik`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Master User (Admin & Kepala Desa)
CREATE TABLE `users` (
  `id_user` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `nama_petugas` VARCHAR(100) NOT NULL,
  `role` ENUM('admin', 'kepala_desa') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Jenis Surat
CREATE TABLE `jenis_surat` (
  `id_jenis` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_surat` VARCHAR(100) NOT NULL,
  `kode_surat` VARCHAR(10) NOT NULL UNIQUE,
  `syarat_berkas` TEXT NOT NULL -- Format JSON array string contoh: ["surat_pengantar_rt", "fc_ktp"]
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Transaksi Pengajuan Surat
CREATE TABLE `pengajuan_surat` (
  `id_pengajuan` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_tracking` VARCHAR(12) NOT NULL UNIQUE,
  `nik_warga` VARCHAR(16) NOT NULL,
  `id_jenis_surat` INT NOT NULL,
  `data_input` TEXT NOT NULL, -- Format JSON untuk menampung data formulir yang dinamis per surat
  `status` ENUM('menunggu', 'diproses', 'ditolak', 'selesai') DEFAULT 'menunggu',
  `alasan_penolakan` TEXT NULL,
  `qr_token` VARCHAR(255) NULL, -- Hash pengesahan TTD digital kades
  `file_path` VARCHAR(255) NULL, -- Lokasi file PDF surat yang sudah terbit di server
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`nik_warga`) REFERENCES `warga`(`nik`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`id_jenis_surat`) REFERENCES `jenis_surat`(`id_jenis`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel Riwayat Perubahan Status Surat (Audit Trail)
CREATE TABLE `riwayat_status` (
  `id_riwayat` INT AUTO_INCREMENT PRIMARY KEY,
  `id_pengajuan` INT NOT NULL,
  `status_lama` ENUM('menunggu', 'diproses', 'ditolak', 'selesai') NULL,
  `status_baru` ENUM('menunggu', 'diproses', 'ditolak', 'selesai') NOT NULL,
  `id_user_eksekutor` INT NULL, -- NULL jika dieksekusi sistem atau warga saat input awal
  `catatan` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_pengajuan`) REFERENCES `pengajuan_surat`(`id_pengajuan`) ON DELETE CASCADE,
  FOREIGN KEY (`id_user_eksekutor`) REFERENCES `users`(`id_user`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabel Log Antrean & Riwayat Notifikasi WhatsApp
CREATE TABLE `log_notifikasi` (
  `id_log` INT AUTO_INCREMENT PRIMARY KEY,
  `id_pengajuan` INT NOT NULL,
  `no_tujuan` VARCHAR(15) NOT NULL,
  `isi_notif` TEXT NOT NULL,
  `status_notif` ENUM('belum_terkirim', 'terkirim', 'gagal') DEFAULT 'belum_terkirim',
  `tgl_notif` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_pengajuan`) REFERENCES `pengajuan_surat`(`id_pengajuan`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tabel Blacklist Token JWT (Manajemen Sesi)
CREATE TABLE `jwt_blacklist` (
  `id_blacklist` INT AUTO_INCREMENT PRIMARY KEY,
  `token` VARCHAR(500) NOT NULL,
  `blacklisted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`token`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
Initial Seed Data
SQL
INSERT INTO `users` (`username`, `password`, `nama_petugas`, `role`) VALUES 
('admin_kutasari', '$2y$10$e0myZEXX..XyZSecureHashBcrypt', 'Staf Pelayanan Umum', 'admin'),
('kades_kutasari', '$2y$10$e0myZEXX..XyZSecureHashKades', 'Kepala Desa Kutasari', 'kepala_desa');

INSERT INTO `jenis_surat` (`nama_surat`, `kode_surat`, `syarat_berkas`) VALUES 
('Surat Keterangan Usaha', 'SKU', '["surat_pengantar_rt", "fc_ktp", "fc_kk"]'),
('Surat Keterangan Domisili', 'SKD', '["surat_pengantar_rt", "fc_ktp", "fc_kk"]'),
('Surat Pengantar Catatan Kepolisian', 'SKCK', '["surat_pengantar_rt", "fc_ktp", "fc_kk"]'),
('Surat Keterangan Tidak Mampu', 'SKTM', '["surat_pengantar_rt", "fc_ktp", "fc_kk"]');
5. Spesifikasi Kontrak API (RESTful JSON Protocol)
Seluruh komunikasi data wajib menggunakan standarisasi struktur JSON global.

Standard Response Format
Success (HTTP 200/201): {"success": true, "message": "Pesan Berhasil", "data": {}}

Error (HTTP 400/401/403/500): {"success": false, "message": "Pesan Kegagalan", "errors": null}

Endpoints Utama Backend
Public Auth: - POST /api/v1/auth/login -> Request payload: {"username", "password"}. Output: Bearer JWT Token.

POST /api/v1/auth/logout -> Memasukkan token aktif ke tabel jwt_blacklist.

Portal Warga:

POST /api/v1/pengajuan/buat -> Menerima Multipart Form-Data (File Upload Berkas & JSON string data_input). Menghasilkan kode_tracking acak.

GET /api/v1/pengajuan/track/:kode_tracking -> Mengembalikan relasi status persuratan beserta detail riwayat_status.

Backoffice Admin & Kades (Protected Bearer JWT):

GET /api/v1/admin/pengajuan?status=menunggu&page=1&limit=10 -> Mengembalikan list antrean dengan server-side pagination.

PUT /api/v1/admin/pengajuan/:id/status -> Mengubah status pengajuan, memicu insert ke riwayat_status, menulis antrean di log_notifikasi, dan mengenerate PDF otomatis jika status diubah ke "selesai".

6. Struktur Blueprint Direktori Proyek Monorepo/Decoupled
Plaintext
/persuratan-desakutasari
│
├── /backend-api (CodeIgniter App Server)
│   ├── /app
│   │   ├── /Config
│   │   │   └── Routes.php (Routing murni API /api/v1/...)
│   │   ├── /Controllers
│   │   │   ├── BaseApiController.php (Membungkus CORS & JSON Response global)
│   │   │   ├── AuthController.php
│   │   │   ├── PengajuanController.php
│   │   │   └── AdminController.php
│   │   ├── /Filters
│   │   │   └── JwtAuthFilter.php (Middleware interceptor validasi token & JWT blacklist)
│   │   ├── /Helpers
│   │   │   └── jwt_helper.php
│   │   ├── /Models
│   │   │   ├── WargaModel.php
│   │   │   ├── PengajuanModel.php
│   │   │   ├── LogNotifikasiModel.php
│   │   │   └── RiwayatStatusModel.php
│   │   └── /Views (KOSONG - Dinonaktifkan total karena murni REST API)
│   └── /public
│       ├── .htaccess (Mod_rewrite apache / pengkondisian Nginx untuk routing public index.php)
│       └── index.php
│
├── /frontend-spa (React Vite App)
│   ├── /src
│   │   ├── /assets (Ikon, logo resmi desa)
│   │   ├── /components (Reusable: CustomTable, MotionButton, SharedNavbar, StatusBadge)
│   │   ├── /hooks (Custom React Hooks terintegrasi Axios Interceptor)
│   │   ├── /layouts (DashboardLayout, PublicLayout)
│   │   ├── /pages
│   │   │   ├── /Public (Beranda, FormPengajuanDinamis, TrackingSurat)
│   │   │   └── /Admin (OverviewDashboard, AntreanSurat, KelolaWarga, ValidasiDokumen)
│   │   ├── /router
│   │   │   └── AppRouter.jsx (React Router DOM v6 - Protected & Public Routing)
│   │   ├── /store
│   │   │   └── authStore.js (Zustand + Persist LocalStorage untuk Sesi Sempurna)
│   │   ├── App.jsx
│   │   ├── index.css (Tailwind directives)
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── /whatsapp-service (Node.js Microservice)
    ├── package.json
    ├── server.js (Express API Receiver port 3000 internal-only)
    └── worker.js (Asynchronous worker polling database MySQL per 5 detik untuk kirim WA)
7. Alur Integrasi Lanjutan & Mekanisme Keamanan
A. TTD Digital (QR-Verification System)
Saat surat disetujui, Backend mengenerate hash token unik menggunakan algoritma SHA256: qr_token = hash('sha256', id_pengajuan + kode_tracking + secret_key).

Token disimpan di tabel pengajuan_surat dan dirender sebagai QR Code di dalam PDF Surat resmi.

QR Code mengarah ke endpoint publik frontend React: https://domaindesa.id/verify/:qr_token untuk divalidasi keaslian datanya langsung dari database oleh pihak ketiga (instansi eksternal).

B. Pola Pengiriman WhatsApp Asynchronous Worker (Anti-Lag)
Untuk mencegah backend PHP mengalami freeze/timeout akibat koneksi API WhatsApp eksternal:

PHP hanya memasukkan rekaman teks notifikasi ke tabel log_notifikasi dengan status 'belum_terkirim'.

Skrip worker.js (Node.js) yang dikelola oleh PM2 melakukan pemeriksaan polling data secara berkala ke database MySQL.

Node.js memproses pengiriman menggunakan library whatsapp-web.js lalu memperbarui status baris database tersebut menjadi 'terkirim' atau 'gagal'.

8. Dokumen Instruksi Khusus Untuk AI Agent Engine (Strict Guidelines)
Wahai AI Agent Developer, eksekusi pembuatan struktur berkas proyek berdasarkan instruksi wajib di bawah ini:

Backend Isolation: Pastikan tidak ada berkas HTML/View yang dirender oleh CodeIgniter. Gunakan penanganan perkondisian error (try-catch) di tingkat controller dan kembalikan response code HTTP yang sesuai (200, 201, 400, 401, 403, 500). Gunakan Form_validation bawaan PHP dengan regex ketat untuk mendeteksi keabsahan format NIK (16 digit) dan nomor telepon warga.

UI/UX Modern Experience: Di sisi React Client, gunakan library Framer Motion untuk membungkus animasi pergantian halaman (page transition) dan sediakan komponen Skeleton Loading Placeholder ketika Axios sedang melakukan fetching data antrean tabel. Jangan gunakan inline styling, terapkan Tailwind CSS secara clean dan terstruktur.

Puppeteer Headless Fix: Pada berkas worker.js / server.js Node.js, inisialisasi modul Client whatsapp-web.js wajib menggunakan argumen --no-sandbox dan --disable-setuid-sandbox agar dapat dijalankan secara aman di dalam sistem VPS Linux Ubuntu murni di bawah akses root user tanpa memicu kegagalan sistem.