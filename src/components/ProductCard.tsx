import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, Package, Plus, Check, Tag, Flame, Sparkles } from 'lucide-react';
import { StockBadge } from './ui/Badge';
import { ProductImage } from './ProductImage';
import { useCart } from '../contexts/CartContext';
import { usePrefetchProduct } from '../hooks/queries/useProduct';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
  onQuickView?: (product: Product) => void;
}

const NEW_THRESHOLD_DAYS = 14;

export const ProductCard = React.memo(function ProductCard({
  product,
  showQuickView = false,
  onQuickView,
}: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const prefetchProduct = usePrefetchProduct();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickView?.(product);
  };

  // DRF serializes DecimalField as a JSON string (e.g. "3000.00"), so price/original_price
  // can arrive as strings at runtime despite the TS type — coerce before comparing/formatting.
  const toNumber = (value: number | string) => (typeof value === 'string' ? parseFloat(value) : value);
  const price = toNumber(product.price);
  const originalPrice = product.original_price ? toNumber(product.original_price) : undefined;
  const hasDiscount = originalPrice !== undefined && originalPrice > price;
  const isNew =
    !!product.created_at &&
    (Date.now() - new Date(product.created_at).getTime()) / 86_400_000 <= NEW_THRESHOLD_DAYS;
  const isOutOfStock = !product.is_available || product.stock === 0;
  const inCart = isInCart(product.id);

  return (
    <Link
      to={`/produits/${product.slug}`}
      onMouseEnter={() => prefetchProduct(product.slug)}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image Container — uniform 1:1 ratio so every card lines up */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ProductImage
          src={product.image_url}
          webpSrc={product.image_url_webp}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 group-active:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {isOutOfStock ? (
            <span className="inline-flex items-center rounded-full bg-gray-900/85 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              Indisponible
            </span>
          ) : (
            <>
              {hasDiscount && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                  <Tag className="h-3 w-3" />
                  -{product.discount_percentage}%
                </span>
              )}
              {product.is_featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                  <Flame className="h-3 w-3" />
                  Best-seller
                </span>
              )}
              {!product.is_featured && isNew && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  Nouveau
                </span>
              )}
            </>
          )}
        </div>

        {/* Quick view (desktop hover) */}
        {showQuickView && onQuickView && (
          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Aperçu rapide"
            >
              <Eye className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        )}

        {/* Stock warning — only surfaced when it actually matters */}
        {!isOutOfStock && product.stock <= 5 && (
          <div className="absolute bottom-2.5 left-2.5">
            <StockBadge stock={product.stock} />
          </div>
        )}

        {/* Floating add-to-cart button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label={inCart ? 'Ajouté au panier' : 'Ajouter au panier'}
          className={`absolute bottom-2.5 right-2.5 h-10 w-10 flex items-center justify-center rounded-full shadow-lg ring-2 ring-white transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed ${
            inCart
              ? 'bg-green-500 text-white'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {inCart ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Category */}
        <p className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">
          {product.category?.name || 'Sans catégorie'}
        </p>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1.5 line-clamp-2 flex-grow">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-1.5">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
            <span className="text-xs font-medium text-gray-700">
              {product.rating.toFixed(1)}
            </span>
            {product.review_count && (
              <span className="text-xs text-gray-500">
                ({product.review_count})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-2 border-t border-gray-100">
          {hasDiscount && (
            <span className="block text-xs text-gray-400 line-through tabular-nums">
              {originalPrice!.toLocaleString('fr-FR')} FCFA
            </span>
          )}
          <span className="block text-xl font-black text-orange-500 tabular-nums">
            {price.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      </div>
    </Link>
  );
});

// Product Grid Component
interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  showQuickView?: boolean;
  onQuickView?: (product: Product) => void;
}

export function ProductGrid({
  products = [],
  isLoading = false,
  showQuickView,
  onQuickView,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-gray-200" />
            <div className="p-3 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || !Array.isArray(products)) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">Aucun produit disponible</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucun produit trouvé
        </h3>
        <p className="text-gray-600">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showQuickView={showQuickView}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}