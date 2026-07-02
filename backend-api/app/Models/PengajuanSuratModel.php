<?php

namespace App\Models;

use CodeIgniter\Model;

class PengajuanSuratModel extends Model
{
    protected $table            = 'pengajuan_surat';
    protected $primaryKey       = 'id_pengajuan';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['kode_tracking', 'nik_warga', 'id_jenis_surat', 'data_input', 'status', 'alasan_penolakan', 'qr_token', 'file_path', 'created_at'];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
}
