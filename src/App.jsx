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

export default function App() {
  // Official Specialization Packages
  const packages = [
    {
      id: 'completo',
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
  ];

  // Shopping Cart State
  const [cartItems, setCartItems] = useState([
    {
      id: 'completo',
      title: 'PROGRAMA COMPLETO',
      price: 540,
      quantity: 1,
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Official Izipay Pop-in Checkout State
  const [isIzipayCheckoutOpen, setIsIzipayCheckoutOpen] = useState(false);
  const [izipayCheckoutAmount, setIzipayCheckoutAmount] = useState(540);
  const [izipayCheckoutItems, setIzipayCheckoutItems] = useState([]);

  // Asesora Auth State
  const [asesoraSession, setAsesoraSession] = useState(() => {
    return localStorage.getItem('edumin_asesora_session') ? JSON.parse(localStorage.getItem('edumin_asesora_session')) : null;
  });

  // Modals & App State
  const [isAsesoraLoginOpen, setIsAsesoraLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isStudentRegisterOpen, setIsStudentRegisterOpen] = useState(false);
  const [isStudentCheckoutOpen, setIsStudentCheckoutOpen] = useState(false);
  
  const [selectedPackageForAdmin, setSelectedPackageForAdmin] = useState(null);
  const [studentSelectionData, setStudentSelectionData] = useState(null);
  const [activeStudentCheckoutData, setActiveStudentCheckoutData] = useState(null);

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

  // Hash Routing
  useEffect(() => {
    const checkHashOrder = () => {
      const hash = window.location.hash;
      
      if (hash.includes('admin') || hash.includes('asesora')) {
        if (!asesoraSession) {
          setIsAsesoraLoginOpen(true);
        } else {
          setSelectedPackageForAdmin(packages[0]);
          setIsAdminPanelOpen(true);
        }
        return;
      }

      if (hash.includes('checkout') && hash.includes('?')) {
        const queryStr = hash.split('?')[1];
        const params = new URLSearchParams(queryStr);
        if (params.get('cliente') && params.get('monto')) {
          const studentOrder = {
            id: params.get('id') || 'PAGO-CUSTOM',
            clientName: params.get('cliente'),
            phone: params.get('tel') || '',
            email: params.get('email') || '',
            amount: Number(params.get('monto')) || 540,
            packageName: params.get('pkg') || 'PROGRAMA COMPLETO',
          };
          setActiveStudentCheckoutData(studentOrder);
          setIsStudentCheckoutOpen(true);
        }
      }
    };

    checkHashOrder();
    window.addEventListener('hashchange', checkHashOrder);
    return () => window.removeEventListener('hashchange', checkHashOrder);
  }, [asesoraSession]);

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
    localStorage.setItem('edumin_asesora_session', JSON.stringify(sessionData));
    setIsAsesoraLoginOpen(false);
    setIsAdminPanelOpen(true);
  };

  const handleAsesoraLogout = () => {
    setAsesoraSession(null);
    localStorage.removeItem('edumin_asesora_session');
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
      />

      {/* Main 3 Specialization Packages Grid */}
      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Programas de Especialización Internacional
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Añade tu programa al carrito de compras o realiza el pago directo mediante la pasarela de pagos <strong>Izipay Online</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                packageData={pkg}
                onAddToCart={handleAddToCart}
                onDirectIzipayCheckout={handleDirectIzipayCheckout}
                onOpenAdminPanel={handleOpenAdminPanel}
              />
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
        onPaymentSuccess={() => setCartItems([])}
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
        onClose={() => setIsAdminPanelOpen(false)}
        initialPackage={selectedPackageForAdmin}
        installmentPlans={installmentPlans}
        onSaveInstallmentPlan={handleSaveInstallmentPlan}
        onUpdateInstallmentStatus={handleUpdateInstallmentStatus}
        onPreviewStudentCheckout={handlePreviewStudentCheckout}
      />

      {/* Custom Link Student Payment Modal */}
      <StudentCheckoutModal
        isOpen={isStudentCheckoutOpen}
        onClose={() => setIsStudentCheckoutOpen(false)}
        linkData={activeStudentCheckoutData}
      />

    </div>
  );
}
