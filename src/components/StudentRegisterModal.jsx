import React, { useState, useEffect } from 'react';
import { X, School, User, Phone, Mail, DollarSign, Lock, ArrowRight, ShieldCheck, CheckCircle2, GraduationCap } from 'lucide-react';
import { DIPLOMADOS_LIST } from '../utils/diplomadosData';
import { normalizeText } from '../utils/stringUtils';

export default function StudentRegisterModal({ 
  isOpen, 
  onClose, 
  selectionData,
  onProceedToCheckout
}) {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    diplomado: '',
  });

  useEffect(() => {
    if (selectionData) {
      let matchedDiplomado = '';
      if (selectionData.preselectedDiplomado) {
        const normTarget = normalizeText(selectionData.preselectedDiplomado);
        const found = DIPLOMADOS_LIST.find(d => {
          const normD = normalizeText(d);
          return normD === normTarget || normD.includes(normTarget) || normTarget.includes(normD);
        });
        matchedDiplomado = found || selectionData.preselectedDiplomado;
      }

      setFormData({ 
        clientName: '', 
        phone: '', 
        email: '', 
        diplomado: matchedDiplomado 
      });
    }
  }, [selectionData]);

  if (!isOpen || !selectionData) return null;

  const { pkg, payType, cuotaOpt } = selectionData;
  const isCuota = payType === 'cuotas' && cuotaOpt;
  
  // Non-editable amount for student
  const payableAmount = isCuota ? cuotaOpt.amount : pkg.basePrice;
  const conceptName = isCuota 
    ? `${pkg.title} - Cuota 1 de ${cuotaOpt.count}` 
    : `${pkg.title} - Pago al Contado`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      id: 'PAY-STU-' + Math.floor(100000 + Math.random() * 900000),
      clientName: formData.clientName,
      phone: formData.phone,
      email: formData.email,
      diplomado: formData.diplomado,
      packageName: conceptName,
      amount: payableAmount,
      payType: payType,
      cuotaOpt: cuotaOpt || null,
      basePackageTitle: pkg.title,
    };

    onProceedToCheckout(orderData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0f172a] rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Inscripción al Programa</h3>
            <p className="text-xs text-slate-400">Ingresa tus datos para generar tu comprobante de matrícula</p>
          </div>
        </div>

        {/* Concept & Fixed Non-Editable Amount Display */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-5 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Concepto Seleccionado:</span>
            <span className="font-bold text-amber-300 font-sans">{conceptName}</span>
          </div>
          {isCuota && (
            <p className="text-[11px] text-slate-400 italic">
              * Plan contratado: {cuotaOpt.count} cuotas de S/ {cuotaOpt.amount}.00 (Total: S/ {cuotaOpt.total}.00).
            </p>
          )}
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
            <span className="font-bold text-slate-300 uppercase">Monto a Pagar Hoy:</span>
            <span className="text-2xl font-black text-amber-400 font-mono">S/ {payableAmount}.00</span>
          </div>
        </div>

        {/* Student Data Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-200 flex items-center space-x-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Diplomado a Inscribirse *:</span>
            </label>
            <select
              required
              value={formData.diplomado}
              onChange={(e) => setFormData({ ...formData, diplomado: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="" disabled>-- Selecciona tu Diplomado --</option>
              {DIPLOMADOS_LIST.map((dip, idx) => (
                <option key={idx} value={dip} className="bg-slate-900 text-white">
                  {dip}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-200 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Nombre Completo del Alumno:</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Mateo Ramos Silva"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-200 flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Número de Teléfono (WhatsApp):</span>
            </label>
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
            <label className="font-bold text-slate-200 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Correo Electrónico:</span>
            </label>
            <input
              type="email"
              required
              placeholder="mateo.ramos@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
          >
            <span>Ir a la Pasarela de Pago S/ {payableAmount}.00</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

      </div>
    </div>
  );
}
