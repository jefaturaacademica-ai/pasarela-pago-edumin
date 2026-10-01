import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShoppingBag, 
  CreditCard, 
  CheckCircle2, 
  Download,
  AlertCircle,
  ShieldCheck,
  Zap,
  RefreshCw,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Edit2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createIzipayPaymentToken, loadIzipayScript, IZIPAY_CONFIG } from '../utils/izipayService';

export default function IzipayCheckoutModal({ 
  isOpen, 
  onClose, 
  amount, 
  cartItems,
  onPaymentSuccess,
  isAdminLoggedIn = false
}) {
  // Step state: 'info' (Datos del Alumno) -> 'payment' (Formulario Izipay)
  const [step, setStep] = useState('info');

  // Student form fields
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [formValidationError, setFormValidationError] = useState('');

  const [loadingToken, setLoadingToken] = useState(false);
  const [paid, setPaid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Real Izipay formToken & connection status
  const [formToken, setFormToken] = useState(null);
  const [activePublicKey, setActivePublicKey] = useState(IZIPAY_CONFIG.prodPublicKey);

  // Mode: 'production' by default for real bank charges
  const [izipayMode, setIzipayMode] = useState('production');
  
  // Custom amount state (allows admin to select S/ 1.00 test or full amount)
  const baseAmount = amount || 540;
  const [customAmount, setCustomAmount] = useState(null);
  const activeAmount = (isAdminLoggedIn && customAmount !== null) ? customAmount : baseAmount;

  // Fresh order number generated on every modal open or amount/mode change
  const [orderNumber, setOrderNumber] = useState('');

  // Ref for kr-embedded container
  const krContainerRef = useRef(null);

  // Package Title derived from cartItems or default
  const packageName = cartItems && cartItems.length > 0 
    ? cartItems.map(item => item.title).join(', ') 
    : 'PROGRAMA DE ESPECIALIZACIÓN EDUMIN';

  // Helper to trigger fresh order and token generation
  const handleSelectAmount = (newAmount) => {
    setCustomAmount(newAmount);
    setOrderNumber('171866' + Math.floor(1000 + Math.random() * 9000));
  };

  const handleSelectMode = (newMode) => {
    setIzipayMode(newMode);
    setOrderNumber('171866' + Math.floor(1000 + Math.random() * 9000));
  };

  // Helper function to send webhook notification to n8n
  const notifyN8n = async (status, errorMsg = null, paymentData = null) => {
    try {
      await fetch('/api/notify-n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          orderNumber,
          amount: activeAmount,
          currency: 'PEN',
          customer: {
            name: studentName.trim() || 'Alumno EDUMIN',
            email: studentEmail.trim() || 'alumno@edumin.pe',
            phone: studentPhone.trim() || '987654321'
          },
          packageName,
          mode: izipayMode,
          errorMessage: errorMsg,
          paymentData
        })
      });
    } catch (err) {
      console.warn('Error notificando al webhook de n8n:', err);
    }
  };

  // Commercial WhatsApp Link pre-filled message
  const getCommercialWhatsappUrl = () => {
    const message = `Hola Comercial EDUMIN 🎓, acabo de realizar mi pago con éxito en la pasarela Izipay.\n\n` +
      `📌 *Número de Pedido:* ${orderNumber}\n` +
      `👤 *Alumno:* ${studentName || 'Alumno'}\n` +
      `📧 *Correo:* ${studentEmail || 'Correo'}\n` +
      `📱 *Teléfono:* ${studentPhone || 'Teléfono'}\n` +
      `📚 *Programa:* ${packageName}\n` +
      `💳 *Monto Pagado:* S/ ${activeAmount}.00 PEN\n\n` +
      `Por favor solicito la confirmación de mi matrícula e ingreso al aula virtual.`;
    return `https://wa.me/51951101765?text=${encodeURIComponent(message)}`;
  };

  // Reset state and generate fresh orderNumber whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setOrderNumber('171866' + Math.floor(1000 + Math.random() * 9000));
      setPaid(false);
      setErrorMessage(null);
      setFormToken(null);
      setCustomAmount(null);
      setStep('info');
      setFormValidationError('');

      // Pre-fill student data if saved in localStorage
      const savedStudent = localStorage.getItem('edumin_last_student_info');
      if (savedStudent) {
        try {
          const parsed = JSON.parse(savedStudent);
          if (parsed.name) setStudentName(parsed.name);
          if (parsed.email) setStudentEmail(parsed.email);
          if (parsed.phone) setStudentPhone(parsed.phone);
        } catch (e) {
          console.warn('Error reading saved student info:', e);
        }
      }
    }
  }, [isOpen]);

  // Handle Form Step 1 Submission
  const handleProceedToPayment = (e) => {
    if (e) e.preventDefault();
    setFormValidationError('');

    if (!studentName.trim()) {
      setFormValidationError('Por favor ingresa tus Nombres y Apellidos completos.');
      return;
    }
    if (!studentEmail.trim() || !studentEmail.includes('@')) {
      setFormValidationError('Por favor ingresa un Correo Electrónico válido.');
      return;
    }
    if (!studentPhone.trim() || studentPhone.length < 6) {
      setFormValidationError('Por favor ingresa un número de Teléfono / WhatsApp válido.');
      return;
    }

    // Save student info for convenience
    localStorage.setItem('edumin_last_student_info', JSON.stringify({
      name: studentName.trim(),
      email: studentEmail.trim(),
      phone: studentPhone.trim()
    }));

    setStep('payment');
  };

  // Initialize Izipay formToken and KR SDK whenever step changes to 'payment' or mode/amount/orderNumber changes
  useEffect(() => {
    if (!isOpen || step !== 'payment' || !orderNumber) return;

    let isMounted = true;
    setLoadingToken(true);
    setErrorMessage(null);
    setFormToken(null);

    // Clean previous forms from Krypton SDK if present
    if (window.KR && typeof window.KR.removeForms === 'function') {
      try {
        window.KR.removeForms();
      } catch (e) {
        console.warn('Clean forms warning:', e);
      }
    }

    const initIzipay = async () => {
      try {
        // 1. Request real formToken from backend /api/create-payment with STUDENT DATA
        const tokenRes = await createIzipayPaymentToken({
          amount: activeAmount,
          orderId: orderNumber,
          customer: {
            fullName: studentName.trim() || 'Alumno EDUMIN',
            email: studentEmail.trim() || 'alumno@edumin.pe',
            phone: studentPhone.trim() || '987654321'
          },
          mode: izipayMode
        });

        if (!isMounted) return;

        if (tokenRes.success && tokenRes.formToken) {
          setFormToken(tokenRes.formToken);
          const pKey = tokenRes.publicKey || (izipayMode === 'production' ? IZIPAY_CONFIG.prodPublicKey : IZIPAY_CONFIG.testPublicKey);
          setActivePublicKey(pKey);

          // 2. Load Krypton SDK script dynamically with matching public key
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
              
              // Notify n8n Webhook
              notifyN8n('SUCCESS', null, paymentData);

              if (onPaymentSuccess) onPaymentSuccess(orderNumber, { name: studentName, email: studentEmail, phone: studentPhone }, activeAmount);
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });

              // Auto-open WhatsApp Commercial
              setTimeout(() => {
                window.open(getCommercialWhatsappUrl(), '_blank');
              }, 800);

              return false;
            });

            window.KR.onError((error) => {
              console.error('Error de pago en Izipay SDK:', error);
              const errTxt = error.errorMessage || 'Transacción rechazada por el banco emisor.';
              setErrorMessage(errTxt);

              // Notify n8n Webhook on rejection
              notifyN8n('REJECTED', errTxt, error);
            });
          }
        } else {
          const errTxt = tokenRes.error || 'No se pudo obtener la sesión de pago de Izipay.';
          setErrorMessage(errTxt);
          notifyN8n('ERROR', errTxt, null);
        }
      } catch (err) {
        console.error('Error en inicialización Izipay:', err);
        if (isMounted) {
          setErrorMessage('Error conectando con la pasarela Izipay.');
          notifyN8n('ERROR', err.message || 'Error de conexión', null);
        }
      } finally {
        if (isMounted) setLoadingToken(false);
      }
    };

    initIzipay();

    return () => {
      isMounted = false;
    };
  }, [isOpen, step, orderNumber, izipayMode, activeAmount]);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    setPaid(false);
    setErrorMessage(null);
    setStep('info');
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
          <div className="text-center py-6 space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Transacción Aprobada por Izipay
              </span>
              <h3 className="text-2xl font-black text-slate-900 pt-2">¡Pago Confirmado!</h3>
              <p className="text-xs text-slate-600">Tu pago ha sido procesado con éxito y tu vacante ha sido reservada.</p>
            </div>

            {/* DIRECT COMMERCIAL WHATSAPP REDIRECT ACTION BUTTON */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-center">
              <p className="text-xs font-bold text-emerald-900">
                👉 Haz clic abajo para confirmar tu matrícula inmediatamente con nuestra asesora comercial:
              </p>
              <a
                href={getCommercialWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2.5 cursor-pointer border border-emerald-400"
              >
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM_c9Q3XvG6b7rWAQZV7nxNNN8R0kXGoD6TjFThjsLvtKKC89Ej7KjTgW3&s=10" 
                  alt="WhatsApp Logo" 
                  className="w-5 h-5 rounded-full object-cover shrink-0 shadow-sm" 
                />
                <span>Confirmar por WhatsApp (+51 951 101 765)</span>
              </a>
            </div>

            {/* Receipt Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Número de Pedido:</span>
                <span className="font-bold text-slate-900">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Alumno Registrado:</span>
                <span className="font-bold text-slate-900 font-sans">{studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Correo Electrónico:</span>
                <span className="text-slate-800 font-sans">{studentEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Programa / Paquete:</span>
                <span className="text-slate-900 font-bold font-sans">{packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pasarela Procesadora:</span>
                <span className="text-[#00a499] font-bold font-sans">Izipay Online Perú</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Comercio Afiliado:</span>
                <span className="text-slate-800 font-bold font-sans">Instituto Técnico Avanza SAC</span>
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
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
              >
                <span>Finalizar</span>
              </button>
            </div>
          </div>
        ) : (
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

            {/* Quick Testing Bar: ONLY VISIBLE TO LOGGED IN ADMIN / ASESORA */}
            {isAdminLoggedIn && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Monto a Cobrar:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSelectAmount(1)}
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
                      onClick={() => handleSelectAmount(null)}
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
                      onClick={() => handleSelectMode('production')}
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
                      onClick={() => handleSelectMode('test')}
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
            )}

            {/* STEP 1: DATOS DEL ALUMNO */}
            {step === 'info' && (
              <form onSubmit={handleProceedToPayment} className="space-y-4 animate-fadeIn">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#00a499]" />
                      Paso 1: Datos del Alumno
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      Requerido por Izipay
                    </span>
                  </div>

                  {/* READ-ONLY: PAQUETE ADQUIRIDO */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase flex items-center justify-between">
                      <span>Paquete Adquirido</span>
                      <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Asignado por Izipay (No modificable)
                      </span>
                    </label>
                    <div className="p-3 bg-white border border-amber-200 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-900 text-sm block">{packageName}</span>
                        <span className="text-[10px] text-slate-500 block">Matrícula y Diploma de Especialización EDUMIN</span>
                      </div>
                      <span className="text-base font-black text-[#00a499] font-mono whitespace-nowrap bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        S/ {activeAmount}.00
                      </span>
                    </div>
                  </div>

                  {/* FIELD 1: NOMBRES Y APELLIDOS */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      Nombres y Apellidos *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez Ramos"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#00a499] focus:border-[#00a499] outline-none transition-all shadow-sm"
                    />
                  </div>

                  {/* FIELD 2: CORREO ELECTRÓNICO */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ej. alumno@gmail.com"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#00a499] focus:border-[#00a499] outline-none transition-all shadow-sm"
                    />
                  </div>

                  {/* FIELD 3: TELÉFONO / WHATSAPP */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 987654321"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#00a499] focus:border-[#00a499] outline-none transition-all shadow-sm"
                    />
                  </div>

                  {/* FORM VALIDATION WARNING */}
                  {formValidationError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{formValidationError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#00a499] hover:bg-[#00897b] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Continuar al Pago de S/ {activeAmount}.00</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: FORMULARIO DE PAGO IZIPAY */}
            {step === 'payment' && (
              <div className="space-y-4 animate-fadeIn">
                
                {/* Summary Bar of Student Info with edit button */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#00a499]" /> {studentName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {studentEmail} • {studentPhone}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('info')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-[11px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Modificar
                  </button>
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
                    <p className="text-[11px] text-slate-400">Registrando comprador: {studentName}</p>
                  </div>
                ) : (
                  /* REAL EMBEDDED IZIPAY SMART FORM CONTAINER */
                  <div className="space-y-4">
                    
                    {/* Official Izipay Krypton Embedded Smart Form */}
                    {formToken && (
                      <div className="p-3 border border-slate-200 bg-slate-50 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
                          <span className="flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-[#00a499]" />
                            Formulario de Cobro Bancario Directo (Tarjetas Visa/Mastercard/Amex/Diners)
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono">
                            formToken Activo
                          </span>
                        </div>

                        {/* OFFICIAL IZIPAY KR-EMBEDDED CONTAINER */}
                        <div 
                          key={`${orderNumber}-${activeAmount}-${studentEmail}`}
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
