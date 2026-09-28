import React from 'react';
import { ShieldCheck, UserCheck, Lock, LogOut, ArrowRight } from 'lucide-react';

export default function Navbar({ 
  onOpenAdminPanel, 
  onOpenStudentCheckout, 
  isAsesoraLoggedIn,
  onAsesoraLogout
}) {
  const logoUrl = "https://raw.githubusercontent.com/videoconferenciasdiplomado-alt/imagenes/main/logo/logo%20blanco.png";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a] border-b border-slate-800 shadow-lg py-3 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Official EDUMIN Logo */}
          <a href="#" className="flex items-center space-x-3 group">
            <img 
              src={logoUrl} 
              alt="EDUMIN Logo" 
              className="h-8 sm:h-9 object-contain group-hover:opacity-90 transition-opacity" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden items-center space-x-1 font-extrabold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
              <span>EDU</span><span className="text-amber-400">MIN</span>
            </div>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <a href="#" className="hover:text-white transition-colors">Inicio</a>
            <a href="#" className="text-white font-bold bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">Cursos</a>
            <a href="#" className="hover:text-white transition-colors">Metodología</a>
            <a href="#" className="hover:text-white transition-colors">Pasos</a>
            <a href="#" className="hover:text-white transition-colors">Certificación</a>
          </div>

          {/* Actions: Asesora Login & Preinscribirme */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {isAsesoraLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAdminPanel}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Panel Asesora</span>
                </button>
                <button
                  onClick={onAsesoraLogout}
                  title="Cerrar sesión de asesora"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminPanel}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Acceso Asesora</span>
              </button>
            )}

            {/* Preinscribirme ahora */}
            <button
              onClick={() => onOpenStudentCheckout(null)}
              className="px-4 py-2 text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20 transition-all duration-200 flex items-center space-x-1.5 uppercase tracking-wide cursor-pointer"
            >
              <span>Preinscribirme al Contado</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>

          </div>

        </div>
      </div>
    </nav>
  );
}
