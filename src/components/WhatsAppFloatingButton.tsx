import React, { useState } from 'react';
import { MessageCircle, X, Send, MapPin, CheckCircle2, ExternalLink } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  storeAddress?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phoneNumber = '+593994146964',
  storeAddress = 'Av. Tecnológica 2026, Torre TecnoPlace'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');

  const prefilledMessages = [
    '👋 ¡Hola TecnoPlace! Deseo consultar sobre disponibilidad de laptops.',
    '⚡ ¿Tienen envío gratis con el cupón ENVIOFREE hoy?',
    '📍 ¿En qué horario atiende la tienda física en la Av. Tecnológica?',
    '🛡️ Necesito asistencia con la garantía de una compra.'
  ];

  const handleSendWhatsApp = (textToSend?: string) => {
    const text = encodeURIComponent(textToSend || customText || '¡Hola TecnoPlace! Deseo información.');
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* WhatsApp Quick Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 text-slate-800">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold shadow-md">
                  <MessageCircle className="w-6 h-6 fill-emerald-600 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>WhatsApp TecnoPlace</span>
                  <span className="bg-emerald-700 text-emerald-100 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">OFICIAL</span>
                </h3>
                <p className="text-xs text-emerald-100 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>En línea - Responde en minutos</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content */}
          <div className="p-4 space-y-3 bg-slate-50 text-xs">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xl/5 space-y-1">
              <div className="text-slate-500 font-semibold text-[11px] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Tienda Física TecnoPlace:</span>
              </div>
              <div className="font-bold text-slate-800 text-[11px]">{storeAddress}</div>
            </div>

            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
              ¿En qué podemos ayudarte?
            </div>

            <div className="space-y-1.5">
              {prefilledMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => handleSendWhatsApp(msg)}
                  className="w-full text-left bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-slate-700 hover:text-emerald-900 p-2.5 rounded-xl transition-all flex items-center justify-between group text-xs font-medium cursor-pointer"
                >
                  <span className="pr-2">{msg}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                </button>
              ))}
            </div>

            {/* Custom message input */}
            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendWhatsApp()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => handleSendWhatsApp()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold flex items-center justify-center transition-colors cursor-pointer"
                  title="Enviar por WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-white/20"
        title="Contactar por WhatsApp TecnoPlace"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-emerald-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-emerald-500 rounded-full"></span>
        </div>
        <span className="hidden sm:inline font-extrabold text-xs tracking-wide">
          Escríbenos por WhatsApp
        </span>
      </button>
    </div>
  );
};
