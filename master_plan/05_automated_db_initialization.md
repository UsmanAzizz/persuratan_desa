# Automasi Inisialisasi Basis Data (Automated DB Initialization)
## Sistem Informasi Layanan Persuratan Desa Kutasari

Dokumen ini merumuskan protokol pembentukan infrastruktur basis data yang dieksekusi tepat sesaat sebelum peladen aplikasi beroperasi untuk pertama kalinya. Tujuannya adalah menghilangkan kebergantungan pada injeksi skrip SQL secara manual (via antarmuka manajemen seperti phpMyAdmin).

---

### 1. Landasan Eksekusi (Framework)
Seluruh automasi dikendalikan melalui sistem bawaan kerangka *CodeIgniter 4*:
- **Migrations** (`php spark migrate`): Bertanggung jawab mengeksekusi pendefinisian ruang (*DDL/Data Definition Language*), seperti struktur kolom tabel dan tata laksana penguncian referensi silang (*Foreign Keys*).
- **Seeders** (`php spark db:seed`): Bertanggung jawab mengisi kandungan (*DML/Data Manipulation Language*) esensial di awal masa pakai.

### 2. Standar Pembuatan Akun Administrator Perdana
Tidak diperkenankan membuat akun pengguna pengelola melalui intervensi langsung ke baris tabel. Sistem menuntut penyemaian profil bawaan sebagai berikut:
- **Username**: `admin`
- **Password Baku**: `user1234`
- **Keamanan**: Kata sandi wajib diolah melalui prosedur penyamaran *BCrypt Hash* pada saat eksekusi *Seeder* berjalan. Kata sandi berformat teks telanjang (*plain text*) sangat dilarang disimpan ke dalam repositori.

### 3. Pengisian Entitas Pendukung Pembantu
Selain penyemaian akun, *Seeder* secara serempak diamanatkan untuk mendaftarkan himpunan jenis perizinan persuratan desa (*Master Data* Jenis Surat):
1. Surat Keterangan Usaha (SKU)
2. Surat Keterangan Domisili (SKD)
3. Surat Pengantar Catatan Kepolisian (SKCK)
4. Surat Keterangan Tidak Mampu (SKTM)

### 4. Skrip Automasi Peladen Induk
Untuk menjamin eksekusi yang konsisten pada peladen *Linux Ubuntu* yang dikerahkan (*deployment*), sistem akan disokong oleh eksekutor baris perintah (*Bash Script* `start_server.sh`).

**Prototipe `start_server.sh`**:
```bash
#!/bin/bash
echo "Memulai inisialisasi arsitektur tabel..."
php spark migrate
echo "Tabel terpasang. Menanamkan konfigurasi pabrik (Admin & Master Data)..."
php spark db:seed InitSeeder
echo "Lingkungan Basis Data Siap Beroperasi."
# (Dilanjutkan komando inisiasi daemon server / PHP-FPM)
```
Protokol ini menggaransi kelayakan fungsional basis data seketika sesudah sistem operasional dinyalakan.
