# Pedoman Desain Antarmuka Pengguna (UI/UX)
## Sistem Informasi Layanan Persuratan Desa Kutasari

Dokumen ini mendefinisikan bahasa desain dan pedoman pengalaman pengguna untuk proyek ini. Antarmuka harus mencerminkan identitas yang profesional, formal, dan dapat dipercaya, mengingat sistem ini digunakan sebagai ekstensi layanan pemerintahan tingkat desa.

---

### 1. Prinsip Desain Utama
1. **Kejelasan dan Legalitas Visual**: Tata letak harus menghilangkan elemen dekoratif yang tidak perlu, dengan fokus pada keterbacaan data, formulir, dan status administrasi.
2. **Kesesuaian Hierarki**: Tombol persetujuan/penolakan bagi perangkat desa harus sangat mencolok secara hierarki (tidak boleh tertukar fungsinya).
3. **Penyajian Status Transparan**: Warga pengguna layanan harus diberikan indikator visual (*progress tracker* atau *status badge*) yang eksplisit dalam merepresentasikan tahapan surat mereka.

### 2. Palet Warna (Color Palette)
Warna yang direpresentasikan pada antarmuka sistem diatur menggunakan skala *Tailwind CSS* untuk meminimalisasi ketidakkonsistenan warna.

- **Warna Otoritatif (Primary)**: `Slate 800 (#1E293B)`
  Dialokasikan untuk navigasi utama (Navbar), teks judul dokumen (*Heading*), serta tombol aksi sistem (*Admin Area*).
- **Warna Aksi (Accent)**: `Blue 600 (#2563EB)`
  Dialokasikan untuk tombol tindakan esensial masyarakat (misalnya: *Kirim Pengajuan Surat*).
- **Latar Belakang Dasar (Background)**: `Slate 50 (#F8FAFC)`
  Diaplikasikan untuk layar belakang utama agar komponen *card* dan formulir berbatas terlihat jelas namun lembut di mata pengguna.
- **Warna Penanda Validasi (Success)**: `Emerald 700 (#047857)`
  Dipakai untuk lencana (*badge*) yang menyatakan surat 'Selesai' atau 'Telah Ditandatangani'.
- **Warna Penanda Kritis (Danger/Error)**: `Rose 700 (#BE123C)`
  Dipakai secara konservatif pada aksi destruktif (misal: penolakan berkas oleh Admin, kegagalan validasi formulir).

### 3. Tipografi
Keterbacaan teks adalah instrumen paling penting dalam pelayanan publik digital.
- **Jenis Huruf (Web)**: Mengadopsi kombinasi Sans-Serif modern seperti *Inter* atau *Roboto*. Font-font ini dirancang agar bersih, kokoh secara geometri, dan tetap tajam dalam ukuran huruf kecil pada layar perangkat portabel seluler.
- **Pengecualian Ekspor Dokumen Resmi**: Seluruh dokumen akhir persuratan dalam ekstensi format Portable Document Format (PDF) disyaratkan mematuhi kaidah legalitas standar (misalnya pengaplikasian Serif Times New Roman jika diperintahkan oleh tata usaha desa).

### 4. Komponen Visual dan Animasi
Penerapan *Framer Motion* dikhususkan untuk mengurangi beban mental (*cognitive load*) pada pengguna.
- **Transisi Elemen**: Animasi sebatas pengurangan intensitas opasitas (*Fade-in/Fade-out*) antar layar untuk kesan responsif, **bukan** animasi berlebihan (seperti memantul atau berputar).
- **Asinkronitas Modul Jaringan**: Pengambilan informasi jaringan harus selalu disokong oleh *Skeleton Placeholder* dengan efek gradasi menyala redup (*Shimmer*), sehingga meredam persepsi interupsi dan kegagalan pada proses.
- **Kondisi Tanpa Konten (Empty State)**: Harus menyertakan deskripsi tekstual yang lugas, informatif (misal: "Belum Terdapat Antrean Surat Keterangan Usaha"), bukan grafis dekoratif yang mengganggu kesan formalitas.
