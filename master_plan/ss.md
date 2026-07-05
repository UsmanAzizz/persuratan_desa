1.	Requirement 
Pada tahap ini dilakukan pengkajian terhadap kebutuhan sistem secara menyeluruh, meliputi kebutuhan perangkat lunak, perangkat keras, serta penentuan pihak-pihak yang akan menggunakan sistem. Proses ini bertujuan untuk memastikan bahwa sistem yang dikembangkan sesuai dengan kondisi dan kebutuhan yang ada. Berdasarkan data yang telah dikumpulkan sebelumnya, dapat ditentukan jenis sistem yang akan dirancang untuk mendukung dan mempermudah proses yang berjalan. Informasi tersebut kemudian dianalisis guna mengidentifikasi kebutuhan pengguna secara tepat sehingga sistem yang dibangun dapat berfungsi secara optimal. Adapun hasil yang diperoleh dari proses analisis kebutuhan tersebut adalah sebagai berikut:

a.	Kebutuhan Fungsional Sistem
Sistem yang akan dibangun ini dapat diakses oleh dua aktor yaitu warga dan petugas desa. Dalam analisis kebutuhan fungsional, sistem harus menyediakan proses utama berupa registrasi dan login pengguna, pengajuan surat oleh warga dengan memilih jenis surat yang tersedia, verifikasi berkas oleh petugas, pencetakan surat, serta notifikasi WhatsApp untuk memberitahukan status pengajuan kepada warga, termasuk pengelolaan data dan laporan surat oleh administrator.
Tabel 3. 6 Kebutuhan Fungsional
No	Level	Keterangan
1	Warga	Dapat melihat beranda
		Dapat mengajukan surat dengan memilih jenis surat dan mengisi data pengajuan.
		Dapat kode tracking setelah pengajuan berhasil dikirim.
		Dapat melacak status surat menggunakan kode tracking.
		Dapat mengunduh surat yang sudah selesai diproses.
2	Admin	Dapat login ke sistem
		Dapat mengakses dashboard admin
		Dapat melihat daftar, memverifikasi surat
		Dapat mengelola data warga 
		Dapat mengelola data jenis surat.
		Dapat melihat, memfilter, dan mencetak laporan
		Dapat memperbarui status surat.
		Dapat melakukan logout
	
b.	Kebutukan Non-Fungsional Sistem
Untuk memastikan sistem informasi layanan persuratan berbasis website dapat berjalan dengan optimal, diperlukan spesifikasi minimal pada perangkat meliputi perangkat keras dan perangkat lunak sebagai berikut:
1)	Analisis kebutuhan perangkat lunak (software) 
Untuk menjalankan Sistem Informasi adalah sebagai berikut:
a)	Sistem operasi Windows 11 
b)	Google Chrome sebagai web browser
2)	Analisis kebutuhan perangkat keras (hardware)
Untuk menjalankan   sistem adalah sebagai berikut:
a)	Prosesor Intel Core i3-1115G4 @ 3.00GHz
b)	Memory RAM 4 G
c)	Hard Disk minimal 100 GB
d)	Smartphone RAM 4 GB
2.	Design
Setelah dilakukan analisis kebutuhan, pada tahap ini pengembang melakukan perancangan tampilan sebagai gambaran antarmuka sistem informasi layanan persuratan yang akan dibangun. Perancangan yang dilakukan meliputi pemodelan data, pemodelan basis data, serta pemodelan antarmuka (mockup desain). Dibuatnya perancangan ini akan membantu menentukan kebutuhan perangkat keras dan perangkat lunak agar lebih spesifik.
a.	Perancangan Pemodelan Data (Desain Sistem)
Pemodelan data atau desain sistem adalah sebuah representasi dari cara kerja sistem yang akan dibuat. Di sini, akan dijelaskan bagaimana setiap bagian dalam sistem ini bekerja.
1) Use Case Diagram
Use case Diagram adalah gambar yang digunakan untuk menunjukkan bagaimana aktor dan sistem berinteraksi melalui berbagai fungsi yang dapat dilakukan oleh pengguna. Diagram ini menjelaskan siapa saja yang terlibat dalam sistem dan fitur ataupun layanan apa saja yang bisa digunakan dari perspektif pengguna. Use Case Diagram mengambarkan fungsionalitas yang diharapkan sebuah system. Yang ditekankan adalah “apa” yang diperbuat system, dan bukan “bagaimana”. Sebuah use case, mempersentasikan sebuah interaksi antara actor dengan system.  Use case merupakan sebuah pekerjaan tertentu, misalnya Login kesistem, meng-create sebuah daftar belanja dan sebagainya.
 
	Gambar 3. 3 Use Case Diagram	
