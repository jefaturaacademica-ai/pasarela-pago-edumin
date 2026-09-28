import React, { useState } from 'react';
import { Calculator, DollarSign, Clock, Users, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

export default function CalculatorSection({ onOpenRegister }) {
  const [students, setStudents] = useState(450);
  const [fee, setFee] = useState(480);

  // Calculations
  const monthlyTotal = students * fee;
  const yearlyTotal = monthlyTotal * 10; // 10 pensiones al año
  const hoursSavedPerMonth = Math.round(students * 0.15); // ~9 minutos ahorrados por alumno en voucher manual
  const traditionalCommission = monthlyTotal * 0.038; // ~3.8% pasarelas tradicionales
  const eduminCommission = monthlyTotal * 0.019; // ~1.9% tasa preferencial edumin
  const monthlySavings = traditionalCommission - eduminCommission;

  return (
    <section id="calculator" className="py-24 bg-slate-950 relative overflow-hidden border-t border-b border-slate-800">
      
      {/* Background Lighting */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador de Ahorro e Impacto</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Calcula cuánto tiempo y dinero ahorra <br />
            <span className="gradient-text">tu institución con EDUMIN Pay.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Mueve los deslizadores para ver la proyección de recaudo y ahorro operativo estimado.
          </p>
        </div>

        {/* Main Grid: Controls + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Column */}
          <div className="lg:col-span-6 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-8 flex flex-col justify-between">
            
            <div className="space-y-6">
              
              {/* Slider 1: Number of Students */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Número de Alumnos Matriculados:</span>
                  </label>
                  <span className="text-xl font-extrabold text-blue-400 font-mono bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20">
                    {students.toLocaleString()} alumnos
                  </span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="3000" 
                  step="25"
                  value={students}
                  onChange={(e) => setStudents(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>50 alumnos</span>
                  <span>1,500</span>
                  <span>3,000 alumnos</span>
                </div>
              </div>

              {/* Slider 2: Monthly Fee */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-teal-400" />
                    <span>Pensión Promedio Mensual:</span>
                  </label>
                  <span className="text-xl font-extrabold text-teal-300 font-mono bg-teal-500/10 px-3 py-1 rounded-xl border border-teal-500/20">
                    S/ {fee.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="150" 
                  max="2500" 
                  step="25"
                  value={fee}
                  onChange={(e) => setFee(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>S/ 150</span>
                  <span>S/ 1,200</span>
                  <span>S/ 2,500</span>
                </div>
              </div>

            </div>

            {/* Micro Badge */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-3 text-xs text-slate-400">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                Instituciones con más de 1,000 alumnos acceden automáticamente a la <strong className="text-white">Tasa Preferencial Corporativa</strong>.
              </span>
            </div>

          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-6 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-blue-950/60 p-6 sm:p-8 rounded-3xl border border-indigo-500/30 flex flex-col justify-between space-y-6 shadow-2xl relative">
            
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider border-b border-indigo-800/50 pb-3 flex items-center justify-between">
                <span>Resultados Estimados</span>
                <span className="text-xs font-normal text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  Cálculo en vivo
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Monthly Collection */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400">Recaudación Mensual</p>
                  <p className="text-2xl font-extrabold text-white font-mono mt-1">
                    S/ {monthlyTotal.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">S/ {yearlyTotal.toLocaleString()} al año</p>
                </div>

                {/* Time Saved */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-400">Tiempo Ahorrado al Mes</p>
                  <p className="text-2xl font-extrabold text-teal-300 font-mono mt-1 flex items-center space-x-1">
                    <span>{hoursSavedPerMonth} Horas</span>
                    <Clock className="w-4 h-4 ml-1" />
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Cero conciliación en Excel</p>
                </div>

                {/* Monthly Financial Savings */}
                <div className="sm:col-span-2 bg-gradient-to-r from-emerald-950/60 to-slate-900 p-5 rounded-2xl border border-emerald-500/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Ahorro en Comisiones Estimado</p>
                      <p className="text-3xl font-extrabold text-emerald-300 font-mono mt-1">
                        S/ {monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm font-normal text-slate-300">/ mes</span>
                      </p>
                    </div>
                    <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                      ~50% menos comisión
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Frente a pasarelas tradicionales con cobros fijos por transacción.
                  </p>
                </div>

              </div>

            </div>

            {/* CTA Button */}
            <button
              onClick={onOpenRegister}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Solicitar Propuesta para {students} Alumnos</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
