import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Percent } from 'lucide-react';
import { ProductImage } from '../ProductImage';
import type { Product } from '../../types';

interface DealsSectionProps {
  products: Product[];
}

/**
 * Renders only when real discounted products exist (original_price > price).
 * No countdown timer here — with no real expiry date behind these prices, a
 * fake countdown would just be a manipulative urgency trick.
 */
export function DealsSection({ products }: DealsSectionProps) {
  const deals = products.filter((p) => p.original_price && p.original_price > p.price);
  if (deals.length === 0) return null;

  return (
    <section className="bg-gray-900 py-16 lg:py-24">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="h-11 w-11 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Percent className="h-5 w-5 text-orange-400" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white">Offres spéciales</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {deals.slice(0, 8).map((product, i) => {
            const percent = Math.round(
              ((product.original_price! - product.price) / product.original_price!) * 100
            );
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={`/produits/${product.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <ProductImage
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">
                      -{percent}%
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-orange-600">
                        {product.price.toLocaleString('fr-FR')}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {product.original_price!.toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-orange-400 transition-colors"
          >
            Voir toutes les offres <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
