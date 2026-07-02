# Struktur Direktori Monorepo (Directory Blueprint)
## Sistem Informasi Layanan Persuratan Desa Kutasari

Dokumen ini adalah cetak biru mutlak pengaturan *repository* fisik proyek. Pendekatan spasial mematuhi prinsip isolasi domain (*Domain Isolation*) guna menjamin skalabilitas proyek di tingkat operasional *Cloud VPS*.

---

### Kerangka Puncak (Root Directory)
```plaintext
/persuratan-desakutasari (Proyek Induk)
├── /backend-api (Infrastruktur CodeIgniter - Port 80/443 Nginx)
├── /frontend-spa (Infrastruktur Vite React - Node Build/Static File)
└── /whatsapp-service (Infrastruktur Microservice Node.js - Port Internal 3000)
```

### 1. Struktur Arsitektur Backend (`/backend-api`)
Menjalankan prinsip REST murni. Keberadaan antarmuka visual (`Views`) dinonaktifkan sepenuhnya secara sistemik.
```plaintext
/backend-api
└── /app
    ├── /Config
    │   └── Routes.php        (Definisi jalur REST API /api/v1/ secara spesifik)
    ├── /Controllers
    │   ├── BaseApiController.php (Kelas inti abstrak penangan JSON dan CORS Global)
    │   ├── AuthController.php    (Penanganan sesi masuk dan pengakhiran JWT)
    │   ├── PengajuanController.php (Layanan operasional warga)
    │   └── AdminController.php   (Pusat otoritas manajerial Kades/Admin)
    ├── /Filters
    │   └── JwtAuthFilter.php     (Pengawal Middleware otorisasi lintasan rute HTTP)
    ├── /Helpers
    │   └── jwt_helper.php        (Fungsi pembantu enkripsi/dekripsi token keamanan)
    ├── /Models
    │   └── (Kumpulan entitas yang bersentuhan dengan koneksi fisik ke MySQL)
    └── /Views                [DIPETI-ESKAN / DILARANG DIGUNAKAN]
```

### 2. Struktur Arsitektur Frontend (`/frontend-spa`)
Mengoperasikan hierarki manajemen data aplikasi (*State Application*) secara independen dan murni bertumpu ke pengikatan data asinkron API.
```plaintext
/frontend-spa
├── /src
│   ├── /assets           (Logo desa resmi, berkas grafis piktogram yang ringan)
│   ├── /components       (Elemen antarmuka berulang tanpa keterikatan data bisnis)
│   │   ├── Table         (Misal: DataGrid Tabel Antrean)
│   │   └── Layout        (Struktur kerangka dasar layar: Navbar, Sidebar formal)
│   ├── /hooks            (Lapisan fasilitator interaksi logika, misal interseptor Axios)
│   ├── /pages            (Konteks antarmuka berbasis peran)
│   │   ├── /Public       (Area non-otentikasi: Formulir pengajuan, Lacak antrean)
│   │   └── /Admin        (Area otentikasi: Validasi permohonan warga, Dasbor kinerja)
│   ├── /router           (Rekayasa navigasi dom lewat React-Router, perlindungan batas /ProtectedRoute)
│   ├── /store            (Konteks keadaan terpusat / Zustand, manajemen persisten sesi)
│   ├── App.jsx           (Akar pembungkus rute dan hierarki navigasi)
│   └── index.css         (Pengarahan kerangka kerja Tailwind CSS Tailwind directives)
├── tailwind.config.js    (Konfigurasi parameter visual desain standar)
└── vite.config.js        (Pengaturan perakitan kompilasi tahap rilis)
```

### 3. Struktur Modul Sinkronisasi Latar Belakang (`/whatsapp-service`)
Lingkungan Node.js steril yang berdiri secara parsial pada sistem inang (Linux Ubuntu).
```plaintext
/whatsapp-service
├── package.json          (Keterikatan fungsi modul)
├── server.js             (Pemancar penerima sinyal interupsi - jika diperlukan oleh backend)
└── worker.js             (Skrip jantung pusat: Mengeksekusi antrean SQL MySQL tiap 5 detik)
```
