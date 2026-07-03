import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import { Clock, FileText, CheckCircle, Activity, LayoutDashboard } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
  const [stats, setStats] = useState({ menunggu: 0, diproses: 0, selesai: 0 });

  useEffect(() => {
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
      </div>
  );
};
