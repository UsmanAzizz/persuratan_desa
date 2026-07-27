<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class KadesFeaturePatch extends Migration
{
    public function up()
    {
        // 1. Tambah kolom no_wa_kades di admin
        if (!$this->db->fieldExists('no_wa_kades', 'admin')) {
            $this->db->query("ALTER TABLE `admin` ADD COLUMN `no_wa_kades` VARCHAR(50) NULL AFTER `password`");
        }

        // 2. Tambah nomor_surat dan token_validasi di pengajuan_surat
        if (!$this->db->fieldExists('nomor_surat', 'pengajuan_surat')) {
            $this->db->query("ALTER TABLE `pengajuan_surat` ADD COLUMN `nomor_surat` VARCHAR(100) NULL AFTER `kode_tracking`");
        }
        if (!$this->db->fieldExists('token_validasi', 'pengajuan_surat')) {
            $this->db->query("ALTER TABLE `pengajuan_surat` ADD COLUMN `token_validasi` VARCHAR(100) NULL AFTER `alasan_penolakan`");
        }

        // 3. Modifikasi ENUM status di tabel pengajuan_surat agar men-support status Kades
        // Harus menggunakan raw SQL karena ENUM
        $this->db->query("ALTER TABLE `pengajuan_surat` MODIFY COLUMN `status` ENUM('menunggu','diproses','ditolak','selesai','ditolak_kades','disetujui_kades') DEFAULT 'menunggu'");

        // 4. Modifikasi ENUM status_lama dan status_baru di riwayat_status
        $this->db->query("ALTER TABLE `riwayat_status` MODIFY COLUMN `status_lama` ENUM('menunggu','diproses','ditolak','selesai','ditolak_kades','disetujui_kades')");
        $this->db->query("ALTER TABLE `riwayat_status` MODIFY COLUMN `status_baru` ENUM('menunggu','diproses','ditolak','selesai','ditolak_kades','disetujui_kades')");
    }

    public function down()
    {
        // Rollback jika diperlukan
        $this->forge->dropColumn('admin', 'no_wa_kades');
        $this->forge->dropColumn('pengajuan_surat', ['nomor_surat', 'token_validasi']);
    }
}
