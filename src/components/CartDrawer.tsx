import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, Tag, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { formatPrice, MOCK_COUPONS } from '../data/mockCoupons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  appliedCoupon,
  onApplyCoupon,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const shippingCost = subtotal > 150 || (appliedCoupon && appliedCoupon.code === 'ENVIOFREE') ? 0 : 15;
  const tax = Math.round((subtotal - discountAmount) * 0.16);
  const total = Math.max(0, subtotal - discountAmount + shippingCost + tax);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const codeUpper = couponInput.trim().toUpperCase();
    const found = MOCK_COUPONS.find((c) => c.code === codeUpper);

    if (!found) {
      setCouponError('Cupón no válido. Prueba con TECNO10 o VERANO2026');
      return;
    }

    if (subtotal < found.minPurchase) {
      setCouponError(`Este cupón requiere una compra mínima de $${found.minPurchase} USD`);
      return;
    }

    onApplyCoupon(found);
    setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 text-slate-900 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-base text-slate-900">Carrito de Compras</h3>
              <span className="bg-blue-600 text-white font-bold text-xs px-2 py-0.5 rounded-full">
                {cartItems.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>

            <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 rounded-full bg-slate-100 hover:bg-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Tu carrito está vacío</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Explora nuestras ofertas en laptops, consolas y smartphones para comenzar.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="max-h-full max-w-full object-contain filter drop-shadow-xs" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="font-bold text-xs text-slate-900 truncate">{item.product.name}</div>
                    <div className="text-xs text-blue-600 font-bold">
                      {formatPrice(item.product.price)}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 text-xs text-slate-600 hover:text-slate-900 font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 text-xs text-slate-600 hover:text-slate-900 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-black text-xs text-slate-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Coupon & Summary Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>Cupón <strong>{appliedCoupon.code}</strong> aplicado</span>
                    </div>
                    <button
                      onClick={() => onApplyCoupon(null)}
                      className="text-emerald-700 hover:text-emerald-900 font-bold underline"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cupón (ej: TECNO10, VERANO2026)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 text-xs text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="text-xs space-y-1.5 pt-2 border-t border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="text-slate-900 font-medium">{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Descuento ({appliedCoupon.code}):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Envío Express:</span>
                  <span className="text-slate-900 font-medium">
                    {shippingCost === 0 ? <strong className="text-emerald-600">¡GRATIS!</strong> : formatPrice(shippingCost)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Impuestos estimados (IVA):</span>
                  <span className="text-slate-900 font-medium">{formatPrice(tax)}</span>
                </div>

                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>TOTAL:</span>
                  <span className="text-blue-600 text-base">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-200 flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceder al Pago</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
