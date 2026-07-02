import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, MapPin, Mail, Phone, ChevronRight, Sparkles, Building2, FileBadge, FileCheck } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const Home = () => {
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
        <div className="absolute -top-32 -left-32 w-96 h-28 bg-blue-600 rounded-full transform rotate-45"></div>
        <div className="absolute -top-8 -left-24 w-64 h-12 border-[3px] border-slate-900 rounded-full transform rotate-45 opacity-20"></div>
        <div className="absolute top-12 left-10 w-4 h-4 bg-yellow-400 rounded-full opacity-90"></div>
        
        {/* Massive Right Side Ornaments */}
        <div className="absolute -bottom-48 -right-32 w-96 h-[800px] bg-slate-900 rounded-full transform rotate-45"></div>
        <div className="absolute -top-32 -right-20 w-80 h-[800px] bg-blue-600 rounded-full transform rotate-45"></div>
        <div className="absolute top-1/2 right-32 w-48 h-[400px] bg-blue-200/50 rounded-full transform rotate-45 -translate-y-1/2"></div>
        
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
                  className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-full px-8 py-4 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-base transition-colors cursor-pointer"
                >
                  Buat Pengajuan Baru
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/track">
                <button className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-full px-8 py-4 shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-transform active:scale-95 text-base cursor-pointer">
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
              Terletak di Kecamatan Cipari, Kabupaten Cilacap, Desa Kutasari merupakan wilayah yang menjunjung tinggi nilai gotong royong dan pelayanan masyarakat yang prima. Kami terus berupaya meningkatkan tertib administrasi demi kesejahteraan dan kemudahan akses bagi lebih dari 5.000 penduduk kami.
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: 'Surat Keterangan Usaha', desc: 'Pengajuan legalitas untuk izin usaha mikro warga.', icon: <FileText /> },
            { title: 'Surat Keterangan Domisili', desc: 'Dokumen yang menyatakan kedudukan dan tempat tinggal.', icon: <FileText /> },
            { title: 'Surat Pengantar Nikah', desc: 'Persyaratan administratif untuk melangsungkan pernikahan.', icon: <FileText /> }
          ].map((item, idx) => (
            <Card key={idx} className="border-[3px] border-slate-100 bg-white rounded-[2rem] shadow-sm hover:border-blue-600 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <CardBody className="p-8 space-y-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-blue-700 border-2 border-blue-100">
                  {React.cloneElement(item.icon, { className: 'w-8 h-8' })}
                </div>
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed font-medium">{item.desc}</p>
                <div className="pt-4">
                  <div className="inline-flex items-center text-slate-700 font-bold text-sm bg-slate-100 px-5 py-2.5 rounded-full hover:bg-slate-200 transition-colors cursor-pointer w-max">
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
                  <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">Jl. Kemerdekaan No. 45, Desa Kutasari<br />Kecamatan Cipari, Kab. Cilacap</p>
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
    </div>
  );
};

