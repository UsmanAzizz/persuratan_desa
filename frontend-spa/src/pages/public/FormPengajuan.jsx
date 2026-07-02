import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import apiClient from '../../services/apiClient';
import { CheckCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FormPengajuan = () => {
  const [jenisSurat, setJenisSurat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  
  // New States for 2-Step Verification
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [formData, setFormData] = useState({
    nik: '',
    nama_lengkap: '',
    no_kk: '',
    no_hp: '',
    alamat: '',
    id_jenis_surat: '',
    keperluan: ''
  });

  useEffect(() => {
    const fetchJenis = async () => {
      try {
        const res = await apiClient.get('/pengajuan/jenis-surat');
        if (res.data.success) {
          setJenisSurat(res.data.data);
        }
      } catch (error) {
        // Error handled by apiClient toast
      }
    };
    fetchJenis();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    // Hanya perbolehkan angka untuk field tertentu
    if (['nik', 'no_kk', 'no_hp'].includes(id)) {
      if (!/^\d*$/.test(value)) return;
      if ((id === 'nik' || id === 'no_kk') && value.length > 16) return;
      if (id === 'no_hp' && value.length > 15) return;
    }
    
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (formData.nik.length !== 16 || formData.no_kk.length !== 16) {
      alert("NIK dan No. KK harus berjumlah tepat 16 digit.");
      return;
    }
    if (!formData.nama_lengkap || !formData.no_hp || !formData.alamat) {
      alert("Mohon lengkapi semua data diri terlebih dahulu.");
      return;
    }

    setIsVerifying(true);
    // Simulate API call for verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setStep(2);
    }, 1500);
  };

  const handleEditData = () => {
    setIsVerified(false);
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) return;

    setLoading(true);

    const payload = {
      ...formData,
      data_input: JSON.stringify({ keperluan: formData.keperluan })
    };

    try {
      const res = await apiClient.post('/pengajuan/buat', payload, { showSuccessToast: true });
      if (res.data.success) {
        setTrackingCode(res.data.data.kode_tracking);
        setIsSuccess(true);
      }
    } catch (error) {
      // Error is handled by apiClient interceptor (Toast)
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingCode);
    alert('Kode pelacakan disalin!');
  };

  const isForm1Complete = formData.nik.trim().length === 16 && 
                          formData.no_kk.trim().length === 16 && 
                          formData.nama_lengkap.trim() !== '' && 
                          formData.no_hp.trim() !== '' && 
                          formData.alamat.trim() !== '';

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pengajuan Berhasil Direkam!</h2>
        <p className="text-slate-600 mb-6">
          Gunakan kode pelacakan di bawah ini untuk memantau status surat Anda. 
          Harap catat atau simpan kode ini dengan aman.
        </p>
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 flex flex-col items-center gap-4">
          <span className="text-3xl font-mono font-bold tracking-widest text-blue-700">{trackingCode}</span>
          <Button variant="outline" onClick={copyToClipboard}>Salin Kode</Button>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/">
            <Button variant="secondary" onClick={() => setIsSuccess(false)}>Buat Pengajuan Baru</Button>
          </Link>
          <Link to={`/track?code=${trackingCode}`}>
            <Button variant="primary">Lacak Sekarang</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 select-none">
      <div className="mb-8 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Formulir Pengajuan Surat</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
        {/* Kiri: Informasi Pemohon */}
        <div className="lg:col-span-7">
          <form onSubmit={handleVerify} className="h-full">
            <Card className={`h-full flex flex-col border-[3px] ${isVerified ? 'border-emerald-200' : 'border-slate-100'} rounded-[2rem] shadow-xl bg-white overflow-hidden transition-colors duration-300`}>
              <div className={`p-8 pb-4 border-b ${isVerified ? 'border-emerald-100 bg-emerald-50/50' : 'border-slate-100 bg-slate-50/50'} flex justify-between items-center`}>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    Informasi Pemohon
                    {isVerified && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium mt-1">Pastikan NIK dan No. KK sesuai dengan KTP asli Anda.</p>
                </div>
                {isVerified && (
                  <Button type="button" variant="outline" className="rounded-full px-4 py-1.5 text-sm font-bold h-auto" onClick={handleEditData}>
                    Ubah Data
                  </Button>
                )}
              </div>
              <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 pt-6">
                <Input 
                  id="nik" label="Nomor Induk Kependudukan (NIK)" 
                  placeholder="16 Digit NIK" maxLength={16} required 
                  value={formData.nik} onChange={handleInputChange}
                  disabled={isVerified}
                />
                <Input 
                  id="no_kk" label="Nomor Kartu Keluarga (KK)" 
                  placeholder="16 Digit KK" maxLength={16} required 
                  value={formData.no_kk} onChange={handleInputChange}
                  disabled={isVerified}
                />
                <Input 
                  id="nama_lengkap" label="Nama Lengkap Pemohon" 
                  placeholder="Sesuai KTP" required 
                  value={formData.nama_lengkap} onChange={handleInputChange}
                  disabled={isVerified}
                />
                <Input 
                  id="no_hp" label="Nomor HP / WhatsApp" 
                  placeholder="0812xxxxxx" required 
                  value={formData.no_hp} onChange={handleInputChange}
                  disabled={isVerified}
                />
                
                <div className="md:col-span-2">
                  <Input 
                    id="alamat" label="Alamat Lengkap Domisili" 
                    placeholder="Nama Jalan, RT/RW, Dusun" required 
                    value={formData.alamat} onChange={handleInputChange}
                    disabled={isVerified}
                  />
                </div>
              </CardBody>
              
              {!isVerified && (
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end mt-auto">
                  <Button 
                    type="submit" 
                    isLoading={isVerifying}
                    disabled={!isForm1Complete}
                    className={`rounded-full px-8 py-3 font-bold w-full sm:w-auto text-base transition-colors duration-300 ${
                      isForm1Complete 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 cursor-pointer' 
                        : 'bg-slate-400 text-slate-100 shadow-none cursor-not-allowed hover:bg-slate-400'
                    }`}
                  >
                    Verifikasi Data & Lanjutkan
                  </Button>
                </div>
              )}
            </Card>
          </form>
        </div>

        {/* Kanan: Detail Pengajuan */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="h-full">
            <Card className="h-full border-[3px] border-slate-100 rounded-[2rem] shadow-xl bg-white overflow-hidden flex flex-col">
              
              {/* Header selalu terang dan jernih */}
              <div className="p-8 pb-4 border-b border-slate-100 bg-blue-50/30">
                <h3 className="text-xl font-bold text-slate-800">Detail Pengajuan</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Pilih jenis layanan persuratan yang Anda butuhkan.</p>
              </div>
              
              {/* Wrapper untuk Body & Footer agar bisa ditumpuk overlay */}
              <div className="relative flex-1 flex flex-col">
                {!isVerified && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm p-6 text-center">
                    <div className="bg-slate-900/90 text-white p-5 rounded-2xl flex flex-col items-center shadow-2xl transform -translate-y-4">
                      <Lock className="w-8 h-8 mb-2 text-slate-300" />
                      <p className="text-sm font-bold">Verifikasi Dibutuhkan</p>
                      <p className="text-xs text-slate-300 mt-1 max-w-[200px]">Silakan verifikasi data untuk melanjutkan.</p>
                    </div>
                  </div>
                )}
                
                <div className={`flex flex-col flex-1 transition-all duration-500 ${!isVerified ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                  <CardBody className="flex flex-col gap-6 p-8 pt-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="id_jenis_surat" className="text-sm font-bold text-slate-700">Jenis Surat</label>
                      <select 
                        id="id_jenis_surat" 
                        className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors disabled:bg-slate-100 disabled:text-slate-400 select-text"
                        required
                        value={formData.id_jenis_surat}
                        onChange={handleInputChange}
                        disabled={!isVerified}
                      >
                        <option value="">-- Pilih Jenis Surat --</option>
                        {jenisSurat.map(j => (
                          <option key={j.id_jenis} value={j.id_jenis}>{j.kode_surat} - {j.nama_surat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="keperluan" className="text-sm font-bold text-slate-700">Tujuan / Keperluan Surat</label>
                      <textarea 
                        id="keperluan"
                        rows={3}
                        className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none disabled:bg-slate-100 disabled:text-slate-400 select-text"
                        placeholder="Contoh: Pengantar pembuatan SKCK di Polsek"
                        required
                        value={formData.keperluan}
                        onChange={handleInputChange}
                        disabled={!isVerified}
                      />
                    </div>
                  </CardBody>
                  
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end mt-auto">
                    <Button 
                      type="submit" 
                      isLoading={loading}
                      disabled={!isVerified}
                      className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-bold shadow-lg shadow-blue-600/30 transition-transform active:scale-95 text-base disabled:opacity-50 disabled:shadow-none"
                    >
                      Kirim Pengajuan
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};
