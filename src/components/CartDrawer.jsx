import React from 'react';
import { X, ShoppingCart, Trash2, ArrowRight, ShieldCheck, Lock, CreditCard } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onClearCart, 
  onProceedToIzipayCheckout 
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const total = subtotal;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white border-l border-slate-200 text-slate-900 h-full flex flex-col justify-between shadow-2xl p-6 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-wider text-slate-900">Carrito de Compras</h3>
              <p className="text-xs text-slate-500">{cartItems.length} programa(s) en tu carrito</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">Tu carrito de compras está vacío.</p>
              <p className="text-xs text-slate-400">Selecciona un programa de especialización o curso para continuar con el pago.</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="space-y-1 pr-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase">
                    Subvencionado 70%
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
                  <p className="text-slate-500 text-[11px] font-mono">ID: {item.id || 'EDUMIN-PROG'}</p>
                </div>

                <div className="text-right space-y-2 shrink-0">
                  <p className="font-mono font-black text-sm text-slate-900">S/ {item.price}.00</p>
                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Quitar</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Izipay Checkout Button */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-slate-200 space-y-4">
            
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold">S/ {subtotal}.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IGV (Incluido 18%):</span>
                <span className="font-mono text-emerald-600 font-bold">S/ {Math.round(subtotal * 0.18)}.00</span>
              </div>
              <div className="flex justify-between text-slate-900 text-base font-black pt-2 border-t border-slate-200">
                <span>Total a Pagar:</span>
                <span className="font-mono text-amber-600">S/ {total}.00</span>
              </div>
            </div>

            {/* Direct Checkout with Izipay Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToIzipayCheckout(total, cartItems);
              }}
              className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
              <span>Proceder al Checkout Izipay</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pasarela de Pagos Izipay protegida con Encriptación SSL 256-bit.</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
