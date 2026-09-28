import React from 'react';
import { Star, Quote, School, Building2 } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: 'Antes teníamos a dos personas dedicadas exclusivamente a revisar vouchers y conciliarlos con la cuenta bancaria. Con EDUMIN Pay el 95% de los apoderados paga por Yape o Visa y la pensión se marca como pagada al instante.',
      author: 'Lic. Carmen Rosa Prado',
      role: 'Directora de Tesorería',
      institution: 'Colegio San Agustín - Surco',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    },
    {
      quote: 'Redujimos la morosidad de 22% a menos de 4% en el primer trimestre. Los recordatorios automáticos por WhatsApp con el enlace directo de pago hicieron toda la diferencia.',
      author: 'Ing. Fernando Villarán',
      role: 'Gerente Administrativo',
      institution: 'Instituto Superior Tecnológico TechEd',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
    },
    {
      quote: 'La integración con nuestro software académico EDUMIN fue inmediata. La boleta electrónica se genera y envía en el segundo en que se aprueba la transacción.',
      author: 'Dra. Mercedes Alva',
      role: 'Decana de Administración',
      institution: 'Universidad Interamericana del Perú',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    },
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Casos de Éxito</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Lo que dicen los líderes del sector educativo
          </h2>
          <p className="text-slate-400 text-sm">
            Más de 450 instituciones en todo el Perú confían su recaudo en EDUMIN Pay.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-card p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 relative hover:border-slate-700 transition-all"
            >
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex space-x-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-blue-500/30" />
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-800 flex items-center space-x-3">
                <img 
                  src={t.image} 
                  alt={t.author} 
                  className="w-11 h-11 rounded-full object-cover border border-blue-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{t.author}</h4>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                  <p className="text-[11px] font-semibold text-blue-400 flex items-center space-x-1 mt-0.5">
                    <School className="w-3 h-3" />
                    <span>{t.institution}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
