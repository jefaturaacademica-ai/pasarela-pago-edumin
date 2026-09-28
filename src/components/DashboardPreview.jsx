import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  TrendingUp, 
  DollarSign, 
  School,
  ChevronDown,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

export default function DashboardPreview() {
  const [selectedGrade, setSelectedGrade] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = [
    { id: 'REC-9082', student: 'Sofia Mendoza Prado', grade: '5° Secundaria A', concept: 'Pensión Septiembre 2026', amount: 'S/ 520.00', method: 'Yape', time: 'Hace 3 min', status: 'Pagado', invoice: 'B001-004912' },
    { id: 'REC-9081', student: 'Carlos Eduardo Benitez', grade: '3° Primaria B', concept: 'Pensión Septiembre 2026', amount: 'S/ 450.00', method: 'Visa Debit', time: 'Hace 12 min', status: 'Pagado', invoice: 'B001-004911' },
    { id: 'REC-9080', student: 'Luciana Ramos Silva', grade: '1° Secundaria C', concept: 'Cuota de Taller Deportivo', amount: 'S/ 120.00', method: 'Plin', time: 'Hace 28 min', status: 'Pagado', invoice: 'B001-004910' },
    { id: 'REC-9079', student: 'Gabriel Fernando Quispe', grade: '4° Primaria A', concept: 'Pensión Septiembre 2026', amount: 'S/ 450.00', method: 'QR BCP', time: 'Hace 45 min', status: 'Pagado', invoice: 'B001-004909' },
    { id: 'REC-9078', student: 'Mariana Gutierrez Lope', grade: '2° Secundaria B', concept: 'Pensión Septiembre 2026', amount: 'S/ 480.00', method: 'Mastercard', time: 'Hace 1 hora', status: 'En Proceso', invoice: 'Pendiente' },
    { id: 'REC-9077', student: 'Joaquín Alonso Paredes', grade: '6° Primaria A', concept: 'Pensión Septiembre 2026', amount: 'S/ 450.00', method: 'PagoEfectivo', time: 'Hace 2 horas', status: 'Pagado', invoice: 'B001-004908' },
  ];

  const filteredTransactions = transactions.filter(item => {
    const matchesSearch = item.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'Todos' || item.grade.includes(selectedGrade);
    return matchesSearch && matchesGrade;
  });

  return (
    <section id="dashboard-demo" className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <School className="w-3.5 h-3.5" />
            <span>Interfaz Inspirada en EDUMIN LMS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Panel de Control Administrativo <br />
            <span className="gradient-text">en Tiempo Real</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Controla el flujo de caja de tu institución, visualiza la morosidad al instante y exporta reportes contables con un solo clic.
          </p>
        </div>

        {/* Dashboard Interface Container */}
        <div className="glass-card rounded-3xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-950/90">
          
          {/* Top Window Navigation Bar */}
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono text-slate-400 border-l border-slate-700 pl-3">
                https://admin.edumin.pe/dashboard/pasarela-recaudo
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-semibold text-slate-300 border border-slate-700 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Mes: Septiembre 2026</span>
              </span>
              <button 
                onClick={() => alert('Exportando reporte a Excel en formato SUNAT...')}
                className="px-3 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar Excel</span>
              </button>
            </div>
          </div>

          {/* Inner Dashboard Body */}
          <div className="p-6 lg:p-8 space-y-6">
            
            {/* Top KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Recaudación Total Mes</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-mono">S/ 248,500.00</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    +12.4% <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[88%]" />
                </div>
                <p className="text-[11px] text-slate-500">88% del presupuesto cobrado</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Alumnos al Día</span>
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-mono">512 / 545</span>
                  <span className="text-xs font-bold text-blue-400">93.9%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[94%]" />
                </div>
                <p className="text-[11px] text-slate-500">Solo 33 pensiones pendientes</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Método Preferido</span>
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-purple-300 font-mono">Yape (64%)</span>
                  <span className="text-xs font-bold text-purple-400">328 Pagos</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[64%]" />
                </div>
                <p className="text-[11px] text-slate-500">Seguido por Visa (22%)</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Boletas Emitidas SUNAT</span>
                  <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-mono">512 Boletas</span>
                  <span className="text-xs font-bold text-teal-400">100% Ok</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-400 h-full w-[100%]" />
                </div>
                <p className="text-[11px] text-slate-500">Sincronizado con Nubefact / OSE</p>
              </div>

            </div>

            {/* Filter and Search Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
              
              {/* Grade Tabs */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {['Todos', 'Primaria', 'Secundaria', 'Talleres'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedGrade(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                      selectedGrade === tab
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Buscar por alumno o recibo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

            </div>

            {/* Table Container */}
            <div className="border border-slate-800 rounded-2xl overflow-x-auto bg-slate-900/50">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Recibo ID</th>
                    <th className="py-3.5 px-4">Estudiante</th>
                    <th className="py-3.5 px-4">Grado / Sección</th>
                    <th className="py-3.5 px-4">Concepto</th>
                    <th className="py-3.5 px-4">Monto</th>
                    <th className="py-3.5 px-4">Método</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Boleta SUNAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{tx.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{tx.student}</td>
                      <td className="py-3.5 px-4 text-slate-400">{tx.grade}</td>
                      <td className="py-3.5 px-4 text-slate-300">{tx.concept}</td>
                      <td className="py-3.5 px-4 font-bold font-mono text-emerald-300">{tx.amount}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300">
                          {tx.method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {tx.status === 'Pagado' ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" />
                            <span>Pagado</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-amber-400 font-bold text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                            <Clock className="w-3 h-3" />
                            <span>En Proceso</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-400">
                        {tx.invoice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