Berdasarkan Gambar 3. 3 diagram Use Case, ada dua aktor utama yang berinteraksi dengan sistem, yaitu Warga dan Admin. Warga bisa melihat beranda, mengajukan surat, melihat kode pelacakan, mengecek status, dan mengunduh surat. Sementara itu, Admin memiliki tugas untuk masuk ke sistem, membuka dashboard, melihat daftar pengajuan, melakukan verifikasi dan mengelola data warga serta jenis surat, laporan,  memperbarui status surat, dan kemudian keluar dari sistem.
2)	Activity Diagram 
Activity Diagram digunakan untuk menunjukkan urutan kegiatan dalam sebuah sistem secara visual, sehingga proses kerja pengguna dan sistem dapat dimengerti dengan lebih mudah.
a)	Activity Diagram Login Admin
 
Gambar 3. 4 Activity Diagram Login Admin
Berdasarkan Gambar 3. 4 di atas menunjukkan pemodelan data untuk diagram aktivitas login pada bagian admin. Untuk melihat halaman dashboard, admin perlu memasukkan username dan password. Jika benar, sistem akan menampilkan halaman dashboard. Jika ada kesalahan, akan ada pemberitahuan dan Anda akan kembali ke formulir login.
b)	Activity Diagram Ajukan Surat
 
Gambar 3. 5 Activity Diagram Ajukan Surat
Berdasarkan Gambar 3. 5 Gambar di atas menunjukkan activity diagram ajukan surat oleh warga. Warga memilih jenis surat dan mengisi formulir, lalu menekan tombol submit. Sistem kemudian memeriksa kelengkapan data. Jika data tidak lengkap, sistem akan kembali menampilkan form. Jika data lengkap, sistem akan menyimpan data pengajuan dan menghasilkan kode tracking untuk warga.


c)	Activity Diagram Kelola Pengajuan
 
Gambar 3. 6 Activity Diagram Kelola Pengajuan
Berdasarkan Gambar 3. Gambar di atas menunjukkan activity diagram kelola pengajuan oleh admin. Admin memilih pengajuan, lalu sistem menampilkan detail dan berkas. Sistem kemudian memeriksa validitas berkas. Jika tidak valid, admin memberikan alasan penolakan, sistem mengupdate status menjadi "Ditolak" dan mengirim notifikasi ke warga. Jika valid, admin karna sudah diberi kuasa oleh kepala desa  melakukan TTD digital, sistem mengupdate status menjadi "Selesai" dan mengirim notifikasi ke warga. 
d)	Activity Diagram Laporan Admin
 
Gambar 3. 7 Activity Laporan Admin
Berdasarkan Gambar 3. 7 menampilkan diagram aktivitas laporan yang dibuat oleh admin. Admin membuka halaman laporan, lalu sistem menunjukkan halaman laporan tersebut. Admin memilih waktu laporan yang diinginkan, kemudian mengklik tombol filter. Sistem kemudian menunjukkan laporan berdasarkan periode yang telah dipilih. Setelah itu, admin menekan tombol cetak, dan sistem akan mengeluarkan laporan dalam format PDF. 

e)	Activity Diagram Logout
 
