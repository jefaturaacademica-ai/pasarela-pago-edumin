import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  MapPin, 
  Building, 
  Download, 
  ArrowRight,
  Smartphone,
  QrCode,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function IzipayCheckoutModal({ 
  isOpen, 
  onClose, 
  amount, 
  cartItems,
  onPaymentSuccess 
}) {
  const [step, setStep] = useState(1); // 1: Customer Data, 2: Izipay Form & Pay, 3: Success Voucher
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    docType: 'DNI',
    docNumber: '',
    phone: '',
    email: '',
    address: '',
    city: 'Lima',
  });

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'yape' | 'plin' | 'pagoefectivo'
  const [processing, setProcessing] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  if (!isOpen) return null;

  const totalAmount = amount || 540;

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleConfirmIzipayPayment = () => {
    setProcessing(true);
    const newReceipt = 'BO-IZIPAY-' + Math.floor(100000 + Math.random() * 900000);
    setReceiptNumber(newReceipt);

    setTimeout(() => {
      setProcessing(false);
      setStep(3);
      if (onPaymentSuccess) onPaymentSuccess(newReceipt, formData, totalAmount);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    }, 1800);
  };

  const logoUrl = "https://raw.githubusercontent.com/videoconferenciasdiplomado-alt/imagenes/main/logo/logo%20blanco.png";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#0f172a] rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 text-white overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header with Izipay & EDUMIN Logos */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center space-x-3">
            <img 
              src={logoUrl} 
              alt="EDUMIN" 
              className="h-7 object-contain" 
              onError={(e) => e.target.style.display = 'none'}
            />
            <div className="border-l border-slate-700 pl-3">
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-widest">Pasarela Oficial</span>
              <span className="text-sm font-black text-white">Checkout Izipay Online</span>
            </div>
          </div>

          <div className="bg-red-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Izipay Online
          </div>
        </div>

        {/* STEP 1: BILLING & CUSTOMER DETAILS FORM */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4 text-xs">
            
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 space-y-1">
              <p className="font-bold text-white flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Paso 1: Datos de Facturación del Comprador</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Requisito exigido por Izipay y SUNAT para la emisión del comprobante electrónico de matrícula.
              </p>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-200">Nombres del Titular:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mateo Alonso"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200">Apellidos del Titular:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ramos Quispe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Document Type & Number */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-200">Tipo Doc:</label>
                <select
                  value={formData.docType}
                  onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold"
                >
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                  <option value="CE">Carnet Ext.</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-200">Número de Documento:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 74829104"
                  value={formData.docNumber}
                  onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-200">Teléfono / WhatsApp:</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 987654321"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200">Correo Electrónico:</label>
                <input
                  type="email"
                  required
                  placeholder="mateo.ramos@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="font-bold text-slate-200">Dirección de Facturación:</label>
              <input
                type="text"
                required
                placeholder="Av. Javier Prado Este 2400, Surco, Lima"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Total Order Summary Box */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400">Total a Pagar en Checkout:</span>
                <p className="font-bold text-white">{cartItems && cartItems.length > 0 ? `${cartItems.length} Programa(s)` : 'Matrícula EDUMIN'}</p>
              </div>
              <span className="text-2xl font-black text-amber-400 font-mono">S/ {totalAmount}.00</span>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              <span>Continuar al Formulario Izipay</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        )}

        {/* STEP 2: IZIPAY FORM & PAYMENT EXECUTION */}
        {step === 2 && (
          <div className="space-y-5 text-xs animate-fadeIn">
            
            {/* Header info */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-slate-400">Pagador: <strong className="text-white">{formData.firstName} {formData.lastName}</strong></span>
                <p className="text-xs text-blue-300 font-bold font-mono">Doc: {formData.docType} {formData.docNumber}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Monto Izipay</span>
                <span className="text-xl font-black text-amber-400 font-mono">S/ {totalAmount}.00</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-2">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">
                Selecciona Método de Pago en Izipay:
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-red-600/30 border-red-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-red-400" />
                  <span>Tarjetas Crédito/Débito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('yape')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    paymentMethod === 'yape'
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <span>Yape / Plin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('pagoefectivo')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                    paymentMethod === 'pagoefectivo'
                      ? 'bg-amber-600/30 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>PagoEfectivo / Agentes</span>
                </button>
              </div>
            </div>

            {/* Embedded Izipay Smart Form Container (#kr-embedded) */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-red-500/40 space-y-3 relative shadow-inner">
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-[11px] font-black text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Formulario Embebido Izipay (PCI-DSS)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Izipay SDK v2.4</span>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">Número de Tarjeta:</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        readOnly 
                        value="4557 8920 1928 4812" 
                        className="w-full bg-slate-900 border border-slate-700 font-mono text-sm text-white px-3.5 py-2.5 rounded-xl tracking-widest"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-blue-400">VISA / MC</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">Vencimiento (MM/AA):</label>
                      <input type="text" readOnly value="11/29" className="w-full bg-slate-900 border border-slate-700 text-center font-mono text-xs py-2.5 rounded-xl text-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">CVV / CVC:</label>
                      <input type="text" readOnly value="***" className="w-full bg-slate-900 border border-slate-700 text-center font-mono text-xs py-2.5 rounded-xl text-slate-300" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'yape' && (
                <div className="text-center py-2 space-y-2">
                  <p className="text-slate-300 font-semibold">Integración Directa Yape / Plin Izipay</p>
                  <input 
                    type="text" 
                    readOnly 
                    value={formData.phone || "987 654 321"} 
                    className="w-full bg-slate-900 border border-slate-700 text-center font-mono text-xs text-purple-300 py-2.5 rounded-xl"
                  />
                  <p className="text-[10px] text-slate-400">Aprobarás el cobro desde la notificación Push en tu App Yape.</p>
                </div>
              )}

              {paymentMethod === 'pagoefectivo' && (
                <div className="text-center py-2 space-y-2">
                  <p className="text-slate-300 font-semibold">Código CIP PagoEfectivo de 8 Dígitos</p>
                  <p className="text-amber-400 font-mono font-bold text-sm">CIP: 84920194</p>
                  <p className="text-[10px] text-slate-400">Paga en cualquier agente BCP, BBVA, Interbank o Tambo a nivel nacional.</p>
                </div>
              )}

            </div>

            {/* Back & Confirm Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Volver
              </button>

              <button
                type="button"
                onClick={handleConfirmIzipayPayment}
                disabled={processing}
                className="w-2/3 py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                {processing ? (
                  <span>Procesando con Izipay...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 stroke-[2.5]" />
                    <span>Pagar S/ {totalAmount}.00 con Izipay</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: SUCCESS VOUCHER & SUNAT BOLETA */}
        {step === 3 && (
          <div className="text-center py-6 space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                Pago Aprobado por Izipay
              </span>
              <h3 className="text-2xl font-black text-white pt-2">¡Matrícula Confirmada!</h3>
              <p className="text-xs text-slate-300">Estimado/a <strong className="text-white">{formData.firstName} {formData.lastName}</strong>, la transacción ha sido procesada con éxito.</p>
            </div>

            {/* SUNAT Boleta Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Comprobante Electronico:</span>
                <span className="font-bold text-amber-400">{receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pasarela Procesadora:</span>
                <span className="text-red-400 font-bold font-sans">Izipay Online Perú</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Documento Titular:</span>
                <span className="text-white">{formData.docType} {formData.docNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Correo Confirmacion:</span>
                <span className="text-cyan-300">{formData.email}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-base font-extrabold font-sans">
                <span className="text-slate-300">Monto Total Cobrado:</span>
                <span className="text-emerald-400">S/ {totalAmount}.00</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => alert('Descargando Boleta Electrónica PDF homologada SUNAT...')}
                className="flex-1 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-2 border border-slate-700 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Descargar Boleta PDF</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
              >
                <span>Finalizar</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
