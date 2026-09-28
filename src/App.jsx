import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeaderBanner from './components/HeaderBanner';
import PackageCard from './components/PackageCard';
import InstitutionalLogos from './components/InstitutionalLogos';
import AdminPanelModal from './components/AdminPanelModal';
import StudentRegisterModal from './components/StudentRegisterModal';
import StudentCheckoutModal from './components/StudentCheckoutModal';
import FloatingWhatsapp from './components/FloatingWhatsapp';

export default function App() {
  // Official Specialization Packages with Exact Cuotas Rules
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

  // App Modals & State
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isStudentRegisterOpen, setIsStudentRegisterOpen] = useState(false);
  const [isStudentCheckoutOpen, setIsStudentCheckoutOpen] = useState(false);
  
  const [selectedPackageForAdmin, setSelectedPackageForAdmin] = useState(null);
  const [studentSelectionData, setStudentSelectionData] = useState(null);
  const [activeStudentCheckoutData, setActiveStudentCheckoutData] = useState(null);

  // Installment plans saved in Administradora Memory DB
  const [installmentPlans, setInstallmentPlans] = useState([
    {
      id: 'PAY-891023',
      clientName: 'María Fernanda Ruiz',
      phone: '984512390',
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

  // URL Hash auto-detection for admin route and student checkout links
  useEffect(() => {
    const checkHashOrder = () => {
      const hash = window.location.hash;
      
      // Admin Direct Route: /#admin or /#asesora
      if (hash.includes('admin') || hash.includes('asesora')) {
        setSelectedPackageForAdmin(packages[0]);
        setIsAdminPanelOpen(true);
        return;
      }

      // Student Custom Checkout Route: /#checkout?id=...
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
  }, []);

  const handleOpenAdminPanel = (pkgData) => {
    setSelectedPackageForAdmin(pkgData || packages[0]);
    setIsAdminPanelOpen(true);
  };

  // Student selects Contado or Cuotas on a card
  const handleStudentSelectPay = (pkg, payType, cuotaOpt) => {
    setStudentSelectionData({ pkg, payType, cuotaOpt });
    setIsStudentRegisterOpen(true);
  };

  // Student registers data and proceeds to payment
  const handleStudentProceedToCheckout = (orderData) => {
    setIsStudentRegisterOpen(false);

    // Save installment plan to Admin DB if it was a cuota choice!
    if (orderData.payType === 'cuotas' && orderData.cuotaOpt) {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);

      const query = new URLSearchParams({
        id: orderData.id,
        cliente: orderData.clientName,
        tel: orderData.phone,
        email: orderData.email,
        monto: orderData.amount,
        pkg: orderData.packageName,
      }).toString();

      const newPlan = {
        id: orderData.id,
        clientName: orderData.clientName,
        phone: orderData.phone,
        email: orderData.email,
        packageName: orderData.basePackageTitle,
        payType: 'cuotas',
        currentCuotaNum: 1,
        totalCuotas: orderData.cuotaOpt.count,
        cuotaAmount: orderData.amount,
        totalAmount: orderData.cuotaOpt.total,
        status: 'Cuota 1 Registrada',
        createdDate: today.toLocaleDateString('es-PE'),
        nextDueDate: nextMonth.toLocaleDateString('es-PE'),
        currentLinkUrl: `${window.location.origin}/#checkout?${query}`,
      };

      setInstallmentPlans([newPlan, ...installmentPlans]);
    }

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
      
      {/* Top Navbar with official Logo */}
      <Navbar 
        onOpenAdminPanel={() => handleOpenAdminPanel(null)}
        onOpenStudentCheckout={() => handleStudentSelectPay(packages[0], 'contado', null)}
      />

      {/* Main Header Banner */}
      <HeaderBanner 
        onOpenAdminPanel={() => handleOpenAdminPanel(null)}
      />

      {/* Main Packages Grid */}
      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Elige tu Programa de Especialización Internacional
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Selecciona tu modalidad preferida de pago al contado o en cuotas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              packageData={pkg}
              onStudentSelectPay={handleStudentSelectPay}
              onOpenAdminPanel={handleOpenAdminPanel}
            />
          ))}
        </div>
      </main>

      {/* Bottom Institutional Certifications & Financing Banners */}
      <InstitutionalLogos 
        onOpenGenerator={() => handleOpenAdminPanel(null)}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsapp />

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

      {/* Student Payment Modal */}
      <StudentCheckoutModal
        isOpen={isStudentCheckoutOpen}
        onClose={() => setIsStudentCheckoutOpen(false)}
        linkData={activeStudentCheckoutData}
      />

    </div>
  );
}
