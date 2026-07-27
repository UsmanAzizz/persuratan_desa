import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogIn } from 'lucide-react';

export const SessionExpired = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-[400px] w-full bg-white border border-gray-200 rounded-md shadow-sm p-6 text-center">
        <div className="mx-auto w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-100">
          <ShieldAlert size={24} strokeWidth={1.5} />
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Sesi Anda Telah Berakhir
        </h1>
        
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Sesi otentikasi (JWT) Anda telah kedaluwarsa atau tidak valid. Silakan masuk kembali ke akun Anda untuk melanjutkan aktivitas.
        </p>

        <button 
          onClick={handleLogin}
          className="w-full flex justify-center items-center gap-2 py-1.5 px-3 bg-[#2da44e] hover:bg-[#2c974b] text-white rounded-md text-sm font-medium transition-colors border border-[rgba(27,31,36,0.15)] shadow-sm"
        >
          <LogIn size={16} />
          <span>Ke Halaman Login</span>
        </button>
      </div>
    </div>
  );
};
