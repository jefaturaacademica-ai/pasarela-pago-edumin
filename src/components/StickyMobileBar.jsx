import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function StickyMobileBar({ onOpenDirectCheckout }) {
  const handleScrollToCatalog = () => {
    const catalogElem = document.getElementById('catalog-section') || document.getElementById('catalogo-programas');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenDirectCheckout) {
      onOpenDirectCheckout();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 p-3 shadow-2xl transition-transform">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              70% Subvención RECCIP
            </span>
          </div>
          <p className="text-xs font-black text-white leading-tight mt-0.5 truncate">
            Diplomados & Cursos
          </p>
          <span className="text-[10px] text-slate-400 truncate">
            Desde <strong className="text-amber-400 font-mono">S/ 149</strong> • Izipay Seguro
          </span>
        </div>

        <button
          onClick={handleScrollToCatalog}
          className="relative group overflow-hidden py-3 px-4.5 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:brightness-110 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-teal-500/25 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>INSCRIBIRME</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
