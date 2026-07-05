const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'persuratan_desa'
  });

  try {
    console.log('Adding columns to warga table...');
    // Attempt to add columns. Ignore if they already exist
    const addColumnsQueries = [
      "ALTER TABLE warga ADD COLUMN tempat_lahir VARCHAR(100) NULL;",
      "ALTER TABLE warga ADD COLUMN tanggal_lahir DATE NULL;",
      "ALTER TABLE warga ADD COLUMN jenis_kelamin ENUM('L', 'P') NULL;",
      "ALTER TABLE warga ADD COLUMN agama VARCHAR(50) NULL;",
      "ALTER TABLE warga ADD COLUMN pekerjaan VARCHAR(100) NULL;",
      "ALTER TABLE warga ADD COLUMN status_perkawinan ENUM('Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati') NULL;",
      "ALTER TABLE warga ADD COLUMN dusun VARCHAR(100) NULL;"
    ];

    for (let q of addColumnsQueries) {
      try {
        await connection.query(q);
      } catch (err) {
        if (err.code !== 'ER_DUP_FIELDNAME') {
          console.error(err);
        }
      }
    }

    console.log('Inserting dummy data...');
    const warga = [
      ['3301123456789012', '3301123456789000', 'Budi Santoso', '081234567890', 'Jl. Desa Kutasari No 12', '001', '002', 'Purbalingga', '1985-05-15', 'L', 'Islam', 'Petani', 'Kawin', 'Dusun 1'],
      ['3301123456789013', '3301123456789000', 'Siti Aminah', '081234567891', 'Jl. Desa Kutasari No 12', '001', '002', 'Purbalingga', '1988-08-20', 'P', 'Islam', 'Ibu Rumah Tangga', 'Kawin', 'Dusun 1']
    ];

    for (let w of warga) {
      const [rows] = await connection.query('SELECT nik FROM warga WHERE nik = ?', [w[0]]);
      if (rows.length === 0) {
        await connection.query(`
          INSERT INTO warga (nik, no_kk, nama_lengkap, no_hp, alamat, rt, rw, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, pekerjaan, status_perkawinan, dusun)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, w);
      }
    }

    console.log('Seeding finished successfully.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

run();
