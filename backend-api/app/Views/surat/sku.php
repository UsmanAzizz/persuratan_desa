<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Keterangan Usaha</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 0;
            padding: 0.5cm 1cm;
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
            margin-left: 0;
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
        }
        .ttd-image {
            height: 80px;
            width: auto;
            margin: 0 auto;
            display: block;
        }
        .ttd-name {
            font-weight: bold;
            text-decoration: underline;
            margin-top: 0;
            position: relative;
            z-index: 10;
        }
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
            <td width="85%" style="text-align: center; padding-right: 15%;">
                <div style="font-weight: bold; font-size: 14pt; margin: 0;">PEMERINTAH KABUPATEN CILACAP</div>
                <div style="font-weight: bold; font-size: 14pt; margin: 0;">KECAMATAN CIPARI</div>
                <div style="font-weight: bold; font-size: 18pt; margin: 0;">DESA KUTASARI</div>
                <div style="font-size: 10pt; margin: 0;">Alamat : Jalan Ir. Soekarno Nomor 02 Kutasari <strong>CIPARI</strong> Kode Pos 53262</div>
            </td>
        </tr>
    </table>

    <div class="judul-surat">
        <h4>SURAT KETERANGAN USAHA</h4>
        <p>Nomor : <?= $id_pengajuan ?> / VII / <?= date('Y', strtotime($created_at)) ?></p>
    </div>

    <div class="konten">
        <p>Yang bertanda tangan di bawah ini Kepala Desa Kutasari, Kecamatan Cipari, Kabupaten Cilacap, Menerangkan bahwa :</p>
        
        <table class="table-data">
            <tr>
                <td width="150">Nama</td>
                <td>: <?= htmlspecialchars($warga['nama_lengkap']) ?></td>
            </tr>
            <tr>
                <td>Tempat tgl lahir</td>
                <td>: <?= htmlspecialchars($warga['tempat_lahir'] ?? '-') ?>, <?= tgl_indo($warga['tanggal_lahir'] ?? '1990-01-01') ?></td>
            </tr>
            <tr>
                <td>Pekerjaan</td>
                <td>: <?= htmlspecialchars($warga['pekerjaan'] ?? '-') ?></td>
            </tr>
            <tr>
                <td>Alamat</td>
                <td>: <?= htmlspecialchars($warga['alamat']) ?> RT <?= htmlspecialchars($warga['rt']) ?>/RW <?= htmlspecialchars($warga['rw']) ?></td>
            </tr>
            <tr>
                <td><br/>Keperluan</td>
                <td><br/>: <?= htmlspecialchars($data_input['keperluan'] ?? '-') ?></td>
            </tr>
        </table>

        <p>Orang tersebut diatas benar - benar Warga Desa kami yang mempunyai usaha :</p>
        <p style="font-weight: bold; text-align: center; font-size: 14pt;">
            <?= htmlspecialchars($data_input['nama_usaha'] ?? $data_input['data_usaha'] ?? '-') ?>
        </p>

        <p style="text-indent: 1cm; margin-top: 20px;">
            Demikian surat keterangan ini kami buat dalam keadaan sebenarnya dan kemudian kepada yang berkepentingan untuk menjadi periksa dan maklum adanya.
        </p>
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
        <?php else: ?>
            <div style="height: 100px;"></div>
        <?php endif; ?>
        
        <p class="ttd-name">KUSNENDAR</p>
    </div>

    <div class="clear"></div>

</body>
</html>
