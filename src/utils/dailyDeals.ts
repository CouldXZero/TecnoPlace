import { Product } from '../types';

export interface DayScheduleInfo {
  dayIndex: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  dayName: string;
  title: string;
  subtitle: string;
  categoryId: string | 'all';
  discountHighlight: string;
  bannerBg: string;
  accentColor: string;
}

export const WEEKLY_SCHEDULE: DayScheduleInfo[] = [
  {
    dayIndex: 1,
    dayName: 'Lunes',
    title: 'Lunes de Laptops & MacBooks',
    subtitle: 'Rendimiento extremo para profesionales, programadores y creativos con hasta 35% de descuento.',
    categoryId: 'laptops',
    discountHighlight: 'Hasta 35% DCTO',
    bannerBg: 'from-blue-900 via-slate-900 to-indigo-950',
    accentColor: 'text-blue-400'
  },
  {
    dayIndex: 2,
    dayName: 'Martes',
    title: 'Martes de Smartphones & Tablets',
    subtitle: 'Últimos lanzamientos de Apple, Samsung, Xiaomi e Google con cámaras IA y pantallas 120Hz.',
    categoryId: 'smartphones',
    discountHighlight: 'Hasta 40% DCTO',
    bannerBg: 'from-emerald-900 via-slate-900 to-teal-950',
    accentColor: 'text-emerald-400'
  },
  {
    dayIndex: 3,
    dayName: 'Miércoles',
    title: 'Miércoles Gamer & Consolas',
    subtitle: 'Consolas PS5 Pro, tarjetas gráficas RTX 4090, periféricos mecánicos y monitores de 240Hz.',
    categoryId: 'gaming',
    discountHighlight: 'Hasta 45% DCTO',
    bannerBg: 'from-purple-900 via-slate-900 to-violet-950',
    accentColor: 'text-purple-400'
  },
  {
    dayIndex: 4,
    dayName: 'Jueves',
    title: 'Jueves de Audio & Wearables',
    subtitle: 'Audífonos con cancelación de ruido activa, altavoces Hi-Fi y smartwatches con GPS biométrico.',
    categoryId: 'audio',
    discountHighlight: 'Hasta 30% DCTO',
    bannerBg: 'from-amber-900 via-slate-900 to-orange-950',
    accentColor: 'text-amber-400'
  },
  {
    dayIndex: 5,
    dayName: 'Viernes',
    title: 'Viernes de Componentes PC & GPUs',
    subtitle: 'Potencia pura: procesadores i9/Ryzen 9, memorias DDR5, fuentes certificadas y sistemas de refrigeración.',
    categoryId: 'pc-components',
    discountHighlight: 'Hasta 50% DCTO',
    bannerBg: 'from-rose-900 via-slate-900 to-red-950',
    accentColor: 'text-rose-400'
  },
  {
    dayIndex: 6,
    dayName: 'Sábado',
    title: 'Sábado de Smart Home & Wearables',
    subtitle: 'Domótica, iluminación LED inteligente, cámaras de seguridad 4K y accesorios para el hogar tecnológico.',
    categoryId: 'smart-home',
    discountHighlight: 'Hasta 35% DCTO',
    bannerBg: 'from-cyan-900 via-slate-900 to-blue-950',
    accentColor: 'text-cyan-400'
  },
  {
    dayIndex: 0,
    dayName: 'Domingo',
    title: 'Domingo de Mega Ofertas Tech',
    subtitle: 'Cierre de semana especial con las mejores ofertas seleccionadas de todas las categorías.',
    categoryId: 'all',
    discountHighlight: 'Hasta 55% DCTO',
    bannerBg: 'from-indigo-900 via-slate-900 to-blue-900',
    accentColor: 'text-amber-300'
  }
];

export interface EnrichedDealProduct extends Product {
  dealDiscountPercent: number;
  dealOriginalPrice: number;
  dealSavings: number;
  dealDayName: string;
  isDailyHighlight: boolean;
  unitsSoldPercent: number;
}

export function getTodayScheduleInfo(date: Date = new Date()): DayScheduleInfo {
  const currentDayIndex = date.getDay(); // 0 = Sunday
  return WEEKLY_SCHEDULE.find((s) => s.dayIndex === currentDayIndex) || WEEKLY_SCHEDULE[0];
}

export function getDealsForSelectedDay(
  products: Product[],
  selectedDayIndex: number
): EnrichedDealProduct[] {
  const daySchedule = WEEKLY_SCHEDULE.find((s) => s.dayIndex === selectedDayIndex) || WEEKLY_SCHEDULE[0];

  return products.map((prod, index) => {
    // Determine if product is a daily highlight based on category match or general deal flag
    const isCategoryMatch = daySchedule.categoryId === 'all' || prod.category === daySchedule.categoryId;
    const isBaseDeal = !!prod.isDeal;

    // Calculate dynamic discount percentage based on day index and product id hash
    const hash = prod.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dayBonus = ((selectedDayIndex * 3 + hash) % 15); // 0-14% extra
    
    let baseDiscount = prod.originalPrice 
      ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
      : 15;

    if (isCategoryMatch) {
      baseDiscount = Math.min(60, baseDiscount + 10 + (dayBonus % 8));
    }

    const effectiveDiscount = Math.max(12, Math.min(65, baseDiscount));
    const dealOriginalPrice = prod.originalPrice || Math.round(prod.price / (1 - effectiveDiscount / 100));
    const dealPrice = Math.round(dealOriginalPrice * (1 - effectiveDiscount / 100));
    const dealSavings = dealOriginalPrice - dealPrice;

    // Calculated percentage of units sold for urgency display
    const unitsSoldPercent = Math.min(92, Math.max(45, ((hash + selectedDayIndex * 7) % 50) + 42));

    return {
      ...prod,
      price: dealPrice,
      originalPrice: dealOriginalPrice,
      dealDiscountPercent: effectiveDiscount,
      dealOriginalPrice,
      dealSavings,
      dealDayName: daySchedule.dayName,
      isDailyHighlight: isCategoryMatch || isBaseDeal,
      unitsSoldPercent
    };
  }).filter((p) => {
    // Show products that match the day's category or are marked as base deals
    if (daySchedule.categoryId === 'all') return p.isDailyHighlight;
    return p.category === daySchedule.categoryId || p.isDeal;
  });
}

export function getTimeUntilNextMidnight(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diffMs = midnight.getTime() - now.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}
