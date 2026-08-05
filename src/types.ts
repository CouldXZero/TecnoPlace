export interface ProductSpec {
  name: string;
  value: string;
  group?: string; // e.g., 'Procesador', 'Pantalla', 'Memoria', 'Batería'
}

export interface StoreAvailability {
  storeName: string;
  city: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: 'laptops' | 'smartphones' | 'gaming' | 'audio' | 'pc-components' | 'smart-home' | 'wearables';
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  additionalImages: string[];
  specs: ProductSpec[];
  stock: number;
  isFeatured?: boolean;
  isDeal?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  description: string;
  keyFeatures: string[];
  warranty: string;
  storeAvailability: StoreAvailability[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  iconName: string;
  count: number;
  description: string;
  image: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  shippingCost: number;
  tax: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  billingInfo?: {
    isConsumidorFinal: boolean;
    taxIdType: 'RUC' | 'CEDULA' | 'DNI' | 'PASAPORTE' | 'CF';
    taxId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: {
    type: 'card' | 'paypal' | 'de_una_qr' | 'transfer' | 'check';
    details: string;
  };
  trackingCode: string;
  estimatedDelivery: string;
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  minPurchase: number;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: {
    title: string;
    street: string;
    city: string;
    country: string;
    isDefault: boolean;
  }[];
}

export interface FilterState {
  searchQuery: string;
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  minRating: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export type AppMode = 'store' | 'checkout' | 'admin' | 'orders';

