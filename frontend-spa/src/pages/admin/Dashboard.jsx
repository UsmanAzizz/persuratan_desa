import React, { useEffect, useState } from 'react'; // HMR trigger
import { Card, CardBody } from '../../components/ui/Card';
import { Clock, FileText, CheckCircle, Activity, LayoutDashboard } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Inbox } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const StatCard = ({ title, count, icon, bgColor, iconColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden bg-white">
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgColor} opacity-20 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
      <CardBody className="p-6">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">{title}</p>
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{count}</h3>
          </div>
          <div className={`p-4 rounded-2xl ${bgColor} ${iconColor} shadow-inner`}>
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  </motion.div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ menunggu: 0, diproses: 0, selesai: 0 });
  const [recentPending, setRecentPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/admin/pengajuan');
        if (res.data.success) {
          const data = res.data.data;
          
          const menungguList = data.filter(d => d.status === 'menunggu');
          
          setStats({
            menunggu: menungguList.length,
            diproses: data.filter(d => d.status === 'diproses').length,
            selesai: data.filter(d => d.status === 'selesai').length,
          });
          
          setRecentPending(menungguList.slice(0, 5));
        }
      } catch (e) { 
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-10 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Menunggu" 
            count={stats.menunggu} 
            icon={<Clock className="w-6 h-6" />} 
            bgColor="bg-amber-100" 
            iconColor="text-amber-600"
            delay={0.1}
          />
          <StatCard 
            title="Diproses" 
            count={stats.diproses} 
            icon={<Activity className="w-6 h-6" />} 
            bgColor="bg-blue-100" 
            iconColor="text-blue-600"
            delay={0.2}
          />
          <StatCard 
            title="Selesai" 
            count={stats.selesai} 
            icon={<CheckCircle className="w-6 h-6" />} 
            bgColor="bg-emerald-100" 
            iconColor="text-emerald-600"
            delay={0.3}
          />
          <StatCard 
            title="Total" 
            count={stats.menunggu + stats.diproses + stats.selesai} 
            icon={<FileText className="w-6 h-6" />} 
            bgColor="bg-slate-100" 
            iconColor="text-slate-600"
            delay={0.4}
          />
      </div>

      {/* Bagian Bawah: Antrean Perlu Perhatian */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-800">Antrean Perlu Perhatian</h2>
            <p className="text-sm text-slate-500">Permohonan terbaru yang belum diverifikasi.</p>
          </div>
          <Link to="/admin/pengajuan" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Lihat Semua Antrean <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex justify-center text-slate-400">
            Memuat data...
          </div>
        ) : recentPending.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Semua Bersih!</h3>
            <p className="text-sm text-slate-500">Tidak ada antrean surat baru yang menunggu untuk diproses saat ini.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    <th className="py-4 px-6 whitespace-nowrap">Pemohon</th>
                    <th className="py-4 px-6 whitespace-nowrap">Layanan</th>
                    <th className="py-4 px-6 whitespace-nowrap">Waktu Masuk</th>
                    <th className="py-4 px-6 text-right whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentPending.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-800 text-sm">{item.nama_lengkap}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{item.kode_tracking}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700">
                          {item.nama_surat}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-slate-600 font-medium">
                          {item.created_at 
                            ? format(new Date(item.created_at), 'dd MMM yyyy, HH:mm', { locale: id }) 
                            : '-'}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => navigate(`/admin/pengajuan/${item.id}`)}
                          className="inline-flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                        >
                          Tinjau Berkas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
