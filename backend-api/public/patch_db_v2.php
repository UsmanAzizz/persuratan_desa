<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=persuratan_desa", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Add no_wa_kades to admin
    try {
        $pdo->exec("ALTER TABLE admin ADD COLUMN no_wa_kades VARCHAR(50) NULL AFTER password");
        echo "Success: Added no_wa_kades column.\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "Column no_wa_kades already exists.\n";
        } else {
            echo "Error admin: " . $e->getMessage() . "\n";
        }
    }

    // Add token_validasi to pengajuan_surat
    try {
        $pdo->exec("ALTER TABLE pengajuan_surat ADD COLUMN token_validasi VARCHAR(100) NULL AFTER alasan_penolakan");
        echo "Success: Added token_validasi column.\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "Column token_validasi already exists.\n";
        } else {
            echo "Error pengajuan_surat: " . $e->getMessage() . "\n";
        }
    }
} catch (PDOException $e) {
    echo "DB Connection Error: " . $e->getMessage();
}
