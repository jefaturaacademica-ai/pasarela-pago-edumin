import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { SOCIAL_PROOF_EVENTS } from '../utils/socialProofData';

export default function SocialProofToast() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Show initial toast after 4 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Rotate toast every 35 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SOCIAL_PROOF_EVENTS.length);
        setIsVisible(true);
      }, 500);
    }, 35000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed || !isVisible) return null;

  const currentEvent = SOCIAL_PROOF_EVENTS[currentIndex];

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-xs sm:max-w-sm animate-fade-in transition-all duration-500">
      <div className="bg-slate-900/95 backdrop-blur-md border border-[#00a499]/40 p-3.5 rounded-2xl shadow-2xl flex items-start gap-3 text-white">
        <div className="w-9 h-9 rounded-full bg-[#00a499]/20 border border-[#00a499]/50 flex items-center justify-center text-[#00e676] shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        
        <div className="flex-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-100">
            <span>{currentEvent.name}</span>
            <span className="text-[10px] text-slate-400 font-normal">({currentEvent.city})</span>
          </div>
          <p className="text-slate-300 font-medium text-[11px] leading-tight mt-0.5">
            Se inscribió en <span className="text-[#00e676] font-semibold">{currentEvent.program}</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse"></span>
            Hace {currentEvent.minutesAgo} minutos • Subvención RECCIP
          </p>
        </div>

        <button 
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          title="Cerrar notificación"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
