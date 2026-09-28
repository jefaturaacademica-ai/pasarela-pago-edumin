import React from 'react';
import { ShieldCheck, Award, CreditCard, School } from 'lucide-react';

export default function InstitutionalLogos({ onOpenGenerator }) {
  return (
    <section className="py-12 bg-[#05143c] border-t border-blue-900/60 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Financing & Student Support Banners from Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Banner 1: Cuotas */}
          <div className="bg-yellow-400 p-5 rounded-2xl text-slate-950 text-center space-y-1 shadow-lg border border-yellow-300 transform hover:scale-[1.01] transition-transform">
            <h4 className="text-base sm:text-lg font-black uppercase tracking-tight">
              SI NO DESEAS PAGAR AL CONTADO ACCEDE A NUESTRO FINANCIAMIENTO EN CUOTAS
            </h4>
            <p className="text-xs font-extrabold text-slate-800">
              Consulta las modalidades de pago fraccionado en 2, 3 o 4 cuotas.
            </p>
          </div>

          {/* Banner 2: Apoyo Estudiantil */}
          <div className="bg-[#071b4e] p-5 rounded-2xl text-white text-center border-2 border-blue-500/50 space-y-1 shadow-lg flex flex-col justify-center">
            <h4 className="text-sm sm:text-base font-black text-blue-200">
              Si eres estudiante universitario, accede a nuestro programa de apoyo estudiantil!!
            </h4>
            <p className="text-xs text-yellow-400 font-bold">
              Descuentos adicionales acumulables con la subvención RECCIP.
            </p>
          </div>

        </div>

        {/* Institutional Certifications & Logos Header */}
        <div className="pt-6 border-t border-blue-900/60 text-center space-y-6">
          <p className="text-xs font-black uppercase tracking-widest text-slate-300">
            ESTAMOS CERTIFICADOS Y EN CONVENIO CON INSTITUCIONES LÍDERES
          </p>

          {/* Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-center justify-items-center opacity-90">
            
            {/* Logo ISO 21001 */}
            <div className="p-3 bg-[#061845] rounded-xl border border-blue-800 w-full text-center space-y-1">
              <span className="block font-black text-xs text-white">ISO 21001</span>
              <span className="block text-[9px] text-slate-400 uppercase font-bold">Gestión Educativa</span>
            </div>

            {/* Logo ISO 9001:2015 */}
            <div className="p-3 bg-[#061845] rounded-xl border border-blue-800 w-full text-center space-y-1">
              <span className="block font-black text-xs text-white">ISO 9001:2015</span>
              <span className="block text-[9px] text-slate-400 uppercase font-bold">Calidad Certificada</span>
            </div>

            {/* Logo Avanza */}
            <div className="p-3 bg-[#061845] rounded-xl border border-blue-800 w-full text-center space-y-1">
              <span className="block font-black text-xs text-yellow-400 font-serif">Avanza</span>
              <span className="block text-[9px] text-slate-400 uppercase font-bold">Inst. Técnico Empresarial</span>
            </div>

            {/* Logo SIU */}
            <div className="p-3 bg-[#061845] rounded-xl border border-blue-800 w-full text-center space-y-1">
              <span className="block font-black text-xs text-cyan-300 font-serif">SIU</span>
              <span className="block text-[9px] text-slate-400 uppercase font-bold">San Ignacio University Miami</span>
            </div>

            {/* Logo RECCIP */}
            <div className="p-3 bg-[#061845] rounded-xl border border-blue-800 w-full text-center space-y-1">
              <span className="block font-black text-xs text-orange-400">RECCIP</span>
              <span className="block text-[9px] text-slate-400 uppercase font-bold">Red Empresarios Latam</span>
            </div>

            {/* Logo CIP */}
            <div className="p-3 bg-[#061845] rounded-xl border border-blue-800 w-full text-center space-y-1">
              <span className="block font-black text-xs text-rose-400">CIP</span>
              <span className="block text-[9px] text-slate-400 uppercase font-bold">Colegio de Ingenieros</span>
            </div>

            {/* Logo EDUMIN */}
            <div className="p-3 bg-[#061845] rounded-xl border border-yellow-400/50 w-full text-center space-y-1">
              <span className="block font-black text-sm text-yellow-400">EDUMIN</span>
              <span className="block text-[9px] text-slate-300 uppercase font-bold">Educación Continua</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
