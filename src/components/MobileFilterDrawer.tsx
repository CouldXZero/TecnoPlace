import React from 'react';
import { SlidersHorizontal, X, RotateCcw, Flame, Check } from 'lucide-react';
import { FilterState } from '../types';
import { CATEGORIES } from '../data/mockProducts';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableBrands: string[];
  totalResultsCount: number;
  onResetFilters: () => void;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  availableBrands,
  totalResultsCount,
  onResetFilters
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/50 backdrop-blur-xs flex flex-col justify-end animate-in fade-in">
      <div className="bg-white rounded-t-3xl border-t border-slate-200 max-h-[85vh] overflow-y-auto flex flex-col justify-between shadow-2xl pb-safe">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <span>Filtros TecnoPlace</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetFilters}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Form Body */}
        <div className="p-5 space-y-5 text-xs text-slate-800">
          
          {/* Categories Horizontal Pills */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Categoría
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              <button
                onClick={() => onFilterChange({ ...filters, category: 'all' })}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  filters.category === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                Todas las categorías
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange({ ...filters, category: cat.id })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    filters.category === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Selector */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Marca
            </label>
            <select
              value={filters.brand}
              onChange={(e) => onFilterChange({ ...filters, brand: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 px-3 py-2.5 rounded-xl font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">Todas las Marcas</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Precio Máximo</span>
              <span className="font-black text-blue-600 text-sm">${filters.maxPrice} USD</span>
            </div>
            <input
              type="range"
              min={100}
              max={5000}
              step={50}
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-3 text-slate-800 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.onSaleOnly}
                onChange={(e) => onFilterChange({ ...filters, onSaleOnly: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0"
              />
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Solo Ofertas / Descuentos</span>
              </span>
            </label>

            <label className="flex items-center gap-3 text-slate-800 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0"
              />
              <span>Solo Productos en Stock</span>
            </label>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Calificación Mínima
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 4.0, 4.5, 4.8].map((rating) => (
                <button
                  key={rating}
                  onClick={() => onFilterChange({ ...filters, minRating: rating })}
                  className={`py-2 rounded-xl border text-center font-bold transition-all ${
                    filters.minRating === rating
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {rating === 0 ? 'Todos' : `${rating}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Ordenar Resultados por:
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 px-3 py-2.5 rounded-xl font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="featured">Destacados TecnoPlace</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Calificados</option>
              <option value="newest">Lanzamientos 2026</option>
            </select>
          </div>

        </div>

        {/* Footer Submit Button */}
        <div className="p-4 bg-white border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md shadow-blue-200 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Ver {totalResultsCount} {totalResultsCount === 1 ? 'Producto' : 'Productos'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
