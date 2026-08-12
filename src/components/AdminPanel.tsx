import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  X,
  Search,
  Cpu,
  Calendar,
  Download,
  Lock,
  Filter,
  FileText,
  Layers,
  ShoppingBag,
  UserCheck,
  MapPin,
  LogOut,
  Eye,
  EyeOff,
  KeyRound,
  User,
  Database,
  Server,
  HardDrive,
  Terminal,
  RefreshCw,
  Copy,
  Check,
  ShieldAlert,
  RotateCcw,
  UserPlus,
  Phone,
  Mail,
  Building
} from 'lucide-react';
import { Product, Order, Customer } from '../types';
import { generateOrderPDF, generateSystemDocsPDF } from '../services/pdfGenerator';
import { saveCustomerToFirestore, deleteCustomerFromFirestore } from '../services/firebaseStore';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  customers?: Customer[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onBackToStore: () => void;
  onSaveCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (customerId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  customers = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onBackToStore,
  onSaveCustomer,
  onDeleteCustomer
}) => {
  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  const userInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => {
        userInputRef.current?.focus();
      }, 100);
    }
  }, [isAuthenticated]);

  const [activeTab, setActiveTab] = useState<'kpis' | 'products' | 'orders' | 'customers'>('kpis');
  const [selectedDbCollection, setSelectedDbCollection] = useState<'products' | 'orders' | 'customers' | 'admin_logs'>('products');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [dbSearchQuery, setDbSearchQuery] = useState<string>('');
  const [dbJsonCopied, setDbJsonCopied] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Customer Management Form States
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCedula, setCustCedula] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custCity, setCustCity] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Notification and Error Modal State for Incorrect Credentials/Fields
  const [formErrorModal, setFormErrorModal] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === 'CouldXZero' && passwordInput === 'Instituto2026') {
      setIsAuthenticated(true);
      setAuthError('');
      // Limpiar campos
      setUsernameInput('');
      setPasswordInput('');
      setShowPassword(false);
    } else {
      setFormErrorModal('Las credenciales de administrador ingresadas son incorrectas.');
    }
  };

  const handleClearAuthInputs = () => {
    setUsernameInput('');
    setPasswordInput('');
    setFormErrorModal(null);
    setTimeout(() => {
      userInputRef.current?.focus();
    }, 100);
  };

  const handleClearCustomerFormInputs = () => {
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustCedula('');
    setCustAddress('');
    setCustCity('');
    setCustPassword('');
    setFormErrorModal(null);
  };

  const handleSaveCustomerAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custEmail.trim() || !custEmail.includes('@') || !custPhone.trim() || !custCedula.trim()) {
      setFormErrorModal('Uno o varios campos del cliente son incorrectos o están vacíos. Revisa el nombre, correo, cédula y teléfono.');
      return;
    }

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: custName.trim(),
      email: custEmail.trim().toLowerCase(),
      phone: custPhone.trim(),
      cedulaOrRuc: custCedula.trim(),
      address: custAddress.trim() || 'Dirección de Entrega Principal',
      city: custCity.trim() || 'Quito',
      password: custPassword.trim() || 'password123',
      createdAt: new Date().toISOString(),
      status: 'active',
      totalOrders: 0
    };

    try {
      await saveCustomerToFirestore(newCust);
      if (onSaveCustomer) onSaveCustomer(newCust);
      setIsAddCustomerModalOpen(false);
      handleClearCustomerFormInputs();
    } catch (err) {
      console.error('Error saving customer from Admin:', err);
      setFormErrorModal('Ocurrió un error al guardar el cliente en la base de datos de Firebase.');
    }
  };

  const handleUpdateCustomerAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    if (!editingCustomer.name.trim() || !editingCustomer.email.trim() || !editingCustomer.phone.trim() || !editingCustomer.cedulaOrRuc.trim()) {
      setFormErrorModal('Uno o varios campos del cliente son incorrectos o están vacíos. Revisa el nombre, correo, cédula y teléfono.');
      return;
    }

    const updatedCust: Customer = {
      ...editingCustomer,
      name: editingCustomer.name.trim(),
      email: editingCustomer.email.trim().toLowerCase(),
      phone: editingCustomer.phone.trim(),
      cedulaOrRuc: editingCustomer.cedulaOrRuc.trim(),
      address: editingCustomer.address.trim(),
      city: editingCustomer.city.trim()
    };

    try {
      await saveCustomerToFirestore(updatedCust);
      if (onSaveCustomer) onSaveCustomer(updatedCust);
      setEditingCustomer(null);
    } catch (err) {
      console.error('Error updating customer from Admin:', err);
      setFormErrorModal('Ocurrió un error al actualizar el cliente en la base de datos de Firebase.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    setShowPassword(false);
    setAuthError('');
  };

  // Quick inline price editing state
  const [inlinePriceId, setInlinePriceId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<number>(0);

  // Sales History Filters (Admin Only)
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Month extraction helper
  const getMonthFromDate = (dateStr: string): string => {
    const lower = dateStr.toLowerCase();
    if (lower.includes('agosto') || lower.includes('/08/') || lower.includes('-08-')) return 'Agosto 2026';
    if (lower.includes('julio') || lower.includes('/07/') || lower.includes('-07-')) return 'Julio 2026';
    if (lower.includes('junio') || lower.includes('/06/') || lower.includes('-06-')) return 'Junio 2026';
    if (lower.includes('mayo') || lower.includes('/05/') || lower.includes('-05-')) return 'Mayo 2026';
    if (lower.includes('abril') || lower.includes('/04/') || lower.includes('-04-')) return 'Abril 2026';
    return 'Mes Actual / Recientes';
  };

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => set.add(getMonthFromDate(o.date)));
    return Array.from(set);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Month
      if (selectedMonth !== 'all' && getMonthFromDate(ord.date) !== selectedMonth) {
        return false;
      }
      // Status
      if (orderStatusFilter !== 'all' && ord.status !== orderStatusFilter) {
        return false;
      }
      // Query
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchId = ord.id.toLowerCase().includes(q);
        const matchName = ord.shippingAddress.fullName.toLowerCase().includes(q);
        const matchCity = ord.shippingAddress.city.toLowerCase().includes(q);
        const matchDate = ord.date.toLowerCase().includes(q);
        const matchCode = ord.trackingCode.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchCity && !matchDate && !matchCode) {
          return false;
        }
      }
      return true;
    });
  }, [orders, selectedMonth, orderStatusFilter, orderSearchQuery]);

  // Group filtered orders by Month -> Day
  const groupedOrdersByMonthAndDay = useMemo(() => {
    const monthMap: Record<string, Record<string, Order[]>> = {};

    filteredOrders.forEach((ord) => {
      const month = getMonthFromDate(ord.date);
      const day = ord.date;

      if (!monthMap[month]) {
        monthMap[month] = {};
      }
      if (!monthMap[month][day]) {
        monthMap[month][day] = [];
      }
      monthMap[month][day].push(ord);
    });

    return monthMap;
  }, [filteredOrders]);

  const totalFilteredSalesUSD = filteredOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const avgOrderValue = filteredOrders.length > 0 ? Math.round(totalFilteredSalesUSD / filteredOrders.length) : 0;

  // Form state for new product
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: 'laptops',
    price: 999,
    originalPrice: 1199,
    stock: 10,
    description: '',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    warranty: '24 Meses Oficial'
  });

  const totalSalesUSD = orders.reduce((acc, o) => acc + o.totalAmount, 0) + 128450;
  const lowStockProducts = products.filter((p) => p.stock <= 8);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProd.name || 'Producto Nuevo',
      category: newProd.category as any,
      brand: newProd.brand || 'TecnoPlace Brand',
      price: Number(newProd.price),
      originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : undefined,
      rating: 5.0,
      reviewCount: 1,
      image: newProd.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      additionalImages: [],
      stock: Number(newProd.stock) || 10,
      description: newProd.description || 'Producto tecnológico de alto rendimiento.',
      keyFeatures: ['Garantía oficial TecnoPlace', 'Alta eficiencia energética', 'Tecnología 2026'],
      warranty: newProd.warranty || '12 meses',
      storeAvailability: [{ storeName: 'TecnoPlace Flagship Polanco', city: 'CDMX', stock: 5 }],
      specs: [{ name: 'Garantía', value: '12 Meses' }]
    };

    onAddProduct(created);
    setIsAddModalOpen(false);
  };

  const handleSaveInlinePrice = (prod: Product) => {
    if (inlinePriceValue <= 0) return;
    onUpdateProduct({
      ...prod,
      price: Number(inlinePriceValue)
    });
    setInlinePriceId(null);
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 relative">
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 max-w-md w-full space-y-6 animate-in fade-in zoom-in-95">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Acceso a Panel Admin</h2>
              <p className="text-xs text-slate-500 mt-1">
                Ingresa tus credenciales de administración para acceder
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Usuario Administrador</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={userInputRef}
                  type="text"
                  value={usernameInput}
                  autoComplete="off"
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                  }}
                  placeholder="Ingresa tu usuario"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Contraseña</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-slate-800 active:scale-98 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Iniciar Sesión en Panel</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  onBackToStore();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Volver a la Tienda
              </button>
            </div>
          </form>

          <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 pt-3 font-medium">
            🔒 Acceso Protegido • TecnoPlace Store Manager 2026
          </div>
        </div>

        {/* ERROR NOTIFICATION MODAL WITH VOLVER A INTENTAR BUTTON */}
        {formErrorModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-2 border-rose-500 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                <AlertTriangle className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900 mb-1.5">
                  Credenciales Incorrectas
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {formErrorModal}
                </p>
              </div>

              <button
                onClick={handleClearAuthInputs}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Volver a intentar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-900 space-y-6">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">Panel de Administración TecnoPlace</h1>
              <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
                STORE MANAGER
              </span>
            </div>
            <p className="text-xs text-slate-500">Gestión de Inventario, Ventas, Pedidos y Métricas en Tiempo Real</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="https://console.firebase.google.com/project/gen-lang-client-0930371438/firestore/databases/ai-studio-tecnoplaceecomme-03465408-3c1c-40b1-880c-6723e17ae6ac/data"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 border border-amber-400 cursor-pointer active:scale-95"
            title="Abrir Consola de Firebase Firestore"
          >
            <Database className="w-4 h-4 text-slate-950 fill-amber-950/20" />
            <span>Base de Datos Firebase</span>
          </a>

          <button
            onClick={() => generateSystemDocsPDF()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 border border-blue-500 cursor-pointer active:scale-95"
            title="Descargar Documentación Completa del Sistema en PDF"
          >
            <FileText className="w-4 h-4" />
            <span>Descargar Doc. PDF</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>CouldXZero</span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>

          <button
            onClick={onBackToStore}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            Volver a la Tienda
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-nowrap overflow-x-auto gap-2 sm:gap-3 border-b border-slate-200 pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('kpis')}
          className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'kpis' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
          }`}
        >
          Métricas y Reporte de Ventas
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'products' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
          }`}
        >
          Inventario de Productos ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'orders' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Historial de Ventas ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'customers' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Clientes en Firebase ({customers.length})</span>
        </button>
      </div>

      {/* TAB 1: KPIS & CHARTS */}
      {activeTab === 'kpis' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Ventas Totales</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">${totalSalesUSD.toLocaleString()} USD</div>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+18.4% este mes</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Pedidos Procesados</span>
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{orders.length + 142}</div>
              <div className="text-[11px] text-blue-600 font-bold">100% Entregados con éxito</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Productos en Catálogo</span>
                <Cpu className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{products.length}</div>
              <div className="text-[11px] text-slate-500">7 Categorías activas</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/50 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Alertas Stock Bajo</span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-700">{lowStockProducts.length}</div>
              <div className="text-[11px] text-amber-700 font-bold">Requiere reabastecimiento</div>
            </div>
          </div>

          {/* Sales Trend Bar Visualizer */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Rendimiento de Ventas por Categoría (Agosto 2026)</h3>
            <div className="space-y-3 text-xs">
              {[
                { name: 'Laptops & Computadoras', val: 85, color: 'bg-blue-600' },
                { name: 'Smartphones & Tablets', val: 72, color: 'bg-indigo-600' },
                { name: 'Gaming & Consolas (PS5 Pro / Steam Deck)', val: 94, color: 'bg-purple-600' },
                { name: 'Componentes PC & GPUs (RTX 4090)', val: 68, color: 'bg-emerald-600' },
                { name: 'Audio High-End (Sony / Bose)', val: 55, color: 'bg-amber-600' }
              ].map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{c.name}</span>
                    <span className="font-bold text-slate-900">{c.val}% del objetivo</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filtrar por nombre o marca..."
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nuevo Producto</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <tr>
                    <th className="p-3">Producto</th>
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Precio USD</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80">
                      <td className="p-3 flex items-center gap-3 font-semibold text-slate-900">
                        <img src={prod.image} alt="" className="w-10 h-10 object-contain bg-slate-50 p-1 rounded-lg border border-slate-200" />
                        <div>
                          <div className="line-clamp-1">{prod.name}</div>
                          <div className="text-[10px] text-blue-600 font-bold">{prod.brand}</div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 capitalize">{prod.category}</td>
                      <td className="p-3 font-bold text-blue-600">
                        {inlinePriceId === prod.id ? (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500">$</span>
                            <input
                              type="number"
                              value={inlinePriceValue}
                              onChange={(e) => setInlinePriceValue(Number(e.target.value))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveInlinePrice(prod);
                                if (e.key === 'Escape') setInlinePriceId(null);
                              }}
                              className="w-20 bg-blue-50 border border-blue-400 text-blue-700 font-black px-2 py-1 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveInlinePrice(prod)}
                              className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                              title="Guardar Precio"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setInlinePriceId(null)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                              title="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-blue-600">${prod.price}</span>
                            {prod.originalPrice && (
                              <span className="text-[10px] text-slate-400 line-through font-normal">
                                ${prod.originalPrice}
                              </span>
                            )}
                            <button
                              onClick={() => {
                                setInlinePriceId(prod.id);
                                setInlinePriceValue(prod.price);
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Modificar precio rápido"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`font-bold ${prod.stock <= 8 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {prod.stock} unidades
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Editar Producto y Precio"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(prod.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: SALES HISTORY (ADMIN EXCLUSIVE GROUPED BY MONTH & DATE) */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Admin Exclusive Privacy Header */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  Historial de Ventas - Acceso Exclusivo de Administración
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                    PROTEGIDO
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Visualización detallada de ingresos, pedidos y registros contables organizados por mes y por fecha.
                </p>
              </div>
            </div>

            {/* Quick Export Summary Button */}
            <div className="text-xs text-slate-300 font-medium bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{availableMonths.length} Meses Registrados</span>
            </div>
          </div>

          {/* Filter Bar Controls */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Month Selector */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-700">Filtrar por Mes:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">📅 Todos los Meses ({availableMonths.length})</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-700">Estado de Venta:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">Todos los Estados</option>
                  <option value="processing">Procesando</option>
                  <option value="shipped">Enviados (En Tránsito)</option>
                  <option value="delivered">Entregados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Buscar cliente, orden #, ciudad o fecha..."
                  className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

            </div>

            {/* Filtered Summary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 font-medium block">Total Recaudado</span>
                <span className="text-base font-black text-blue-600">${totalFilteredSalesUSD.toLocaleString()} USD</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 font-medium block">Ventas en Selección</span>
                <span className="text-base font-black text-slate-900">{filteredOrders.length} Pedidos</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 font-medium block">Ticket Promedio</span>
                <span className="text-base font-black text-emerald-600">${avgOrderValue.toLocaleString()} USD</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 font-medium block">Tasa de Entrega</span>
                <span className="text-base font-black text-purple-600">
                  {filteredOrders.length > 0
                    ? `${Math.round((filteredOrders.filter((o) => o.status === 'delivered').length / filteredOrders.length) * 100)}%`
                    : '100%'}
                </span>
              </div>
            </div>
          </div>

          {/* Grouped Sales List */}
          {Object.keys(groupedOrdersByMonthAndDay).length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">No se encontraron ventas para este filtro</h4>
              <p className="text-xs text-slate-400">Intenta cambiar el mes seleccionado o borrar el término de búsqueda.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedOrdersByMonthAndDay).map(([monthName, daysMap]) => {
                const monthTotal = Object.values(daysMap)
                  .flat()
                  .reduce((acc, o) => acc + o.totalAmount, 0);
                const monthOrderCount = Object.values(daysMap).flat().length;

                return (
                  <div key={monthName} className="space-y-4">
                    
                    {/* Month Banner Header */}
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-400" />
                        <h2 className="font-black text-base tracking-wide uppercase">{monthName}</h2>
                        <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                          {monthOrderCount} {monthOrderCount === 1 ? 'Venta' : 'Ventas'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-300 block uppercase font-bold">Total del Mes</span>
                        <span className="text-lg font-black text-amber-400">${monthTotal.toLocaleString()} USD</span>
                      </div>
                    </div>

                    {/* Days Breakdown */}
                    <div className="space-y-4 pl-2 sm:pl-4 border-l-2 border-slate-200">
                      {Object.entries(daysMap).map(([dayDate, dayOrders]) => {
                        const dayTotal = dayOrders.reduce((acc, o) => acc + o.totalAmount, 0);

                        return (
                          <div key={dayDate} className="space-y-3">
                            
                            {/* Day Header */}
                            <div className="flex items-center justify-between bg-slate-100 px-4 py-2 rounded-xl text-xs border border-slate-200">
                              <div className="flex items-center gap-2 font-bold text-slate-800">
                                <Clock className="w-3.5 h-3.5 text-blue-600" />
                                <span>🗓️ Fecha: {dayDate}</span>
                              </div>
                              <div className="text-slate-600 font-bold">
                                {dayOrders.length} {dayOrders.length === 1 ? 'operación' : 'operaciones'} | Subtotal: <span className="text-blue-700">${dayTotal.toLocaleString()} USD</span>
                              </div>
                            </div>

                            {/* Orders Cards for this Day */}
                            <div className="space-y-3">
                              {dayOrders.map((ord) => (
                                <div
                                  key={ord.id}
                                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-all"
                                >
                                  {/* Order Header Row */}
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                                    <div className="flex items-center gap-3">
                                      <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                                        ORDEN #{ord.id}
                                      </span>
                                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                                        <span className="font-bold text-slate-900">{ord.shippingAddress.fullName}</span>
                                      </div>
                                      <span className="text-slate-400 hidden md:inline">•</span>
                                      <span className="text-slate-500 hidden md:inline">{ord.shippingAddress.city}, {ord.shippingAddress.country}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      {/* Total */}
                                      <div className="text-right">
                                        <span className="text-[10px] text-slate-400 block font-medium">Monto Venta</span>
                                        <span className="text-sm font-black text-blue-600">${ord.totalAmount} USD</span>
                                      </div>

                                      {/* Status Selector */}
                                      <select
                                        value={ord.status}
                                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                                          ord.status === 'delivered'
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                            : ord.status === 'shipped'
                                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                                            : ord.status === 'processing'
                                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                                            : 'bg-rose-50 text-rose-800 border-rose-200'
                                        }`}
                                      >
                                        <option value="processing">Procesando</option>
                                        <option value="shipped">Enviado</option>
                                        <option value="delivered">Entregado</option>
                                        <option value="cancelled">Cancelado</option>
                                      </select>

                                      {/* Download Invoice PDF */}
                                      <button
                                        onClick={() => generateOrderPDF(ord)}
                                        className="p-2 text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors"
                                        title="Descargar Comprobante PDF de Venta"
                                      >
                                        <Download className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Order Details Body */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                    
                                    {/* Column 1: Items List */}
                                    <div className="md:col-span-2 space-y-2">
                                      <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">Productos Vendidos:</span>
                                      <div className="space-y-1.5">
                                        {ord.items.map((it, idx) => (
                                          <div key={idx} className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                            <img src={it.product.image} alt="" className="w-8 h-8 object-contain bg-white rounded-lg p-0.5 border" />
                                            <div className="flex-1 min-w-0">
                                              <p className="font-bold text-slate-800 truncate">{it.product.name}</p>
                                              <p className="text-[10px] text-slate-500">Cantidad: {it.quantity} x ${it.product.price} USD</p>
                                            </div>
                                            <span className="font-black text-slate-900">${it.quantity * it.product.price} USD</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Column 2: Customer & Shipping Details */}
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-[11px]">
                                      <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">Detalles de Facturación:</span>
                                      <p className="text-slate-600 flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                        <span>{ord.shippingAddress.street}, {ord.shippingAddress.city}</span>
                                      </p>
                                      <p className="text-slate-600">Teléfono: {ord.shippingAddress.phone}</p>
                                      <p className="text-slate-600">Pago: <strong className="text-slate-800">{ord.paymentMethod.details}</strong></p>
                                      <p className="text-slate-600">Guía de Envío: <strong className="text-blue-600">{ord.trackingCode}</strong></p>
                                    </div>

                                  </div>

                                </div>
                              ))}
                            </div>

                          </div>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 4: CUSTOMERS MANAGEMENT (FIREBASE FIRESTORE) */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header & Stats Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  <span>Base de Datos Firestore Sincronizada</span>
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white">Clientes Registrados en TecnoPlace</h2>
              <p className="text-xs text-slate-300">
                Gestión centralizada de clientes con almacenamiento seguro en la colección <code className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono">/customers</code>.
              </p>
            </div>

            <button
              onClick={() => setIsAddCustomerModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 border border-emerald-400 cursor-pointer active:scale-95 shrink-0"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Registrar Nuevo Cliente</span>
            </button>
          </div>

          {/* Search Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente por nombre, correo, cédula o teléfono..."
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
            <div className="text-xs font-bold text-slate-500">
              Mostrando <span className="text-slate-900 font-black">{customers.filter(c => 
                c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                c.email.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                c.cedulaOrRuc.toLowerCase().includes(customerSearchQuery.toLowerCase())
              ).length}</span> clientes
            </div>
          </div>

          {/* Customers List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers
              .filter(c => 
                c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                c.email.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                c.cedulaOrRuc.toLowerCase().includes(customerSearchQuery.toLowerCase())
              )
              .map((cust) => (
                <div key={cust.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-blue-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{cust.name}</h4>
                          <span className="text-[10px] text-slate-400 font-medium">ID: {cust.id}</span>
                        </div>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                        {cust.status || 'Activo'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{cust.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{cust.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Cédula/RUC: <strong>{cust.cedulaOrRuc}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{cust.address}, {cust.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Registrado: {new Date(cust.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingCustomer(cust)}
                        className="text-blue-600 hover:text-blue-800 font-bold hover:bg-blue-50 p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                        title="Modificar datos del cliente"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Modificar</span>
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`¿Eliminar al cliente ${cust.name} de Firebase Firestore?`)) {
                            await deleteCustomerFromFirestore(cust.id);
                            if (onDeleteCustomer) onDeleteCustomer(cust.id);
                          }
                        }}
                        className="text-rose-600 hover:text-rose-800 font-bold hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar cliente de la base de datos"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

        </div>
      )}

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative space-y-4">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-slate-900">Agregar Producto al Catálogo TecnoPlace</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Nombre del Producto</label>
                <input
                  type="text"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="Ej: Laptop Lenovo Legion Pro 7i"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Marca</label>
                  <input
                    type="text"
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    placeholder="Ej: Lenovo / Asus / Apple"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Categoría</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="laptops">Laptops</option>
                    <option value="smartphones">Smartphones</option>
                    <option value="gaming">Gaming & Consolas</option>
                    <option value="audio">Audio</option>
                    <option value="pc-components">Componentes PC</option>
                    <option value="smart-home">Smart Home</option>
                    <option value="wearables">Wearables</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Precio ($ USD)</label>
                  <input
                    type="number"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Stock Inicial</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">URL Imagen del Producto</label>
                <input
                  type="text"
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold py-2.5 rounded-xl border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-xs"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative space-y-4">
            <button onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Edit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Editar Precio y Producto</h3>
                <p className="text-[11px] text-slate-500">Modifica el precio de venta, precio de lista y stock en el catálogo.</p>
              </div>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Nombre del Producto</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Marca</label>
                  <input
                    type="text"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Categoría</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="laptops">Laptops</option>
                    <option value="smartphones">Smartphones</option>
                    <option value="gaming">Gaming & Consolas</option>
                    <option value="audio">Audio</option>
                    <option value="pc-components">Componentes PC</option>
                    <option value="smart-home">Smart Home</option>
                    <option value="wearables">Wearables</option>
                  </select>
                </div>
              </div>

              {/* Prices Section */}
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3">
                <div className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ajuste de Precios ($ USD)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Precio de Venta Actual ($ USD)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full bg-white border border-blue-300 text-blue-700 font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Precio Original / Lista ($ USD)</label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        originalPrice: e.target.value ? Number(e.target.value) : undefined
                      })}
                      placeholder="Ej: 1499 (Muestra Tachado)"
                      className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Stock Disponible</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Garantía</label>
                  <input
                    type="text"
                    value={editingProduct.warranty || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, warranty: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">URL Imagen del Producto</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold py-2.5 rounded-xl border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-xs"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL (ADMIN) */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsAddCustomerModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Registrar Cliente en Firestore</h3>
                <p className="text-xs text-slate-500">Colección /customers en la base de datos de Firebase</p>
              </div>
            </div>

            <form onSubmit={handleSaveCustomerAdmin} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Nombre Completo del Cliente *</label>
                <input
                  type="text"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Ej: Gabriela Silva"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="cliente@ejemplo.com"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Teléfono / Celular *</label>
                  <input
                    type="text"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="+593 98 123 4567"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Cédula / RUC *</label>
                  <input
                    type="text"
                    value={custCedula}
                    onChange={(e) => setCustCedula(e.target.value)}
                    placeholder="1723456789"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Contraseña de Cuenta</label>
                  <input
                    type="password"
                    value={custPassword}
                    onChange={(e) => setCustPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Dirección</label>
                  <input
                    type="text"
                    value={custAddress}
                    onChange={(e) => setCustAddress(e.target.value)}
                    placeholder="Av. Principal N20-10"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Ciudad</label>
                  <input
                    type="text"
                    value={custCity}
                    onChange={(e) => setCustCity(e.target.value)}
                    placeholder="Quito"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleClearCustomerFormInputs();
                    setIsAddCustomerModalOpen(false);
                  }}
                  className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold py-3 rounded-xl border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-xs"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL (ADMIN) */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-900 shadow-2xl relative space-y-4">
            <button
              onClick={() => setEditingCustomer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Modificar Cliente en Firestore</h3>
                <p className="text-xs text-slate-500">ID Cliente: {editingCustomer.id}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateCustomerAdmin} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Nombre Completo del Cliente *</label>
                <input
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Teléfono / Celular *</label>
                  <input
                    type="text"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Cédula / RUC *</label>
                  <input
                    type="text"
                    value={editingCustomer.cedulaOrRuc}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, cedulaOrRuc: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Estado de Cuenta</label>
                  <select
                    value={editingCustomer.status || 'active'}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Dirección</label>
                  <input
                    type="text"
                    value={editingCustomer.address}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Ciudad</label>
                  <input
                    type="text"
                    value={editingCustomer.city}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold py-3 rounded-xl border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-xs"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ERROR MODAL WITH VOLVER A INTENTAR BUTTON FOR ADMIN CUSTOMER FORM */}
      {formErrorModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-2 border-rose-500 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900 mb-1.5">
                Campo o Credencial Incorrecta
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {formErrorModal}
              </p>
            </div>

            <button
              onClick={handleClearCustomerFormInputs}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Volver a intentar</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
