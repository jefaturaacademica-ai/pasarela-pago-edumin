import React, { useState } from 'react';
import { Check, X, ArrowRight, ShieldCheck, CreditCard, ShoppingCart, MessageSquare, Zap, Sparkles, Award, Star } from 'lucide-react';

export default function PackageCard({ 
  packageData, 
  onAddToCart,
  onDirectIzipayCheckout,
  onOpenAdminPanel 
}) {
  const { id, title, badgeBg, basePrice, originalPrice, cuotaOptions, items, note } = packageData;

  const isCursoIa = id === 'curso_ia' || title.toUpperCase().includes('CURSO IA');
  const isMostPopular = id === 'full' || title.toUpperCase().includes('FULL');

  // Interactive Payment Mode toggle: 'contado' | 'cuotas'
  const hasCuotas = cuotaOptions && cuotaOptions.length > 0;
  const [paymentMode, setPaymentMode] = useState('contado');

  const selectedCuota = hasCuotas ? cuotaOptions[0] : null;
  const currentCheckoutAmount = (paymentMode === 'cuotas' && selectedCuota) ? selectedCuota.amount : basePrice;

  const handleRequestCuotasWhatsApp = (cuotaOpt) => {
    const message = `Hola asesora EDUMIN 🎓, deseo solicitar mi plan de cuotas para el *${title}* (${cuotaOpt.count} cuotas de S/ ${cuotaOpt.amount}). Mis datos son:`;
    const waUrl = `https://wa.me/51987423200?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleIzipayClick = () => {
    if (paymentMode === 'cuotas' && selectedCuota) {
      onDirectIzipayCheckout({
        ...packageData,
        basePrice: selectedCuota.amount,
        selectedCuotaText: `Cuota 1 de ${selectedCuota.count} (${title})`,
        isCuotaPayment: true
      });
    } else {
      onDirectIzipayCheckout(packageData);
    }
  };

  return (
    <div className={`relative rounded-3xl border flex flex-col justify-between overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 font-['Plus_Jakarta_Sans',sans-serif] h-full ${
      isMostPopular
        ? 'bg-white border-amber-400 shadow-2xl ring-2 ring-amber-400/40'
        : isCursoIa 
          ? 'bg-white border-purple-200/90 ring-1 ring-purple-500/20 shadow-xl' 
          : 'bg-white border-slate-200/90 shadow-xl'
    }`}>
      
      {/* Top Ribbons for Most Popular */}
      {isMostPopular && (
        <div className="absolute top-0 right-0 z-20">
          <div className="bg-gradient-to-l from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-slate-950" />
            <span>MÁS ELEGIDO</span>
          </div>
        </div>
      )}

      {/* Top Header Badge */}
      <div className={`p-6 text-center border-b relative shrink-0 transition-colors ${
        isMostPopular
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border-amber-500/30 text-white'
          : isCursoIa
            ? 'bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 border-purple-800 text-white'
            : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        <div className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${
          isCursoIa
            ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 shadow-purple-950/50 animate-pulse'
            : isMostPopular
              ? 'bg-amber-400 text-slate-950 shadow-amber-950/50 font-black'
              : `text-slate-950 ${badgeBg}`
        }`}>
          {isCursoIa && <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />}
          {isMostPopular && <Award className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />}
          <span>{title}</span>
        </div>

        {/* Pricing Summary */}
        <div className={`mt-4 p-3.5 rounded-2xl border text-xs space-y-1.5 backdrop-blur-xs ${
          isMostPopular
            ? 'bg-amber-950/20 border-amber-500/40 text-amber-100'
            : isCursoIa 
              ? 'bg-purple-900/40 border-purple-700/50 text-purple-100'
              : 'bg-slate-800/80 border-slate-700 text-slate-300'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>VALOR ORIGINAL:</span>
            <span className="line-through font-mono">S/{originalPrice}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-300">
            <span>SUBVENCIONADO RECCIP 70%:</span>
            <span className="font-mono">-S/{Math.round(originalPrice * 0.7)}</span>
          </div>

          {/* Interactive Mode Switcher if has cuotas */}
          {hasCuotas && (
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/70 rounded-xl border border-slate-700/60 text-[10px] font-black">
                <button
                  type="button"
                  onClick={() => setPaymentMode('contado')}
                  className={`py-1 rounded-lg transition-all ${
                    paymentMode === 'contado'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CONTADO
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('cuotas')}
                  className={`py-1 rounded-lg transition-all ${
                    paymentMode === 'cuotas'
                      ? 'bg-emerald-400 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {selectedCuota.count} CUOTAS
                </button>
              </div>
            </div>
          )}

          {/* Displayed Amount based on mode */}
          <div className="pt-1.5 flex items-baseline justify-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-300 uppercase">
              {paymentMode === 'cuotas' ? 'CUOTA 1 HOY =' : 'TOTAL CONTADO ='}
            </span>
            <span className="text-2xl font-black font-mono text-amber-400 tracking-tight">
              S/{currentCheckoutAmount}.00
            </span>
          </div>

          {paymentMode === 'cuotas' && selectedCuota && (
            <p className="text-[10px] text-emerald-300 font-semibold text-center">
              Pagas S/ {selectedCuota.amount} hoy y la sig. cuota en 30 días
            </p>
          )}
        </div>
      </div>

      {/* Feature Items List */}
      <div className="p-6 space-y-3 flex-1 flex flex-col justify-between text-xs text-slate-700 bg-slate-50/40">
        <div className="space-y-2.5">
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
            onClick={handleIzipayClick}
            className={`py-3.5 px-3 rounded-xl active:scale-[0.98] text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              isMostPopular
                ? 'bg-gradient-to-r from-[#00a499] to-[#00897b] hover:brightness-110 shadow-teal-500/20'
                : 'bg-[#00a499] hover:bg-[#00897b]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Pagar S/{currentCheckoutAmount}</span>
          </button>
        </div>

        {/* WhatsApp Assistance button */}
        <div className="pt-0.5">
          {cuotaOptions && cuotaOptions.length > 0 ? (
            <button
              type="button"
              onClick={() => handleRequestCuotasWhatsApp(cuotaOptions[0])}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-all flex items-center justify-between cursor-pointer border border-slate-200 hover:border-slate-300"
            >
              <div className="flex items-center space-x-2">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM_c9Q3XvG6b7rWAQZV7nxNNN8R0kXGoD6TjFThjsLvtKKC89Ej7KjTgW3&s=10" 
                  alt="WhatsApp Logo" 
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
                <span className="text-slate-600">¿Dudas? Consulta por WhatsApp</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ) : (
            <div className="h-[38px] flex items-center justify-center text-[11px] font-bold text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              ⚡ Certificación y Acceso Inmediato
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
