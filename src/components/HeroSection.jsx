import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  TrendingUp, 
  Building2, 
  Users, 
  Lock,
  Sparkles,
  School
} from 'lucide-react';

export default function HeroSection({ onOpenDemo, onOpenRegister }) {
  const [activePaymentTab, setActivePaymentTab] = useState('yape');
  const [simulatedPaid, setSimulatedPaid] = useState(false);

  const handleSimulatePayment = () => {
    setSimulatedPaid(true);
    setTimeout(() => {
      setSimulatedPaid(false);
    }, 4000);
  };

  return (
    <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-glow" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Diseñado con la Interfaz & Ecosistema EDUMIN</span>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">v2.4</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Recaudación de pensiones <br className="hidden sm:inline" />
              <span className="gradient-text">sin filas, sin mora y 100% automatizada.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              La pasarela de pago omnicanal integrada para <strong className="text-white">Colegios, Institutos y Universidades</strong>. 
              Cobra pensiones y matrículas vía <span className="text-teal-300 font-semibold">Yape, Plin, Tarjetas y PagoEfectivo</span> con conciliación bancaria instantánea.
            </p>

            {/* Quick Bullet Checklist */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0 text-xs sm:text-sm text-slate-300 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Emisión automática de Boletas/Facturas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Conciliación automática con ERP / SIAGIE</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Recordatorios por WhatsApp antes del vencimiento</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Liquidaciones diarias a tu cuenta de banco</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center space-x-2.5 group cursor-pointer"
              >
                <span>Afiliar mi Colegio / Universidad</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenDemo}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl hover:border-slate-600 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                <span>Ver Simulación Interactiva</span>
              </button>
            </div>

            {/* Security Compliance badges */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>PCI-DSS Level 1 Compliant</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Encriptación 256-bit SSL</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <School className="w-4 h-4 text-indigo-400" />
                <span>Integrado a EDUMIN LMS</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Payment Gateway Mock Widget */}
          <div className="lg:col-span-5 relative">
            
            {/* Outer Decorative Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-400 rounded-3xl blur-xl opacity-30 animate-pulse-slow pointer-events-none" />

            {/* Interactive Checkout Card Container */}
            <div className="relative glass-card rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-700/70 text-slate-100">
              
              {/* Header inside Card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <School className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Portal de Pagos EDUMIN</h3>
                    <p className="text-sm font-semibold text-white">Colegio San Agustín - Lima</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>En Línea</span>
                </span>
              </div>

              {/* Student info box */}
              <div className="my-4 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Estudiante:</span>
                  <span className="font-semibold text-white">Mateo Rodas (3° Secundaria)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Concepto:</span>
                  <span className="font-medium text-slate-200">Pensión Septiembre 2026</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-700/50">
                  <span className="text-xs text-slate-400 font-medium">Monto a pagar:</span>
                  <span className="text-xl font-extrabold text-teal-300 font-mono">S/ 480.00</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Selecciona método de pago:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePaymentTab('yape')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 border ${
                      activePaymentTab === 'yape'
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-md shadow-purple-900/30'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-purple-400" />
                    <span>Yape / Plin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePaymentTab('card')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 border ${
                      activePaymentTab === 'card'
                        ? 'bg-blue-600/30 border-blue-500 text-white shadow-md shadow-blue-900/30'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span>Tarjetas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePaymentTab('qr')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 border ${
                      activePaymentTab === 'qr'
                        ? 'bg-teal-600/30 border-teal-500 text-white shadow-md shadow-teal-900/30'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-teal-400" />
                    <span>QR BCP/BBVA</span>
                  </button>
                </div>
              </div>

              {/* Payment Tab Active Content */}
              <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 min-h-[140px] flex flex-col justify-center">
                {activePaymentTab === 'yape' && (
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-purple-400" />
                      <span>Pago Express en 5 segundos sin comisiones ocultas</span>
                    </div>
                    <p className="text-xs text-slate-400">Ingresa tu número celular registrado en Yape/Plin o escanea el QR en pantalla.</p>
                    <div className="flex space-x-2 pt-1">
                      <input 
                        type="text" 
                        readOnly 
                        value="987 *** 432" 
                        className="flex-1 bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 text-center font-mono"
                      />
                    </div>
                  </div>
                )}

                {activePaymentTab === 'card' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Tarjeta de Débito/Crédito</span>
                      <span className="font-mono text-slate-500">•••• 4829</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value="VISA / Mastercard" 
                        className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-1.5 font-medium"
                      />
                      <input 
                        type="text" 
                        readOnly 
                        value="Exp: 11/29" 
                        className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-1.5 text-center font-mono"
                      />
                    </div>
                  </div>
                )}

                {activePaymentTab === 'qr' && (
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-20 h-20 bg-white p-1.5 rounded-lg flex items-center justify-center shadow-lg">
                      <QrCode className="w-full h-full text-slate-900" />
                    </div>
                    <div className="text-left text-xs space-y-1">
                      <p className="font-bold text-white">Escanea desde tu App Bancaria</p>
                      <p className="text-slate-400">BCP, Interbank, BBVA, Scotiabank</p>
                      <p className="text-[10px] text-teal-400 font-semibold">Validez: 14:59 minutos</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Payment Button */}
              <div className="mt-4">
                {simulatedPaid ? (
                  <div className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold text-center flex items-center justify-center space-x-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>¡Pago Exitoso! Boleta Electrónica enviada al correo del apoderado</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSimulatePayment}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Confirmar Pago S/ 480.00</span>
                  </button>
                )}
              </div>

              {/* Floating Badge on Card */}
              <div className="absolute -bottom-4 -right-4 bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl flex items-center space-x-2 text-xs">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Recaudo Diario</p>
                  <p className="text-xs font-bold text-white">S/ 48,920.00 (94.2%)</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
