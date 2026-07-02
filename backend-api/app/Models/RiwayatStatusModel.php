<?php

namespace App\Models;

use CodeIgniter\Model;

class RiwayatStatusModel extends Model
{
    protected $table            = 'riwayat_status';
    protected $primaryKey       = 'id_riwayat';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['id_pengajuan', 'status_lama', 'status_baru', 'id_user_eksekutor', 'catatan', 'created_at'];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
}
