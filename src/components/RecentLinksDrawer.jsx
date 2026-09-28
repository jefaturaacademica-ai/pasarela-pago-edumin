import React from 'react';
import { X, History, Copy, Send, ExternalLink, Check, DollarSign, User, Calendar } from 'lucide-react';

export default function RecentLinksDrawer({ 
  isOpen, 
  onClose, 
  links, 
  onPreviewStudentCheckout 
}) {
  const [copiedId, setCopiedId] = React.useState(null);

  if (!isOpen) return null;

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsApp = (link) => {
    const cleanPhone = link.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 9 ? `51${cleanPhone}` : cleanPhone;
    const message = `Hola *${link.clientName}*, te comparto nuevamente tu link de pago oficial de *EDUMIN* para el *${link.packageName}* (S/ ${link.amount}.00):\n\n👉 ${link.url}`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#030d29]/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#061845] border-l border-blue-800 text-white h-full flex flex-col justify-between shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center">
              <History className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider text-white">Histórico de Links Generados</h3>
              <p className="text-[11px] text-slate-400">{links.length} links en esta sesión</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {links.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <History className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold">Aún no has generado ningún link de pago.</p>
              <p className="text-[11px] text-slate-500">Haz clic en "GENERAR LINK" en cualquier paquete para comenzar.</p>
            </div>
          ) : (
            links.map((link) => (
              <div 
                key={link.id}
                className="p-4 rounded-2xl bg-[#030e2e] border border-blue-800/70 hover:border-blue-500/80 transition-all space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-yellow-400">{link.id}</span>
                  <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{link.createdAt}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-white text-sm flex items-center justify-between">
                    <span>{link.clientName}</span>
                    <span className="font-mono font-extrabold text-emerald-300">S/ {link.amount}.00</span>
                  </p>
                  <p className="text-[11px] text-blue-300 font-medium">{link.packageName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">📱 {link.phone} | ✉️ {link.email}</p>
                </div>

                {/* Quick Action Buttons */}
                <div className="pt-2 flex items-center space-x-2 border-t border-blue-900/60">
                  <button
                    onClick={() => handleCopy(link)}
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold flex items-center justify-center space-x-1 border border-slate-700 cursor-pointer"
                  >
                    {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                    <span>{copiedId === link.id ? '¡Copiado!' : 'Copiar'}</span>
                  </button>

                  <button
                    onClick={() => handleWhatsApp(link)}
                    className="flex-1 py-1.5 px-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onPreviewStudentCheckout(link);
                    }}
                    className="p-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded-lg cursor-pointer"
                    title="Probar vista del estudiante"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-blue-900/80 text-center">
          <p className="text-[11px] text-slate-400">Todos los links generados quedan activos para cobro inmediato.</p>
        </div>

      </div>
    </div>
  );
}
