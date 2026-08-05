# Execution Plan (persuratan_desa)

## ⏳ Waiting for User Approval
*(None)*

## 🏃 In Progress
*(None)*

## ✅ Completed
- Mengubah logika `previewPdf` agar nomor surat langsung muncul di *preview* setelah diinput (dikirim via *query param* dari frontend) secara *real-time*
- Memperbaiki bug kirim pesan WA dengan mem-parsing payload JSON di `AdminController.php` dan menghapus session ID dari nomor target di `wa-gateway/index.js`
- Membuka akses tab "Preview Surat" untuk Admin meskipun status masih "menunggu" (edit `DetailPengajuan.jsx`)
- Memperbaiki tombol terpotong di `PengaturanWA.jsx` dengan mengubah height statis menjadi fleksibel
- Mematikan filter `forcehttps` di `Filters.php` untuk mem-fix error provisional headers
- Memperbaiki bug login pending dengan set `pConnect => false` di `Database.php`
- Menyembunyikan tombol auto-fill dummy di `FormPengajuan.jsx`
- Setup ekosistem .agents (Peta Arsitektur, Tracker, Scope)
