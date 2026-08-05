import React, { useState } from 'react';
import { Smartphone, X, Wifi, Battery, Signal, Apple } from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  isMobilePreview,
  onToggleMobilePreview
}) => {
  const [deviceOS, setDeviceOS] = useState<'android' | 'ios'>('ios');

  if (!isMobilePreview) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 py-6 px-2 flex flex-col items-center justify-center relative overflow-x-hidden">
      
      {/* Top Controller Bar */}
      <div className="mb-4 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200 shadow-xl max-w-xl w-full">
        <div className="flex items-center gap-2 font-bold text-emerald-400">
          <Smartphone className="w-4 h-4" />
          <span>Simulador TecnoPlace App Móvil</span>
        </div>

        {/* OS Toggle Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceOS('ios')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              deviceOS === 'ios'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iOS (iPhone)</span>
          </button>
          <button
            onClick={() => setDeviceOS('android')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              deviceOS === 'android'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
            <span>Android</span>
          </button>
        </div>

        <button
          onClick={onToggleMobilePreview}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1 border border-slate-700"
        >
          <X className="w-3.5 h-3.5" />
          <span>Salir</span>
        </button>
      </div>

      {/* Simulated Device Frame */}
      <div className={`w-full max-w-[412px] h-[840px] bg-slate-900 border-[12px] ${
        deviceOS === 'ios' ? 'border-slate-800 rounded-[52px]' : 'border-slate-800 rounded-[36px]'
      } shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-slate-700/50`}>
        
        {/* Status Bar */}
        <div className="bg-slate-900 text-slate-300 text-[10px] px-6 py-2.5 flex items-center justify-between select-none border-b border-slate-800/80 z-50 shrink-0">
          <span className="font-bold">09:41</span>

          {/* iOS Dynamic Island vs Android Camera Punch Hole */}
          {deviceOS === 'ios' ? (
            <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto border border-slate-800 flex items-center justify-end px-2">
              <div className="w-2 h-2 rounded-full bg-slate-900" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 bg-slate-950 rounded-full border border-slate-800 mx-auto" />
          )}

          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Device Content Screen */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] text-slate-900 relative">
          {children}
        </div>

        {/* Bottom Navigation Indicator Bar */}
        {deviceOS === 'ios' ? (
          <div className="bg-white py-2 flex justify-center border-t border-slate-200 z-50 shrink-0">
            <div className="w-32 h-1 bg-slate-400 rounded-full" />
          </div>
        ) : (
          <div className="bg-slate-900 py-1.5 px-12 flex justify-around items-center border-t border-slate-800 z-50 shrink-0 text-slate-400">
            <div className="w-3 h-3 border-2 border-slate-400 rotate-45 rounded-xs" />
            <div className="w-3.5 h-3.5 border-2 border-slate-400 rounded-full" />
            <div className="w-3 h-3 bg-slate-400 rounded-xs" />
          </div>
        )}

      </div>
    </div>
  );
};

