import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Sparkles,
  Smartphone,
  ShieldCheck,
  User,
  SlidersHorizontal,
  ChevronDown,
  Menu,
  X,
  PackageCheck,
  Cpu,
  Laptop,
  Headphones,
  Gamepad2,
  Watch,
  Home as HomeIcon,
  Zap,
  Lock,
  HelpCircle,
  Bot,
  FileText,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { AppMode } from '../types';
import { CATEGORIES } from '../data/mockProducts';
import { HelpModal, HelpTabType } from './HelpModal';

interface HeaderProps {
  currentCategory: string;
  onSelectCategory: (catId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  appMode: AppMode;
  onSetAppMode: (mode: AppMode) => void;
  onOpenCart: () => void;
  onOpenAIBot: () => void;
  onOpenWeeklyDeals: () => void;
  isMobilePreview: boolean;
  onToggleMobilePreview: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  appMode,
  onSetAppMode,
  onOpenCart,
  onOpenAIBot,
  onOpenWeeklyDeals,
  isMobilePreview,
  onToggleMobilePreview
}) => {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [selectedHelpTab, setSelectedHelpTab] = useState<HelpTabType>('centro-ayuda');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4" />;
      case 'Gamepad2': return <Gamepad2 className="w-4 h-4" />;
      case 'Headphones': return <Headphones className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'Home': return <HomeIcon className="w-4 h-4" />;
      case 'Watch': return <Watch className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white text-slate-800 shadow-sm border-b border-slate-200">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div 
              onClick={() => {
                onSelectCategory('all');
                onSetAppMode('store');
              }}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="flex items-center justify-center group-hover:scale-105 transition-transform">
                <img 
                  src="https://iili.io/CU4EPLB.png" 
                  alt="TecnoPlace Logo" 
                  className="h-10 w-auto max-w-[44px] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Tecno<span className="text-blue-600">Place</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase -mt-1">
                  El mundo de la tecnología en sus manos
                </span>
              </div>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="hidden lg:flex items-center gap-2 relative">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Categorías</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryMenuOpen && (
              <div 
                className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    setIsCategoryMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                    currentCategory === 'all' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Todos los Productos</span>
                </button>
                <div className="my-1 border-t border-slate-100" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setIsCategoryMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                      currentCategory === cat.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(cat.iconName)}
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Universal Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar laptops M3, RTX 4090, PS5 Pro, iPhone 15..."
                className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder-slate-400 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Help Button Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                title="Centro de Ayuda, Seguridad, TecnoBot IA y Políticas"
              >
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Ayuda</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isHelpMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Help Options Dropdown */}
              {isHelpMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 text-slate-800"
                  onMouseLeave={() => setIsHelpMenuOpen(false)}
                >
                  <div className="px-3.5 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Opciones de Ayuda TecnoPlace
                    </span>
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  </div>

                  {/* 1. Centro de Ayuda */}
                  <button
                    onClick={() => {
                      setSelectedHelpTab('centro-ayuda');
                      setIsHelpModalOpen(true);
                      setIsHelpMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Headphones className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Centro de Ayuda</span>
                  </button>

                  {/* 2. Control de Seguridad */}
                  <button
                    onClick={() => {
                      setSelectedHelpTab('control-seguridad');
                      setIsHelpModalOpen(true);
                      setIsHelpMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Control de Seguridad</span>
                  </button>

                  {/* 3. Chatea con Asesoria IA TecnoBot */}
                  <button
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      onOpenAIBot();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-between my-1 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bot className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
                      <span>Chatea con Asesoría IA TecnoBot</span>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  </button>

                  {/* 4. Protección de Compras TecnoPlace */}
                  <button
                    onClick={() => {
                      setSelectedHelpTab('proteccion-compras');
                      setIsHelpModalOpen(true);
                      setIsHelpMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Protección de Compras TecnoPlace</span>
                  </button>

                  {/* 5. Política de Privacidad */}
                  <button
                    onClick={() => {
                      setSelectedHelpTab('privacidad');
                      setIsHelpModalOpen(true);
                      setIsHelpMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Política de Privacidad</span>
                  </button>

                  {/* 6. Términos de Uso */}
                  <button
                    onClick={() => {
                      setSelectedHelpTab('terminos');
                      setIsHelpModalOpen(true);
                      setIsHelpMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Términos de Uso</span>
                  </button>
                </div>
              )}
            </div>

            {/* Admin Sales History Button */}
            <button
              onClick={() => onSetAppMode('admin')}
              className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 ${
                appMode === 'admin' 
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-sm' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Historial de Ventas por Fecha y Mes (Exclusivo Admin)"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="hidden xl:inline text-xs font-bold">Panel Admin</span>
            </button>

            {/* Cart Badge Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl shadow-md shadow-blue-200 font-semibold text-sm transition-all active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">Carrito</span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileNavOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-4 py-3 space-y-3">
          <div className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
            Soporte y Ayuda
          </div>
          <div className="flex">
            <button
              onClick={() => {
                setSelectedHelpTab('centro-ayuda');
                setIsHelpModalOpen(true);
                setIsMobileNavOpen(false);
              }}
              className="w-full p-2.5 rounded-lg text-xs flex items-center justify-center gap-2 border bg-white text-slate-700 border-slate-200 font-semibold"
            >
              <Headphones className="w-4 h-4 text-blue-600" />
              <span>Centro de Ayuda y Soporte</span>
            </button>
          </div>

          <div className="font-semibold text-xs text-slate-500 uppercase tracking-wider pt-2">
            Categorías TecnoPlace
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSelectCategory('all');
                setIsMobileNavOpen(false);
              }}
              className={`p-2 rounded-lg text-xs flex items-center gap-2 border ${
                currentCategory === 'all' ? 'bg-blue-600 text-white font-bold border-blue-600' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Todos</span>
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setIsMobileNavOpen(false);
                }}
                className={`p-2 rounded-lg text-xs flex items-center gap-2 border ${
                  currentCategory === cat.id ? 'bg-blue-600 text-white font-bold border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {getCategoryIcon(cat.iconName)}
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help Modal Component */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        initialTab={selectedHelpTab}
        onOpenAIBot={onOpenAIBot}
      />
    </header>
  );
};
