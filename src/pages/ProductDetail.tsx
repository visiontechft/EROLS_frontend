import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Share2, Star, ChevronLeft, ChevronRight,
  Truck, Shield, Package, MessageCircle, ShoppingCart, X, Clock, Check, Hand
} from 'lucide-react';
import { ordersApi } from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { useCities } from '../hooks/useCities';
import { useProduct, useRelatedProducts } from '../hooks/queries/useProduct';
import { Button } from '../components/ui/Button';
import { Badge, StockBadge } from '../components/ui/Badge';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { QuartierSelectModal } from '../components/QuartierSelectModal';
import { ProductGrid } from '../components/ProductCard';
import { toast } from 'react-toastify';

// --- COMPOSANT DE ZOOM HAUTE PRÉCISION (Desktop + Mobile) ---
function ProductImageZoom({ src, alt }: { src: string; alt: string }) {
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [mobileZoom, setMobileZoom] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const LENS_SIZE = 40;

  // Desktop: Souris
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;

    x = Math.max(LENS_SIZE / 2, Math.min(100 - LENS_SIZE / 2, x));
    y = Math.max(LENS_SIZE / 2, Math.min(100 - LENS_SIZE / 2, y));

    setPosition({ x, y });
  };

  // Mobile: Touch
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current || !mobileZoom) return;
    e.preventDefault();

    const touch = e.touches[0];
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    let x = ((touch.clientX - left) / width) * 100;
    let y = ((touch.clientY - top) / height) * 100;

    x = Math.max(LENS_SIZE / 2, Math.min(100 - LENS_SIZE / 2, x));
    y = Math.max(LENS_SIZE / 2, Math.min(100 - LENS_SIZE / 2, y));

    setTouchPosition({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setMobileZoom(true);
    handleTouchMove(e);
  };

  return (
    <div className="relative w-full">
      {/* IMAGE PRINCIPALE */}
      <div 
        ref={containerRef}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setMobileZoom(false)}
        className="relative aspect-square w-full bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border-2 border-gray-100 cursor-crosshair overflow-hidden group touch-none"
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-contain p-8 transition-opacity duration-300"
          style={{ opacity: showZoom || mobileZoom ? 0.7 : 1 }}
        />
        
        {/* Lentille Desktop */}
        {showZoom && (
          <div 
            className="hidden lg:block absolute pointer-events-none border-4 border-orange-500 bg-orange-500/20 shadow-2xl z-10"
            style={{
              width: `${LENS_SIZE}%`,
              height: `${LENS_SIZE}%`,
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        {/* Lentille Mobile */}
        {mobileZoom && (
          <div 
            className="lg:hidden absolute pointer-events-none border-4 border-orange-500 bg-orange-500/20 shadow-2xl z-10 rounded-full"
            style={{
              width: '80px',
              height: '80px',
              left: `${touchPosition.x}%`,
              top: `${touchPosition.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}

        {/* Instruction mobile */}
        {!mobileZoom && (
          <div className="lg:hidden absolute bottom-4 left-0 right-0 text-center">
            <div className="inline-flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm">
              <Hand size={14} /> Touchez pour zoomer
            </div>
          </div>
        )}
      </div>

      {/* ZOOM Desktop (à droite) */}
      {showZoom && (
        <div 
          className="hidden lg:block absolute left-[103%] top-0 w-full h-full z-[100] bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden animate-in fade-in duration-200"
        >
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${src})`,
              backgroundPosition: `${(position.x - LENS_SIZE / 2) * (100 / (100 - LENS_SIZE))}% ${(position.y - LENS_SIZE / 2) * (100 / (100 - LENS_SIZE))}%`,
              backgroundSize: `${(100 / LENS_SIZE) * 100}%`, 
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>
      )}

      {/* ZOOM Mobile (fullscreen overlay) */}
      {mobileZoom && (
        <div className="lg:hidden fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-2xl max-h-2xl">
            <button 
              onClick={() => setMobileZoom(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-xl"
            >
              <X size={20} className="text-gray-900" />
            </button>
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: `${(touchPosition.x - LENS_SIZE / 2) * (100 / (100 - LENS_SIZE))}% ${(touchPosition.y - LENS_SIZE / 2) * (100 / (100 - LENS_SIZE))}%`,
                backgroundSize: `${(100 / LENS_SIZE) * 100}%`, 
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// --- PAGE DE DÉTAIL ---
export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { cities } = useCities();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showCityModal, setShowCityModal] = useState(false);
  const [submittingCityId, setSubmittingCityId] = useState<number | null>(null);

  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: relatedProducts = [] } = useRelatedProducts(slug);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [slug]);

  useEffect(() => {
    if (isError) {
      toast.error('Erreur de chargement');
      navigate('/produits');
    }
  }, [isError, navigate]);

  const handleOrderNow = () => {
    if (!localStorage.getItem('auth_token')) {
      toast.info('Veuillez vous connecter');
      return navigate('/login');
    }
    setShowCityModal(true);
  };

  if (isLoading) return <PageLoader />;
  if (!product) return null;

  const images = product.images?.sort((a, b) => a.order - b.order) || [];
  const currentImage = images[selectedImageIndex] || images[0];
  const imageUrl = currentImage?.url || product.image_url;

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.original_price! - product.price!) / product.original_price!) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8 font-bold">
          <Link to="/" className="text-gray-500 hover:text-orange-500 transition-colors">Accueil</Link>
          <ChevronRight size={16} className="text-gray-400" />
          <Link to="/produits" className="text-gray-500 hover:text-orange-500 transition-colors">Produits</Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-start relative">
          
          {/* COLONNE GAUCHE : IMAGES */}
          <div className="space-y-6">
            <div className="relative">
               {hasDiscount && (
                 <div className="absolute top-4 left-4 z-30 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-black text-lg shadow-xl">
                   -{discountPercent}%
                 </div>
               )}
               
               {imageUrl ? (
                 <ProductImageZoom src={imageUrl} alt={product.name} />
               ) : (
                 <div className="aspect-square w-full bg-gray-100 rounded-2xl border-2 border-gray-100 flex items-center justify-center">
                   <Package className="text-gray-300" size={64} />
                 </div>
               )}
               
               {images.length > 1 && (
                 <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-20 lg:hidden">
                   <button 
                    onClick={() => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl pointer-events-auto hover:bg-white transition-all hover:scale-110"
                   >
                     <ChevronLeft size={24} className="mx-auto text-gray-800" />
                   </button>
                   <button 
                    onClick={() => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl pointer-events-auto hover:bg-white transition-all hover:scale-110"
                   >
                     <ChevronRight size={24} className="mx-auto text-gray-800" />
                   </button>
                 </div>
               )}
            </div>

            {/* MINIATURES */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all ${
                      selectedImageIndex === i 
                        ? 'border-orange-500 ring-2 ring-orange-200 scale-105 shadow-lg' 
                        : 'border-gray-200 hover:border-orange-300 hover:scale-105'
                    }`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* COLONNE DROITE : INFOS */}
          <div className="flex flex-col gap-6">
            
            {/* Badge catégorie */}
            {product.category && (
              <div className="inline-flex w-fit">
                <span className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                  {product.category.name}
                </span>
              </div>
            )}

            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1 text-yellow-500">
                   {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                 </div>
                 <span className="text-gray-500 text-sm font-bold">(4.8/5 • 12 avis)</span>
              </div>
            </div>

            {/* Prix */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-2xl border-2 border-orange-200">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-5xl font-black text-orange-600">
                  {(product.price || 0).toLocaleString()}
                </span>
                <span className="text-2xl font-black text-gray-800">FCFA</span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through font-bold">
                    {(product.original_price || 0).toLocaleString()} FCFA
                  </span>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock && product.stock > 0 ? (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold border-2 border-green-200">
                  <Check size={20} />
                  <span>En stock • {product.stock} disponible(s)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl font-bold border-2 border-red-200">
                  <X size={20} />
                  <span>Rupture de stock</span>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
              <h3 className="font-black text-lg text-gray-900 mb-3 flex items-center gap-2">
                <Package size={20} className="text-orange-500" />
                Description du produit
              </h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantité */}
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-700">Quantité :</span>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 font-black text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <button 
                onClick={() => { addToCart(product, quantity); toast.success(`${quantity} article(s) ajouté(s)`); }}
                disabled={!product.stock || product.stock === 0}
                className="flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <ShoppingCart size={20} /> Ajouter au panier
              </button>
              <button 
                onClick={handleOrderNow}
                disabled={!product.stock || product.stock === 0}
                className="flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <MessageCircle size={20} /> Commander via WhatsApp
              </button>
            </div>

            {/* REASSURANCE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t-2 border-gray-200 mt-4">
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border-2 border-orange-100">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <Clock className="text-orange-600" size={24} />
                </div>
                <span className="text-gray-900 font-black text-sm">Livraison Express</span>
                <span className="text-gray-500 text-xs font-bold">10 min - 1h max</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border-2 border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Shield className="text-green-600" size={24} />
                </div>
                <span className="text-gray-900 font-black text-sm">Paiement Sécurisé</span>
                <span className="text-gray-500 text-xs font-bold">À la livraison</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border-2 border-blue-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Package className="text-blue-600" size={24} />
                </div>
                <span className="text-gray-900 font-black text-sm">Produit Original</span>
                <span className="text-gray-500 text-xs font-bold">Qualité garantie</span>
              </div>
            </div>
          </div>

        </div>

        {/* PRODUITS DE LA MÊME CATÉGORIE */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t-2 border-gray-200">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              Vous aimerez aussi
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>

      {/* Modal de sélection de quartier */}
      <QuartierSelectModal
        isOpen={showCityModal}
        onClose={() => setShowCityModal(false)}
        quartiers={cities}
        submittingId={submittingCityId}
        onSelect={async (city) => {
          try {
            setSubmittingCityId(city.id);
            const res = await ordersApi.initiateOrder({
              product_id: product.id,
              city_id: city.id,
              quantity,
            });
            window.open(res.whatsapp_url, '_blank');
            setShowCityModal(false);
          } catch (error) {
            toast.error('Erreur lors de la commande');
          } finally {
            setSubmittingCityId(null);
          }
        }}
      />
    </div>
  );
}