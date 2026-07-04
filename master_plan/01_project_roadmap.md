# Peta Jalan Proyek (Project Roadmap)
## Sistem Informasi Layanan Persuratan Desa Kutasari

Dokumen ini menjelaskan pentahapan strategis operasionalisasi pengembangan platform. Skema yang dimuat bersifat preskriptif; tidak diperkenankan maju menuju tahap yang lebih tinggi bilamana tahap terdahulu tidak tuntas terverifikasi keamanannya.

---

### Tahap 1: Pembentukan Inti Fondasi
- `[x]` Penetapan struktur direktori basis data (MySQL) sesuai skema referensi.
- `[x]` Penciptaan pengguna, wewenang akses (`GRANT PRIVILEGES`), dan migrasi tabel dasar secara definitif.
- `[x]` Pengadaan kerangka peladen API (CodeIgniter).
- `[x]` Inisialisasi model-model data awal untuk interaksi ke basis data (Warga, Pengajuan Surat, dsb).

### Tahap 2: Pengembangan API Autentikasi dan Manifes Pengamanan
- `[x]` Konstruksi subsistem *Login Auth* memfasilitasi peran ganda (Admin & Kades).
- `[x]` Pengkodean dan penyandian algoritma token (*JWT Middleware*).
- `[x]` Verifikasi ketat perutean peladen dan penanganan rute tidak terotorisasi.
- `[ ]` Pengadaan mekanisme pertahanan token (Tabel Blacklist).

### Tahap 3: Pelaksanaan Antarmuka Web Klien
- `[x]` Desain arsitektur dasar *React* (Vite) menggunakan *Tailwind CSS* sesuai regulasi `02_ui_ux_guidelines.md`.
- `[x]` Pembentukan *Router* terpadu memisahkan akses ruang publik (Portal Warga) dan ruang staf (Backoffice).
- `[x]` Implementasi integrasi REST API dengan *Axios Interceptor* dan pengikatan state dari respons peladen menggunakan *Zustand*.
- `[x]` Konstruksi UI formulir pengajuan berkas (Fase 1: Form Dasar).
- `[x]` Peluncuran komponen dasbor pengelolaan staf desa (Tabel Antrean).

### Tahap 4: Inisiasi Tanda Tangan QR dan Modul Terisolasi Node.js
- `[x]` Konstruksi logika PDF *(HTML to PDF Parser)* dengan cap persetujuan Digital QR pada sisi *Backend* PHP.
- `[x]` Penyusunan skrip pekerja mandiri (Node.js *Headless Worker*) untuk mengeksekusi perpustakaan *whatsapp-web.js*.
- `[x]` Pengikatan interaksi *Polling* Node.js terhadap rekam antrean di tabel log_notifikasi MySQL secara periodik.

### Tahap 5: Auditing dan Karantina Kode Pra-Produksi
- [ ] Validasi *User Acceptance Testing* dari unit terendah pada fungsi pengajuan hingga persetujuan Kepala Desa.
- [ ] Analisa keamanan API untuk pencegahan intrusi.
- [ ] Penerbitan instruksi kompilasi produksi mutakhir untuk integrasi Linux *VPS/Nginx*.
