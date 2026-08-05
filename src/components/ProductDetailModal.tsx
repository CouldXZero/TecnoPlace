import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  MapPin,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  ThumbsUp,
  Cpu,
  RotateCcw
} from 'lucide-react';
import { Product, Review } from '../types';
import { formatPrice } from '../data/mockCoupons';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onAskAI: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onAskAI
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'stores' | 'reviews'>('specs');

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      productId: product.id,
      userName: 'Carlos M. (Ingeniero de Software)',
      rating: 5,
      date: '28 de Julio, 2026',
      title: 'Rendimiento espectacular sin sobrecalentamiento',
      comment: `Compré este producto en TecnoPlace y la entrega tardó menos de 24 horas. El rendimiento en tareas pesadas es sobresaliente, cumple con creces todas mis expectativas.`,
      verifiedPurchase: true,
      helpfulCount: 24
    },
    {
      id: 'rev-2',
      productId: product.id,
      userName: 'Sofía R. (Creadora de Contenido)',
      rating: 5,
      date: '15 de Julio, 2026',
      title: 'Calidad de construcción premium',
      comment: 'La pantalla, los materiales y la velocidad de respuesta son inmejorables. 100% recomendado para profesionales.',
      verifiedPurchase: true,
      helpfulCount: 18
    }
  ]);

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    title: '',
    comment: ''
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const rev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: newReview.name,
      rating: newReview.rating,
      date: 'Hoy',
      title: newReview.title || 'Excelente compra',
      comment: newReview.comment,
      verifiedPurchase: true,
      helpfulCount: 0
    };

    setReviews([rev, ...reviews]);
    setNewReview({ name: '', rating: 5, title: '', comment: '' });
  };

  const allImages = [product.image, ...(product.additionalImages || [])];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-900 flex flex-col">
        
        {/* Modal Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full border border-blue-200 uppercase">
              {product.brand}
            </span>
            <span className="text-slate-400 text-xs font-mono">SKU: {product.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Product Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left: Gallery */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-72 flex items-center justify-center relative overflow-hidden">
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-md"
              />
            </div>

            {/* Thumbnail selector */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-slate-50 shrink-0 transition-all ${
                      activeImage === img ? 'border-blue-600 scale-105 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* AI Assistant Callout */}
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">¿Tienes dudas sobre las specs?</div>
                  <div className="text-[11px] text-slate-600">Pregunta a la IA sobre compatibilidad o rendimiento.</div>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onAskAI(product);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-xl shrink-0 shadow-sm"
              >
                Consultar IA
              </button>
            </div>
          </div>

          {/* Right: Info & Purchase */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <span className="font-bold text-sm text-slate-800">{product.rating}</span>
                <span className="text-slate-500 text-xs">({product.reviewCount} opiniones)</span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                {product.name}
              </h2>

              <p className="text-slate-600 text-xs leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Features Bullet List */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                Destacados del Producto:
              </div>
              {product.keyFeatures?.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Pricing Box */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {formatPrice(product.price * quantity)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.originalPrice * quantity)}
                </span>
              )}
              {quantity > 1 && (
                <span className="text-xs text-slate-500">({formatPrice(product.price)} c/u)</span>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-200 flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Agregar al Carrito</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{product.warranty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Envío asegurado en 24h</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Tabs: Specs Matrix, Store Locations, Customer Reviews */}
        <div className="border-t border-slate-200 bg-slate-50 p-6 flex-1">
          <div className="flex gap-4 border-b border-slate-200 pb-3 mb-4">
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-sm font-bold pb-2 transition-colors border-b-2 ${
                activeTab === 'specs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Ficha Técnica Completa
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`text-sm font-bold pb-2 transition-colors border-b-2 ${
                activeTab === 'stores' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Disponibilidad en Tiendas
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-sm font-bold pb-2 transition-colors border-b-2 ${
                activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Opiniones ({reviews.length})
            </button>
          </div>

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.specs?.map((spec, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between text-xs shadow-sm">
                  <span className="text-slate-500 font-medium">{spec.name}:</span>
                  <span className="text-slate-900 font-bold text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stores Tab */}
          {activeTab === 'stores' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 mb-2">
                Consulta el stock físico disponible en nuestras sucursales para retiro inmediato en tienda:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {product.storeAvailability?.map((st, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-start gap-3 shadow-sm">
                    <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{st.storeName}</div>
                      <div className="text-[11px] text-slate-500">{st.city}</div>
                      <div className="text-xs font-bold text-emerald-600 mt-1">
                        {st.stock > 0 ? `Stock: ${st.stock} unidades` : 'Sin stock local'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Write Review Form */}
              <form onSubmit={handleAddReview} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <div className="font-bold text-xs text-slate-700 uppercase tracking-wider">Escribir una Opinión sobre el Producto</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Tu Nombre o Apodo"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-xs text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  />
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="bg-slate-50 border border-slate-200 text-xs text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Estrellas (Excelente)</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Estrellas (Muy Bueno)</option>
                    <option value={3}>⭐⭐⭐ 3 Estrellas (Regular)</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Título de tu opinión (ej: Excelente producto para trabajo)"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500"
                />
                <textarea
                  placeholder="Escribe tus comentarios sobre el uso, la velocidad y tu experiencia..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-3 rounded-xl focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm"
                >
                  Publicar Opinión
                </button>
              </form>

              {/* Existing Reviews List */}
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                            Compra Verificada TecnoPlace
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center text-amber-500 gap-1 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      ))}
                      <span className="font-bold ml-1 text-slate-800">{rev.title}</span>
                    </div>

                    <p className="text-xs text-slate-600">{rev.comment}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
