import React from 'react';
import { 
  Zap, 
  RefreshCw, 
  FileCheck, 
  MessageSquare, 
  ShieldCheck, 
  Wallet, 
  School, 
  BarChart3, 
  Layers, 
  Bell, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function FeaturesSection({ onOpenRegister }) {
  const features = [
    {
      icon: Zap,
      title: 'Cobro Omnicanal Instantáneo',
      description: 'Permite a los padres de familia pagar vía Yape, Plin, Tarjetas Visa/Mastercard, QR BCP/BBVA o PagoEfectivo desde cualquier dispositivo.',
      badge: 'Yape / Plin Directo',
      accent: 'from-blue-500 to-indigo-600',
    },
    {
      icon: RefreshCw,
      title: 'Conciliación Automática 24/7',
      description: 'Los pagos recibidos se registran de inmediato en el expediente del alumno. Compatible con SIAGIE, Moodle, Chamilo y sistemas ERP.',
      badge: 'Zero Trabajo Manual',
      accent: 'from-teal-400 to-emerald-500',
    },
    {
      icon: FileCheck,
      title: 'Facturación Electrónica SUNAT',
      description: 'Generación y envío automático de Boletas o Facturas electrónicas al correo del apoderado en el momento exacto del pago.',
      badge: '100% Automatizado',
      accent: 'from-purple-500 to-pink-500',
    },
    {
      icon: MessageSquare,
      title: 'Recordatorios por WhatsApp',
      description: 'Envía estados de cuenta y links de pago directos antes del vencimiento. Reduce la tasa de morosidad escolar hasta en un 85%.',
      badge: 'WhatsApp API Oficial',
      accent: 'from-emerald-400 to-teal-600',
    },
    {
      icon: BarChart3,
      title: 'Mora y Descuentos Automatizados',
      description: 'Aplica descuentos pronto pago o recargos por mora según la fecha configurada sin necesidad de ajustar montos manualmente.',
      badge: 'Reglas Personalizables',
      accent: 'from-amber-400 to-orange-500',
    },
    {
      icon: Wallet,
      title: 'Liquidación Diaria a tu Banco',
      description: 'Transferencia automática de tus fondos a la cuenta bancaria de tu institución (BCP, BBVA, Interbank, Scotiabank) en 24 horas.',
      badge: 'Depósitos Directos',
      accent: 'from-cyan-400 to-blue-600',
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-slate-950">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Funcionalidades Especializadas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Todo lo que tu institución necesita para <br />
            <span className="gradient-text">optimizar la cobranza de pensiones.</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Olvídate del voucher por correo y la verificación manual en excel. EDUMIN Pay automatiza cada etapa del proceso de recaudo.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="group relative glass-card p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                <div>
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feature.accent} p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom link indicator */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center text-xs font-semibold text-blue-400 group-hover:text-teal-300 transition-colors">
                  <span>Saber más sobre esta función</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Integration Banner Box */}
        <div className="mt-16 glass-card rounded-2xl p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <School className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">¿Ya utilizas un software académico o ERP?</h4>
              <p className="text-xs sm:text-sm text-slate-400">
                EDUMIN Pay se conecta vía API REST websockets a tu base de datos actual en menos de 48 horas.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenRegister}
            className="w-full lg:w-auto px-6 py-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-lg shrink-0 flex items-center justify-center space-x-2"
          >
            <span>Consultar Compatibilidad de Integración</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
