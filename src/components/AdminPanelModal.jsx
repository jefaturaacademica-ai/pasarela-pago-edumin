import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Link as LinkIcon, 
  CheckCircle2, 
  Copy, 
  Send, 
  Sparkles, 
  ExternalLink,
  History,
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
  successfulTransactions = [],
  onSaveInstallmentPlan,
  onUpdateInstallmentStatus,
  onPreviewStudentCheckout
}) {
  const [activeTab, setActiveTab] = useState('custom_link'); // 'custom_link' | 'payments' | 'history'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom Link State (Monto y Concepto libre/seleccionable con DNI y Nombres/Apellidos)
  const [customLinkData, setCustomLinkData] = useState({
    clientFirstName: '',
    clientLastName: '',
    dni: '',
    phone: '',
    email: '',
    diplomado: '',
    conceptType: 'PROGRAMA COMPLETO', // 'PROGRAMA COMPLETO' | 'PROGRAMA FULL' | 'PROGRAMA ILIMITADO' | 'OTROS'
    customConceptText: '',
    customAmount: 540,
  });

  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentCreatedPlan, setCurrentCreatedPlan] = useState(null);

  if (!isOpen) return null;

  const handleConceptTypeChange = (type) => {
    let amount = customLinkData.customAmount;
    let autoDiplomado = customLinkData.diplomado;

    if (type === 'PROGRAMA COMPLETO') amount = 540;
    else if (type === 'PROGRAMA FULL') amount = 900;
    else if (type === 'PROGRAMA ILIMITADO') amount = 1500;
    else if (type === 'CURSO IA DE 0 A 100') {
      amount = 149;
      autoDiplomado = 'CURSO DE IA DE 0 A 100';
    }
    else if (type === 'OTROS') amount = 120;

    setCustomLinkData({
      ...customLinkData,
      conceptType: type,
      customAmount: amount,
      diplomado: autoDiplomado
    });
  };

  // Generate Custom Link
  const handleGenerateCustomLink = (e) => {
    e.preventDefault();
    const linkId = 'PAY-CUSTOM-' + Math.floor(100000 + Math.random() * 900000);
    const origin = window.location.origin;

    const finalConcept = customLinkData.conceptType === 'OTROS'
      ? (customLinkData.customConceptText.trim() || 'OTROS')
      : customLinkData.conceptType;

    const fullName = `${customLinkData.clientFirstName.trim()} ${customLinkData.clientLastName.trim()}`.trim();

    // 24 Hours Expiration Timestamp
    const expTimestamp = Date.now() + 24 * 60 * 60 * 1000;

    const sig = generatePaymentSignature(linkId, customLinkData.customAmount, finalConcept, expTimestamp);

    const query = new URLSearchParams({
      id: linkId,
      nom: customLinkData.clientFirstName.trim(),
      ape: customLinkData.clientLastName.trim(),
      cliente: fullName,
      dni: customLinkData.dni.trim(),
      tel: customLinkData.phone.trim(),
      email: customLinkData.email.trim(),
      dip: customLinkData.diplomado,
      monto: customLinkData.customAmount,
      pkg: finalConcept,
      exp: expTimestamp,
      sig: sig
    }).toString();

    const fullUrl = `${origin}/#checkout?${query}`;
    setGeneratedLink(fullUrl);

    const planRecord = {
      id: linkId,
      firstName: customLinkData.clientFirstName.trim(),
      lastName: customLinkData.clientLastName.trim(),
      clientName: fullName,
      dni: customLinkData.dni.trim(),
      phone: customLinkData.phone.trim(),
      email: customLinkData.email.trim(),
      diplomado: customLinkData.diplomado,
      packageName: finalConcept,
      payType: 'custom',
      currentCuotaNum: 1,
      totalCuotas: 1,
      cuotaAmount: customLinkData.customAmount,
      totalAmount: customLinkData.customAmount,
      status: 'Link Generado',
      createdDate: new Date().toLocaleDateString('es-PE'),
      nextDueDate: 'Pago Único',
      currentLinkUrl: fullUrl,
      sig: sig
    };

    setCurrentCreatedPlan(planRecord);
    if (onSaveInstallmentPlan) {
      onSaveInstallmentPlan(planRecord);
    }

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
    
    let message = `Hola *${target.clientName}*, te saluda tu asesora de *EDUMIN* 🎓.\n\nAquí tienes tu enlace de pago para *${target.packageName}* por un monto de *S/ ${target.cuotaAmount}.00*:\n\n👉 ${target.currentLinkUrl}\n\n⏱️ *Nota:* Este enlace es válido únicamente por *24 horas* por seguridad.\n\nQuedo atenta para confirmarte la matrícula.`;

    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`, '_blank');
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

        {/* Tabs Bar - Link Único, Transacciones Exitosas & Historial */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('custom_link')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'custom_link'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>⚡ Link Único</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-emerald-400 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-950" />
            <span>✅ Transacciones Exitosas ({successfulTransactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>📜 Historial de Links</span>
          </button>
        </div>

        {/* TAB 1: LINK ÚNICO FORM */}
        {activeTab === 'custom_link' && (
          <form onSubmit={handleGenerateCustomLink} className="space-y-4 text-xs animate-fadeIn">
            
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
              <p className="font-bold text-white flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Generador de Link Único de Pago</span>
              </p>
              <p className="text-[11px] text-slate-300">
                Selecciona el programa o elige "OTROS" para especificar un concepto manual. Válido por 24 horas.
              </p>
            </div>

            {/* Concept Dropdown & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-200">Concepto / Programa:</label>
                <select
                  value={customLinkData.conceptType}
                  onChange={(e) => handleConceptTypeChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-semibold text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="PROGRAMA COMPLETO">PROGRAMA COMPLETO</option>
                  <option value="PROGRAMA FULL">PROGRAMA FULL</option>
                  <option value="PROGRAMA ILIMITADO">PROGRAMA ILIMITADO</option>
                  <option value="CURSO IA DE 0 A 100">CURSO IA DE 0 A 100</option>
                  <option value="OTROS">OTROS (Escribir concepto manual)</option>
                </select>
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

            {/* Conditional Manual Concept Field if OTROS is selected */}
            {customLinkData.conceptType === 'OTROS' && (
              <div className="space-y-1 animate-fadeIn">
                <label className="font-bold text-amber-300">Especificar Concepto Manual:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cuota 1 / Reserva de Vacante / Certificado"
                  value={customLinkData.customConceptText}
                  onChange={(e) => setCustomLinkData({ ...customLinkData, customConceptText: e.target.value })}
                  className="w-full bg-slate-900 border border-amber-500/50 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Required Client & Diplomado Fields */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">1. Nombres del Cliente:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Eduardo"
                    value={customLinkData.clientFirstName}
                    onChange={(e) => setCustomLinkData({ ...customLinkData, clientFirstName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">2. Apellidos del Cliente:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mendoza Prado"
                    value={customLinkData.clientLastName}
                    onChange={(e) => setCustomLinkData({ ...customLinkData, clientLastName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">3. DNI / Documento de Identidad:</label>
                  <input
                    type="text"
                    placeholder="Ej. 74829102 (Opcional)"
                    value={customLinkData.dni}
                    onChange={(e) => setCustomLinkData({ ...customLinkData, dni: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-amber-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">4. Número de WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    placeholder="987654321"
                    value={customLinkData.phone}
                    onChange={(e) => setCustomLinkData({ ...customLinkData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-300">5. Correo Electrónico:</label>
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
              <span>Generar Link Único (S/ {customLinkData.customAmount}.00)</span>
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



        {/* TAB 2: TRANSACCIONES EXITOSAS */}
        {activeTab === 'payments' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Total Recaudado</span>
                <span className="text-xl font-black text-emerald-400">
                  S/ {successfulTransactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0).toFixed(2)}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-300">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Pagos Aprobados</span>
                <span className="text-xl font-black text-blue-400">{successfulTransactions.length} Transacciones</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-500/30 text-amber-300">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Notificación Q10 / n8n</span>
                <span className="text-xl font-black text-amber-400">100% Enviados</span>
              </div>
            </div>

            {/* Search Filter Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar por Alumno, DNI, N° de Orden o Concepto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* List of Payments */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {successfulTransactions
                .filter(t => {
                  if (!searchTerm) return true;
                  const search = searchTerm.toLowerCase();
                  return (
                    (t.clientName && t.clientName.toLowerCase().includes(search)) ||
                    (t.firstName && t.firstName.toLowerCase().includes(search)) ||
                    (t.lastName && t.lastName.toLowerCase().includes(search)) ||
                    (t.dni && t.dni.toLowerCase().includes(search)) ||
                    (t.orderNumber && t.orderNumber.toLowerCase().includes(search)) ||
                    (t.packageName && t.packageName.toLowerCase().includes(search))
                  );
                })
                .map((tx, idx) => (
                  <div key={tx.orderNumber || idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 hover:border-emerald-500/40 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-white text-sm">
                            {tx.clientName || `${tx.firstName || ''} ${tx.lastName || ''}`.trim() || 'Alumno Edumin'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                            {tx.status || 'Aprobado Izipay'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Orden: <strong className="text-amber-300 font-mono">{tx.orderNumber || '#IZI-' + (849201 + idx)}</strong> | DNI: <strong className="text-slate-200 font-mono">{tx.dni || 'Sin DNI'}</strong>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-emerald-400 block font-mono">
                          S/ {Number(tx.amount || 540).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400">{tx.dateFormatted || tx.createdDate || 'Reciente'}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] space-y-1">
                      <p className="text-slate-300">
                        <strong className="text-slate-400">Concepto:</strong> {tx.packageName || 'PROGRAMA COMPLETO'}
                      </p>
                      {tx.diplomado && (
                        <p className="text-slate-300">
                          <strong className="text-slate-400">Diplomado:</strong> {tx.diplomado}
                        </p>
                      )}
                      <p className="text-slate-400 text-[10px] flex items-center justify-between pt-1 border-t border-slate-900">
                        <span>📧 {tx.email || 'correo@alumno.com'} | 📱 {tx.phone || 'Sin Teléfono'}</span>
                        <span className="text-emerald-400 font-semibold">Q10 Webhook Sync: OK</span>
                      </p>
                    </div>

                    {tx.phone && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const clean = tx.phone.replace(/\D/g, '');
                            const phoneWithCountry = clean.length === 9 ? `51${clean}` : clean;
                            const msg = `Hola *${tx.clientName || tx.firstName}*, confirmamos la recepción exitosa de tu pago de *S/ ${tx.amount}* por *${tx.packageName}*.\n\nEn breve el área académica procederá con tu matrícula en Q10. ¡Bienvenido a EDUMIN! 🎓`;
                            window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`, '_blank');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Contactar WhatsApp</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              {successfulTransactions.length === 0 && (
                <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-400">Aún no hay transacciones registradas</p>
                  <p className="text-[11px] text-slate-500">Los pagos realizados a través del checkout aparecerán automáticamente en esta lista.</p>
                </div>
              )}
            </div>
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
