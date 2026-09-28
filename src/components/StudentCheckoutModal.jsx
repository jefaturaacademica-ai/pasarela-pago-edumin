import React, { useState } from 'react';
import { 
  X, 
  School, 
  CreditCard, 
  Smartphone, 
  QrCode, 
  CheckCircle2, 
  Lock, 
  Download, 
  ShieldCheck,
  Building2,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentCheckoutModal({ isOpen, onClose, linkData }) {
  const [method, setMethod] = useState('yape');
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const logoUrl = "https://raw.githubusercontent.com/videoconferenciasdiplomado-alt/imagenes/main/logo/logo%20blanco.png";

  if (!isOpen) return null;

  // Fallback default order if student clicked directly from landing
  const activeOrder = linkData || {
    id: 'PAGO-DIRECTO',
    clientName: 'Estudiante Matriculado',
    phone: '',
    email: '',
    amount: 540,
    packageName: 'PROGRAMA COMPLETO (Pago al Contado)',
  };

  const handleConfirmPay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    }, 1500);
  };

  const handleCloseModal = () => {
    setPaid(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0f172a] rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 text-white overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {paid ? (
          <div className="text-center py-6 space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                Pago Procesado Exitosamente
              </span>
              <h3 className="text-2xl font-black text-white pt-2">¡Matrícula Aprobada!</h3>
              <p className="text-xs text-slate-300">Estimado/a <strong className="text-white">{activeOrder.clientName}</strong>, tu vacante y acceso al campus han sido activados.</p>
            </div>

            {/* Receipt Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Comprobante SUNAT:</span>
                <span className="font-bold text-amber-400">B001-009892</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Concepto / Programa:</span>
                <span className="text-white font-sans font-bold">{activeOrder.packageName}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-base font-extrabold font-sans">
                <span className="text-slate-300">Monto Cobrado:</span>
                <span className="text-emerald-400">S/ {activeOrder.amount}.00</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => alert('Descargando Boleta Electrónica y Constancia de Pago PDF...')}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 border border-slate-700 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Descargar Boleta PDF</span>
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
              >
                <span>Finalizar</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Logo Header */}
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <img 
                src={logoUrl} 
                alt="EDUMIN Logo" 
                className="h-7 object-contain" 
                onError={(e) => e.target.style.display = 'none'}
              />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">Pasarela Oficial EDUMIN</h3>
                <p className="text-sm font-black text-white">Portal Seguro de Inscripción</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Estudiante:</span>
                <span className="font-bold text-white font-sans">{activeOrder.clientName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Programa / Concepto:</span>
                <span className="font-bold text-blue-300">{activeOrder.packageName}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
                <span className="font-bold text-slate-300 uppercase tracking-wider">Monto Total a Pagar:</span>
                <span className="text-2xl font-black text-amber-400 font-mono">S/ {activeOrder.amount}.00</span>
              </div>
            </div>

            {/* Method Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Selecciona medio de pago:
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('yape')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    method === 'yape'
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <span>Yape / Plin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    method === 'card'
                      ? 'bg-blue-600/30 border-blue-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span>Tarjeta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('qr')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    method === 'qr'
                      ? 'bg-teal-600/30 border-teal-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-teal-400" />
                  <span>QR BCP/BBVA</span>
                </button>
              </div>
            </div>

            {/* Interactive Method Fields */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-center space-y-2">
              {method === 'yape' && (
                <div className="space-y-2">
                  <p className="text-slate-300 font-semibold">Pago Express con Yape / Plin</p>
                  <input 
                    type="text" 
                    readOnly 
                    value={activeOrder.phone || "987 *** 321"} 
                    className="w-full bg-slate-900 border border-slate-800 text-center font-mono text-xs text-purple-300 py-2 rounded-lg"
                  />
                  <p className="text-[10px] text-slate-400">Recibirás una notificación para aprobar el pago en tu App de Yape</p>
                </div>
              )}

              {method === 'card' && (
                <div className="space-y-2 text-left">
                  <input 
                    type="text" 
                    readOnly 
                    value="4557 •••• •••• 9812 (VISA / Mastercard)" 
                    className="w-full bg-slate-900 border border-slate-800 font-mono text-xs text-blue-300 px-3 py-2 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" readOnly value="11/29" className="bg-slate-900 border border-slate-800 text-center font-mono text-xs py-1.5 rounded-lg text-slate-400" />
                    <input type="text" readOnly value="***" className="bg-slate-900 border border-slate-800 text-center font-mono text-xs py-1.5 rounded-lg text-slate-400" />
                  </div>
                </div>
              )}

              {method === 'qr' && (
                <div className="flex items-center justify-center space-x-3 py-1">
                  <QrCode className="w-12 h-12 text-slate-900 bg-white p-1 rounded-md" />
                  <div className="text-left text-[11px]">
                    <p className="font-bold text-white">QR Dinámico Generado</p>
                    <p className="text-slate-400">Acepta BCP, Interbank, BBVA</p>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Payment Button */}
            <button
              onClick={handleConfirmPay}
              disabled={processing}
              className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-400/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              {processing ? (
                <span>Procesando pago seguro...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>Pagar S/ {activeOrder.amount}.00 Ahora</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conexión encriptada SSL 256 bits protegida por PCI-DSS Level 1.</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
