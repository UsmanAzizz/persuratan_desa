import React, { useState, useEffect } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import apiClient from '../../services/apiClient';
import { CheckCircle, Lock, User, FileText, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FormPengajuan = () => {
  const navigate = useNavigate();
  const [jenisSurat, setJenisSurat] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  const [formData, setFormData] = useState({
    nik: '',
    nama_lengkap: '',
    no_kk: '',
    no_hp: '',
    alamat: '',
    id_jenis_surat: '',
    keperluan: ''
  });
  
  const [fileData, setFileData] = useState({});
  const [dynamicFields, setDynamicFields] = useState({});
  const [selectedSyarat, setSelectedSyarat] = useState([]);
  const [selectedKodeSurat, setSelectedKodeSurat] = useState('');

  useEffect(() => {
    const fetchJenis = async () => {
      try {
        const res = await apiClient.get('/pengajuan/jenis-surat');
        if (res.data.success) {
          setJenisSurat(res.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil referensi jenis surat", error);
      }
    };
    fetchJenis();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    // Cegah ubah data diri jika sudah terverifikasi
    if (isVerified && ['nik', 'nama_lengkap', 'no_kk', 'no_hp', 'alamat'].includes(id)) {
      return;
    }
    
    setFormData(prev => ({ ...prev, [id]: value }));

    // Handling selection change for jenis surat
    if (id === 'id_jenis_surat') {
      const selected = jenisSurat.find(j => j.id_jenis.toString() === value.toString());
      if (selected) {
        setSelectedKodeSurat(selected.kode_surat);
        try {
          const syaratArr = JSON.parse(selected.syarat_berkas);
          setSelectedSyarat(Array.isArray(syaratArr) ? syaratArr : []);
        } catch(e) {
          setSelectedSyarat([]);
        }
      } else {
        setSelectedSyarat([]);
        setSelectedKodeSurat('');
      }
      setFileData({});
      setDynamicFields({});
    }
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    if (files && files[0]) {
      setFileData(prev => ({ ...prev, [id]: files[0] }));
    }
  };

  const handleDynamicFieldChange = (e) => {
    const { id, value } = e.target;
    setDynamicFields(prev => ({ ...prev, [id]: value }));
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (formData.nik.length !== 16) return;

    setIsVerifying(true);
    
    try {
      const res = await apiClient.get(`/pengajuan/cek-nik/${formData.nik}`, { showSuccessToast: true });
      if (res.data.success) {
        const warga = res.data.data;
        // Auto-fill form dengan data warga
        setFormData(prev => ({
          ...prev,
          nama_lengkap: warga.nama_lengkap,
          no_kk: warga.no_kk,
          no_hp: warga.no_hp || prev.no_hp,
          alamat: warga.alamat
        }));
        setIsVerified(true);
      }
    } catch (error) {
      // Error handled by apiClient interceptor (toast)
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEditData = () => {
    setIsVerified(false);
  };

  const handleFillDummy = async (e) => {
    const kodeSurat = e.target.value;
    if (!kodeSurat) return;

    const selected = jenisSurat.find(j => j.kode_surat === kodeSurat);
    if (!selected) return;

    // Fill basic
    setFormData(prev => ({
      ...prev,
      nik: '1234567890123456',
      no_kk: '1234567890123456',
      no_hp: '+6281315968818',
      id_jenis_surat: selected.id_jenis,
      keperluan: 'Keperluan Dummy / Testing'
    }));

    setSelectedKodeSurat(kodeSurat);
    
    let syaratArr = [];
    try {
      syaratArr = JSON.parse(selected.syarat_berkas);
      setSelectedSyarat(Array.isArray(syaratArr) ? syaratArr : []);
    } catch(err) {
      setSelectedSyarat([]);
    }
    
    // Fill dynamic fields based on type
    const dummyFields = {};
    if (kodeSurat === 'IK') {
      dummyFields.hari_hajat = 'Selasa';
      dummyFields.tanggal_hajat = '2026-07-17';
      dummyFields.jenis_hiburan = 'Hadroh';
    } else if (kodeSurat === 'SKW') {
      dummyFields.nama_pewaris = 'Siti Maimunah';
      dummyFields.nama_pasangan = 'Abdul Rozak';
    } else if (kodeSurat === 'N1') {
      dummyFields.status_perkawinan = 'Jejaka/Perawan';
      dummyFields.nama_ayah_kandung = 'Sutejo';
      dummyFields.nama_ibu_kandung = 'Ngatinah';
    } else if (kodeSurat === 'SKU') {
      dummyFields.nama_usaha = 'Warung Berkah Kutasari';
    }
    setDynamicFields(dummyFields);
    
    // Simulate verification & file loading
    setIsVerifying(true);
    try {
      const res = await apiClient.get(`/pengajuan/cek-nik/1234567890123456`, { showSuccessToast: false });
      if (res.data.success) {
        const warga = res.data.data;
        setFormData(prev => ({
          ...prev,
          nama_lengkap: warga.nama_lengkap,
          no_kk: warga.no_kk,
          no_hp: warga.no_hp || '+6281315968818',
          alamat: warga.alamat
        }));
        setIsVerified(true);
        
        // Load dummy file from public folder
        const resFile = await fetch('/TTD_KADES.png');
        const blob = await resFile.blob();
        const dummyFile = new File([blob], 'TTD_KADES.png', { type: 'image/png' });
        
        const filesObj = {};
        syaratArr.forEach(s => { filesObj[s] = dummyFile; });
        setFileData(filesObj);
      }
    } catch (err) {
      console.error('Gagal meload warga dummy', err);
      setIsVerified(false);
    }
    setIsVerifying(false);
    e.target.value = ''; // Reset dropdown
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) return;

    setLoading(true);

    const combinedDataInput = { 
      keperluan: formData.keperluan,
      ...dynamicFields
    };

    const payload = new FormData();
    payload.append('nik', formData.nik);
    payload.append('no_kk', formData.no_kk);
    payload.append('nama_lengkap', formData.nama_lengkap);
    payload.append('no_hp', formData.no_hp);
    payload.append('alamat', formData.alamat);
    payload.append('id_jenis_surat', formData.id_jenis_surat);
    payload.append('data_input', JSON.stringify(combinedDataInput));

    Object.keys(fileData).forEach(key => {
      payload.append(key, fileData[key]);
    });

    try {
      const res = await apiClient.post('/pengajuan/buat', payload, { 
        showSuccessToast: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setTrackingCode(res.data.data.kode_tracking);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full flex items-center justify-center p-4 sm:p-6 select-none">
        <Card className="max-w-xl w-full text-center border-[3px] border-emerald-100 rounded-[2rem] shadow-2xl p-6 sm:p-8 bg-white">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Pengajuan Berhasil!</h2>
          <p className="text-slate-600 mb-6 text-sm sm:text-base">
            Permohonan surat Anda telah direkam. Silakan simpan kode pelacakan di bawah ini untuk memantau status surat Anda.
          </p>
          
          <div className="bg-slate-100 p-4 sm:p-5 rounded-2xl mb-6 border-2 border-dashed border-slate-300">
            <p className="text-xs sm:text-sm text-slate-500 font-bold mb-1 sm:mb-2 uppercase tracking-wider">Kode Pelacakan Anda</p>
            <p className="text-3xl sm:text-4xl font-black text-blue-600 tracking-widest">{trackingCode}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsSuccess(false);
                setIsVerified(false);
                setFormData({ nik: '', nama_lengkap: '', no_kk: '', no_hp: '', alamat: '', id_jenis_surat: '', keperluan: '' });
                setFileData({});
                setDynamicFields({});
                setSelectedSyarat([]);
              }}
              className="rounded-full px-6 py-2 sm:px-8 sm:py-2.5 font-bold"
            >
              Ajukan Surat Lain
            </Button>
            <Button 
              onClick={() => navigate(`/track?code=${trackingCode}`)}
              className="rounded-full px-6 py-2 sm:px-8 sm:py-2.5 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
            >
              Lacak Pengajuan Sekarang
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const isForm1Complete = formData.nik.length === 16 && formData.no_kk.length === 16 && formData.no_hp;
  const isForm2Complete = formData.id_jenis_surat && formData.keperluan && 
    (selectedKodeSurat !== 'SKU' || dynamicFields.data_usaha) &&
    selectedSyarat.length > 0 && selectedSyarat.every(s => fileData[s]);

  return (
    <div className="w-full px-4 sm:px-6 py-2 select-none relative z-10">
      <div className="mb-3 text-center max-w-4xl mx-auto relative flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
          Formulir Pengajuan Surat
        </h1>
        <div className="absolute right-0 top-0">
          <select onChange={handleFillDummy} className="text-xs px-2 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded shadow-sm focus:outline-none font-medium cursor-pointer">
            <option value="">🚀 Auto-Fill Dummy...</option>
            {jenisSurat.map(j => (
              <option key={j.id_jenis} value={j.kode_surat}>Dummy {j.kode_surat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch w-full">
        {/* Kiri: Informasi Pemohon */}
        <div className="lg:col-span-5 xl:col-span-4">
          <form onSubmit={handleVerify} className="h-full">
            <Card className={`h-full min-h-[460px] flex flex-col border-[3px] ${isVerified ? 'border-emerald-200' : 'border-slate-100'} rounded-[2rem] shadow-xl bg-white overflow-hidden transition-colors duration-300`}>
              <div className={`p-5 border-b ${isVerified ? 'border-emerald-100 bg-gradient-to-r from-emerald-50/60 to-white' : 'border-slate-100 bg-gradient-to-r from-blue-50/60 to-white'} flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isVerified ? 'bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-emerald-100' : 'bg-blue-50 border border-blue-200 text-blue-600 shadow-blue-100'}`}>
                    <User className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      Informasi Pemohon
                      {isVerified && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                    </h3>
                    <p className="text-slate-500 text-[11px] font-medium mt-0.5">Pastikan NIK dan No. KK sesuai KTP.</p>
                  </div>
                </div>
                {isVerified && (
                  <Button type="button" variant="outline" className="rounded-full px-4 py-1.5 text-sm font-bold h-auto" onClick={handleEditData}>
                    Ubah Data
                  </Button>
                )}
              </div>
              {isVerified ? (
                <CardBody className="p-5 flex flex-col gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Nama Lengkap</p>
                      <p className="text-sm font-bold text-slate-800">{formData.nama_lengkap}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">NIK</p>
                        <p className="text-sm font-semibold text-slate-700">{formData.nik}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">No. KK</p>
                        <p className="text-sm font-semibold text-slate-700">{formData.no_kk}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Alamat Domisili</p>
                      <p className="text-sm font-semibold text-slate-700">{formData.alamat}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">No. HP / WhatsApp (Kontak Aktif)</p>
                      <p className="text-sm font-semibold text-slate-700">{formData.no_hp}</p>
                    </div>
                  </div>
                </CardBody>
              ) : (
                <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                  <Input 
                    id="nik" label="Nomor Induk Kependudukan" 
                    placeholder="16 Digit NIK" maxLength={16} required 
                    value={formData.nik} onChange={handleInputChange}
                  />
                  <Input 
                    id="no_kk" label="Nomor Kartu Keluarga (KK)" 
                    placeholder="16 Digit KK" maxLength={16} required 
                    value={formData.no_kk} onChange={handleInputChange}
                  />
                  <div className="md:col-span-2">
                    <Input 
                      id="no_hp" label="Nomor HP / WhatsApp" 
                      placeholder="0812xxxxxx (Aktif untuk notifikasi)" required 
                      value={formData.no_hp} onChange={handleInputChange}
                    />
                  </div>
                </CardBody>
              )}
              
              {isVerified ? (
                <div className="p-3 bg-emerald-500 border-t border-emerald-600 flex items-center justify-center gap-2 text-white mt-auto">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">Data Terverifikasi</span>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border-t border-slate-100 flex justify-end mt-auto">
                  <Button 
                    type="submit" 
                    isLoading={isVerifying}
                    disabled={!isForm1Complete}
                    className={`rounded-full px-8 py-2 font-bold w-full sm:w-auto text-sm transition-colors duration-300 ${
                      isForm1Complete 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 cursor-pointer' 
                        : 'bg-slate-400 text-slate-100 shadow-none cursor-not-allowed hover:bg-slate-400'
                    }`}
                  >
                    Verifikasi dan Lanjutkan
                  </Button>
                </div>
              )}
            </Card>
          </form>
        </div>

        {/* Kanan: Detail Pengajuan */}
        <div className="lg:col-span-7 xl:col-span-8">
          <form onSubmit={handleSubmit} className="h-full">
            <Card className="h-full min-h-[460px] border-[3px] border-slate-100 rounded-[2rem] shadow-xl bg-white overflow-hidden flex flex-col">
              
              <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 to-white flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 shadow-sm shadow-blue-100 flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      Detail Pengajuan
                    </h3>
                    <p className="text-slate-500 text-[11px] font-medium mt-0.5">Pilih jenis layanan persuratan yang Anda butuhkan.</p>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  variant={isVerified && isForm2Complete ? "solid" : "outline"}
                  isLoading={loading}
                  disabled={!isVerified || !isForm2Complete}
                  className={`w-full sm:w-auto rounded-full px-6 py-1.5 font-bold transition-all duration-300 text-sm shrink-0 mt-2 sm:mt-1 ${
                    isVerified && isForm2Complete 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 border-transparent' 
                      : 'bg-transparent border-slate-300 text-slate-400 cursor-not-allowed shadow-none hover:bg-transparent'
                  }`}
                >
                  Kirim Pengajuan
                </Button>
              </div>
              
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
                  <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 items-start">
                    
                    {/* Kolom Kiri: Input Fields */}
                    <div className="flex flex-col gap-4 md:pr-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="id_jenis_surat" className="text-sm font-medium text-slate-700">Jenis Surat</label>
                        <select 
                          id="id_jenis_surat" 
                          className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-500 select-text"
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

                      {selectedKodeSurat === 'SKU' && (
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="data_usaha" className="text-sm font-medium text-slate-700">Detail Data Usaha <span className="text-rose-500">*</span></label>
                          <input 
                            type="text"
                            id="data_usaha"
                            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-500 select-text"
                            placeholder="Nama/Jenis Usaha Anda"
                            required
                            value={dynamicFields.data_usaha || ''}
                            onChange={handleDynamicFieldChange}
                            disabled={!isVerified}
                          />
                        </div>
                      )}

                      {selectedKodeSurat === 'SKD' && (
                        <>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="alamat_asal" className="text-sm font-medium text-slate-700">Alamat Tinggal Asal <span className="text-rose-500">*</span></label>
                            <input 
                              type="text"
                              id="alamat_asal"
                              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-500 select-text"
                              placeholder="Alamat sesuai KTP"
                              required
                              value={dynamicFields.alamat_asal || ''}
                              onChange={handleDynamicFieldChange}
                              disabled={!isVerified}
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="alamat_domisili" className="text-sm font-medium text-slate-700">Alamat Domisili Sekarang <span className="text-rose-500">*</span></label>
                            <input 
                              type="text"
                              id="alamat_domisili"
                              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-500 select-text"
                              placeholder="Dusun, RT/RW tujuan domisili"
                              required
                              value={dynamicFields.alamat_domisili || ''}
                              onChange={handleDynamicFieldChange}
                              disabled={!isVerified}
                            />
                          </div>
                        </>
                      )}
                      
                      {selectedKodeSurat === 'IK' && (
                        <>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="hari_hajat" className="text-sm font-medium text-slate-700">Hari Penyelenggaraan <span className="text-rose-500">*</span></label>
                            <select id="hari_hajat" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm" value={dynamicFields.hari_hajat || ''} onChange={handleDynamicFieldChange} disabled={!isVerified} required>
                              <option value="">-- Pilih Hari --</option>
                              <option value="Senin">Senin</option><option value="Selasa">Selasa</option><option value="Rabu">Rabu</option><option value="Kamis">Kamis</option><option value="Jumat">Jumat</option><option value="Sabtu">Sabtu</option><option value="Minggu">Minggu</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="tanggal_hajat" className="text-sm font-medium text-slate-700">Tanggal Penyelenggaraan <span className="text-rose-500">*</span></label>
                            <input type="date" id="tanggal_hajat" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm" required value={dynamicFields.tanggal_hajat || ''} onChange={handleDynamicFieldChange} disabled={!isVerified} />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="jenis_hiburan" className="text-sm font-medium text-slate-700">Jenis Hiburan <span className="text-rose-500">*</span></label>
                            <input type="text" id="jenis_hiburan" placeholder="Contoh: Organ Tunggal" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm" required value={dynamicFields.jenis_hiburan || ''} onChange={handleDynamicFieldChange} disabled={!isVerified} />
                          </div>
                        </>
                      )}

                      {selectedKodeSurat === 'SKW' && (
                        <>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="nama_pewaris" className="text-sm font-medium text-slate-700">Nama Almarhum/Almarhumah (Pewaris) <span className="text-rose-500">*</span></label>
                            <input type="text" id="nama_pewaris" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm" required value={dynamicFields.nama_pewaris || ''} onChange={handleDynamicFieldChange} disabled={!isVerified} />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="nama_pasangan" className="text-sm font-medium text-slate-700">Nama Pasangan Pewaris (Suami/Istri) <span className="text-rose-500">*</span></label>
                            <input type="text" id="nama_pasangan" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm" required value={dynamicFields.nama_pasangan || ''} onChange={handleDynamicFieldChange} disabled={!isVerified} />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">Catatan: Data Anak/Ahli Waris akan dilengkapi saat pencetakan di balai desa karena membutuhkan validasi lebih lanjut.</label>
                          </div>
                        </>
                      )}

                      {selectedKodeSurat === 'N1' && (
                        <>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="status_perkawinan" className="text-sm font-medium text-slate-700">Status Perkawinan Calon <span className="text-rose-500">*</span></label>
                            <select id="status_perkawinan" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm" required value={dynamicFields.status_perkawinan || ''} onChange={handleDynamicFieldChange} disabled={!isVerified}>
                              <option value="">-- Pilih Status --</option>
                              <option value="Jejaka/Perawan">Jejaka / Perawan</option>
                              <option value="Duda/Janda">Duda / Janda</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="nama_ayah_kandung" className="text-sm font-medium text-slate-700">Nama Ayah Kandung <span className="text-rose-500">*</span></label>
                            <input type="text" id="nama_ayah_kandung" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm" required value={dynamicFields.nama_ayah_kandung || ''} onChange={handleDynamicFieldChange} disabled={!isVerified} />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label htmlFor="nama_ibu_kandung" className="text-sm font-medium text-slate-700">Nama Ibu Kandung <span className="text-rose-500">*</span></label>
                            <input type="text" id="nama_ibu_kandung" className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm" required value={dynamicFields.nama_ibu_kandung || ''} onChange={handleDynamicFieldChange} disabled={!isVerified} />
                          </div>
                        </>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="keperluan" className="text-sm font-medium text-slate-700">Tujuan / Keperluan Surat <span className="text-rose-500">*</span></label>
                        <textarea 
                          id="keperluan"
                          rows={3}
                          className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-500 select-text"
                          placeholder="Contoh: Pengantar pembuatan SKCK di Polsek"
                          required
                          value={formData.keperluan}
                          onChange={handleInputChange}
                          disabled={!isVerified}
                        />
                      </div>
                    </div>

                    {/* Kolom Kanan: Upload Dokumen */}
                    <div className="flex flex-col gap-1.5 h-full">
                      <h4 className="text-sm font-medium text-slate-700">
                        Dokumen Persyaratan <span className="text-rose-500">*</span>
                      </h4>
                      {selectedSyarat.length > 0 ? (
                        <div className="flex flex-col h-full bg-slate-50/50 p-4 rounded-2xl border border-slate-100 min-h-[220px]">
                          <div className="flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
                            {selectedSyarat.map((syarat, idx) => {
                              const label = syarat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                              return (
                                <div key={idx} className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-slate-200 border-dashed hover:border-blue-300 transition-colors">
                                  <div className="flex-1 min-w-0">
                                    <label htmlFor={syarat} className="text-xs font-bold text-slate-700 cursor-pointer block truncate">
                                      {label}
                                    </label>
                                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                      {fileData[syarat] ? fileData[syarat].name : 'Belum ada file'}
                                    </p>
                                  </div>
                                  <label 
                                    htmlFor={syarat} 
                                    className={`shrink-0 cursor-pointer px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                                      fileData[syarat] ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20'
                                    }`}
                                  >
                                    {fileData[syarat] ? 'Ubah' : 'Pilih File'}
                                  </label>
                                  <input 
                                    type="file"
                                    id={syarat}
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    required={!fileData[syarat]}
                                    onChange={handleFileChange}
                                    disabled={!isVerified}
                                    className="hidden"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                            <Lock className="w-8 h-8 text-slate-300" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-500 mb-1">Pilih Jenis Surat</h4>
                          <p className="text-xs text-slate-400">Pilih jenis surat di sebelah kiri untuk melihat dokumen yang diperlukan.</p>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </div>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};
