<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePengajuanSurat extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id_pengajuan' => [
                'type'           => 'INT',
                'auto_increment' => true,
            ],
            'kode_tracking' => [
                'type'       => 'VARCHAR',
                'constraint' => '12',
                'unique'     => true,
            ],
            'nik_warga' => [
                'type'       => 'VARCHAR',
                'constraint' => '16',
            ],
            'id_jenis_surat' => [
                'type' => 'INT',
            ],
            'data_input' => [
                'type' => 'TEXT',
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['menunggu', 'diproses', 'ditolak', 'selesai'],
                'default'    => 'menunggu',
            ],
            'alasan_penolakan' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'qr_token' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'file_path' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'created_at' => [
                'type' => 'TIMESTAMP',
                'null' => true,
            ],
        ]);
        
        $this->forge->addKey('id_pengajuan', true);
        $this->forge->addForeignKey('nik_warga', 'warga', 'nik', 'RESTRICT', 'RESTRICT');
        $this->forge->addForeignKey('id_jenis_surat', 'jenis_surat', 'id_jenis', 'RESTRICT', 'RESTRICT');
        $this->forge->createTable('pengajuan_surat');
        
        $this->db->query('ALTER TABLE pengajuan_surat MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    }

    public function down()
    {
        $this->forge->dropTable('pengajuan_surat');
    }
}
