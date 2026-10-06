import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React ErrorBoundary capturó un error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl max-w-md space-y-3 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-lg font-black text-white">Reiniciando plataforma...</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detectamos una interrupción temporal de red o memoria en tu navegador.
            </p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  try {
                    localStorage.removeItem('edumin_asesora_session');
                    localStorage.removeItem('edumin_last_student_info');
                  } catch (e) {
                    console.warn('Error clearing localStorage:', e);
                  }
                  window.location.href = window.location.origin + window.location.pathname;
                }
              }}
              className="w-full py-3 bg-[#00a499] hover:bg-[#00897b] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
            >
              Refrescar Pasarela de Pago
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
