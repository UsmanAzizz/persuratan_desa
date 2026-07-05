<?php

namespace App\Controllers;

use App\Models\WargaModel;
use CodeIgniter\API\ResponseTrait;

class WargaController extends BaseController
{
    use ResponseTrait;

    protected $wargaModel;

    public function __construct()
    {
        $this->wargaModel = new WargaModel();
    }

    private function respondSuccess($data = null, $message = 'Success', $statusCode = 200)
    {
        return $this->respond([
            'success' => true,
            'message' => $message,
            'data'    => $data
        ], $statusCode);
    }

    private function respondError($message = 'Error', $statusCode = 400)
    {
        return $this->respond([
            'success' => false,
            'message' => $message,
            'data'    => null
        ], $statusCode);
    }

    /**
     * Tampilkan daftar warga (mendukung pencarian)
     */
    public function index()
    {
        $search = $this->request->getVar('search');
        
        if (!empty($search)) {
            $warga = $this->wargaModel
                ->groupStart()
                    ->like('nik', $search)
                    ->orLike('nama_lengkap', $search)
                ->groupEnd()
                ->orderBy('created_at', 'DESC')
                ->findAll(100); // Limit untuk performa
        } else {
            $warga = $this->wargaModel->orderBy('created_at', 'DESC')->findAll(100);
        }

        return $this->respondSuccess($warga, 'Berhasil mengambil data warga');
    }

    /**
     * Tambah data warga baru
     */
    public function create()
    {
        $rules = [
            'nik'          => 'required|min_length[16]|max_length[16]|is_unique[warga.nik]',
            'no_kk'        => 'required|min_length[16]|max_length[16]',
            'nama_lengkap' => 'required',
            'dusun'        => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->respondError($this->validator->getErrors(), 400);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        
        try {
            $this->wargaModel->insert($data);
            return $this->respondSuccess($data, 'Data warga berhasil ditambahkan', 201);
        } catch (\Exception $e) {
            return $this->respondError('Gagal menambahkan data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update data warga
     */
    public function update($nik = null)
    {
        if (empty($nik)) return $this->respondError('NIK tidak disertakan', 400);

        $warga = $this->wargaModel->where('nik', $nik)->first();
        if (!$warga) return $this->respondError('Data warga tidak ditemukan', 404);

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();
        
        // Remove NIK from data payload to prevent changing primary identifier
        if(isset($data['nik'])) unset($data['nik']);
        if(empty($data)) return $this->respondError('Tidak ada data untuk diperbarui', 400);

        try {
            $this->wargaModel->where('nik', $nik)->set($data)->update();
            return $this->respondSuccess(null, 'Data warga berhasil diperbarui');
        } catch (\Exception $e) {
            return $this->respondError('Gagal memperbarui data: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Hapus data warga
     */
    public function delete($nik = null)
    {
        if (empty($nik)) return $this->respondError('NIK tidak disertakan', 400);

        $warga = $this->wargaModel->where('nik', $nik)->first();
        if (!$warga) return $this->respondError('Data warga tidak ditemukan', 404);

        try {
            $this->wargaModel->where('nik', $nik)->delete();
            return $this->respondSuccess(null, 'Data warga berhasil dihapus');
        } catch (\Exception $e) {
            return $this->respondError('Gagal menghapus data. Pastikan tidak ada pengajuan surat yang terkait.', 500);
        }
    }

    /**
     * Import batch Warga dari Excel (JSON payload)
     */
    public function importJson()
    {
        $payload = $this->request->getJSON(true);
        if (empty($payload) || !is_array($payload)) {
            return $this->respondError('Data payload tidak valid', 400);
        }

        $berhasil = 0;
        $gagal = 0;
        
        $db = \Config\Database::connect();
        $builder = $db->table('warga');

        foreach ($payload as $row) {
            if (empty($row['nik']) || strlen($row['nik']) < 16) {
                $gagal++;
                continue;
            }

            try {
                // Gunakan ignore(true) agar tidak error jika duplikat
                if ($builder->ignore(true)->insert($row)) {
                    $berhasil++;
                } else {
                    $gagal++;
                }
            } catch (\Exception $e) {
                $gagal++;
            }
        }

        return $this->respondSuccess([
            'berhasil' => $berhasil,
            'gagal' => $gagal
        ], "Import selesai. Berhasil: $berhasil, Gagal/Duplikat: $gagal");
    }
}
