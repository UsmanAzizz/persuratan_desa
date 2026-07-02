import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import apiClient from '../../services/apiClient';
import { useToastStore } from '../../store/useToastStore';
import { motion } from 'framer-motion';

export const Login = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await apiClient.post('/auth/login', formData, { showSuccessToast: false });
      
      if (res.data.success) {
        localStorage.setItem('jwt_token', res.data.data.token);
        addToast(`Selamat datang, ${res.data.data.user.nama_petugas}`, 'success');
        navigate('/admin', { replace: true });
      }
    } catch (error) {
      // apiClient already dispatched error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f6f8fa] flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div 
        className="w-full max-w-[310px] flex flex-col items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo ala GitHub */}
        <div className="w-12 h-12 bg-[#24292f] rounded-full flex items-center justify-center mb-6 shadow-sm">
          <span className="text-white font-bold text-xl tracking-tighter">DK</span>
        </div>

        {/* Judul di luar kotak */}
        <h1 className="text-2xl font-light text-[#24292f] tracking-tight mb-4">
          Masuk ke Portal Staf
        </h1>

        {/* Kotak Form Utama */}
        <div className="w-full bg-white border border-[#d0d7de] rounded-xl p-5 shadow-sm mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-[#24292f]">
                Nama Pengguna
              </label>
              <input
                id="username"
                type="text"
                required
                className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-[#24292f]">
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-3 py-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-shadow"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-md bg-[#2da44e] hover:bg-[#2c974b] border border-[rgba(27,31,36,0.15)] text-white font-semibold py-[5px] text-sm shadow-sm transition-colors mt-4" 
              isLoading={loading}
            >
              Masuk
            </Button>
          </form>
        </div>

        {/* Footer ala GitHub */}
        <div className="w-full border border-[#d0d7de] rounded-lg p-4 text-center text-sm text-[#24292f] bg-transparent">
          Bukan staf?{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
