<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Keterangan Domisili</title>
    <style>
        body { font-family: "Times New Roman", Times, serif; font-size: 12pt; padding: 20px 30px; margin: 0; }
        .header { text-align: center; border-bottom: 2px solid black; margin-bottom: 20px; padding-bottom: 10px; position: relative; min-height: 95px; }
        .header img { position: absolute; left: 0; top: 0; width: 75px; height: auto; }
        .header h1 { margin: 0; font-size: 14pt; font-weight: normal; letter-spacing: 1px; }
        .header h2 { margin: 0; font-size: 14pt; font-weight: normal; letter-spacing: 1px; }
        .header h3 { margin: 0; font-size: 18pt; font-weight: bold; letter-spacing: 2px; }
        .header p { margin: 2px 0; font-size: 11pt; text-transform: uppercase; }
        .kodepos-box { position: absolute; right: 0; bottom: 10px; border: 1px solid black; padding: 2px 8px; font-size: 9pt; }
        .title { text-align: center; margin-bottom: 20px; line-height: 1.2; }
        .title h4 { margin: 0; text-decoration: underline; font-size: 14pt; font-weight: bold; }
        .title p { margin: 0; font-size: 12pt; }
        .content { text-align: justify; line-height: 1.5; margin-bottom: 20px; }
        .content p { text-indent: 40px; margin: 5px 0; }
        .table-data { margin-left: 20px; margin-bottom: 15px; width: 90%; line-height: 1.6;}
        .table-data td { padding: 2px 0; vertical-align: top; }
        .signature-container { width: 100%; margin-top: 40px; position: relative; }
        .signature { float: right; text-align: left; width: 250px; }
        .qr-code { float: left; width: 100px; text-align: center; margin-left: 20px; margin-top: 10px; }
        .qr-code img { width: 90px; height: 90px; }
        .clear { clear: both; }
        .kades-name { font-weight: bold; font-size: 12pt; margin-top: 70px; margin-bottom: 0;}
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
        <p>JALAN IR. SOEKARNO NO. 002 KUTASARI<br>CIPARI</p>
        <div class="kodepos-box">Kode Pos 53262</div>
    </div>

    <div class="title">
        <h4>SURAT KETERANGAN DOMISILI</h4>
        <p>Nomor : ........ / ........ / ........</p>
    </div>

    <div class="content">
        <p>Yang bertanda tangan di bawah ini Kepala Desa Kutasari, Kecamatan Cipari Kabupaten Cilacap, menerangkan dengan sebenarnya bahwa :</p>
        
        <table class="table-data">
            <tr><td width="20">1.</td><td width="160">N a m a</td><td width="15">:</td><td><?= isset($warga['nama_lengkap']) ? strtoupper($warga['nama_lengkap']) : '-' ?></td></tr>
            <tr><td>2.</td><td>Jenis Kelamin</td><td>:</td><td><?= isset($warga['jenis_kelamin']) ? ($warga['jenis_kelamin'] === 'L' ? 'Laki-Laki' : 'Perempuan') : '-' ?></td></tr>
            <tr><td>3.</td><td>Tempat/Tgl. Lahir</td><td>:</td><td><?= ($warga['tempat_lahir'] ?? '-') . ' / ' . (isset($warga['tanggal_lahir']) ? tgl_indo($warga['tanggal_lahir']) : '-') ?></td></tr>
            <tr><td>4.</td><td>Bangsa/Agama</td><td>:</td><td>WNI / <?= $warga['agama'] ?? '-' ?></td></tr>
            <tr><td>5.</td><td>Pekerjaan</td><td>:</td><td><?= $warga['pekerjaan'] ?? '-' ?></td></tr>
            <tr><td>6.</td><td>Alamat Tinggal</td><td>:</td><td>Dusun <?= $warga['dusun'] ?? '-' ?></td></tr>
            <tr><td></td><td></td><td></td><td>Desa Kutasari Kecamatan Cipari</td></tr>
            <tr><td></td><td></td><td></td><td>Kabupaten Cilacap.</td></tr>
        </table>

        <p>Orang tersebut di atas adalah benar - benar warga kami yang berdomisili Di wilayah RT <?= str_pad($warga['rt'] ?? '0', 3, '0', STR_PAD_LEFT) ?> RW <?= str_pad($warga['rw'] ?? '0', 3, '0', STR_PAD_LEFT) ?> Desa Kutasari, Kecamatan Cipari, Kabupaten Cilacap yang saat ini berada di <?= $warga['alamat'] ?? '...................' ?></p>
        
        <p>Demikian Surat Keterangan ini, dibuat untuk dapat dipergunakan semestinya.</p>
    </div>

    <div class="signature-container">
        <div class="qr-code">
            <?php if(isset($qr_base64)): ?>
                <img src="<?= $qr_base64 ?>" alt="QR Code">
            <?php endif; ?>
        </div>
        <div class="signature">
            <table style="width: 100%;">
                <tr><td><p style="margin:0;">Kutasari , <?= tgl_indo(date('Y-m-d', strtotime($created_at))) ?></p></td></tr>
            </table>
            <p style="margin:5px 0 0 0; text-align: center;">Kepala Desa Kutasari</p>
            <p class="kades-name" style="text-align: center;">KUSNENDAR</p>
        </div>
        <div class="clear"></div>
    </div>
</body>
</html>
