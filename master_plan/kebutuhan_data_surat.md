# Kebutuhan Data & Form Pengajuan Surat

Dokumen ini merangkum kebutuhan struktur *database* dan penambahan atribut pada form input, berdasarkan tinjauan terhadap *template* resmi surat desa (SKU, SKD, SKCK, dan SKTM).

Saat ini, tabel `warga` dan form pengajuan hanya mencakup data inti (NIK, Nama, No. HP, dan Alamat). Untuk penyempurnaan ke depan, atribut-atribut berikut wajib ditambahkan ke *database* atau form *frontend*.

---

## 1. Surat Pengantar Catatan Kepolisian (SKCK)
Berdasarkan format baku SKCK, data berikut wajib terisi:
- **Nomor Surat**: (Otomatis/Input manual dari Admin)
- **Data Kependudukan Dasar**:
  - Nomor KK
  - NIK
  - Nama Lengkap
- **Data Demografi Tambahan**:
  - Tempat dan Tanggal Lahir
  - Jenis Kelamin
  - Warganegara (Default: WNI)
  - Status Perkawinan (Belum Kawin / Kawin / Cerai Hidup / Cerai Mati)
  - Agama
  - Pekerjaan
- **Alamat Lengkap**: Dusun, RT, RW, Desa, Kecamatan.
- **Data Dinamis (Input Form)**:
  - Keperluan (Contoh: Melamar Pekerjaan)
  - Data Surat Pengantar RT: (Nomor Surat RT & Tanggal Surat RT)
  - Keterangan lain

## 2. Surat Keterangan Usaha (SKU)
- **Nomor Surat**
- **Data Demografi**:
  - Nama Lengkap
  - Tempat dan Tanggal Lahir
  - Pekerjaan
  - No KTP (NIK)
- **Alamat Lengkap**: Dusun, RT, RW.
- **Data Dinamis (Input Form)**:
  - Nama Usaha / Bidang Usaha (Contoh: Usaha Warung Sembako)

## 3. Surat Keterangan Domisili (SKD)
- **Nomor Surat**
- **Data Demografi**:
  - Nama Lengkap
  - Jenis Kelamin
  - Tempat dan Tanggal Lahir
  - Agama (Bangsa / Agama)
  - Pekerjaan
- **Data Dinamis (Input Form)**:
  - Alamat Tinggal Asal
  - Alamat Domisili Sekarang (termasuk RT/RW domisili)
  - Keperluan pembuatan SKD

## 4. Surat Keterangan Tidak Mampu (SKTM)
- **Nomor Surat**
- **Data Demografi**:
  - Nama Lengkap
  - Tempat dan Tanggal Lahir
  - Pekerjaan
  - NIK / No KTP
- **Alamat Lengkap**: Dusun, RT, RW.
- **Data Dinamis (Input Form)**:
  - Keperluan / Tujuan pembuatan SKTM (Contoh: Persyaratan Beasiswa)

---

## Rekomendasi Pembaruan Sistem (Fase Berikutnya)

1. **Migrasi Tabel `warga`**:
   Menambahkan kolom: `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `agama`, `pekerjaan`, `status_perkawinan`, `dusun`.
2. **Dynamic Form Fields**:
   Form `Frontend` perlu mendeteksi jenis surat yang dipilih, kemudian menampilkan *input field* tambahan (seperti `Nomor Pengantar RT`, `Tanggal Pengantar RT`, `Nama Usaha`, dll).
3. **Konfigurasi Nomor Surat**:
   Tabel baru atau menu *Settings* untuk mengatur register nomor urut surat, sehingga variabel penomoran surat bisa diisi (*populate*) secara sistematis, tidak manual menggunakan titik-titik `......../........`.
