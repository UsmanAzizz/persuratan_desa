import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import apiClient from '../../services/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, X, FileText, Search, Filter, Clock, Activity, CheckCircle, XCircle } from 'lucide-react';

export const AntreanSurat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState('semua');
  const [sortTime, setSortTime] = useState('terbaru');
  const [filterJenis, setFilterJenis] = useState('semua');
  const [jenisSuratList, setJenisSuratList] = useState([]);

  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status_baru: '', catatan: '' });
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/pengajuan');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const fetchJenis = async () => {
      try {
        const res = await apiClient.get('/pengajuan/jenis-surat');
        if (res.data.success) {
          setJenisSuratList(res.data.data);
        }
      } catch (error) {}
    };
    fetchJenis();
  }, []);

  const openActionModal = (pengajuan) => {
    setSelectedPengajuan(pengajuan);
    setUpdateForm({ status_baru: pengajuan.status, catatan: '' });
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await apiClient.put(`/admin/pengajuan/${selectedPengajuan.id_pengajuan}/status`, updateForm, { showSuccessToast: true });
      if (res.data.success) {
        setModalOpen(false);
        fetchData(); // Refresh table
      }
    } catch (error) {
    } finally {
      setUpdating(false);
    }
  };

  // Helper status color mapping
  const getStatusBadge = (status) => {
    switch(status) {
      case 'selesai': return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Selesai</Badge>;
      case 'ditolak': return <Badge className="bg-rose-100 text-rose-700 border border-rose-200">Ditolak</Badge>;
      case 'diproses': return <Badge className="bg-blue-100 text-blue-700 border border-blue-200">Diproses</Badge>;
      default: return <Badge className="bg-amber-100 text-amber-700 border border-amber-200">Menunggu</Badge>;
    }
  };

  // Filter and Sort Logic
  const filteredData = useMemo(() => {
    let result = [...data];
    if (filterStatus !== 'semua') {
      result = result.filter(item => item.status === filterStatus);
    }
    if (filterJenis !== 'semua') {
      result = result.filter(item => item.nama_surat === filterJenis);
    }
    
    // Sort by ID to approximate time (assuming auto increment ID)
    result.sort((a, b) => {
      if (sortTime === 'terbaru') {
        return b.id_pengajuan - a.id_pengajuan;
      } else {
        return a.id_pengajuan - b.id_pengajuan;
      }
    });
    
    return result;
  }, [data, filterStatus, sortTime]);

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Judul Halaman kini telah dipindah ke bagian Navbar (AdminLayout) */}

      {/* Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="w-4 h-4 text-slate-400" />
            </div>
            <select
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none shadow-sm cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="semua">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <select
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none shadow-sm cursor-pointer"
              value={sortTime}
              onChange={(e) => setSortTime(e.target.value)}
            >
              <option value="terbaru">Terbaru</option>
              <option value="terlama">Terlama</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <select
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none shadow-sm cursor-pointer w-56 truncate"
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
            >
              <option value="semua">Semua Jenis Layanan</option>
              {jenisSuratList.map((jenis) => (
                <option key={jenis.id_jenis_surat} value={jenis.nama_surat}>
                  {jenis.nama_surat}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="text-sm font-bold text-slate-400 px-2">
          Menampilkan <span className="text-blue-600">{filteredData.length}</span> data
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white mt-4">
        <CardBody className="p-0">
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50/80 border-b border-blue-100">
                  <th className="px-6 py-4 text-xs font-bold text-blue-800 tracking-wide w-48">Kode / Tgl</th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-800 tracking-wide">Identitas Warga</th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-800 tracking-wide">Jenis Layanan</th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-800 tracking-wide">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-blue-800 tracking-wide text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-50">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-sm font-medium text-slate-500">Memuat data antrean...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-50">
                          <FileSearch className="w-12 h-12 text-slate-400" />
                          <p className="text-sm font-medium text-slate-500">Tidak ada antrean yang sesuai filter.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, index) => (
                      <motion.tr 
                        key={row.id_pengajuan}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: (index % 10) * 0.05 }}
                        className="hover:bg-blue-50/40 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <p className="text-sm font-mono font-black text-slate-800">{row.kode_tracking}</p>
                          <p className="text-xs text-slate-400 mt-1">{row.tgl_pengajuan}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-slate-800">{row.nama_lengkap}</p>
                          <p className="text-xs font-mono text-slate-500 mt-1">{row.nik}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                              <FileText className="w-4 h-4" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700">{row.nama_surat}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {getStatusBadge(row.status)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Button size="sm" variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 font-semibold" onClick={() => openActionModal(row)}>
                            <Search className="w-4 h-4 mr-2" /> Tinjau
                          </Button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Modal Mutasi Status */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <Card className="shadow-2xl border-0 overflow-hidden rounded-3xl bg-white">
                <div className="px-8 py-6 bg-white border-b border-slate-100 flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Tinjauan Surat</p>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight font-mono">{selectedPengajuan?.kode_tracking}</h3>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors relative z-10">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <form onSubmit={handleUpdate}>
                  <CardBody className="space-y-6 p-8">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Pemohon</p>
                          <p className="font-bold text-slate-800 text-sm">{selectedPengajuan?.nama_lengkap}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Layanan</p>
                          <p className="font-bold text-slate-800 text-sm">{selectedPengajuan?.nama_surat}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
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
                          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm font-semibold text-slate-700 focus:border-blue-500 focus:ring-0 outline-none transition-colors appearance-none cursor-pointer"
                          value={updateForm.status_baru}
                          onChange={(e) => setUpdateForm({...updateForm, status_baru: e.target.value})}
                          required
                        >
                          <option value="menunggu">Menunggu Verifikasi</option>
                          <option value="diproses">Sedang Diproses</option>
                          <option value="selesai">Selesai / Dapat Diambil</option>
                          <option value="ditolak">Tolak Berkas</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex justify-between">
                        <span>Catatan Staf</span>
                        {updateForm.status_baru === 'ditolak' && <span className="text-rose-500">*wajib</span>}
                      </label>
                      <textarea 
                        rows={3}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm focus:border-blue-500 focus:ring-0 outline-none transition-colors resize-none"
                        placeholder="Tulis alasan jika ditolak, atau pesan untuk warga..."
                        value={updateForm.catatan}
                        onChange={(e) => setUpdateForm({...updateForm, catatan: e.target.value})}
                        required={updateForm.status_baru === 'ditolak'}
                      />
                    </div>
                  </CardBody>
                  <div className="px-8 py-5 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3">
                    <Button type="button" variant="outline" className="rounded-xl font-bold border-slate-200" onClick={() => setModalOpen(false)}>Batal</Button>
                    <Button type="submit" isLoading={updating} className="rounded-xl font-bold px-6 shadow-md shadow-blue-600/20">Simpan Status</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
