import React from 'react';
import { Smartphone, CreditCard, QrCode, Building2, CheckCircle2 } from 'lucide-react';

export default function PaymentMethodsSection() {
  const methods = [
    { name: 'Yape', category: 'Billetera Digital', speed: 'Inmediato', color: 'from-purple-600 to-indigo-600', icon: '📱' },
    { name: 'Plin', category: 'Billetera Interoperable', speed: 'Inmediato', color: 'from-teal-500 to-emerald-600', icon: '⚡' },
    { name: 'Visa', category: 'Débito / Crédito', speed: 'En segundos', color: 'from-blue-600 to-blue-800', icon: '💳' },
    { name: 'Mastercard', category: 'Débito / Crédito', speed: 'En segundos', color: 'from-red-600 to-amber-600', icon: '💳' },
    { name: 'QR Interoperable', category: 'BCP / BBVA / Interbank', speed: 'Inmediato', color: 'from-cyan-500 to-blue-600', icon: '🔳' },
    { name: 'PagoEfectivo', category: 'Agentes y Ventanilla', speed: 'Hasta 24h', color: 'from-amber-500 to-orange-600', icon: '🏦' },
  ];

  return (
    <section className="py-20 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Canales de Pago Aceptados</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Dale a los padres de familia todas las facilidades de pago
          </h2>
          <p className="text-slate-400 text-sm">
            Cero excusas para el retraso de pensiones. Integración nativa con los principales bancos y billeteras del Perú.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {methods.map((method, idx) => (
            <div 
              key={idx}
              className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all text-center space-y-3 group hover:-translate-y-1"
            >
              <div className="text-3xl">{method.icon}</div>
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{method.name}</h4>
                <p className="text-[11px] text-slate-400">{method.category}</p>
              </div>
              <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {method.speed}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
