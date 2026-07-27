import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { CheckCircle, XCircle, RotateCcw, FileText, User, Calendar, Loader2, AlertCircle } from 'lucide-react';

export const ValidasiKades = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  
  // Modal Penolakan
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [pdfKey, setPdfKey] = useState(Date.now()); // Untuk me-refresh iframe PDF

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchDetail = async () => {
    try {
      const res = await apiClient.get(`/kades/detail/${token}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Gagal memuat data validasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (aksi, alasan = '') => {
    if (aksi === 'tolak' && !alasan.trim()) {
      alert('Alasan penolakan wajib diisi');
      return;
    }
    
    if (aksi === 'terima' && !window.confirm('Anda yakin ingin menyetujui dan menandatangani surat ini secara digital?')) {
      return;
    }

    if (aksi === 'batalkan' && !window.confirm('Anda yakin ingin membatalkan persetujuan? Surat akan ditarik kembali.')) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.post(`/kades/aksi/${token}`, {
        aksi,
        alasan
      });
      if (res.data.success) {
        if (aksi === 'tolak') setShowRejectModal(false);
        // Refresh data dan PDF iframe
        await fetchDetail();
        setPdfKey(Date.now());
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Gagal menyimpan aksi');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Memuat data surat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Akses Ditolak</h2>
          <p className="text-slate-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isSelesai = data.status === 'selesai' || data.status === 'disetujui_kades';
  const isDitolak = data.status === 'ditolak_kades';
  const isDiproses = data.status === 'diproses';

  // Base URL for PDF Preview
  // Tambahkan query timestamp agar iframe reload saat state berubah
  const pdfUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/kades/preview/${token}?t=${pdfKey}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="text-blue-600" /> Validasi Kepala Desa
            </h1>
            <p className="text-slate-500 text-sm mt-1">Tinjau dan setujui draf surat sebelum diterbitkan ke warga.</p>
          </div>
          
          <div>
            {isSelesai && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm border border-emerald-200">
                <CheckCircle className="w-4 h-4" /> Sudah Disetujui
              </span>
            )}
            {isDitolak && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-100 text-rose-800 font-bold text-sm border border-rose-200">
                <XCircle className="w-4 h-4" /> Anda Tolak
              </span>
            )}
            {isDiproses && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 text-amber-800 font-bold text-sm border border-amber-200">
                <Loader2 className="w-4 h-4" /> Menunggu Validasi Anda
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* KOLOM KIRI: Info Warga & Tombol Aksi */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Info Pemohon */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Identitas Pemohon
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Nama Lengkap</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">{data.nama_lengkap}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">NIK</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">{data.nik}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Jenis Surat</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">{data.nama_surat}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Tanggal Pengajuan
                  </p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">
                    {new Intl.DateTimeFormat('id-ID', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }).format(new Date(data.created_at)).replace('.', ':')} WIB
                  </p>
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Aksi Validasi</h3>
              
              {isDiproses && (
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleAction('terima')}
                    disabled={submitting}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm shadow-emerald-600/30 disabled:opacity-70 cursor-pointer"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    Terima & Tanda Tangani
                  </button>
                  <button 
                    onClick={() => setShowRejectModal(true)}
                    disabled={submitting}
                    className="w-full py-3 bg-white hover:bg-rose-50 text-rose-600 border-2 border-rose-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
                  >
                    <XCircle className="w-5 h-5" /> Tolak Surat
                  </button>
                </div>
              )}

              {isSelesai && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-slate-500 text-center mb-1">Surat ini telah Anda setujui dan memiliki QR Code sah.</p>
                  <button 
                    onClick={() => handleAction('batalkan')}
                    disabled={submitting}
                    className="w-full py-3 bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <RotateCcw className="w-5 h-5" />}
                    Batalkan Persetujuan
                  </button>
                </div>
              )}

              {isDitolak && (
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                    <p className="text-xs font-semibold text-rose-800 mb-1">Alasan Penolakan:</p>
                    <p className="text-sm text-rose-700 italic">{data.alasan_penolakan}</p>
                  </div>
                  <button 
                    onClick={() => handleAction('batalkan')}
                    disabled={submitting}
                    className="w-full mt-2 py-3 bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <RotateCcw className="w-5 h-5" />}
                    Tarik Kembali Penolakan
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* KOLOM KANAN: PDF Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[800px] flex flex-col">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Preview Dokumen</span>
                {isSelesai ? (
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded">Ber-TTD QR</span>
                ) : (
                  <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-1 rounded">Draf (Belum TTD)</span>
                )}
              </div>
              <iframe 
                src={pdfUrl} 
                title="Preview PDF" 
                className="w-full flex-1 border-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Penolakan */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" /> Alasan Penolakan
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4">Berikan alasan mengapa surat ini ditolak. Alasan akan dikirimkan ke warga via WhatsApp.</p>
              <textarea 
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Dokumen KK yang dilampirkan buram/tidak terbaca..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none transition-all text-sm resize-none"
              />
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={() => handleAction('tolak', rejectReason)}
                disabled={submitting || !rejectReason.trim()}
                className="px-5 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
