import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Zap,
  Flame,
  Star,
  Sparkles,
  RotateCcw,
  Scale,
  Package,
  Layers,
  Check
} from 'lucide-react';
import {
  Product,
  CartItem,
  Coupon,
  Order,
  Customer,
  AppMode,
  FilterState
} from './types';
import { MOCK_PRODUCTS, CATEGORIES, MOCK_ORDERS } from './data/mockProducts';
import {
  subscribeProducts,
  saveProductToFirestore,
  deleteProductFromFirestore
} from './services/productService';
import {
  subscribeToCustomers,
  MOCK_CUSTOMERS
} from './services/firebaseStore';
import { CustomerModal } from './components/CustomerModal';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WeeklyDealsModal } from './components/WeeklyDealsModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { AdminPanel } from './components/AdminPanel';
import { OrderHistoryView } from './components/OrderHistoryView';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { BottomNav } from './components/BottomNav';
import { MobileFilterDrawer } from './components/MobileFilterDrawer';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

export default function App() {
  // App States
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);

  // Realtime Firestore Products Sync
  useEffect(() => {
    const unsubscribe = subscribeProducts((firestoreProducts) => {
      if (firestoreProducts && firestoreProducts.length > 0) {
        setProducts(firestoreProducts);
      }
    });
    return () => unsubscribe();
  }, []);

  // Realtime Firestore Customers Sync
  useEffect(() => {
    const unsubscribe = subscribeToCustomers((firestoreCustomers) => {
      if (firestoreCustomers && firestoreCustomers.length > 0) {
        setCustomers(firestoreCustomers);
      }
    });
    return () => unsubscribe();
  }, []);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [appMode, setAppMode] = useState<AppMode>('store');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAIBotOpen, setIsAIBotOpen] = useState<boolean>(false);
  const [isWeeklyDealsOpen, setIsWeeklyDealsOpen] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [aiProductContext, setAiProductContext] = useState<Product | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    brand: 'all',
    minPrice: 0,
    maxPrice: 5000,
    inStockOnly: false,
    onSaleOnly: false,
    minRating: 0,
    sortBy: 'featured'
  });

  // Unique Brands List
  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, [products]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Search
      if (
        filters.searchQuery &&
        !prod.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !prod.brand.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !prod.category.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category
      if (filters.category !== 'all' && prod.category !== filters.category) {
        return false;
      }

      // Brand
      if (filters.brand !== 'all' && prod.brand !== filters.brand) {
        return false;
      }

      // Price
      if (prod.price < filters.minPrice || prod.price > filters.maxPrice) {
        return false;
      }

      // In Stock Only
      if (filters.inStockOnly && prod.stock <= 0) {
        return false;
      }

      // On Sale Only
      if (filters.onSaleOnly && !prod.isDeal) {
        return false;
      }

      // Min Rating
      if (filters.minRating > 0 && prod.rating < filters.minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, filters]);

  // Handlers for Cart
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Handlers for Admin CRUD with Firestore Persistence
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    saveProductToFirestore(newProd).catch((err) => {
      console.error("Error saving new product to Firestore:", err);
    });
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    saveProductToFirestore(updatedProd).catch((err) => {
      console.error("Error updating product in Firestore:", err);
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    deleteProductFromFirestore(productId).catch((err) => {
      console.error("Error deleting product from Firestore:", err);
    });
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const handleAskAIAboutProduct = (product: Product) => {
    setAiProductContext(product);
    setIsAIBotOpen(true);
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      brand: 'all',
      minPrice: 0,
      maxPrice: 5000,
      inStockOnly: false,
      onSaleOnly: false,
      minRating: 0,
      sortBy: 'featured'
    });
  };

  return (
    <MobileFrameWrapper
      isMobilePreview={isMobilePreview}
      onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
    >
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between pb-16 lg:pb-0">
        
        {/* Navigation Bar */}
        <Header
          currentCategory={filters.category}
          onSelectCategory={(catId) => setFilters({ ...filters, category: catId })}
          searchQuery={filters.searchQuery}
          onSearchChange={(q) => setFilters({ ...filters, searchQuery: q })}
          cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
          appMode={appMode}
          onSetAppMode={setAppMode}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAIBot={() => {
            setAiProductContext(null);
            setIsAIBotOpen(true);
          }}
          onOpenWeeklyDeals={() => setIsWeeklyDealsOpen(true)}
          isMobilePreview={isMobilePreview}
          onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
          onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
        />

        {/* Main Content Router View */}
        <main className="flex-1">
          {appMode === 'admin' || appMode === 'orders' ? (
            <AdminPanel
              products={products}
              orders={orders}
              customers={customers}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onBackToStore={() => setAppMode('store')}
            />
          ) : appMode === 'checkout' ? (
            <CheckoutView
              cartItems={cartItems}
              appliedCoupon={appliedCoupon}
              onBackToCart={() => setAppMode('store')}
              onOrderCompleted={(newOrder) => {
                setOrders((prev) => [newOrder, ...prev]);
                setCartItems([]);
                setAppliedCoupon(null);
              }}
            />
          ) : (
            <>
              {/* Promotional Hero Banner */}
              <HeroBanner
                onExploreDeals={() => setIsWeeklyDealsOpen(true)}
                onOpenAIBot={() => {
                  setAiProductContext(null);
                  setIsAIBotOpen(true);
                }}
              />

              {/* Main Store View with Filters Sidebar & Product Grid */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Filters Sidebar (Desktop only) */}
                  <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white border border-slate-200 p-5 rounded-3xl h-fit shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                        <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                        <span>Filtros TecnoPlace</span>
                      </div>
                      <button
                        onClick={resetFilters}
                        className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Limpiar</span>
                      </button>
                    </div>

                    {/* Brands Filter */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Marca
                      </label>
                      <select
                        value={filters.brand}
                        onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                      >
                        <option value="all">Todas las Marcas</option>
                        {availableBrands.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 uppercase tracking-wider">Precio Máximo</span>
                        <span className="font-black text-blue-600">${filters.maxPrice} USD</span>
                      </div>
                      <input
                        type="range"
                        min={100}
                        max={5000}
                        step={50}
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    {/* Checkbox Toggles */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                      <button
                        onClick={() => setIsWeeklyDealsOpen(true)}
                        className="w-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 mb-1"
                      >
                        <Flame className="w-4 h-4 fill-white" />
                        <span>Ver Ofertas de la Semana</span>
                      </button>

                      <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={filters.onSaleOnly}
                          onChange={(e) => setFilters({ ...filters, onSaleOnly: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-0 bg-slate-50 border-slate-300"
                        />
                        <span className="font-semibold flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          <span>Solo Ofertas / Descuentos</span>
                        </span>
                      </label>

                      <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={filters.inStockOnly}
                          onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-0 bg-slate-50 border-slate-300"
                        />
                        <span className="font-semibold">Solo Disponibles en Stock</span>
                      </label>
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Calificación Mínima
                      </label>
                      <div className="flex items-center gap-1 text-xs">
                        {[0, 4.0, 4.5, 4.8].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setFilters({ ...filters, minRating: rating })}
                            className={`flex-1 py-1.5 rounded-lg border text-center font-bold transition-all ${
                              filters.minRating === rating
                                ? 'bg-blue-50 border-blue-600 text-blue-700'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {rating === 0 ? 'Todos' : `${rating}★`}
                          </button>
                        ))}
                      </div>
                    </div>

                  </aside>

                  {/* Right Products Catalog Grid */}
                  <main className="lg:col-span-9 space-y-4">
                    
                    {/* Catalog Header Bar */}
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
                      <div className="text-slate-600 font-medium flex items-center justify-between w-full sm:w-auto">
                        <div>
                          Mostrando <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> productos
                          {filters.category !== 'all' && (
                            <span className="ml-1 text-blue-600 font-bold">
                              en {CATEGORIES.find((c) => c.id === filters.category)?.name}
                            </span>
                          )}
                        </div>

                        {/* Mobile Filter Trigger Button */}
                        <button
                          onClick={() => setIsMobileFilterOpen(true)}
                          className="lg:hidden bg-blue-50 text-blue-600 font-bold text-xs px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5 ml-2"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                          <span>Filtros</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-slate-500 font-semibold">Ordenar por:</span>
                        <select
                          value={filters.sortBy}
                          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                          className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer text-xs"
                        >
                          <option value="featured">Destacados TecnoPlace</option>
                          <option value="price-asc">Precio: Menor a Mayor</option>
                          <option value="price-desc">Precio: Mayor a Menor</option>
                          <option value="rating">Mejor Calificados</option>
                          <option value="newest">Lanzamientos 2026</option>
                        </select>
                      </div>
                    </div>

                    {/* Grid */}
                    {filteredProducts.length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3 shadow-sm">
                        <Search className="w-10 h-10 text-slate-400 mx-auto" />
                        <h3 className="font-bold text-base text-slate-900">No se encontraron productos con estos filtros</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Intenta ajustar el rango de precio o seleccionar otra categoría para ver más productos.
                        </p>
                        <button
                          onClick={resetFilters}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm"
                        >
                          Restablecer Filtros
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((prod) => (
                          <ProductCard
                            key={prod.id}
                            product={prod}
                            onQuickView={setSelectedProduct}
                            onAddToCart={handleAddToCart}
                          />
                        ))}
                      </div>
                    )}

                  </main>

                </div>
              </div>
            </>
          )}
        </main>

        {/* Global Footer with Google Maps Location and Social Media */}
        <Footer
          filters={filters}
          setFilters={setFilters}
        />

        {/* Floating WhatsApp Button */}
        <WhatsAppFloatingButton />

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            onAskAI={handleAskAIAboutProduct}
          />
        )}

        {/* Weekly & Daily Deals Interactive Modal */}
        <WeeklyDealsModal
          isOpen={isWeeklyDealsOpen}
          onClose={() => setIsWeeklyDealsOpen(false)}
          products={products}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => {
            setSelectedProduct(p);
          }}
        />

        {/* AI TecnoBot Assistant Drawer */}
        <AIAssistantDrawer
          isOpen={isAIBotOpen}
          onClose={() => setIsAIBotOpen(false)}
          contextProduct={aiProductContext}
        />

        {/* Cart Slide-Over Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartQty}
          onRemoveItem={handleRemoveCartItem}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={setAppliedCoupon}
          onProceedToCheckout={() => setAppMode('checkout')}
        />

        {/* Mobile Filter Drawer (Android/iOS) */}
        <MobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
          availableBrands={availableBrands}
          totalResultsCount={filteredProducts.length}
          onResetFilters={resetFilters}
        />

        {/* Customer Registration & Login Modal */}
        <CustomerModal
          isOpen={isCustomerModalOpen}
          onClose={() => setIsCustomerModalOpen(false)}
          existingCustomers={customers}
        />

        {/* Sticky Mobile Navigation Bar (Android & iOS) */}
        <BottomNav
          appMode={appMode}
          onSetAppMode={setAppMode}
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAIBot={() => setIsAIBotOpen(true)}
          onOpenWeeklyDeals={() => setIsWeeklyDealsOpen(true)}
          onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
          onGoHome={() => {
            setAppMode('store');
            setFilters((f) => ({ ...f, category: 'all' }));
          }}
        />

      </div>
    </MobileFrameWrapper>
  );
}
