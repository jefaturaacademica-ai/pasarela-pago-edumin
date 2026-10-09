import React from 'react';
import { Check, X, ArrowRight, ShieldCheck, CreditCard, ShoppingCart, MessageSquare, Zap, Sparkles, Award } from 'lucide-react';

export default function PackageCard({ 
  packageData, 
  onAddToCart,
  onDirectIzipayCheckout,
  onOpenAdminPanel 
}) {
  const { id, title, badgeBg, basePrice, originalPrice, cuotaOptions, items, note } = packageData;

  const isCursoIa = id === 'curso_ia' || title.toUpperCase().includes('CURSO IA');

  const handleRequestCuotasWhatsApp = (cuotaOpt) => {
    const message = `Hola asesora EDUMIN 🎓, deseo solicitar mi plan de cuotas para el *${title}* (${cuotaOpt.count} cuotas de S/ ${cuotaOpt.amount}). Mis datos son:`;
    const waUrl = `https://wa.me/51987423200?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className={`rounded-3xl border shadow-xl flex flex-col justify-between overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 font-['Plus_Jakarta_Sans',sans-serif] h-full ${
      isCursoIa 
        ? 'bg-white border-purple-200/80 ring-1 ring-purple-500/20' 
        : 'bg-white border-slate-200/80'
    }`}>
      
      {/* Top Header Badge */}
      <div className={`p-6 text-center border-b relative shrink-0 transition-colors ${
        isCursoIa
          ? 'bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 border-purple-800 text-white'
          : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        <div className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${
          isCursoIa
            ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 shadow-purple-950/50 animate-pulse'
            : `text-slate-950 ${badgeBg}`
        }`}>
          {isCursoIa && <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />}
          <span>{title}</span>
        </div>

        {/* Pricing Summary */}
        <div className={`mt-4 p-3.5 rounded-2xl border text-xs space-y-1 backdrop-blur-xs ${
          isCursoIa 
            ? 'bg-purple-900/40 border-purple-700/50 text-purple-100'
            : 'bg-slate-800/80 border-slate-700 text-slate-300'
        }`}>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            VALOR ORIGINAL: <span className="line-through text-slate-400 font-mono">S/{originalPrice}</span>
          </p>
          <p className={`text-[11px] font-extrabold uppercase ${isCursoIa ? 'text-amber-300' : 'text-amber-300'}`}>
            SUBVENCIONADO RECCIP 70%: S/{Math.round(originalPrice * 0.7)}
          </p>
          <div className="pt-1.5 flex items-center justify-center space-x-1.5">
            <span className="text-xs font-bold text-slate-300 uppercase">PAGO AL CONTADO =</span>
            <span className="text-2xl font-black font-mono text-amber-400 tracking-tight">S/{basePrice}.00</span>
          </div>
        </div>
      </div>

      {/* Feature Items List */}
      <div className="p-6 space-y-3.5 flex-1 flex flex-col justify-between text-xs text-slate-700 bg-slate-50/40">
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 group/item">
              {item.included ? (
                <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-2xs group-hover/item:scale-110 transition-transform">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-2xs">
                  <X className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <span className={item.included ? 'text-slate-800 font-medium leading-tight' : 'text-slate-400 line-through leading-tight'}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {note && (
          <div className="mt-4 p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[11px] font-bold flex items-center gap-2 shadow-2xs">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{note}</span>
          </div>
        )}
      </div>

      {/* Actions: Add to Cart & Direct Izipay Checkout (PERFECTLY ALIGNED AT BOTTOM) */}
      <div className="p-6 pt-4 bg-white space-y-2.5 border-t border-slate-100 mt-auto shrink-0">
        
        <div className="grid grid-cols-2 gap-2.5">
          {/* Add to Cart */}
          <button
            type="button"
            onClick={() => onAddToCart(packageData)}
            className="py-3.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 font-extrabold text-[11px] uppercase tracking-wider border border-slate-300/80 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-slate-600" />
            <span>+ Carrito</span>
          </button>

          {/* Direct Izipay Pay in Official EDUMIN Teal */}
          <button
            type="button"
            onClick={() => onDirectIzipayCheckout(packageData)}
            className="py-3.5 px-3 rounded-xl bg-[#00a499] hover:bg-[#00897b] active:scale-[0.98] text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-[#00a499]"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Pagar Izipay</span>
          </button>
        </div>

        {/* Cuotas via WhatsApp */}
        <div className="pt-0.5">
          {cuotaOptions && cuotaOptions.length > 0 ? (
            <button
              type="button"
              onClick={() => handleRequestCuotasWhatsApp(cuotaOptions[0])}
              className="w-full py-3 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-[11px] transition-all flex items-center justify-between cursor-pointer border border-emerald-400 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center space-x-2">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM_c9Q3XvG6b7rWAQZV7nxNNN8R0kXGoD6TjFThjsLvtKKC89Ej7KjTgW3&s=10" 
                  alt="WhatsApp Logo" 
                  className="w-4 h-4 rounded-full object-cover shrink-0 shadow-xs"
                />
                <span>Solicitar cuotas</span>
              </div>
              <span className="bg-slate-900/80 text-amber-300 px-2 py-0.5 rounded-lg text-[10px] font-black border border-slate-700">
                WhatsApp
              </span>
            </button>
          ) : (
            <div className="h-[42px] flex items-center justify-center text-[11px] font-bold text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              ⚡ Pago Único de Contado
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
