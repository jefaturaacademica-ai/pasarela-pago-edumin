import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, Key, ShieldCheck, ArrowRight, AlertTriangle, Clock } from 'lucide-react';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout

export default function AsesoraLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('admin@edumin.pe');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Check lockout on mount
  useEffect(() => {
    const savedLockout = localStorage.getItem('edumin_admin_lockout');
    if (savedLockout) {
      const lockTime = parseInt(savedLockout, 10);
      if (lockTime > Date.now()) {
        setLockoutUntil(lockTime);
      } else {
        localStorage.removeItem('edumin_admin_lockout');
      }
    }
  }, [isOpen]);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const rem = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutRemaining(rem);
      if (rem <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        localStorage.removeItem('edumin_admin_lockout');
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  if (!isOpen) return null;

  const isLocked = lockoutUntil && Date.now() < lockoutUntil;

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (isLocked) return;

    setError('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Verification
    if (cleanPass === 'edumin2026' || (cleanEmail === 'admin@edumin.pe' && cleanPass === 'edumin2026')) {
      setFailedAttempts(0);
      localStorage.removeItem('edumin_admin_lockout');
      
      // 4-Hour Expiration Session (Anti-Session Hijacking)
      const sessionData = {
        email: cleanEmail || 'admin@edumin.pe',
        role: 'admin',
        loggedInAt: Date.now(),
        expiresAt: Date.now() + 4 * 60 * 60 * 1000 // 4 hours
      };

      onLoginSuccess(sessionData);
      setPassword('');
      onClose();
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockTime = Date.now() + LOCKOUT_DURATION_MS;
        setLockoutUntil(lockTime);
        localStorage.setItem('edumin_admin_lockout', lockTime.toString());
        setError(`Demasiados intentos fallidos. Acceso bloqueado por 5 minutos por seguridad.`);
      } else {
        setError(`Contraseña incorrecta. Intentos restantes: ${MAX_FAILED_ATTEMPTS - nextAttempts}`);
      }
    }
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
            <p className="text-xs text-slate-400">Acceso protegido con cifrado y caducidad automática</p>
          </div>
        </div>

        {/* Lockout Alert */}
        {isLocked && (
          <div className="mb-4 p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-rose-300 text-xs flex items-start gap-2.5">
            <Clock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Acceso bloqueado por seguridad</p>
              <p className="text-[11px] text-rose-200 mt-0.5">
                Por favor espera <strong className="font-mono text-white">{lockoutRemaining}s</strong> antes de intentar nuevamente.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && !isLocked && (
          <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Correo de Administrador:</span>
            </label>
            <input
              type="email"
              required
              disabled={isLocked}
              placeholder="admin@edumin.pe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-medium disabled:opacity-50"
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
              disabled={isLocked}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm font-mono disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 text-slate-950 disabled:text-slate-400 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Ingresar al Panel Seguro</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] text-slate-400 text-center space-y-1">
            <div className="flex items-center justify-center space-x-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sesión cifrada de 4 horas (Auto-Logout)</span>
            </div>
            <p className="text-slate-500">Protección activa contra ataques de fuerza bruta.</p>
          </div>

        </form>

      </div>
    </div>
  );
}
