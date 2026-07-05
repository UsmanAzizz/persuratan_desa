<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use CodeIgniter\I18n\Time;

class WargaSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'nik' => '3301123456789012',
                'no_kk' => '3301123456789000',
                'nama_lengkap' => 'Budi Santoso',
                'no_hp' => '081234567890',
                'alamat' => 'Jl. Desa Kutasari No 12',
                'rt' => '001',
                'rw' => '002',
                'tempat_lahir' => 'Purbalingga',
                'tanggal_lahir' => '1985-05-15',
                'jenis_kelamin' => 'L',
                'agama' => 'Islam',
                'pekerjaan' => 'Petani',
                'status_perkawinan' => 'Kawin',
                'dusun' => 'Dusun 1',
                'created_at' => Time::now(),
            ],
            [
                'nik' => '3301123456789013',
                'no_kk' => '3301123456789000',
                'nama_lengkap' => 'Siti Aminah',
                'no_hp' => '081234567891',
                'alamat' => 'Jl. Desa Kutasari No 12',
                'rt' => '001',
                'rw' => '002',
                'tempat_lahir' => 'Purbalingga',
                'tanggal_lahir' => '1988-08-20',
                'jenis_kelamin' => 'P',
                'agama' => 'Islam',
                'pekerjaan' => 'Ibu Rumah Tangga',
                'status_perkawinan' => 'Kawin',
                'dusun' => 'Dusun 1',
                'created_at' => Time::now(),
            ],
        ];

        // Ensure we don't insert duplicate NIKs
        foreach ($data as $warga) {
            if ($this->db->table('warga')->where('nik', $warga['nik'])->countAllResults() == 0) {
                $this->db->table('warga')->insert($warga);
            }
        }
    }
}
