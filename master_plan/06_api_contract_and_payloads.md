# Kontrak Layanan API (API Contracts & Payloads)
## Sistem Informasi Layanan Persuratan Desa Kutasari

Dokumen ini mendeskripsikan secara definitif spesifikasi titik akhir (endpoint) yang diwajibkan dalam komunikasi Frontend dan Backend. Kegagalan mematuhi struktur JSON di bawah akan berujung pada interupsi sistem (*System Fault*).

---

### 1. Spesifikasi Format Respons Global
Seluruh pertukaran data keluar dari API wajib terbungkus dalam tata kelola JSON berikut:

**HTTP 200/201 (Kesuksesan Transaksi)**
```json
{
  "success": true,
  "message": "Representasi pesan keberhasilan.",
  "data": { ... }
}
```

**HTTP 400/401/403/404/500 (Abnormalitas/Kesalahan Transaksi)**
```json
{
  "success": false,
  "message": "Representasi alasan kegagalan proses.",
  "errors": null 
}
```
*(Catatan: Atribut `errors` diperuntukkan mengemas spesifikasi validasi spesifik, misal kegagalan *parsing* formulir, namun dapat bernilai nol/null bila bukan karena kegagalan isian/formulir).*

---

### 2. Modul Otentikasi Sesi (JWT Bearer Protected)

#### `POST /api/v1/auth/login`
- **Fungsi**: Verifikasi kredensial otoritas pengguna desa.
- **Request Payload**:
  ```json
  { "username": "admin_kutasari", "password": "katasandirahasiasistem" }
  ```
- **Response Success**: Mengembalikan data identitas aparatur desa berserta token otorisasi absolut (JWT Token).

#### `POST /api/v1/auth/logout`
- **Fungsi**: Membatalkan perizinan (*revoke session*) dari peredaran sistem.
- **Header Mutlak**: `Authorization: Bearer <token_akses>`
- **Response Success**: Status 200, memicu pencatatan ke tabel `jwt_blacklist`.

---

### 3. Modul Warga (Area Publik / Tanpa Enkripsi Sesi)

#### `POST /api/v1/pengajuan/buat`
- **Fungsi**: Penyerahan registrasi pengajuan permohonan surat kependudukan oleh warga.
- **Format Header**: `Content-Type: multipart/form-data`
- **Payload Data**: Mengandung unggahan fisik data gambar/PDF (`file_berkas`) serta susunan isian formulir mentah dalam bentuk JSON String (`data_input`).
- **Response Success**: Menerbitkan deret `kode_tracking` untuk digunakan warga memantau status secara anonim.

#### `GET /api/v1/pengajuan/track/:kode_tracking`
- **Fungsi**: Pengintaian status dari berkas yang diajukan.
- **Response Data**: Struktur kembalian mencakup informasi status (`menunggu`, `diproses`, dsb) dan rekam jejak (*Audit Trail*) aktivitas verifikator sistem.

---

### 4. Modul Admin dan Kepala Desa (Area Terotentikasi)

#### `GET /api/v1/admin/pengajuan`
- **Fungsi**: Penarikan manifes keseluruhan antrean surat kependudukan.
- **Parameter Kuari**: Mendukung paginasi mutlak server (`?page=1&limit=10`) dan filtrasi status (`?status=menunggu`).
- **Header Mutlak**: `Authorization: Bearer <token_akses>`.

#### `PUT /api/v1/admin/pengajuan/:id/status`
- **Fungsi**: Mengintervensi jenjang operasional pengajuan (Misal: dari 'menunggu' diubah menjadi 'diproses' atau 'selesai').
- **Request Payload**:
  ```json
  { "status": "diproses", "catatan": "KTP terlampir tidak jelas, mohon periksa ulang." }
  ```
- **Catatan Operasional**: Ketika status direkayasa menjadi **"selesai"**, metode ini secara terstruktur akan:
  1. Menghasilkan salinan format PDF terotentikasi.
  2. Menerbitkan kode hash QR pengesahan (*Digital Signature*).
  3. Menyuntikkan perintah pengiriman rekam notifikasi antrean latar belakang ke MySQL (`log_notifikasi`) untuk ditangkap oleh pekerja asinkron (*WhatsApp Worker Node.js*).
