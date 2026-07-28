<?php

namespace App\Controllers;

use App\Models\PengajuanSuratModel;
use App\Models\RiwayatStatusModel;

class AdminController extends BaseApiController
{
    /**
     * Endpoint untuk menarik seluruh data pengajuan
     * (Hanya bisa diakses oleh JWT terotentikasi)
     */
    public function getPengajuan()
    {
        $db = \Config\Database::connect();
        
        $builder = $db->table('pengajuan_surat p');
        $builder->select('p.id_pengajuan, p.kode_tracking, p.status, p.created_at as tgl_pengajuan, w.nama_lengkap, w.nik, j.nama_surat');
        $builder->join('warga w', 'w.nik = p.nik_warga');
        $builder->join('jenis_surat j', 'j.id_jenis = p.id_jenis_surat');
        $builder->orderBy('p.created_at', 'DESC');
        
        $data = $builder->get()->getResultArray();
        
        return $this->respondSuccess($data, 'Berhasil memuat daftar pengajuan');
    }

    /**
     * Endpoint untuk menarik rincian detail satu pengajuan beserta berkasnya
     */
    public function getPengajuanDetail($id_pengajuan)
    {
        $db = \Config\Database::connect();
        
        $builder = $db->table('pengajuan_surat p');
        $builder->select('p.*, w.nama_lengkap, w.nik, w.no_kk, w.alamat, w.rt, w.rw, j.nama_surat, j.syarat_berkas');
        $builder->join('warga w', 'w.nik = p.nik_warga');
        $builder->join('jenis_surat j', 'j.id_jenis = p.id_jenis_surat');
        $builder->where('p.id_pengajuan', $id_pengajuan);
        
        $data = $builder->get()->getRowArray();
        
        if (!$data) {
            return $this->respondError('Data pengajuan tidak ditemukan', 404);
        }
        
        return $this->respondSuccess($data, 'Berhasil memuat detail pengajuan');
    }

