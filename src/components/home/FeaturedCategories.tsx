import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, LayoutGrid } from 'lucide-react';
import { ProductImage } from '../ProductImage';
import type { Category } from '../../types';

interface FeaturedCategoriesProps {
  categories: Category[];
  categoryImages: Record<number, string | null>;
}

export function FeaturedCategories({ categories, categoryImages }: FeaturedCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-2">
            Explorez
          </p>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Nos catégories</h2>
        </div>
        <Link
          to="/produits"
          className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-orange-600 transition-colors"
        >
          Tout voir <ArrowUpRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {categories.map((category, i) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Link
              to={`/produits?category=${category.slug}`}
              className="group relative flex flex-col justify-end h-56 lg:h-64 rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              {categoryImages[category.id] ? (
                <ProductImage
                  src={categoryImages[category.id]}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <LayoutGrid className="h-10 w-10 text-gray-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="relative p-4 lg:p-5">
                <h3 className="text-white font-bold text-base lg:text-lg leading-tight">
                  {category.name}
                </h3>
                <p className="text-white/70 text-xs font-medium mt-1">
                  {category.product_count} produit{category.product_count > 1 ? 's' : ''}
                </p>
              </div>

              <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-4 w-4 text-white" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
