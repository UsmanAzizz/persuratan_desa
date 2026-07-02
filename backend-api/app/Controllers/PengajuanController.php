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
     * Endpoint untuk pendaftaran pengajuan oleh publik (Warga)
     */
    public function buat()
    {
        $rules = [
            'nik'            => 'required|min_length[16]|max_length[16]',
            'nama_lengkap'   => 'required',
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
        
        // 1. Daftarkan / Perbarui Profil Warga
        $wargaAda = $wargaModel->find($nik);
        $wargaData = [
            'nik'          => $nik,
            'no_kk'        => $this->request->getVar('no_kk'),
            'nama_lengkap' => $this->request->getVar('nama_lengkap'),
            'no_hp'        => $this->request->getVar('no_hp'),
            'alamat'       => $this->request->getVar('alamat') ?: 'Menunggu Validasi',
            'rt'           => $this->request->getVar('rt') ?: '000',
            'rw'           => $this->request->getVar('rw') ?: '000',
        ];

        if (!$wargaAda) {
            $wargaModel->insert($wargaData);
        } else {
            $wargaModel->update($nik, $wargaData);
        }

        // 2. Generate Tracking Code Unik
        $kodeTracking = 'TRK-' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));

        // 3. Simpan Pengajuan
        $pengajuanData = [
            'kode_tracking'  => $kodeTracking,
            'nik_warga'      => $nik,
            'id_jenis_surat' => $this->request->getVar('id_jenis_surat'),
            'data_input'     => $this->request->getVar('data_input'), // Diharapkan JSON Array berserialisasi
            'status'         => 'menunggu'
        ];

        $pengajuanModel->insert($pengajuanData);
        $idPengajuanBaru = $pengajuanModel->getInsertID();

        // 4. Catat Log Riwayat Status Pertama
        $riwayatModel->insert([
            'id_pengajuan'      => $idPengajuanBaru,
            'status_lama'       => 'menunggu', // Sebagai initial state
            'status_baru'       => 'menunggu',
            'id_user_eksekutor' => null, // Sistem
            'catatan'           => 'Pengajuan awal masuk ke sistem'
        ]);

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
        $builder->select('p.kode_tracking, p.status, p.alasan_penolakan, p.created_at as tgl_pengajuan, w.nama_lengkap, j.nama_surat');
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
        $riwayatBuilder->join('users u', 'u.id_user = rs.id_user_eksekutor', 'left');
        $riwayatBuilder->where('rs.id_pengajuan', function($builder) use ($kodeTracking) {
            $builder->select('id_pengajuan')->from('pengajuan_surat')->where('kode_tracking', $kodeTracking);
        });
        $riwayatBuilder->orderBy('rs.id_riwayat', 'ASC');
        
        $pengajuan['riwayat'] = $riwayatBuilder->get()->getResultArray();

        return $this->respondSuccess($pengajuan, 'Data pelacakan berhasil ditemukan');
    }
}
