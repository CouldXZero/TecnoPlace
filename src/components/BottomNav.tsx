import React from 'react';
import {
  Store,
  SlidersHorizontal,
  Sparkles,
  ShoppingCart,
  PackageCheck,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { AppMode } from '../types';

interface BottomNavProps {
  appMode: AppMode;
  onSetAppMode: (mode: AppMode) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAIBot: () => void;
  onOpenWeeklyDeals: () => void;
  onOpenMobileFilters: () => void;
  onGoHome: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  appMode,
  onSetAppMode,
  cartCount,
  onOpenCart,
  onOpenAIBot,
  onOpenWeeklyDeals,
  onOpenMobileFilters,
  onGoHome
}) => {
  return (
    <nav 
      aria-label="Navegación Móvil" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1.5 shadow-lg flex justify-around items-center text-[10px] pb-safe"
    >
      {/* Home / Store */}
      <button
        onClick={onGoHome}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl min-w-[52px] transition-all active:scale-90 ${
          appMode === 'store' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <Store className="w-5 h-5" />
        <span>Tienda</span>
      </button>

      {/* Weekly Deals */}
      <button
        onClick={onOpenWeeklyDeals}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl min-w-[52px] text-amber-600 hover:text-amber-700 font-bold transition-all active:scale-90"
      >
        <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
        <span>Ofertas</span>
      </button>

      {/* AI Bot */}
      <button
        onClick={onOpenAIBot}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl min-w-[52px] text-slate-700 hover:text-blue-600 font-bold transition-all active:scale-90"
      >
        <div className="w-6 h-6 rounded-lg bg-blue-600 text-amber-300 flex items-center justify-center shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span>TecnoBot</span>
      </button>

      {/* Cart */}
      <button
        onClick={onOpenCart}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl min-w-[52px] text-slate-500 hover:text-slate-800 font-medium relative transition-all active:scale-90"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs ring-2 ring-white">
              {cartCount}
            </span>
          )}
        </div>
        <span>Carrito</span>
      </button>

      {/* Orders */}
      <button
        onClick={() => onSetAppMode('orders')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl min-w-[52px] transition-all active:scale-90 ${
          appMode === 'orders' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <PackageCheck className="w-5 h-5" />
        <span>Pedidos</span>
      </button>

      {/* Admin Panel Toggle */}
      <button
        onClick={() => onSetAppMode(appMode === 'admin' ? 'store' : 'admin')}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl min-w-[48px] transition-all active:scale-90 ${
          appMode === 'admin' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-700 font-medium'
        }`}
      >
        <ShieldCheck className="w-5 h-5" />
        <span>Admin</span>
      </button>
    </nav>
  );
};
