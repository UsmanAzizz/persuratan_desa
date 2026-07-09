import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FileText, MapPin, Mail, Phone, ChevronRight, Sparkles, Building2, FileBadge, FileCheck, X, CheckCircle2, Store, Users, Car, Volume2, UserPlus, Stamp, PenTool, MailPlus, ScrollText, CheckCircle } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const Home = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { 
      title: 'Surat Keterangan Catatan Kepolisian (SKCK)', 
      desc: 'Surat pengantar untuk pembuatan SKCK di kepolisian.', 
      icon: <FileBadge />,
      reqs: [
        'Surat Pengantar RT/RW',
        'Fotokopi KTP',
        'Fotokopi Kartu Keluarga (KK)'
      ]
    },
    { 
      title: 'Surat Keterangan Tidak Mampu (SKTM)', 
      desc: 'Pengajuan dokumen keringanan biaya pendidikan atau kesehatan.', 
      icon: <FileText />,
      reqs: [
        'Surat Pengantar RT/RW',
        'Fotokopi KTP',
        'Fotokopi Kartu Keluarga (KK)'
      ]
    },
    { 
      title: 'Surat Keterangan Domisili', 
      desc: 'Dokumen yang menyatakan kedudukan dan tempat tinggal.', 
      icon: <MapPin />,
      reqs: [
        'Surat Pengantar RT/RW',
        'Fotokopi KTP',
        'Fotokopi Kartu Keluarga (KK)'
      ]
    },
    { 
      title: 'Surat Keterangan Usaha (SKU)', 
      desc: 'Pengajuan legalitas untuk izin usaha mikro warga.', 
      icon: <Store />,
      reqs: [
        'Surat Pengantar RT/RW',
        'Fotokopi KTP',
        'Fotokopi Kartu Keluarga (KK)',
        'Data atau keterangan mengenai usaha yang dijalankan'
      ]
    },
    { 
      title: 'Surat Keterangan Ahli Waris', 
      desc: 'Keterangan resmi pembagian hak waris keluarga.', 
      icon: <Users />,
      reqs: [
        'Surat Pengantar RT/RW',
        'Fotokopi Kartu Keluarga (KK)',
        'Fotokopi KTP Ahli Waris',
        'Fotokopi KTP Pemohon'
      ]
    },
    { 
      title: 'Surat Pindah', 
      desc: 'Surat pengantar mutasi atau pindah domisili.', 
      icon: <Car />,
      reqs: [
        'Surat Pengantar RT/RW',
        'Fotokopi KTP',
        'Fotokopi Kartu Keluarga (KK)'
      ]
    },
    { 
      title: 'Surat Izin Keramaian', 
      desc: 'Rekomendasi izin penyelenggaraan acara/keramaian.', 
      icon: <Volume2 />,
      reqs: [
        'Surat Pengantar RT/RW',
        'Fotokopi KTP',
        'Fotokopi Kartu Keluarga (KK)'
      ]
    },
    { 
      title: 'Surat Pengantar Nikah', 
      desc: 'Persyaratan administratif untuk melangsungkan pernikahan.', 
      icon: <UserPlus />,
      reqs: [
        'Surat Pengantar RT/RW',
        'Fotokopi KTP',
        'Fotokopi Kartu Keluarga (KK)'
      ]
    }
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* Hero Section - Bright Theme with Right Side Ornaments */}
      <section className="relative bg-white overflow-hidden border-b border-slate-200 flex items-center">
        {/* Top Left Improved Layered Ornaments */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: 45 }} 
          animate={{ opacity: 1, scale: 1, rotate: 45 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute -top-32 -left-32 w-96 h-28 bg-blue-600 rounded-full"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: 45 }} 
          animate={{ opacity: 0.2, scale: 1, rotate: 45 }} 
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="absolute -top-8 -left-24 w-64 h-12 border-[3px] border-slate-900 rounded-full"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0 }} 
          animate={{ opacity: 0.9, scale: 1 }} 
          transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
          className="absolute top-12 left-10 w-4 h-4 bg-yellow-400 rounded-full"
        />
        
        {/* Massive Right Side Ornaments */}
        <motion.div 
          initial={{ opacity: 0, x: 150, rotate: 45 }} 
          animate={{ opacity: 1, x: 0, rotate: 45 }} 
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute -bottom-48 -right-32 w-96 h-[800px] bg-slate-900 rounded-full"
        />
        <motion.div 
          initial={{ opacity: 0, x: 150, rotate: 45 }} 
          animate={{ opacity: 1, x: 0, rotate: 45 }} 
          transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
          className="absolute -top-32 -right-20 w-80 h-[800px] bg-blue-600 rounded-full"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 45, y: "-50%" }} 
          animate={{ opacity: 1, scale: 1, rotate: 45, y: "-50%" }} 
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="absolute top-1/2 right-32 w-48 h-[400px] bg-blue-200/50 rounded-full"
        />

        {/* Dot Matrix Pattern - Top (Empty Area) */}
        <div className="absolute top-24 right-[20%] lg:right-[25%] opacity-30 pointer-events-none hidden md:block">
          <svg width="120" height="120" fill="none" viewBox="0 0 120 120">
            <pattern id="dots-top" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle fill="#64748b" cx="3" cy="3" r="3"></circle>
            </pattern>
            <rect x="0" y="0" width="120" height="120" fill="url(#dots-top)"></rect>
          </svg>
        </div>
        
        {/* Dot Matrix Pattern - Bottom (Empty Area) */}
        <div className="absolute bottom-24 left-[45%] lg:left-[50%] opacity-30 pointer-events-none hidden md:block">
          <svg width="160" height="96" fill="none" viewBox="0 0 160 96">
            <pattern id="dots-bottom" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle fill="#3b82f6" cx="3" cy="3" r="3"></circle>
            </pattern>
            <rect x="0" y="0" width="160" height="96" fill="url(#dots-bottom)"></rect>
          </svg>
        </div>
        
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          {/* Text Content */}
          <div className="max-w-4xl flex flex-col">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight">
                <span className="text-slate-900 block mb-2">Sistem Informasi Layanan</span>
                <span className="block">
                  <span className="text-slate-900">Persuratan </span>
                  <span className="text-blue-600">Desa Kutasari</span>
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-lg text-slate-700 leading-relaxed max-w-xl font-medium"
            >
              Ajukan surat pengantar dan administrasi kependudukan Anda dengan lebih cepat, transparan, dan efisien. Pelayanan prima untuk seluruh warga Kutasari.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Link to="/ajukan" className="block w-full sm:w-auto">
                <motion.button 
                  animate={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  whileFocus={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-2xl px-8 py-4 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-base transition-colors cursor-pointer"
                >
                  Buat Pengajuan Baru
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/track">
                <button className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-2xl px-8 py-4 shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-transform active:scale-95 text-base cursor-pointer">
                  Cek Status Surat
                </button>
              </Link>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Profil Desa Section - Chubby & Clean */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-8 items-center bg-white border-[3px] border-slate-100 p-10 sm:p-14 rounded-[2.5rem] shadow-xl">
          <div className="flex-1 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Profil Desa</h2>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed text-justify pt-2 font-medium">
              Desa Kutasari merupakan salah satu desa yang berada di Kecamatan Cipari, Kabupaten Cilacap, Provinsi Jawa Tengah. Desa ini memiliki luas wilayah sekitar 1.053,574 hektar dengan jumlah penduduk sekitar 6.610 jiwa. Secara administratif, Desa Kutasari terbagi menjadi empat dusun, yaitu: Dusun Tawangsari, Dusun Grugak, Dusun Kotabaru, dan Dusun Curug. Pemerintah Desa Kutasari berkomitmen memberikan pelayanan administrasi yang cepat, mudah, dan transparan kepada seluruh masyarakat melalui berbagai layanan surat menyurat yang dapat diakses sesuai dengan persyaratan yang telah ditetapkan.
            </p>
          </div>
          
          <div className="flex-1 w-full flex justify-center py-4">
            <img 
              src="/logo_Cilacap.png" 
              alt="Logo Kabupaten Cilacap" 
              className="w-full max-w-[220px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* Layanan Surat Section - Chubby Cards */}
      <section className="space-y-12 bg-slate-50 py-20 px-4 border-y-2 border-slate-100">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Layanan Administrasi</h2>
          <p className="text-slate-600 text-lg font-medium">Daftar layanan dokumen kependudukan dan perizinan yang tersedia untuk warga.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {services.map((item, idx) => (
            <Card key={idx} className="border-[3px] border-slate-100 bg-white rounded-[2rem] shadow-sm hover:border-blue-600 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
              <CardBody className="p-8 flex flex-col h-full">
                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-blue-700 border-2 border-blue-100 mb-5 shrink-0">
                  {React.cloneElement(item.icon, { className: 'w-8 h-8' })}
                </div>
                <h3 className="text-xl font-black text-slate-900 min-h-[5.5rem] mb-2">{item.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed font-medium mb-5">{item.desc}</p>
                <div className="pt-4 mt-auto">
                  <div 
                    onClick={() => setSelectedService(item)}
                    className="inline-flex items-center text-slate-700 font-bold text-sm bg-slate-100 px-5 py-2.5 rounded-full hover:bg-slate-200 transition-colors cursor-pointer w-max"
                  >
                    Baca Persyaratan <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Kontak Kantor Section - Chubby Standard */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 border-[3px] border-slate-100 rounded-[2.5rem] overflow-hidden bg-white shadow-xl">
          <div className="p-10 sm:p-14 space-y-10 bg-slate-900 text-white">
            <div>
              <h2 className="text-3xl font-black mb-3">Pusat Informasi</h2>
              <p className="text-blue-100 text-base font-medium leading-relaxed">Hubungi perangkat desa pada jam kerja untuk informasi lebih lanjut mengenai persyaratan surat.</p>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="p-3 bg-slate-800 border-2 border-slate-700 rounded-2xl"><MapPin className="w-6 h-6 text-blue-400" /></div>
                <div className="pt-1">
                  <h4 className="font-bold text-lg">Alamat Balai Desa</h4>
                  <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">Tawangsari, Desa Kutasari<br />Kecamatan Cipari, Kab. Cilacap, Jawa Tengah 53262</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="p-3 bg-slate-800 border-2 border-slate-700 rounded-2xl"><Phone className="w-6 h-6 text-blue-400" /></div>
                <div>
                  <h4 className="font-bold text-lg">Telepon Resmi</h4>
                  <p className="text-slate-400 text-sm mt-1">+62 812-3456-7890</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="p-3 bg-slate-800 border-2 border-slate-700 rounded-2xl"><Mail className="w-6 h-6 text-blue-400" /></div>
                <div>
                  <h4 className="font-bold text-lg">Email Desa</h4>
                  <p className="text-slate-400 text-sm mt-1">pemdes@kutasari.desa.id</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative min-h-[400px] md:min-h-full">
            <iframe 
              src="https://maps.google.com/maps?q=-7.3949901,108.8031412&z=16&output=embed" 
              className="absolute inset-0 w-full h-full border-0 grayscale-[20%] contrast-125"
              allowFullScreen="" 
              loading="lazy"
              title="Peta Kantor Desa Kutasari"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Modal Persyaratan */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white border-[3px] border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-end mb-2">
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 mb-2">{selectedService.title}</h3>
                <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">Berikut adalah dokumen persyaratan yang wajib Anda siapkan sebelum melakukan pengajuan di kantor desa.</p>
                
                <div className="space-y-3 mb-8">
                  {selectedService.reqs.map((req, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-slate-700 font-bold text-[13px] pt-0.5">{req}</span>
                    </motion.div>
                  ))}
                </div>
                
                <Link to="/ajukan" className="block w-full">
                  <button className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-xl px-5 py-3.5 flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-600/30 cursor-pointer text-sm">
                    Mulai Buat Pengajuan <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