    /**
     * Endpoint untuk mengubah status dokumen (Intervensi Admin)
     */
    public function updateStatus($id_pengajuan)
    {
        $rules = [
            'status_baru' => 'required|in_list[menunggu,diproses,ditolak,selesai]',
            'catatan'     => 'permit_empty|string'
        ];

        if (!$this->validate($rules)) {
            return $this->respondError('Validasi gagal', 400, $this->validator->getErrors());
        }

        $pengajuanModel = new PengajuanSuratModel();
        $riwayatModel = new RiwayatStatusModel();

        $pengajuanLama = $pengajuanModel->find($id_pengajuan);
        if (!$pengajuanLama) {
            return $this->respondError('Data pengajuan tidak ditemukan', 404);
        }

        // Ambil detail warga dan jenis surat untuk notifikasi WA
        $db = \Config\Database::connect();
        $pengajuanDetail = $db->table('pengajuan_surat p')
                              ->select('p.kode_tracking, p.no_hp, w.nama_lengkap, j.nama_surat, j.kode_surat')
                              ->join('warga w', 'w.nik = p.nik_warga')
                              ->join('jenis_surat j', 'j.id_jenis = p.id_jenis_surat')
                              ->where('p.id_pengajuan', $id_pengajuan)
                              ->get()
                              ->getRowArray();

        $statusBaru = $this->request->getVar('status_baru');
        $catatan = $this->request->getVar('catatan');
        
        // Kewajiban Alasan Penolakan
        if ($statusBaru === 'ditolak' && empty(trim($catatan))) {
            return $this->respondError('Alasan penolakan wajib diisi jika status ditolak', 400);
        }

        // Ekstraksi ID Petugas dari JWT (via Header)
        helper('jwt');
        $authHeader = $this->request->getServer('HTTP_AUTHORIZATION');
        $idUserEksekutor = null;
        try {
            $token = getJWTFromRequest($authHeader);
            $decoded = validateJWTFromRequest($token);
            $idUserEksekutor = $decoded->id;
        } catch (\Exception $e) {
            // Seharusnya sudah tersaring di JWTAuthFilter, tapi sebagai lapis pengaman
            return $this->respondError('Akses sesi tidak terotorisasi', 401);
        }

        // Update Pengajuan
        $updateData = ['status' => $statusBaru];
        if ($statusBaru === 'ditolak') {
            $updateData['alasan_penolakan'] = $catatan;
        }

        if ($statusBaru === 'diproses') {
            $updateData['token_validasi'] = bin2hex(random_bytes(16));
        }

        if ($statusBaru === 'selesai') {
            // 0. Generate Nomor Surat Otomatis (Permendagri No. 1 Tahun 2023)
            $klasifikasiMap = [
                'SKD' => '470',
                'SKU' => '500',
                'SKTM' => '460',
                'SKCK' => '330',
                'IK' => '330',
                'SKW' => '470',
                'N1' => '474.2'
            ];
            $kodeSurat = $pengajuanDetail['kode_surat'] ?? '';
            $kodeKlasifikasi = $klasifikasiMap[$kodeSurat] ?? '400';
            $tahunIni = date('Y');
            
            $countTahunIni = $db->table('pengajuan_surat')
                                ->where('status', 'selesai')
                                ->where('YEAR(created_at)', $tahunIni)
                                ->countAllResults();
            $nomorUrut = str_pad($countTahunIni + 1, 3, '0', STR_PAD_LEFT);
            $kodeDesa = 'DS.KTS';
            
            $nomorSurat = $kodeKlasifikasi . '/' . $nomorUrut . '/' . $kodeDesa . '/' . $tahunIni;
            $updateData['nomor_surat'] = $nomorSurat;

            // 1. Buat Token QR
            $qrToken = bin2hex(random_bytes(16));
            $updateData['qr_token'] = $qrToken;
            
            // 2. Generate QR Code (Base64)
            $qrOptions = new \chillerlan\QRCode\QROptions([
                'version'         => 5,
                'outputInterface' => \chillerlan\QRCode\Output\QRMarkupSVG::class,
                'eccLevel'        => \chillerlan\QRCode\Common\EccLevel::L,
                'outputBase64'    => true,
            ]);
            $qrcode = new \chillerlan\QRCode\QRCode($qrOptions);
            $qrUrl = base_url('validasi/' . $qrToken); // URL Validasi Publik (Bisa dibuat nanti)
            $qrBase64 = $qrcode->render($qrUrl);
            
            // 3. Tarik Data Utuh Warga & Jenis Surat untuk Template
            $warga = $db->table('warga')->where('nik', $pengajuanLama['nik_warga'])->get()->getRowArray();
            $jenisSurat = $db->table('jenis_surat')->where('id_jenis', $pengajuanLama['id_jenis_surat'])->get()->getRowArray();
            
            $viewData = [
                'warga' => $warga,
                'data_input' => json_decode($pengajuanLama['data_input'], true),
                'id_pengajuan' => $pengajuanLama['id_pengajuan'],
                'created_at' => $pengajuanLama['created_at'],
                'qr_base64' => $qrBase64,
                'nomor_surat' => $nomorSurat
            ];
            
            helper('indo');
            
            // Peta Kode Surat ke File View
            $slugMap = [
                'SKU' => 'sku',
                'SKD' => 'skd',
                'SKCK' => 'skck',
                'SKTM' => 'sktm',
                'IK' => 'ik',
                'SKW' => 'skw',
                'N1' => 'n1'
            ];
            
            $viewFile = 'surat/' . ($slugMap[$jenisSurat['kode_surat']] ?? 'skd');
            $html = view($viewFile, $viewData);
            
            // 4. Generate PDF dengan DomPDF
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();
            $pdfOutput = $dompdf->output();
            
            // 5. Simpan PDF ke Folder uploads/surat/
            $fileName = 'Surat_' . $pengajuanLama['kode_tracking'] . '_' . time() . '.pdf';
            $uploadPath = FCPATH . 'uploads/surat/';
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }
            
            file_put_contents($uploadPath . $fileName, $pdfOutput);
            $updateData['file_path'] = 'uploads/surat/' . $fileName;
        }

        $pengajuanModel->update($id_pengajuan, $updateData);

        // Sisipkan Log Riwayat
        $riwayatModel->insert([
            'id_pengajuan'      => $id_pengajuan,
            'status_lama'       => $pengajuanLama['status'],
            'status_baru'       => $statusBaru,
            'id_user_eksekutor' => $idUserEksekutor,
            'catatan'           => $catatan ?: "Status diperbarui ke " . strtoupper($statusBaru)
        ]);

