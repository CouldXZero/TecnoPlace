import { Coupon } from '../types';

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'TECNO10',
    discountType: 'percent',
    value: 10,
    minPurchase: 100,
    description: '10% de descuento en tu compra superior a $100'
  },
  {
    code: 'VERANO2026',
    discountType: 'fixed',
    value: 50,
    minPurchase: 300,
    description: '$50 de descuento directo en compras mayores a $300'
  },
  {
    code: 'ENVIOFREE',
    discountType: 'fixed',
    value: 15,
    minPurchase: 50,
    description: 'Descuento equivalente al costo de envío estándar'
  },
  {
    code: 'VIPTECNO',
    discountType: 'percent',
    value: 15,
    minPurchase: 500,
    description: '15% de descuento especial para clientes VIP en compras superiores a $500'
  }
];

export const formatPrice = (priceInUSD: number): string => {
  return `$${priceInUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} USD`;
};

