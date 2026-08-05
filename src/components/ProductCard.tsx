import React from 'react';
import { Star, ShoppingCart, Eye, Zap, Flame } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../data/mockCoupons';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white border border-slate-200 hover:border-blue-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative">
      
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {product.isDeal && (
          <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Flame className="w-3 h-3 fill-slate-950" />
            <span>-{discountPercent}% DCTO</span>
          </span>
        )}
        {product.bestSeller && (
          <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
            ⭐ Más Vendido
          </span>
        )}
        {product.isNew && (
          <span className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
            🆕 Lanzamiento 2026
          </span>
        )}
      </div>

      {/* Product Image & Quick View Hover */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative h-52 bg-slate-50 border-b border-slate-100 overflow-hidden cursor-pointer flex items-center justify-center p-4"
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all border border-slate-200">
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Vista Rápida</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold text-blue-600 uppercase tracking-wider text-[11px]">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800">{product.rating}</span>
              <span className="text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          {product.subtitle && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product.subtitle}</p>
          )}
        </div>

        {/* Stock & Warranty Tag */}
        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
          <span className={`font-semibold flex items-center gap-1 ${product.stock > 5 ? 'text-emerald-600' : 'text-amber-600'}`}>
            <Zap className="w-3 h-3" />
            {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
          </span>
          <span className="text-slate-400 truncate max-w-[120px]">{product.warranty.split(' ')[0]} garantía</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-1 flex items-center justify-between gap-2">
          <div>
            <div className="text-lg font-black text-slate-900">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              product.stock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>

      </div>
    </div>
  );
};