        // Trigger WA Gateway Notifikasi
        if ($pengajuanDetail && !empty($pengajuanDetail['no_hp'])) {
            $pesan = "Halo Sdr/i *" . $pengajuanDetail['nama_lengkap'] . "*, \n\n";
            $pesan .= "Pemberitahuan dari *Desa Kutasari* mengenai permohonan *" . $pengajuanDetail['nama_surat'] . "* Anda (Kode: " . $pengajuanDetail['kode_tracking'] . ").\n\n";
            
            if ($statusBaru === 'diproses') {
                $pesan .= "⏳ Berkas Anda saat ini sedang dalam tahap *DIPROSES* dan menunggu persetujuan Kepala Desa.";
            } else if ($statusBaru === 'selesai') {
                $pesan .= "✅ Berkas Anda telah *SELESAI* diproses! Silakan datang ke balai desa pada jam kerja untuk mengambil dokumen tersebut.";
            } else if ($statusBaru === 'ditolak') {
                $pesan .= "❌ Mohon maaf, permohonan Anda *DITOLAK* dengan catatan:\n_{$catatan}_\n\nSilakan lengkapi kekurangan dan ajukan kembali.";
            } else if ($statusBaru === 'menunggu') {
                $pesan .= "🕒 Berkas Anda dikembalikan ke antrean *MENUNGGU* verifikasi.";
            }

            $pesan .= "\n\nCek rincian dan riwayat pengajuan Anda di sini:\n";
            $frontendUrl = getenv('FRONTEND_URL') ?: 'https://persuratan-desa-kutasari.snowline.cloud';
            $pesan .= $frontendUrl . "/track?code=" . $pengajuanDetail['kode_tracking'];

            $waUrl = 'http://127.0.0.1:3030/wa/send';
            
            // Kirim WA ke Pemohon
            $waDataPemohon = [
                'target' => $pengajuanDetail['no_hp'],
                'message' => $pesan
            ];
            $ch = curl_init($waUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($waDataPemohon));
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            $result = curl_exec($ch);
            curl_close($ch);
            
            // Kirim WA ke Kades JIKA status diproses
            if ($statusBaru === 'diproses') {
                // Ambil nomor kades
                $kadesAdmin = $db->table('admin')->where('role', 'kades')->orWhere('no_wa_kades IS NOT NULL')->get()->getRowArray();
                $noWaKades = $kadesAdmin ? $kadesAdmin['no_wa_kades'] : null;
                
                if ($noWaKades) {
                    $tokenValidasi = $updateData['token_validasi'];
                    $pesanKades = "🔔 *PEMBERITAHUAN VALIDASI SURAT*\n\n";
                    $pesanKades .= "Yth. Kepala Desa,\nAda pengajuan surat baru yang membutuhkan persetujuan Anda.\n\n";
                    $pesanKades .= "Pemohon: *" . $pengajuanDetail['nama_lengkap'] . "*\n";
                    $pesanKades .= "Jenis Surat: *" . $pengajuanDetail['nama_surat'] . "*\n\n";
                    $pesanKades .= "Silakan klik link berikut untuk melihat draf dan menyetujui surat:\n";
                    $pesanKades .= $frontendUrl . "/validasi-kades/" . $tokenValidasi;
                    
                    $waDataKades = [
                        'target' => $noWaKades,
                        'message' => $pesanKades
                    ];
                    $ch2 = curl_init($waUrl);
                    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch2, CURLOPT_POST, true);
                    curl_setopt($ch2, CURLOPT_POSTFIELDS, json_encode($waDataKades));
                    curl_setopt($ch2, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
                    curl_setopt($ch2, CURLOPT_TIMEOUT, 10);
                    $result2 = curl_exec($ch2);
                    curl_close($ch2);
                }
            }
        }

