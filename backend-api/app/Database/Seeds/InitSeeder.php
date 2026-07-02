<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class InitSeeder extends Seeder
{
    public function run()
    {
        // 1. Seed Admin Akun Pertama (Otomatis enkripsi BCrypt)
        $usersData = [
            [
                'username'     => 'admin',
                'password'     => password_hash('user1234', PASSWORD_BCRYPT),
                'nama_petugas' => 'Administrator Sistem',
                'role'         => 'admin',
            ]
        ];

        // Mencegah duplikasi saat seeder dijalankan ulang
        $this->db->table('users')->ignore(true)->insertBatch($usersData);

        // 2. Seed Master Data: Jenis Surat
        $jenisSuratData = [
            [
                'nama_surat'    => 'Surat Keterangan Usaha',
                'kode_surat'    => 'SKU',
                'syarat_berkas' => json_encode(['ktp', 'kk', 'foto_usaha']),
            ],
            [
                'nama_surat'    => 'Surat Keterangan Domisili',
                'kode_surat'    => 'SKD',
                'syarat_berkas' => json_encode(['ktp', 'kk', 'pengantar_rt_rw']),
            ],
            [
                'nama_surat'    => 'Surat Pengantar Catatan Kepolisian',
                'kode_surat'    => 'SKCK',
                'syarat_berkas' => json_encode(['ktp', 'kk', 'pengantar_rt_rw']),
            ],
            [
                'nama_surat'    => 'Surat Keterangan Tidak Mampu',
                'kode_surat'    => 'SKTM',
                'syarat_berkas' => json_encode(['ktp', 'kk', 'pengantar_rt_rw', 'foto_rumah']),
            ],
        ];

        $this->db->table('jenis_surat')->ignore(true)->insertBatch($jenisSuratData);
    }
}
