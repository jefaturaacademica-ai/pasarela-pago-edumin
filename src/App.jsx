import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeaderBanner from './components/HeaderBanner';
import PackageCard from './components/PackageCard';
import InstitutionalLogos from './components/InstitutionalLogos';
import CartDrawer from './components/CartDrawer';
import IzipayCheckoutModal from './components/IzipayCheckoutModal';
import AdminPanelModal from './components/AdminPanelModal';
import AsesoraLoginModal from './components/AsesoraLoginModal';
import StudentRegisterModal from './components/StudentRegisterModal';
import StudentCheckoutModal from './components/StudentCheckoutModal';
import FloatingWhatsapp from './components/FloatingWhatsapp';
import Footer from './components/Footer';

import { validatePaymentIntegrity } from './utils/securityUtils';

export default function App() {
  // Official Specialization Packages
  const packages = [
    {
      id: 'completo',
      category: 'diplomado',
      title: 'PROGRAMA COMPLETO',
      badgeBg: 'bg-[#00e676]',
      basePrice: 540,
      originalPrice: 1800,
      cuotaOptions: [
        { count: 2, amount: 300, total: 600 }
      ],
      items: [
        { text: '1 DIPLOMADO DE ALTA ESPECIALIZACIÓN + DIPLOMA', included: true },
        { text: 'CERTIFICACIONES DE PROGRAMAS DE ALTA ESPECIALIZACIÓN', included: true },
        { text: '3 CURSOS A ELECCIÓN ASINCRÓNICOS', included: true },
        { text: 'PROGRAMA DREAMBUILDER POR CERRO VERDE', included: false },
        { text: 'ACCESO A BOLSA DE TRABAJO REGULAR', included: true },
        { text: 'ACCESO A BOLSA DE TRABAJO EXCLUSIVA (MÁS DE 100 OFERTAS LABORALES AL MES)', included: false },
        { text: 'CERTIFICACIÓN CIP: OPCIÓN DE CERTIFICARTE UNA VEZ CON AVAL DEL COLEGIO DE INGENIEROS DEL PERÚ (VÁLIDO PARA 1 DIPLOMADO)', included: true },
        { text: 'CERTIFICACIÓN INTERNACIONAL: CERTIFICACIÓN INTERNACIONAL CON VALIDEZ GLOBAL EN UN DIPLOMADO DE TU ELECCIÓN (VÁLIDO PARA 1 DIPLOMADO)', included: false },
      ],
    },
    {
      id: 'full',
      category: 'diplomado',
      title: 'PROGRAMA FULL',
      badgeBg: 'bg-[#ff9800]',
      basePrice: 900,
      originalPrice: 3000,
      cuotaOptions: [
        { count: 3, amount: 350, total: 1050 }
      ],
      items: [
        { text: '1 DIPLOMADO DE ALTA ESPECIALIZACIÓN + DIPLOMA + 3 CERTIFICACIONES DE PROGRAMAS DE ALTA ESPECIALIZACIÓN', included: true },
        { text: '5 CURSOS A ELECCIÓN ASINCRÓNICOS', included: true },
        { text: 'PROGRAMA DREAMBUILDER POR CERRO VERDE', included: true },
        { text: 'ACCESO A BOLSA DE TRABAJO REGULAR', included: true },
        { text: 'ACCESO A BOLSA DE TRABAJO EXCLUSIVA (MÁS DE 100 OFERTAS LABORALES AL MES)', included: true },
        { text: 'CERTIFICACIÓN CIP: OPCIÓN DE CERTIFICARTE UNA VEZ CON AVAL DEL COLEGIO DE INGENIEROS DEL PERÚ (VÁLIDO PARA 1 DIPLOMADO)', included: true },
        { text: 'CERTIFICACIÓN INTERNACIONAL: CERTIFICACIÓN INTERNACIONAL CON VALIDEZ GLOBAL EN UN DIPLOMADO DE TU ELECCIÓN (VÁLIDO PARA 1 DIPLOMADO)', included: true },
      ],
    },
    {
      id: 'ilimitado',
      category: 'diplomado',
      title: 'PROGRAMA ILIMITADO',
      badgeBg: 'bg-[#ff1744]',
      basePrice: 1500,
      originalPrice: 5000,
      note: 'NOTA: ACCESO ILIMITADO POR 2 AÑOS.',
      cuotaOptions: [
        { count: 3, amount: 530, total: 1590 },
        { count: 4, amount: 400, total: 1600 }
      ],
      items: [
        { text: 'DIPLOMADOS ILIMITADOS + DIPLOMA', included: true },
        { text: 'CERTIFICADOS DE PROGRAMAS DE ALTA ESPECIALIZACIÓN EDUMIN SIN LÍMITE', included: true },
        { text: 'CURSOS A ELECCIÓN ASINCRÓNICOS ILIMITADOS', included: true },
        { text: 'PROGRAMA DREAMBUILDER POR CERRO VERDE', included: true },
        { text: 'ACCESO A BOLSA DE TRABAJO REGULAR', included: true },
        { text: 'ACCESO A BOLSA DE TRABAJO EXCLUSIVA (MÁS DE 100 OFERTAS LABORALES AL MES)', included: true },
        { text: 'CERTIFICACIÓN CIP: OPCIÓN DE CERTIFICARTE UNA VEZ CON AVAL DEL COLEGIO DE INGENIEROS DEL PERÚ (VÁLIDO PARA 1 DIPLOMADO)', included: true },
        { text: 'CERTIFICACIÓN INTERNACIONAL: CERTIFICACIÓN INTERNACIONAL CON VALIDEZ GLOBAL EN UN DIPLOMADO DE TU ELECCIÓN (VÁLIDO PARA 1 DIPLOMADO)', included: true },
      ],
    },
    {
      id: 'curso_ia',
      category: 'curso',
      title: 'CURSO IA DE 0 A 100',
      badgeBg: 'bg-[#7c4dff]',
      basePrice: 149,
      originalPrice: 500,
      note: 'CURSO ASINCRÓNICO DE INTELIGENCIA ARTIFICIAL APLICADA',
      cuotaOptions: [],
      items: [
        { text: 'ACCESO COMPLETO AL CURSO DE IA DE 0 A 100', included: true },
        { text: 'CERTIFICADO DE FINALIZACIÓN Y PARTICIPACIÓN EDUMIN', included: true },
        { text: 'PROMPTS, HERRAMIENTAS Y GUÍAS DESCARGABLES', included: true },
        { text: 'ACCESO A AULA VIRTUAL Q10', included: true },
        { text: 'ACCESO A BOLSA DE TRABAJO REGULAR', included: true },
        { text: 'ASISTENCIA Y SOPORTE PERMANENTE POR WHATSAPP', included: true },
      ],
    },
  ];

  // Shopping Cart State
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Category Filter State: 'diplomado' | 'curso'
  const [activeCategory, setActiveCategory] = useState('diplomado');

  // Official Izipay Pop-in Checkout State
  const [isIzipayCheckoutOpen, setIsIzipayCheckoutOpen] = useState(false);
  const [izipayCheckoutAmount, setIzipayCheckoutAmount] = useState(540);
  const [izipayCheckoutItems, setIzipayCheckoutItems] = useState([]);

  // Asesora Auth State (Safely parsed from localStorage)
  const [asesoraSession, setAsesoraSession] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem('edumin_asesora_session');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Error reading edumin_asesora_session from localStorage:', e);
        try { localStorage.removeItem('edumin_asesora_session'); } catch (_) {}
      }
    }
    return null;
  });

  // Modals & App State
  const [isAsesoraLoginOpen, setIsAsesoraLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash || '';
      return h.includes('admin') || h.includes('asesora');
    }
    return false;
  });
  const [isStudentRegisterOpen, setIsStudentRegisterOpen] = useState(false);
  const [isStudentCheckoutOpen, setIsStudentCheckoutOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash || '';
      return h.includes('checkout') && h.includes('?');
    }
    return false;
  });
  
  const [selectedPackageForAdmin, setSelectedPackageForAdmin] = useState(packages[0]);
  const [studentSelectionData, setStudentSelectionData] = useState(null);
  const [activeStudentCheckoutData, setActiveStudentCheckoutData] = useState(() => {
    if (typeof window !== 'undefined' && window.location && window.location.hash) {
      try {
        const h = window.location.hash || '';
        if (h.includes('checkout') && h.includes('?')) {
          const queryStr = h.split('?')[1];
          if (queryStr) {
            const params = new URLSearchParams(queryStr);
            if (params.get('cliente') || params.get('nom') || params.get('monto')) {
              return {
                id: params.get('id') || 'PAGO-CUSTOM',
                firstName: params.get('nom') || '',
                lastName: params.get('ape') || '',
                clientName: params.get('cliente') || '',
                dni: params.get('dni') || '',
                phone: params.get('tel') || '',
                email: params.get('email') || '',
                diplomado: params.get('dip') || params.get('diplomado') || '',
                amount: Number(params.get('monto')) || 540,
                packageName: params.get('pkg') || 'PROGRAMA COMPLETO',
                sig: params.get('sig') || '',
                exp: params.get('exp') || ''
              };
            }
          }
        }
      } catch (e) {
        console.warn('Error processing initial location hash:', e);
      }
    }
    return null;
  });

  // Installment plans saved in Memory DB
  const [installmentPlans, setInstallmentPlans] = useState([
    {
      id: 'PAY-891023',
      clientName: 'María Fernanda Ruiz',
      phone: '987423200',
      email: 'maria.ruiz@gmail.com',
      packageName: 'PROGRAMA COMPLETO',
      payType: 'cuotas',
      currentCuotaNum: 1,
      totalCuotas: 2,
      cuotaAmount: 300,
      totalAmount: 600,
      status: 'Cuota 1 Pagada',
      createdDate: '28/09/2026',
      nextDueDate: '28/10/2026',
      currentLinkUrl: `${window.location.origin}/#checkout?id=PAY-891023&cliente=María+Fernanda+Ruiz&monto=300&pkg=Cuota+1+de+2+-+PROGRAMA+COMPLETO`,
    }
  ]);

  // Successful Transactions DB (persisted in localStorage)
  const [successfulTransactions, setSuccessfulTransactions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edumin_successful_transactions');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing successful transactions:', e);
        }
      }
    }
    // Default sample transaction
    return [
      {
        orderNumber: 'IZI-849201',
        firstName: 'Roger',
        lastName: 'Sanalea Calcina',
        clientName: 'Roger Sanalea Calcina',
        dni: '74829102',
        email: 'roger.sanalea@gmail.com',
        phone: '987654321',
        diplomado: 'DIPLOMADO DE ALTA ESPECIALIZACIÓN EN MONITOREO Y EVALUACIÓN AMBIENTAL',
        packageName: 'PROGRAMA COMPLETO',
        amount: 540,
        status: 'Aprobado Izipay',
        dateFormatted: '05/10/2026 15:30:12'
      }
    ];
  });

  const handleRecordSuccessfulPayment = (txData) => {
    setSuccessfulTransactions((prev) => {
      const updated = [txData, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('edumin_successful_transactions', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Add Item to Shopping Cart
  const handleAddToCart = (item) => {
    const itemPrice = item.price || item.basePrice || 540;
    const newItem = {
      id: item.id || 'ITEM-' + Date.now(),
      title: item.title,
      price: itemPrice,
      quantity: 1,
    };
    setCartItems([...cartItems, newItem]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index) => {
    const updated = cartItems.filter((_, idx) => idx !== index);
    setCartItems(updated);
  };

  // Trigger Direct Official Izipay Pop-in Checkout
  const handleDirectIzipayCheckout = (item) => {
    const amount = item ? (item.basePrice || item.price || 540) : 540;
    const items = item ? [{ id: item.id, title: item.title, price: amount }] : cartItems;
    setIzipayCheckoutAmount(amount);
    setIzipayCheckoutItems(items);
    setIsIzipayCheckoutOpen(true);
  };

  // Trigger Izipay Checkout from Cart Drawer
  const handleProceedToIzipayFromCart = (total, items) => {
    setIzipayCheckoutAmount(total);
    setIzipayCheckoutItems(items);
    setIsIzipayCheckoutOpen(true);
  };

  // Hash Routing with Security & Parameter Tampering Validation
  useEffect(() => {
    const checkHashOrder = () => {
      const hash = window.location.hash || '';
      
      if (hash.includes('admin') || hash.includes('asesora')) {
        setSelectedPackageForAdmin(packages[0]);
        setIsAdminPanelOpen(true);
        setIsAsesoraLoginOpen(false);
        return;
      }

      if (hash.includes('checkout') && hash.includes('?')) {
        const queryStr = hash.split('?')[1];
        const params = new URLSearchParams(queryStr);
        if (params.get('cliente') || params.get('nom') || params.get('monto')) {
          const reqId = params.get('id') || 'PAGO-CUSTOM';
          const reqAmount = Number(params.get('monto')) || 540;
          const reqPkg = params.get('pkg') || 'PROGRAMA COMPLETO';
          const reqSig = params.get('sig') || '';
          const reqExp = params.get('exp') || '';

          // Validate link integrity against cryptographic signature, 24h expiration & official package prices
          const validation = validatePaymentIntegrity({
            orderId: reqId,
            amount: reqAmount,
            packageName: reqPkg,
            sig: reqSig,
            exp: reqExp
          });

          if (!validation.valid) {
            alert(`⛔ ALERTA DE SEGURIDAD / EXPIRACIÓN:\n\n${validation.error}`);
            window.location.hash = '';
            return;
          }

          const studentOrder = {
            id: reqId,
            firstName: params.get('nom') || '',
            lastName: params.get('ape') || '',
            clientName: params.get('cliente') || '',
            dni: params.get('dni') || '',
            phone: params.get('tel') || '',
            email: params.get('email') || '',
            diplomado: params.get('dip') || params.get('diplomado') || '',
            amount: reqAmount,
            packageName: reqPkg,
            sig: reqSig,
            exp: reqExp
          };
          setActiveStudentCheckoutData(studentOrder);
          setIsStudentCheckoutOpen(true);
        }
      }
    };

    checkHashOrder();
    window.addEventListener('hashchange', checkHashOrder);
    return () => window.removeEventListener('hashchange', checkHashOrder);
  }, []);

  const handleOpenAdminPanel = (pkgData) => {
    if (!asesoraSession) {
      setSelectedPackageForAdmin(pkgData || packages[0]);
      setIsAsesoraLoginOpen(true);
    } else {
      setSelectedPackageForAdmin(pkgData || packages[0]);
      setIsAdminPanelOpen(true);
    }
  };

  const handleAsesoraLoginSuccess = (sessionData) => {
    setAsesoraSession(sessionData);
    try {
      localStorage.setItem('edumin_asesora_session', JSON.stringify(sessionData));
    } catch (e) {
      console.warn('Error saving edumin_asesora_session to localStorage:', e);
    }
    setIsAsesoraLoginOpen(false);
    setIsAdminPanelOpen(true);
  };

  const handleAsesoraLogout = () => {
    setAsesoraSession(null);
    try {
      localStorage.removeItem('edumin_asesora_session');
    } catch (e) {
      console.warn('Error removing edumin_asesora_session from localStorage:', e);
    }
    setIsAdminPanelOpen(false);
    window.location.hash = '';
  };

  const handleStudentSelectPay = (pkg, payType, cuotaOpt) => {
    setStudentSelectionData({ pkg, payType, cuotaOpt });
    setIsStudentRegisterOpen(true);
  };

  const handleStudentProceedToCheckout = (orderData) => {
    setIsStudentRegisterOpen(false);
    setActiveStudentCheckoutData(orderData);
    setIsStudentCheckoutOpen(true);
  };

  const handleSaveInstallmentPlan = (newPlan) => {
    setInstallmentPlans([newPlan, ...installmentPlans]);
  };

  const handleUpdateInstallmentStatus = (updatedPlan) => {
    setInstallmentPlans(installmentPlans.map(p => p.clientName === updatedPlan.clientName ? updatedPlan : p));
  };

  const handlePreviewStudentCheckout = (planData) => {
    const studentOrder = {
      id: planData.id,
      clientName: planData.clientName,
      phone: planData.phone,
      email: planData.email,
      amount: planData.cuotaAmount,
      packageName: `${planData.packageName} (Cuota ${planData.currentCuotaNum} de ${planData.totalCuotas})`,
    };
    setActiveStudentCheckoutData(studentOrder);
    setIsStudentCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navbar */}
      <Navbar 
        onOpenAdminPanel={() => handleOpenAdminPanel(null)}
        onOpenStudentCheckout={() => handleDirectIzipayCheckout(null)}
        isAsesoraLoggedIn={!!asesoraSession}
        onAsesoraLogout={handleAsesoraLogout}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Header Banner */}
      <HeaderBanner 
        onOpenAdminPanel={() => handleOpenAdminPanel(null)}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* Main Specialization Packages & Courses Grid */}
      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Programas de Especialización Internacional
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Selecciona entre nuestros <strong>Diplomados de Especialización</strong> o <strong>Cursos Asincrónicos</strong> y realiza tu inscripción inmediata con <strong>Izipay Online</strong>.
            </p>
          </div>

          {/* Category Filter Selector Buttons (DIPLOMADOS vs CURSOS) */}
          <div id="catalog-section" className="flex flex-wrap justify-center items-center gap-3 pt-2 scroll-mt-28">
            <button
              type="button"
              onClick={() => setActiveCategory('diplomado')}
              className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center space-x-2 border ${
                activeCategory === 'diplomado'
                  ? 'bg-slate-900 text-amber-400 border-amber-400 shadow-xl scale-105 ring-2 ring-amber-400/30'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-base">🎓</span>
              <span>DIPLOMADOS DE ESPECIALIZACIÓN ({packages.filter(p => p.category === 'diplomado').length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('curso')}
              className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center space-x-2 border ${
                activeCategory === 'curso'
                  ? 'bg-slate-900 text-purple-400 border-purple-400 shadow-xl scale-105 ring-2 ring-purple-400/30'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-base">⚡</span>
              <span>CURSOS ASINCRÓNICOS ({packages.filter(p => p.category === 'curso').length})</span>
            </button>
          </div>

          {/* Filtered Packages Grid */}
          <div className={activeCategory === 'diplomado' ? "grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto" : "flex justify-center max-w-md mx-auto"}>
            {packages
              .filter((pkg) => pkg.category === activeCategory)
              .map((pkg) => (
                <div key={pkg.id} id={`package-${pkg.id}`} className="scroll-mt-28 flex flex-col w-full">
                  <PackageCard
                    packageData={pkg}
                    onAddToCart={handleAddToCart}
                    onDirectIzipayCheckout={handleDirectIzipayCheckout}
                    onOpenAdminPanel={handleOpenAdminPanel}
                  />
                </div>
              ))}
          </div>
        </div>

      </main>

      {/* Bottom Institutional Certifications */}
      <InstitutionalLogos 
        onOpenGenerator={() => handleOpenAdminPanel(null)}
      />

      {/* Footer with Legal Modals & Izipay Badges */}
      <Footer 
        onOpenRegister={() => handleOpenAdminPanel(null)}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsapp />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
        onProceedToIzipayCheckout={handleProceedToIzipayFromCart}
      />

      {/* Official Izipay Pop-in Checkout Modal (Exact Replica of Izipay Screenshot) */}
      <IzipayCheckoutModal
        isOpen={isIzipayCheckoutOpen}
        onClose={() => setIsIzipayCheckoutOpen(false)}
        amount={izipayCheckoutAmount}
        cartItems={izipayCheckoutItems}
        onPaymentSuccess={(txData) => {
          setCartItems([]);
          if (txData) handleRecordSuccessfulPayment(txData);
        }}
        isAdminLoggedIn={!!asesoraSession}
      />

      {/* Asesora Auth Login Modal */}
      <AsesoraLoginModal
        isOpen={isAsesoraLoginOpen}
        onClose={() => setIsAsesoraLoginOpen(false)}
        onLoginSuccess={handleAsesoraLoginSuccess}
      />

      {/* Student Data Registration Modal */}
      <StudentRegisterModal
        isOpen={isStudentRegisterOpen}
        onClose={() => setIsStudentRegisterOpen(false)}
        selectionData={studentSelectionData}
        onProceedToCheckout={handleStudentProceedToCheckout}
      />

      {/* Administradora & Asesora Management Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => {
          setIsAdminPanelOpen(false);
          if (window.location.hash.includes('admin') || window.location.hash.includes('asesora')) {
            window.location.hash = '';
          }
        }}
        initialPackage={selectedPackageForAdmin}
        installmentPlans={installmentPlans}
        successfulTransactions={successfulTransactions}
        onSaveInstallmentPlan={handleSaveInstallmentPlan}
        onUpdateInstallmentStatus={handleUpdateInstallmentStatus}
        onPreviewStudentCheckout={handlePreviewStudentCheckout}
      />

      {/* Custom Link Student Payment Modal */}
      <StudentCheckoutModal
        isOpen={isStudentCheckoutOpen}
        onClose={() => {
          setIsStudentCheckoutOpen(false);
          if (window.location.hash.includes('checkout')) {
            window.location.hash = '';
          }
        }}
        linkData={activeStudentCheckoutData}
        onPaymentSuccess={(txData) => {
          if (txData) handleRecordSuccessfulPayment(txData);
        }}
      />

    </div>
  );
}
