import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, Sparkles, Layers, ArrowRight } from 'lucide-react';

export default function HeaderBanner({ onOpenAdminPanel, onSelectCategory }) {
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'diplomados' | 'cursos'
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const handleCuotasWhatsApp = () => {
    const message = `Hola asesora EDUMIN 🎓, deseo consultar sobre los Programas de Especialización y solicitar las facilidades de pago en cuotas.`;
    window.open(`https://wa.me/51951101765?text=${encodeURIComponent(message)}`, '_blank');
  };

  const scrollToPackage = (pkgId, category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }

    setTimeout(() => {
      const el = document.getElementById(`package-${pkgId}`) || document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  // Automatic smooth scrolling animation (pauses on mouse hover or touch)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (maxScroll <= 0) return;

        if (scrollLeft >= maxScroll - 15) {
          containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          containerRef.current.scrollBy({ left: 230, behavior: 'smooth' });
        }
      }
    }, 3200);
    return () => clearInterval(interval);
  }, [isHovered, filterTab]);

  const items = [
    {
      id: 'completo',
      category: 'diplomado',
      type: 'DIPLOMADO',
      typeBadgeBg: 'bg-[#00e676]',
      typeBadgeText: 'text-slate-950',
      title: 'PROGRAMA COMPLETO',
      price: 540,
      detail: '1 Diplomado + CIP',
      borderColor: 'hover:border-[#00e676]/70',
      accentColor: 'text-[#00e676]'
    },
    {
      id: 'full',
      category: 'diplomado',
      type: 'DIPLOMADO',
      typeBadgeBg: 'bg-[#ff9800]',
      typeBadgeText: 'text-slate-950',
      title: 'PROGRAMA FULL',
      price: 900,
      detail: '5 Cursos + 1 Diplomado',
      borderColor: 'hover:border-[#ff9800]/70',
      accentColor: 'text-[#ff9800]'
    },
    {
      id: 'ilimitado',
      category: 'diplomado',
      type: 'DIPLOMADO',
      typeBadgeBg: 'bg-[#ff1744]',
      typeBadgeText: 'text-white',
      title: 'PROGRAMA ILIMITADO',
      price: 1500,
      detail: 'Acceso 2 Años Total',
      borderColor: 'hover:border-[#ff1744]/70',
      accentColor: 'text-[#ff1744]'
    },
    {
      id: 'curso_ia',
      category: 'curso',
      type: 'CURSO IA',
      typeBadgeBg: 'bg-[#7c4dff]',
      typeBadgeText: 'text-white',
      title: 'CURSO IA DE 0 A 100',
      price: 149,
      detail: 'Asincrónico 100% Práctico',
      borderColor: 'hover:border-[#7c4dff]/70',
      accentColor: 'text-[#7c4dff]'
    },
  ];

  const filteredItems = items.filter((item) => {
    if (filterTab === 'diplomados') return item.category === 'diplomado';
    if (filterTab === 'cursos') return item.category === 'curso';
    return true;
  });

  return (
    <header className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 text-center text-white bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] border-b border-slate-800 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Glow background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[260px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-[300px] h-[200px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

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

        {/* MOBILE & DESKTOP AUTO-SLIDING CAROUSEL WITH CATEGORY TABS */}
        <div className="pt-5 max-w-3xl mx-auto space-y-3">
          
          {/* Header Title & Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2 text-xs font-black text-amber-300 uppercase tracking-wider">
              <span className="inline-block animate-bounce">👉</span>
              <span>SELECCIONA O DESLIZA TU PROGRAMA FAVORITO:</span>
            </div>

            {/* Filter Tabs: ALL vs DIPLOMADOS vs CURSOS */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setFilterTab('all');
                  if (onSelectCategory) onSelectCategory('diplomado');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  filterTab === 'all'
                    ? 'bg-[#00a499] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Todos (4)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilterTab('diplomados');
                  if (onSelectCategory) onSelectCategory('diplomado');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  filterTab === 'diplomados'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3 h-3" />
                <span>Diplomados (3)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilterTab('cursos');
                  if (onSelectCategory) onSelectCategory('curso');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  filterTab === 'cursos'
                    ? 'bg-purple-600 text-white font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Cursos (1)</span>
              </button>
            </div>
          </div>

          {/* AUTO-SLIDING CAROUSEL CONTAINER (HIDDEN BROWSER SCROLLBAR) */}
          <div 
            ref={containerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="flex overflow-x-auto gap-3.5 pb-2 pt-1 px-1 sm:justify-center text-left scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToPackage(item.id, item.category)}
                className={`shrink-0 w-[240px] sm:w-[220px] bg-slate-900/95 hover:bg-slate-800/90 border border-slate-700/90 ${item.borderColor} p-4 rounded-2xl transition-all duration-300 shadow-xl cursor-pointer group text-left space-y-2.5 active:scale-95 hover:scale-[1.02] relative overflow-hidden`}
              >
                {/* Subtle top color glow line */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${item.typeBadgeBg}`} />

                <div className="flex items-center justify-between pt-0.5">
                  <span className={`px-2.5 py-0.5 rounded-full ${item.typeBadgeBg} ${item.typeBadgeText} text-[10px] font-black uppercase tracking-wide shadow-xs`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{item.detail}</span>
                </div>

                <div>
                  <p className={`text-xs font-black text-white group-hover:${item.accentColor} transition-colors`}>
                    {item.title}
                  </p>
                  <p className="text-sm font-black font-mono text-amber-400 pt-0.5">
                    S/ {item.price} <span className="text-[10px] text-slate-400 font-normal font-sans">al contado</span>
                  </p>
                </div>

                <div className="pt-1.5 flex items-center justify-between text-[11px] font-bold text-slate-300 group-hover:text-white border-t border-slate-800/90">
                  <span>Ir al paquete</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${item.accentColor} group-hover:translate-x-1 transition-transform`} />
                </div>
              </button>
            ))}
          </div>

        </div>

      </div>
    </header>
  );
}

