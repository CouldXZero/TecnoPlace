import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Cpu, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextProduct?: Product | null;
  onSelectProductToView?: (productId: string) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  contextProduct,
  onSelectProductToView
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: contextProduct
        ? `¡Hola! Soy TecnoBot 🤖. Veo que estás consultando el **${contextProduct.name}** ($${contextProduct.price} USD). ¿Quieres saber si es compatible con tus programas/juegos o ver alternativas?`
        : '¡Hola! Soy TecnoBot 🤖, tu Asesor de Inteligencia Artificial para TecnoPlace. ¿Buscas recomendaciones de laptops, PCs para gaming, smartphones o componentes? ¡Dime tu presupuesto y uso!'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          productContext: contextProduct || null,
          history: messages.slice(-6)
        })
      });

      const data = await response.json();
      if (data && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: '🤖 TecnoBot: ¡Hola! Puedo darte recomendaciones sobre Laptops Gamer, Smartphones, Componentes PC y Ofertas de la semana. ¿Qué te gustaría consultar?' }
        ]);
      }
    } catch (err) {
      console.error(err);
      // Smart offline / fallback message
      const query = textToSend.toLowerCase();
      let fallbackMsg = '🤖 TecnoBot: ¡Hola! Puedo sugerirte las mejores opciones en Laptops, Smartphones, Componentes o Métodos de Pago. ¿Qué producto estás buscando?';
      if (query.includes('laptop') || query.includes('portatil') || query.includes('gaming')) {
        fallbackMsg = '💻 TecnoBot: Te sugerimos laptops con procesador Intel i7 / Ryzen 7 y tarjeta gráfica RTX 4060 en adelante para la mejor experiencia. ¡Revisa la sección de Laptops!';
      } else if (query.includes('precio') && contextProduct) {
        fallbackMsg = `💰 TecnoBot: El **${contextProduct.name}** tiene un precio de **$${contextProduct.price} USD** con garantía oficial.`;
      }
      setMessages((prev) => [...prev, { role: 'assistant', text: fallbackMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetPrompts = [
    '💻 Recomienda laptop para programación y gaming ($1200)',
    '📱 ¿Cuál tiene mejor cámara entre S24 Ultra y iPhone 15 Pro?',
    '🎮 ¿Qué fuente de poder necesita la RTX 4090?',
    '⚡ ¿Qué ofertas activas hay esta semana?'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 text-slate-900 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>TecnoBot IA</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-200 uppercase">
                    Gemini 3.6
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">Asesor Experto en Compras y Especificaciones</p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 rounded-full bg-slate-100 hover:bg-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Banner */}
          {contextProduct && (
            <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between text-xs text-blue-900 font-medium">
              <span className="truncate">Analizando: <strong>{contextProduct.name}</strong></span>
              <span className="font-bold text-blue-700">${contextProduct.price}</span>
            </div>
          )}

          {/* Chat History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-wrap shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-slate-700" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-600 text-xs bg-white p-3 rounded-2xl border border-slate-200 w-fit shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>TecnoBot está analizando especificaciones y componentes...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preset Chips */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Preguntas sugeridas:</div>
            <div className="flex flex-wrap gap-1.5">
              {presetPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] px-2.5 py-1 rounded-xl border border-slate-200 transition-colors text-left truncate max-w-full font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu consulta a TecnoBot..."
                className="flex-1 bg-slate-50 border border-slate-200 text-xs text-slate-800 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 placeholder-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl shadow-xs transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
