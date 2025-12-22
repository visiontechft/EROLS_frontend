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
        const productsByCategory = categoriesData.slice(0, 6).map(cat => productsList.find(p => p.category?.id === cat.id)).filter(Boolean) as Product[];
        setCategorizedProducts(productsByCategory);
      } catch (error) {
        toast.error('Erreur de chargement');
      } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % Math.max(categorizedProducts.length, 1));
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
  const currentProduct = categorizedProducts[currentProductIndex];
  const currentMessage = messages[currentMessageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Max Width Increased to reduce side gaps */}
      <section className="bg-gray-900 py-6 lg:py-10">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
            
            {/* Left Column: Message Carousel with Clear Image + Overlay */}
            <div className="relative h-[350px] lg:h-[520px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&fit=crop"
                alt="Shopping"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay léger et élégant */}
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

            {/* Right Column: Product Carousel */}
            {currentProduct && (
              <div className="relative h-[350px] lg:h-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">
                {/* Product Image Side */}
                <div className="w-1/2 bg-gray-50 flex items-center justify-center p-6 relative">
                  <img src={currentProduct.image_url} alt={currentProduct.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
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

                  {/* Buttons Grid - Harmonized */}
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

                {/* Navigation Controls */}
                <button onClick={() => setCurrentProductIndex(prev => prev === 0 ? categorizedProducts.length - 1 : prev - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-lg rounded-full flex items-center justify-center hover:bg-white z-10">
                  <ChevronLeft className="text-gray-800" />
                </button>
                <button onClick={() => setCurrentProductIndex(prev => (prev + 1) % categorizedProducts.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-lg rounded-full flex items-center justify-center hover:bg-white z-10">
                  <ChevronRight className="text-gray-800" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[{ icon: Shield, t: 'Paiement sécurisé', d: 'Transactions 100% sûres' }, { icon: Truck, t: 'Livraison rapide', d: 'En 2-3 semaines' }, { icon: TrendingUp, t: 'Meilleurs prix', d: 'Tarifs imbattables' }, { icon: Headphones, t: 'Support 24/7', d: 'À votre écoute' }].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-transparent hover:border-orange-200 transition-all">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <item.icon size={28} />
              </div>
              <h3 className="font-bold text-gray-900">{item.t}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.d}</p>
            </div>
          ))}
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
      {showCityModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowCityModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-gray-900"><X /></button>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <MapPin className="text-orange-500" /> Votre Ville ?
            </h3>
            <p className="text-gray-500 mb-6">Sélectionnez votre ville pour finaliser la commande sur WhatsApp.</p>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {cities.map(city => (
                <button 
                  key={city.id} 
                  onClick={async () => {
                    const res = await ordersApi.initiateOrder({ product_id: selectedProduct!.id, city_id: city.id, quantity: 1 });
                    window.open(res.whatsapp_url, '_blank');
                    setShowCityModal(false);
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