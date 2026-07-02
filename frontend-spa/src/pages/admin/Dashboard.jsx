import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Clock, FileText, CheckCircle, Activity } from 'lucide-react';
import apiClient from '../../services/apiClient';

const StatCard = ({ title, count, icon, bgColor, textColor }) => (
  <Card>
    <CardBody className="flex items-center gap-4 p-6">
      <div className={`p-4 rounded-xl ${bgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className={`text-3xl font-bold ${textColor}`}>{count}</h3>
      </div>
    </CardBody>
  </Card>
);

export const Dashboard = () => {
  const [stats, setStats] = useState({ menunggu: 0, diproses: 0, selesai: 0 });

  useEffect(() => {
    // Ideally this comes from a /api/v1/admin/stats endpoint, 
    // but for now we aggregate from the full list for simplicity
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/admin/pengajuan');
        if (res.data.success) {
          const data = res.data.data;
          setStats({
            menunggu: data.filter(d => d.status === 'menunggu').length,
            diproses: data.filter(d => d.status === 'diproses').length,
            selesai: data.filter(d => d.status === 'selesai').length,
          });
        }
      } catch (e) { }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Ringkasan Sistem</h2>
        <p className="text-slate-500 mt-1">Pantauan lalu lintas antrean pelayanan surat Desa Kutasari.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Menunggu Validasi" 
          count={stats.menunggu} 
          icon={<Clock className="w-8 h-8 text-amber-600" />} 
          bgColor="bg-amber-100" 
          textColor="text-amber-700" 
        />
        <StatCard 
          title="Sedang Diproses" 
          count={stats.diproses} 
          icon={<Activity className="w-8 h-8 text-blue-600" />} 
          bgColor="bg-blue-100" 
          textColor="text-blue-700" 
        />
        <StatCard 
          title="Selesai & Dapat Diambil" 
          count={stats.selesai} 
          icon={<CheckCircle className="w-8 h-8 text-emerald-600" />} 
          bgColor="bg-emerald-100" 
          textColor="text-emerald-700" 
        />
        <StatCard 
          title="Total Dokumen" 
          count={stats.menunggu + stats.diproses + stats.selesai} 
          icon={<FileText className="w-8 h-8 text-slate-600" />} 
          bgColor="bg-slate-100" 
          textColor="text-slate-700" 
        />
      </div>
    </div>
  );
};
