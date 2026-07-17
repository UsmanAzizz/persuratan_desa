<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Keterangan Ahli Waris</title>
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
            margin-bottom: 30px;
        }
        .table-data {
            width: 100%;
            margin-left: 20px;
            margin-bottom: 15px;
        }
        .table-data td {
            vertical-align: top;
            padding: 2px 0;
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
        <h4>SURAT KETERANGAN AHLI WARIS</h4>
        <p>Nomor : <?= $id_pengajuan ?> / SKW / <?= date('Y', strtotime($created_at)) ?></p>
    </div>

    <div class="konten">
        <p>Yang bertanda tangan di bawah ini Kepala Desa Kutasari, Kecamatan Cipari, Kabupaten Cilacap, menerangkan dengan sebenarnya bahwa :</p>
        
        <table class="table-data">
            <tr>
                <td width="20">1</td>
                <td width="150">Nama Lengkap</td>
                <td>: <?= htmlspecialchars($warga['nama_lengkap']) ?></td>
            </tr>
            <tr>
                <td>2</td>
                <td>Tempat Tgl lahir</td>
                <td>: <?= htmlspecialchars($warga['tempat_lahir'] ?? '-') ?>, <?= tgl_indo($warga['tanggal_lahir'] ?? '1990-01-01') ?></td>
            </tr>
            <tr>
                <td>3</td>
                <td>NIK</td>
                <td>: <?= htmlspecialchars($warga['nik']) ?></td>
            </tr>
            <tr>
                <td>4</td>
                <td>Pekerjaan</td>
                <td>: <?= htmlspecialchars($warga['pekerjaan'] ?? '-') ?></td>
            </tr>
            <tr>
                <td>5</td>
                <td>Alamat tempat tinggal</td>
                <td>: <?= htmlspecialchars($warga['alamat']) ?></td>
            </tr>
        </table>

        <p>Nama tersebut di atas adalah benar-benar Ahli Waris dari :</p>

        <table class="table-data">
            <tr>
                <td width="170">Nama Pewaris (Almarhum)</td>
                <td>: <strong><?= htmlspecialchars($data_input['nama_pewaris'] ?? '-') ?></strong></td>
            </tr>
            <tr>
                <td>Nama Pasangan</td>
                <td>: <?= htmlspecialchars($data_input['nama_pasangan'] ?? '-') ?></td>
            </tr>
        </table>
        
        <p>Demikian Surat Keterangan Ahli Waris ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.</p>
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
