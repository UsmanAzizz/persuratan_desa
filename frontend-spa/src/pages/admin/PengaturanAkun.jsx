import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { User, Lock, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';

export const PengaturanAkun = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    nama_petugas: '',
    password_lama: '',
    password_baru: '',
    konfirmasi_password: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAkun();
  }, []);

  const fetchAkun = async () => {
    try {
      const res = await apiClient.get('/admin/akun');
      if (res.data.success) {
        setFormData(prev => ({
          ...prev,
          username: res.data.data.username,
          nama_petugas: res.data.data.nama_petugas
        }));
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Gagal mengambil data akun' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    // Validasi dasar
    if (formData.password_baru || formData.password_lama) {
      if (formData.password_baru !== formData.konfirmasi_password) {
        setMessage({ type: 'error', text: 'Konfirmasi sandi baru tidak cocok' });
        return;
      }
      if (!formData.password_lama) {
        setMessage({ type: 'error', text: 'Sandi lama wajib diisi untuk mengubah sandi' });
        return;
      }
    }

    setSaving(true);
    try {
      const res = await apiClient.put('/admin/akun', {
        username: formData.username,
        nama_petugas: formData.nama_petugas,
        password_lama: formData.password_lama,
        password_baru: formData.password_baru
      });
      
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
        // Kosongkan form password
        setFormData(prev => ({
          ...prev,
          password_lama: '',
          password_baru: '',
          konfirmasi_password: ''
        }));
      }
    } catch (e) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'Gagal memperbarui profil' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader 
          title="Pengaturan Akun Admin" 
          description="Kelola informasi profil dan kata sandi akun Anda."
        />
        
        <CardBody className="p-5">
          {message.text && (
            <div className={`mb-4 p-3 rounded-xl flex items-center gap-3 ${
              message.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}>
              {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Profil Section */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-blue-600" /> Profil Publik
              </h4>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Username Login</label>
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    minLength={4}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Keamanan Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" /> Keamanan Sandi
                </h4>
                <p className="text-xs text-slate-500">*Kosongkan jika tidak diubah</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Sandi Lama</label>
                  <input 
                    type="password" 
                    name="password_lama"
                    value={formData.password_lama}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Sandi Baru</label>
                  <input 
                    type="password" 
                    name="password_baru"
                    value={formData.password_baru}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Konfirmasi Sandi Baru</label>
                  <input 
                    type="password" 
                    name="konfirmasi_password"
                    value={formData.konfirmasi_password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
            
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
