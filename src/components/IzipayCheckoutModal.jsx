import React, { useState, useEffect, useRef } from 'react';
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
  Zap,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createIzipayPaymentToken, loadIzipayScript, IZIPAY_CONFIG } from '../utils/izipayService';

export default function IzipayCheckoutModal({ 
  isOpen, 
  onClose, 
  amount, 
  cartItems,
  onPaymentSuccess 
}) {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'qr' | 'yape'
  const [processing, setProcessing] = useState(false);
  const [loadingToken, setLoadingToken] = useState(false);
  const [paid, setPaid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Real Izipay formToken & connection status
  const [formToken, setFormToken] = useState(null);
  const [activePublicKey, setActivePublicKey] = useState(IZIPAY_CONFIG.prodPublicKey);

  // Mode: 'production' for REAL BANK CHARGES or 'test'
  const [izipayMode, setIzipayMode] = useState('production');
  
  // Custom amount state (allows user to select S/ 1.00 test or full amount)
  const baseAmount = amount || 540;
  const [customAmount, setCustomAmount] = useState(null); // null means baseAmount
  const activeAmount = customAmount !== null ? customAmount : baseAmount;

  const [yapePhone, setYapePhone] = useState('987654321');
  const [yapeCode, setYapeCode] = useState('849201');

  // Ref for kr-embedded container
  const krContainerRef = useRef(null);

  const orderNumber = useRef('171866' + Math.floor(1000 + Math.random() * 9000)).current;

  // Initialize Izipay formToken and KR SDK whenever mode, amount, or modal visibility changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoadingToken(true);
    setErrorMessage(null);
    setFormToken(null);

    const initIzipay = async () => {
      try {
        // 1. Request real formToken from backend /api/create-payment
        const tokenRes = await createIzipayPaymentToken({
          amount: activeAmount,
          orderId: orderNumber,
          customer: {
            email: 'alumno@edumin.pe',
            phone: '987654321',
            firstName: 'Alumno',
            lastName: 'EDUMIN'
          },
          mode: izipayMode
        });

        if (!isMounted) return;

        if (tokenRes.success && tokenRes.formToken) {
          setFormToken(tokenRes.formToken);
          const pKey = tokenRes.publicKey || (izipayMode === 'production' ? IZIPAY_CONFIG.prodPublicKey : IZIPAY_CONFIG.testPublicKey);
          setActivePublicKey(pKey);

          // 2. Load Krypton SDK script dynamically
          await loadIzipayScript(pKey);

          if (window.KR && typeof window.KR.setFormConfig === 'function') {
            window.KR.setFormConfig({
              'kr-form-token': tokenRes.formToken,
              'kr-public-key': pKey,
              'kr-post-url-success': window.location.origin + '/payment-success'
            });

            // Listen to real transaction submit & error events
            window.KR.onSubmit((paymentData) => {
              console.log('Transacción Izipay Real Exitosa:', paymentData);
              setPaid(true);
              if (onPaymentSuccess) onPaymentSuccess(orderNumber, {}, activeAmount);
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
              return false;
            });

            window.KR.onError((error) => {
              console.error('Error de pago en Izipay SDK:', error);
              setErrorMessage(error.errorMessage || 'Transacción rechazada por el banco emisor.');
            });
          }
        } else {
          setErrorMessage(tokenRes.error || 'No se pudo obtener la sesión de pago de Izipay.');
        }
      } catch (err) {
        console.error('Error en inicialización Izipay:', err);
        if (isMounted) setErrorMessage('Error conectando con la pasarela Izipay.');
      } finally {
        if (isMounted) setLoadingToken(false);
      }
    };

    initIzipay();

    return () => {
      isMounted = false;
    };
  }, [isOpen, izipayMode, activeAmount]);

  if (!isOpen) return null;

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
              <p className="text-xs text-slate-600">Tu tarjeta ha sido procesada con éxito y tu vacante ha sido activada.</p>
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
                <span className="text-slate-800 font-bold font-sans">Instituto Técnico Avanza SAC (74025911)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-extrabold font-sans">
                <span className="text-slate-700">Monto Cobrado Real:</span>
                <span className="text-[#00a499]">S/ {activeAmount}.00 PEN</span>
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
                  <span className="text-xs font-bold text-slate-900 block">Pasarela Izipay Perú</span>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Conexión Bancaria Directa SSL
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
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Monto a Cobrar:
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
                    ⚡ Prueba Real S/ 1.00
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
                    className={`px-2.5 py-1 rounded-md text-xs cursor-pointer flex items-center gap-1 ${
                      izipayMode === 'production' 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-white border border-slate-300 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🟢 Producción En Vivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setIzipayMode('test')}
                    className={`px-2.5 py-1 rounded-md text-xs cursor-pointer flex items-center gap-1 ${
                      izipayMode === 'test' 
                        ? 'bg-amber-600 text-white shadow-sm' 
                        : 'bg-white border border-slate-300 text-slate-600 hover:text-slate-900'
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
                  <strong className="font-bold block">Respuesta de Izipay:</strong>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Loading Spinner during Token Generation */}
            {loadingToken ? (
              <div className="text-center py-8 space-y-3">
                <RefreshCw className="w-8 h-8 text-[#00a499] animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-600">Generando sesión de pago segura con Izipay...</p>
                <p className="text-[11px] text-slate-400">Comercio: Instituto Técnico Avanza SAC (74025911)</p>
              </div>
            ) : (
              /* REAL EMBEDDED IZIPAY SMART FORM CONTAINER & SMART UI */
              <div className="space-y-4">
                
                {/* Official Izipay Krypton Embedded Smart Form */}
                {formToken && (
                  <div className="p-3 border border-slate-200 bg-slate-50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-[#00a499]" />
                        Formulario de Cobro Bancario Directo
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                        formToken Activo
                      </span>
                    </div>

                    {/* OFFICIAL IZIPAY KR-EMBEDDED CONTAINER */}
                    <div 
                      ref={krContainerRef}
                      className="kr-embedded py-2" 
                      kr-form-token={formToken}
                    >
                      {/* Standard Izipay Form Fields */}
                      <div className="kr-pan my-1"></div>
                      <div className="kr-expiry my-1"></div>
                      <div className="kr-security-code my-1"></div>
                      
                      {/* Submit button rendered by Izipay SDK */}
                      <button className="kr-payment-button w-full bg-[#00a499] text-white font-black py-3 rounded-xl shadow-md mt-3 cursor-pointer">
                        Pagar S/ {activeAmount}.00 con Tarjeta
                      </button>

                      {/* Error messaging rendered by Izipay SDK */}
                      <div className="kr-form-error text-xs text-rose-600 font-bold mt-2"></div>
                    </div>
                  </div>
                )}

                {/* Alternate QR / YAPE Payment Tabs */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qr')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'qr' ? 'border-2 border-[#00a499] bg-white font-bold' : 'border border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1 text-[#00a499]" />
                    <span className="text-xs">Pago QR BCP/BBVA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('yape')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'yape' ? 'border-2 border-[#00a499] bg-white font-bold' : 'border border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <span className="text-xs">Pago con Yape</span>
                  </button>
                </div>

                {/* QR / YAPE Details */}
                {paymentMethod === 'qr' && (
                  <div className="text-center py-4 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <QrCode className="w-24 h-24 text-slate-800 mx-auto" />
                    <p className="font-bold text-slate-800">Escanea desde BCP, Interbank, BBVA o Scotiabank</p>
                    <p className="text-[11px] text-slate-500">Monto: S/ {activeAmount}.00 PEN</p>
                  </div>
                )}

                {paymentMethod === 'yape' && (
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <label className="font-bold text-slate-700">Número Yape:</label>
                      <input type="tel" value={yapePhone} onChange={(e) => setYapePhone(e.target.value)} className="w-full bg-white border border-slate-300 font-mono text-xs px-3 py-2 rounded-lg" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">Código de Aprobación (6 dígitos):</label>
                      <input type="text" value={yapeCode} onChange={(e) => setYapeCode(e.target.value)} className="w-full bg-white border border-slate-300 font-mono text-xs px-3 py-2 rounded-lg" />
                    </div>
                  </div>
                )}

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
