import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import apiClient from '../../services/apiClient';

export const AntreanSurat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Antrean Surat</h2>
        <p className="text-slate-500 mt-1">Daftar seluruh manifes permohonan yang diajukan oleh masyarakat.</p>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kode/Tgl</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Identitas Warga</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Jenis Layanan</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">Memuat data...</td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">Belum ada antrean surat saat ini.</td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id_pengajuan} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono font-bold text-blue-600">{row.kode_tracking}</p>
                        <p className="text-xs text-slate-400 mt-1">{row.tgl_pengajuan}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-800">{row.nama_lengkap}</p>
                        <p className="text-xs text-slate-500 font-mono mt-1">{row.nik}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-700">{row.nama_surat}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          row.status === 'selesai' ? 'success' : 
                          row.status === 'ditolak' ? 'danger' : 
                          row.status === 'diproses' ? 'info' : 'warning'
                        } className="uppercase">
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button size="sm" variant="outline" onClick={() => openActionModal(row)}>
                          Tinjau & Ubah
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Modal Mutasi Status */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <Card className="w-full max-w-lg shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Tinjauan Surat: {selectedPengajuan?.kode_tracking}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleUpdate}>
              <CardBody className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">Pemohon: <span className="font-semibold text-slate-800">{selectedPengajuan?.nama_lengkap}</span></p>
                  <p className="text-sm text-slate-600">Keperluan: <span className="font-medium text-slate-800">{selectedPengajuan?.nama_surat}</span></p>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Pembaruan Status</label>
                  <select 
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    value={updateForm.status_baru}
                    onChange={(e) => setUpdateForm({...updateForm, status_baru: e.target.value})}
                    required
                  >
                    <option value="menunggu">Menunggu</option>
                    <option value="diproses">Sedang Diproses</option>
                    <option value="selesai">Selesai / Dapat Diambil</option>
                    <option value="ditolak">Tolak Berkas</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Catatan Eksekutor {updateForm.status_baru === 'ditolak' && <span className="text-rose-500">*wajib</span>}
                  </label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Tulis pesan/alasan kepada pemohon (Muncul di layar pelacakan)"
                    value={updateForm.catatan}
                    onChange={(e) => setUpdateForm({...updateForm, catatan: e.target.value})}
                    required={updateForm.status_baru === 'ditolak'}
                  />
                </div>
              </CardBody>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
                <Button type="submit" isLoading={updating}>Simpan Perubahan</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
