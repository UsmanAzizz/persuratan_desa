<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateRiwayatStatus extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id_riwayat' => [
                'type'           => 'INT',
                'auto_increment' => true,
            ],
            'id_pengajuan' => [
                'type' => 'INT',
            ],
            'status_lama' => [
                'type'       => 'ENUM',
                'constraint' => ['menunggu', 'diproses', 'ditolak', 'selesai'],
            ],
            'status_baru' => [
                'type'       => 'ENUM',
                'constraint' => ['menunggu', 'diproses', 'ditolak', 'selesai'],
            ],
            'id_user_eksekutor' => [
                'type' => 'INT',
                'null' => true,
            ],
            'catatan' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'TIMESTAMP',
                'null' => true,
            ],
        ]);
        
        $this->forge->addKey('id_riwayat', true);
        $this->forge->addForeignKey('id_pengajuan', 'pengajuan_surat', 'id_pengajuan', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('id_user_eksekutor', 'users', 'id_user', 'SET NULL', 'CASCADE');
        $this->forge->createTable('riwayat_status');
        
        $this->db->query('ALTER TABLE riwayat_status MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    }

    public function down()
    {
        $this->forge->dropTable('riwayat_status');
    }
}
