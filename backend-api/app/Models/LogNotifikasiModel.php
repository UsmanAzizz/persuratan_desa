<?php

namespace App\Models;

use CodeIgniter\Model;

class LogNotifikasiModel extends Model
{
    protected $table            = 'log_notifikasi';
    protected $primaryKey       = 'id_log';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['id_pengajuan', 'no_tujuan', 'isi_notif', 'status_notif', 'created_at'];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
}
