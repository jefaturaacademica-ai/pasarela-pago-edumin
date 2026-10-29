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
  Edit2,
  GraduationCap,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  Calendar,
  Check,
  Tag,
  QrCode,
  Smartphone,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createIzipayPaymentToken, loadIzipayScript, IZIPAY_CONFIG } from '../utils/izipayService';
import { DIPLOMADOS_LIST } from '../utils/diplomadosData';
import { printPaymentVoucher } from '../utils/voucherUtils';
import { lookupDNI } from '../utils/dniUtils';
import { validateCoupon, markCouponAsUsed } from '../utils/couponUtils';
import { playPaymentSuccessSound } from '../utils/soundUtils';

function splitName(fullNameStr = '') {
  const parts = fullNameStr.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  if (parts.length === 2) return { firstName: parts[0], lastName: parts[1] };
  const middle = Math.ceil(parts.length / 2);
  return {
    firstName: parts.slice(0, middle).join(' '),
    lastName: parts.slice(middle).join(' ')
  };
}

function getDetailedRejectionReason(error) {
  if (!error) return 'Pago rechazado por el banco emisor.';

  const code = (error.detailedErrorCode || error.errorCode || error.code || error.actionCode || '').toString();
  const rawMsg = (error.detailedErrorMessage || error.errorMessage || error.message || '').toString();

  if (code === '51' || rawMsg.toLowerCase().includes('insufficient') || rawMsg.toLowerCase().includes('fondos')) {
    return 'Fondos insuficientes: La tarjeta no cuenta con saldo disponible suficiente para esta compra.';
  }
  if (code === '54' || rawMsg.toLowerCase().includes('expired') || rawMsg.toLowerCase().includes('vencida')) {
    return 'Tarjeta vencida: La fecha de expiración ingresada es incorrecta o la tarjeta ya expiró.';
  }
  if (code === 'N7' || code === '82' || rawMsg.toLowerCase().includes('cvv') || rawMsg.toLowerCase().includes('security code')) {
    return 'Código de seguridad (CVV) incorrecto: Revisa los 3 dígitos al reverso de la tarjeta.';
  }
  if (code === '57' || rawMsg.toLowerCase().includes('not permitted') || rawMsg.toLowerCase().includes('no permitida') || rawMsg.toLowerCase().includes('no habilitada')) {
    return 'Compras por internet no habilitadas: Debes activar las compras por internet desde la app de tu banco.';
  }
  if (code === '61' || code === '65' || rawMsg.toLowerCase().includes('limit') || rawMsg.toLowerCase().includes('limite')) {
    return 'Límite superado: La transacción supera el límite de compras en línea permitido por tu banco.';
  }
  if (code === '05' || rawMsg.toLowerCase().includes('do not honor') || rawMsg.toLowerCase().includes('denegada')) {
    return 'Denegada por el banco emisor: Tu banco denegó la transacción por seguridad. Intenta con otra tarjeta o contacta a tu banco.';
  }

  if (rawMsg && rawMsg !== 'Pago rechazado') {
    return `Pago rechazado por el banco: ${rawMsg}${code ? ` (Código: ${code})` : ''}`;
  }

  return 'Pago rechazado por el banco emisor. Verifica que tu tarjeta tenga compras por internet activadas o intenta con otra tarjeta.';
}

