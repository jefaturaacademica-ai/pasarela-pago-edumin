import React from 'react';
import { CreditCard, Sparkles, ArrowRight } from 'lucide-react';

export default function StickyMobileBar({ onOpenDirectCheckout }) {
  const handleScrollToCatalog = () => {
    const catalogElem = document.getElementById('catalogo-programas');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenDirectCheckout) {
      onOpenDirectCheckout();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 p-3 shadow-2xl transition-transform">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00e676]">
              Subvención RECCIP 70%
            </span>
          </div>
          <p className="text-xs font-black text-white leading-none mt-0.5">
            Cursos & Diplomados
          </p>
          <span className="text-[10px] text-slate-400">
            Desde <strong className="text-white">S/ 149</strong> (O en Cuotas)
          </span>
        </div>

        <button
          onClick={handleScrollToCatalog}
          className="py-2.5 px-4 bg-gradient-to-r from-[#00a499] to-[#00897b] hover:from-[#00897b] hover:to-[#00796b] text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <span>MATRICÚLATE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
