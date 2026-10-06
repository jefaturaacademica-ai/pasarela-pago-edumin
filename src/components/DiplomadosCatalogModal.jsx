import React, { useState } from 'react';
import { X, Search, GraduationCap, ArrowRight, ShieldCheck, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { DAEM_FULL_CATALOG } from '../utils/daemCatalogData';

export default function DiplomadosCatalogModal({ isOpen, onClose, onSelectDiplomadoForCheckout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  if (!isOpen) return null;

  const categories = ['ALL', ...new Set(DAEM_FULL_CATALOG.map(d => d.category))];

  const filteredDiplomados = DAEM_FULL_CATALOG.filter(item => {
    const matchesSearch = !searchTerm || (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.objetivo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00a499]/20 border border-[#00a499]/50 flex items-center justify-center text-[#00e676]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase border border-emerald-500/30">
                  22 Rutas DAEM Oficiales
                </span>
                <span className="text-[11px] text-slate-400 font-mono">www.edumin.pe</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight mt-0.5">
                DIPLOMADOS DE ALTA ESPECIALIZACIÓN MINERA
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

        {/* Filter Controls & Search */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="🔍 Buscar por diplomado, objetivo, legislación, geología..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#00a499]"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-400 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="font-bold shrink-0">Filtro Rápido:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#00a499] cursor-pointer"
              >
                <option value="ALL">Todas las Áreas ({DAEM_FULL_CATALOG.length})</option>
                {categories.filter(c => c !== 'ALL').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDiplomados.map((item) => (
              <div 
                key={item.id} 
                className="bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-[#00a499]/60 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://www.edumin.pe/assets/images/empresas-hero.webp";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-black uppercase text-amber-300">
                      {item.category}
                    </span>

                    <span className="absolute bottom-3 right-3 text-[10px] font-extrabold text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/40">
                      70% Subvención RECCIP
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#00e676] block">🎯 Objetivo Académico:</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">{item.objetivo}</p>
                      </div>

                      <div className="text-[11px] space-y-1">
                        <p className="text-slate-400"><strong className="text-slate-200">👥 Dirigido a:</strong> {item.dirigido}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectDiplomadoForCheckout(item.title);
                    }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#00a499] to-[#00897b] hover:from-[#00897b] hover:to-[#00796b] text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 cursor-pointer shadow-lg transition-all active:scale-95"
                  >
                    <span>MATRICULARME EN ESTE DIPLOMADO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDiplomados.length === 0 && (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="font-bold text-slate-300">No se encontraron diplomados con esa búsqueda</p>
              <p className="text-xs text-slate-500">Prueba ajustando el texto de búsqueda o seleccionando "Todas las Áreas".</p>
            </div>
          )}
        </div>

        {/* Modal Footer Notice */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-400 shrink-0 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Todos incluyen Certificación CIP & Bolsa de Trabajo
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold cursor-pointer"
          >
            Cerrar Catálogo
          </button>
        </div>

      </div>
    </div>
  );
}
