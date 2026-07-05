import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { ShieldCheck, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

export const ValidasiSurat = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await apiClient.get(`/pengajuan/validasi/${token}`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        setError('Peringatan: Berkas yang dipindai tidak terdaftar dalam Pangkalan Data Pemerintah Desa Kutasari. Terdapat kemungkinan dokumen ini belum disahkan, telah dicabut, atau merupakan dokumen palsu.');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">HASIL VALIDASI DOKUMEN</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Pemerintah Desa Kutasari, Kec. Cipari, Kab. Cilacap</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Melakukan verifikasi ke Pangkalan Data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-rose-100">
                <ShieldAlert className="w-10 h-10 text-rose-600" />
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-3 uppercase tracking-wide">Dokumen Tidak Valid</h2>
              <p className="text-slate-600 leading-relaxed mb-8 text-sm">{error}</p>
              <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
              </Link>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100">
                <ShieldCheck className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-emerald-700 mb-2 uppercase tracking-wide">Dokumen Sah & Otentik</h2>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                Berdasarkan penelusuran sistem, dokumen ini merupakan dokumen resmi yang diterbitkan secara sah oleh Pemerintah Desa Kutasari.
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-200 mb-8 space-y-5">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nama Tercantum</p>
                  <p className="font-bold text-slate-800 text-base">{data.nama_lengkap}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Klasifikasi Surat</p>
                  <p className="font-medium text-slate-700 text-base">{data.nama_surat}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nomor Registrasi / Tracking</p>
                  <p className="font-mono font-bold text-slate-700 text-base">{data.kode_tracking}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Status Pengesahan</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold uppercase tracking-wider">
                    {data.status}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tanggal Penerbitan</p>
                  <p className="font-medium text-slate-700 text-base">{new Date(data.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <Link to="/" className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-colors">
                Tutup Halaman
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
