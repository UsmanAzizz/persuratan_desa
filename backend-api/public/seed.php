<?php
// Temporary script to seed database directly via HTTP
define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);
require FCPATH . '../app/Config/Paths.php';
$paths = new Config\Paths();
require rtrim($paths->systemDirectory, '\\/ ') . DIRECTORY_SEPARATOR . 'bootstrap.php';
$app = Config\Services::codeigniter();
$app->initialize();

$db = \Config\Database::connect();

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
        'dusun' => 'Dusun 1'
    ]
];

foreach ($data as $row) {
    if ($db->table('warga')->where('nik', $row['nik'])->countAllResults() == 0) {
        $db->table('warga')->insert($row);
    }
}

echo "Seeding successful!";
