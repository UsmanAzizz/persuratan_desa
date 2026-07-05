import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, Shield, ChevronRight, LifeBuoy, Smartphone, BarChart, Users, Settings } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import { useHeaderStore } from '../../store/useHeaderStore';

const SidebarItem = ({ icon, label, to, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl transition-all duration-300 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'
    }`}
  >
    {icon}
    <span className="text-sm tracking-wide whitespace-nowrap">{label}</span>
    {active && <ChevronRight className="w-4 h-4 ml-auto opacity-70 shrink-0" />}
  </Link>
);

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToastStore();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      addToast('Anda harus masuk (login) terlebih dahulu', 'warning');
      navigate('/login', { replace: true });
    }
  }, [location.pathname, navigate, addToast]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    addToast('Sesi Anda telah berakhir', 'info');
    navigate('/login', { replace: true });
  };

  const currentPath = location.pathname;

  const getPageTitle = (path) => {
    switch (path) {
      case '/admin':
        return { title: 'Dasbor Administrasi', subtitle: 'Pantau dan kelola data antrean pelayanan persuratan Desa Kutasari.' };
      case '/admin/pengajuan':
        return { title: 'Antrean Permohonan', subtitle: 'Daftar permohonan surat dari warga yang membutuhkan verifikasi.' };
      case '/admin/pengaturan-wa':
        return { title: 'Pengaturan WhatsApp', subtitle: 'Konfigurasi WA Gateway' };
      case '/admin/laporan':
        return { title: 'Laporan', subtitle: 'Rekapitulasi data pengajuan surat' };
      default:
        return { title: 'Ruang Kendali', subtitle: 'Panel Administrasi Desa' };
    }
  };

  const defaultPageInfo = getPageTitle(currentPath);
  const headerStore = useHeaderStore();
  
  const displayTitle = headerStore.title || defaultPageInfo.title;
  const displaySubtitle = headerStore.subtitle || defaultPageInfo.subtitle;

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex">
      {/* Modern Sidebar (Glassmorphism & Sleek Dark) */}
      <aside className="w-64 bg-[#0F172A] text-slate-300 flex-col hidden lg:flex fixed h-full border-r border-slate-800 shadow-2xl z-20">
        <div className="h-20 flex items-center px-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-md">
              <img src="/logo_Cilacap.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-white font-black text-xl tracking-tight leading-none">Ruang Staf</h1>
              <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase mt-1">Desa Kutasari</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-8 px-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Menu Utama</p>
          <nav className="flex flex-col">
            <SidebarItem 
              to="/admin" 
              icon={<LayoutDashboard className="w-5 h-5" />} 
              label="Dasbor" 
              active={currentPath === '/admin'} 
            />
            <SidebarItem 
              to="/admin/pengajuan" 
              icon={<FileText className="w-5 h-5" />} 
              label="Antrean Surat" 
              active={currentPath === '/admin/pengajuan'} 
            />
            <SidebarItem 
              to="/admin/warga" 
              icon={<Users className="w-5 h-5" />} 
              label="Data Warga" 
              active={currentPath === '/admin/warga'} 
            />
            <SidebarItem 
              to="/admin/pengaturan-wa" 
              icon={<Smartphone className="w-5 h-5" />} 
              label="Pengaturan WA" 
              active={currentPath === '/admin/pengaturan-wa'} 
            />
            <SidebarItem 
              to="/admin/pengaturan-akun" 
              icon={<Settings className="w-5 h-5" />} 
              label="Pengaturan Akun" 
              active={currentPath === '/admin/pengaturan-akun'} 
            />
            <SidebarItem 
              to="/admin/laporan" 
              icon={<BarChart className="w-5 h-5" />} 
              label="Laporan" 
              active={currentPath === '/admin/laporan'} 
            />
          </nav>
        </div>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl font-bold bg-white/5 hover:bg-rose-500 hover:text-white text-slate-400 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col h-screen">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-center px-8 sm:px-12 sticky top-0 z-30 shrink-0">
          <div className="w-full max-w-6xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              {headerStore.leftComponent && (
                <div>{headerStore.leftComponent}</div>
              )}
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  {displayTitle}
                </h1>
                <p className="text-slate-600 font-medium mt-0.5 text-sm max-w-lg">{displaySubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 uppercase tracking-widest">Administrator</p>
              </div>
              <div className="flex items-center justify-center cursor-pointer p-2 hover:opacity-80 transition-opacity mr-3" title="Status Sistem: Online">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 px-8 sm:px-12 pb-8 pt-6 flex flex-col items-center overflow-y-auto">
          <div className="w-full max-w-6xl flex flex-col flex-1 min-h-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
