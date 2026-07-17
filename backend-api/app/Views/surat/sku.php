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
            padding: 2cm 2cm;
        }
        .kop-surat {
            text-align: center;
            border-bottom: 3px double black;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .kop-surat h3, .kop-surat h2 {
            margin: 0;
            font-weight: bold;
        }
        .kop-surat p {
            margin: 0;
            font-size: 11pt;
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
        }
        .ttd-image {
            height: 100px;
            width: auto;
            position: absolute;
            left: 75px;
            top: -10px;
            z-index: -1;
        }
        .ttd-name {
            font-weight: bold;
            text-decoration: underline;
            margin-top: 0;
        }
        .clear {
            clear: both;
        }
    </style>
</head>
<body>

    <div class="kop-surat">
        <h3>PEMERINTAH KABUPATEN CILACAP</h3>
        <h3>KECAMATAN CIPARI</h3>
        <h2>DESA KUTASARI</h2>
        <p>Alamat : Jln Ir Soekarno No 02 Kutasari</p>
    </div>

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
                <td>: <?= htmlspecialchars($warga['tempat_lahir'] ?? '-') ?>, <?= date('d-m-Y', strtotime($warga['tanggal_lahir'] ?? '1990-01-01')) ?></td>
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
        <p style="margin-bottom: 0;">Kutasari, <?= date('d-m-Y') ?></p>
        <p style="margin-top: 0; margin-bottom: 0;">KEPALA DESA KUTASARI</p>
        
        <?php
            $ttdPath = FCPATH . 'assets/images/TTD_KADES.png';
            $ttdBase64 = '';
            if (file_exists($ttdPath)) {
                $ttdBase64 = 'data:image/png;base64,' . base64_encode(file_get_contents($ttdPath));
            }
        ?>
        <div style="height: 70px; position: relative;">
            <?php if($ttdBase64): ?>
                <img src="<?= $ttdBase64 ?>" alt="Tanda Tangan Kades" class="ttd-image" />
            <?php endif; ?>
        </div>
        
        <p class="ttd-name">KUSNENDAR</p>
    </div>

    <div class="clear"></div>

</body>
</html>
