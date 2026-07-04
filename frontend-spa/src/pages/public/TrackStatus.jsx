import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import apiClient from '../../services/apiClient';
import { Search, Clock, CheckCircle, FileText, XCircle, User, Calendar, Download, Share2 } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '') : 'http://localhost:8080';

const StatusIcon = ({ status }) => {
  switch(status) {
    case 'menunggu': return <Clock className="w-6 h-6 text-amber-500" />;
    case 'diproses': return <FileText className="w-6 h-6 text-blue-500" />;
    case 'selesai': return <CheckCircle className="w-6 h-6 text-emerald-500" />;
    case 'ditolak': return <XCircle className="w-6 h-6 text-rose-500" />;
    default: return <Clock className="w-6 h-6 text-slate-500" />;
  }
};

export const TrackStatus = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  
  const [trackCode, setTrackCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!trackCode) return;
    
    setLoading(true);
    setSearchParams({ code: trackCode });
    
    try {
      const res = await apiClient.get(`/pengajuan/track/${trackCode}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      setData(null);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleShareFile = async (filePath, filename) => {
    try {
      // Ambil file fisik dari server
      const response = await fetch(`${BASE_URL}/${filePath}`);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'application/pdf' });

      // Cek apakah HP mendukung Web Share API untuk File
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Surat Desa Kutasari',
          text: 'Berikut adalah dokumen surat resmi dari Desa Kutasari.',
          files: [file]
        });
      } else {
        // Fallback jika tidak mendukung (Kirim Link biasa)
        window.open(`https://wa.me/?text=${encodeURIComponent(`Berikut adalah tautan dokumen surat saya dari Desa Kutasari:\n${BASE_URL}/${filePath}`)}`, '_blank');
      }
    } catch (error) {
      console.error('Gagal membagikan file:', error);
      alert('Gagal membagikan dokumen secara langsung. Silakan unduh terlebih dahulu.');
    }
  };

  useEffect(() => {
    if (initialCode) {
      handleSearch();
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-20">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Lacak Status Surat</h1>
        <p className="text-slate-500 mt-2">Masukkan Kode Pelacakan (Tracking Code) untuk melihat histori proses pembuatan surat Anda.</p>
      </div>

      <Card className="mb-8 p-2">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <Input 
              id="track"
              placeholder="Contoh: TRK-A1B2C3" 
              value={trackCode}
              onChange={(e) => setTrackCode(e.target.value)}
              required
            />
          </div>
          <Button type="submit" isLoading={loading} className="gap-2 px-6">
            <Search className="w-4 h-4" /> Cari
          </Button>
        </form>
      </Card>

      {searched && !data && !loading && (
        <div className="text-center py-10 bg-white rounded-xl border border-slate-200 border-dashed">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-700 font-medium">Pengajuan Tidak Ditemukan</h3>
          <p className="text-slate-500 text-sm mt-1">Periksa kembali Kode Pelacakan yang Anda masukkan.</p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <Card className="shadow-md border border-slate-200 overflow-hidden rounded-t-none sm:rounded-t-xl">
            {(() => {
              const getTheme = (status) => {
                switch(status) {
                  case 'selesai': return { bg: 'bg-emerald-600', border: 'border-emerald-700', label: 'text-emerald-100' };
                  case 'ditolak': return { bg: 'bg-rose-600', border: 'border-rose-700', label: 'text-rose-100' };
                  case 'diproses': return { bg: 'bg-blue-600', border: 'border-blue-700', label: 'text-blue-100' };
                  case 'menunggu': 
                  default: return { bg: 'bg-amber-500', border: 'border-amber-600', label: 'text-amber-100' };
                }
              };
              const theme = getTheme(data.status);
              
              return (
                <div className={`${theme.bg} border-b ${theme.border} p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-500`}>
                  <div>
                    <p className={`text-[11px] font-bold ${theme.label} uppercase tracking-widest mb-1`}>Kode Pelacakan</p>
                    <p className="font-mono font-black text-white text-lg tracking-tight">
                      {data.tracking_code || trackCode}
                    </p>
                  </div>
                  <div className="px-5 py-2 rounded-xl text-sm uppercase font-black shadow-sm bg-white/20 border border-white/30 text-white backdrop-blur-sm tracking-wider">
                    {data.status}
                  </div>
                </div>
              );
            })()}
            
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nama Pemohon</p>
                  <p className="font-bold text-slate-900 text-lg leading-tight">{data.nama_lengkap}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Jenis Surat</p>
                  <p className="font-medium text-slate-800 leading-snug">{data.nama_surat}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tanggal Masuk</p>
                  <p className="font-medium text-slate-800 leading-snug">{data.tgl_pengajuan}</p>
                </div>
              </div>

              {data.status === 'ditolak' && (
                <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-lg">
                  <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">Alasan Penolakan</p>
                  <p className="text-sm font-semibold text-rose-800">{data.alasan_penolakan}</p>
                </div>
              )}

              {data.status === 'selesai' && data.file_path && (
                <div className="mt-6 p-6 bg-emerald-50 border border-emerald-100 rounded-lg flex flex-col gap-4">
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-emerald-800">Dokumen Resmi Telah Diterbitkan</h4>
                    <p className="text-sm text-emerald-600 mt-1">Surat permohonan Anda telah disahkan dan ditandatangani oleh Kepala Desa Kutasari. Silakan unduh salinan digital surat Anda di bawah ini.</p>
                  </div>
                  
                  {/* Pratinjau PDF (Desktop - Native Viewer) */}
                  <div className="hidden sm:block w-full aspect-[21/29.7] border border-emerald-200 rounded-lg overflow-hidden bg-white shadow-inner">
                    <iframe 
                      src={`${BASE_URL}/${data.file_path}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`} 
                      className="w-full h-full pointer-events-none"
                      scrolling="no"
                      title="Pratinjau Surat Desktop"
                    />
                  </div>

                  {/* Pratinjau PDF (Mobile - Isolated Iframe PDF.js) */}
                  <div className="block sm:hidden w-full aspect-[21/29.7] border border-emerald-200 rounded-lg overflow-hidden bg-white shadow-inner">
                    <iframe 
                      src={`/pdf-viewer.html?file=${encodeURIComponent(`${BASE_URL}/${data.file_path}`)}`}
                      className="w-full h-full border-none pointer-events-none"
                      scrolling="no"
                      title="Pratinjau Surat Mobile"
                    />
                  </div>

                  {/* Tombol Aksi */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <a 
                      href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'}/pengajuan/download/${data.file_path.split('/').pop()}`}
                      className="flex-1 flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </a>
                    <button 
                      onClick={() => handleShareFile(data.file_path, `Surat_${data.nama_surat.replace(/\s+/g, '_')}_${data.tracking_code}.pdf`)}
                      className="flex-1 flex justify-center items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Kirim ke WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 px-1">Riwayat Proses</h3>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="relative border-l border-slate-200 ml-3 space-y-8">
                {[...data.riwayat].reverse().map((history, idx) => (
                  <div key={idx} className="relative pl-6">
                    <span className="absolute -left-4 bg-white p-1 rounded-full">
                      <StatusIcon status={history.status_baru} />
                    </span>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                        {history.status_baru}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">{history.catatan}</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-400">
                        <span>{history.created_at}</span>
                        {history.nama_petugas && <span>&bull; Oleh: {history.nama_petugas}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
