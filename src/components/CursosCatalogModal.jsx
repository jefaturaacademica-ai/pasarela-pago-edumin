import React from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Zap, Download, Laptop, Award } from 'lucide-react';

export default function CursosCatalogModal({ isOpen, onClose, onSelectCursoForCheckout }) {
  if (!isOpen) return null;

  const modules = [
    { num: '01', title: 'Fundamentos de IA y Prompt Engineering Minero', detail: 'Estructuración de instrucciones efectivas en ChatGPT y Claude para minería y gestión técnica.' },
    { num: '02', title: 'Automatización de Informes, PETS e IPERC', detail: 'Reducción del 80% del tiempo en elaboración de matrices de riesgo, procedimientos y reportes HSEQ.' },
    { num: '03', title: 'Análisis de Datos Operativos y Métricas', detail: 'Procesamiento de datos de mina y planta mediante herramientas predictivas de Inteligencia Artificial.' },
    { num: '04', title: 'Gestión Logística y Control de Inventarios con IA', detail: 'Optimización de requerimientos de compras, evaluación de proveedores y trazabilidad de almacenes.' },
    { num: '05', title: 'Casos Prácticos Aplicados en Operaciones Mineras', detail: 'Ejercicios con situaciones reales de empresas del sector minero e industrial en Perú y Latam.' },
    { num: '06', title: 'Plantillas y Prompt Library Descargable', detail: 'Biblioteca exclusiva de comandos listos para copiar y usar en tu trabajo diario.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-purple-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold uppercase border border-purple-500/40">
                  Programa Asincrónico 100% Práctico
                </span>
                <span className="text-[11px] text-slate-400 font-mono">EDUMIN IA</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-0.5">
                CURSO DE IA DE 0 A 100
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Section of Course */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-purple-300 flex items-center gap-2">
                  <span>Inteligencia Artificial Aplicada al Sector Minero e Industrial</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Aprende a utilizar herramientas avanzadas de IA para agilizar tareas, preparar reportes técnicos, analizar información operativa y diferenciar tu perfil profesional.
                </p>
              </div>

              <div className="text-right shrink-0 bg-purple-950/90 border border-purple-500/40 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-purple-300 block">Precio subvencionado</span>
                <span className="text-2xl font-black text-white font-mono">S/ 149.00</span>
                <span className="text-[10px] text-slate-400 line-through block">Precio regular: S/ 500</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Laptop className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Aula Virtual Q10</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Certificado EDUMIN</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Download className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Prompts Descargables</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Acceso 24/7 Ilimitado</span>
              </div>
            </div>
          </div>

          {/* Course Modules Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span>MÓDULOS DE APRENDIZAJE PRACTICO</span>
              <span className="h-px bg-slate-800 flex-1"></span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {modules.map((m) => (
                <div key={m.num} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 hover:border-purple-500/40 transition-all">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {m.num}
                    </span>
                    <span className="font-extrabold text-xs text-white">{m.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-7 leading-relaxed">{m.detail}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Action CTA */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Matrícula directa inmediata con acceso al aula Q10</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onSelectCursoForCheckout('CURSO DE IA DE 0 A 100');
            }}
            className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 cursor-pointer shadow-lg transition-all active:scale-95 shrink-0"
          >
            <span>MATRICULARME EN CURSO IA (S/ 149)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
