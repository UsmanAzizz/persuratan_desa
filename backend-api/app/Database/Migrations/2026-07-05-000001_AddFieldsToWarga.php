<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddFieldsToWarga extends Migration
{
    public function up()
    {
        try {
            $this->forge->addColumn('warga', [
                'tempat_lahir' => [
                    'type' => 'VARCHAR',
                    'constraint' => 100,
                    'null' => true,
                ],
                'tanggal_lahir' => [
                    'type' => 'DATE',
                    'null' => true,
                ],
                'jenis_kelamin' => [
                    'type' => 'ENUM',
                    'constraint' => ['L', 'P'],
                    'null' => true,
                ],
                'agama' => [
                    'type' => 'VARCHAR',
                    'constraint' => 50,
                    'null' => true,
                ],
                'pekerjaan' => [
                    'type' => 'VARCHAR',
                    'constraint' => 100,
                    'null' => true,
                ],
                'status_perkawinan' => [
                    'type' => 'ENUM',
                    'constraint' => ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'],
                    'null' => true,
                ],
                'dusun' => [
                    'type' => 'VARCHAR',
                    'constraint' => 100,
                    'null' => true,
                ],
            ]);
        } catch (\Exception $e) {
            // Ignore duplicate column errors
        }
    }

    public function down()
    {
        $this->forge->dropColumn('warga', [
            'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'pekerjaan', 'status_perkawinan', 'dusun'
        ]);
    }
}
