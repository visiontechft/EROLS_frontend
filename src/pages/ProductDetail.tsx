import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  Package,
} from 'lucide-react';
import { productsApi } from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/Button';
import { Badge, StockBadge } from '../components/ui/Badge';
import { PageLoader } from '../components/ui/LoadingSpinner';
import type { Product } from '../types';
import { toast } from 'react-toastify';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const data = await productsApi.getProduct(slug);
        setProduct(data);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast.error('Erreur lors du chargement du produit');
        navigate('/produits');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/panier');
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

  const images = product.images.sort((a, b) => a.order - b.order);
  const currentImage = images[selectedImageIndex] || images[0];
  const hasDiscount = product.original_price && product.original_price > product.price;
  const inCartQuantity = getItemQuantity(product.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-orange-500">
            Accueil
          </Link>
          <span>/</span>
          <Link to="/produits" className="hover:text-orange-500">
            Produits
          </Link>
          <span>/</span>
          <Link
            to={`/produits?category=${product.category.slug}`}
            className="hover:text-orange-500"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src={currentImage?.url || '/placeholder-product.jpg'}
                alt={currentImage?.alt_text || product.name}
                className="w-full h-full object-contain"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {!product.is_available && (
                  <Badge variant="danger">Indisponible</Badge>
                )}
                {product.is_featured && <Badge variant="primary">Vedette</Badge>}
                {hasDiscount && (
                  <Badge variant="success">-{product.discount_percentage}%</Badge>
                )}
              </div>

              {/* Navigation Arrows */}
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

            {/* Thumbnails */}
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
            {/* Title and Category */}
            <div>
              <Link
                to={`/produits?category=${product.category.slug}`}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                {product.category.name}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
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

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-orange-500">
                {product.price.toLocaleString('fr-FR')} FCFA
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">
                  {product.original_price?.toLocaleString('fr-FR')} FCFA
                </span>
              )}
            </div>

            {/* Stock Status */}
            <StockBadge stock={product.stock} />

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Caractéristiques
                </h3>
                <dl className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between text-sm"
                    >
                      <dt className="text-gray-600">{key}:</dt>
                      <dd className="text-gray-900 font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Quantity Selector */}
            {product.is_available && product.stock > 0 && (
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantité:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                {inCartQuantity > 0 && (
                  <span className="text-sm text-gray-600">
                    ({inCartQuantity} déjà dans le panier)
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={!product.is_available || product.stock === 0}
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
                onClick={handleBuyNow}
                disabled={!product.is_available || product.stock === 0}
              >
                Acheter maintenant
              </Button>
            </div>

            {/* Features */}
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
                    <p className="text-sm font-medium text-gray-900">
                      {feature.title}
                    </p>
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
