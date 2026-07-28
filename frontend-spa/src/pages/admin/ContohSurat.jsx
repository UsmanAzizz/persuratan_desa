import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const JENIS_SURAT = [
  { id: 'sku', nama: 'SKU (Surat Keterangan Usaha)' },
  { id: 'skd', nama: 'SKD (Surat Keterangan Domisili)' },
  { id: 'skck', nama: 'Pengantar SKCK' },
  { id: 'sktm', nama: 'SKTM (Surat Keterangan Tidak Mampu)' },
  { id: 'skw', nama: 'SKW (Surat Keterangan Wali)' },
  { id: 'ik', nama: 'Surat Izin Keramaian' },
  { id: 'n1', nama: 'Surat Pengantar Nikah (N1)' }
];

export const ContohSurat = () => {
  const [activeTab, setActiveTab] = useState(JENIS_SURAT[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Endpoint PDF (Kirim token via query string agar bisa divalidasi oleh backend, atau backend buka route ini dari filter JWT)
  // Tunggu, backend JWT filter di CI4 tidak membaca $_GET['token']. Dia membaca Authorization Bearer.
  // Jika iframe, tidak bisa kirim Authorization header. Solusi: buka akses JWT atau gunakan JWT via Query di Backend.
  // Untuk mempercepat, saya akan fetch blob via axios, lalu jadikan URL.
  
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  React.useEffect(() => {
    let isMounted = true;
    const fetchPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('jwt_token');
        const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
        const response = await fetch(`${baseURL}/admin/pengaturan/contoh-surat/${activeTab}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          let errMsg = 'Gagal memuat pratinjau surat.';
          try {
            const errData = await response.json();
            errMsg = errData.message || errMsg;
          } catch(e) {}
          throw new Error(errMsg);
        }
        
        const blob = await response.blob();
        if (isMounted) {
          const url = URL.createObjectURL(blob);
          setPdfBlobUrl(url);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchPdf();
    
    return () => {
      isMounted = false;
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/admin/pengaturan-akun" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-2 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Pengaturan
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            Contoh Format Surat
          </h1>
          <p className="text-slate-500 mt-1">
            Pratinjau tampilan format surat cetak (PDF) menggunakan data fiktif.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigasi Surat */}
        <div className="lg:col-span-1 space-y-2">
          {JENIS_SURAT.map((surat) => (
            <button
              key={surat.id}
              onClick={() => setActiveTab(surat.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === surat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {surat.nama}
            </button>
          ))}
        </div>

        {/* Area Preview PDF */}
        <div className="lg:col-span-3">
          <div className="w-full h-[800px] sm:aspect-[21/29.7] sm:h-auto bg-white relative flex items-center justify-center overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-3 text-blue-500" />
                <p>Memuat Dokumen...</p>
              </div>
            ) : pdfBlobUrl ? (
              <>
                {/* Pratinjau PDF (Desktop - Native Viewer) */}
                <iframe
                  src={`${pdfBlobUrl}#toolbar=0`}
                  className="hidden sm:block w-full h-full border-0"
                  title="PDF Preview Desktop"
                />
                {/* Pratinjau PDF (Mobile - Isolated Iframe PDF.js) */}
                <iframe
                  src={`/pdf-viewer.html?file=${encodeURIComponent(pdfBlobUrl)}`}
                  className="block sm:hidden w-full h-full border-none pointer-events-none"
                  scrolling="no"
                  title="PDF Preview Mobile"
                />
              </>
            ) : (
              <div className="text-slate-400">{error || 'Gagal memuat pratinjau surat.'}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContohSurat;
