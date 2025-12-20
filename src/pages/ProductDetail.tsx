import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  Package,
  MessageCircle,
  ShoppingCart,
} from 'lucide-react';
import { productsApi, citiesApi, ordersApi } from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/Button';
import { Badge, StockBadge } from '../components/ui/Badge';
import { PageLoader } from '../components/ui/LoadingSpinner';
import type { Product, City } from '../types';
import { toast } from 'react-toastify';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors du chargement des données');
        navigate('/produits');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success('Produit ajouté au panier');
    }
  };

  const handleOrderClick = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast.info('Veuillez vous connecter pour commander');
      navigate('/login', { state: { from: `/produits/${slug}` } });
      return;
    }
    setShowCitySelector(true);
  };

  const handleCitySelect = async (city: City) => {
    if (!product) return;

    try {
      setIsOrdering(true);
      setSelectedCity(city);

      // Initier la commande pour ce produit uniquement
      const response = await ordersApi.initiateOrder({
        product_id: product.id,
        city_id: city.id,
        quantity: quantity,
      });

      toast.success(`Redirection vers WhatsApp ${city.name}...`);
      window.open(response.whatsapp_url, '_blank');

      setTimeout(() => {
        setShowCitySelector(false);
        setSelectedCity(null);
      }, 2000);
    } catch (error: any) {
      console.error('Error initiating order:', error);
      toast.error(error.message || 'Erreur lors de l\'initiation de la commande');
    } finally {
      setIsOrdering(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!product) {
    return null;
  }

  const images = product.images?.sort((a, b) => a.order - b.order) || [];
  const currentImage = images[selectedImageIndex] || images[0];
  const hasDiscount = product.original_price && product.original_price > (product.price || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-orange-500">Accueil</Link>
          <span>/</span>
          <Link to="/produits" className="hover:text-orange-500">Produits</Link>
          <span>/</span>
          <Link
            to={`/produits?category=${product.category?.slug}`}
            className="hover:text-orange-500"
          >
            {product.category?.name || 'Catégorie'}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src={currentImage?.url || product.image_url || '/placeholder-product.jpg'}
                alt={currentImage?.alt_text || product.name}
                className="w-full h-full object-contain"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {!product.is_available && <Badge variant="danger">Indisponible</Badge>}
                {product.is_featured && <Badge variant="primary">Vedette</Badge>}
                {hasDiscount && (
                  <Badge variant="success">-{product.discount_percentage || 0}%</Badge>
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? 'border-orange-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <Link
                to={`/produits?category=${product.category?.slug}`}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                {product.category?.name || 'Catégorie'}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            </div>

            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.rating!)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {product.rating.toFixed(1)}
                </span>
                {product.review_count && (
                  <span className="text-sm text-gray-500">
                    ({product.review_count} avis)
                  </span>
                )}
              </div>
            )}

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-orange-500">
                {(product.price || 0).toLocaleString('fr-FR')} FCFA
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">
                  {(product.original_price || 0).toLocaleString('fr-FR')} FCFA
                </span>
              )}
            </div>

            <StockBadge stock={product.stock || 0} />

            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600">{product.description}</p>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Caractéristiques</h3>
                <dl className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <dt className="text-gray-600">{key}:</dt>
                      <dd className="text-gray-900 font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Action Buttons */}
            {showCitySelector ? (
              <div className="bg-white border-2 border-orange-500 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    Choisissez votre ville
                  </h3>
                  <button
                    onClick={() => setShowCitySelector(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Sélectionnez votre ville pour être redirigé vers WhatsApp et finaliser votre commande
                </p>
                <div className="grid gap-3">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      disabled={isOrdering && selectedCity?.id === city.id}
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        <span className="font-medium text-gray-900">{city.name}</span>
                      </div>
                      {isOrdering && selectedCity?.id === city.id ? (
                        <span className="text-sm text-orange-500">Redirection...</span>
                      ) : (
                        <MessageCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={!product.is_available || (product.stock || 0) === 0}
                    leftIcon={<ShoppingCart className="h-5 w-5" />}
                  >
                    Ajouter au panier
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleShare}
                    className="px-6"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  fullWidth
                  onClick={handleOrderClick}
                  disabled={!product.is_available || (product.stock || 0) === 0}
                  leftIcon={<MessageCircle className="h-5 w-5" />}
                >
                  Acheter maintenant via WhatsApp
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 pt-6 border-t">
              {[
                {
                  icon: Truck,
                  title: 'Livraison rapide',
                  description: '2-3 semaines',
                },
                {
                  icon: Shield,
                  title: 'Paiement sécurisé',
                  description: 'Transaction 100% sécurisée',
                },
                {
                  icon: Package,
                  title: 'Produit authentique',
                  description: 'Importé des USA',
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}