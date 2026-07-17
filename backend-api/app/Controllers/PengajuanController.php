<?php

namespace App\Controllers;

use App\Models\WargaModel;
use App\Models\PengajuanSuratModel;
use App\Models\RiwayatStatusModel;
use App\Models\JenisSuratModel;

class PengajuanController extends BaseApiController
{
    /**
     * Mengambil daftar Jenis Surat yang tersedia
     */
    public function getJenisSurat()
    {
        // Optimasi: Memori Caching agar tidak membebani database setiap saat
        $cache = \Config\Services::cache();
        
        if (! $data = $cache->get('jenis_surat_list')) {
            $jenisSuratModel = new JenisSuratModel();
            $data = $jenisSuratModel->findAll();
            $cache->save('jenis_surat_list', $data, 3600); 
        }

        return $this->respondSuccess($data, 'Berhasil mengambil referensi surat (Cache Enabled)');
    }

    /**
     * Endpoint untuk memvalidasi NIK Warga
     * GET /pengajuan/cek-nik/{nik}
     */
    public function cekNik($nik = null)
    {
        if (empty($nik) || strlen($nik) !== 16) {
            return $this->respondError('NIK tidak valid, harus 16 digit.', 400);
        }

        $wargaModel = new WargaModel();
        $warga = $wargaModel->where('nik', $nik)->first();

        if (!$warga) {
            return $this->respondError('NIK tidak terdaftar dalam database penduduk Desa Kutasari. Silakan hubungi aparat desa.', 404);
        }

        return $this->respondSuccess($warga, 'Data warga berhasil ditemukan');
    }

