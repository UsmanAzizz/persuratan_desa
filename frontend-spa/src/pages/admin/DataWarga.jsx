import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Upload, Trash2, Edit, FileSpreadsheet, AlertCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { useToastStore } from '../../store/useToastStore';
import { useHeaderStore } from '../../store/useHeaderStore';
import * as XLSX from 'xlsx';

export const DataWarga = () => {
  const [wargaList, setWargaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nik: '',
    no_kk: '',
    nama_lengkap: '',
    no_hp: '',
    alamat: '',
    rt: '',
    rw: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: 'L',
    agama: 'Islam',
    pekerjaan: '',
    status_perkawinan: 'Belum Kawin',
    dusun: ''
  });

  const fileInputRef = useRef(null);
  const { addToast } = useToastStore();
  const { setHeader, clearHeader } = useHeaderStore();

  const fetchWarga = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/warga', { params: { search } });
      if (res.data.success) {
        setWargaList(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHeader('Data Warga', 'Kelola data induk kependudukan Desa Kutasari.');
    return () => clearHeader();
  }, [setHeader, clearHeader]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchWarga();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (warga = null) => {
    if (warga) {
      setFormData(warga);
      setIsEditing(true);
    } else {
      setFormData({
        nik: '', no_kk: '', nama_lengkap: '', no_hp: '', alamat: '',
        rt: '', rw: '', tempat_lahir: '', tanggal_lahir: '',
        jenis_kelamin: 'L', agama: 'Islam', pekerjaan: '',
        status_perkawinan: 'Belum Kawin', dusun: ''
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiClient.put(`/admin/warga/${formData.nik}`, formData, { showSuccessToast: true });
      } else {
        await apiClient.post('/admin/warga', formData, { showSuccessToast: true });
      }
      setShowModal(false);
      fetchWarga();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (nik) => {
    if (window.confirm('Yakin ingin menghapus data warga ini?')) {
      try {
        await apiClient.delete(`/admin/warga/${nik}`, { showSuccessToast: true });
        fetchWarga();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        // Pemetaan sederhana, asumsi header excel sesuai dengan field DB
        const payload = data.map(row => {
          // Normalize keys
          const normalized = {};
          Object.keys(row).forEach(k => {
            const cleanKey = k.toLowerCase().replace(/\s+/g, '_');
            normalized[cleanKey] = row[k] ? String(row[k]) : '';
          });
          return normalized;
        });

        if (payload.length === 0) {
          addToast('File Excel kosong atau format tidak sesuai', 'error');
          return;
        }

        const res = await apiClient.post('/admin/warga/import-json', payload, { showSuccessToast: true });
        if (res.data.success) {
          fetchWarga();
        }
      } catch (err) {
        console.error(err);
        addToast('Gagal memproses file Excel', 'error');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = null; // reset input
  };

  const downloadTemplate = () => {
    const headers = [['nik', 'no_kk', 'nama_lengkap', 'no_hp', 'alamat', 'rt', 'rw', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'pekerjaan', 'status_perkawinan', 'dusun']];
    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_Warga");
    XLSX.writeFile(wb, "Template_Data_Warga.xlsx");
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col space-y-6 min-h-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari NIK / Nama..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-64 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
          />
          <button 
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-slate-50 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm border border-slate-200 cursor-pointer"
          >
            Download Template
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm border border-emerald-200 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Import
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-500/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden min-h-0">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 shadow-sm">
                <th className="px-6 py-4 font-semibold">NIK & Nama</th>
                <th className="px-6 py-4 font-semibold">Alamat (Dusun)</th>
                <th className="px-6 py-4 font-semibold">TTL / J.Kelamin</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                    Memuat data...
                  </td>
                </tr>
              ) : wargaList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    Belum ada data warga ditemukan.
                  </td>
                </tr>
              ) : (
                wargaList.map((w) => (
                  <tr key={w.nik} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{w.nama_lengkap}</div>
                      <div className="text-slate-500 font-mono text-xs mt-0.5">{w.nik}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">{w.dusun || '-'}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{w.alamat} RT{w.rt}/RW{w.rw}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">{w.tempat_lahir}, {w.tanggal_lahir}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{w.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(w)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Ubah"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(w.nik)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-slate-900">
                {isEditing ? 'Ubah Data Warga' : 'Tambah Data Warga Baru'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">NIK <span className="text-rose-500">*</span></label>
                  <input type="text" name="nik" value={formData.nik} onChange={handleInputChange} disabled={isEditing} required minLength={16} maxLength={16} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:bg-slate-100" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">No KK <span className="text-rose-500">*</span></label>
                  <input type="text" name="no_kk" value={formData.no_kk} onChange={handleInputChange} required minLength={16} maxLength={16} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Nama Lengkap <span className="text-rose-500">*</span></label>
                  <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Tempat Lahir</label>
                  <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Tanggal Lahir</label>
                  <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Jenis Kelamin</label>
                  <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Agama</label>
                  <select name="agama" value={formData.agama} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Alamat Lengkap</label>
                  <input type="text" name="alamat" value={formData.alamat} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">RT / RW</label>
                  <div className="flex gap-2">
                    <input type="text" name="rt" value={formData.rt} onChange={handleInputChange} placeholder="RT" className="w-1/2 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                    <input type="text" name="rw" value={formData.rw} onChange={handleInputChange} placeholder="RW" className="w-1/2 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Dusun <span className="text-rose-500">*</span></label>
                  <select name="dusun" value={formData.dusun} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                    <option value="">Pilih Dusun</option>
                    <option value="Tawangsari">Tawangsari</option>
                    <option value="Grugak">Grugak</option>
                    <option value="Kotabaru">Kotabaru</option>
                    <option value="Curug">Curug</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Pekerjaan</label>
                  <input type="text" name="pekerjaan" value={formData.pekerjaan} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Status Perkawinan</label>
                  <select name="status_perkawinan" value={formData.status_perkawinan} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Kawin">Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-4 flex justify-end gap-3 shrink-0 bg-slate-50 border-t border-slate-100 rounded-b-3xl">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-500/30 cursor-pointer">
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
