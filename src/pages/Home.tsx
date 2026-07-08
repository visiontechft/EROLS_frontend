import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Wallet, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { productsApi, categoriesApi, ordersApi } from '../lib/api';
import { ProductGrid } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { QuartierSelectModal } from '../components/QuartierSelectModal';
import { useCart } from '../contexts/CartContext';
import { useCities } from '../hooks/useCities';
import type { Product, Category } from '../types';
import { toast } from 'react-toastify';

export function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { cities } = useCities();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorizedProducts, setCategorizedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [submittingCityId, setSubmittingCityId] = useState<number | null>(null);

  const messages = [
    { title: "Achetez vos produits chinois", subtitle: "Disponibles à Bafoussam, à des prix imbattables", icon: ShoppingBag },
    { title: "Recevez vos produits", subtitle: "À domicile ou dans un point de retrait de votre quartier", icon: Truck },
    { title: "Payez à la livraison", subtitle: "Sans inquiétude, en toute sécurité", icon: Wallet }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesData] = await Promise.all([
          productsApi.getProducts({ page_size: 20 }),
          categoriesApi.getCategories(),
        ]);

        const productsList = productsResponse.results || [];
        setProducts(productsList);
        setCategories(categoriesData.slice(0, 6));

        // FIX 1: Utiliser directement les premiers produits si pas de correspondance par catégorie
        const productsByCategory = categoriesData.slice(0, 6)
          .map(cat => productsList.find(p => p.category?.id === cat.id))
          .filter(Boolean) as Product[];
        
        // FIX 2: Si aucun produit trouvé par catégorie, prendre les premiers produits disponibles
        const finalProducts = productsByCategory.length > 0 
          ? productsByCategory 
          : productsList.slice(0, 6);
        
        setCategorizedProducts(finalProducts);
        
        // DEBUG: Log pour vérifier
        console.log('Products loaded:', productsList.length);
        console.log('Categorized products:', finalProducts.length);
        
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Erreur de chargement');
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // FIX 3: Ne démarrer le timer que si on a des produits
    if (categorizedProducts.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % categorizedProducts.length);
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [categorizedProducts.length]);

  const handleOrderNow = (product: Product) => {
    if (!localStorage.getItem('auth_token')) {
      toast.info('Veuillez vous connecter');
      return navigate('/login');
    }
    setSelectedProduct(product);
    setShowCityModal(true);
  };

  if (isLoading) return <PageLoader />;
  
  // FIX 4: Vérifier explicitement que le produit existe
  const currentProduct = categorizedProducts[currentProductIndex];
  const currentMessage = messages[currentMessageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 py-4 lg:py-10">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">

          {/* Mobile only: bandeau compact, pas de carrousel produit */}
          <div className="lg:hidden relative h-[220px] rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&fit=crop"
              alt="Shopping"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

            <div className="relative h-full flex flex-col justify-center p-5 z-10 space-y-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <currentMessage.icon className="text-white" size={26} />
              </div>
              <h1 className="text-xl font-black text-white leading-tight">
                {currentMessage.title}
              </h1>
              <p className="text-sm text-white/90 font-medium">
                {currentMessage.subtitle}
              </p>
              <Button
                onClick={() => navigate('/produits')}
                className="w-fit bg-orange-500 hover:bg-orange-600 text-white border-none h-10 px-5 rounded-full text-sm font-bold shadow-lg"
              >
                Découvrir <ArrowRight className="ml-1" size={16} />
              </Button>
            </div>
          </div>

          {/* Desktop only: hero riche avec produit vedette */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">

            {/* Left Column: Message Carousel */}
            <div className="relative h-[520px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&fit=crop"
                alt="Shopping"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

              <div className="relative h-full flex flex-col justify-center p-8 lg:p-14 z-10 space-y-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <currentMessage.icon className="text-white" size={40} />
                </div>
                <div className="space-y-4">
                  <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight">
                    {currentMessage.title}
                  </h1>
                  <p className="text-lg lg:text-2xl text-white/90 font-medium max-w-lg">
                    {currentMessage.subtitle}
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/produits')}
                  className="w-fit bg-orange-500 hover:bg-orange-600 text-white border-none h-14 px-8 rounded-full text-lg font-bold shadow-lg"
                >
                  Découvrir maintenant <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>

            {/* Right Column: Product Carousel - FIX 5: Ajouter une condition de rendu */}
            {currentProduct ? (
              <div className="relative h-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">
                {/* Product Image Side */}
                <div className="w-1/2 bg-gray-50 flex items-center justify-center p-6 relative">
                  <ProductImage
                    src={currentProduct.image_url}
                    alt={currentProduct.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {currentProduct.category?.name || 'Produit'}
                  </div>
                </div>

                {/* Product Info Side */}
                <div className="w-1/2 p-6 lg:p-10 flex flex-col">
                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg lg:text-2xl font-bold text-gray-900 line-clamp-2 uppercase">
                      {currentProduct.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl lg:text-4xl font-black text-orange-600">
                        {currentProduct.price.toLocaleString('fr-FR')}
                      </span>
                      <span className="text-sm lg:text-lg font-bold text-gray-900">FCFA</span>
                    </div>
                    <p className="text-green-600 font-bold text-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span> Stock disponible
                    </p>
                  </div>

                  {/* Buttons Grid */}
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    <button 
                      onClick={() => { addToCart(currentProduct, 1); toast.success('Ajouté au panier'); }}
                      className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all text-sm"
                    >
                      <ShoppingCart size={18} /> Ajouter au panier
                    </button>
                    <button 
                      onClick={() => handleOrderNow(currentProduct)}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all text-sm"
                    >
                      <MessageCircle size={18} /> Commander via WhatsApp
                    </button>
                    <button 
                      onClick={() => navigate(`/produits/${currentProduct.slug}`)}
                      className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm"
                    >
                      <Eye size={18} /> Voir les détails
                    </button>
                  </div>
                </div>

                {/* Navigation Controls - FIX 6: Désactiver si un seul produit */}
                {categorizedProducts.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentProductIndex(prev => prev === 0 ? categorizedProducts.length - 1 : prev - 1)} 
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-lg rounded-full flex items-center justify-center hover:bg-white z-10"
                    >
                      <ChevronLeft className="text-gray-800" />
                    </button>
                    <button 
                      onClick={() => setCurrentProductIndex(prev => (prev + 1) % categorizedProducts.length)} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-lg rounded-full flex items-center justify-center hover:bg-white z-10"
                    >
                      <ChevronRight className="text-gray-800" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              // FIX 7: Afficher un placeholder si aucun produit
              <div className="relative h-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <ShoppingCart size={48} className="mx-auto mb-4" />
                  <p>Chargement des produits...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-8 lg:py-16 max-w-8xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Nos nouveaux arrivages</h2>
            <p className="text-gray-500 mt-2">Découvrez les dernières tendances sélectionnées pour vous</p>
          </div>
          <Link to="/produits" className="text-orange-600 font-bold flex items-center gap-2 hover:underline">
            Voir tout <ArrowRight size={20} />
          </Link>
        </div>
        <ProductGrid products={products.slice(0, 12)} />
      </section>

      {/* Modal de sélection de quartier */}
      {selectedProduct && (
        <QuartierSelectModal
          isOpen={showCityModal}
          onClose={() => setShowCityModal(false)}
          quartiers={cities}
          submittingId={submittingCityId}
          onSelect={async (city) => {
            try {
              setSubmittingCityId(city.id);
              const res = await ordersApi.initiateOrder({
                product_id: selectedProduct.id,
                city_id: city.id,
                quantity: 1,
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
      )}
    </div>
  );
}