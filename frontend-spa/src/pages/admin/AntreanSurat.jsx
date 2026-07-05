import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import apiClient from '../../services/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, X, FileText, Search, Filter, Clock, Activity, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AntreanSurat = () => {
  const navigate = useNavigate();
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
      const res = await apiClient.get(`/admin/pengajuan?t=${new Date().getTime()}`);
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
    navigate(`/admin/pengajuan/${pengajuan.id_pengajuan}`);
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
    <div className="w-full h-full flex-1 flex flex-col min-h-0 max-w-7xl mx-auto">
      {/* Judul Halaman kini telah dipindah ke bagian Navbar (AdminLayout) */}

      {/* Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            onClick={fetchData} 
            disabled={loading}
            className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Segarkan</span>
          </Button>
          
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
              {jenisSuratList.map((jenis, idx) => (
                <option key={jenis.id_jenis || idx} value={jenis.nama_surat}>
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

      <Card className="border-0 shadow-sm rounded-2xl bg-white mt-4 flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="overflow-auto flex-1">
          <div className="w-full min-w-max">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="z-20 relative">
                <tr>
                  <th className="sticky top-0 px-6 py-4 text-xs font-bold text-blue-800 tracking-wide w-32 border-b border-blue-100 bg-blue-50 z-20">Kode / Tgl</th>
                  <th className="sticky top-0 px-6 py-4 text-xs font-bold text-blue-800 tracking-wide border-b border-blue-100 bg-blue-50 z-20">Identitas Warga</th>
                  <th className="sticky top-0 px-6 py-4 text-xs font-bold text-blue-800 tracking-wide border-b border-blue-100 bg-blue-50 z-20">Jenis Layanan</th>
                  <th className="sticky top-0 px-6 py-4 text-xs font-bold text-blue-800 tracking-wide border-b border-blue-100 bg-blue-50 z-20">Status</th>
                  <th className="sticky top-0 px-6 py-4 text-xs font-bold text-blue-800 tracking-wide text-right border-b border-blue-100 bg-blue-50 z-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 relative z-0">
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
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono font-black text-slate-800">{row.kode_tracking}</p>
                          <p className="text-xs text-slate-400 mt-1">{row.tgl_pengajuan}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{row.nama_lengkap}</p>
                          <p className="text-xs font-mono text-slate-500 mt-1">{row.nik}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-slate-700 max-w-[200px] truncate" title={row.nama_surat}>{row.nama_surat}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(row.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-xl border-slate-200 text-slate-600 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 font-semibold" 
                            onClick={() => openActionModal(row)}
                          >
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
        </div>
      </Card>
    </div>
  );
};
