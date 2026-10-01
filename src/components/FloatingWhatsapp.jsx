import React from 'react';

export default function FloatingWhatsapp() {
  const handleClick = () => {
    const waUrl = `https://wa.me/51951101765?text=${encodeURIComponent('Hola Comercial EDUMIN 🎓, deseo consultar sobre los Programas de Especialización y la pasarela de pagos.')}`;
    window.open(waUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Soporte por WhatsApp EDUMIN +51 951 101 765"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl flex items-center space-x-2.5 font-extrabold text-xs transition-all duration-300 hover:scale-105 cursor-pointer border border-emerald-400/50"
    >
      <img 
        src="https://img.magnific.com/vector-premium/whatsapp-vector-logo-icono-logotipo-vector-redes-sociales_901408-404.jpg?semt=ais_hybrid&w=740&q=80" 
        alt="WhatsApp Logo" 
        className="w-5 h-5 rounded-full object-cover shadow-sm shrink-0" 
      />
      <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border border-slate-700 shadow-inner">
        EDUMIN 🎓
      </span>
      <span>Soporte por WhatsApp</span>
    </button>
  );
}
