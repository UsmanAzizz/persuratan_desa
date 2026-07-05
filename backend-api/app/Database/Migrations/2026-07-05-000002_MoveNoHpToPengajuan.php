<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class MoveNoHpToPengajuan extends Migration
{
    public function up()
    {
        // 1. Tambah no_hp ke pengajuan_surat
        $this->forge->addColumn('pengajuan_surat', [
            'no_hp' => [
                'type'       => 'VARCHAR',
                'constraint' => '20',
                'null'       => true, // bisa null untuk migrasi existing data
            ],
        ]);

        // 2. Hapus no_hp dari warga
        $this->forge->dropColumn('warga', 'no_hp');
    }

    public function down()
    {
        // 1. Kembalikan no_hp ke warga
        $this->forge->addColumn('warga', [
            'no_hp' => [
                'type'       => 'VARCHAR',
                'constraint' => '20',
                'null'       => true,
            ],
        ]);

        // 2. Hapus no_hp dari pengajuan_surat
        $this->forge->dropColumn('pengajuan_surat', 'no_hp');
    }
}
