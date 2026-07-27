<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=persuratan_desa", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("ALTER TABLE pengajuan_surat ADD COLUMN nomor_surat VARCHAR(100) NULL AFTER kode_tracking");
    echo "Success: Added nomor_surat column.";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Column already exists.";
    } else {
        echo "Error: " . $e->getMessage();
    }
}
