<?php
define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);
require FCPATH . '../app/Config/Paths.php';
$paths = new Config\Paths();
require rtrim($paths->systemDirectory, '\\/ ') . DIRECTORY_SEPARATOR . 'bootstrap.php';
$app = Config\Services::codeigniter();
$app->initialize();

$command = CodeIgniter\Config\Services::commands();
$command->run('migrate', ['all' => true]);
$command->run('db:seed', ['InitSeeder']);

echo "Migrations and seeds ran successfully!";
