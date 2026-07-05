<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class DropUnusedTables extends Migration
{
    public function up()
    {
        $this->forge->dropTable('log_notifikasi', true);
        $this->forge->dropTable('jwt_blacklist', true);
    }

    public function down()
    {
        // log_notifikasi
        $this->forge->addField([
            'id_log' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'no_tujuan' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'pesan' => [
                'type' => 'TEXT',
            ],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['terkirim', 'gagal'],
                'default'    => 'terkirim',
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id_log', true);
        $this->forge->createTable('log_notifikasi');

        // jwt_blacklist
        $this->forge->addField([
            'id_blacklist' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'token' => [
                'type' => 'TEXT',
            ],
            'blacklisted_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id_blacklist', true);
        $this->forge->createTable('jwt_blacklist');
    }
}
