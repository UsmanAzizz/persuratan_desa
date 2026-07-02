<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateLogNotifikasi extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id_log' => [
                'type'           => 'INT',
                'auto_increment' => true,
            ],
            'id_pengajuan' => [
                'type' => 'INT',
            ],
            'no_tujuan' => [
                'type'       => 'VARCHAR',
                'constraint' => '15',
            ],
            'isi_notif' => [
                'type' => 'TEXT',
            ],
            'status_notif' => [
                'type'       => 'ENUM',
                'constraint' => ['belum_terkirim', 'terkirim', 'gagal'],
                'default'    => 'belum_terkirim',
            ],
            'created_at' => [
                'type' => 'TIMESTAMP',
                'null' => true,
            ],
        ]);
        
        $this->forge->addKey('id_log', true);
        $this->forge->addForeignKey('id_pengajuan', 'pengajuan_surat', 'id_pengajuan', 'CASCADE', 'CASCADE');
        $this->forge->createTable('log_notifikasi');
        
        $this->db->query('ALTER TABLE log_notifikasi MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    }

    public function down()
    {
        $this->forge->dropTable('log_notifikasi');
    }
}
