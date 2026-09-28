import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function PricingSection({ onOpenRegister }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  const plans = [
    {
      name: 'Colegio Pyme',
      tagline: 'Ideal para nidos, jardines y colegios iniciales hasta 300 alumnos.',
      price: 'S/ 0',
      period: 'sin costo fijo mensual',
      rate: '1.9% + S/ 0.30 por transacción',
      popular: false,
      buttonText: 'Empezar Gratis',
      features: [
        'Hasta 300 alumnos matriculados',
        'Cobro por Yape, Plin y Tarjetas',
        'Portal de Pagos Web para Apoderados',
        'Conciliación contable básica en Excel',
        'Soporte por Email y Ticket',
        'Comprobante Electrónico (Boleta/Factura)',
      ],
    },
    {
      name: 'Edumin Pro',
      tagline: 'Para colegios e institutos consolidados que buscan automatizar la cobranza.',
      price: billingCycle === 'annual' ? 'S/ 149' : 'S/ 199',
      period: 'por mes (facturación anual opcional)',
      rate: '1.5% + S/ 0.20 por transacción',
      popular: true,
      buttonText: 'Afiliar Institución Pro',
      features: [
        'Hasta 1,200 alumnos matriculados',
        'Todos los métodos de pago (Yape, Plin, Tarjetas, QR, PagoEfectivo)',
        'Recordatorios Automáticos por WhatsApp API',
        'Conciliación Automática 24/7 con ERP / SIAGIE',
        'Facturación Electrónica SUNAT Ilimitada',
        'Soporte Prioritario por WhatsApp & Teléfono',
        'Panel Administrativo Multi-Usuario EDUMIN',
      ],
    },
    {
      name: 'Corporativo & Redes',
      tagline: 'Para redes de colegios, institutos superiores y universidades multi-sede.',
      price: 'Personalizado',
      period: 'tasa negociada por volumen',
      rate: 'Tasa Preferencial Corporativa',
      popular: false,
      buttonText: 'Hablar con un Ejecutivo',
      features: [
        'Alumnos ilimitados / Múltiples sedes',
        'Integración a medida vía API Websockets',
        'Account Manager dedicado 24/7',
        'Liquidación bancaria prioritaria el mismo día',
        'SLA garantizado del 99.99%',
        'Contratos a medida y auditoría PCI-DSS',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Precios Transparentes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Planes adaptados al tamaño de <br />
            <span className="gradient-text">tu comunidad educativa.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Sin costos ocultos ni penalidades. Elige la modalidad que mejor se ajuste a tu recaudo.
          </p>

          {/* Billing Toggle */}
          <div className="pt-4 flex justify-center">
            <div className="bg-slate-900 p-1.5 rounded-full border border-slate-800 flex items-center space-x-2">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Anual</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ahorra 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative glass-card rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'border-indigo-500/80 shadow-2xl shadow-indigo-500/20 bg-slate-900/90 lg:-translate-y-2'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/80'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg border border-indigo-400/40">
                  Más Elegido por Colegios
                </div>
              )}

              <div>
                <h3 className="text-2xl font-extrabold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-6 min-h-[36px]">{plan.tagline}</p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-extrabold text-white font-mono">{plan.price}</span>
                    {plan.price !== 'Personalizado' && <span className="text-xs text-slate-400">/{plan.period}</span>}
                  </div>
                  <div className="mt-2 text-xs font-bold text-teal-300 bg-teal-500/10 px-3 py-1 rounded-lg border border-teal-500/20 inline-block">
                    Tasa: {plan.rate}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Incluye:</p>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start space-x-3 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onOpenRegister}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                <span>{plan.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
