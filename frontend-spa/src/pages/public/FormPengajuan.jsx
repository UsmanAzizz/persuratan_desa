import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import apiClient from '../../services/apiClient';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FormPengajuan = () => {
  const [jenisSurat, setJenisSurat] = useState([]);
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
    keperluan: '' // part of data_input
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
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Formulir Pengajuan Surat</h1>
        <p className="text-slate-500 mt-1">Lengkapi data diri Anda untuk mengajukan surat pengantar/keterangan dari Desa Kutasari.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader title="Informasi Pemohon" description="Pastikan NIK dan No. KK sesuai dengan KTP Anda." />
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              id="nik" label="Nomor Induk Kependudukan (NIK)" 
              placeholder="16 Digit NIK" maxLength={16} required 
              value={formData.nik} onChange={handleInputChange}
            />
            <Input 
              id="no_kk" label="Nomor Kartu Keluarga (KK)" 
              placeholder="16 Digit KK" maxLength={16} required 
              value={formData.no_kk} onChange={handleInputChange}
            />
            <Input 
              id="nama_lengkap" label="Nama Lengkap Pemohon" 
              placeholder="Sesuai KTP" required 
              value={formData.nama_lengkap} onChange={handleInputChange}
            />
            <Input 
              id="no_hp" label="Nomor HP / WhatsApp" 
              placeholder="0812xxxxxx" required 
              value={formData.no_hp} onChange={handleInputChange}
            />
            
            <div className="md:col-span-2">
              <Input 
                id="alamat" label="Alamat Lengkap Domisili" 
                placeholder="Nama Jalan, Dusun" required 
                value={formData.alamat} onChange={handleInputChange}
              />
            </div>
            
            <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
              <h4 className="text-md font-semibold text-slate-800 mb-4">Detail Pengajuan</h4>
              <div className="flex flex-col gap-1.5 mb-4">
                <label htmlFor="id_jenis_surat" className="text-sm font-medium text-slate-700">Jenis Surat</label>
                <select 
                  id="id_jenis_surat" 
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.id_jenis_surat}
                  onChange={handleInputChange}
                >
                  <option value="">-- Pilih Jenis Surat --</option>
                  {jenisSurat.map(j => (
                    <option key={j.id_jenis} value={j.id_jenis}>{j.kode_surat} - {j.nama_surat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="keperluan" className="text-sm font-medium text-slate-700">Tujuan / Keperluan Surat</label>
                <textarea 
                  id="keperluan"
                  rows={3}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Pengantar pembuatan SKCK di Polsek"
                  required
                  value={formData.keperluan}
                  onChange={handleInputChange}
                />
              </div>
            </div>

          </CardBody>
          <CardFooter className="justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setFormData({...formData, nik:'', nama_lengkap:'', no_kk:'', no_hp:'', alamat:'', id_jenis_surat:'', keperluan:''})}>
              Reset
            </Button>
            <Button type="submit" isLoading={loading}>Kirim Pengajuan</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
