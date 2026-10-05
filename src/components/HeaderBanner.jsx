import React from 'react';

export default function HeaderBanner({ onOpenAdminPanel }) {
  const handleCuotasWhatsApp = () => {
    const message = `Hola asesora EDUMIN 🎓, deseo consultar sobre los Programas de Especialización y solicitar las facilidades de pago en cuotas.`;
    window.open(`https://wa.me/51951101765?text=${encodeURIComponent(message)}`, '_blank');
  };

  const scrollToPackage = (pkgId) => {
    const el = document.getElementById(`package-${pkgId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 text-center text-white bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] border-b border-slate-800 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-5 relative z-10">
        
        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight">
          PROGRAMAS DE <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-blue-200">
            ESPECIALIZACIÓN INTERNACIONAL
          </span>
        </h1>

        {/* Subtitle Pill Badge */}
        <div className="inline-block px-5 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-extrabold tracking-wide uppercase shadow-lg">
          TODOS ESTOS PROGRAMAS ESTÁN SUBVENCIONADOS POR RECCIP LATINOAMÉRICA AL 70%
        </div>

        {/* Informative Installment Banner */}
        <div className="pt-2 max-w-2xl mx-auto">
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300 shadow-xl">
            <div className="flex items-center space-x-2.5 text-left">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span>
                <strong className="text-white font-bold">¿Deseas pagar en cuotas?</strong> Solicita tu plan de cuotas enviando un mensaje directo a nuestra asesora por WhatsApp al <strong>951101765 / 987423200</strong>.
              </span>
            </div>

            <button
              onClick={handleCuotasWhatsApp}
              className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-[11px] uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md flex items-center space-x-2 border border-emerald-400/50"
            >
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM_c9Q3XvG6b7rWAQZV7nxNNN8R0kXGoD6TjFThjsLvtKKC89Ej7KjTgW3&s=10" 
                alt="WhatsApp Logo" 
                className="w-4 h-4 rounded-full object-cover shrink-0" 
              />
              <span>Solicitar Cuotas</span>
            </button>
          </div>
        </div>

        {/* MOBILE & DESKTOP QUICK-NAV: CAROUSEL TO SLIDE BETWEEN 3 PACKAGES */}
        <div className="pt-4 max-w-3xl mx-auto space-y-2.5">
          <div className="flex items-center justify-center space-x-2 text-xs font-black text-amber-300 uppercase tracking-wider">
            <span>👉 Desliza y selecciona tu programa favorito:</span>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 pt-1 px-2 no-scrollbar sm:justify-center text-left scroll-smooth">
            
            {/* Package 1: Completo */}
            <button
              onClick={() => scrollToPackage('completo')}
              className="snap-center shrink-0 w-[240px] sm:w-[220px] bg-slate-900/95 hover:bg-slate-800 border border-slate-700/90 hover:border-[#00e676]/60 p-3.5 rounded-2xl transition-all shadow-xl cursor-pointer group text-left space-y-2 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#00e676] text-slate-950 text-[10px] font-black uppercase shadow-xs">
                  COMPLETO
                </span>
                <span className="text-[10px] text-slate-400 font-bold">1 Diplomado</span>
              </div>
              <div>
                <p className="text-xs font-black text-white group-hover:text-[#00e676] transition-colors">
                  PROGRAMA COMPLETO
                </p>
                <p className="text-sm font-black font-mono text-amber-400">
                  S/ 540 <span className="text-[10px] text-slate-400 font-normal font-sans">al contado</span>
                </p>
              </div>
              <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-slate-300 group-hover:text-white border-t border-slate-800">
                <span>Ir al paquete</span>
                <span className="text-[#00e676]">➔</span>
              </div>
            </button>

            {/* Package 2: Full */}
            <button
              onClick={() => scrollToPackage('full')}
              className="snap-center shrink-0 w-[240px] sm:w-[220px] bg-slate-900/95 hover:bg-slate-800 border border-slate-700/90 hover:border-[#ff9800]/60 p-3.5 rounded-2xl transition-all shadow-xl cursor-pointer group text-left space-y-2 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ff9800] text-slate-950 text-[10px] font-black uppercase shadow-xs">
                  FULL
                </span>
                <span className="text-[10px] text-slate-400 font-bold">5 Cursos</span>
              </div>
              <div>
                <p className="text-xs font-black text-white group-hover:text-[#ff9800] transition-colors">
                  PROGRAMA FULL
                </p>
                <p className="text-sm font-black font-mono text-amber-400">
                  S/ 900 <span className="text-[10px] text-slate-400 font-normal font-sans">al contado</span>
                </p>
              </div>
              <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-slate-300 group-hover:text-white border-t border-slate-800">
                <span>Ir al paquete</span>
                <span className="text-[#ff9800]">➔</span>
              </div>
            </button>

            {/* Package 3: Ilimitado */}
            <button
              onClick={() => scrollToPackage('ilimitado')}
              className="snap-center shrink-0 w-[240px] sm:w-[220px] bg-slate-900/95 hover:bg-slate-800 border border-slate-700/90 hover:border-[#ff1744]/60 p-3.5 rounded-2xl transition-all shadow-xl cursor-pointer group text-left space-y-2 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ff1744] text-white text-[10px] font-black uppercase shadow-xs">
                  ILIMITADO
                </span>
                <span className="text-[10px] text-slate-400 font-bold">Acceso 2 Años</span>
              </div>
              <div>
                <p className="text-xs font-black text-white group-hover:text-[#ff1744] transition-colors">
                  PROGRAMA ILIMITADO
                </p>
                <p className="text-sm font-black font-mono text-amber-400">
                  S/ 1500 <span className="text-[10px] text-slate-400 font-normal font-sans">al contado</span>
                </p>
              </div>
              <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-slate-300 group-hover:text-white border-t border-slate-800">
                <span>Ir al paquete</span>
                <span className="text-[#ff1744]">➔</span>
              </div>
            </button>

          </div>
        </div>

      </div>
    </header>
  );
}
