<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Pengantar Catatan Kepolisian</title>
    <style>
        body { font-family: "Times New Roman", Times, serif; font-size: 11pt; padding: 20px 30px; margin: 0; }
        .header { text-align: center; border-bottom: 2px solid black; margin-bottom: 15px; padding-bottom: 10px; position: relative; min-height: 95px; }
        .header img { position: absolute; left: 0; top: 0; width: 75px; height: auto; }
        .header h1 { margin: 0; font-size: 14pt; font-weight: normal; letter-spacing: 1px; }
        .header h2 { margin: 0; font-size: 14pt; font-weight: normal; letter-spacing: 1px; }
        .header h3 { margin: 0; font-size: 18pt; font-weight: bold; letter-spacing: 2px; }
        .kodepos-box { position: absolute; right: 0; bottom: 5px; font-size: 9pt; }
        .kode-desa { font-size: 10pt; margin-top: 5px; }
        .title { text-align: center; margin-bottom: 15px; margin-top: 15px; line-height: 1.2; }
        .title h4 { margin: 0; text-decoration: underline; font-size: 13pt; font-weight: bold; }
        .title p { margin: 0; font-size: 11pt; }
        .content { text-align: justify; line-height: 1.4; margin-bottom: 15px; }
        .content p { text-indent: 40px; margin: 5px 0; }
        .table-data { margin-left: 20px; margin-bottom: 10px; width: 95%; line-height: 1.5; font-size: 11pt;}
        .table-data td { padding: 1px 0; vertical-align: top; }
        .signature-container { width: 100%; margin-top: 20px; position: relative; }
        .signature-box { float: left; width: 30%; text-align: center; }
        .signature-box-right { float: right; width: 35%; text-align: center; }
        .qr-code { float: left; width: 100px; text-align: center; margin-left: 20px; margin-top: 10px; }
        .qr-code img { width: 90px; height: 90px; }
        .clear { clear: both; }
        .kades-name { font-weight: bold; font-size: 11pt; margin-top: 60px; margin-bottom: 0; text-decoration: underline;}
    </style>
