<?php

namespace App\Controllers;

use App\Models\PengajuanSuratModel;
use App\Models\RiwayatStatusModel;

class PublicController extends BaseApiController
{
    // ==================================================
    // 1. Ambil Detail Pengajuan via Token
    // ==================================================
    public function kadesDetail($token)
    {
        $db = \Config\Database::connect();
        $pengajuan = $db->table('pengajuan_surat p')
                        ->select('p.id_pengajuan, p.status, p.data_input, p.created_at, p.alasan_penolakan, w.nama_lengkap, w.nik, j.nama_surat')
                        ->join('warga w', 'w.nik = p.nik_warga')
                        ->join('jenis_surat j', 'j.id_jenis = p.id_jenis_surat')
                        ->where('p.token_validasi', $token)
                        ->get()
                        ->getRowArray();

        if (!$pengajuan) {
            return $this->respondError('Token validasi tidak valid atau kedaluwarsa', 404);
        }

        $pengajuan['data_input'] = json_decode($pengajuan['data_input'], true);
        return $this->respondSuccess($pengajuan, 'Data pengajuan berhasil dimuat');
    }

    // ==================================================
    // 2. Tampilkan Preview PDF via Token
    // ==================================================
    public function kadesPreview($token)
    {
        $db = \Config\Database::connect();
        $pengajuan = $db->table('pengajuan_surat')
                        ->select('id_pengajuan')
                        ->where('token_validasi', $token)
                        ->get()
                        ->getRowArray();

        if (!$pengajuan) {
            return $this->response->setStatusCode(404)->setBody('Token tidak valid');
        }

        // Panggil fungsi previewPdf dari AdminController
        $adminController = new AdminController();
        $adminController->initController($this->request, $this->response, $this->logger);
        return $adminController->previewPdf($pengajuan['id_pengajuan']);
    }

    // ==================================================
    // 3. Aksi Kades (Terima / Tolak / Batalkan)
    // ==================================================
    public function kadesAksi($token)
    {
        $aksi = $this->request->getVar('aksi'); // 'terima', 'tolak', 'batalkan'
        $alasan = $this->request->getVar('alasan');

        if (!in_array($aksi, ['terima', 'tolak', 'batalkan'])) {
            return $this->respondError('Aksi tidak valid', 400);
        }

        if ($aksi === 'tolak' && empty(trim($alasan))) {
            return $this->respondError('Alasan penolakan wajib diisi', 400);
        }

        $db = \Config\Database::connect();
        $pengajuanModel = new PengajuanSuratModel();
        
        $pengajuanDetail = $db->table('pengajuan_surat p')
                              ->select('p.id_pengajuan, p.kode_tracking, p.status, p.no_hp, p.nik_warga, p.data_input, p.created_at, p.id_jenis_surat, p.nomor_surat, j.kode_surat, j.nama_surat, w.nama_lengkap')
                              ->join('warga w', 'w.nik = p.nik_warga')
                              ->join('jenis_surat j', 'j.id_jenis = p.id_jenis_surat')
                              ->where('p.token_validasi', $token)
                              ->get()
                              ->getRowArray();

        if (!$pengajuanDetail) {
            return $this->respondError('Sesi validasi tidak ditemukan', 404);
        }

        $statusBaru = '';
        $updateData = [];

        if ($aksi === 'terima') {
            $statusBaru = 'selesai'; // Otomatis selesai dan terbit nomor
            
            // Nomor surat sudah ada di DB dari input admin saat status 'diproses'
            $nomorSurat = $pengajuanDetail['nomor_surat'] ?: '[Belum Diterbitkan]';

            // Generate Token Validasi QR
            $qrToken = bin2hex(random_bytes(16));
            $updateData['qr_token'] = $qrToken;

            // Generate QR Code (Base64)
            $qrOptions = new \chillerlan\QRCode\QROptions([
                'version'         => 5,
                'outputInterface' => \chillerlan\QRCode\Output\QRMarkupSVG::class,
                'eccLevel'        => \chillerlan\QRCode\Common\EccLevel::L,
                'outputBase64'    => true,
            ]);
            $qrcode = new \chillerlan\QRCode\QRCode($qrOptions);
            $frontendUrl = rtrim(config('App')->baseURL, '/');
            $qrUrl = $frontendUrl . '/validasi/' . $qrToken;
            $qrBase64 = $qrcode->render($qrUrl);

            $warga = $db->table('warga')->where('nik', $pengajuanDetail['nik_warga'])->get()->getRowArray();
            
            $viewData = [
                'warga' => $warga,
                'data_input' => json_decode($pengajuanDetail['data_input'], true),
                'id_pengajuan' => $pengajuanDetail['id_pengajuan'],
                'created_at' => $pengajuanDetail['created_at'],
                'qr_base64' => $qrBase64,
                'nomor_surat' => $nomorSurat
            ];
            
            helper('indo');
            
            $slugMap = [
                'SKU' => 'sku',
                'SKD' => 'skd',
                'SKCK' => 'skck',
                'SKTM' => 'sktm',
                'IK' => 'ik',
                'SKW' => 'skw',
                'N1' => 'n1'
            ];
            
            $viewFile = 'surat/' . ($slugMap[$pengajuanDetail['kode_surat']] ?? 'skd');
            $html = view($viewFile, $viewData);
            
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();
            $pdfOutput = $dompdf->output();
            
            $fileName = 'Surat_' . $pengajuanDetail['kode_tracking'] . '_' . time() . '.pdf';
            $uploadPath = FCPATH . 'uploads/surat/';
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }
            
            file_put_contents($uploadPath . $fileName, $pdfOutput);
            $updateData['file_path'] = 'uploads/surat/' . $fileName;

        } else if ($aksi === 'tolak') {
            $statusBaru = 'ditolak_kades';
            $updateData['alasan_penolakan'] = $alasan;
        } else if ($aksi === 'batalkan') {
            $statusBaru = 'diproses'; // Kembali ke draft
            $updateData['nomor_surat'] = null; // Reset
            $updateData['qr_token'] = null; // Reset
        }

