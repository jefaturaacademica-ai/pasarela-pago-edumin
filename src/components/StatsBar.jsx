import React from 'react';
import { School, Building, ShieldCheck, DollarSign, Clock, Users, ArrowUpRight } from 'lucide-react';

export default function StatsBar() {
  const stats = [
    {
      icon: School,
      value: '+450',
      label: 'Instituciones Educativas',
      sublabel: 'Colegios, Institutos & Universidades',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: DollarSign,
      value: 'S/ 140M+',
      label: 'Procesados al Año',
      sublabel: 'Recaudación de matrículas y pensiones',
      color: 'from-teal-400 to-emerald-500',
    },
    {
      icon: Clock,
      value: '0.8s',
      label: 'Tiempo de Confirmación',
      sublabel: 'Respuesta en tiempo real',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: ShieldCheck,
      value: '99.98%',
      label: 'Disponibilidad Uptime',
      sublabel: 'Infraestructura cloud redundante',
      color: 'from-amber-400 to-orange-500',
    },
  ];

  return (
    <section className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-800 shadow-2xl bg-slate-900/80 backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className={`pt-4 sm:pt-0 ${idx !== 0 ? 'sm:pl-6 lg:pl-8' : ''} flex items-start space-x-4 group`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${stat.color} p-0.5 shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-200">{stat.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{stat.sublabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
