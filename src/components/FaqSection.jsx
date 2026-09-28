import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      question: '¿Cómo se conecta EDUMIN Pay con nuestro software o base de datos actual?',
      answer: 'EDUMIN Pay ofrece un plugin nativo para el ecosistema EDUMIN LMS y APIs REST abiertas para conectarse a cualquier software académico o ERP (SIAGIE, Moodle, Chamilo, SAP, Excel). Nuestro equipo técnico realiza la integración en un plazo máximo de 48 horas.',
    },
    {
      question: '¿En cuánto tiempo recibimos los fondos recaudados en nuestra cuenta bancaria?',
      answer: 'Las liquidaciones se realizan de forma diaria y automática directamente a la cuenta corriente o de ahorros a nombre de tu institución en el banco de tu preferencia (BCP, BBVA, Interbank, Scotiabank).',
    },
    {
      question: '¿Cómo funciona la emisión automática de Boletas o Facturas electrónicas?',
      answer: 'EDUMIN Pay está homologado con SUNAT y proveedores OSE (como Nubefact). En cuanto el apoderado realiza el pago, el sistema genera la boleta de venta electrónica, la firma digitalmente y se la envía por correo electrónico en formato PDF y XML.',
    },
    {
      question: '¿Qué opciones de pago tienen los padres de familia que prefieren pagar en efectivo?',
      answer: 'Además de Yape, Plin y tarjetas, generamos un código de pago PagoEfectivo (CIP) de 8 dígitos para que el apoderado pueda pagar en efectivo en cualquier agente BCP, BBVA, Interbank, Tambo o Kasnet a nivel nacional.',
    },
    {
      question: '¿Requiere algún tipo de contrato de permanencia mínima o penalidad?',
      answer: 'No. En EDUMIN Pay creemos en la libertad de nuestros clientes. Puedes usar la pasarela mes a mes sin ataduras contractuales ni multas por cancelación.',
    },
    {
      question: '¿Qué nivel de seguridad y encriptación cumple la pasarela?',
      answer: 'Contamos con la certificación internacional PCI-DSS Level 1 (el estándar más exigente de la industria financiera) y encriptación SSL de 256 bits para garantizar la privacidad y seguridad total de cada pago.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-slate-950 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Resuelve tus Dudas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Preguntas Frecuentes</h2>
          <p className="text-slate-400 text-sm">
            Todo lo que necesitas saber antes de afiliar tu colegio, instituto o universidad.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between space-x-4 focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white hover:text-blue-400 transition-colors">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 bg-blue-600 text-white border-blue-500' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-800/60 text-xs sm:text-sm text-slate-300 leading-relaxed animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
