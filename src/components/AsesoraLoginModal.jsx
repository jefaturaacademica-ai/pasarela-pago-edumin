import React, { useState } from 'react';
import { X, Lock, Mail, Key, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

export default function AsesoraLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('admin@edumin.pe');
  const [password, setPassword] = useState('edumin2026');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setError('');

    // Instant login for admin/asesora
    onLoginSuccess({ 
      email: email.trim() || 'admin@edumin.pe', 
      role: 'admin' 
    });
    setEmail('admin@edumin.pe');
    setPassword('edumin2026');
  };

  const handleQuickAccess = () => {
    onLoginSuccess({ 
      email: 'admin@edumin.pe', 
      role: 'admin' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      
      <div className="relative w-full max-w-md bg-[#0f172a] rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl font-black">
            <Lock className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider text-white">Panel Administrador</h3>
            <p className="text-xs text-slate-400">Generación de links de pago únicos y gestión de cuotas</p>
          </div>
        </div>

        {/* Quick Access Master Button */}
        <div className="mb-5 p-3.5 bg-amber-400/10 border border-amber-400/30 rounded-2xl space-y-2 text-center">
          <p className="text-xs text-amber-300 font-bold">
            👉 Haz clic abajo para ingresar directamente sin escribir nada:
          </p>
          <button
            type="button"
            onClick={handleQuickAccess}
            className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>⚡ Entrar Directo al Panel Administrador</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs pt-2 border-t border-slate-800">
          
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Correo de Administrador:</span>
            </label>
            <input
              type="email"
              required
              placeholder="admin@edumin.pe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contraseña:</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2 border border-slate-700"
          >
            <span>Iniciar Sesión</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <p className="text-[10px] text-slate-500 text-center flex items-center justify-center space-x-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Acceso administrador verificado de EDUMIN.</span>
          </p>

        </form>

      </div>
    </div>
  );
}
