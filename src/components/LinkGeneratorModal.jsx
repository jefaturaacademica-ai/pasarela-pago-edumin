import React, { useState, useEffect } from 'react';
import { 
  X, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Send, 
  User, 
  Phone, 
  Mail, 
  DollarSign, 
  Package, 
  Sparkles, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LinkGeneratorModal({ 
  isOpen, 
  onClose, 
  selectedPackage, 
  onSaveGeneratedLink,
  onPreviewStudentCheckout
}) {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    amount: 540,
    packageName: 'PROGRAMA COMPLETO',
  });

  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeLinkData, setActiveLinkData] = useState(null);

  useEffect(() => {
    if (selectedPackage) {
      setFormData({
        clientName: '',
        phone: '',
        email: '',
        amount: selectedPackage.basePrice,
        packageName: selectedPackage.title,
      });
      setGeneratedLink('');
      setActiveLinkData(null);
    }
  }, [selectedPackage]);

  if (!isOpen) return null;

  const handleGenerate = (e) => {
    e.preventDefault();
    const linkId = 'PAY-' + Math.floor(100000 + Math.random() * 900000);
    const origin = window.location.origin;
    
    // Create URL parameter string
    const query = new URLSearchParams({
      id: linkId,
      cliente: formData.clientName,
      tel: formData.phone,
      email: formData.email,
      monto: formData.amount,
      pkg: formData.packageName,
    }).toString();

    const fullUrl = `${origin}/#checkout?${query}`;
    setGeneratedLink(fullUrl);

    const linkRecord = {
      id: linkId,
      clientName: formData.clientName,
      phone: formData.phone,
      email: formData.email,
      amount: formData.amount,
      packageName: formData.packageName,
      url: fullUrl,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Generado',
    };

    setActiveLinkData(linkRecord);
    onSaveGeneratedLink(linkRecord);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    if (!formData.phone) return;
    const cleanPhone = formData.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 9 ? `51${cleanPhone}` : cleanPhone;
    
    const message = `Hola *${formData.clientName}*, te saluda tu asesor educativo de *EDUMIN* 🎓.\n\nAquí tienes tu link de pago personalizado para el *${formData.packageName}* por un monto de *S/ ${formData.amount}.00*:\n\n👉 ${generatedLink}\n\nQuedo a tu disposición para ayudarte con la activación de tu matrícula.`;
    
    const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030d29]/85 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#061845] rounded-3xl border border-blue-700 shadow-2xl p-6 sm:p-8 text-white overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center shadow-lg font-black shrink-0">
            <LinkIcon className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider text-white">Generar Link de Pago</h3>
            <p className="text-xs text-slate-300">Completa los 5 campos requeridos para el cliente</p>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          
          {/* 1. Nombre del Cliente */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
              <User className="w-3.5 h-3.5 text-yellow-400" />
              <span>1. Nombre Completo del Cliente:</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Juan Pérez Ramos"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full bg-[#030e2e] border border-blue-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 text-sm font-medium"
            />
          </div>

          {/* 2. Teléfono & 3. Correo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Número de Teléfono (WhatsApp):</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Ej. 987654321"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#030e2e] border border-blue-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>3. Correo Electrónico:</span>
              </label>
              <input
                type="email"
                required
                placeholder="juan.perez@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#030e2e] border border-blue-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>
          </div>

          {/* 4. Monto & 5. Nombre del Paquete */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Monto a Cobrar (S/):</span>
              </label>
              <input
                type="number"
                required
                min="10"
                step="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) || 0 })}
                className="w-full bg-[#030e2e] border border-blue-800 rounded-xl px-4 py-3 text-yellow-400 font-black font-mono text-base focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
                <Package className="w-3.5 h-3.5 text-purple-400" />
                <span>5. Nombre del Paquete:</span>
              </label>
              <input
                type="text"
                required
                value={formData.packageName}
                onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                className="w-full bg-[#030e2e] border border-blue-800 rounded-xl px-4 py-3 text-white font-bold text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-yellow-400/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generar Link de Pago Personalizado</span>
            </button>
          </div>

        </form>

        {/* Generated Link Result Section */}
        {generatedLink && (
          <div className="mt-6 pt-6 border-t border-blue-900/80 space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-[#030c26] border border-emerald-500/50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Link de Pago Creado Exitosamente</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">ID: {activeLinkData?.id}</span>
              </div>

              {/* URL Box */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-yellow-300 break-all select-all">
                {generatedLink}
              </div>

              {/* Action Buttons for Seller */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                
                {/* 1-Click Copy */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                    copied 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-blue-400" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Link'}</span>
                </button>

                {/* 1-Click Send WhatsApp */}
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                {/* Preview Student Checkout */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPreviewStudentCheckout(activeLinkData);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Probar Vista</span>
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
