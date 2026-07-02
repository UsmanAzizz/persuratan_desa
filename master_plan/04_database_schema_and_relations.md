# Skema Basis Data dan Relasi (Database Schema & Relations)
## Sistem Informasi Layanan Persuratan Desa Kutasari

Dokumen ini mendefinisikan rancangan fisik (Data Definition Language) dari basis data MySQL yang akan digunakan dalam produksi. Keutuhan data sangat diutamakan sehingga indeks kunci primer, kunci tamu (*foreign keys*), dan tipe data harus dipertahankan secara ketat tanpa kompromi.

---

### 1. Entitas Master Data

#### Tabel `warga`
Menyimpan data otentik penduduk yang terdaftar.
- `nik` `VARCHAR(16)` **PRIMARY KEY**: Nomor Induk Kependudukan. Tidak boleh lebih atau kurang dari 16 digit numerik.
- `no_kk` `VARCHAR(16)` **NOT NULL**: Nomor Kartu Keluarga.
- `nama_lengkap` `VARCHAR(100)` **NOT NULL**: Nama sesuai identitas KTP.
- `no_hp` `VARCHAR(15)` **NOT NULL**: Nomor kontak aktif warga, diawali dengan '08' atau '62'.
- `alamat`, `rt`, `rw` **NOT NULL**: Rincian lokasi domisili geografis.
- `created_at` `TIMESTAMP` **DEFAULT CURRENT_TIMESTAMP**: Penanda temporal pendaftaran.

#### Tabel `users`
Menyimpan profil aparatur desa dan kepala desa.
- `id_user` `INT` **AUTO_INCREMENT PRIMARY KEY**.
- `username` `VARCHAR(50)` **UNIQUE NOT NULL**: Kredensial masuk (*login*).
- `password` `VARCHAR(255)` **NOT NULL**: Rekaman kata sandi yang disandikan (wajib menggunakan standar *BCrypt*).
- `nama_petugas` `VARCHAR(100)` **NOT NULL**: Nama figur otoritas desa.
- `role` `ENUM('admin', 'kepala_desa')` **NOT NULL**: Pemisahan peruntukan wewenang sistem.

#### Tabel `jenis_surat`
Menyimpan rincian meta-persuratan administratif.
- `id_jenis` `INT` **AUTO_INCREMENT PRIMARY KEY**.
- `nama_surat` `VARCHAR(100)` **NOT NULL**: Gelar resmi dokumen administrasi.
- `kode_surat` `VARCHAR(10)` **UNIQUE NOT NULL**: Singkatan (Misal: SKU, SKCK, SKTM).
- `syarat_berkas` `TEXT` **NOT NULL**: Syarat lampiran berbentuk himpunan terstruktur *JSON Array* (Misal: `["ktp", "kk", "pengantar_rt"]`).

---

### 2. Entitas Transaksional

#### Tabel `pengajuan_surat`
Entitas operasional pusat.
- `id_pengajuan` `INT` **AUTO_INCREMENT PRIMARY KEY**.
- `kode_tracking` `VARCHAR(12)` **UNIQUE NOT NULL**: Tanda bukti registrasi publik (*alphanumeric* acak).
- `nik_warga` `VARCHAR(16)` **NOT NULL** (`FOREIGN KEY` ke `warga.nik`). `ON DELETE RESTRICT`.
- `id_jenis_surat` `INT` **NOT NULL** (`FOREIGN KEY` ke `jenis_surat.id_jenis`). `ON DELETE RESTRICT`.
- `data_input` `TEXT` **NOT NULL**: Data dinamis pengajuan (disimpan sebagai instrumen sintaksis *JSON String*).
- `status` `ENUM('menunggu', 'diproses', 'ditolak', 'selesai')` **DEFAULT 'menunggu'**.
- `alasan_penolakan` `TEXT` **NULL**.
- `qr_token` `VARCHAR(255)` **NULL**: Tanda pengesahan dari Kepala Desa (tersandi `SHA256`).
- `file_path` `VARCHAR(255)` **NULL**: Destinasi berkas PDF final terbit.

#### Tabel `riwayat_status` (Audit Trail)
- `id_riwayat` `INT` **AUTO_INCREMENT PRIMARY KEY**.
- `id_pengajuan` `INT` **NOT NULL** (`FOREIGN KEY` ke `pengajuan_surat.id_pengajuan`). `ON DELETE CASCADE`.
- `status_lama` dan `status_baru` `ENUM(...)`.
- `id_user_eksekutor` `INT` **NULL** (`FOREIGN KEY` ke `users.id_user`). `ON DELETE SET NULL`.
- `catatan` `TEXT` **NULL**.

#### Tabel `log_notifikasi` (Antrean Node.js Service)
- `id_log` `INT` **AUTO_INCREMENT PRIMARY KEY**.
- `id_pengajuan` `INT` **NOT NULL** (`FOREIGN KEY` ke `pengajuan_surat.id_pengajuan`). `ON DELETE CASCADE`.
- `no_tujuan` `VARCHAR(15)` **NOT NULL**.
- `isi_notif` `TEXT` **NOT NULL**.
- `status_notif` `ENUM('belum_terkirim', 'terkirim', 'gagal')` **DEFAULT 'belum_terkirim'**.

#### Tabel `jwt_blacklist` (State Manajemen Sesi)
- `id_blacklist` `INT` **AUTO_INCREMENT PRIMARY KEY**.
- `token` `VARCHAR(500)` **NOT NULL** (Diberikan indeks pembacaan cepat sepanjang 255 karakter pertama).
- `blacklisted_at` `TIMESTAMP` **DEFAULT CURRENT_TIMESTAMP**.

---

### 3. Kebijakan Relasi Basis Data (Database Relationship Policies)
Seluruh master referensi (seperti `warga` dan `jenis_surat`) wajib dilindungi oleh klausa **`ON DELETE RESTRICT`**. Hal ini menjamin konsistensi laporan di kemudian hari—suatu jenis layanan desa tidak dapat dihapus apabila sudah pernah diterbitkan.

Sebaliknya, pada relasi operasional (contohnya `riwayat_status` ke `pengajuan_surat`), digunakan klausa **`ON DELETE CASCADE`** agar pembatalan transaksional dari entitas utama turut memusnahkan anak transaksinya demi kebersihan ruang simpan fisik.
