import React from 'react';

export default function InstitutionalLogos({ onOpenGenerator }) {
  const handleCuotasBannerWhatsApp = () => {
    const message = `Hola EDUMIN 🎓, solicito información sobre el financiamiento en cuotas (2, 3 o 4 cuotas) para los programas de especialización.`;
    window.open(`https://wa.me/51951101765?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleApoyoEstudiantilWhatsApp = () => {
    const message = `Hola EDUMIN 🎓, soy estudiante universitario y solicito información sobre el Programa de Apoyo Estudiantil con descuentos acumulables a RECCIP.`;
    window.open(`https://wa.me/51951101765?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="py-12 bg-[#05143c] border-t border-blue-900/60 text-white font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Financing & Student Support Banners -> Direct WhatsApp Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Banner 1: Cuotas */}
          <button
            onClick={handleCuotasBannerWhatsApp}
            className="w-full bg-amber-400 hover:bg-amber-300 p-5 rounded-2xl text-slate-950 text-center space-y-1 shadow-lg border border-amber-300 transform hover:scale-[1.02] transition-all cursor-pointer flex flex-col items-center justify-center group"
          >
            <div className="flex items-center space-x-2">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM_c9Q3XvG6b7rWAQZV7nxNNN8R0kXGoD6TjFThjsLvtKKC89Ej7KjTgW3&s=10" 
                alt="WhatsApp Logo" 
                className="w-5 h-5 rounded-full object-cover shrink-0 shadow-sm" 
              />
              <h4 className="text-base sm:text-lg font-black uppercase tracking-tight">
                SI NO DESEAS PAGAR AL CONTADO ACCEDE A NUESTRO FINANCIAMIENTO EN CUOTAS
              </h4>
            </div>
            <p className="text-xs font-extrabold text-slate-900 group-hover:underline">
              Consulta las modalidades de pago fraccionado en 2, 3 o 4 cuotas. (Clic para enviar WhatsApp 📱)
            </p>
          </button>

          {/* Banner 2: Apoyo Estudiantil */}
          <button
            onClick={handleApoyoEstudiantilWhatsApp}
            className="w-full bg-[#071b4e] hover:bg-[#0a256b] p-5 rounded-2xl text-white text-center border-2 border-blue-500/50 space-y-1 shadow-lg transform hover:scale-[1.02] transition-all cursor-pointer flex flex-col items-center justify-center group"
          >
            <div className="flex items-center space-x-2">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM_c9Q3XvG6b7rWAQZV7nxNNN8R0kXGoD6TjFThjsLvtKKC89Ej7KjTgW3&s=10" 
                alt="WhatsApp Logo" 
                className="w-5 h-5 rounded-full object-cover shrink-0 shadow-sm" 
              />
              <h4 className="text-sm sm:text-base font-black text-blue-200">
                Si eres estudiante universitario, accede a nuestro programa de apoyo estudiantil!!
              </h4>
            </div>
            <p className="text-xs text-amber-300 font-bold group-hover:underline">
              Descuentos adicionales acumulables con la subvención RECCIP. (Clic para consultar por WhatsApp 📱)
            </p>
          </button>

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
