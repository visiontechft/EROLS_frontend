import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge, StockBadge } from './ui/Badge';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({
  product,
  showQuickView = false,
  onQuickView,
}: ProductCardProps) {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickView?.(product);
  };

  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
  const hasDiscount = product.original_price && product.original_price > product.price;

  return (
    <Link
      to={`/produits/${product.slug}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={primaryImage?.url || '/placeholder-product.jpg'}
          alt={primaryImage?.alt_text || product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {!product.is_available && (
            <Badge variant="danger">Indisponible</Badge>
          )}
          {product.is_featured && (
            <Badge variant="primary">Vedette</Badge>
          )}
          {hasDiscount && (
            <Badge variant="success">-{product.discount_percentage}%</Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {showQuickView && onQuickView && (
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Aperçu rapide"
            >
              <Eye className="h-5 w-5 text-gray-700" />
            </button>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute bottom-2 left-2">
          <StockBadge stock={product.stock} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category.name}
        </p>

        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 flex-grow">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              {product.rating.toFixed(1)}
            </span>
            {product.review_count && (
              <span className="text-xs text-gray-500">
                ({product.review_count})
              </span>
            )}
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {product.original_price?.toLocaleString('fr-FR')} FCFA
              </span>
            )}
            <span className="text-lg font-bold text-orange-500">
              {product.price.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.is_available || product.stock === 0}
            variant={isInCart(product.id) ? 'secondary' : 'primary'}
            leftIcon={<ShoppingCart className="h-4 w-4" />}
            className="whitespace-nowrap"
          >
            {isInCart(product.id) ? 'Ajouté' : 'Ajouter'}
          </Button>
        </div>
      </div>
    </Link>
  );
}

// Product Grid Component
interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  showQuickView?: boolean;
  onQuickView?: (product: Product) => void;
}

export function ProductGrid({
  products,
  isLoading = false,
  showQuickView,
  onQuickView,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-9 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