    /**
     * Endpoint untuk pendaftaran pengajuan oleh publik (Warga)
     */
    public function buat()
    {
        $rules = [
            'nik'            => 'required|min_length[16]|max_length[16]',
            'no_kk'          => 'required',
            'no_hp'          => 'required',
            'id_jenis_surat' => 'required|numeric',
            'data_input'     => 'required' // JSON string for dynamic form
        ];

        if (!$this->validate($rules)) {
            return $this->respondError('Validasi form gagal. Pastikan NIK 16 digit.', 400, $this->validator->getErrors());
        }

        $wargaModel = new WargaModel();
        $pengajuanModel = new PengajuanSuratModel();
        $riwayatModel = new RiwayatStatusModel();

        $nik = $this->request->getVar('nik');
        
        $db = \Config\Database::connect();
        $wargaBuilder = $db->table('warga');
        
        // Cek keberadaan NIK warga
        if ($wargaBuilder->where('nik', $nik)->countAllResults() == 0) {
            return $this->respondError('Gagal: NIK tidak terdaftar sebagai Warga Kutasari.', 403);
        }

        // Ambil data Jenis Surat
        $jenisSuratModel = new JenisSuratModel();
        $jenisSurat = $jenisSuratModel->find($this->request->getVar('id_jenis_surat'));
        if (!$jenisSurat) {
            return $this->respondError('Jenis surat tidak valid', 400);
        }

        // 2. Generate Tracking Code Unik dengan Inisial (Hanya abjad)
        $namaSuratClean = preg_replace('/[^a-zA-Z\s]/', '', $jenisSurat['nama_surat']);
        $words = explode(" ", $namaSuratClean);
        $initials = "";
        foreach ($words as $w) {
            $w = trim($w);
            if (strlen($w) > 0) {
                $initials .= strtoupper($w[0]);
            }
        }
        $kodeTracking = $initials . '-' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));

        // Penanganan Upload Berkas Dinamis
        $dataInputArr = json_decode($this->request->getVar('data_input'), true) ?: [];
        if ($files = $this->request->getFiles()) {
            $uploadPath = FCPATH . 'uploads/persyaratan/';
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }
            
            foreach ($files as $key => $file) {
                if ($file->isValid() && !$file->hasMoved()) {
                    $newName = $file->getRandomName();
                    $file->move($uploadPath, $newName);
                    $dataInputArr[$key] = '/uploads/persyaratan/' . $newName;
                }
            }
        }

        // 3. Simpan Pengajuan
        $pengajuanData = [
            'kode_tracking'  => $kodeTracking,
            'nik_warga'      => $nik,
            'no_hp'          => $this->request->getVar('no_hp'),
            'id_jenis_surat' => $this->request->getVar('id_jenis_surat'),
            'data_input'     => json_encode($dataInputArr), // Sudah termasuk URL file
            'status'         => 'menunggu'
        ];

        if (!$pengajuanModel->insert($pengajuanData)) {
            return $this->respondError('Gagal merekam data pengajuan ke sistem', 500, $pengajuanModel->errors());
        }
        $idPengajuanBaru = $pengajuanModel->getInsertID();

        // 4. Catat Log Riwayat Status Pertama
        $riwayatModel->insert([
            'id_pengajuan'      => $idPengajuanBaru,
            'status_lama'       => 'menunggu', // Sebagai initial state
            'status_baru'       => 'menunggu',
            'id_user_eksekutor' => null, // Sistem
            'catatan'           => 'Pengajuan awal masuk ke sistem'
        ]);

        // 5. Kirim Notifikasi WA ke Pemohon
        $namaSurat = $jenisSurat ? $jenisSurat['nama_surat'] : 'Surat Keterangan';
        $warga = $wargaBuilder->where('nik', $nik)->get()->getRowArray();
        $namaWarga = $warga ? $warga['nama_lengkap'] : 'Warga';
        
        $noHp = $this->request->getVar('no_hp');

        $pesan = "Halo Sdr/i *" . $namaWarga . "*,\n\n";
        $pesan .= "Pengajuan *" . $namaSurat . "* Anda telah berhasil diterima dan masuk ke dalam antrean sistem *Desa Kutasari*.\n\n";
        $pesan .= "📋 *DETAIL DATA:*\n";
        $pesan .= "• NIK: " . $nik . "\n";
        foreach ($dataInputArr as $key => $val) {
            $label = ucwords(str_replace('_', ' ', $key));
            $pesan .= "• " . $label . ": " . $val . "\n";
        }
        
        $pesan .= "\nKODE PELACAKAN: *" . $kodeTracking . "*\n\n";
        $pesan .= "Untuk memantau progres permohonan surat Anda secara real-time, silakan kunjungi tautan di bawah ini:\n";
        $frontendUrl = getenv('FRONTEND_URL') ?: 'https://persuratan-desa-kutasari.snowline.cloud';
        $pesan .= $frontendUrl . "/track?code=" . $kodeTracking . "\n\n";
        $pesan .= "_(Catatan: Mohon simpan pesan dan tautan ini untuk mengambil dokumen Anda nanti di balai desa)_";

        // Eksekusi API Node.js Gateway
        $waUrl = 'http://127.0.0.1:3030/wa/send';
        $waData = [
            'target' => $noHp,
            'message' => $pesan
        ];
        
        $ch = curl_init($waUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($waData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_TIMEOUT, 3); // Timeout agar user tidak lama menunggu
        curl_exec($ch);
        curl_close($ch);

        return $this->respondSuccess([
            'kode_tracking' => $kodeTracking,
        ], 'Pengajuan berhasil direkam. Harap simpan Kode Pelacakan Anda.');
    }

    /**
     * Lacak progres pengajuan berdasarkan kode_tracking
     */
    public function track($kodeTracking)
    {
        if (empty($kodeTracking)) {
            return $this->respondError('Kode tracking tidak boleh kosong', 400);
        }

        $pengajuanModel = new PengajuanSuratModel();
        
        $db = \Config\Database::connect();
        // Custom Query with join to JenisSurat and Warga
        $builder = $db->table('pengajuan_surat p');
        $builder->select('p.kode_tracking, p.status, p.alasan_penolakan, p.created_at as tgl_pengajuan, p.file_path, w.nama_lengkap, j.nama_surat');
        $builder->join('warga w', 'w.nik = p.nik_warga');
        $builder->join('jenis_surat j', 'j.id_jenis = p.id_jenis_surat');
        $builder->where('p.kode_tracking', $kodeTracking);
        
        $pengajuan = $builder->get()->getRowArray();

        if (!$pengajuan) {
            return $this->respondError('Pengajuan tidak ditemukan dengan kode tersebut', 404);
        }

        // Get Riwayat
        $riwayatBuilder = $db->table('riwayat_status rs');
        $riwayatBuilder->select('rs.status_baru, rs.catatan, rs.created_at, u.nama_petugas');
        $riwayatBuilder->join('admin u', 'u.id_user = rs.id_user_eksekutor', 'left');
        $riwayatBuilder->where('rs.id_pengajuan', function($builder) use ($kodeTracking) {
            $builder->select('id_pengajuan')->from('pengajuan_surat')->where('kode_tracking', $kodeTracking);
        });
        $riwayatBuilder->orderBy('rs.id_riwayat', 'ASC');
        
        $pengajuan['riwayat'] = $riwayatBuilder->get()->getResultArray();

        return $this->respondSuccess($pengajuan, 'Data pelacakan berhasil ditemukan');
    }

    public function download($fileName)
    {
        $filePath = FCPATH . 'uploads/surat/' . $fileName;

        if (!is_file($filePath)) {
            return $this->respondError('File surat tidak ditemukan', 404);
        }

        return $this->response->download($filePath, null);
    }

    public function validasi($token)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('pengajuan_surat p');
        $builder->select('p.kode_tracking, p.status, p.created_at, w.nama_lengkap, w.nik, j.nama_surat');
        $builder->join('warga w', 'w.nik = p.nik_warga');
        $builder->join('jenis_surat j', 'j.id_jenis = p.id_jenis_surat');
        $builder->where('p.qr_token', $token);
        
        $pengajuan = $builder->get()->getRowArray();

        if (!$pengajuan) {
            return $this->respondError('Dokumen tidak ditemukan atau QR Code tidak valid', 404);
        }

        return $this->respondSuccess($pengajuan, 'Dokumen valid');
    }
}
