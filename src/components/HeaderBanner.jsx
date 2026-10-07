import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, Sparkles, Layers, ArrowRight } from 'lucide-react';

export default function HeaderBanner({ onOpenAdminPanel, onSelectCategory }) {
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'diplomados' | 'cursos'
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  // Countdown timer for urgency (14 min 59 sec = 899s)
  const [timeLeft, setTimeLeft] = useState(899);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 899 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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

  // Safe cross-browser automatic smooth scrolling
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      try {
        if (containerRef.current) {
          const el = containerRef.current;
          const { scrollLeft, scrollWidth, clientWidth } = el;
          const maxScroll = scrollWidth - clientWidth;
          if (maxScroll <= 0) return;

          if (scrollLeft >= maxScroll - 15) {
            if (typeof el.scrollTo === 'function') {
              el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
              el.scrollLeft = 0;
            }
          } else {
            if (typeof el.scrollBy === 'function') {
              el.scrollBy({ left: 230, behavior: 'smooth' });
            } else {
              el.scrollLeft += 230;
            }
          }
        }
      } catch (e) {
        console.warn('Scroll animation warning:', e);
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
    <header id="catalogo-programas" className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 text-center text-white bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] border-b border-slate-800 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      
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

        {/* Subtitle Pill Badge with Live Countdown Timer */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-block px-5 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-extrabold tracking-wide uppercase shadow-lg">
            TODOS ESTOS PROGRAMAS ESTÁN SUBVENCIONADOS POR RECCIP LATINOAMÉRICA AL 70%
          </div>
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
      </div>
    </header>
  );
}


