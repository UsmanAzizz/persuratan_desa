#!/bin/bash
# ==========================================
# Inisialisasi Otomatis Server Backend API
# ==========================================

echo "Memulai inisialisasi arsitektur tabel MySQL..."
# Menjalankan CodeIgniter 4 Migrations secara Force (bypass environment prompt)
php spark migrate -all

echo "Tabel terpasang. Menanamkan konfigurasi pabrik (Admin & Master Data)..."
php spark db:seed InitSeeder

echo "Lingkungan Basis Data Siap Beroperasi."
echo "Menghidupkan daemon API Server di port 8080..."
php spark serve --host 0.0.0.0 --port 8080
