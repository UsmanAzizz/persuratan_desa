<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

// ==========================================
// API Routes (Sistem Informasi Persuratan Desa)
// ==========================================
$routes->group('api/v1', function($routes) {
    // Rute preflight CORS
    $routes->options('(:any)', 'Home::index');
    
    // Modul Otentikasi Sesi
    $routes->group('auth', function($routes) {
        $routes->post('login', 'AuthController::login');
        $routes->post('logout', 'AuthController::logout');
    });

    // Modul Admin dan Kepala Desa (Dilindungi Filter JWT)
    $routes->group('admin', ['filter' => 'jwt'], function($routes) {
        // Rute manifes antrean
        $routes->get('pengajuan', 'AdminController::getPengajuan');
        $routes->get('pengajuan/(:num)', 'AdminController::getPengajuanDetail/$1');
        // Rute intervensi status
        $routes->put('pengajuan/(:num)/status', 'AdminController::updateStatus/$1');
        
        // Modul Pengaturan Akun Admin
        $routes->get('akun', 'AdminController::getAkun');
        $routes->put('akun', 'AdminController::updateAkun');

        // WA Gateway Proxy WhatsApp Gateway
        $routes->get('wa/status', 'AdminController::waStatus');
        $routes->get('wa/qr', 'AdminController::waQr');
        $routes->post('wa/logout', 'AdminController::waLogout');
        $routes->post('wa/send-test', 'AdminController::waSendTest');

        // Modul Manajemen Warga
        $routes->group('warga', function($routes) {
            $routes->get('/', 'WargaController::index');
            $routes->post('/', 'WargaController::create');
            $routes->put('(:segment)', 'WargaController::update/$1');
            $routes->delete('(:segment)', 'WargaController::delete/$1');
            $routes->post('import-json', 'WargaController::importJson');
        });
    });

    // Modul Warga (Area Publik)
    $routes->group('pengajuan', function($routes) {
        $routes->get('jenis-surat', 'PengajuanController::getJenisSurat');
    $routes->get('cek-nik/(:segment)', 'PengajuanController::cekNik/$1');
    $routes->post('buat', 'PengajuanController::buat');
        $routes->get('track/(:segment)', 'PengajuanController::track/$1');
    $routes->get('download/(:segment)', 'PengajuanController::download/$1');
    });

});
