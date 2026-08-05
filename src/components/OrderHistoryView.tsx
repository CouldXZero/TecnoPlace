import React from 'react';
import { PackageCheck, Clock, Download, ArrowLeft, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../data/mockCoupons';
import { generateOrderPDF } from '../services/pdfGenerator';

interface OrderHistoryViewProps {
  orders: Order[];
  onBackToStore: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  orders,
  onBackToStore
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-slate-900 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Tienda</span>
          </button>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-blue-600" />
            <span>Mis Pedidos y Historial de Compras</span>
          </h1>
        </div>

        <span className="bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1 rounded-full border border-blue-200">
          {orders.length} {orders.length === 1 ? 'Pedido Registrado' : 'Pedidos Registrados'}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3 shadow-xs">
          <PackageCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900">Aún no has realizado pedidos</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explora nuestro catálogo tecnológico y realiza tu primera orden para ver aquí el seguimiento en tiempo real.
          </p>
          <button
            onClick={onBackToStore}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
          >
            Explorar Productos
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              
              {/* Order Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                <div>
                  <div className="font-bold text-base text-slate-900">ORDEN #{ord.id}</div>
                  <div className="text-slate-500">Fecha de compra: {ord.date} | Seguimiento: <strong className="text-blue-600">{ord.trackingCode}</strong></div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                    ord.status === 'delivered'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {ord.status === 'delivered' ? '✓ Entregado' : '⚡ En Proceso / Tránsito'}
                  </span>

                  <button
                    onClick={() => generateOrderPDF(ord)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5"
                    title="Descargar Factura PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Factura PDF</span>
                  </button>
                </div>
              </div>

              {/* Order Tracking Timeline */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">Línea de Tiempo de Rastreo:</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] mb-1">✓</div>
                    <span className="font-bold text-slate-900 text-[11px]">Procesado</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] mb-1 font-bold ${
                      ord.status === 'shipped' || ord.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white animate-pulse'
                    }`}>
                      {ord.status === 'delivered' ? '✓' : '⚡'}
                    </div>
                    <span className="font-bold text-slate-800 text-[11px]">En Tránsito</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] mb-1 font-bold ${
                      ord.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {ord.status === 'delivered' ? '✓' : '3'}
                    </div>
                    <span className="font-bold text-slate-500 text-[11px]">Entrega Final</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Productos de la Orden:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {ord.items.map((item) => (
                    <div key={item.product.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                      <img src={item.product.image} alt="" className="w-10 h-10 object-contain" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 truncate">{item.product.name}</div>
                        <div className="text-slate-500">Cantidad: {item.quantity}</div>
                      </div>
                      <div className="font-bold text-blue-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address, Billing & Total */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs pt-2 border-t border-slate-100 text-slate-600 gap-2">
                <div className="space-y-0.5">
                  <div>
                    Enviado a: <strong>{ord.shippingAddress.fullName}</strong> ({ord.shippingAddress.city}, {ord.shippingAddress.country})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Facturado a:{' '}
                    <strong className="text-slate-800">
                      {ord.billingInfo?.isConsumidorFinal
                        ? 'Consumidor Final (9999999999)'
                        : `${ord.billingInfo?.name || ord.shippingAddress.fullName} (${ord.billingInfo?.taxIdType || 'ID'}: ${ord.billingInfo?.taxId})`}
                    </strong>
                  </div>
                </div>
                <div className="text-sm font-black text-slate-900">
                  Total Pagado: <span className="text-blue-600">{formatPrice(ord.totalAmount)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
