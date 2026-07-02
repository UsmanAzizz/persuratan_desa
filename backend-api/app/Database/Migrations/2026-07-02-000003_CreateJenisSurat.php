<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateJenisSurat extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id_jenis' => [
                'type'           => 'INT',
                'auto_increment' => true,
            ],
            'nama_surat' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'kode_surat' => [
                'type'       => 'VARCHAR',
                'constraint' => '10',
                'unique'     => true,
            ],
            'syarat_berkas' => [
                'type' => 'TEXT',
            ],
        ]);
        
        $this->forge->addKey('id_jenis', true);
        $this->forge->createTable('jenis_surat');
    }

    public function down()
    {
        $this->forge->dropTable('jenis_surat');
    }
}
