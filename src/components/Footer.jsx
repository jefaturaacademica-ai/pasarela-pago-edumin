import React, { useState } from 'react';
import { School, ShieldCheck, Lock, Mail, Phone, MapPin, ArrowUp, FileText, BookOpen } from 'lucide-react';
import { TermsModal, PrivacyModal, ClaimsBookModal } from './LegalModals';

export default function Footer({ onOpenRegister }) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isClaimsOpen, setIsClaimsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logoUrl = "https://raw.githubusercontent.com/videoconferenciasdiplomado-alt/imagenes/main/logo/logo%20blanco.png";

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={logoUrl} 
                alt="EDUMIN Logo" 
                className="h-8 object-contain" 
                onError={(e) => e.target.style.display = 'none'}
              />
              <div className="border-l border-slate-800 pl-3">
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-widest">Educación Continua</span>
                <span className="text-sm font-black text-white">EDUMIN Perú</span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Plataforma de capacitación y especialización profesional de EDUMIN. Pagos 100% seguros a través de la pasarela oficial de <strong>Izipay Online</strong>.
            </p>

            {/* Izipay Payment Logos */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Pasarela & Tarjetas Aceptadas:</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-red-600 text-white font-extrabold rounded text-[10px] uppercase">Izipay</span>
                <span className="px-2.5 py-1 bg-blue-700 text-white font-bold rounded text-[10px]">VISA</span>
                <span className="px-2.5 py-1 bg-red-500 text-white font-bold rounded text-[10px]">Mastercard</span>
                <span className="px-2.5 py-1 bg-cyan-600 text-white font-bold rounded text-[10px]">AMEX</span>
                <span className="px-2.5 py-1 bg-purple-600 text-white font-bold rounded text-[10px]">Yape</span>
                <span className="px-2.5 py-1 bg-teal-600 text-white font-bold rounded text-[10px]">Plin</span>
              </div>
            </div>
          </div>

          {/* Legal Policies (Izipay Audit Required) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Políticas & Legales</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setIsTermsOpen(true)} className="hover:text-white transition-colors text-left flex items-center space-x-1.5 cursor-pointer">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Términos y Condiciones</span>
                </button>
              </li>
              <li>
                <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-white transition-colors text-left flex items-center space-x-1.5 cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Política de Privacidad (Ley 29733)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setIsClaimsOpen(true)} className="hover:text-white transition-colors text-left flex items-center space-x-1.5 cursor-pointer">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Libro de Reclamaciones Virtual</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Especializaciones</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Programa Completo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Programa Full</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Programa Ilimitado</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cursos Asincrónicos</a></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contacto & Soporte</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>+51 987423200</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>contacto@edumin.pe</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Av. Javier Prado Este 4200, Surco, Lima</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 EDUMIN Pay. Pagos seguros integrados con Izipay. Todos los derechos reservados.</p>
          <button 
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>Subir al inicio</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Legal Modals */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <ClaimsBookModal isOpen={isClaimsOpen} onClose={() => setIsClaimsOpen(false)} />
    </footer>
  );
}