</head>
<body>
    <div class="header">
        <?php 
            $logoPath = FCPATH . 'images/logo_Cilacap.jpg';
            $logoBase64 = 'data:image/jpeg;base64,' . base64_encode(file_get_contents($logoPath));
        ?>
        <img src="<?= $logoBase64 ?>" alt="Logo">
        <h1>PEMERINTAH KABUPATEN CILACAP</h1>
        <h2>KECAMATAN CIPARI</h2>
        <h3>DESA KUTASARI</h3>
        <div class="kodepos-box">Kode Pos 53262</div>
    </div>
    
    <div class="kode-desa">Kode desa : 331182009</div>

    <div class="title">
        <h4>SURAT PENGANTAR CATATAN KEPOLISIAN</h4>
        <p>Nomor : ........ / ........ / ........</p>
    </div>

    <div class="content">
        <p style="text-indent: 40px;">Kepala Desa Kutasari Kecamatan Cipari Kabupaten Cilacap, dengan ini menerangkan bahwa warga Desa Kutasari :</p>
        
        <table class="table-data">
            <tr><td width="20">1.</td><td width="140">Nomor KK</td><td width="10">:</td><td><?= $warga['no_kk'] ?? '-' ?></td></tr>
            <tr><td>2.</td><td>NIK</td><td>:</td><td><?= $warga['nik'] ?? '-' ?></td></tr>
            <tr><td>3.</td><td>Nama Lengkap</td><td>:</td><td><?= isset($warga['nama_lengkap']) ? strtoupper($warga['nama_lengkap']) : '-' ?></td></tr>
            <tr><td>4.</td><td>Tempat/Tanggal Lahir</td><td>:</td><td><?= ($warga['tempat_lahir'] ?? '-') . ' / ' . (isset($warga['tanggal_lahir']) ? tgl_indo($warga['tanggal_lahir']) : '-') ?></td></tr>
            <tr><td>5.</td><td>Jenis Kelamin</td><td>:</td><td><?= isset($warga['jenis_kelamin']) ? ($warga['jenis_kelamin'] === 'L' ? 'Laki-Laki' : 'Perempuan') : '-' ?></td></tr>
            <tr><td>6.</td><td>Warganegara</td><td>:</td><td>WNI</td></tr>
            <tr><td>7.</td><td>Status Perkawinan</td><td>:</td><td><?= $warga['status_perkawinan'] ?? '-' ?></td></tr>
            <tr><td>8.</td><td>Agama</td><td>:</td><td><?= $warga['agama'] ?? '-' ?></td></tr>
            <tr><td>9.</td><td>Pekerjaan</td><td>:</td><td><?= $warga['pekerjaan'] ?? '-' ?></td></tr>
            <tr><td>10.</td><td>Alamat</td><td>:</td><td>Dusun <?= $warga['dusun'] ?? '-' ?> RT. <?= str_pad($warga['rt'] ?? '0', 3, '0', STR_PAD_LEFT) ?> RW. <?= str_pad($warga['rw'] ?? '0', 3, '0', STR_PAD_LEFT) ?> DESA/KEL. Kutasari KEC. Cipari</td></tr>
            <tr><td>11.</td><td>Keperluan</td><td>:</td><td><?= $data_input['keperluan'] ?? 'MELAMAR PEKERJAAN' ?></td></tr>
            <tr><td>12.</td><td>Berlaku</td><td>:</td><td><?= tgl_indo(date('Y-m-d', strtotime($created_at))) ?> s/d <?= tgl_indo(date('Y-m-d', strtotime('+1 month', strtotime($created_at)))) ?></td></tr>
            <tr><td>13.</td><td>Keterangan lain</td><td>:</td><td>-</td></tr>
        </table>

        <p>Berdasarkan Surat Keterangan dari Ketua Rukun Tetangga <?= str_pad($warga['rt'] ?? '0', 3, '0', STR_PAD_LEFT) ?> Nomor <?= $data_input['no_surat_rt'] ?? '...............' ?> Tanggal <?= isset($data_input['tgl_surat_rt']) ? tgl_indo($data_input['tgl_surat_rt']) : '.../.../......' ?> dan menurut pengakuan yang bersangkutan sampai saat ini belum pernah tersangkut yustisi/urusan kepolisian. Surat keterangan ini diperlukan untuk <strong><?= $data_input['keperluan'] ?? 'MELAMAR PEKERJAAN' ?></strong>. Demikian Surat Keterangan ini kami buat atas permintaan yang bersangkutan dan dapat dipergunakan sebagaimana mestinya.</p>
    </div>

    <div class="signature-container">
        <div class="signature-box-right" style="margin-bottom: 20px;">
            <p style="margin:0;">Kutasari, <?= tgl_indo(date('Y-m-d', strtotime($created_at))) ?></p>
        </div>
        <div class="clear"></div>
        
        <table style="width: 100%; margin-bottom: 10px; margin-left: 100px;">
            <tr><td width="100">No. Reg</td><td>: ..............................</td></tr>
            <tr><td>Tanggal</td><td>: ..............................</td></tr>
        </table>
        
        <div class="signature-box">
            <p style="margin:5px 0 0 0;">Pemohon</p>
            <p class="kades-name" style="text-decoration: underline; display:inline-block; margin-top: 60px;"><?= isset($warga['nama_lengkap']) ? strtoupper($warga['nama_lengkap']) : '...................' ?></p>
        </div>
        
        <div class="signature-box">
            <p style="margin:5px 0 0 0;">Mengetahui,</p>
            <?php if(isset($qr_base64)): ?>
                <img src="<?= $qr_base64 ?>" alt="QR Code" style="width:70px; height:70px; margin-top:5px;">
            <?php endif; ?>
        </div>
        
        <div class="signature-box-right">
            <p style="margin:5px 0 0 0;">KEPALA DESA KUTASARI</p>
            <p class="kades-name" style="text-decoration: underline; margin-top: 60px; display:inline-block;">KUSNENDAR</p><br/>
            <p style="margin:0; display: inline-block; padding-top: 2px;">NIP. -</p>
        </div>
        
        <div class="clear"></div>
    </div>
</body>
</html>
