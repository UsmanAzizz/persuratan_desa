import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    addToast('Sesi Anda telah berakhir', 'info');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-slate-300 flex flex-col hidden md:flex fixed h-full">
        <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-slate-900">
          <span className="text-white font-bold text-lg">Sistem Kutasari</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-3">
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-medium">Dasbor</span>
            </Link>
            <Link to="/admin/pengajuan" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-colors bg-slate-700 text-white">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Antrean Surat</span>
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-rose-600 hover:text-white transition-colors text-slate-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-slate-800">Ruang Kendali</h1>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700">Admin Kutasari</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
