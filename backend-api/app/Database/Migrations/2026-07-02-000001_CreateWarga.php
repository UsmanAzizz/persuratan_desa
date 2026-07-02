<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateWarga extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'nik' => [
                'type'       => 'VARCHAR',
                'constraint' => '16',
            ],
            'no_kk' => [
                'type'       => 'VARCHAR',
                'constraint' => '16',
            ],
            'nama_lengkap' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'no_hp' => [
                'type'       => 'VARCHAR',
                'constraint' => '15',
            ],
            'alamat' => [
                'type' => 'TEXT',
            ],
            'rt' => [
                'type'       => 'VARCHAR',
                'constraint' => '3',
            ],
            'rw' => [
                'type'       => 'VARCHAR',
                'constraint' => '3',
            ],
            'created_at' => [
                'type' => 'TIMESTAMP',
                'null' => true,
            ],
        ]);
        
        $this->forge->addKey('nik', true);
        $this->forge->createTable('warga');
        
        // CI4 Forge doesn't easily set DEFAULT CURRENT_TIMESTAMP for addField out of the box without raw query
        $this->db->query('ALTER TABLE warga MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    }

    public function down()
    {
        $this->forge->dropTable('warga');
    }
}