Gambar 3. 8 Activity Diagram Logout
Berdasarkan Gambar 3. 8 menunjukkan diagram aktivitas untuk proses logout yang dilakukan oleh admin. Admin menekan tombol logout, lalu sistem memproses logout dengan menghapus sesi admin. Setelah itu, sistem membawa admin ke halaman masuk. Halaman login tampil, dan proses selesai.
3)	Sequence Diagram
Sequence diagram adalah sebuah diagram yang digunakan untuk menjelaskan dan menampilkan interaksi antar objek-objek dalam sebuah sistem secara terperinci. Selain itu sequence diagaram juga akan menampilkan pesan atau perintah yang dikirim, beserta waktu pelaksanaannya. Objek-objek yang berhubungan dengan berjalannya proses operasi biasanya diurutkan dari kiri ke kanan.
a)	Sequence Diagram Login
 
Gambar 3. 9 Sequence Diagram Login
Berdasarkan gambar 3. 9 Admin masuk ke sistem menggunakan username dan password. Admin terlebih dahulu membuka halaman login, kemudian memasukkan data akun ke dalam form yang tersedia. Setelah itu, sistem mengirimkan data tersebut ke database untuk dilakukan proses validasi. Jika username dan password sesuai, sistem akan memberikan akses masuk dan menampilkan halaman dashboard admin. Sebaliknya, jika data tidak sesuai, sistem akan menampilkan pesan bahwa login eror sehingga admin harus memasukkan kembali data yang benar.

b)	Sequence Diagram Ajukan Surat
 
Gambar 3. 10 Sequence Diagram Ajukan Surat
Berdasarkan gambar 3. 10 warga memilih jenis surat yang ingin diajukan, lalu mengisi formulir pengajuan sesuai kebutuhan surat tersebut. Setelah itu, warga mengunggah berkas pendukung lalu sistem memvalidasi data yang diinput, menyimpan pengajuan ke database, dan membuat kode tracking sebagai identitas pengajuan. Setelah pengajuan berhasil tersimpan, sistem menampilkan informasi bahwa permohonan telah diterima dan status awal pengajuan dapat dilihat oleh pemohon.

c)	Sequence Diagram Kelola Pengajuan
 
Gambar 3. 11 Sequence Diagram Kelola Pengajuan
Berdasarkan gambar 3. 11 Admin membuka menu daftar pengajuan, kemudian sistem menampilkan seluruh permohonan yang masuk. Setelah itu, admin memilih salah satu pengajuan untuk melihat detail data dan berkas yang telah diunggah. Admin melakukan pemeriksaan kelengkapan dan kesesuaian data, lalu menentukan status pengajuan apakah diproses, disetujui, atau ditolak. Jika pengajuan dinyatakan valid, sistem menyimpan perubahan status dan memperbarui informasi pada data pengajuan. Sistem juga dapat mengirimkan notifikasi kepada pemohon agar warga mengetahui perkembangan surat yang diajukan.


d)	Sequence Diagram Laporan Admin
 
Gambar 3. 12 Sequence Diagram Laporan Admin
Berdasarkan gambar 3. 12 Admin membuka menu laporan pada sistem, kemudian memilih periode data yang ingin ditampilkan, misalnya berdasarkan tanggal tertentu atau seluruh pengajuan. Sistem mengambil data dari database dan menampilkan rekap pengajuan surat dalam bentuk daftar atau ringkasan. Admin dapat melihat jumlah surat yang masuk, status masing-masing pengajuan, dan jenis surat yang telah diproses. Jika diperlukan, admin juga dapat mencetak atau menyimpan laporan tersebut sebagai arsip dan dokumentasi pelayanan.


4)	Class Diagram
 
