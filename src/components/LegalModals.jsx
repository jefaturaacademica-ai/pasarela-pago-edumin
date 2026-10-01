import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, BookOpen, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-800 overflow-hidden max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-slate-900">Términos y Condiciones de Uso</h3>
            <p className="text-xs text-slate-500">EDUMIN - Plataforma de Especialización Internacional</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <h4 className="font-bold text-slate-900 text-sm">1. Aceptación del Servicio</h4>
          <p>Al matricularse o realizar pagos a través de la plataforma de EDUMIN, el alumno o apoderado acepta de forma íntegra los presentes Términos y Condiciones de uso del servicio educacional.</p>

          <h4 className="font-bold text-slate-900 text-sm">2. Métodos de Pago y Pasarela Izipay</h4>
          <p>Los pagos procesados con tarjetas de crédito, débito, Yape, Plin o PagoEfectivo son canalizados a través de la pasarela oficial <strong>Izipay Online Perú</strong> bajo protocolos de encriptación PCI-DSS Level 1.</p>

          <h4 className="font-bold text-slate-900 text-sm">3. Emisión de Comprobantes Electrónicos</h4>
          <p>EDUMIN emite Boletas o Facturas electrónicas homologadas por SUNAT de manera inmediata tras la confirmación exitosa de la transacción bancaria.</p>

          <h4 className="font-bold text-slate-900 text-sm">4. Política de Matrículas y Devoluciones</h4>
          <p>Las solicitudes de reprogramación o retiro académico se atenderán conforme al reglamento interno institucional en un plazo no mayor a 7 días hábiles tras la inscripción.</p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 text-right">
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl">
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

export function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-800 overflow-hidden max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-slate-900">Política de Privacidad (Ley 29733)</h3>
            <p className="text-xs text-slate-500">Protección de Datos Personales</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>En cumplimiento de la Ley N° 29733, Ley de Protección de Datos Personales en el Perú, EDUMIN garantiza la confidencialidad, seguridad y adecuado tratamiento de los datos ingresados por los usuarios.</p>

          <h4 className="font-bold text-slate-900 text-sm">Finalidad del Tratamiento</h4>
          <p>Los datos solicitados (Nombres, DNI/RUC, Teléfono, Correo, Dirección) son empleados exclusivamente para la gestión académica, cobro vía Izipay, emisión de comprobantes de pago y envío de certificaciones.</p>

          <h4 className="font-bold text-slate-900 text-sm">Seguridad de Información Bancaria</h4>
          <p>EDUMIN no almacena ni registra números de tarjetas de crédito o débito. La captura de datos de tarjeta se realiza de forma directa y cifrada dentro de la pasarela de <strong>Izipay</strong>.</p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 text-right">
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export function ClaimsBookModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [claimData, setClaimData] = useState({
    name: '',
    doc: '',
    phone: '',
    email: '',
    detail: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-800 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button onClick={handleReset} className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-slate-900">Libro de Reclamaciones Virtual</h3>
            <p className="text-xs text-slate-500">Hoja de Reclamación Oficial (D.S. N° 011-2011-PCM)</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Reclamo Registrado Exitosamente</h4>
            <p className="text-xs text-slate-600">Se ha enviado una copia a su correo y nuestro equipo dará respuesta en un plazo no mayor a 15 días hábiles conforme a ley.</p>
            <button onClick={handleReset} className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo:</label>
                <input type="text" required value={claimData.name} onChange={(e) => setClaimData({...claimData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">DNI / RUC:</label>
                <input type="text" required value={claimData.doc} onChange={(e) => setClaimData({...claimData, doc: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Teléfono:</label>
                <input type="tel" required value={claimData.phone} onChange={(e) => setClaimData({...claimData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico:</label>
                <input type="email" required value={claimData.email} onChange={(e) => setClaimData({...claimData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Detalle del Reclamo o Queja:</label>
              <textarea rows="3" required value={claimData.detail} onChange={(e) => setClaimData({...claimData, detail: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900" placeholder="Describa los hechos..." />
            </div>

            <button type="submit" className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center justify-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Enviar Hoja de Reclamación</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
