<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddIndexToPengajuan extends Migration
{
    public function up()
    {
        // Menambahkan INDEX pada kolom status di tabel pengajuan_surat
        // Ini akan mempercepat pencarian data saat admin memfilter berdasarkan status
        $this->db->query('ALTER TABLE pengajuan_surat ADD INDEX idx_status (status)');
    }

    public function down()
    {
        // Menghapus index jika di-rollback
        $this->db->query('ALTER TABLE pengajuan_surat DROP INDEX idx_status');
    }
}
