import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  QrCode,
  Download,
  ArrowLeft,
  Lock,
  Building,
  Sparkles,
  FileText,
  UserCheck,
  UserX,
  Receipt,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { CartItem, Coupon, Order } from '../types';
import { formatPrice } from '../data/mockCoupons';
import { generateOrderPDF } from '../services/pdfGenerator';

interface CheckoutViewProps {
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  onBackToCart: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  appliedCoupon,
  onBackToCart,
  onOrderCompleted
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [shippingInfo, setShippingInfo] = useState({
    fullName: 'Alejandro Valdés',
    street: 'Av. Paseo de la Reforma #405, Apt 12B',
    city: 'Ciudad de México',
    state: 'CDMX',
    postalCode: '06500',
    country: 'México',
    phone: '+52 55 8492 1029'
  });

  // Billing & Invoice State (Consumidor Final vs Registrar Cliente)
  const [isConsumidorFinal, setIsConsumidorFinal] = useState<boolean>(true);
  const [billingData, setBillingData] = useState({
    taxIdType: 'RUC' as 'RUC' | 'CEDULA' | 'DNI' | 'PASAPORTE' | 'CF',
    taxId: '1726384920001',
    name: 'Alejandro Valdés',
    email: 'alejandro.valdes@email.com',
    phone: '+52 55 8492 1029',
    address: 'Av. Paseo de la Reforma #405, CDMX'
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'express' | 'pickup' | 'standard'>('express');
  const [paymentType, setPaymentType] = useState<'card' | 'paypal' | 'de_una_qr' | 'transfer' | 'check'>('card');

  // Payment method states (initial state BLANK)
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expDate: '',
    cvv: ''
  });

  const [paypalData, setPaypalData] = useState({
    email: '',
    accountHolder: ''
  });

  const [deUnaData, setDeUnaData] = useState({
    referenceNumber: ''
  });

  const [transferData, setTransferData] = useState({
    bankOrigin: '',
    referenceNumber: ''
  });

