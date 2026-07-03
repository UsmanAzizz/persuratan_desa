import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Smartphone, RefreshCw, LogOut, CheckCircle, WifiOff, QrCode, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WA_API_URL = 'http://localhost:3000/wa';

export const PengaturanWA = () => {
  const [status, setStatus] = useState('CHECKING'); // CHECKING, DISCONNECTED, QR_READY, AUTHENTICATING, CONNECTED
  const [qrCode, setQrCode] = useState(null);
  const [linkedNumber, setLinkedNumber] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let intervalId;

    const checkStatus = async () => {
      try {
        const timestamp = new Date().getTime();
        const res = await fetch(`${WA_API_URL}/status?_t=${timestamp}`, { cache: 'no-store' });
        const data = await res.json();
        setStatus(data.status);
        if (data.number) {
          setLinkedNumber(data.number);
        }

        if (data.status === 'QR_READY') {
          const qrRes = await fetch(`${WA_API_URL}/qr?_t=${timestamp}`, { cache: 'no-store' });
          const qrData = await qrRes.json();
          if (qrData.success) {
            setQrCode(qrData.qr);
          }
        }
      } catch (error) {
        setStatus('DISCONNECTED');
      }
    };

    checkStatus();
    intervalId = setInterval(checkStatus, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch(`${WA_API_URL}/logout`, { method: 'POST' });
      setStatus('DISCONNECTED');
      setQrCode(null);
      setLinkedNumber(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[400px]">
      <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white h-full flex flex-col">
        <div className="h-16 bg-slate-900 relative overflow-hidden flex items-center px-6 shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md shadow-lg border border-white/5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide">WhatsApp Gateway</h3>
              <p className="text-emerald-400 text-[8px] font-black uppercase tracking-[0.2em] mt-0.5">Status Server</p>
            </div>
          </div>
        </div>
        
        <CardBody className="flex-1 p-0 flex relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 relative z-10 h-full">
            
            {/* --- KOLOM KIRI --- */}
            <div className="p-8 flex flex-col justify-center items-center md:items-start text-center md:text-left border-r border-slate-100 h-full">
              <AnimatePresence mode="wait">
                
                {status === 'CHECKING' && (
                  <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4 mx-auto md:mx-0"></div>
                    <h4 className="text-2xl font-black text-slate-800 mb-2">Memeriksa...</h4>
                    <p className="text-slate-500 text-sm">Menghubungi server WhatsApp Gateway desa.</p>
                  </motion.div>
                )}

                {(status === 'DISCONNECTED' || (status === 'QR_READY' && !qrCode)) && (
                  <motion.div key="disconnected" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0 shadow-inner shadow-rose-200/50">
                      <WifiOff className="w-8 h-8 text-rose-500" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Offline</h4>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-xs">Gateway sedang tidak terhubung. Menunggu proses inisialisasi sesi baru.</p>
                    <div className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Sedang Memuat...
                    </div>
                  </motion.div>
                )}

                {status === 'QR_READY' && qrCode && (
                  <motion.div key="qr_ready" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0 shadow-inner shadow-amber-200/50">
                      <QrCode className="w-8 h-8 text-amber-500" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Menunggu Scan</h4>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-xs">Silakan tautkan perangkat Anda menggunakan QR Code di sebelah kanan.</p>
                  </motion.div>
                )}

                {status === 'AUTHENTICATING' && (
                  <motion.div key="authenticating" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0 shadow-inner shadow-blue-200/50">
                      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Menyinkronkan...</h4>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Ponsel berhasil di-scan. Sedang mengambil data sesi...</p>
                  </motion.div>
                )}

                {/* --- KONDISI CONNECTED: INFO AKUN KIRI --- */}
                {status === 'CONNECTED' && (
                  <motion.div key="connected_info" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
                    <h4 className="text-xl font-black text-slate-800 mb-1 tracking-tight">Informasi Akun</h4>
                    <p className="text-slate-500 text-sm mb-8">Pusat kontrol bot notifikasi WhatsApp.</p>
                    
                    <div className="bg-emerald-50 rounded-2xl p-5 mb-8 border border-emerald-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm">
                        <User className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Nomor Pengirim Tertaut</p>
                        <p className="text-lg font-mono font-bold text-emerald-700">
                          +{linkedNumber || 'Mengambil...'}
                        </p>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      onClick={handleLogout} 
                      isLoading={loading}
                      className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold px-6 py-3 shadow-sm hover:shadow-md transition-all w-full"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Putuskan Koneksi & Ganti Akun
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- KOLOM KANAN --- */}
            <div className="bg-slate-50/50 p-8 flex flex-col justify-center items-center h-full">
              <AnimatePresence mode="wait">
                
                {/* QR Code Saat Menunggu */}
                {status === 'QR_READY' && qrCode && (
                  <motion.div 
                    key="qr_view"
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center"
                  >
                    <div className="p-3 bg-white border-4 border-slate-100 rounded-3xl shadow-xl transition-transform hover:scale-105 duration-300 mb-6">
                      <img src={qrCode} alt="WhatsApp QR Code" className="w-48 h-48 md:w-56 md:h-56 object-contain" />
                    </div>
                    <p className="text-slate-500 text-sm text-center max-w-xs">
                      Buka <strong>WhatsApp</strong> di HP Anda, buka menu <strong>Perangkat Tertaut</strong>, lalu scan QR Code ini.
                    </p>
                  </motion.div>
                )}

                {/* Visualisasi Saat Gateway Aktif (Berdenyut) */}
                {status === 'CONNECTED' && (
                  <motion.div 
                    key="connected_pulse"
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center text-center w-full"
                  >
                    <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative shadow-inner shadow-emerald-200/50">
                      <div className="absolute inset-0 bg-emerald-400 opacity-30 rounded-full animate-ping"></div>
                      <div className="absolute inset-0 bg-emerald-300 opacity-20 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
                      <CheckCircle className="w-16 h-16 text-emerald-500 relative z-10 drop-shadow-md" />
                    </div>
                    <h4 className="text-2xl font-black text-emerald-600 mb-2 tracking-tight">Gateway Aktif</h4>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-[250px]">
                      Pesan notifikasi otomatis akan segera dikirimkan melalui saluran ini.
                    </p>
                  </motion.div>
                )}

                {/* Ilustrasi Placeholder Saat Offline/Checking/Authenticating */}
                {status !== 'QR_READY' && status !== 'CONNECTED' && (
                  <motion.div 
                    key="illustration"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center opacity-40 grayscale"
                  >
                    <div className="w-40 h-40 border-[10px] border-slate-200 rounded-3xl flex items-center justify-center bg-white shadow-inner">
                      <QrCode className="w-12 h-12 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold mt-6 tracking-widest uppercase text-[10px]">
                      Area Visualisasi
                    </p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        </CardBody>
      </Card>
    </div>
  );
};
