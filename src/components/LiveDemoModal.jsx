import React, { useState } from 'react';
import { 
  X, 
  School, 
  CreditCard, 
  Smartphone, 
  QrCode, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Building2, 
  Download,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LiveDemoModal({ isOpen, onClose, onOpenRegister }) {
  const [step, setStep] = useState(1); // 1: Select Student & Concept, 2: Payment Method, 3: Success Screen
  const [selectedStudent, setSelectedStudent] = useState('mateo');
  const [method, setMethod] = useState('yape');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const studentsData = {
    mateo: { name: 'Mateo Rodas (3° Sec A)', concept: 'Pensión Septiembre 2026', amount: 'S/ 480.00' },
    camila: { name: 'Camila Rodas (1° Sec B)', concept: 'Pensión Septiembre 2026', amount: 'S/ 480.00' },
    lucas: { name: 'Lucas Rodas (5° Primaria)', concept: 'Taller de Robótica Escolar', amount: 'S/ 150.00' },
  };

  const currentStudent = studentsData[selectedStudent];

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep(3);
      // Trigger festive confetti on payment success!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const handleReset = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg glass-card rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 bg-slate-900 text-slate-100 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <School className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Simulador de Pasarela EDUMIN</h3>
            <p className="text-xs text-slate-400">Prueba la experiencia de pago del apoderado</p>
          </div>
        </div>

        {/* Step 1: Selection */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                1. Selecciona el estudiante de la familia:
              </label>
              
              <div className="space-y-2">
                {Object.keys(studentsData).map((key) => {
                  const s = studentsData[key];
                  const isSelected = selectedStudent === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedStudent(key)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                        isSelected 
                          ? 'bg-blue-600/20 border-blue-500 text-white' 
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-200">{s.name}</p>
                        <p className="text-[11px] text-slate-400">{s.concept}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-teal-300">{s.amount}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Continuar al Pago</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Method Choice & Confirm */}
        {step === 2 && (
          <div className="space-y-5">
            
            {/* Selected Summary */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400">Pagar para:</span>
                <p className="font-bold text-white">{currentStudent.name}</p>
              </div>
              <span className="text-base font-extrabold text-teal-300 font-mono">{currentStudent.amount}</span>
            </div>

            {/* Methods */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                2. Selecciona medio de pago:
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMethod('yape')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    method === 'yape'
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <span>Yape / Plin</span>
                </button>

                <button
                  onClick={() => setMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    method === 'card'
                      ? 'bg-blue-600/30 border-blue-500 text-white'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span>Tarjeta</span>
                </button>

                <button
                  onClick={() => setMethod('qr')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    method === 'qr'
                      ? 'bg-teal-600/30 border-teal-500 text-white'
                      : 'bg-slate-800/40 border-slate-700 text-slate-400'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-teal-400" />
                  <span>QR Banco</span>
                </button>
              </div>
            </div>

            {/* Interactive Fake Form */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              {method === 'yape' && (
                <div className="space-y-2 text-center">
                  <p className="text-slate-300 font-semibold">Aprobación Rápida Yape / Plin</p>
                  <input 
                    type="text" 
                    readOnly 
                    value="987 654 321 (Celular del apoderado)"
                    className="w-full bg-slate-900 border border-slate-800 text-center font-mono text-xs text-purple-300 py-2 rounded-lg"
                  />
                  <p className="text-[10px] text-slate-500">Recibirás una solicitud de confirmación en tu App de Yape</p>
                </div>
              )}

              {method === 'card' && (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    readOnly 
                    value="4557 •••• •••• 8912" 
                    className="w-full bg-slate-900 border border-slate-800 font-mono text-xs text-blue-300 px-3 py-2 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" readOnly value="10/28" className="bg-slate-900 border border-slate-800 text-center font-mono text-xs py-1.5 rounded-lg text-slate-400" />
                    <input type="text" readOnly value="***" className="bg-slate-900 border border-slate-800 text-center font-mono text-xs py-1.5 rounded-lg text-slate-400" />
                  </div>
                </div>
              )}

              {method === 'qr' && (
                <div className="flex items-center space-x-3 justify-center py-1">
                  <QrCode className="w-12 h-12 text-teal-400 bg-white p-1 rounded-md" />
                  <div className="text-left text-[11px]">
                    <p className="font-bold text-white">Código Dinámico Generado</p>
                    <p className="text-slate-400">Escanea desde BCP o BBVA</p>
                  </div>
                </div>
              )}
            </div>

            {/* Back & Submit */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handlePay}
                disabled={processing}
                className="w-2/3 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {processing ? (
                  <span>Procesando pago...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pagar {currentStudent.amount}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* Step 3: Success Voucher Receipt */}
        {step === 3 && (
          <div className="text-center space-y-5 py-2 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-white">¡Transacción Exitosa!</h4>
              <p className="text-xs text-slate-400">Pensión registrada de forma instantánea en la base de datos de la institución.</p>
            </div>

            {/* Voucher Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">N° de Recibo:</span>
                <span className="font-bold text-blue-400">REC-2026-9083</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estudiante:</span>
                <span className="text-slate-200">{currentStudent.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Boleta SUNAT:</span>
                <span className="text-emerald-400">B001-004913</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-extrabold font-sans">
                <span className="text-slate-300">Total Cobrado:</span>
                <span className="text-teal-300">{currentStudent.amount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => alert('Descargando Boleta Electrónica PDF de prueba...')}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Descargar Boleta PDF</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <span>Afiliar mi Colegio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
