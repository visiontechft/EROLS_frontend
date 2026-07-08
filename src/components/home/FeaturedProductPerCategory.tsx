import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { ProductImage } from '../ProductImage';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-toastify';
import type { Product } from '../../types';

interface FeaturedProductPerCategoryProps {
  products: Product[];
}

export function FeaturedProductPerCategory({ products }: FeaturedProductPerCategoryProps) {
  const { addToCart } = useCart();

  if (products.length === 0) return null;

  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <p className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-2">
          Le meilleur de chaque catégorie
        </p>
        <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Nos coups de cœur</h2>
      </motion.div>

      <div className="space-y-6 lg:space-y-8">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col ${
              i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
            } items-center gap-8 lg:gap-14 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-10`}
          >
            <div className="w-full lg:w-2/5 aspect-square lg:aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
              <ProductImage
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            </div>

            <div className="w-full lg:w-3/5 space-y-4">
              <span className="inline-block rounded-full bg-orange-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
                {product.category?.name}
              </span>
              <h3 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                {product.name}
              </h3>
              <p className="text-gray-600 line-clamp-2 max-w-xl">{product.description}</p>
              <p className="text-3xl font-black text-gray-900">
                {product.price.toLocaleString('fr-FR')}{' '}
                <span className="text-base font-bold text-gray-500">FCFA</span>
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => {
                    addToCart(product, 1);
                    toast.success('Ajouté au panier');
                  }}
                  disabled={!product.is_available || product.stock === 0}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-orange-500 transition-colors disabled:opacity-40"
                >
                  <ShoppingCart className="h-4 w-4" /> Ajouter au panier
                </button>
                <Link
                  to={`/produits/${product.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Voir le produit <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
