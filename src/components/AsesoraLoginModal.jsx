import React, { useState } from 'react';
import { X, Lock, Mail, Key, ShieldCheck, AlertCircle, ArrowRight, School } from 'lucide-react';

export default function AsesoraLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Asesora / Admin Auth check
    const validEmails = ['asesora@edumin.pe', 'admin@edumin.pe', 'jefatura@edumin.pe', 'ventas@edumin.pe'];
    
    // Accept valid emails or any email ending with @edumin.pe (or demo password 'edumin2026')
    if ((email.endsWith('@edumin.pe') || validEmails.includes(email.toLowerCase()) || email.includes('asesora')) && (password === 'edumin2026' || password.length >= 4)) {
      onLoginSuccess({ email, role: 'asesora' });
      setEmail('');
      setPassword('');
    } else {
      setError('Credenciales incorrectas. Ingresa tu correo de asesora y contraseña (Clave demo: edumin2026).');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-md bg-[#0f172a] rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl font-black">
            <Lock className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider text-white">Acceso Privado Asesora</h3>
            <p className="text-xs text-slate-400">Panel restringido para generación de links y gestión de cuotas</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Correo de Asesora / Administradora:</span>
            </label>
            <input
              type="email"
              required
              placeholder="asesora@edumin.pe"
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
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm"
            />
            <p className="text-[10px] text-slate-500 text-right">Clave demo: <span className="font-mono text-amber-400 font-bold">edumin2026</span></p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2"
          >
            <span>Iniciar Sesión de Asesora</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <p className="text-[10px] text-slate-500 text-center flex items-center justify-center space-x-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Acceso seguro encriptado para personal autorizado de EDUMIN.</span>
          </p>

        </form>

      </div>
    </div>
  );
}