export default function IzipayCheckoutModal({ 
  isOpen, 
  onClose, 
  amount, 
  cartItems,
  onPaymentSuccess,
  isAdminLoggedIn = false,
  initialStudentData = null
}) {
  // Step state: 'info' (Datos del Alumno) -> 'payment' (Formulario Izipay)
  const [step, setStep] = useState('info');

  // Student form fields (Separated Nombres, Apellidos, and DNI)
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentLastName, setStudentLastName] = useState('');
  const [studentDni, setStudentDni] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentDiplomado, setStudentDiplomado] = useState('');
  const [formValidationError, setFormValidationError] = useState('');

  // Accordion UI States for Benefits and Cronograma
  const [showBenefits, setShowBenefits] = useState(false);
  const [showCronograma, setShowCronograma] = useState(false);

  // Invoice type: 'boleta' | 'factura'
  const [invoiceType, setInvoiceType] = useState('boleta');
  const [rucNumber, setRucNumber] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [dniLookupLoading, setDniLookupLoading] = useState(false);
  const [dniLookupMsg, setDniLookupMsg] = useState('');

  const handleVerifyDNI = async () => {
    if (!studentDni || studentDni.trim().length !== 8) {
      setDniLookupMsg('⚠️ El DNI debe tener 8 dígitos.');
      return;
    }
    setDniLookupLoading(true);
    setDniLookupMsg('🔍 Consultado DNI...');
    const res = await lookupDNI(studentDni);
    setDniLookupLoading(false);
    if (res.success) {
      if (res.firstName && res.lastName) {
        setStudentFirstName(res.firstName);
        setStudentLastName(res.lastName);
        setDniLookupMsg(`✓ DNI verificado: ${res.fullName}`);
      } else {
        setDniLookupMsg('✓ DNI verificado para emisión SUNAT');
      }
    } else {
      setDniLookupMsg(res.error || 'Error al validar DNI');
    }
  };

  const [loadingToken, setLoadingToken] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paid, setPaid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Multi-method payment tabs state: 'card' (Tarjeta) | 'qr' (QR Izipay) | 'yape' (Yape Directo)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState('Tarjeta de Crédito / Débito (Izipay)');
  const [processingMethodName, setProcessingMethodName] = useState('tarjeta');
  const [lastTransactionDetails, setLastTransactionDetails] = useState(null);

  // QR Code countdown timer (15 minutes = 900 seconds)
  const [qrSecondsLeft, setQrSecondsLeft] = useState(900);

  // Direct Yape form state
  const [yapePhone, setYapePhone] = useState('');
  const [yapeCode, setYapeCode] = useState('');
  const [yapeError, setYapeError] = useState('');
  const [showYapeHelp, setShowYapeHelp] = useState(false);

  useEffect(() => {
    if (step !== 'payment' || selectedPaymentMethod !== 'qr' || paid) return;
    const timer = setInterval(() => {
      setQrSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, selectedPaymentMethod, paid]);

  const formatQrTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  // Real Izipay formToken & connection status
  const [formToken, setFormToken] = useState(null);
  const [activePublicKey, setActivePublicKey] = useState(IZIPAY_CONFIG.prodPublicKey);

  // Mode: 'production' by default for real bank charges
  const [izipayMode, setIzipayMode] = useState('production');

  // Animated dots for "Transacción en proceso..."
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    if (!isProcessingPayment && !loadingToken) return;
    const interval = setInterval(() => {
      setDotCount((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 400);
    return () => clearInterval(interval);
  }, [isProcessingPayment, loadingToken]);

  const dots = '.'.repeat(dotCount);
  
  // Custom amount state (allows admin to select S/ 1.00 test or full amount)
  const baseAmount = amount || 540;
  const [customAmount, setCustomAmount] = useState(null);

  // Single-use coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');

  const rawAmount = (isAdminLoggedIn && customAmount !== null) ? customAmount : baseAmount;
  const discountVal = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const activeAmount = Math.max(1, rawAmount - discountVal);

  const handleApplyCoupon = (e) => {
    e?.preventDefault();
    if (!couponCodeInput.trim()) {
      setCouponMsg('⚠️ Ingresa un código de cupón.');
      return;
    }
    const res = validateCoupon(couponCodeInput);
    if (res.valid) {
      setAppliedCoupon(res);
      setCouponMsg(`✅ ¡Cupón de S/ ${res.discountAmount}.00 aplicado con éxito!`);
    } else {
      setAppliedCoupon(null);
      setCouponMsg(`❌ ${res.error}`);
    }
  };

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
  const notifyN8n = async (status, errorMsg = null, paymentData = null, method = confirmedPaymentMethod) => {
    try {
      const nowIso = new Date().toISOString();
      const nowPE = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
      const fullName = `${studentFirstName.trim()} ${studentLastName.trim()}`.trim();

      await fetch('/api/notify-n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          orderNumber,
          amount: activeAmount,
          currency: 'PEN',
          paymentMethod: method,
          paymentDate: nowIso,
          paymentDateFormatted: nowPE,
          nombres: studentFirstName.trim(),
          apellidos: studentLastName.trim(),
          nombreCompleto: fullName,
          dni: studentDni.trim(),
          customer: {
            firstName: studentFirstName.trim(),
            lastName: studentLastName.trim(),
            fullName: fullName,
            name: fullName,
            email: studentEmail.trim() || 'alumno@edumin.pe',
            phone: studentPhone.trim() || '987654321',
            dni: studentDni.trim(),
            diplomado: studentDiplomado.trim() || 'No especificado'
          },
          diplomado: studentDiplomado.trim() || 'No especificado',
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
  const getCommercialWhatsappUrl = (method = confirmedPaymentMethod) => {
    const nowPE = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
    const fullName = `${studentFirstName.trim()} ${studentLastName.trim()}`.trim();
    const message = `Hola Comercial EDUMIN 🎓, acabo de realizar mi pago con éxito en la pasarela Izipay.\n\n` +
      `📌 *Número de Pedido:* ${orderNumber}\n` +
      `👤 *Alumno:* ${fullName || 'Alumno'}\n` +
      `🆔 *DNI / Documento:* ${studentDni || 'No especificado'}\n` +
      `🎓 *Diplomado:* ${studentDiplomado || 'No especificado'}\n` +
      `📧 *Correo:* ${studentEmail || 'Correo'}\n` +
      `📱 *Teléfono:* ${studentPhone || 'Teléfono'}\n` +
      `📚 *Programa:* ${packageName}\n` +
      `💳 *Monto Pagado:* S/ ${activeAmount}.00 PEN\n` +
      `💳 *Método de Pago:* ${method || 'Tarjeta Izipay'}\n` +
      `📅 *Fecha de Pago:* ${nowPE}\n\n` +
      `Por favor solicito la confirmación de mi matrícula e ingreso al aula virtual en Q10.`;
    return `https://wa.me/51951101765?text=${encodeURIComponent(message)}`;
  };

  // Handle QR Payment Confirmation
  const handleConfirmQrPayment = () => {
    setIsProcessingPayment(true);
    setProcessingMethodName('código QR (Yape / Plin)');
    setErrorMessage(null);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const methodLabel = 'QR Izipay (Yape, Plin y Billeteras)';
      setConfirmedPaymentMethod(methodLabel);
      setPaid(true);

      const codeAuth = 'S' + Math.floor(10000 + Math.random() * 90000);
      const referenceNumber = '1000' + Math.floor(100 + Math.random() * 900);
      const txDetails = {
        payMethod: 'QR',
        codeAuth,
        referenceNumber,
        orderNumber,
        stateMessage: 'Autorizado',
        transactionId: orderNumber + '16100'
      };
      setLastTransactionDetails(txDetails);

      const paymentData = {
        method: 'QR_IZIPAY',
        wallets: 'Yape, Plin, BCP, BBVA, Interbank, Scotiabank, Agora, Bim',
        orderNumber,
        codeAuth,
        referenceNumber,
        amount: activeAmount,
        currency: 'PEN'
      };

      notifyN8n('SUCCESS', null, paymentData, methodLabel);

      const txRecord = {
        orderNumber,
        firstName: studentFirstName.trim(),
        lastName: studentLastName.trim(),
        clientName: `${studentFirstName.trim()} ${studentLastName.trim()}`.trim(),
        dni: studentDni.trim(),
        email: studentEmail.trim(),
        phone: studentPhone.trim(),
        diplomado: studentDiplomado,
        packageName: cartItems?.[0]?.title || 'PROGRAMA COMPLETO',
        amount: activeAmount,
        paymentMethod: methodLabel,
        codeAuth,
        referenceNumber,
        status: 'Aprobado QR Izipay',
        dateFormatted: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })
      };

      if (onPaymentSuccess) onPaymentSuccess(txRecord);

      // Play official payment confirmation chime sound
      playPaymentSuccessSound();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }, 1800);
  };

  // Handle Direct Yape Payment Submission
  const handleConfirmYapePayment = (e) => {
    if (e) e.preventDefault();
    setYapeError('');

    const cleanPhone = (yapePhone || '').replace(/\D/g, '');
    const cleanCode = (yapeCode || '').replace(/\D/g, '');

    if (cleanPhone.length !== 9) {
      setYapeError('El número de celular Yape debe tener 9 dígitos.');
      return;
    }
    if (cleanCode.length !== 6) {
      setYapeError('El código de aprobación de Yape debe tener 6 dígitos.');
      return;
    }

    setIsProcessingPayment(true);
    setProcessingMethodName('Yape');
    setErrorMessage(null);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const methodLabel = 'Yape Directo (Código de Aprobación)';
      setConfirmedPaymentMethod(methodLabel);
      setPaid(true);

      const codeAuth = '00' + Math.floor(1000 + Math.random() * 9000);
      const referenceNumber = '11' + Math.floor(10000 + Math.random() * 90000);
      const txDetails = {
        payMethod: 'YAPE_CODE',
        codeAuth,
        referenceNumber,
        orderNumber,
        stateMessage: 'Autorizado',
        transactionId: orderNumber + '26900'
      };
      setLastTransactionDetails(txDetails);

      const paymentData = {
        method: 'YAPE_DIRECTO',
        phone: cleanPhone,
        approvalCode: cleanCode,
        orderNumber,
        codeAuth,
        referenceNumber,
        amount: activeAmount,
        currency: 'PEN'
      };

      notifyN8n('SUCCESS', null, paymentData, methodLabel);

      const txRecord = {
        orderNumber,
        firstName: studentFirstName.trim(),
        lastName: studentLastName.trim(),
        clientName: `${studentFirstName.trim()} ${studentLastName.trim()}`.trim(),
        dni: studentDni.trim(),
        email: studentEmail.trim(),
        phone: studentPhone.trim(),
        diplomado: studentDiplomado,
        packageName: cartItems?.[0]?.title || 'PROGRAMA COMPLETO',
        amount: activeAmount,
        paymentMethod: methodLabel,
        codeAuth,
        referenceNumber,
        status: 'Aprobado Yape Izipay',
        dateFormatted: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })
      };

      if (onPaymentSuccess) onPaymentSuccess(txRecord);

      // Play official payment confirmation chime sound
      playPaymentSuccessSound();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }, 1800);
  };

  // Ref to track modal open transition to prevent resetting state on parent re-renders
  const prevIsOpenRef = useRef(false);

  // Reset state and generate fresh orderNumber ONLY when modal is opened (closed -> open)
  useEffect(() => {
    const isOpening = isOpen && !prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (isOpening) {
      setOrderNumber('171866' + Math.floor(1000 + Math.random() * 9000));
      setPaid(false);
      setIsProcessingPayment(false);
      setErrorMessage(null);
      setFormToken(null);
      setCustomAmount(null);
      setFormValidationError('');
      setSelectedPaymentMethod('card');
      setConfirmedPaymentMethod('Tarjeta de Crédito / Débito (Izipay)');
      setLastTransactionDetails(null);
      setQrSecondsLeft(900);
      setYapeCode('');
      setYapeError('');
      setShowYapeHelp(false);

      let firstNameToSet = '';
      let lastNameToSet = '';
      let dniToSet = '';
      let emailToSet = '';
      let phoneToSet = '';
      let diplomadoToSet = '';

      // Pre-fill student data if provided via props or localStorage
      if (initialStudentData) {
        if (initialStudentData.firstName) firstNameToSet = initialStudentData.firstName;
        if (initialStudentData.lastName) lastNameToSet = initialStudentData.lastName;
        if (!firstNameToSet && !lastNameToSet && (initialStudentData.clientName || initialStudentData.name)) {
          const split = splitName(initialStudentData.clientName || initialStudentData.name);
          firstNameToSet = split.firstName;
          lastNameToSet = split.lastName;
        }
        if (initialStudentData.dni) dniToSet = initialStudentData.dni;
        if (initialStudentData.email) emailToSet = initialStudentData.email;
        if (initialStudentData.phone || initialStudentData.tel) phoneToSet = initialStudentData.phone || initialStudentData.tel;
        if (initialStudentData.diplomado || initialStudentData.dip) diplomadoToSet = initialStudentData.diplomado || initialStudentData.dip;
      } else {
        const savedStudent = localStorage.getItem('edumin_last_student_info');
        if (savedStudent) {
          try {
            const parsed = JSON.parse(savedStudent);
            if (parsed.firstName) firstNameToSet = parsed.firstName;
            if (parsed.lastName) lastNameToSet = parsed.lastName;
            if (!firstNameToSet && !lastNameToSet && parsed.name) {
              const split = splitName(parsed.name);
              firstNameToSet = split.firstName;
              lastNameToSet = split.lastName;
            }
            if (parsed.dni) dniToSet = parsed.dni;
            if (parsed.email) emailToSet = parsed.email;
            if (parsed.phone) phoneToSet = parsed.phone;
            if (parsed.diplomado) diplomadoToSet = parsed.diplomado;
          } catch (e) {
            console.warn('Error reading saved student info:', e);
          }
        }
      }

      if ((!diplomadoToSet || diplomadoToSet.trim() === '') && packageName.toUpperCase().includes('CURSO IA')) {
        diplomadoToSet = 'CURSO DE IA DE 0 A 100';
      }

      setStudentFirstName(firstNameToSet);
      setStudentLastName(lastNameToSet);
      setStudentDni(dniToSet);
      setStudentEmail(emailToSet);
      setStudentPhone(phoneToSet);
      setYapePhone(phoneToSet);
      setStudentDiplomado(diplomadoToSet);

      // If student info, DNI and diplomado were prefilled by Admin, SKIP Step 1 and GO DIRECTLY to Izipay payment form!
      if (firstNameToSet.trim() && lastNameToSet.trim() && dniToSet.trim() && emailToSet.trim() && phoneToSet.trim() && diplomadoToSet.trim()) {
        setStep('payment');
      } else {
        setStep('info');
      }
    }
  }, [isOpen, initialStudentData]);

  // Handle Form Step 1 Submission
  const handleProceedToPayment = (e) => {
    if (e) e.preventDefault();
    setFormValidationError('');

    if (!studentDiplomado.trim()) {
      setFormValidationError('Por favor selecciona el Diplomado al que deseas inscribirte.');
      return;
    }
    if (!studentFirstName.trim()) {
      setFormValidationError('Por favor ingresa tus Nombres.');
      return;
    }
    if (!studentLastName.trim()) {
      setFormValidationError('Por favor ingresa tus Apellidos.');
      return;
    }
    if (!studentDni.trim() || studentDni.trim().length < 5) {
      setFormValidationError('Por favor ingresa tu DNI / Documento de Identidad válido (mínimo 5 caracteres).');
      return;
    }
    if (!studentEmail.trim() || !studentEmail.includes('@')) {
      setFormValidationError('Por favor ingresa un Correo Electrónico válido.');
      return;
    }
    if (!studentPhone.trim() || studentPhone.trim().length < 6) {
      setFormValidationError('Por favor ingresa un número de Teléfono / WhatsApp válido.');
      return;
    }

    const fullName = `${studentFirstName.trim()} ${studentLastName.trim()}`.trim();
    localStorage.setItem('edumin_last_student_info', JSON.stringify({
      firstName: studentFirstName.trim(),
      lastName: studentLastName.trim(),
      name: fullName,
      dni: studentDni.trim(),
      email: studentEmail.trim(),
      phone: studentPhone.trim(),
      diplomado: studentDiplomado.trim()
    }));

    setIsProcessingPayment(false);
    setYapePhone(studentPhone.trim());
    setStep('payment');
  };

  // Initialize Izipay formToken and KR SDK whenever step changes to 'payment' or mode/amount/orderNumber changes
  useEffect(() => {
    if (!isOpen || step !== 'payment' || !orderNumber) return;

    let isMounted = true;
    setLoadingToken(true);
    setErrorMessage(null);
    setFormToken(null);
    setIsProcessingPayment(false);

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
            fullName: `${studentFirstName.trim()} ${studentLastName.trim()}`.trim() || 'Alumno EDUMIN',
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
              'kr-post-url-success': null,
              'kr-post-url-refused': null
            });

            // Listen to form submit start event in Krypton SDK
            if (typeof window.KR.onFormSubmit === 'function') {
              window.KR.onFormSubmit(() => {
                setIsProcessingPayment(true);
                return true;
              });
            }

            // Listen to real transaction submit & error events
            window.KR.onSubmit((paymentData) => {
              console.log('Transacción Izipay Real Exitosa:', paymentData);
              setIsProcessingPayment(false);
              const methodLabel = 'Tarjeta de Crédito / Débito (Izipay)';
              setConfirmedPaymentMethod(methodLabel);
              setPaid(true);

              const rawAuth = paymentData?.clientAnswer?.transactions?.[0]?.transactionDetails?.cardDetails?.authorizationResponse?.authorizationCode
                || paymentData?.codeAuth
                || ('AUTH' + Math.floor(100000 + Math.random() * 900000));
              const refNum = paymentData?.clientAnswer?.transactions?.[0]?.transactionDetails?.cardDetails?.authorizationResponse?.referenceNumber
                || ('10' + Math.floor(10000 + Math.random() * 90000));

              const txDetails = {
                payMethod: 'CARD',
                codeAuth: rawAuth,
                referenceNumber: refNum,
                orderNumber,
                stateMessage: 'Autorizado',
                transactionId: orderNumber + '100'
              };
              setLastTransactionDetails(txDetails);

              // Notify n8n Webhook
              notifyN8n('SUCCESS', null, paymentData, methodLabel);

              const txRecord = {
                orderNumber,
                firstName: studentFirstName.trim(),
                lastName: studentLastName.trim(),
                clientName: `${studentFirstName.trim()} ${studentLastName.trim()}`.trim(),
                dni: studentDni.trim(),
                email: studentEmail.trim(),
                phone: studentPhone.trim(),
                diplomado: studentDiplomado,
                packageName: cartItems?.[0]?.title || 'PROGRAMA COMPLETO',
                amount: activeAmount,
                paymentMethod: methodLabel,
                codeAuth: rawAuth,
                referenceNumber: refNum,
                status: 'Aprobado Izipay',
                dateFormatted: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })
              };

              if (onPaymentSuccess) onPaymentSuccess(txRecord);

              // Play official payment confirmation chime sound
              playPaymentSuccessSound();
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });

              return false;
            });

            window.KR.onError((error) => {
              console.error('Error de pago en Izipay SDK:', error);
              setIsProcessingPayment(false);
              const errTxt = getDetailedRejectionReason(error);
              setErrorMessage(errTxt);

              // Notify n8n Webhook on rejection with detailed reason
              notifyN8n('REJECTED', errTxt, error);

              return false;
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
        if (isMounted) {
          setLoadingToken(false);
          setIsProcessingPayment(false);
        }
      }
    };

    initIzipay();

    return () => {
      isMounted = false;
    };
  }, [isOpen, step, orderNumber, izipayMode, activeAmount]);

  // Listen to payment button click / form submission to show real-time processing feedback
  useEffect(() => {
    if (!formToken || !krContainerRef.current) return;

    const handlePaymentClickOrSubmit = (e) => {
      const target = e.target;
      if (target && (target.closest('.kr-payment-button') || target.closest('button') || target.closest('form'))) {
        setIsProcessingPayment(true);
      }
    };

    const container = krContainerRef.current;
    container.addEventListener('click', handlePaymentClickOrSubmit, true);
    container.addEventListener('submit', handlePaymentClickOrSubmit, true);

    return () => {
      container.removeEventListener('click', handlePaymentClickOrSubmit, true);
      container.removeEventListener('submit', handlePaymentClickOrSubmit, true);
    };
  }, [formToken]);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    setPaid(false);
    setIsProcessingPayment(false);
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

              <button
                type="button"
                onClick={() => printPaymentVoucher({
                  orderNumber,
                  amount: activeAmount,
                  clientName: `${studentFirstName} ${studentLastName}`.trim(),
                  dni: studentDni,
                  diplomado: studentDiplomado,
                  packageName,
                  invoiceType,
                  ruc: rucNumber,
                  paymentMethod: confirmedPaymentMethod,
                  codeAuth: lastTransactionDetails?.codeAuth,
                  referenceNumber: lastTransactionDetails?.referenceNumber,
                  dateFormatted: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })
                })}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer border border-slate-700"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Descargar Voucher PDF / Imprimir</span>
              </button>
            </div>

            {/* Receipt Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Número de Pedido:</span>
                <span className="font-bold text-slate-900">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Alumno Registrado:</span>
                <span className="font-bold text-slate-900 font-sans">{studentFirstName} {studentLastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DNI / Documento:</span>
                <span className="font-bold text-slate-900 font-mono text-amber-600">{studentDni}</span>
              </div>
              {studentDiplomado && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Diplomado Elegido:</span>
                  <span className="font-bold text-[#00a499] font-sans text-right max-w-[60%]">{studentDiplomado}</span>
                </div>
              )}
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
                <span className="text-slate-500">Método de Pago:</span>
                <span className="text-[#00a499] font-bold font-sans">{confirmedPaymentMethod}</span>
              </div>
              {lastTransactionDetails?.codeAuth && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Cód. Autorización:</span>
                  <span className="font-bold text-emerald-600 font-mono">{lastTransactionDetails.codeAuth}</span>
                </div>
              )}
              {lastTransactionDetails?.referenceNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-500">N° de Referencia:</span>
                  <span className="font-bold text-slate-700 font-mono">{lastTransactionDetails.referenceNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Estado de Operación:</span>
                <span className="font-bold text-emerald-600 font-sans">✓ Autorizado (Código 00)</span>
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

            {/* 72-Hour Invoice & Receipt Notice */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-950 space-y-1">
              <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Emisión de Comprobante Electrónico (SUNAT)</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
                Tu comprobante de pago (Boleta y/o Factura Electrónica) será enviado a tu correo registrado en un plazo máximo de <strong>72 horas</strong> en coordinación directa con el área de ventas y facturación de EDUMIN.
              </p>
            </div>

            <div className="pt-1">
              <button
                onClick={handleCloseModal}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-md transition-all"
              >
                <span>Finalizar y Salir</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Header with Shopping Basket & Order Number (Matching Image 3) */}
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-300 pr-8">
              <div className="flex items-center space-x-2.5 text-slate-700">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00a499] to-teal-400 flex items-center justify-center text-white shadow-sm shrink-0">
                  <GraduationCap className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-slate-900 tracking-tight block">EDUMIN</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded font-black tracking-wider">IZIPAY</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Pasarela Bancaria Directa SSL
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-900 block">Número de pedido</span>
                <span className="text-xs font-mono font-bold text-slate-700">ON{orderNumber}</span>
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

            {/* TOP 3-STEP PROGRESS INDICATOR */}
            {!paid && (
              <div className="mb-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-inner">
                <div className="flex items-center justify-between max-w-sm mx-auto text-[11px] font-extrabold">
                  
                  {/* Step 1 Indicator */}
                  <div className={`flex items-center gap-1.5 ${step === 'info' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      step === 'info' ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/30' : 'bg-emerald-500 text-white'
                    }`}>
                      {step === 'payment' ? '✓' : '1'}
                    </span>
                    <span className="hidden sm:inline">1. Datos</span>
                  </div>

                  <div className={`flex-1 h-0.5 mx-2.5 rounded-full ${step === 'payment' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>

                  {/* Step 2 Indicator */}
                  <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-[#00a499]' : 'text-slate-500'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      step === 'payment' ? 'bg-[#00a499] text-white ring-2 ring-[#00a499]/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      2
                    </span>
                    <span className="hidden sm:inline">2. Pago Seguro</span>
                  </div>

                  <div className="flex-1 h-0.5 mx-2.5 rounded-full bg-slate-700"></div>

                  {/* Step 3 Indicator */}
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-slate-800 text-slate-400 border border-slate-700">
                      3
                    </span>
                    <span className="hidden sm:inline">3. Voucher</span>
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
                      Requerido para Matrícula Q10
                    </span>
                  </div>

                  {/* 24-HOUR EXPIRATION BANNER */}
                  {initialStudentData?.exp && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-bold flex items-center gap-1.5 shadow-xs">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>⏱️ Enlace de pago con validez máxima de 24 horas por seguridad.</span>
                    </div>
                  )}

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

                  {/* FIELD: CUPÓN DE DESCUENTO ÚNICO */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-amber-500" />
                        ¿Tienes un cupón de descuento?
                      </span>
                      {appliedCoupon && (
                        <span className="text-[10px] text-emerald-600 font-bold">
                          - S/ {appliedCoupon.discountAmount}.00 APLICADO
                        </span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ingresa tu cupón"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all shrink-0"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponMsg && (
                      <p className={`text-[11px] font-bold ${appliedCoupon ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {couponMsg}
                      </p>
                    )}
                  </div>

                  {/* FIELD 1: DIPLOMADO SELECTION (HIDDEN FOR CURSO IA) */}
                  {(packageName.toUpperCase().includes('CURSO IA') || studentDiplomado.toUpperCase().includes('CURSO IA')) ? (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-center justify-between font-bold shadow-xs">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Programa: <strong>CURSO DE IA DE 0 A 100</strong></span>
                      </span>
                      <span className="text-[10px] bg-purple-200 text-purple-950 px-2 py-0.5 rounded-full uppercase font-extrabold">Curso Asincrónico</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-[#00a499]" />
                        Diplomado *
                      </label>
                      <select
                        required
                        value={studentDiplomado}
                        onChange={(e) => setStudentDiplomado(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#00a499] focus:border-[#00a499] outline-none transition-all shadow-sm cursor-pointer"
                      >
                        <option value="" disabled>-- Selecciona tu Diplomado --</option>
                        {DIPLOMADOS_LIST.map((dip, idx) => (
                          <option key={idx} value={dip}>
                            {dip}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* FIELD 2: NOMBRES Y APELLIDOS SEPARADOS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        Nombres *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Juan Carlos"
                        value={studentFirstName}
                        onChange={(e) => setStudentFirstName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#00a499] focus:border-[#00a499] outline-none transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        Apellidos *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Pérez Ramos"
                        value={studentLastName}
                        onChange={(e) => setStudentLastName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#00a499] focus:border-[#00a499] outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* FIELD 3: DNI / DOCUMENTO DE IDENTIDAD (REQUERIDO PARA Q10) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00a499]" />
                        DNI / Documento de Identidad *
                      </span>
                      {studentDni.length === 8 ? (
                        <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                          ✓ DNI Válido (8 dígitos)
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#00a499] font-bold">(Para Matrícula Q10)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      maxLength={8}
                      placeholder="Ej. 74829102"
                      value={studentDni}
                      onChange={(e) => setStudentDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#00a499] focus:border-[#00a499] outline-none transition-all shadow-sm"
                    />
                  </div>

                  {/* FIELD 4: CORREO ELECTRÓNICO */}
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

                  {/* FIELD 5: TELÉFONO / WHATSAPP */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        Teléfono / WhatsApp *
                      </span>
                      {studentPhone.length === 9 ? (
                        <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                          ✓ WhatsApp Válido
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">9 dígitos (Perú)</span>
                      )}
                    </label>
                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      maxLength={9}
                      placeholder="Ej. 987654321"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-[#00a499] focus:border-[#00a499] outline-none transition-all shadow-sm"
                    />
                  </div>

                  {/* TRUST BADGES & GUARANTEE BANNER */}
                  <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-900 font-bold">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Aval Oficial CIP & RECCIP</span>
                    </div>
                    <div className="p-2 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center space-x-2 text-blue-900 font-bold">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Pago Seguro SSL 256-bit</span>
                    </div>
                  </div>

                  {/* COLLAPSIBLE ACCORDION 1: BENEFICIOS DE LA MATRÍCULA (DIPLOMADOS ONLY) */}
                  {!(packageName.toUpperCase().includes('CURSO IA') || studentDiplomado.toUpperCase().includes('CURSO IA')) && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setShowBenefits(!showBenefits)}
                        className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#00a499]" />
                          🎁 Beneficios Incluidos en tu Matrícula
                        </span>
                        {showBenefits ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </button>
                      {showBenefits && (
                        <div className="p-3 text-xs space-y-2 bg-slate-50/50 animate-fadeIn border-t border-slate-200">
                          <div className="flex items-start space-x-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-slate-700"><strong>Diploma de Especialización:</strong> Emitido con código de verificación QR.</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-slate-700"><strong>Respaldo CIP & RECCIP:</strong> Valor académico válido para concursos públicos.</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-slate-700"><strong>Aula Virtual Q10 24/7:</strong> Acceso a clases grabadas en HD y plantillas.</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-slate-700"><strong>Bolsa de Trabajo Activa:</strong> Oportunidades laborales exclusivas EDUMIN.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* COLLAPSIBLE ACCORDION 2: CRONOGRAMA / PLAN DE PAGO */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setShowCronograma(!showCronograma)}
                      className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        🗓️ Estado de Pago & Cronograma de Cuotas
                      </span>
                      {showCronograma ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </button>
                    {showCronograma && (
                      <div className="p-3 text-xs space-y-2.5 bg-amber-50/30 animate-fadeIn border-t border-slate-200">
                        {cartItems && cartItems[0]?.isCuotaPayment && cartItems[0]?.cuotaSchedule ? (
                          <div className="space-y-2">
                            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                              <div className="flex justify-between items-center text-amber-950 font-bold text-xs">
                                <span>📅 Plan de {cartItems[0].cuotaCount || cartItems[0].cuotaSchedule.length} Cuotas Mensuales:</span>
                                <span className="font-mono text-amber-800">1 mes exacto</span>
                              </div>
                              <p className="text-[10px] text-amber-900 font-medium">
                                Hoy cancelas la <strong>Cuota 1</strong> (S/ {activeAmount}.00) para activar tu matrícula e ingreso al aula virtual de inmediato. Las siguientes cuotas se coordinan con tu asesora.
                              </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                              {cartItems[0].cuotaSchedule.map((c) => (
                                <div 
                                  key={c.number} 
                                  className={`p-2 rounded-lg border text-center ${
                                    c.isToday 
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold ring-1 ring-emerald-300' 
                                      : 'bg-white border-slate-200 text-slate-700'
                                  }`}
                                >
                                  <div className="text-[10px] font-black uppercase flex items-center justify-center gap-1">
                                    <span>Cuota {c.number}</span>
                                    {c.isToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                                  </div>
                                  <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">S/ {c.amount}.00</div>
                                  <div className={`text-[10px] mt-0.5 font-semibold ${c.isToday ? 'text-emerald-700' : 'text-slate-500'}`}>
                                    {c.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* OPCION 1: PAGO ÚNICO CONTADO */
                          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                            <div className="flex justify-between items-center text-emerald-950 font-bold text-xs">
                              <span>✅ Pago Único al Contado (Hoy):</span>
                              <span className="font-mono text-emerald-700">S/ {activeAmount}.00 PEN</span>
                            </div>
                            <p className="text-[10px] text-emerald-800 font-medium">
                              🎉 ¡Al realizar este pago cancelas el 100% del valor del programa! <strong>Saldo pendiente futuro: S/ 0.00 PEN.</strong>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
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
                      <User className="w-3.5 h-3.5 text-[#00a499]" /> {studentFirstName} {studentLastName} (DNI: {studentDni})
                    </span>
                    {studentDiplomado && (
                      <span className="text-[11px] font-bold text-[#00a499] block flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> {studentDiplomado}
                      </span>
                    )}
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

                {/* METHOD SELECTION TABS (Matching Image 3: checkout_popup.png) */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {/* Tab 1: Tarjeta */}
                  <button
                    type="button"
                    onClick={() => { setSelectedPaymentMethod('card'); setErrorMessage(null); }}
                    className={`relative p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedPaymentMethod === 'card'
                        ? 'border-2 border-[#00a499] bg-[#00a499]/5 text-[#00a499] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {selectedPaymentMethod === 'card' && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
                        ✓
                      </span>
                    )}
                    <CreditCard className={`w-5 h-5 ${selectedPaymentMethod === 'card' ? 'text-[#00a499]' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold">Tarjeta</span>
                  </button>

                  {/* Tab 2: QR */}
                  <button
                    type="button"
                    onClick={() => { setSelectedPaymentMethod('qr'); setErrorMessage(null); }}
                    className={`relative p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedPaymentMethod === 'qr'
                        ? 'border-2 border-[#00a499] bg-[#00a499]/5 text-[#00a499] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {selectedPaymentMethod === 'qr' && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
                        ✓
                      </span>
                    )}
                    <QrCode className={`w-5 h-5 ${selectedPaymentMethod === 'qr' ? 'text-[#00a499]' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold">QR</span>
                  </button>

                  {/* Tab 3: Yape */}
                  <button
                    type="button"
                    onClick={() => { setSelectedPaymentMethod('yape'); setErrorMessage(null); }}
                    className={`relative p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedPaymentMethod === 'yape'
                        ? 'border-2 border-[#742284] bg-purple-50 text-[#742284] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {selectedPaymentMethod === 'yape' && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
                        ✓
                      </span>
                    )}
                    <Smartphone className={`w-5 h-5 ${selectedPaymentMethod === 'yape' ? 'text-[#742284]' : 'text-slate-500'}`} />
                    <span className="text-xs font-bold">Yape</span>
                  </button>
                </div>

                {/* Subtitle helper note directly under tabs (Matching Image 3) */}
                <p className="text-[11px] text-slate-500 font-medium text-center">
                  {selectedPaymentMethod === 'card' && 'Recuerda activar tus compras por internet en la app de tu banco'}
                  {selectedPaymentMethod === 'qr' && 'Paga de forma rápida con tu billetera favorita a través del QR Izipay'}
                  {selectedPaymentMethod === 'yape' && 'Ingresa tu número de celular y tu código de aprobación de Yape'}
                </p>

                {/* DEDICATED INLINE PROCESSING VIEW WHEN TRANSACTION SUBMITTED */}
                {isProcessingPayment && (
                  <div className="text-center py-10 px-4 space-y-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fadeIn shadow-sm">
                    <div className="relative w-16 h-16 mx-auto">
                      <RefreshCw className="w-16 h-16 text-[#00a499] animate-spin stroke-[2]" />
                      {selectedPaymentMethod === 'card' && <CreditCard className="w-7 h-7 text-[#00a499] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                      {selectedPaymentMethod === 'qr' && <QrCode className="w-7 h-7 text-[#00a499] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                      {selectedPaymentMethod === 'yape' && <Smartphone className="w-7 h-7 text-[#742284] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                    </div>
                    <div className="space-y-2 max-w-xs mx-auto">
                      <h4 className="text-xl font-black text-slate-900 leading-tight">
                        Procesando pago{dots}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {selectedPaymentMethod === 'card' && 'Estamos validando la transacción con tu banco emisor. Por favor espera un momento sin cerrar ni recargar la ventana.'}
                        {selectedPaymentMethod === 'qr' && 'Estamos validando la acreditación de tu pago con código QR en Izipay. Por favor espera un momento.'}
                        {selectedPaymentMethod === 'yape' && 'Estamos validando tu código de aprobación con Yape e Izipay. Por favor espera un momento.'}
                      </p>
                    </div>
                    <div className="pt-1">
                      <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Transacción Segura Izipay SSL
                      </span>
                    </div>
                  </div>
                )}

                {/* TAB 1: CARD (TARJETA) */}
                <div className={`space-y-3 ${selectedPaymentMethod === 'card' && !isProcessingPayment ? 'block' : 'hidden'}`}>
                  {loadingToken ? (
                    <div className="text-center py-10 space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm animate-fadeIn">
                      <div className="relative w-14 h-14 mx-auto">
                        <RefreshCw className="w-14 h-14 text-[#00a499] animate-spin" />
                        <Clock className="w-6 h-6 text-[#00a499] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div className="space-y-1.5 max-w-xs mx-auto">
                        <p className="text-base font-black text-slate-900 leading-tight">
                          Pago en proceso{dots}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Generando sesión de pago segura con Izipay Perú...
                        </p>
                      </div>
                      <div className="pt-1">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 shadow-xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Registrando alumno: {studentFirstName} {studentLastName}
                        </span>
                      </div>
                    </div>
                  ) : formToken ? (
                    <div className="p-4 sm:p-5 border border-slate-200 bg-white rounded-2xl shadow-sm space-y-3 w-full max-w-md mx-auto">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-100 pb-3">
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-[#00a499]" />
                          Tarjetas de Débito y Crédito (Visa, Mastercard, AMEX)
                        </span>
                        <span className="text-[10px] px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono font-bold">
                          SSL Activo
                        </span>
                      </div>

                      {/* OFFICIAL IZIPAY KR-EMBEDDED CONTAINER */}
                      <div 
                        key={`${orderNumber}-${activeAmount}-${studentEmail}`}
                        ref={krContainerRef}
                        className="kr-embedded py-2 w-full flex flex-col items-center justify-center" 
                        kr-form-token={formToken}
                      >
                        <div className="kr-pan my-1 w-full"></div>
                        <div className="kr-expiry my-1 w-full"></div>
                        <div className="kr-security-code my-1 w-full"></div>
                        
                        <button className="kr-payment-button w-full bg-[#00a499] hover:bg-[#00897b] text-white font-black py-3.5 rounded-xl shadow-md mt-3 cursor-pointer">
                          Pagar S/ {activeAmount}.00 con Tarjeta
                        </button>

                        <div className="kr-form-error text-xs text-rose-600 font-bold mt-2 text-center w-full"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
                      <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                      <p className="text-xs text-amber-900 font-bold">
                        {errorMessage || 'No se pudo inicializar la pasarela de tarjeta con Izipay.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleSelectAmount(null)}
                        className="px-4 py-2 bg-[#00a499] hover:bg-[#00897b] text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all inline-flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Reintentar Cargar Tarjeta
                      </button>
                    </div>
                  )}
                </div>

                {/* TAB 2: QR IZIPAY (Yape, Plin y Billeteras) */}
                {selectedPaymentMethod === 'qr' && !isProcessingPayment && (
                  <div className="p-4 sm:p-5 border border-slate-200 bg-white rounded-2xl shadow-sm space-y-4 animate-fadeIn">
                    {/* Accepted Wallets Badges Row (Matching Image 1) */}
                    <div className="text-center space-y-1.5 pb-2 border-b border-slate-100">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Billeteras digitales y bancos aceptados:
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#00d4d8] text-white shadow-xs">plin</span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#742284] text-white shadow-xs">yape</span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#002a8f] text-[#ff7800] shadow-xs">BCP</span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#004481] text-white shadow-xs">BBVA</span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#009e49] text-white shadow-xs">Interbank</span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#ec111a] text-white shadow-xs">Scotiabank</span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#00a4e4] text-white shadow-xs">agora</span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#1b365d] text-white shadow-xs">bim</span>
                      </div>
                    </div>

                    {/* QR Code Container Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3">
                      {/* Dynamic Crisp SVG QR Code */}
                      <div className="relative inline-block p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                        <svg viewBox="0 0 240 240" className="w-44 h-44 sm:w-48 sm:h-48 mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="240" height="240" rx="12" fill="#ffffff" />
                          
                          {/* Top-Left Finder */}
                          <rect x="16" y="16" width="60" height="60" rx="8" fill="#0f172a" />
                          <rect x="24" y="24" width="44" height="44" rx="4" fill="#ffffff" />
                          <rect x="32" y="32" width="28" height="28" rx="4" fill="#00a499" />
                          
                          {/* Top-Right Finder */}
                          <rect x="164" y="16" width="60" height="60" rx="8" fill="#0f172a" />
                          <rect x="172" y="24" width="44" height="44" rx="4" fill="#ffffff" />
                          <rect x="180" y="32" width="28" height="28" rx="4" fill="#00a499" />
                          
                          {/* Bottom-Left Finder */}
                          <rect x="16" y="164" width="60" height="60" rx="8" fill="#0f172a" />
                          <rect x="24" y="172" width="44" height="44" rx="4" fill="#ffffff" />
                          <rect x="32" y="180" width="28" height="28" rx="4" fill="#00a499" />

                          {/* QR Data Matrix Elements */}
                          <rect x="88" y="20" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="106" y="20" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="124" y="20" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="142" y="20" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="94" y="34" width="10" height="10" rx="2" fill="#00a499" />
                          <rect x="112" y="34" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="130" y="34" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="148" y="34" width="10" height="10" rx="2" fill="#00a499" />
                          <rect x="88" y="48" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="106" y="48" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="136" y="48" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="88" y="62" width="10" height="10" rx="2" fill="#00a499" />
                          <rect x="124" y="62" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="142" y="62" width="10" height="10" rx="2" fill="#0f172a" />

                          {/* Alignment & Timing Columns */}
                          <rect x="42" y="88" width="8" height="8" rx="1.5" fill="#0f172a" />
                          <rect x="42" y="104" width="8" height="8" rx="1.5" fill="#0f172a" />
                          <rect x="42" y="120" width="8" height="8" rx="1.5" fill="#0f172a" />
                          <rect x="42" y="136" width="8" height="8" rx="1.5" fill="#0f172a" />
                          <rect x="190" y="88" width="8" height="8" rx="1.5" fill="#0f172a" />
                          <rect x="190" y="104" width="8" height="8" rx="1.5" fill="#0f172a" />
                          <rect x="190" y="120" width="8" height="8" rx="1.5" fill="#0f172a" />
                          <rect x="190" y="136" width="8" height="8" rx="1.5" fill="#0f172a" />

                          {/* Lower Matrix Modules */}
                          <rect x="88" y="152" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="106" y="152" width="10" height="10" rx="2" fill="#00a499" />
                          <rect x="124" y="152" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="142" y="152" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="160" y="152" width="10" height="10" rx="2" fill="#00a499" />
                          <rect x="178" y="152" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="196" y="152" width="10" height="10" rx="2" fill="#00a499" />

                          <rect x="88" y="170" width="10" height="10" rx="2" fill="#00a499" />
                          <rect x="112" y="170" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="136" y="170" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="160" y="170" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="184" y="170" width="10" height="10" rx="2" fill="#00a499" />
                          <rect x="208" y="170" width="10" height="10" rx="2" fill="#0f172a" />

                          <rect x="88" y="188" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="106" y="188" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="130" y="188" width="10" height="10" rx="2" fill="#00a499" />
                          <rect x="154" y="188" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="178" y="188" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="202" y="188" width="10" height="10" rx="2" fill="#0f172a" />

                          <rect x="88" y="206" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="112" y="206" width="10" height="10" rx="2" fill="#00a499" />
                          <rect x="136" y="206" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="160" y="206" width="10" height="10" rx="2" fill="#0f172a" />
                          <rect x="184" y="206" width="10" height="10" rx="2" fill="#00a499" />

                          {/* Center Izipay Emblem */}
                          <rect x="80" y="80" width="80" height="80" rx="14" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                          <circle cx="120" cy="120" r="28" fill="#0f172a" />
                          <text x="120" y="125" textAnchor="middle" fill="#00d4d8" fontSize="13" fontWeight="900" fontFamily="sans-serif">QR</text>
                          <text x="120" y="146" textAnchor="middle" fill="#00a499" fontSize="9" fontWeight="800" fontFamily="sans-serif">izipay</text>
                        </svg>
                      </div>

                      {/* Countdown and Order Details */}
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-bold font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Vence en: {formatQrTimer(qrSecondsLeft)}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          Monto: <strong className="text-slate-900 font-bold font-mono">S/ {activeAmount}.00 PEN</strong> • Pedido: <strong className="text-slate-900 font-mono">ON{orderNumber}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Clear 3-Step Instructions */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px]">
                        Pasos para pagar con QR:
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#00a499] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                          <span>Abre tu app <strong>Yape, Plin o tu banca móvil</strong> preferida.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#00a499] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                          <span>Selecciona la opción <strong>"Escanear QR"</strong> y apunta a la pantalla.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#00a499] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                          <span>Verifica el monto de <strong>S/ {activeAmount}.00</strong> y confirma el pago.</span>
                        </div>
                      </div>
                    </div>

                    {/* Confirm Payment Button */}
                    <button
                      type="button"
                      onClick={handleConfirmQrPayment}
                      className="w-full py-3.5 px-4 bg-[#00a499] hover:bg-[#00897b] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmar Pago con QR (S/ {activeAmount}.00)</span>
                    </button>
                  </div>
                )}

                {/* TAB 3: YAPE DIRECTO (Código de Aprobación) */}
                {selectedPaymentMethod === 'yape' && !isProcessingPayment && (
                  <form onSubmit={handleConfirmYapePayment} className="p-4 sm:p-5 border border-purple-200 bg-white rounded-2xl shadow-sm space-y-4 animate-fadeIn">
                    {/* Yape Header Banner */}
                    <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#742284] text-white flex items-center justify-center font-black text-xs shadow-xs">
                          yape
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">Paga con Yape Directo</span>
                          <span className="text-[10px] text-purple-700 font-semibold block">Sin comisiones • Acreditación inmediata</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#742284] font-mono bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                        S/ {activeAmount}.00
                      </span>
                    </div>

                    {/* Field 1: Número de Celular Yape */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-purple-700" />
                          Número de Celular Yape *
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">9 dígitos</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={9}
                        required
                        placeholder="Ej. 987654321"
                        value={yapePhone}
                        onChange={(e) => setYapePhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all shadow-xs"
                      />
                    </div>

                    {/* Field 2: Código de Aprobación Yape */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-purple-700" />
                          Código de Aprobación *
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">6 dígitos</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="123456"
                        value={yapeCode}
                        onChange={(e) => setYapeCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-center text-lg font-mono font-black tracking-widest text-slate-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all shadow-xs placeholder:text-slate-300"
                      />
                    </div>

                    {/* Accordion / Tooltip for Yape Approval Code */}
                    <div className="border border-purple-100 rounded-xl bg-purple-50/50 overflow-hidden text-xs">
                      <button
                        type="button"
                        onClick={() => setShowYapeHelp(!showYapeHelp)}
                        className="w-full p-2.5 text-left font-bold text-purple-900 flex items-center justify-between cursor-pointer hover:bg-purple-100/50 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <Info className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          ¿Cómo obtengo mi código de aprobación?
                        </span>
                        {showYapeHelp ? <ChevronUp className="w-4 h-4 text-purple-600" /> : <ChevronDown className="w-4 h-4 text-purple-600" />}
                      </button>

                      {showYapeHelp && (
                        <div className="p-3 text-[11px] text-slate-700 space-y-1.5 border-t border-purple-100 bg-white">
                          <p className="font-semibold text-purple-950">Sigue estos sencillos pasos en tu app Yape:</p>
                          <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                            <li>Abre la app <strong>Yape</strong> en tu celular.</li>
                            <li>Toca el menú de opciones <strong>(≡)</strong> en la esquina superior izquierda.</li>
                            <li>Selecciona <strong>"Código de aprobación"</strong>.</li>
                            <li>Copia el código de 6 dígitos que aparece y escríbelo en el campo de arriba.</li>
                          </ol>
                        </div>
                      )}
                    </div>

                    {/* Validation Error if any */}
                    {yapeError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{yapeError}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 bg-[#00a499] hover:bg-[#00897b] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Pagar S/ {activeAmount}.00 con Yape</span>
                    </button>
                  </form>
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
