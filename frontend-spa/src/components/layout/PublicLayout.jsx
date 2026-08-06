import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

export const PublicLayout = () => {
  const { pathname } = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-2">
            <div className="flex-shrink-0 flex items-center gap-2">
              <img src="/logo_Cilacap.png" alt="Logo Cilacap" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              <span className="font-bold text-slate-800 text-sm sm:text-2xl tracking-tight leading-none">Desa Kutasari</span>
            </div>
            <nav className="flex gap-3 sm:gap-6 items-center">
              <Link to="/" className="text-[11px] sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Beranda</Link>
              <Link to="/ajukan" className="text-[11px] sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Ajukan Surat</Link>
              <Link to="/track" className="text-[11px] sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Cek Status</Link>
              <div className="w-px h-4 bg-slate-300 mx-1 sm:mx-2 block"></div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center text-slate-500 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  <UserCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                    <Link 
                      to="/login" 
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      Portal Staf
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col">
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
