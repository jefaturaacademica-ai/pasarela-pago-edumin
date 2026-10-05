import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  Link as LinkIcon, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Send, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  Package, 
  Sparkles, 
  ExternalLink,
  PlusCircle,
  History,
  AlertCircle,
  FileCheck,
  Edit3,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generatePaymentSignature } from '../utils/securityUtils';
import { DIPLOMADOS_LIST } from '../utils/diplomadosData';

export default function AdminPanelModal({ 
  isOpen, 
  onClose, 
  initialPackage,
  installmentPlans = [],
  onSaveInstallmentPlan,
  onUpdateInstallmentStatus,
  onPreviewStudentCheckout
}) {
  const [activeTab, setActiveTab] = useState('custom_link'); // 'custom_link' | 'new' | 'installments' | 'history'
  
  // Package Link Form State
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    diplomado: '',
    packageName: 'PROGRAMA COMPLETO',
    payType: 'cuotas', // 'contado' | 'cuotas'
    totalCuotas: 2,
    cuotaAmount: 300,
    fullPrice: 540,
  });

  // Free Amount / Custom Link State (ej. 100 o 120 con concepto escrito a mano)
  const [customLinkData, setCustomLinkData] = useState({
    clientName: '',
    phone: '',
    email: '',
    diplomado: '',
    customAmount: 120,
    customConcept: 'Reserva de Vacante / Certificación Extra',
  });

  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentCreatedPlan, setCurrentCreatedPlan] = useState(null);

  // Exact Cuotas breakdown requested by user:
  // COMPLETO: 540 O 2 X 300 = 600
  // FULL: 900 O 3 X 350 = 1050
  // ILIMITADO: 1500 O 3 X 530 = 1590 O 4 X 400 = 1600
  const cuotaPresets = {
    'PROGRAMA COMPLETO': { full: 540, cuota: 300, defaultCuotas: 2, options: [{ count: 2, amount: 300 }] },
    'PROGRAMA FULL': { full: 900, cuota: 350, defaultCuotas: 3, options: [{ count: 3, amount: 350 }] },
    'PROGRAMA ILIMITADO': { full: 1500, cuota: 530, defaultCuotas: 3, options: [{ count: 3, amount: 530 }, { count: 4, amount: 400 }] },
  };

  useEffect(() => {
    if (initialPackage && initialPackage.title) {
      const preset = cuotaPresets[initialPackage.title] || { full: initialPackage.basePrice || 540, cuota: 300, defaultCuotas: 2 };
      setFormData({
        clientName: '',
        phone: '',
        email: '',
        packageName: initialPackage.title,
        payType: 'cuotas',
        totalCuotas: preset.defaultCuotas,
        cuotaAmount: preset.cuota,
        fullPrice: preset.full,
      });
      setGeneratedLink('');
      setCurrentCreatedPlan(null);
    }
  }, [initialPackage]);

  if (!isOpen) return null;

  const handlePackageChange = (title) => {
    const preset = cuotaPresets[title] || { full: 540, cuota: 300, defaultCuotas: 2 };
    setFormData({
      ...formData,
      packageName: title,
      fullPrice: preset.full,
      cuotaAmount: preset.cuota,
      totalCuotas: preset.defaultCuotas,
    });
  };

  const handleGeneratePackageLink = (e) => {
    e.preventDefault();
    const linkId = 'PAY-' + Math.floor(100000 + Math.random() * 900000);
    const origin = window.location.origin;

    const currentPayAmount = formData.payType === 'cuotas' ? formData.cuotaAmount : formData.fullPrice;
    const isCuota = formData.payType === 'cuotas';
    const cuotaLabel = isCuota ? `Cuota 1 de ${formData.totalCuotas} - ${formData.packageName}` : `${formData.packageName} (Contado)`;

    const sig = generatePaymentSignature(linkId, currentPayAmount, cuotaLabel);

    const query = new URLSearchParams({
      id: linkId,
      cliente: formData.clientName,
      tel: formData.phone,
      email: formData.email,
      dip: formData.diplomado,
      monto: currentPayAmount,
      pkg: cuotaLabel,
      sig: sig
    }).toString();

    const fullUrl = `${origin}/#checkout?${query}`;
    setGeneratedLink(fullUrl);

    // Save Installment Plan to Admin DB
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    const planRecord = {
      id: linkId,
      clientName: formData.clientName,
      phone: formData.phone,
      email: formData.email,
      diplomado: formData.diplomado,
      packageName: formData.packageName,
      payType: formData.payType,
      currentCuotaNum: 1,
      totalCuotas: isCuota ? formData.totalCuotas : 1,
      cuotaAmount: currentPayAmount,
      totalAmount: isCuota ? currentPayAmount * formData.totalCuotas : formData.fullPrice,
      status: isCuota ? 'Cuota 1 Pendiente' : 'Contado Generado',
      createdDate: today.toLocaleDateString('es-PE'),
      nextDueDate: isCuota ? nextMonth.toLocaleDateString('es-PE') : 'Finalizado',
      currentLinkUrl: fullUrl,
      sig: sig
    };

    setCurrentCreatedPlan(planRecord);
    onSaveInstallmentPlan(planRecord);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Generate Custom Free-Amount Link (ej. 100 o 120 con concepto libre)
  const handleGenerateCustomLink = (e) => {
    e.preventDefault();
    const linkId = 'PAY-CUSTOM-' + Math.floor(100000 + Math.random() * 900000);
    const origin = window.location.origin;

    const sig = generatePaymentSignature(linkId, customLinkData.customAmount, customLinkData.customConcept);

    const query = new URLSearchParams({
      id: linkId,
      cliente: customLinkData.clientName,
      tel: customLinkData.phone,
      email: customLinkData.email,
      dip: customLinkData.diplomado,
      monto: customLinkData.customAmount,
      pkg: customLinkData.customConcept,
      sig: sig
    }).toString();

    const fullUrl = `${origin}/#checkout?${query}`;
    setGeneratedLink(fullUrl);

    const planRecord = {
      id: linkId,
      clientName: customLinkData.clientName,
      phone: customLinkData.phone,
      email: customLinkData.email,
      diplomado: customLinkData.diplomado,
      packageName: customLinkData.customConcept,
      payType: 'custom',
      currentCuotaNum: 1,
      totalCuotas: 1,
      cuotaAmount: customLinkData.customAmount,
      totalAmount: customLinkData.customAmount,
      status: 'Monto Libre Generado',
      createdDate: new Date().toLocaleDateString('es-PE'),
      nextDueDate: 'Pago Único',
      currentLinkUrl: fullUrl,
      sig: sig
    };

    setCurrentCreatedPlan(planRecord);
    onSaveInstallmentPlan(planRecord);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = (plan) => {
    const target = plan || currentCreatedPlan;
    if (!target) return;
    
    const cleanPhone = target.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 9 ? `51${cleanPhone}` : cleanPhone;
    
    let message = `Hola *${target.clientName}*, te saluda tu asesora de *EDUMIN* 🎓.\n\nAquí tienes tu enlace de pago para *${target.packageName}* por un monto de *S/ ${target.cuotaAmount}.00*:\n\n👉 ${target.currentLinkUrl}\n\nQuedo atenta para enviarte tu comprobante.`;

    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleGenerateNextCuotaLink = (plan) => {
    const nextCuotaNum = plan.currentCuotaNum + 1;
    const linkId = 'PAY-' + Math.floor(100000 + Math.random() * 900000);
    const origin = window.location.origin;
    const cuotaLabel = `Cuota ${nextCuotaNum} de ${plan.totalCuotas} - ${plan.packageName}`;

    const sig = generatePaymentSignature(linkId, plan.cuotaAmount, cuotaLabel);

    const query = new URLSearchParams({
      id: linkId,
      cliente: plan.clientName,
      tel: plan.phone,
      email: plan.email,
      monto: plan.cuotaAmount,
      pkg: cuotaLabel,
      sig: sig
    }).toString();

    const fullUrl = `${origin}/#checkout?${query}`;
    
    const updatedPlan = {
      ...plan,
      id: linkId,
      currentCuotaNum: nextCuotaNum,
      status: `Cuota ${nextCuotaNum} Generada`,
      currentLinkUrl: fullUrl,
    };

    onUpdateInstallmentStatus(updatedPlan);
    alert(`¡Link para la Cuota ${nextCuotaNum} de ${plan.clientName} generado exitosamente!\n\nMonto: S/ ${plan.cuotaAmount}.00\nLink copiado al portapapeles.`);
    navigator.clipboard.writeText(fullUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      
      {/* Container */}
      <div className="relative w-full max-w-2xl bg-[#0f172a] rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 text-white overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
            <UserCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider text-white">Panel Administradora / Asesora</h3>
            <p className="text-xs text-slate-400">Edición completa de cuotas, montos libres y programación a 30 días</p>
          </div>
        </div>

        {/* Security Shield Banner */}
        <div className="p-3 bg-blue-950/80 border border-blue-800/80 rounded-2xl flex items-start space-x-2.5 text-xs text-blue-200 mb-5 shadow-inner">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-extrabold text-white block">🔐 Generador de Links Únicos Seguros (Firma SHA-256 Anti-Alteración)</strong>
            <p className="text-[11px] text-slate-300">
              Todos los enlaces generados incluyen un sello criptográfico único (`&sig=...`). Si un alumno intenta modificar el monto en la URL (ej. cambiar 540 por 10), el sistema **bloqueará de inmediato** la pasarela.
            </p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'new'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>🔐 Link Único por Programa</span>
          </button>

          <button
            onClick={() => setActiveTab('custom_link')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'custom_link'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>⚡ Link Único Monto Libre</span>
          </button>

          <button
            onClick={() => setActiveTab('installments')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'installments'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>📅 Alumnos en Cuotas ({installmentPlans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>📜 Historial</span>
          </button>
        </div>

        {/* TAB 1: PACKAGE LINK FORM */}
        {activeTab === 'new' && (
          <form onSubmit={handleGeneratePackageLink} className="space-y-4 text-xs">
            
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                1. Selecciona el Programa:
              </label>
              <select
                value={formData.packageName}
                onChange={(e) => handlePackageChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="PROGRAMA COMPLETO">PROGRAMA COMPLETO (Contado S/ 540 | 2 x S/ 300)</option>
                <option value="PROGRAMA FULL">PROGRAMA FULL (Contado S/ 900 | 3 x S/ 350)</option>
                <option value="PROGRAMA ILIMITADO">PROGRAMA ILIMITADO (Contado S/ 1500 | 3 x S/ 530 o 4 x S/ 400)</option>
              </select>
            </div>

            {/* Toggle Contado vs Cuotas */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <label className="font-bold text-amber-300 uppercase tracking-wider text-[11px] block">
                2. Modalidad de Cobro:
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, payType: 'contado' })}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    formData.payType === 'contado'
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <span>PAGO AL CONTADO</span>
                  <span className="font-mono font-extrabold text-sm">S/ {formData.fullPrice}.00</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, payType: 'cuotas' })}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                    formData.payType === 'cuotas'
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <span>PAGO EN CUOTAS (Asesora)</span>
                  <span className="font-mono font-extrabold text-sm">
                    {formData.totalCuotas} cuotas de S/ {formData.cuotaAmount}
                  </span>
                </button>
              </div>

              {/* Admin Editable Controls for Cuotas */}
              {formData.payType === 'cuotas' && (
                <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3 animate-fadeIn">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300">Número de Cuotas:</label>
                    <select
                      value={formData.totalCuotas}
                      onChange={(e) => setFormData({ ...formData, totalCuotas: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    >
                      <option value="2">2 Cuotas</option>
                      <option value="3">3 Cuotas</option>
                      <option value="4">4 Cuotas</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300">Monto por Cuota (Admin Editable S/):</label>
                    <input
                      type="number"
                      value={formData.cuotaAmount}
                      onChange={(e) => setFormData({ ...formData, cuotaAmount: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-black"
                    />
                  </div>
                  <p className="col-span-2 text-[10px] text-slate-400 italic">
                    * Total en cuotas: S/ {formData.cuotaAmount * formData.totalCuotas}.00. Se generará hoy el link de la Cuota 1 (S/ {formData.cuotaAmount}) y el sistema guardará el alumno para cobrar la Cuota 2 en 30 días.
                  </p>
                </div>
              )}
            </div>

            {/* Client Info Fields */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Diplomado Asignado (Opcional):</span>
                </label>
                <select
                  value={formData.diplomado}
                  onChange={(e) => setFormData({ ...formData, diplomado: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="">-- El alumno lo seleccionará al pagar --</option>
                  {DIPLOMADOS_LIST.map((dip, idx) => (
                    <option key={idx} value={dip} className="bg-slate-900 text-white">
                      {dip}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Nombre del Alumno:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carmen Prado"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    placeholder="987654321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Correo:</label>
                  <input
                    type="email"
                    required
                    placeholder="carmen@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Generar Link de {formData.payType === 'cuotas' ? `Cuota 1 (S/ ${formData.cuotaAmount})` : `Pago Contado (S/ ${formData.fullPrice})`}</span>
            </button>

          </form>
        )}

        {/* TAB 2: FREE-AMOUNT CUSTOM LINK (Ej. 100 o 120 con concepto digitado a mano) */}
        {activeTab === 'custom_link' && (
          <form onSubmit={handleGenerateCustomLink} className="space-y-4 text-xs animate-fadeIn">
            
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
              <p className="font-bold text-white flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Link de Cobro Personalizado / Monto Libre</span>
              </p>
              <p className="text-[11px] text-slate-300">
                Utiliza esta opción para cobrar cualquier monto (ej. S/ 100, S/ 120) digitando manualmente el concepto.
              </p>
            </div>

            {/* Custom Concept & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-200">Concepto / Descripción Manual:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Reserva de Vacante / Certificado Adicional"
                  value={customLinkData.customConcept}
                  onChange={(e) => setCustomLinkData({ ...customLinkData, customConcept: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200">Monto Libre (S/):</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={customLinkData.customAmount}
                  onChange={(e) => setCustomLinkData({ ...customLinkData, customAmount: Number(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-amber-400 font-mono font-black text-base"
                />
              </div>
            </div>

            {/* Required Client Fields */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Diplomado Asignado (Opcional):</span>
                </label>
                <select
                  value={customLinkData.diplomado}
                  onChange={(e) => setCustomLinkData({ ...customLinkData, diplomado: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="">-- El alumno lo seleccionará al pagar --</option>
                  {DIPLOMADOS_LIST.map((dip, idx) => (
                    <option key={idx} value={dip} className="bg-slate-900 text-white">
                      {dip}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">1. Nombre del Cliente:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mendoza"
                    value={customLinkData.clientName}
                    onChange={(e) => setCustomLinkData({ ...customLinkData, clientName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">2. Número de WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    placeholder="987654321"
                    value={customLinkData.phone}
                    onChange={(e) => setCustomLinkData({ ...customLinkData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">3. Correo Electrónico:</label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@gmail.com"
                    value={customLinkData.email}
                    onChange={(e) => setCustomLinkData({ ...customLinkData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Generar Link Libre de S/ {customLinkData.customAmount}.00</span>
            </button>
          </form>
        )}

        {/* GENERATED LINK SUCCESS RESULT */}
        {generatedLink && (
          <div className="mt-6 pt-4 border-t border-slate-800 space-y-3 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/50 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Link de Cobro Creado Exitosamente!</span>
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 break-all select-all">
                {generatedLink}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendWhatsApp(currentCreatedPlan)}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPreviewStudentCheckout(currentCreatedPlan);
                  }}
                  className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Probar Vista</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INSTALLMENT PLANS MANAGEMENT */}
        {activeTab === 'installments' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 space-y-1">
              <p className="font-bold text-white flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Panel de Seguimiento de Cuotas a 30 días</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Al llegar la fecha de vencimiento (30 días), presiona **"Generar Cuota 2"** para enviarle su nuevo enlace por WhatsApp en 1 solo clic.
              </p>
            </div>

            {installmentPlans.length === 0 ? (
              <div className="text-center py-10 text-slate-500 space-y-2">
                <Calendar className="w-10 h-10 mx-auto text-slate-600" />
                <p>No hay alumnos en cuotas registrados aún.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {installmentPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-white">{plan.clientName}</h4>
                        <p className="text-blue-300 font-medium text-[11px]">{plan.packageName}</p>
                        <p className="text-slate-400 text-[11px]">📱 {plan.phone} | ✉️ {plan.email}</p>
                      </div>

                      <div className="text-right space-y-1">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 inline-block">
                          {plan.status}
                        </span>
                        <p className="text-xs font-mono font-extrabold text-emerald-400">
                          S/ {plan.cuotaAmount}.00 x cuota
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Próximo Cobro (30 días):</span>
                      <span className="font-bold text-amber-400 font-mono">📅 {plan.nextDueDate}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-1">
                      {plan.currentCuotaNum < plan.totalCuotas && (
                        <button
                          onClick={() => handleGenerateNextCuotaLink(plan)}
                          className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-1 cursor-pointer shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generar Link Cuota {plan.currentCuotaNum + 1}</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleSendWhatsApp(plan)}
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GENERAL HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3 text-xs animate-fadeIn">
            {installmentPlans.map((plan) => (
              <div key={plan.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{plan.clientName} - {plan.packageName}</p>
                  <p className="text-[11px] text-slate-400">Monto: S/ {plan.cuotaAmount}.00 | Registrado: {plan.createdDate}</p>
                </div>
                <button
                  onClick={() => handleSendWhatsApp(plan)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reenviar</span>
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
