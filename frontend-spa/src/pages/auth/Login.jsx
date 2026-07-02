import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import apiClient from '../../services/apiClient';
import { useToastStore } from '../../store/useToastStore';

export const Login = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Don't show global success toast here, we'll navigate manually
      const res = await apiClient.post('/auth/login', formData, { showSuccessToast: false });
      
      if (res.data.success) {
        localStorage.setItem('jwt_token', res.data.data.token);
        addToast(`Selamat datang, ${res.data.data.user.nama_petugas}`, 'success');
        navigate('/admin');
      }
    } catch (error) {
      // apiClient already dispatched error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="bg-slate-800 p-6 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-xl">DK</span>
          </div>
          <h2 className="text-xl font-bold text-white">Portal Staf Desa</h2>
          <p className="text-slate-400 text-sm mt-1">Sistem Informasi Persuratan Kutasari</p>
        </div>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              id="username"
              label="Nama Pengguna (Username)"
              placeholder="Masukkan username"
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            <Input 
              id="password"
              type="password"
              label="Kata Sandi"
              placeholder="Masukkan kata sandi"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Button type="submit" className="w-full mt-2" isLoading={loading}>
              Masuk ke Sistem
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