Gambar 3. 13 Class Diagram
Gambar 3. 13 di atas menunjukkan class diagram sistem informasi pengajuan surat. Diagram ini menggambarkan struktur kelas yang terdapat dalam sistem beserta atribut dan hubungan antar kelas. Kelas utama dalam sistem meliputi Warga, Admin, Pengajuan, dan Jenis Surat. Warga bertugas mengajukan permohonan surat melalui sistem, sedangkan Admin berperan mengelola data pengajuan yang masuk serta memproses status pengajuan. Data pengajuan terhubung dengan warga yang mengajukan dan jenis surat yang dipilih, sehingga setiap permohonan dapat dicatat sesuai kategori surat yang tersedia. Jenis surat pada sistem ini terdiri dari delapan jenis surat yang dapat diajukan oleh warga. Dengan adanya class diagram ini, alur data dan hubungan antar entitas dalam sistem menjadi lebih jelas dan mudah dipahami.
b.	Rancangan Database          
Dalam membuat Sistem Informasi Layanan Persuratan Desa Kutasari, yang digunakan adalah database berbasis MySQL. Database ini digunakan untuk menyimpan semua data terkait proses pengajuan surat oleh warga, memvalidasi NIK warga, mengelola jenis surat dan template surat, melakukan verifikasi pengajuan oleh admin, serta mencatat notifikasi WhatsApp yang dikirimkan kepada warga. Struktur database yang digunakan dalam sistem ini dapat dilihat pada tabel-tabel berikut.
1)	Tabel Data Admin
Tabel 3. 7  Admin
No	Nama Field	Tipe Data	Jumlah	Keterangan
1	id_admin	int	11	Primary Key
2	nama_admin	varchar	100	Not Null
3	Username	varchar	50	Not Null
4	Password	varchar	255	Not Null

Berdasarkan Tabel 3.7 admin digunakan untuk menyimpan data administrator yang bertugas mengelola sistem dalam layanan persuratan. id_admin berfungsi sebagai primary key yang menjadi identitas unik setiap admin. nama_admin berisi nama lengkap admin yang terdaftar. username dan password digunakan dalam proses login admin untuk mengakses dashboard dan mengelola data.
2)	Tabel Warga
Tabel 3. 8 Tabel Warga
No	Nama Field	Tipe Data	Panjang	Keterangan
1	id_warga	Int	11	Primary Key
2	Nik	Varchar	20	Not Null
3	nama_warga	Varchar	100	Not Null
4	no_hp	Varchar	20	Not Null
5	Alamat	Teks	-	Not Null

Berdasarkan Tabel 3. 8 Tabel warga digunakan untuk menyimpan data penduduk Desa Kutasari.  Id_warga sebagai primary key. NIK  berisi Nomor Induk Kependudukan untuk validasi saat warga mengajukan surat.  nama_warga, No_hp, dan alamat menyimpan data diri warga.
3)	Tabel Pengajuan
                                          Tabel 3. 9 Tabel Pengajuan
No	Nama Field	Tipe Data	Panjang	Keterangan
1	id_pengajuan	Int	11	Primary Key
2	Status_pengajuan	Enum	-	Default 'menunggu'
3	Tgl_pengajuan	Datetime	-	Not Null
4	Kode_tracking	Varchar	20	Not Null
5	Id_warga	Int	11	Foreign Key
6	Jenis_surat	Varchar	50	Not Null
7	Isi_notif	Text	-	Null
8	Status_notif	Enum	-	Default 'belum_terkirim'
9	Tgl_notif	Datetime	-	Null

Berdasarkan Tabel 3. 9 Tabel pengajuan digunakan untuk menyimpan data permohonan surat yang diajukan oleh warga. Id_pengajuan sebagai primary key. status_pengajuan berisi status permohonan (menunggu, diproses, selesai, ditolak). Tgl pengajuan mencatat tanggal pengajuan. kode_tracking berisi kode unik untuk melacak status surat. id_warga sebagai foreign key penghubung ke data warga. jenis_surat berisi jenis surat yang diajukan. isi_notif, status_notif, dan tgl_notif mencatat pengiriman notifikasi WhatsApp ke warga.
4)	Tabel Data SKCK 
No	Nama Field	Tipe Data	Panjang	Keterangan
1	id_surat	Int	11	Primary Key
2	Nomor_surat	Varchar	20	Not Null
3	Tgl_surat	Date	100	Not Null
4	Ttd_Digital	Varchar	255	Not Null
5	Status_Ttd	Enum	-	Not Null
6	Surat_pengantar_RT	Varchar	200	Not Null
7	Fc_KTP	Varchar	200	Not Null
8	Fc_KK	Varchar	200	Not Null
Tabel 3. 10 Tabel Data SKCK


