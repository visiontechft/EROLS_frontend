import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Share2, Star, ChevronLeft, ChevronRight, 
  Truck, Shield, Package, MessageCircle, ShoppingCart 
} from 'lucide-react';
import { productsApi, citiesApi, ordersApi } from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/Button';
import { Badge, StockBadge } from '../components/ui/Badge';
import { PageLoader } from '../components/ui/LoadingSpinner';
import type { Product, City } from '../types';
import { toast } from 'react-toastify';

// --- COMPOSANT DE ZOOM HAUTE PRÉCISION ---
function ProductImageZoom({ src, alt }: { src: string; alt: string }) {
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // RÉGLAGES : Ajustez ces valeurs pour changer l'intensité
  const LENS_SIZE = 40; // Taille du carré orange en % (plus petit = plus de zoom)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Calcul de la position de la souris en %
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;

    // Bloquer le curseur pour que la lentille ne sorte pas des bords
    x = Math.max(LENS_SIZE / 2, Math.min(100 - LENS_SIZE / 2, x));
    y = Math.max(LENS_SIZE / 2, Math.min(100 - LENS_SIZE / 2, y));

    setPosition({ x, y });
  };

  return (
    <div className="relative w-full">
      {/* IMAGE SOURCE */}
      <div 
        ref={containerRef}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-square w-full bg-white rounded-xl shadow-md border border-gray-100 cursor-crosshair overflow-hidden group"
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-contain transition-opacity duration-300"
          style={{ opacity: showZoom ? 0.7 : 1 }}
        />
        
        {/* LENTILLE (Le carré orange) */}
        {showZoom && (
          <div 
            className="hidden lg:block absolute pointer-events-none border-2 border-orange-500 bg-orange-500/10 shadow-xl z-10"
            style={{
              width: `${LENS_SIZE}%`,
              height: `${LENS_SIZE}%`,
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </div>

      {/* CADRAN DE ZOOM DÉPORTÉ (S'affiche à droite) */}
      {showZoom && (
        <div 
          className="hidden lg:block absolute left-[103%] top-0 w-full h-full z-[100] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in duration-200"
        >
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${src})`,
              // Calcul mathématique pour synchroniser parfaitement la vue
              backgroundPosition: `${(position.x - LENS_SIZE / 2) * (100 / (100 - LENS_SIZE))}% ${(position.y - LENS_SIZE / 2) * (100 / (100 - LENS_SIZE))}%`,
              backgroundSize: `${(100 / LENS_SIZE) * 100}%`, 
              backgroundRepeat: 'no-repeat'
            }}
          />
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

  const [product, setProduct] = useState<Product | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        setIsLoading(true);
        const [productData, citiesData] = await Promise.all([
          productsApi.getProduct(slug),
          citiesApi.getCities(),
        ]);
        setProduct(productData);
        setCities(citiesData);
      } catch (error) {
        toast.error('Erreur de chargement');
        navigate('/produits');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug, navigate]);

  if (isLoading) return <PageLoader />;
  if (!product) return null;

  const images = product.images?.sort((a, b) => a.order - b.order) || [];
  const currentImage = images[selectedImageIndex] || images[0];
  const imageUrl = currentImage?.url || product.image_url || '/placeholder-product.jpg';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8 font-medium">
          <Link to="/" className="hover:text-orange-500 transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/produits" className="hover:text-orange-500 transition-colors">Produits</Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-start relative">
          
          {/* COLONNE GAUCHE : IMAGES */}
          <div className="space-y-6">
            <div className="relative">
               <ProductImageZoom src={imageUrl} alt={product.name} />
               
               {/* Flèches de navigation */}
               {images.length > 1 && (
                 <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none z-20 lg:hidden">
                   <button 
                    onClick={() => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="p-2 bg-white/90 rounded-full shadow-lg pointer-events-auto"
                   >
                     <ChevronLeft size={24} />
                   </button>
                   <button 
                    onClick={() => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="p-2 bg-white/90 rounded-full shadow-lg pointer-events-auto"
                   >
                     <ChevronRight size={24} />
                   </button>
                 </div>
               )}
            </div>

            {/* MINIATURES */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-24 h-24 flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all ${
                    selectedImageIndex === i ? 'border-orange-500 scale-105 shadow-md' : 'border-gray-200 hover:border-orange-200'
                  }`}
                >
                  <img src={img.url} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* COLONNE DROITE : INFOS */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 leading-tight uppercase">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-yellow-500">
                 {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                 <span className="text-gray-400 text-sm ml-2 font-medium">(12 avis)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="bg-orange-50 px-4 py-2 rounded-lg">
                  <span className="text-4xl font-black text-orange-600">
                    {(product.price || 0).toLocaleString()} FCFA
                  </span>
               </div>
               {product.original_price! > product.price! && (
                 <span className="text-xl text-gray-400 line-through font-bold">
                   {(product.original_price || 0).toLocaleString()} FCFA
                 </span>
               )}
            </div>

            <StockBadge stock={product.stock || 0} />
            
            <div className="border-l-4 border-orange-500 pl-4 py-2 bg-white shadow-sm rounded-r-lg">
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Button size="lg" className="h-16 text-lg font-bold" onClick={() => addToCart(product, 1)}>
                <ShoppingCart className="mr-2" /> Panier
              </Button>
              <Button size="lg" variant="secondary" className="h-16 text-lg font-bold bg-green-600 hover:bg-green-700 text-white border-none">
                <MessageCircle className="mr-2" /> WhatsApp
              </Button>
            </div>

            {/* REASSURANCE */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-200 mt-4">
              <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                <Truck size={18} className="text-orange-500" /> Livraison 2-3 sem.
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                <Shield size={18} className="text-orange-500" /> Paiement Sécurisé
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                <Package size={18} className="text-orange-500" /> Original USA
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}