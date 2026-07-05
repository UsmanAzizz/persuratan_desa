import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Printer } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToastStore } from '../../store/useToastStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Laporan = () => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState({ total: 0, disetujui: 0, ditolak: 0 });
  const [reportData, setReportData] = useState([]);
  const addToast = useToastStore(state => state.addToast);

  // Temporary hook to hold raw data for debugging
  const [debugRawData, setDebugRawData] = useState([]);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/pengajuan');
      if (res?.data?.success) {
        const allData = Array.isArray(res.data.data) ? res.data.data : [];
        processReport(allData, startDate, endDate);
      } else {
        throw new Error('API response unsuccessful');
      }
    } catch (error) {
      console.error("Fetch Laporan Error:", error);
      addToast(error.message || 'Gagal memuat data laporan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const processReport = (rawData, start, end) => {
    if (!start || !end) {
      setReportData([]);
      setSummary({ total: 0, disetujui: 0, ditolak: 0 });
      return;
    }

    const filtered = rawData.filter(item => {
      try {
        if (!item.tgl_pengajuan) return false;
        
        const dateOnly = String(item.tgl_pengajuan).substring(0, 10);
        return dateOnly >= start && dateOnly <= end;
      } catch (e) {
        return false;
      }
    });

    let total = filtered.length;
    let disetujui = 0;
    let ditolak = 0;

    const groupByJenis = {};

    filtered.forEach(item => {
      if (item.status === 'selesai') disetujui++;
      else if (item.status === 'ditolak') ditolak++;

      const k = item.nama_surat || 'Surat Lainnya';
      if (!groupByJenis[k]) {
        groupByJenis[k] = { nama: k, total: 0, disetujui: 0, ditolak: 0 };
      }
      groupByJenis[k].total++;
      if (item.status === 'selesai') groupByJenis[k].disetujui++;
      else if (item.status === 'ditolak') groupByJenis[k].ditolak++;
    });

    setSummary({ total, disetujui, ditolak });
    setReportData(Object.values(groupByJenis));
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const exportPDF = () => {
    if (reportData.length === 0) {
      addToast('Tidak ada data untuk dicetak', 'error');
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.text('Pemerintah Desa Kutasari', 105, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Laporan Pelayanan Surat', 105, 22, { align: 'center' });
    
    doc.setFontSize(10);
    const startStr = startDate ? format(new Date(startDate), 'dd MMM yyyy', { locale: id }) : 'Awal';
    const endStr = endDate ? format(new Date(endDate), 'dd MMM yyyy', { locale: id }) : 'Akhir';
    doc.text(`Periode: ${startStr} - ${endStr}`, 105, 28, { align: 'center' });

    // Table
    const tableColumn = ["Jenis Surat", "Total", "Disetujui", "Ditolak"];
    const tableRows = [];

    reportData.forEach(item => {
      tableRows.push([
        item.nama,
        item.total,
        item.disetujui,
        item.ditolak
      ]);
    });
    
    // Footer row
    tableRows.push([
        'Total Keseluruhan',
        summary.total,
        summary.disetujui,
        summary.ditolak
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85] }, // slate-700
      didParseCell: function(data) {
        // Bold the last row
        if (data.row.index === tableRows.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [248, 250, 252]; // slate-50
        }
      }
    });

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLaporan();
  };

  return (
    <div className="mt-4">
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        
        {/* FILTER & ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <form onSubmit={handleFilter} className="flex items-start gap-3 w-full sm:w-auto">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Mulai</label>
              <input 
                type="date" 
                value={startDate}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  // Auto-koreksi endDate jika tanggal mulai melebihi tanggal selesai
                  if (e.target.value && endDate && e.target.value > endDate) {
                    setEndDate(e.target.value);
                  }
                }}
                className="h-10 px-3 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-auto cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Sampai</label>
              <input 
                type="date" 
                value={endDate}
                min={startDate || undefined}
                disabled={!startDate}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 px-3 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 w-full sm:w-auto cursor-pointer"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-xs font-semibold text-transparent mb-1.5 select-none pointer-events-none" aria-hidden="true">&nbsp;</label>
              <Button type="submit" isLoading={loading} className="h-10 px-5 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer shadow-sm transition-colors w-full sm:w-auto">
                Tampilkan
              </Button>
            </div>
          </form>

          <div className="flex flex-col w-full sm:w-auto">
            <label className="block text-xs font-semibold text-transparent mb-1.5 select-none pointer-events-none" aria-hidden="true">&nbsp;</label>
            <button 
              type="button" 
              onClick={exportPDF} 
              disabled={reportData.length === 0}
              className="h-10 px-5 text-sm rounded-md border border-slate-300 bg-white text-black font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all w-full sm:w-auto disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed disabled:shadow-none [&:not(:disabled)]:hover:bg-blue-600 [&:not(:disabled)]:hover:text-white [&:not(:disabled)]:hover:border-blue-600"
            >
              <Printer className="w-4 h-4" /> Cetak Laporan
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4 w-1/2">Jenis Surat</th>
                <th className="py-3 px-4 text-center">Total</th>
                <th className="py-3 px-4 text-center">Disetujui</th>
                <th className="py-3 px-4 text-center">Ditolak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center text-slate-400">
                    <p>{(!startDate || !endDate) ? 'Silakan pilih rentang tanggal dan tekan Tampilkan' : 'Belum ada data pada rentang tanggal tersebut'}</p>
                  </td>
                </tr>
              ) : (
                reportData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium">{item.nama}</td>
                    <td className="py-3 px-4 text-center font-semibold">{item.total}</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-medium">{item.disetujui}</td>
                    <td className="py-3 px-4 text-center text-rose-600 font-medium">{item.ditolak}</td>
                  </tr>
                ))
              )}
            </tbody>
            {reportData.length > 0 && (
              <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800">
                <tr>
                  <td className="py-3 px-4 text-right">Total Keseluruhan</td>
                  <td className="py-3 px-4 text-center">{summary.total}</td>
                  <td className="py-3 px-4 text-center text-emerald-600">{summary.disetujui}</td>
                  <td className="py-3 px-4 text-center text-rose-600">{summary.ditolak}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

      </div>
    </div>
  );
};