        $updateData['status'] = $statusBaru;
        $pengajuanModel->update($pengajuanDetail['id_pengajuan'], $updateData);

        // Sisipkan Log Riwayat
        $riwayatModel = new RiwayatStatusModel();
        $riwayatModel->insert([
            'id_pengajuan'      => $pengajuanDetail['id_pengajuan'],
            'status_lama'       => $pengajuanDetail['status'],
            'status_baru'       => $statusBaru,
            'id_user_eksekutor' => null, // Sistem/Kades Public
            'catatan'           => $aksi === 'batalkan' ? "Kades membatalkan persetujuan" : ($alasan ?: "Kades menyetujui dokumen")
        ]);

        // WA Gateway Notifikasi (hanya jika terima/tolak, jika batalkan tidak usah spam)
        if (in_array($aksi, ['terima', 'tolak']) && !empty($pengajuanDetail['no_hp'])) {
            $pesan = "Halo Sdr/i *" . $pengajuanDetail['nama_lengkap'] . "*, \n\n";
            $pesan .= "Pemberitahuan dari *Desa Kutasari* mengenai permohonan *" . $pengajuanDetail['nama_surat'] . "* Anda (Kode: " . $pengajuanDetail['kode_tracking'] . ").\n\n";
            
            if ($aksi === 'terima') {
                $pesan .= "✅ Berkas Anda telah *DISETUJUI & DITANDATANGANI* oleh Kepala Desa! Silakan datang ke balai desa pada jam kerja untuk mengambil dokumen cetaknya.";
            } else if ($aksi === 'tolak') {
                $pesan .= "❌ Mohon maaf, permohonan Anda *DITOLAK* oleh Kepala Desa dengan catatan:\n_{$alasan}_\n\nSilakan ajukan ulang dengan perbaikan yang diminta.";
            }

            $pesan .= "\n\nCek rincian pengajuan Anda di sini:\n";
            $frontendUrl = rtrim(config('App')->baseURL, '/');
            $pesan .= $frontendUrl . "/track?code=" . $pengajuanDetail['kode_tracking'];

            $waUrl = 'http://127.0.0.1:3030/wa/send';
            $waData = [
                'target' => $pengajuanDetail['no_hp'],
                'message' => $pesan
            ];
            
            $ch = curl_init($waUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($waData));
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_exec($ch);
            curl_close($ch);
        }

        return $this->respondSuccess(null, 'Aksi berhasil disimpan');
    }
}
