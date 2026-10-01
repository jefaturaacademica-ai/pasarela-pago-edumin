import React from 'react';

export default function HeaderBanner({ onOpenAdminPanel }) {
  const handleCuotasWhatsApp = () => {
    const message = `Hola asesora EDUMIN 🎓, deseo consultar sobre los Programas de Especialización y solicitar las facilidades de pago en cuotas.`;
    window.open(`https://wa.me/51951101765?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <header className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 text-center text-white bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] border-b border-slate-800 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-4 relative z-10">
        
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
        <div className="pt-4 max-w-2xl mx-auto">
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

      </div>
    </header>
  );
}
