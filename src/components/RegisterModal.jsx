import React, { useState } from 'react';
import { X, School, CheckCircle2, ArrowRight, ShieldCheck, Phone, Mail, User, Building } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RegisterModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: 'Colegio Privado',
    studentCount: '300-600 alumnos',
    contactName: '',
    phone: '',
    email: '',
    comments: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5 }
    });
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-card rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 bg-slate-900 text-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">¡Solicitud Recibida con Éxito!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Un especialista técnico en pasarelas de pago de EDUMIN se pondrá en contacto con <strong className="text-white">{formData.contactName || 'su institución'}</strong> vía WhatsApp en menos de 2 horas laborables.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left max-w-md mx-auto space-y-1.5 font-mono text-slate-400">
              <p className="font-bold text-blue-400 font-sans border-b border-slate-800 pb-1">Resumen del Registro:</p>
              <p><span className="text-slate-500">Institución:</span> {formData.institutionName || 'Colegio Educativo'}</p>
              <p><span className="text-slate-500">Teléfono WhatsApp:</span> {formData.phone || '999 888 777'}</p>
              <p><span className="text-slate-500">Tipo & Tamaño:</span> {formData.institutionType} ({formData.studentCount})</p>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer"
            >
              Entendido / Cerrar
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <School className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Afiliar mi Institución Educativa</h3>
                <p className="text-xs text-slate-400">Empieza a recaudar pensiones con 0 mora y comprobante automático</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Institution Name & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 flex items-center space-x-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    <span>Nombre de la Institución:</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Colegio San Agustín"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Tipo de Institución:</label>
                  <select
                    value={formData.institutionType}
                    onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Colegio Privado">Colegio Privado</option>
                    <option value="Instituto Superior">Instituto Superior / CETPRO</option>
                    <option value="Universidad">Universidad</option>
                    <option value="Nido / Inicial">Nido / Centro Inicial</option>
                    <option value="Red Educativa Multi-Sede">Red Educativa Multi-Sede</option>
                  </select>
                </div>
              </div>

              {/* Number of Students */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Cantidad aproximada de alumnos:</label>
                <select
                  value={formData.studentCount}
                  onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Menos de 150 alumnos">Menos de 150 alumnos</option>
                  <option value="150 - 300 alumnos">150 - 300 alumnos</option>
                  <option value="300 - 600 alumnos">300 - 600 alumnos</option>
                  <option value="600 - 1,200 alumnos">600 - 1,200 alumnos</option>
                  <option value="Más de 1,200 alumnos">Más de 1,200 alumnos (Corporativo)</option>
                </select>
              </div>

              {/* Contact Person & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-teal-400" />
                    <span>Persona de Contacto:</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre y Apellido"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Celular WhatsApp:</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 987 654 321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Correo Institucional o personal:</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="direccion@colegiosanagustin.edu.pe"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Comments */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Mensaje adicional (opcional):</label>
                <textarea
                  rows="2"
                  placeholder="¿Usan algún software contable actual o requieren alguna función específica?"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Solicitar Activación & Demo Personalizada</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tus datos están protegidos bajo estricta confidencialidad Ley 29733.</span>
              </p>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
