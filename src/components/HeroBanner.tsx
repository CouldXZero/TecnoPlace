import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Truck, ArrowRight, Flame, Percent } from 'lucide-react';

interface HeroBannerProps {
  onExploreDeals: () => void;
  onOpenAIBot: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreDeals, onOpenAIBot }) => {
  // Flash Deal Timer Countdown
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-slate-100/70 py-6 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Hero Card */}
          <div className="lg:col-span-8 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Subtle radial glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full mb-4">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>OFERTAS FLASH DE AGOSTO 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
              La Tecnología del Futuro <br className="hidden sm:inline" />
              <span className="text-blue-400">
                al Mejor Precio Garantizado.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base mb-6 max-w-2xl leading-relaxed">
              Equipa tu setup con Laptops M3 Max, procesadores Intel Core i9 de 24 núcleos, tarjetas RTX 4090, PS5 Pro y smartphones con IA.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreDeals}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Ver Ofertas de la Semana</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Guarantees Bar */}
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-3 gap-2 sm:gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Envío Express 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Garantía Oficial 24M</span>
              </div>
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Hasta 12 MSI</span>
              </div>
            </div>
          </div>

          {/* Flash Deal Timer Widget */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative flex flex-col justify-between text-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="font-extrabold text-slate-900 text-base">Flash Deal Termina en:</span>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-200">
                -30% Dcto
              </span>
            </div>

            {/* Countdown timer numbers */}
            <div className="grid grid-cols-3 gap-2 my-2 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-2xl font-black text-slate-900">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="block text-[10px] text-slate-500 uppercase font-bold">Horas</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-2xl font-black text-slate-900">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="block text-[10px] text-slate-500 uppercase font-bold">Minutos</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-2xl font-black text-slate-900">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="block text-[10px] text-slate-500 uppercase font-bold">Segundos</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900">🔥 Cupón Especial Activo:</div>
              <div className="flex items-center justify-between font-mono bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-blue-700 font-bold">
                <span>VERANO2026</span>
                <span className="text-[10px] text-slate-500 font-sans font-medium">-$50 USD</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
