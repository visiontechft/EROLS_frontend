import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Truck, Headphones, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight, MapPin, X, Eye } from 'lucide-react';
import { productsApi, categoriesApi, citiesApi, ordersApi } from '../lib/api';
import { ProductGrid } from '../components/ProductCard';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { useCart } from '../contexts/CartContext';
import type { Product, Category, City } from '../types';
import { toast } from 'react-toastify';

export function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorizedProducts, setCategorizedProducts] = useState<Product[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const messages = [
    { title: "Achetez vos produits chinois", subtitle: "Étant au Cameroun à des prix imbattables", icon: "🛍️" },
    { title: "Recevez vos produits", subtitle: "À domicile ou dans un point de retrait de votre choix", icon: "🚚" },
    { title: "Payez à la livraison", subtitle: "Sans inquiétude, en toute sécurité", icon: "💰" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesData, citiesData] = await Promise.all([
          productsApi.getProducts({ page_size: 20 }),
          categoriesApi.getCategories(),
          citiesApi.getCities(),
        ]);
        
        const productsList = productsResponse.results || [];
        setProducts(productsList);
        setCategories(categoriesData.slice(0, 6));
        setCities(citiesData);
        
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
      <section className="bg-gray-900 py-6 lg:py-10">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
            
            {/* Left Column: Message Carousel */}
            <div className="relative h-[350px] lg:h-[520px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&fit=crop"
                alt="Shopping"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

              <div className="relative h-full flex flex-col justify-center p-8 lg:p-14 z-10 space-y-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-5xl">
                  {currentMessage.icon}
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
              <div className="relative h-[350px] lg:h-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">
                {/* Product Image Side */}
                <div className="w-1/2 bg-gray-50 flex items-center justify-center p-6 relative">
                  <img 
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
              <div className="relative h-[350px] lg:h-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <ShoppingCart size={48} className="mx-auto mb-4" />
                  <p>Chargement des produits...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Roadmap Section - Comment acheter */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* En-tête */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">
              Comment passer votre commande ?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Suivez ces étapes simples pour recevoir vos produits chinois au Cameroun en toute sécurité
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Ligne de connexion - cachée sur mobile */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 mx-auto" style={{width: 'calc(100% - 200px)', marginLeft: '100px'}}></div>
            
            {/* Étapes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              
              {/* Étape 1 */}
              <div className="relative flex flex-col items-center">
                <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-xl mb-6 ring-4 ring-orange-100">
                  1
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100 hover:border-orange-300 transition-all h-full w-full">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Eye className="text-orange-600" size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">
                    Naviguez et choisissez
                  </h3>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    Parcourez notre catalogue et sélectionnez le(s) produit(s) qui vous intéresse(nt)
                  </p>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="relative flex flex-col items-center">
                <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-xl mb-6 ring-4 ring-orange-100">
                  2
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100 hover:border-orange-300 transition-all h-full w-full">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <ShoppingCart className="text-orange-600" size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">
                    Ajoutez au panier
                  </h3>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    Choisissez un ou plusieurs produits, personnalisez les quantités selon vos besoins
                  </p>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="relative flex flex-col items-center">
                <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-xl mb-6 ring-4 ring-orange-100">
                  3
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100 hover:border-orange-300 transition-all h-full w-full">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <MessageCircle className="text-orange-600" size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">
                    Commandez via WhatsApp
                  </h3>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    Cliquez sur "Commander" et sélectionnez votre ville pour finaliser sur WhatsApp
                  </p>
                </div>
              </div>

              {/* Étape 4 */}
              <div className="relative flex flex-col items-center">
                <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-xl mb-6 ring-4 ring-green-100">
                  4
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100 hover:border-green-300 transition-all h-full w-full">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Truck className="text-green-600" size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">
                    Recevez et payez
                  </h3>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    Paiement à la livraison à domicile ou dans un point de retrait de votre choix
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* CTA Final */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border-2 border-orange-200">
              <Shield className="text-green-600" size={20} />
              <span className="font-bold text-gray-900">Paiement 100% sécurisé à la livraison</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
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

      {/* City Selection Modal */}
      {showCityModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowCityModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-gray-900">
              <X />
            </button>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <MapPin className="text-orange-500" /> Votre Ville ?
            </h3>
            <p className="text-gray-500 mb-6">Sélectionnez votre ville pour finaliser la commande sur WhatsApp.</p>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {cities.map(city => (
                <button 
                  key={city.id} 
                  onClick={async () => {
                    try {
                      const res = await ordersApi.initiateOrder({ 
                        product_id: selectedProduct.id, 
                        city_id: city.id, 
                        quantity: 1 
                      });
                      window.open(res.whatsapp_url, '_blank');
                      setShowCityModal(false);
                    } catch (error) {
                      toast.error('Erreur lors de la commande');
                    }
                  }}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 flex justify-between items-center transition-all group"
                >
                  <span className="font-bold text-gray-800">{city.name}</span>
                  <MessageCircle className="text-gray-300 group-hover:text-green-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}