import React, { useState, useEffect } from 'react';
import {
  X,
  Flame,
  Clock,
  Calendar,
  Sparkles,
  ShoppingCart,
  Eye,
  CheckCircle2,
  ArrowRight,
  Filter,
  Zap,
  TrendingUp,
  Percent,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../data/mockCoupons';
import {
  WEEKLY_SCHEDULE,
  getTodayScheduleInfo,
  getDealsForSelectedDay,
  getTimeUntilNextMidnight,
  DayScheduleInfo,
  EnrichedDealProduct
} from '../utils/dailyDeals';

interface WeeklyDealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const WeeklyDealsModal: React.FC<WeeklyDealsModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onQuickView
}) => {
  const todaySchedule = getTodayScheduleInfo();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(todaySchedule.dayIndex);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextMidnight());

  // Timer countdown effect
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilNextMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSchedule = WEEKLY_SCHEDULE.find((s) => s.dayIndex === selectedDayIndex) || todaySchedule;
  const dealProducts = getDealsForSelectedDay(products, selectedDayIndex);

  // Filter products by selected category if not 'all'
  const filteredProducts = dealProducts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const formattedToday = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 my-auto">
        
        {/* Top Header & Countdown Banner */}
        <div className={`bg-gradient-to-r ${currentSchedule.bannerBg} text-white p-5 sm:p-7 relative overflow-hidden shrink-0`}>
          
          {/* Subtle Glow Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pr-10">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-slate-950" />
                  <span>OFERTAS DÍA A DÍA</span>
                </span>
                <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 backdrop-blur-xs">
                  <Calendar className="w-3.5 h-3.5 text-blue-300" />
                  <span className="capitalize">{formattedToday}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{currentSchedule.title}</span>
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                {currentSchedule.subtitle}
              </p>
            </div>

            {/* Countdown Box */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 text-center shrink-0 w-full lg:w-auto shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-bold mb-1.5">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>Las ofertas de hoy expiran en:</span>
              </div>
              <div className="flex items-center justify-center gap-2 font-mono text-xl sm:text-2xl font-black text-white">
                <div className="bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
                  {String(timeLeft.hours).padStart(2, '0')}
                  <span className="block text-[9px] font-sans font-semibold text-slate-400 -mt-1 uppercase">hrs</span>
                </div>
                <span className="text-amber-400">:</span>
                <div className="bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
                  {String(timeLeft.minutes).padStart(2, '0')}
                  <span className="block text-[9px] font-sans font-semibold text-slate-400 -mt-1 uppercase">min</span>
                </div>
                <span className="text-amber-400">:</span>
                <div className="bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
                  {String(timeLeft.seconds).padStart(2, '0')}
                  <span className="block text-[9px] font-sans font-semibold text-slate-400 -mt-1 uppercase">seg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Days of the Week Navigation Tabs */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-2 min-w-max">
            {WEEKLY_SCHEDULE.map((day) => {
              const isToday = day.dayIndex === todaySchedule.dayIndex;
              const isSelected = day.dayIndex === selectedDayIndex;

              return (
                <button
                  key={day.dayIndex}
                  onClick={() => setSelectedDayIndex(day.dayIndex)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  <span className="capitalize">{day.dayName}</span>
                  {isToday && (
                    <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                      Hoy
                    </span>
                  )}
                  <span className={`text-[10px] ${isSelected ? 'text-blue-100 font-normal' : 'text-slate-400'}`}>
                    {day.discountHighlight}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informational Sub-header */}
        <div className="bg-blue-50 border-b border-blue-100 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-blue-900 shrink-0 font-medium">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Rotación Diaria Automática:</strong> Cada medianoche se renuevan las ofertas seleccionadas con descuentos acumulables.
            </span>
          </div>
          <div className="text-[11px] text-blue-700 font-semibold bg-white px-2.5 py-1 rounded-lg border border-blue-200">
            {filteredProducts.length} Ofertas Activas para el {currentSchedule.dayName}
          </div>
        </div>

        {/* Main Body - Filter & Products List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Flame className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No hay ofertas en esta categoría para hoy</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Selecciona otra categoría o navega a los días de la semana arriba para explorar más promociones.
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Ver Todas las Ofertas del {currentSchedule.dayName}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-rose-600 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>-{product.dealDiscountPercent}% DCTO</span>
                    </span>

                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      Oferta del {currentSchedule.dayName}
                    </span>
                  </div>

                  {/* Product Image */}
                  <div
                    onClick={() => onQuickView(product)}
                    className="h-44 bg-slate-50 rounded-xl p-3 flex items-center justify-center cursor-pointer relative overflow-hidden mb-3 group-hover:bg-blue-50/50 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs border border-slate-200 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ver</span>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-0.5">
                        <span className="font-bold text-blue-600 uppercase tracking-wider">{product.brand}</span>
                        <span className="font-bold text-amber-600">★ {product.rating}</span>
                      </div>

                      <h4
                        onClick={() => onQuickView(product)}
                        className="font-bold text-slate-900 text-sm leading-snug hover:text-blue-600 cursor-pointer line-clamp-2"
                      >
                        {product.name}
                      </h4>
                    </div>

                    {/* Stock Urgency Meter */}
                    <div className="space-y-1 my-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span className="text-rose-600">🔥 {product.unitsSoldPercent}% vendido</span>
                        <span className="text-slate-500">Quedan {product.stock} unids.</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-rose-600 h-full rounded-full"
                          style={{ width: `${product.unitsSoldPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Price & Savings */}
                    <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
                      <div>
                        <div className="text-xs text-slate-400 line-through">
                          {formatPrice(product.dealOriginalPrice)}
                        </div>
                        <div className="text-lg font-black text-slate-900">
                          {formatPrice(product.price)}
                        </div>
                        <div className="text-[10px] font-bold text-emerald-600">
                          Ahorras {formatPrice(product.dealSavings)}
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Comprar</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Todas las ofertas incluyen 24 meses de garantía y envío rápido TecnoPlace.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
          >
            Volver a la Tienda
          </button>
        </div>

      </div>
    </div>
  );
};
