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
        $pengajuanModel->update($id_pengajuan, $updateData);

        // Sisipkan Log Riwayat
        $riwayatModel->insert([
            'id_pengajuan'      => $id_pengajuan,
            'status_lama'       => $pengajuanLama['status'],
            'status_baru'       => $statusBaru,
            'id_user_eksekutor' => $idUserEksekutor,
            'catatan'           => $catatan ?: "Status diperbarui ke " . strtoupper($statusBaru)
        ]);

        return $this->respondSuccess(null, 'Status dokumen berhasil diperbarui');
    }
}
