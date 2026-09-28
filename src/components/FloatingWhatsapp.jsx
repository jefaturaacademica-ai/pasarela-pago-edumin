import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function FloatingWhatsapp() {
  const handleClick = () => {
    const waUrl = `https://wa.me/51987423200?text=${encodeURIComponent('Hola asesora EDUMIN 🎓, deseo consultar sobre los Programas de Especialización y solicitar información de cuotas.')}`;
    window.open(waUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Soporte por WhatsApp 987423200"
      className="fixed bottom-6 right-6 z-40 bg-[#10b981] hover:bg-[#059669] text-white px-4 py-3 rounded-full shadow-2xl flex items-center space-x-2 font-extrabold text-xs transition-all duration-300 hover:scale-105 cursor-pointer border border-emerald-400/40"
    >
      <MessageSquare className="w-4 h-4 fill-white" />
      <span>Soporte por WhatsApp</span>
    </button>
  );
}