Berdasarkan Tabel 3. 10 Tabel ini digunakan untuk menyimpan data spesifik pengajuan surat dengan persyaratan standar. id_surat berfungsi sebagai primary key. nomor_surat berisi nomor urut surat yang diterbitkan. tgl_surat mencatat tanggal pembuatan surat. ttd_digital menyimpan file tanda tangan digital Kepala Desa. status_ttd menunjukkan status tanda tangan digital. surat_pengantar_RT, Foto Copy KTP, dan Foto Copy Kartu keluarga, menyimpan file berkas persyaratan yang diunggah pemohon. 
5)	Tabel Data SKTM
Tabel 3. 11 Tabel Data SKTM
No	Nama Field	Tipe Data	Panjang	Keterangan
1	id_surat	Int	11	Primary Key
2	Nomor_surat	Varchar	20	Not Null
3	Tgl_surat	Date	100	Not Null
4	Ttd_Digital	Varchar	255	Not Null
5	Status_Ttd	Enum	-	Not Null
6	Surat_pengantar_RT	varchar	200	Not Null
7	Fc_KTP	varchar	200	Not Null
8	Fc_KK	varchar	200	Not Null

Berdasarkan Tabel 3. 11 Tabel ini digunakan untuk menyimpan data spesifik pengajuan surat dengan persyaratan standar. id_surat berfungsi sebagai primary key. nomor_surat berisi nomor urut surat yang diterbitkan. tgl_surat mencatat tanggal pembuatan surat. ttd_digital menyimpan file tanda tangan digital Kepala Desa. status_ttd menunjukkan status tanda tangan digital. surat_pengantar_RT, Foto Copy KTP, dan Foto Copy Kartu keluarga, menyimpan file berkas persyaratan yang diunggah pemohon. 
6)	Tabel Data Domisili 
Tabel 3. 12 Tabel Data Domisili
No	Nama Field	Tipe Data	Panjang	Keterangan
1	id_surat	int	11	Primary Key
2	Nomor_surat	varchar	20	Not Null
3	Tgl_surat	Date	100	Not Null
4	Ttd_Digital	varchar	255	Not Null
5	Status_Ttd	Enum	-	Not Null
6	Surat_pengantar_RT	varchar	200	Not Null
7	Fc_KTP	varchar	200	Not Null
8	Fc_KK	varchar	200	Not Null

Berdasarkan Tabel 3. 12 Tabel ini digunakan untuk menyimpan data spesifik pengajuan surat dengan persyaratan standar. id_surat berfungsi sebagai primary key. nomor_surat berisi nomor urut surat yang diterbitkan. tgl_surat mencatat tanggal pembuatan surat. ttd_digital menyimpan file tanda tangan digital Kepala Desa. status_ttd menunjukkan status tanda tangan digital. surat_pengantar_RT, Foto Copy KTP, dan Foto Copy Kartu keluarga, menyimpan file berkas persyaratan yang diunggah pemohon. 
7)	Tabel Data Surat Pengantar Nikah
Tabel 3. 13 Tabel Data Surat Pengantar Nikah
No	Nama Field	Tipe Data	Panjang	Keterangan
1	id_surat	int	11	Primary Key
2	Nomor_surat	varchar	20	Not Null
3	Tgl_surat	Date	100	Not Null
4	Ttd_Digital	varchar	255	Not Null
5	Status_Ttd	Enum	-	Not Null
6	Surat_pengantar_RT	varchar	200	Not Null
7	Fc_KTP	varchar	200	Not Null
8	Fc_KK	varchar	200	Not Null

