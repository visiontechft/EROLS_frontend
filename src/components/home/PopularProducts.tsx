import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Eye } from 'lucide-react';
import { ProductImage } from '../ProductImage';
import { StockBadge } from '../ui/Badge';
import { ProductQuickViewModal } from './ProductQuickViewModal';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../hooks/useWishlist';
import { toast } from 'react-toastify';
import type { Product } from '../../types';

interface PopularProductsProps {
  products: Product[];
}

const NEW_THRESHOLD_DAYS = 14;

function isRecent(createdAt: string) {
  const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days <= NEW_THRESHOLD_DAYS;
}

export function PopularProducts({ products }: PopularProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (products.length === 0) return null;

  const scrollBy = (direction: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-2">
              À la une
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Produits populaires</h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Précédent"
              className="h-11 w-11 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Suivant"
              className="h-11 w-11 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="snap-start shrink-0 w-[240px] sm:w-[260px]"
            >
              <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <Link to={`/produits/${product.slug}`} className="block">
                  <div className="relative aspect-square bg-gray-50">
                    <ProductImage
                      src={product.image_url}
                      webpSrc={product.image_url_webp}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isRecent(product.created_at) && (
                      <span className="absolute top-3 left-3 rounded-full bg-gray-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                        Nouveau
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <StockBadge stock={product.stock} />
                    </div>
                  </div>
                </Link>

                {/* Quick actions */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product.id);
                  }}
                  aria-label="Ajouter aux favoris"
                  className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isWishlisted(product.id) ? 'fill-orange-500 text-orange-500' : 'text-gray-600'
                    }`}
                  />
                </button>
                <button
                  onClick={() => setQuickViewProduct(product)}
                  aria-label="Aperçu rapide"
                  className="absolute top-14 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>

                <div className="p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-1">
                    {product.category?.name || 'EROLS'}
                  </p>
                  <Link to={`/produits/${product.slug}`}>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-gray-900">
                      {product.price.toLocaleString('fr-FR')}
                      <span className="text-xs font-bold text-gray-500"> FCFA</span>
                    </span>
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        toast.success('Ajouté au panier');
                      }}
                      disabled={!product.is_available || product.stock === 0}
                      aria-label="Ajouter au panier"
                      className="h-9 w-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-orange-500 transition-colors disabled:opacity-40"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ProductQuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
}
