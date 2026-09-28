import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function FloatingWhatsapp() {
  const handleClick = () => {
    const waUrl = `https://wa.me/51987654321?text=${encodeURIComponent('Hola EDUMIN 🎓, deseo solicitar información sobre los Programas de Especialización y facilidades de pago en cuotas.')}`;
    window.open(waUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Soporte por WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-[#10b981] hover:bg-[#059669] text-white px-4 py-3 rounded-full shadow-2xl flex items-center space-x-2 font-extrabold text-xs transition-all duration-300 hover:scale-105 cursor-pointer border border-emerald-400/40"
    >
      <MessageSquare className="w-4 h-4 fill-white" />
      <span>Soporte por WhatsApp</span>
    </button>
  );
}