        return $this->respondSuccess(null, 'Status dokumen berhasil diperbarui');
    }

    // ==================================================
    // PREVIEW PDF (Tanpa download, return base64 / stream)
    // ==================================================
    public function previewPdf($id_pengajuan)
    {
        $db = \Config\Database::connect();
        $pengajuan = $db->table('pengajuan_surat p')
                        ->join('warga w', 'w.nik = p.nik_warga')
                        ->join('jenis_surat j', 'j.id_jenis = p.id_jenis_surat')
                        ->where('p.id_pengajuan', $id_pengajuan)
                        ->get()
                        ->getRowArray();

        if (!$pengajuan) {
            return $this->respondError('Pengajuan tidak ditemukan', 404);
        }

        // Siapkan Data
        $warga = $db->table('warga')->where('nik', $pengajuan['nik_warga'])->get()->getRowArray();
        
        $viewData = [
            'warga' => $warga,
            'data_input' => json_decode($pengajuan['data_input'], true),
            'id_pengajuan' => $pengajuan['id_pengajuan'],
            'created_at' => $pengajuan['created_at'],
            'qr_base64' => null, // Default null untuk diproses
            'nomor_surat' => '[Belum Diterbitkan]' // Default
        ];

        // Jika selesai, tampilkan QR dan nomor surat
        if ($pengajuan['status'] === 'selesai' || $pengajuan['status'] === 'disetujui_kades') {
            $viewData['nomor_surat'] = $pengajuan['nomor_surat'] ?: '[Belum Diterbitkan]';
            if ($pengajuan['qr_token']) {
                $qrOptions = new \chillerlan\QRCode\QROptions([
                    'version'         => 5,
                    'outputInterface' => \chillerlan\QRCode\Output\QRMarkupSVG::class,
                    'eccLevel'        => \chillerlan\QRCode\Common\EccLevel::L,
                    'outputBase64'    => true,
                ]);
                $qrcode = new \chillerlan\QRCode\QRCode($qrOptions);
                $qrUrl = base_url('validasi/' . $pengajuan['qr_token']);
                $viewData['qr_base64'] = $qrcode->render($qrUrl);
            }
        }

        helper('indo');
        
        // Peta Kode Surat ke File View
        $slugMap = [
            'SKU' => 'sku',
            'SKD' => 'skd',
            'SKCK' => 'skck',
            'SKTM' => 'sktm',
            'IK' => 'ik',
            'SKW' => 'skw',
            'N1' => 'n1'
        ];
        
        $viewFile = 'surat/' . ($slugMap[$pengajuan['kode_surat']] ?? 'skd');
        $html = view($viewFile, $viewData);
        
        // Generate PDF dengan DomPDF
        $dompdf = new \Dompdf\Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        $pdfOutput = $dompdf->output();
        
        return $this->response->setHeader('Content-Type', 'application/pdf')
                              ->setBody($pdfOutput);
    }

    // ==================================================
    // MANAJEMEN AKUN ADMIN
    // ==================================================
    public function getAkun()
    {
        $db = \Config\Database::connect();
        
        helper('jwt');
        $authHeader = $this->request->getServer('HTTP_AUTHORIZATION');
        try {
            $token = getJWTFromRequest($authHeader);
            $decoded = validateJWTFromRequest($token);
            $idUser = $decoded->id;
        } catch (\Exception $e) {
            return $this->respondError('Sesi tidak valid', 401);
        }

        $user = $db->table('admin')
                   ->select('id_user, username, no_wa_kades, nama_petugas, role')
                   ->where('id_user', $idUser)
                   ->get()
                   ->getRowArray();

        if (!$user) {
            return $this->respondError('Data akun tidak ditemukan', 404);
        }

        return $this->respondSuccess($user, 'Berhasil memuat data akun');
    }

    public function updateAkun()
    {
        $rules = [
            'username'     => 'required|min_length[4]',
            'password_lama'=> 'permit_empty|min_length[6]',
            'password_baru'=> 'permit_empty|min_length[6]'
        ];

        if (!$this->validate($rules)) {
            return $this->respondError('Validasi gagal', 400, $this->validator->getErrors());
        }

        helper('jwt');
        $authHeader = $this->request->getServer('HTTP_AUTHORIZATION');
        try {
            $token = getJWTFromRequest($authHeader);
            $decoded = validateJWTFromRequest($token);
            $idUser = $decoded->id;
        } catch (\Exception $e) {
            return $this->respondError('Sesi tidak valid', 401);
        }

        $userModel = new \App\Models\AdminModel();
        $user = $userModel->find($idUser);

        if (!$user) {
            return $this->respondError('Pengguna tidak ditemukan', 404);
        }

        // Cek jika username diganti dan sudah terpakai
        $usernameBaru = $this->request->getVar('username');
        if ($usernameBaru !== $user['username']) {
            $existingUser = $userModel->where('username', $usernameBaru)->first();
            if ($existingUser) {
                return $this->respondError('Username sudah digunakan oleh akun lain', 400);
            }
        }

        $updateData = [
            'username'     => $usernameBaru
        ];

        $noWaKades = $this->request->getVar('no_wa_kades');
        if ($noWaKades !== null) {
            $updateData['no_wa_kades'] = $noWaKades;
        }

        // Jika user ingin mengganti password
        $passwordLama = $this->request->getVar('password_lama');
        $passwordBaru = $this->request->getVar('password_baru');

        if (!empty($passwordLama) || !empty($passwordBaru)) {
            if (empty($passwordLama) || empty($passwordBaru)) {
                return $this->respondError('Untuk mengganti sandi, harap isi sandi lama dan sandi baru', 400);
            }
            if (!password_verify($passwordLama, $user['password'])) {
                return $this->respondError('Sandi lama yang Anda masukkan salah', 400);
            }
            $updateData['password'] = password_hash($passwordBaru, PASSWORD_DEFAULT);
        }

        $userModel->update($idUser, $updateData);

        return $this->respondSuccess(null, 'Profil berhasil diperbarui');
    }

    // ==================================================
    // PROXY WA GATEWAY (Untuk diakses Frontend SPA)
    // ==================================================
    private function _proxyWaGateway($endpoint, $method = 'GET', $data = null)
    {
        $url = 'http://127.0.0.1:3030' . $endpoint;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($data) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
            }
        }
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if (!$result) {
            return $this->respondError('WA Gateway tidak dapat dihubungi (Pastikan Node.js berjalan di port 3030)', 503);
        }

        // Return raw JSON string directly
        return $this->response->setStatusCode($httpCode ?: 200)
                              ->setContentType('application/json')
                              ->setBody($result);
    }

    public function waStatus()
    {
        return $this->_proxyWaGateway('/wa/status');
    }

    public function waQr()
    {
        return $this->_proxyWaGateway('/wa/qr');
    }

    public function waLogout()
    {
        return $this->_proxyWaGateway('/wa/logout', 'POST');
    }

    public function waSendTest()
    {
        $target = $this->request->getVar('target');
        $message = "🤖 *UJI COBA SISTEM*\n\nHalo! Jika pesan ini sampai ke Anda, artinya *WhatsApp Gateway Desa Kutasari* telah terhubung dan berfungsi dengan sempurna. ✅\n\n_Pesan otomatis dikirim pada: " . date('Y-m-d H:i:s') . "_";
        
        return $this->_proxyWaGateway('/wa/send', 'POST', [
            'target' => $target,
            'message' => $message
        ]);
    }

    // ==================================================
    // CONTOH SURAT (Untuk Pengaturan SPA)
    // ==================================================
    public function contohSuratPdf($kode_surat)
    {
        $validTypes = ['sku', 'skd', 'skck', 'sktm', 'skw', 'ik', 'n1'];
        $kode_surat = strtolower($kode_surat);
        if (!in_array($kode_surat, $validTypes)) {
            return $this->respondError('Jenis surat tidak ditemukan', 404);
        }

        // Dummy data
        $dummyWarga = [
            'nik' => '3301234567890001',
            'nama_lengkap' => 'JOHN DOE (CONTOH)',
            'tempat_lahir' => 'CILACAP',
            'tanggal_lahir' => '1990-01-01',
            'jenis_kelamin' => 'Laki-Laki',
            'agama' => 'Islam',
            'pekerjaan' => 'Wiraswasta',
            'alamat_lengkap' => 'Jl. Ir. Soekarno No. 123, RT 01 RW 02, Desa Kutasari',
            'status_perkawinan' => 'Belum Kawin'
        ];

        helper('custom'); 
        
        $viewData = [
            'warga' => $dummyWarga,
            'pengajuan' => [
                'nomor_surat' => '140/000/CONTOH/2026',
                'keperluan' => 'Contoh pengajuan surat untuk pratinjau aplikasi.',
                'keterangan_lain' => 'Data ini adalah contoh fiktif.',
                'berlaku_sampai' => date('Y-m-d', strtotime('+1 month')),
            ],
            'created_at' => date('Y-m-d H:i:s'),
            'qr_base64' => 'data:image/png;base64,' . base64_encode(file_get_contents(FCPATH . 'images/logo_Cilacap.jpg')) // Pakai logo aja buat dummy qr agar ada gambar
        ];

        $dompdf = new \Dompdf\Dompdf();
        $options = new \Dompdf\Options();
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);
        $dompdf->setOptions($options);

        try {
            $html = view("surat/{$kode_surat}", $viewData);
        } catch (\Exception $e) {
            return $this->respondError('Template surat gagal dirender', 500);
        }

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $this->response->setHeader('Content-Type', 'application/pdf')
                              ->setBody($dompdf->output());
    }
}
