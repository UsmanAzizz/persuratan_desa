import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Clock, Activity, CheckCircle, XCircle, FileText, Image as ImageIcon, Maximize2, X, Download } from 'lucide-react';
import { useHeaderStore } from '../../store/useHeaderStore';

export const DetailPengajuan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeader, clearHeader } = useHeaderStore();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('detail');
  
  const [updateForm, setUpdateForm] = useState({ status_baru: 'menunggu', catatan: '', no_surat_rt: '', tgl_surat_rt: '' });
  const [updating, setUpdating] = useState(false);
  
  // State for image viewer modal
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImage, setViewerImage] = useState(null);
  const [viewerTitle, setViewerTitle] = useState('');

  const BASE_URL = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '') : 'http://localhost:8080';

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/admin/pengajuan/${id}`);
        if (res.data.success) {
          const fetchedData = res.data.data;
          setData(fetchedData);
          setUpdateForm({
            status_baru: fetchedData.status,
            catatan: fetchedData.alasan_penolakan || ''
          });
          
          setHeader(
            'Tinjau Pengajuan',
            <>Kode Tracking: <span className="font-mono font-bold text-blue-600">{fetchedData.kode_tracking}</span></>,
            <button 
              onClick={() => navigate('/admin/pengajuan')}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Kembali"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    
    return () => {
      clearHeader();
    };
  }, [id, setHeader, clearHeader, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await apiClient.put(`/admin/pengajuan/${id}/status`, updateForm, { showSuccessToast: true });
      if (res.data.success) {
        // Refresh data or navigate back
        navigate('/admin/pengajuan');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'selesai': return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1">Selesai</Badge>;
      case 'ditolak': return <Badge className="bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1">Ditolak</Badge>;
      case 'diproses': return <Badge className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1">Diproses</Badge>;
      default: return <Badge className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1">Menunggu</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Memuat detail pengajuan...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <XCircle className="w-12 h-12 text-rose-400" />
        <p className="text-slate-500 font-medium">Data pengajuan tidak ditemukan.</p>
        <Button variant="outline" onClick={() => navigate('/admin/pengajuan')}>Kembali</Button>
      </div>
    );
  }

  // Parse data input
  let parsedDataInput = {};
  try {
    parsedDataInput = JSON.parse(data.data_input || '{}');
  } catch(e) {}

  // Separate files from text data
  const files = [];
  const texts = [];
  let keperluanText = '-';
  
  Object.keys(parsedDataInput).forEach(key => {
    const val = parsedDataInput[key];
    if (typeof val === 'string' && val.startsWith('/uploads/')) {
      files.push({ key, url: val });
    } else if (key.toLowerCase() === 'keperluan') {
      keperluanText = val;
    } else {
      texts.push({ key, val });
    }
  });

  const openViewer = (title, url) => {
    setViewerTitle(title);
    setViewerImage(`${BASE_URL}${url}`);
    setViewerOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-180px)] flex flex-col">
      <Card className="border-0 shadow-sm rounded-2xl bg-white flex-1 flex flex-col overflow-hidden">
        {/* Unified Tab Navigation Header */}
        <div className="flex flex-col sm:flex-row border-b border-slate-200 bg-slate-50/80 shrink-0">
          <button
            onClick={() => setActiveTab('detail')}
            className={`flex-1 px-6 py-4 font-bold text-sm transition-all flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'detail' 
                ? 'border-blue-600 text-blue-700 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" /> Detail & Input
          </button>
          <button
            onClick={() => setActiveTab('berkas')}
            className={`flex-1 px-6 py-4 font-bold text-sm transition-all flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'berkas' 
                ? 'border-blue-600 text-blue-700 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Berkas ({files.length})
          </button>
          <button
            onClick={() => setActiveTab('tindak_lanjut')}
            className={`flex-1 px-6 py-4 font-bold text-sm transition-all flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'tindak_lanjut' 
                ? 'border-blue-600 text-blue-700 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" /> Tindak Lanjut
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {/* Tab Content: Detail */}
          {activeTab === 'detail' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
              <CardBody className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Nama Lengkap</p>
                      <p className="text-xl font-black text-slate-800 leading-none">{data.nama_lengkap}</p>
                    </div>
                    <div>
                      {getStatusBadge(data.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Layanan / Jenis Surat</p>
                      <p className="font-bold text-blue-900 text-sm">{data.nama_surat}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Keperluan</p>
                      <p className="font-bold text-blue-900 text-sm line-clamp-2">{keperluanText}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">NIK</p>
                      <p className="font-mono font-bold text-slate-700 text-sm">{data.nik}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">No. KK</p>
                      <p className="font-mono font-bold text-slate-700 text-sm">{data.no_kk || '-'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">No. HP / WA</p>
                      <p className="font-medium text-slate-700 text-sm">{data.no_hp}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">RT / RW</p>
                      <p className="font-medium text-slate-700 text-sm">{data.rt} / {data.rw}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Alamat Lengkap</p>
                    <p className="font-medium text-slate-700 text-sm">{data.alamat}</p>
                  </div>

                  {texts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      {texts.map(t => (
                        <div key={t.key}>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{t.key.replace(/_/g, ' ')}</p>
                          <p className="font-medium text-slate-800 text-sm">{t.val}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardBody>
            </motion.div>
          )}

          {/* Tab Content: Berkas */}
          {activeTab === 'berkas' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col overflow-y-auto">
              <CardBody className="p-6 md:p-8 flex-1 flex flex-col">
                {files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 opacity-50 bg-slate-50 rounded-2xl border border-slate-100">
                    <ImageIcon className="w-16 h-16 text-slate-400 mb-4" />
                    <p className="text-slate-500 font-medium">Tidak ada berkas persyaratan yang dilampirkan.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {files.map((file, idx) => {
                      const title = file.key.replace(/_/g, ' ').toUpperCase();
                      const fullUrl = `${BASE_URL}${file.url}`;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => openViewer(title, file.url)}
                          className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/10 transition-all transform hover:-translate-y-1"
                        >
                          <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center">
                            <img 
                              src={fullUrl} 
                              alt={title}
                              className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="absolute inset-0 hidden items-center justify-center bg-slate-100">
                              <FileText className="w-12 h-12 text-slate-300" />
                            </div>
                            
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                              <div className="bg-white/90 text-slate-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg">
                                <Maximize2 className="w-4 h-4" /> Perbesar Layar
                              </div>
                            </div>
                          </div>
                          <div className="p-4 border-t border-slate-100 text-center bg-white">
                            <p className="font-bold text-slate-700 text-sm truncate">{title}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
              </CardBody>
            </motion.div>
          )}

          {/* Tab Content: Tindak Lanjut */}
          {activeTab === 'tindak_lanjut' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col">
              <form onSubmit={handleUpdate} className="h-full flex flex-col">
                <CardBody className="p-6 md:p-8 flex-1 flex flex-col">
                  <div className="space-y-2 shrink-0 mb-5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ubah Status Menjadi</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {(() => {
                          switch(updateForm.status_baru) {
                            case 'menunggu': return <Clock className="w-5 h-5 text-amber-500" />;
                            case 'diproses': return <Activity className="w-5 h-5 text-blue-500" />;
                            case 'selesai': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
                            case 'ditolak': return <XCircle className="w-5 h-5 text-rose-500" />;
                            default: return <Clock className="w-5 h-5 text-slate-400" />;
                          }
                        })()}
                      </div>
                      <select 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
                        value={updateForm.status_baru}
                        onChange={(e) => setUpdateForm({...updateForm, status_baru: e.target.value})}
                        required
                      >
                        <option value="menunggu">Menunggu Verifikasi (Masuk Antrean)</option>
                        <option value="diproses">Sedang Diproses (Proses Tanda Tangan)</option>
                        <option value="selesai">Selesai / Dapat Diambil</option>
                        <option value="ditolak">Tolak Berkas (Berkas Tidak Valid)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 flex flex-col min-h-0">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex justify-between shrink-0">
                      <span>Catatan Staf / Alasan Penolakan</span>
                      {updateForm.status_baru === 'ditolak' && <span className="text-rose-500">*wajib</span>}
                    </label>
                    <textarea 
                      className="w-full h-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                      placeholder="Tulis pesan untuk warga yang akan dikirim via WhatsApp..."
                      value={updateForm.catatan}
                      onChange={(e) => setUpdateForm({...updateForm, catatan: e.target.value})}
                      required={updateForm.status_baru === 'ditolak'}
                    />
                  </div>
                  
                  {data?.id_jenis_surat == 4 && updateForm.status_baru === 'selesai' && (
                    <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nomor Surat RT</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                          placeholder="01/RT.01/2026"
                          value={updateForm.no_surat_rt}
                          onChange={(e) => setUpdateForm({...updateForm, no_surat_rt: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tanggal Surat RT</label>
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                          value={updateForm.tgl_surat_rt}
                          onChange={(e) => setUpdateForm({...updateForm, tgl_surat_rt: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 mt-4 flex justify-between items-center border-t border-slate-100 shrink-0">
                    <Button type="button" onClick={() => setActiveTab('berkas')} variant="outline" className="rounded-xl px-6 border-slate-200 text-slate-600 font-bold">
                      <ChevronLeft className="w-4 h-4 mr-2" /> Kembali Cek Berkas
                    </Button>
                    <Button type="submit" disabled={updating} className="rounded-xl font-bold py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30">
                      {updating ? 'Menyimpan...' : 'Simpan & Kirim Notifikasi WA'}
                    </Button>
                  </div>
                </CardBody>
              </form>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Modal Viewer Layar Penuh */}
      <AnimatePresence>
        {viewerOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-md"
              onClick={() => setViewerOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full h-full max-w-5xl flex flex-col pointer-events-none"
            >
              {/* Toolbar */}
              <div className="flex justify-between items-center mb-4 pointer-events-auto">
                <h3 className="text-xl font-black text-white tracking-tight">{viewerTitle}</h3>
                <div className="flex gap-3">
                  <a 
                    href={viewerImage} 
                    download 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
                    title="Buka di Tab Baru / Unduh"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => setViewerOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-900 hover:bg-rose-500 hover:text-white transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="flex-grow bg-black/20 rounded-2xl overflow-hidden border border-white/10 relative pointer-events-auto flex items-center justify-center p-2 sm:p-4">
                {/* Asumsi format gambar, jika PDF bisa diganti dengan iframe/object tergantung kapabilitas backend */}
                <img 
                  src={viewerImage} 
                  alt={viewerTitle}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  onError={(e) => {
                    // Fallback to iframe if img fails (e.g. PDF)
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <iframe 
                  src={viewerImage} 
                  title={viewerTitle}
                  className="w-full h-full hidden rounded-lg bg-white"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
