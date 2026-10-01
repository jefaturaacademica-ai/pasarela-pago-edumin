import React from 'react';
import { ShoppingCart, Zap, Clock, Calendar, Award, BookOpen } from 'lucide-react';

export default function CoursesGrid({ onAddToCart, onDirectIzipayCheckout }) {
  const courses = [
    {
      id: 'CURSO-IA-01',
      title: 'ESPECIALÍZATE EN INTELIGENCIA ARTIFICIAL DE 0 A 100',
      description: 'Formación práctica y progresiva diseñada para perder el miedo a la tecnología y convertir la IA en tu aliada.',
      category: 'Inteligencia Artificial',
      hours: '40h acad.',
      sessions: '12 sesiones',
      certificate: 'Certificado Incluido',
      price: 180,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'CURSO-EXCEL-02',
      title: 'EXCEL BÁSICO Y PRODUCTIVIDAD EMPRESARIAL',
      description: 'Domina la herramienta indispensable en todo puesto de trabajo. Desde la navegación hasta operadores y gráficos avanzados.',
      category: 'Excel y Ofimática',
      hours: '60h acad.',
      sessions: '12 sesiones',
      certificate: 'Certificado Incluido',
      price: 150,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'CURSO-PBI-03',
      title: 'POWER BI PARA ANÁLISIS DE DATOS Y DASHBOARDS',
      description: 'Aprende Power Query, modelamiento relacional de datos en estrella, funciones DAX fundamentales y cuadros de mando.',
      category: 'Power BI y Datos',
      hours: '60h acad.',
      sessions: '12 sesiones',
      certificate: 'Certificado Incluido',
      price: 220,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'CURSO-LID-04',
      title: 'LIDERAZGO ESTRATÉGICO Y GESTIÓN DE EQUIPOS',
      description: 'Programa vivencial enfocado en comunicación persuasiva, resolución constructiva de conflictos y delegación eficaz.',
      category: 'Liderazgo y Gestión',
      hours: '40h acad.',
      sessions: '10 sesiones',
      certificate: 'Certificado Incluido',
      price: 190,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider border border-amber-200">
            Catálogo de Cursos Individuales
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Cursos Especializados con Certificación
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Añade tus cursos al carrito o cómpralos de forma directa usando la pasarela de pagos Izipay.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Course Image */}
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/90 text-amber-400 text-[10px] font-black uppercase backdrop-blur-md">
                    {course.category}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                    100% Subvencionado
                  </span>
                </div>

                {/* Course Body */}
                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-black text-slate-900 line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{course.hours}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{course.sessions}</span>
                    </span>
                    <span className="flex items-center space-x-1 font-bold text-emerald-600">
                      <Award className="w-3.5 h-3.5" />
                      <span>{course.certificate}</span>
                    </span>
                  </div>

                  <div className="pt-2 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-400">Precio Subvencionado:</span>
                    <span className="text-xl font-black font-mono text-slate-900">S/ {course.price}.00</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAddToCart({ ...course, price: course.price, title: course.title })}
                  className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-[11px] uppercase tracking-wider border border-slate-300 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-slate-700" />
                  <span>+ Carrito</span>
                </button>

                <button
                  onClick={() => onDirectIzipayCheckout({ ...course, basePrice: course.price, title: course.title })}
                  className="py-2.5 px-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Izipay</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
