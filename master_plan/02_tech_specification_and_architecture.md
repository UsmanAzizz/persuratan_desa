# Spesifikasi Teknis dan Arsitektur
## Sistem Informasi Layanan Persuratan Desa Kutasari

Dokumen ini merumuskan panduan teknis yang mutlak untuk menjamin kualitas, keamanan, dan skalabilitas Sistem Informasi Persuratan Desa. Seluruh pengembang yang berpartisipasi pada proyek ini wajib mengikuti struktur arsitektur yang tertera di bawah.

---

### 1. Filosofi Arsitektur (Clean Architecture)
Sistem ini menggunakan arsitektur *Decoupled/Hybrid*, yang secara tegas memisahkan tanggung jawab antarlapisan (Presentation, Application, Domain, dan Infrastructure).
Pemutusan hubungan yang kuat antara klien (Frontend SPA) dan server (Backend API) dirancang agar layanan bersifat mandiri (stateless) dan tangguh dalam menghadapi intervensi pihak ketiga.

### 2. Standar Infrastruktur Frontend (React Vite)
Pola struktural pada *React JS* akan mengadopsi varian *Feature-Sliced Design* yang direduksi ke dalam *Layered Architecture* baku, guna menunjang kemudahan pemeliharaan jangka panjang.

- **Presentation Layer (`src/pages`, `src/components`)**:
  Komponen UI harus murni dan tidak menyimpan logika bisnis yang kompleks. Interaksi dengan REST API harus diabstraksikan melalui lapisan *Application*.
- **Application Layer (`src/store`, `src/hooks`)**:
  Menggunakan `zustand` untuk *State Management*. Modul autentikasi bertanggung jawab mengamankan siklus hidup token JWT dan menyimpan preferensi secara terenkripsi di sisi klien (*LocalStorage/SessionStorage*).
- **Infrastructure Layer (`src/services/api`)**:
  Pengelolaan jaringan difasilitasi oleh `axios` dengan dukungan *Interceptor* untuk menambahkan *Bearer Token* di setiap permintaan serta menangani respons gagal (HTTP 401) guna memperbarui atau memusnahkan sesi secara terpusat.

### 3. Standar Infrastruktur Backend (CodeIgniter)
Sistem *backend* beroperasi murni secara *head-less* (tanpa memproses HTML). 

- **Domain Driven Design Constraint**: 
  Setiap *Controller* hanya bertanggung jawab menangani rute spesifik, melakukan sanitasi *input* dasar, dan memanggil metode khusus pada *Model/Service*. Tidak diperkenankan meletakkan baris query basis data secara langsung pada *Controller*.
- **Respons Global (Global JSON Output)**:
  Format respons harus seragam. Kegagalan (error) wajib dikembalikan dengan kode status HTTP yang benar (misalnya 400 Bad Request, 401 Unauthorized, 403 Forbidden). Tidak ada celah bagi eksposur konfigurasi basis data melalui *stack trace*.

### 4. Protokol Keamanan Data dan Otentikasi
1. **Penerapan JSON Web Token (JWT)**: Menggunakan algoritma *HS256* atau *RS256*. Token memiliki siklus hidup pendek. Aksi pencabutan otorisasi (logout) diatur dengan metode pencatatan residu (*Blacklisting*) pada basis data untuk mencegah *Replay Attacks*.
2. **Validasi File Terunggah**: Hanya ekstensi `.pdf`, `.jpg`, `.jpeg`, dan `.png` yang diperbolehkan dengan kapasitas rasional maksimal 2 MB. Server harus mengeksekusi pemeriksaan tipe MIME (*MIME-Type Inspection*) yang ketat.
3. **Pemisahan Kredensial Database**: Variabel lingkungan (`.env`) wajib dijaga keamanannya dan tidak dikomit pada repositori versi. Server *production* tidak boleh menampung kunci akses pada sistem *file* yang dapat diakses publik.

### 5. Konfigurasi Node.js (WhatsApp Microservice)
Layanan Notifikasi berjalan sebagai entitas terisolasi menggunakan `whatsapp-web.js`.
- Klien *Puppeteer* wajib beroperasi dengan argumen pengamanan ketat (`--no-sandbox`, `--disable-setuid-sandbox`) mengingat penempatan sistem pada Linux *barebone* di bawah pengelolaan otoritas puncak (*root user*).
- Metode operasional: Sistem Node.js beroperasi secara siklik (asynchronous polling), menarik antrean basis data MySQL dengan status `belum_terkirim`, memprosesnya, dan tidak pernah berinteraksi langsung secara serempak (*synchronous HTTP Request*) dengan PHP untuk mencegah kendala kapasitas (*blocking/bottleneck*).