Berdasarkan Tabel 3. 13 Tabel ini digunakan untuk menyimpan data spesifik pengajuan surat dengan persyaratan standar. id_surat berfungsi sebagai primary key. nomor_surat berisi nomor urut surat yang diterbitkan. tgl_surat mencatat tanggal pembuatan surat. ttd_digital menyimpan file tanda tangan digital Kepala Desa. status_ttd menunjukkan status tanda tangan digital. surat_pengantar_RT, Foto Copy KTP, dan Foto Copy Kartu keluarga, menyimpan file berkas persyaratan yang diunggah pemohon. 


8)	Tabel Data Surat Keterangan Pindah
Tabel 3. 14 Tabel Data Surat Keterangan Pindah
No	Nama Field	Tipe Data	Panjang	Keterangan
1	id_surat	Int	11	Primary Key
2	Nomor_surat	Varchar	20	Not Null
3	Tgl_surat	Date	100	Not Null
4	Ttd_Digital	Varchar	255	Not Null
5	Status_Ttd	Enum	-	Not Null
6	Surat_pengantar_RT	Varchar	200	Not Null
7	Fc_KTP	Varchar	200	Not Null
8	Fc_KK	Varchar	200	Not Null

Berdasarkan Tabel 3. 14 Tabel ini digunakan untuk menyimpan data spesifik pengajuan surat . id_surat berfungsi sebagai primary key. nomor_surat berisi nomor urut surat yang diterbitkan. tgl_surat mencatat tanggal pembuatan surat. Ttd_digital menyimpan file tanda tangan digital Kepala Desa.  status_ttd menunjukkan status tanda tangan digital. surat_pengantar_RT, Foto Copy KTP, dan Foto Copy Kartu keluarga, menyimpan file berkas persyaratan yang diunggah warga.
9)	Tabel Data Surat keterangan Izin Keramaian
Tabel 3. 15 Tabel Data Surat keterangan Izin Keramaian
No	Nama Field	Tipe Data	Panjang	Keterangan
1	id_surat	Int	11	Primary Key
2	Nomor_surat	Varchar	20	Not Null
3	Tgl_surat	Date	100	Not Null
4	Ttd_Digital	varchar	255	Not Null
5	Status_Ttd	Enum	-	Not Null
6	Surat_pengantar_
RT	varchar	200	Not Null
7	Fc_KTP	varchar	200	Not Null
8	Fc_KK	varchar	200	Not Null

Berdasarkan Tabel 3. 15 Tabel ini digunakan untuk menyimpan data spesifik pengajuan surat dengan persyaratan standar. id_surat berfungsi sebagai primary key. nomor_surat berisi nomor urut surat yang diterbitkan. tgl_surat mencatat tanggal pembuatan surat. ttd_digital menyimpan file tanda tangan digital Kepala Desa. status_ttd menunjukkan status tanda tangan digital. surat_pengantar_RT, Foto Copy KTP, dan Foto Copy Kartu keluarga, menyimpan file berkas persyaratan yang diunggah warga.
10)	Tabel Data SKU
Tabel 3. 16 Tabel SKU
No	Nama Field	Tipe Data	Panjang	Keterangan
1	id_surat	Int	11	Primary Key
2	Nomor_surat	varchar	20	Not Null
3	Tgl_surat	Date	100	Not Null
4	Ttd_Digital	varchar	255	Not Null
5	Status_Ttd	Enum	-	Not Null
6	Surat_pengantar_RT	varchar	200	Not Null
7	Fc_KTP	varchar	200	Not Null
8	Fc_KK	varchar	200	Not Null
9	Data_usaha	Teks	-	Not Null

Berdasarkan Tabel 3. 16 Tabel ini digunakan untuk menyimpan data pengajuan Surat Keterangan Usaha (SKU) yang memiliki persyaratan tambahan. id_surat berfungsi sebagai primary key. nomor_surat, tgl_surat, ttd_digital, dan status_ttd mencatat informasi administrasi surat. surat_pengantar_RT, Foto Copy KTP, dan Foto Copy Kartu keluarga, menyimpan berkas standar, sedangkan data_usaha menyimpan informasi tentang usaha yang dijalankan pemohon.
11)	Tabel Data Ahli Waris
Tabel 3. 17 Tabel Data Ahli Waris
No	Nama Field	Tipe Data	Panjang	Keterangan
1	id_surat	int	11	Primary Key
2	Nomor_surat	varchar	20	Not Null
3	Tgl_surat	Date	100	Not Null
4	Ttd_Digital	varchar	255	Not Null
5	Status_Ttd	Enum	-	Not Null
6	Surat_pengantar_RT	varchar	200	Not Null
7	Fc_KTP_Ahli_waris	varchar	200	Not Null
8	Fc_KK Ahli_waris	varchar	200	Not Null