  const [checkData, setCheckData] = useState({
    checkNumber: '',
    bankName: '',
    checkHolder: ''
  });

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const shippingCost = deliveryMethod === 'pickup' ? 0 : deliveryMethod === 'express' ? 15 : 8;
  const tax = Math.round((subtotal - discountAmount) * 0.16);
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost + tax);

  const handlePlaceOrder = () => {
    // Fire confetti celebration
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    const billingInfo = isConsumidorFinal
      ? {
          isConsumidorFinal: true,
          taxIdType: 'CF' as const,
          taxId: '9999999999',
          name: 'Consumidor Final',
          email: billingData.email || 'consumidorfinal@tecnoplace.com',
          phone: shippingInfo.phone,
          address: `${shippingInfo.street}, ${shippingInfo.city}`
        }
      : {
          isConsumidorFinal: false,
          taxIdType: billingData.taxIdType,
          taxId: billingData.taxId || '1726384920001',
          name: billingData.name || shippingInfo.fullName,
          email: billingData.email || 'cliente@ejemplo.com',
          phone: billingData.phone || shippingInfo.phone,
          address: billingData.address || `${shippingInfo.street}, ${shippingInfo.city}`
        };

    let paymentDetails = '';
    if (paymentType === 'card') {
      paymentDetails = cardData.cardNumber
        ? `Tarjeta de Crédito/Débito (*${cardData.cardNumber.slice(-4)})`
        : 'Tarjeta de Crédito / Débito';
    } else if (paymentType === 'paypal') {
      paymentDetails = paypalData.email ? `PayPal (${paypalData.email})` : 'PayPal';
    } else if (paymentType === 'de_una_qr') {
      paymentDetails = deUnaData.referenceNumber
        ? `De una QR (Ref: ${deUnaData.referenceNumber})`
        : 'De una QR (+593 99 414 6964)';
    } else if (paymentType === 'transfer') {
      paymentDetails = transferData.referenceNumber
        ? `Transferencia ${transferData.bankOrigin ? `(${transferData.bankOrigin})` : ''} Ref: ${transferData.referenceNumber}`
        : 'Transferencia Bancaria Directa';
    } else if (paymentType === 'check') {
      paymentDetails = checkData.checkNumber
        ? `Cheque #${checkData.checkNumber} ${checkData.bankName ? `(${checkData.bankName})` : ''}`
        : 'Pago con Cheque';
    }

    const newOrder: Order = {
      id: `TP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      items: cartItems,
      totalAmount,
      discountAmount,
      shippingCost,
      tax,
      status: 'processing',
      shippingAddress: shippingInfo,
      billingInfo,
      paymentMethod: {
        type: paymentType,
        details: paymentDetails
      },
      trackingCode: `TRK-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      estimatedDelivery: '3 de Agosto de 2026 (Mañana)'
    };

    setCompletedOrder(newOrder);
    onOrderCompleted(newOrder);
    setStep(4);
  };

  if (step === 4 && completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-slate-900 animate-in fade-in">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1 rounded-full uppercase border border-blue-200">
              ¡Pedido Confirmado con Éxito!
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-3">¡Gracias por tu compra en TecnoPlace!</h1>
            <p className="text-sm text-slate-600 mt-1">
              Orden <strong>#{completedOrder.id}</strong> | Se ha enviado el comprobante a tu correo electrónico.
            </p>
          </div>

          {/* Invoice Summary Box */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <Receipt className="w-4 h-4 text-blue-600" />
                <span>Comprobante de Facturación Emitido</span>
              </span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                completedOrder.billingInfo?.isConsumidorFinal
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-blue-100 text-blue-800 border-blue-300'
              }`}>
                {completedOrder.billingInfo?.isConsumidorFinal ? 'Consumidor Final' : 'Factura Nominativa'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
              <div>
                <span className="text-slate-500">Cliente / Razón Social:</span>{' '}
                <strong className="text-slate-900">{completedOrder.billingInfo?.name || completedOrder.shippingAddress.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-500">Identificación ({completedOrder.billingInfo?.taxIdType || 'ID'}):</span>{' '}
                <strong className="text-slate-900">{completedOrder.billingInfo?.taxId || '9999999999'}</strong>
              </div>
              <div>
                <span className="text-slate-500">Email Facturación:</span>{' '}
                <strong className="text-slate-900">{completedOrder.billingInfo?.email || 'consumidorfinal@tecnoplace.com'}</strong>
              </div>
              <div>
                <span className="text-slate-500">Dirección Registrada:</span>{' '}
                <strong className="text-slate-900">{completedOrder.billingInfo?.address || completedOrder.shippingAddress.street}</strong>
              </div>
            </div>
          </div>

          {/* QR Code and Delivery Ticket Box */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-center text-left">
            <div className="space-y-2">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Código QR de Retiro y Rastreo:</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Escanea este código QR en la sucursal o con el repartidor para la entrega segura de tu paquete.
              </p>
              <div className="pt-2 text-xs text-slate-600">
                <div>Seguimiento: <strong className="text-slate-900">{completedOrder.trackingCode}</strong></div>
                <div>Estimado de entrega: <strong className="text-emerald-600">{completedOrder.estimatedDelivery}</strong></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center border border-slate-200 shadow-xs">
              <QRCodeSVG
                value={`https://tecnoplace.com/order/${completedOrder.id}?track=${completedOrder.trackingCode}`}
                size={140}
              />
              <span className="text-[10px] text-slate-800 font-bold mt-2">ORDEN #{completedOrder.id}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => generateOrderPDF(completedOrder)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-200 flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Factura PDF</span>
            </button>

            <button
              onClick={onBackToCart}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-6 py-3 rounded-xl border border-slate-200 transition-colors"
            >
              Seguir Comprando
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-slate-900">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToCart}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Carrito</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pago Seguro Encriptado SSL 256-bit</span>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        {[
          { num: 1, label: '1. Dirección de Envío' },
          { num: 2, label: '2. Método de Entrega' },
          { num: 3, label: '3. Método de Pago' }
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
              step === s.num
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : step > s.num
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            {s.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Step Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          
          {/* STEP 1: Shipping & Billing Information */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Billing Info Section - Simplificada */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-blue-600" />
                    <span>Facturación Electrónica Simplificada</span>
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Procesamiento Directo
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Comprobante emitido automáticamente a Consumidor Final sin necesidad de registro ni formularios tributarios extensos.
                </p>
              </div>

              {/* Shipping Address Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Dirección de Envío y Contacto</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Nombre Completo del Destinatario</label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Teléfono de Contacto</label>
                    <input
                      type="text"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 mb-1 font-semibold">Dirección de Calle y Número</label>
                    <input
                      type="text"
                      value={shippingInfo.street}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Ciudad / Municipio</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Código Postal</label>
                    <input
                      type="text"
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-sm transition-all"
              >
                Continuar a Método de Entrega
              </button>
            </div>
          )}

          {/* STEP 2: Delivery Method */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Selecciona el Método de Entrega</span>
              </h2>

              <div className="space-y-3 text-xs">
                <label
                  onClick={() => setDeliveryMethod('express')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    deliveryMethod === 'express'
                      ? 'bg-blue-50 border-blue-600 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-bold text-sm text-slate-900">Envío Express TecnoPlace (24 Horas)</div>
                      <div className="text-slate-500">Entrega prioritaria garantizada en puerta.</div>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-blue-600">$15 USD</span>
                </label>

                <label
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'bg-blue-50 border-blue-600 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-bold text-sm text-slate-900">Retiro Gratis en Tienda (Pick-Up)</div>
                      <div className="text-slate-500">Retira en TecnoPlace Flagship Polanco en 2 horas.</div>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-emerald-600">¡GRATIS!</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-5 rounded-xl"
                >
                  Regresar
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-sm transition-all"
                >
                  Continuar a Método de Pago
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Opciones de Pago Seguro</span>
              </h2>

              {/* 5 Payment Option Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentType('card')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentType === 'card' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Tarjeta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('paypal')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentType === 'paypal' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Paypal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('de_una_qr')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentType === 'de_una_qr' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>De una QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('transfer')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentType === 'transfer' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span>Transferencia</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('check')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentType === 'check' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>Cheque</span>
                </button>
              </div>

              {/* 1. TARJETA FORM */}
              {paymentType === 'card' && (
                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Registrar Tarjeta de Crédito / Débito</span>
                    </h3>
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md uppercase">
                      Ingreso Manual
                    </span>
                  </div>

                  {/* Virtual Card Preview */}
                  <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4 text-white">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                      <span>TecnoPlace Pay Card</span>
                      <CreditCard className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="font-mono text-lg font-bold text-white tracking-widest min-h-7">
                      {cardData.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <div>
                        <div className="text-[10px] text-slate-400">Titular de la Tarjeta</div>
                        <div className="font-bold uppercase">{cardData.cardHolder || 'NOMBRE DEL TITULAR'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Vence</div>
                        <div className="font-bold">{cardData.expDate || 'MM/AA'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Blank Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-bold mb-1">Número de Tarjeta</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardData.cardNumber}
                        maxLength={19}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Nombre del Titular</label>
                      <input
                        type="text"
                        placeholder="Ej. Alejandro Valdés"
                        value={cardData.cardHolder}
                        onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Expiración</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          maxLength={5}
                          value={cardData.expDate}
                          onChange={(e) => setCardData({ ...cardData, expDate: e.target.value })}
                          className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl font-mono text-center focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">CVV</label>
                        <input
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl font-mono text-center focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PAYPAL FORM */}
              {paymentType === 'paypal' && (
                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Añadir Cuenta de Paypal</span>
                    </h3>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md uppercase">
                      Pago Express
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Ingresa las credenciales de tu cuenta de PayPal para vincular el pago de forma directa y segura.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Correo Electrónico de Paypal</label>
                      <input
                        type="email"
                        placeholder="tu-cuenta@paypal.com"
                        value={paypalData.email}
                        onChange={(e) => setPaypalData({ ...paypalData, email: e.target.value })}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Nombre del Titular de Paypal</label>
                      <input
                        type="text"
                        placeholder="Nombre registrado en Paypal"
                        value={paypalData.accountHolder}
                        onChange={(e) => setPaypalData({ ...paypalData, accountHolder: e.target.value })}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. DE UNA QR FORM */}
              {paymentType === 'de_una_qr' && (
                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>Pago con De una QR</span>
                    </h3>
                    <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                      Muestra mi QR
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="flex flex-col items-center justify-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <QRCodeSVG
                        value={`https://deuna.app/pay?phone=593994146964&store=TecnoPlace&amount=${totalAmount}`}
                        size={150}
                      />
                      <span className="text-[10px] text-emerald-800 font-black mt-2 uppercase tracking-wide">
                        ¡MUESTRA MI QR - DE UNA!
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-700">
                      <div className="font-bold text-slate-900 text-sm">Instrucciones de Pago:</div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px]">
                        <li>Abre tu app <strong>De una</strong> o aplicación bancaria.</li>
                        <li>Escanea el código QR mostrado a la izquierda.</li>
                        <li>Verifica el número de destino: <strong className="text-emerald-700">+593 99 414 6964</strong></li>
                        <li>Ingresa abajo el número de comprobante o referencia.</li>
                      </ol>
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-slate-700 font-bold mb-1">Número de Comprobante / Referencia De una</label>
                    <input
                      type="text"
                      placeholder="Ej. 98410293"
                      value={deUnaData.referenceNumber}
                      onChange={(e) => setDeUnaData({ ...deUnaData, referenceNumber: e.target.value })}
                      className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* 4. TRANSFERENCIA FORM */}
              {paymentType === 'transfer' && (
                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span>Transferencia Bancaria Directa</span>
                    </h3>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      Datos Oficiales
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                    <div className="font-bold text-slate-900 mb-1">Cuenta Bancaria para Depósito / Transferencia:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div><strong>Banco:</strong> Banco Pichincha</div>
                      <div><strong>Tipo:</strong> Cuenta Corriente</div>
                      <div><strong>Número:</strong> 2200984146</div>
                      <div><strong>Titular:</strong> TecnoPlace Ecuador S.A.</div>
                      <div><strong>RUC:</strong> 1792837492001</div>
                      <div><strong>WhatsApp Validación:</strong> +593 99 414 6964</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Banco de Origen</label>
                      <input
                        type="text"
                        placeholder="Ej. Banco Pichincha / Guayaquil / Produbanco"
                        value={transferData.bankOrigin}
                        onChange={(e) => setTransferData({ ...transferData, bankOrigin: e.target.value })}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Número de Comprobante / Referencia</label>
                      <input
                        type="text"
                        placeholder="Ej. TRF-9812401"
                        value={transferData.referenceNumber}
                        onChange={(e) => setTransferData({ ...transferData, referenceNumber: e.target.value })}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. CHEQUE FORM */}
              {paymentType === 'check' && (
                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span>Pago con Cheque</span>
                    </h3>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      Verificación en Ventanilla
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Registra los datos del cheque para la verificación previa por parte de nuestro departamento de cobranzas.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Número de Cheque</label>
                      <input
                        type="text"
                        placeholder="Ej. 0004921"
                        value={checkData.checkNumber}
                        onChange={(e) => setCheckData({ ...checkData, checkNumber: e.target.value })}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Banco Emisor</label>
                      <input
                        type="text"
                        placeholder="Ej. Banco Pichincha"
                        value={checkData.bankName}
                        onChange={(e) => setCheckData({ ...checkData, bankName: e.target.value })}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Nombre del Titular / Girador</label>
                      <input
                        type="text"
                        placeholder="Nombre impreso en el cheque"
                        value={checkData.checkHolder}
                        onChange={(e) => setCheckData({ ...checkData, checkHolder: e.target.value })}
                        className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-5 rounded-xl cursor-pointer"
                >
                  Regresar
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3.5 px-8 rounded-xl shadow-md shadow-emerald-200 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirmar y Pagar {formatPrice(totalAmount)}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit space-y-4">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">Resumen de la Orden</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item.product.id} className="pt-2 first:pt-0 flex items-center gap-2">
                <img src={item.product.image} alt="" className="w-10 h-10 object-contain bg-slate-50 p-1 rounded-lg border border-slate-200 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 truncate">{item.product.name}</div>
                  <div className="text-slate-500">Cant: {item.quantity}</div>
                </div>
                <div className="font-bold text-blue-600">
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-xs pt-3 border-t border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="text-slate-900 font-medium">{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Descuento:</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Envío:</span>
              <span className="text-slate-900 font-medium">{formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>IVA (16%):</span>
              <span className="text-slate-900 font-medium">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>TOTAL FINAL:</span>
              <span className="text-blue-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
