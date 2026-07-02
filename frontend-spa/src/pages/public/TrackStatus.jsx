import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import apiClient from '../../services/apiClient';
import { Search, Clock, CheckCircle, FileText, XCircle } from 'lucide-react';

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

  useEffect(() => {
    if (initialCode) {
      handleSearch();
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
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
          <Card>
            <CardBody className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div>
                <p className="text-sm text-slate-500">Pemohon</p>
                <h3 className="font-semibold text-slate-800 text-lg">{data.nama_lengkap}</h3>
                <p className="text-sm font-medium text-slate-600 mt-1">Surat: {data.nama_surat}</p>
                <p className="text-xs text-slate-400 mt-1">Diajukan pada: {data.tgl_pengajuan}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge 
                  variant={
                    data.status === 'selesai' ? 'success' : 
                    data.status === 'ditolak' ? 'danger' : 
                    data.status === 'diproses' ? 'info' : 'warning'
                  }
                  className="px-4 py-1.5 text-sm uppercase"
                >
                  {data.status}
                </Badge>
                {data.status === 'ditolak' && (
                  <p className="text-xs text-rose-600 max-w-xs text-right">Alasan: {data.alasan_penolakan}</p>
                )}
              </div>
            </CardBody>
          </Card>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 px-1">Riwayat Proses</h3>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="relative border-l border-slate-200 ml-3 space-y-8">
                {data.riwayat.map((history, idx) => (
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
