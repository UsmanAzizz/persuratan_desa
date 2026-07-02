<?php

namespace App\Models;

use CodeIgniter\Model;

class JenisSuratModel extends Model
{
    protected $table            = 'jenis_surat';
    protected $primaryKey       = 'id_jenis';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['nama_surat', 'kode_surat', 'syarat_berkas'];
}
