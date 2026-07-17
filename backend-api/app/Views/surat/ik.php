<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Keterangan Ijin Khajat</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 0;
            padding: 0.5cm 2cm;
        }
        .kop-surat {
            border-bottom: 3px solid black;
            padding-bottom: 5px;
            margin-bottom: 20px;
        }
        .judul-surat {
            text-align: center;
            margin-bottom: 30px;
        }
        .judul-surat h4 {
            margin: 0;
            text-decoration: underline;
            font-weight: bold;
        }
        .judul-surat p {
            margin: 0;
        }
        .konten {
            text-align: justify;
        }
        .table-data {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        .table-data td {
            vertical-align: top;
            padding: 2px 5px;
        }
        .ttd-container {
            margin-top: 40px;
            width: 300px;
            float: right;
            text-align: center;
            page-break-inside: avoid;
            position: relative;
        }
        .ttd-image {
            position: absolute;
            height: 120px;
            width: auto;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
        }
        .ttd-name {
            font-weight: bold;
            text-decoration: underline;
            margin-top: 0;
            position: relative;
            z-index: 2;
        }
        /* clearfix */
        .clear {
            clear: both;
        }
    </style>
</head>
<body>

    <table class="kop-surat" width="100%">
        <tr>
            <td width="15%" style="text-align: left; vertical-align: middle;">
                <?php
                    $logoPath = FCPATH . 'assets/images/logo_Cilacap.png';
                    $logoBase64 = '';
                    if (file_exists($logoPath)) {
                        $logoBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
                    }
                ?>
                <?php if($logoBase64): ?>
                    <img src="<?= $logoBase64 ?>" style="width: 80px; height: auto;" />
                <?php endif; ?>
            </td>
            <td width="85%" style="text-align: center; padding-right: 50px;">
                <div style="font-weight: bold; font-size: 14pt; margin: 0;">PEMERINTAH KABUPATEN CILACAP</div>
                <div style="font-weight: bold; font-size: 14pt; margin: 0;">KECAMATAN CIPARI</div>
                <div style="font-weight: bold; font-size: 18pt; margin: 0;">DESA KUTASARI</div>
                <div style="font-size: 10pt; margin: 0;">Alamat : Jalan Ir. Soekarno Nomor 02 Kutasari <strong>CIPARI</strong> Kode Pos 53262</div>
            </td>
        </tr>
    </table>

    <div class="judul-surat">
        <h4>KETERANGAN IJIN KHAJAT</h4>
        <p>Nomor : <?= $id_pengajuan ?> / IK / <?= date('Y', strtotime($created_at)) ?></p>
    </div>

    <div class="konten">
        <p>Yang bertanda tangan di bawah ini Kepala Desa Kutasari, Kecamatan Cipari, Kabupaten Cilacap, menerangkan dengan sebenarnya bahwa :</p>
        
        <table class="table-data">
            <tr>
                <td>1</td>
                <td width="150">Nama dan alias</td>
                <td>: <?= htmlspecialchars($warga['nama_lengkap']) ?></td>
            </tr>
            <tr>
                <td>2</td>
                <td>Tempat Tanggal lahir</td>
                <td>: <?= htmlspecialchars($warga['tempat_lahir'] ?? '-') ?>, <?= tgl_indo($warga['tanggal_lahir'] ?? '1990-01-01') ?></td>
            </tr>
            <tr>
                <td>3</td>
                <td>Pekerjaan</td>
                <td>: <?= htmlspecialchars($warga['pekerjaan'] ?? '-') ?></td>
            </tr>
            <tr>
                <td>4</td>
                <td>Alamat tinggal</td>
                <td>: <?= htmlspecialchars($warga['alamat']) ?> RT <?= htmlspecialchars($warga['rt']) ?>/RW <?= htmlspecialchars($warga['rw']) ?></td>
            </tr>
            <tr>
                <td>5</td>
                <td>Keperluan</td>
                <td>: <?= htmlspecialchars($data_input['keperluan'] ?? '-') ?></td>
            </tr>
        </table>

        <p>Orang tersebut di atas benar warga kami, kepadanya diberikan ijin untuk menyelenggarakan hajat pada ketentuan :</p>
        
        <table class="table-data" style="margin-left: 0;">
            <tr>
                <td width="100">Hari</td>
                <td>: <?= htmlspecialchars($data_input['hari_hajat'] ?? '-') ?></td>
            </tr>
            <tr>
                <td>Tanggal</td>
                <td>: <?= isset($data_input['tanggal_hajat']) ? tgl_indo($data_input['tanggal_hajat']) : '-' ?></td>
            </tr>
            <tr>
                <td>Hiburan</td>
                <td>: <?= htmlspecialchars($data_input['jenis_hiburan'] ?? '-') ?></td>
            </tr>
        </table>

        <p>Demikian Surat Keterangan ini untuk menjadikan periksa guna seperlunya.</p>
    </div>

    <div class="ttd-container">
        <p style="margin-bottom: 0;">Kutasari, <?= tgl_indo(date('Y-m-d')) ?></p>
        <p style="margin-top: 0; margin-bottom: 0;">KEPALA DESA KUTASARI</p>
        
        <?php
            $ttdPath = FCPATH . 'assets/images/TTD_KADES.png';
            $ttdBase64 = '';
            if (file_exists($ttdPath)) {
                $ttdBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($ttdPath));
            }
        ?>
        <?php if($ttdBase64): ?>
            <img src="<?= $ttdBase64 ?>" alt="Tanda Tangan Kades" class="ttd-image" />
        <?php endif; ?>
        
        <div style="height: 100px;"></div>
        
        <p class="ttd-name">KUSNENDAR</p>
    </div>

    <div class="clear"></div>

</body>
</html>