Berdasarkan Tabel 3. 17 Tabel Ahli Waris digunakan untuk menyimpan data pengajuan surat keterangan Ahli waris. Id_surat sebagai primary key,nomor_surat, tgl_surat. Ttd_digital dan status_ttd mencatat informasi administrasi surat. surat_pengantar_RT menyimpan surat pengantar_RT, Fc_Ahli_waris dan Fc_kk_ahli_waris menyimpan file KTP dan KK para ahli waris.
c.	Rancangan Pemodelan Desain Interface
1)	Rancangan Desain Antarmuka Pada Halaman “Beranda”
 
Gambar 3. 14 Halaman “Beranda”
	Gambar 3. 14 di atas menunjukkan rancangan antarmuka halaman beranda pada Sistem Informasi Layanan Persuratan Desa Kutasari. Halaman ini menampilkan menu navigasi seperti Beranda, Ajukan Surat, dan Cek Status. Terdapat juga informasi Profil Desa, Layanan Surat, dan Kontak Kantor yang memudahkan warga untuk mengetahui informasi desa sebelum melakukan pengajuan surat.
2)	Rancangan Desain Antarmuka Pada Halaman “Ajukan Surat”
 
Gambar 3. 15 Halaman “Ajukan Surat”
Gambar 3. 15 di atas menunjukkan rancangan antarmuka halaman ajukan surat pada Sistem Informasi Layanan Persuratan Desa Kutasari. Halaman ini menampilkan formulir pengajuan yang terdiri dari Jenis Surat (dropdown), NIK, Nama Lengkap, Alamat, No. HP, serta upload Berkas Pendukung. Terdapat tombol Submit yang memudahkan warga untuk langsung mengirimkan permohonan surat secara online.
3)	Rancangan Desain Antarmuka Pada Halaman “Login Admin”
 
Gambar 3. 16 Halaman “Login Admin”
Gambar 3. 16 di atas menunjukkan rancangan antarmuka Halaman Login Admin. Halaman ini menampilkan judul “Login admin” serta dua field input yaitu Username dan Password. Di bagian bawah terdapat tombol Login untuk mengirimkan data login ke sistem. Halaman ini berfungsi sebagai pintu masuk bagi admin sebelum dapat mengakses dashboard dan mengelola sistem.
4)	Rancangan Desain Antarmuka Pada Halaman “Dashboard Admin”
 
Gambar 3. 17 Halaman “Dashboard Admin”
Gambar 3. 17 di atas menunjukkan rancangan antarmuka Halaman Dashboard Admin. Pada sisi kiri terdapat sidebar menu yang berisi navigasi ke halaman Dashboard, Kelola Pengajuan, Kelola Data Warga, Jenis Surat, dan Laporan. Di bagian tengah halaman terdapat empat kartu statistik yaitu Total, Disetujui, Diproses, dan Ditolak yang menampilkan ringkasan data pengajuan surat. Di bawah kartu statistik terdapat tabel Pengajuan Terbaru yang menampilkan data pengajuan terbaru dengan kolom No, Kode Tracking, Nama, Status, Tanggal, dan Aksi. Halaman ini berfungsi sebagai pusat kendali admin untuk memantau seluruh aktivitas layanan persuratan.
5)	Rancangan Desain Antarmuka Pada Halaman “Kelola Pengajuan”
 
