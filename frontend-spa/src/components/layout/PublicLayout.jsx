import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DK</span>
              </div>
              <span className="font-semibold text-slate-800 text-lg">Desa Kutasari</span>
            </div>
            <nav className="flex gap-4">
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pengajuan Surat</Link>
              <Link to="/track" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Cek Status</Link>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Portal Staf</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Pemerintah Desa Kutasari. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
};
