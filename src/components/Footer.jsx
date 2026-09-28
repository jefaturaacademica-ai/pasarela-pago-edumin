import React from 'react';
import { School, ShieldCheck, Lock, Mail, Phone, MapPin, Heart, ArrowUp } from 'lucide-react';

export default function Footer({ onOpenRegister }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <School className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-extrabold text-white">EDUMIN</span>
                  <span className="text-[10px] uppercase font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                    Pay
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">Pasarela de Pago Educativa</span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              La plataforma omnicanal de recaudo diseñada exclusivamente para colegios, institutos y universidades en el Perú. Pagos instantáneos vía Yape, Plin, Tarjetas y comprobantes SUNAT automáticos.
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>PCI-DSS Level 1</span>
              </span>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>256-bit SSL</span>
              </span>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Soluciones</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Cobro de Pensiones</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Matrículas en Línea</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Recordatorios por WhatsApp</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Facturación SUNAT</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Calculadora de Ahorro</a></li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Instituciones</h4>
            <ul className="space-y-2">
              <li><a href="#pricing" className="hover:text-white transition-colors">Colegios Privados</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Institutos Superiores</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Universidades</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Redes Multi-Sede</a></li>
              <li><a href="#dashboard-demo" className="hover:text-white transition-colors">Panel LMS EDUMIN</a></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contacto & Soporte</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>+51 (01) 748-9000</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>contacto@edumin.pe</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Av. Javier Prado Este 4200, Surco, Lima - Perú</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenRegister}
                className="w-full py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl font-bold text-xs transition-colors"
              >
                Solicitar Demo
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 EDUMIN Pay. Todos los derechos reservados. Diseñado para la comunidad educativa.</p>
          <div className="flex items-center space-x-4">
            <button 
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800 flex items-center space-x-1"
            >
              <span>Subir al inicio</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