Gambar 3. 18 Halaman “Kelola Pengajuan”
Gambar 3. 18 Gambar di atas menunjukkan halaman kelola pengajuan dengan sidebar menu (Dashboard, Kelola Pengajuan, Kelola Data Warga, Jenis Surat, Laporan), filter status, kolom pencarian, dan tabel daftar pengajuan. Pada kolom Aksi terdapat tombol Detail untuk melihat detail pengajuan dan Proses untuk verifikasi serta pembuatan surat otomatis oleh 
6)	Sistem Rancangan Desain Antarmuka Pada Halaman “Laporan”
 
Gambar 3. 19 Halaman “Laporan”
Gambar 3. 19 menunjukkan rancangan antarmuka halaman laporan pada Sistem Informasi Layanan Persuratan Desa Kutasari. Halaman ini menampilkan menu navigasi di sisi kiri seperti Dashboard, Kelola Pengajuan, Kelola Data Warga, Jenis Surat, dan Laporan. Terdapat juga filter periode berupa dua input tanggal "s/d" dan tombol Tampilkan yang memudahkan admin untuk menampilkan laporan sesuai periode yang dipilih. Selain itu, terdapat tabel laporan yang menampilkan data per jenis surat (Total, Disetujui, Ditolak) serta tombol Cetak Laporan.
3.	Implementation
Tahap implementasi adalah tahap di mana dilakukan pengkodean atau pembuatan program, yang dilaksanakan setelah proses merancang sistem sudah selesai. Pada tahap ini, rancangan yang sudah dibuat diubah menjadi program nyata dengan menggunakan framework CodeIgniter sebagai bagian belakang, MySQL sebagai penyimpanan data, serta HTML, CSS, dan Bootstrap untuk tampilan antarmuka pengguna. Proses penerapan mencakup pembuatan modul login untuk admin, halaman utama bagi warga, form untuk mengajukan surat, fitur untuk memeriksa status dengan kode pelacakan, pengelolaan pengajuan oleh admin, pembuatan surat menggunakan template, serta pembuatan laporan. Setiap modul dibuat sendiri-sendiri lalu digabungkan menjadi satu sistem yang utuh.
4.	Verification
Testing merupakan tahap keempat dalam metode waterfall yang bertujuan untuk memastikan sistem berjalan sesuai kebutuhan. Pada tahap ini, seluruh fungsi yang telah diimplementasikan diuji menggunakan metode black box testing. Pengujian dilakukan untuk mengetahui apakah fitur login, registrasi, pengajuan surat, pengelolaan pengajuan, dan laporan dapat berjalan dengan baik. Jika ditemukan kesalahan maka dilakukan perbaikan, sedangkan jika seluruh fungsi berjalan sesuai harapan maka sistem dinyatakan layak digunakan.
Tabel 3. 18 Black Box Testing
Modul Yang Diuji	Prosedur Pengujian	Hasil Yang Diharapkan	Hasil Pengujian
Login Admin	Masukkan username dan password yang benar, lalu klik login	Berhasil masuk ke dashboard admin	o	Berhasil
o	Tidak Berhasil
Ajukan Surat	Pilih jenis surat, isi data, upload berkas jika diperlukan, lalu klik ajukan	Data pengajuan tersimpan dan kode tracking muncul	o	Berhasil
o	Tidak Berhasil
Kelola Pengajuan	Admin membuka daftar pengajuan lalu memilih salah satu data untuk diverifikasi	Data pengajuan tampil dan status dapat diperbarui	o	Berhasil
o	Tidak Berhasil
Verifikasi Pengajuan	Admin mengubah status pengajuan menjadi diterima atau ditolak	Status pengajuan berhasil tersimpan	o	Berhasil
o	Tidak Berhasil
Cetak Surat	Admin membuka data pengajuan yang sudah disetujui lalu klik cetak	Surat berhasil ditampilkan / dicetak	o	Berhasil / Tidak Berhasil
Laporan	Admin membuka menu laporan	Data laporan tampil sesuai periode yang dipilih	o	Berhasil 
o	Tidak Berhasil
Logout Admin	Klik tombol logout	Keluar dari sistem dan kembali ke halaman login	o	Berhasil
o	Tidak Berhasil
