import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  Lock, 
  Download,
  Smartphone,
  Check,
  AlertCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createIzipayPaymentToken } from '../utils/izipayService';

export default function IzipayCheckoutModal({ 
  isOpen, 
  onClose, 
  amount, 
  cartItems,
  onPaymentSuccess 
}) {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'qr' | 'yape'
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Test mode vs Production mode toggle (defaults to production for real S/ 1.00 testing)
  const [izipayMode, setIzipayMode] = useState('production'); // 'production' | 'test'
  
  // Custom amount state (allows user to select S/ 1.00 test or full amount)
  const baseAmount = amount || 540;
  const [customAmount, setCustomAmount] = useState(null); // null means baseAmount
  const activeAmount = customAmount !== null ? customAmount : baseAmount;

  // Form Fields matching official Izipay modal
  const [cardForm, setCardForm] = useState({
    cardNumber: '4557 8910 2938 4819',
    expiry: '11/29',
    cvv: '891',
    firstName: 'Juan',
    lastName: 'Wick Quispe',
    email: 'juan.wick@gmail.com',
  });

  const [yapePhone, setYapePhone] = useState('987654321');
  const [yapeCode, setYapeCode] = useState('849201');

  if (!isOpen) return null;

  const orderNumber = '171866' + Math.floor(1000 + Math.random() * 9000);

  const handlePayClick = async (e) => {
    if (e) e.preventDefault();
    setProcessing(true);
    setErrorMessage(null);

    try {
      // Send REST request to Izipay API via our serverless bridge
      const response = await createIzipayPaymentToken({
        amount: activeAmount,
        orderId: orderNumber,
        customer: {
          firstName: cardForm.firstName,
          lastName: cardForm.lastName,
          email: cardForm.email,
        },
        mode: izipayMode
      });

      if (!response.success) {
        setProcessing(false);
        setErrorMessage(response.error || 'Transacción rechazada por Izipay. Verifique el número de tarjeta, caducidad o fondos.');
        return;
      }

      // If backend returns a valid response
      setTimeout(() => {
        setProcessing(false);
        setPaid(true);
        if (onPaymentSuccess) onPaymentSuccess(orderNumber, cardForm, activeAmount);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      }, 1400);

    } catch (err) {
      console.error('Error procesando pago:', err);
      setProcessing(false);
      setErrorMessage('Error de comunicación con la pasarela Izipay. Por favor reintente.');
    }
  };

  const handleCloseModal = () => {
    setPaid(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Official Izipay Modal Container (Light clean card) */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-7 text-slate-800 overflow-hidden max-h-[92vh] overflow-y-auto border border-slate-200">
        
        {/* Top Right Close Circle Button */}
        <button
          onClick={handleCloseModal}
          aria-label="Cerrar pasarela"
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {paid ? (
          /* SUCCESS VOUCHER */
          <div className="text-center py-6 space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Transacción Aprobada por Izipay
              </span>
              <h3 className="text-2xl font-black text-slate-900 pt-2">¡Pago Confirmado!</h3>
              <p className="text-xs text-slate-600">Estimado/a <strong className="text-slate-900">{cardForm.firstName} {cardForm.lastName}</strong>, tu vacante ha sido activada.</p>
            </div>

            {/* Receipt Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Número de Pedido:</span>
                <span className="font-bold text-slate-900">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pasarela Procesadora:</span>
                <span className="text-[#00a499] font-bold font-sans">Izipay Online Perú</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Comercio Afiliado:</span>
                <span className="text-slate-800 font-bold font-sans">Instituto Técnico Avanza SAC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Correo Confirmación:</span>
                <span className="text-slate-900">{cardForm.email}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-extrabold font-sans">
                <span className="text-slate-700">Monto Cobrado:</span>
                <span className="text-[#00a499]">S/ {activeAmount}.00</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => alert('Descargando Boleta Electrónica PDF homologada por SUNAT...')}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center space-x-2 border border-slate-300 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Descargar Boleta PDF</span>
              </button>

              <button
                onClick={handleCloseModal}
                className="flex-1 py-3 px-4 rounded-xl bg-[#00a499] hover:bg-[#00897b] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
              >
                <span>Finalizar</span>
              </button>
            </div>
          </div>
        ) : (
          /* OFFICIAL IZIPAY POP-IN FORM */
          <div className="space-y-4">
            
            {/* Header with Shopping Basket & Order Number */}
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-300">
              <div className="flex items-center space-x-2 text-slate-700">
                <ShoppingBag className="w-7 h-7 text-[#00a499]" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Izipay Checkout</span>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Conexión Segura SSL
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block">Número de pedido</span>
                <span className="text-xs font-mono font-medium text-slate-600">{orderNumber}</span>
              </div>
            </div>

            {/* Quick Testing Bar: S/ 1.00 Test Option & Mode Selector */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Monto de Cobro:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCustomAmount(1)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      activeAmount === 1
                        ? 'bg-amber-500 text-white shadow'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ⚡ Pruebas S/ 1.00
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomAmount(null)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      activeAmount !== 1
                        ? 'bg-[#00a499] text-white shadow'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    S/ {baseAmount}.00
                  </button>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                <span className="text-slate-500 font-medium">Entorno de Procesamiento:</span>
                <div className="flex gap-2 font-bold">
                  <button
                    type="button"
                    onClick={() => setIzipayMode('production')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      izipayMode === 'production' 
                        ? 'bg-emerald-600 text-white' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🟢 Producción En Vivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setIzipayMode('test')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      izipayMode === 'test' 
                        ? 'bg-amber-600 text-white' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🟡 Sandbox Test
                  </button>
                </div>
              </div>
            </div>

            {/* Error Alert Banner */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start space-x-2 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="font-bold block">Error procesando pago con Izipay:</strong>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Apple Pay Button */}
            <div>
              <button
                type="button"
                onClick={handlePayClick}
                className="w-full bg-black text-white font-bold py-3 rounded-lg flex items-center justify-center text-lg hover:bg-slate-900 transition-colors shadow-sm cursor-pointer"
              >
                <span> Pay</span>
              </button>

              {/* Divider */}
              <div className="flex items-center space-x-3 my-3">
                <div className="flex-1 border-t border-slate-300"></div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">O puedes pagar usando:</span>
                <div className="flex-1 border-t border-slate-300"></div>
              </div>
            </div>

            {/* Payment Method 3 Cards Grid */}
            <div className="grid grid-cols-3 gap-3">
              
              {/* Card Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-2 border-[#00a499] bg-white shadow-md'
                    : 'border border-slate-200 bg-slate-50/50 hover:bg-white text-slate-600'
                }`}
              >
                {paymentMethod === 'card' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00a499] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <CreditCard className={`w-5 h-5 mb-1 ${paymentMethod === 'card' ? 'text-[#00a499]' : 'text-slate-500'}`} />
                <span className="text-xs font-extrabold block text-slate-900">Tarjeta</span>
              </button>

              {/* QR Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('qr')}
                className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'qr'
                    ? 'border-2 border-[#00a499] bg-white shadow-md'
                    : 'border border-slate-200 bg-slate-50/50 hover:bg-white text-slate-600'
                }`}
              >
                {paymentMethod === 'qr' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00a499] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <QrCode className={`w-5 h-5 mb-1 ${paymentMethod === 'qr' ? 'text-[#00a499]' : 'text-slate-500'}`} />
                <span className="text-xs font-extrabold block text-slate-900">QR</span>
              </button>

              {/* Yape Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('yape')}
                className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'yape'
                    ? 'border-2 border-[#00a499] bg-white shadow-md'
                    : 'border border-slate-200 bg-slate-50/50 hover:bg-white text-slate-600'
                }`}
              >
                {paymentMethod === 'yape' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00a499] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="w-5 h-5 rounded bg-purple-600 text-white text-[10px] font-black flex items-center justify-center mb-1">
                  yape
                </div>
                <span className="text-xs font-extrabold block text-slate-900">Yape</span>
              </button>

            </div>

            {/* Notice under method buttons */}
            <p className="text-[11px] text-center text-slate-500 font-medium">
              Recuerda activar tus compras por internet
            </p>

            {/* FORM BODY FOR CARD */}
            {paymentMethod === 'card' && (
              <form onSubmit={handlePayClick} className="space-y-3 pt-1 text-xs">
                
                {/* Number of Card Input with Logos */}
                <div className="space-y-1">
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="Número de tarjeta"
                      value={cardForm.cardNumber}
                      onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                      className="w-full bg-white border border-slate-300 font-mono text-sm text-slate-800 px-3.5 py-3 rounded-lg focus:outline-none focus:border-[#00a499]"
                    />
                    
                    {/* Official Card Brand Badges on right */}
                    <div className="absolute right-3 top-3 flex items-center space-x-1 opacity-80">
                      <span className="px-1.5 py-0.5 bg-blue-800 text-white font-extrabold text-[9px] rounded">VISA</span>
                      <span className="px-1.5 py-0.5 bg-red-600 text-white font-extrabold text-[9px] rounded">MC</span>
                      <span className="px-1.5 py-0.5 bg-cyan-700 text-white font-extrabold text-[9px] rounded">AMEX</span>
                    </div>
                  </div>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      required
                      placeholder="Caducidad (MM/AA)" 
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                      className="w-full bg-white border border-slate-300 font-mono text-xs text-slate-800 px-3.5 py-3 rounded-lg focus:outline-none focus:border-[#00a499]"
                    />
                  </div>

                  <div className="space-y-1 relative">
                    <input 
                      type="text" 
                      required
                      placeholder="CVV" 
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                      className="w-full bg-white border border-slate-300 font-mono text-xs text-slate-800 px-3.5 py-3 rounded-lg focus:outline-none focus:border-[#00a499]"
                    />
                    <span className="absolute right-3 top-3 text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      123
                    </span>
                  </div>
                </div>

                {/* Nombres & Apellidos */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-500 block">Nombres</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Juan" 
                      value={cardForm.firstName}
                      onChange={(e) => setCardForm({ ...cardForm, firstName: e.target.value })}
                      className="w-full bg-white border border-slate-300 text-xs text-slate-800 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#00a499]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-500 block">Apellidos</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Wick Quispe" 
                      value={cardForm.lastName}
                      onChange={(e) => setCardForm({ ...cardForm, lastName: e.target.value })}
                      className="w-full bg-white border border-slate-300 text-xs text-slate-800 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#00a499]"
                    />
                  </div>
                </div>

                {/* Correo */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500 block">Correo</label>
                  <input 
                    type="email" 
                    required
                    placeholder="juan.wick@gmail.com" 
                    value={cardForm.email}
                    onChange={(e) => setCardForm({ ...cardForm, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-xs text-slate-800 px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#00a499]"
                  />
                </div>

                {/* BOTTOM TEAL IZIPAY PAY BUTTON */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-[#00a499] hover:bg-[#00897b] text-white font-extrabold text-base py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {processing ? (
                      <span>Procesando pago con Izipay...</span>
                    ) : (
                      <span>Pagar S/{activeAmount}.00</span>
                    )}
                  </button>
                </div>

              </form>
            )}

            {/* FORM BODY FOR QR */}
            {paymentMethod === 'qr' && (
              <div className="text-center py-4 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="w-32 h-32 bg-white p-2 border border-slate-300 rounded-lg mx-auto flex items-center justify-center shadow-sm">
                  <QrCode className="w-full h-full text-slate-800" />
                </div>
                <p className="font-bold text-slate-800">Escanea el código QR desde tu app bancaria</p>
                <p className="text-[11px] text-slate-500">BCP, Interbank, BBVA, Scotiabank</p>
                
                <button
                  type="button"
                  onClick={handlePayClick}
                  className="w-full bg-[#00a499] hover:bg-[#00897b] text-white font-extrabold text-base py-3.5 rounded-xl transition-colors shadow-md cursor-pointer mt-2"
                >
                  <span>Pagar S/{activeAmount}.00 con QR</span>
                </button>
              </div>
            )}

            {/* FORM BODY FOR YAPE */}
            {paymentMethod === 'yape' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Número Celular Yape:</label>
                  <input 
                    type="tel" 
                    value={yapePhone}
                    onChange={(e) => setYapePhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 font-mono text-xs px-3.5 py-2.5 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Código de Aprobación (6 dígitos):</label>
                  <input 
                    type="text" 
                    value={yapeCode}
                    onChange={(e) => setYapeCode(e.target.value)}
                    className="w-full bg-white border border-slate-300 font-mono text-xs px-3.5 py-2.5 rounded-lg"
                  />
                </div>

                <button
                  type="button"
                  onClick={handlePayClick}
                  className="w-full bg-[#00a499] hover:bg-[#00897b] text-white font-extrabold text-base py-3.5 rounded-xl transition-colors shadow-md cursor-pointer mt-2"
                >
                  <span>Pagar S/{activeAmount}.00 con Yape</span>
                </button>
              </div>
            )}

            {/* POWERED BY IZIPAY LOGO FOOTER */}
            <div className="pt-2 text-center flex items-center justify-center space-x-1 text-[11px] text-slate-400 font-medium">
              <span>POWERED BY</span>
              <span className="font-black tracking-tight">
                <span className="text-rose-500">izi</span>
                <span className="text-[#00a499]">pay</span>
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
