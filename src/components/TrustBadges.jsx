import React from 'react';
import { ShieldCheck, Lock, Award, Zap, CreditCard, CheckCircle2 } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: <Lock className="w-4 h-4 text-emerald-400 shrink-0" />,
      title: "Transacción Segura",
      subtitle: "Cifrado bancario SSL 256-Bit",
      border: "border-emerald-500/20",
      bg: "bg-emerald-950/30"
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />,
      title: "Izipay Homologado",
      subtitle: "Certificación PCI-DSS Nivel 1",
      border: "border-sky-500/20",
      bg: "bg-sky-950/30"
    },
    {
      icon: <Award className="w-4 h-4 text-amber-400 shrink-0" />,
      title: "Respaldo CIP Oficial",
      subtitle: "Colegio de Ingenieros del Perú",
      border: "border-amber-500/20",
      bg: "bg-amber-950/30"
    },
    {
      icon: <Zap className="w-4 h-4 text-purple-400 shrink-0" />,
      title: "Activación Inmediata",
      subtitle: "Acceso automático al Aula Q10",
      border: "border-purple-500/20",
      bg: "bg-purple-950/30"
    }
  ];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-8">
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-3 sm:p-4 shadow-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {badges.map((b, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${b.border} ${b.bg} transition-all hover:scale-[1.02] duration-200`}
            >
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 shadow-xs">
                {b.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white tracking-tight truncate flex items-center gap-1">
                  {b.title}
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 inline shrink-0" />
                </p>
                <p className="text-[10px] text-slate-400 truncate font-medium">
                  {b.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
