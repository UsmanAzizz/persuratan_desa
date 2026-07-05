<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Keterangan Usaha</title>
    <style>
        body { font-family: "Times New Roman", Times, serif; font-size: 12pt; padding: 20px 30px; margin: 0; }
        .header { text-align: center; border-bottom: 2px solid black; margin-bottom: 30px; padding-bottom: 10px; position: relative; min-height: 95px; }
        .header img { position: absolute; left: 0; top: 0; width: 80px; height: auto; }
        .header h1 { margin: 0; font-size: 14pt; font-weight: normal; letter-spacing: 1px; }
        .header h2 { margin: 0; font-size: 14pt; font-weight: normal; letter-spacing: 1px; }
        .header h3 { margin: 0; font-size: 18pt; font-weight: normal; letter-spacing: 2px; }
        .header p { margin: 2px 0; font-size: 11pt; font-style: italic; }
        .title { text-align: center; margin-bottom: 30px; line-height: 1.2; }
        .title h4 { margin: 0; text-decoration: underline; font-size: 14pt; font-weight: bold; }
        .title p { margin: 0; font-size: 12pt; }
        .content { text-align: justify; line-height: 1.5; margin-bottom: 20px; }
        .content p { text-indent: 40px; margin: 5px 0; }
        .table-data { margin-left: 0; margin-bottom: 15px; width: 100%; line-height: 1.6;}
        .table-data td { padding: 2px 0; vertical-align: top; }
        .signature-container { width: 100%; margin-top: 40px; position: relative; }
        .signature { float: right; text-align: center; width: 250px; }
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
        <h1>PEMERINTAH KABUPATEN - CILACAP</h1>
        <h2>KECAMATAN CIPARI</h2>
        <h3>DESA KUTASARI</h3>
        <p>Alamat : Jln Ir Soekarno No 02 Kutasari</p>
    </div>

    <div class="title">
        <h4>SURAT KETERANGAN USAHA</h4>
        <p>Nomor : 474 / ........ / ........ / <?= str_pad($id_pengajuan, 3, '0', STR_PAD_LEFT) ?></p>
    </div>

    <div class="content">
        <p>Yang bertandatangan di bawah ini Kepala Desa KUTASARI, Kecamatan CIPARI , Kabupaten CILACAP , Menerangkan bahwa :</p>
        
        <table class="table-data">
            <tr><td width="150">Nama</td><td width="15">:</td><td><?= isset($warga['nama_lengkap']) ? strtoupper($warga['nama_lengkap']) : '-' ?></td></tr>
            <tr><td>Tempat Tgl lahir</td><td>:</td><td><?= ($warga['tempat_lahir'] ?? '-') . ', ' . (isset($warga['tanggal_lahir']) ? tgl_indo($warga['tanggal_lahir']) : '-') ?></td></tr>
            <tr><td>Pekerjaan</td><td>:</td><td><?= $warga['pekerjaan'] ?? '-' ?></td></tr>
            <tr><td>No KTP</td><td>:</td><td><?= $warga['nik'] ?? '-' ?></td></tr>
            <tr><td>Alamat</td><td>:</td><td>Dusun <?= $warga['dusun'] ?? '-' ?>, RT <?= str_pad($warga['rt'] ?? '0', 3, '0', STR_PAD_LEFT) ?> RW <?= str_pad($warga['rw'] ?? '0', 3, '0', STR_PAD_LEFT) ?></td></tr>
            <tr><td></td><td></td><td>Desa Kutasari , Kecamatan Cipari</td></tr>
        </table>

        <p>Orang tersebut diatas benar - benar Warga Desa kami yang mempunyai usaha :</p>
        <p style="text-indent: 10px;">( <strong><?= strtoupper($data_input['nama_usaha'] ?? '..................................') ?></strong> )</p>
        
        <p>Demikian surat keterangan ini kami buat dalam keadaan sebenarnya dan kemudian kepada yang berkepentingan untuk menjadi periksa dan maklum adanya .</p>
    </div>

    <div class="signature-container">
        <div class="qr-code">
            <?php if(isset($qr_base64)): ?>
                <img src="<?= $qr_base64 ?>" alt="QR Code">
            <?php endif; ?>
        </div>
        <div class="signature">
            <p style="margin:0;">Kutasari , <?= tgl_indo(date('Y-m-d', strtotime($created_at))) ?></p>
            <p style="margin:5px 0 0 0;">KEPALA DESA KUTASARI</p>
            <p class="kades-name">KUSNENDAR</p>
            <p style="margin:0;">NIP. -</p>
        </div>
        <div class="clear"></div>
    </div>
</body>
</html>
