import React from 'react';
import { Check, X, ArrowRight, ShieldCheck, CreditCard, UserCheck, Calendar } from 'lucide-react';

export default function PackageCard({ 
  packageData, 
  onStudentSelectPay,
  onOpenAdminPanel 
}) {
  const { id, title, badgeBg, basePrice, originalPrice, cuotaOptions, items, note } = packageData;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-slate-300 hover:shadow-2xl transition-all duration-300">
      
      {/* Top Header Badge */}
      <div className="p-6 text-center border-b border-slate-100 bg-slate-900 text-white relative">
        <div className={`inline-block px-5 py-2 rounded-full text-sm font-black uppercase tracking-wider text-slate-950 shadow-md ${badgeBg}`}>
          {title}
        </div>

        {/* Pricing Summary */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            VALOR ORIGINAL: <span className="line-through text-slate-500 font-mono">S/{originalPrice}</span>
          </p>
          <p className="text-[11px] font-extrabold text-amber-300 uppercase">
            SUBVENCIONADO RECCIP 70%: S/{Math.round(originalPrice * 0.7)}
          </p>
          <div className="pt-1.5 flex items-center justify-center space-x-1.5">
            <span className="text-xs font-bold text-slate-300 uppercase">PAGO AL CONTADO =</span>
            <span className="text-xl font-black font-mono text-amber-400">S/{basePrice}</span>
          </div>
        </div>
      </div>

      {/* Feature Items List */}
      <div className="p-6 space-y-3.5 flex-1 text-xs text-slate-700 bg-slate-50/50">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start space-x-2.5">
            {item.included ? (
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <X className="w-3 h-3 stroke-[3]" />
              </div>
            )}
            <span className={item.included ? 'text-slate-800 font-medium' : 'text-slate-400 line-through'}>
              {item.text}
            </span>
          </div>
        ))}

        {note && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
            {note}
          </div>
        )}
      </div>

      {/* Student Options: Contado vs Cuotas */}
      <div className="p-6 pt-3 bg-white space-y-3 border-t border-slate-100">
        
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
          Opciones de Inclusión para el Alumno:
        </p>

        {/* 1. Direct Pay Full (Student Contado) */}
        <button
          onClick={() => onStudentSelectPay(packageData, 'contado', null)}
          className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>Pago al Contado (S/ {basePrice})</span>
        </button>

        {/* 2. Cuotas Options (Student Cuota 1) */}
        <div className="space-y-1.5 pt-1">
          {cuotaOptions.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => onStudentSelectPay(packageData, 'cuotas', opt)}
              className="w-full py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors flex items-center justify-between cursor-pointer border border-slate-700 shadow-sm"
            >
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>En {opt.count} Cuotas: {opt.count} x S/ {opt.amount} (Total S/ {opt.total})</span>
              </div>
              <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-black">
                Cuota 1: S/ {opt.amount}
              </span>
            </button>
          ))}
        </div>

        {/* Admin Link shortcut */}
        <div className="pt-1 text-center">
          <button
            onClick={() => onOpenAdminPanel(packageData)}
            className="text-[11px] text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
          >
            ⚙️ Panel de Asesora (Personalizar Montos y Links)
          </button>
        </div>

      </div>

    </div>
  );
}
