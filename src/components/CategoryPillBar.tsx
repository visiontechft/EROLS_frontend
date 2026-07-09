import { motion } from 'framer-motion';
import { usePrefetchCategoryProducts } from '../hooks/queries/useCategories';
import type { Category } from '../types';

interface CategoryPillBarProps {
  categories: Category[];
  selected: string | undefined;
  onSelect: (slug: string | undefined) => void;
  className?: string;
}

export function CategoryPillBar({ categories, selected, onSelect, className = '' }: CategoryPillBarProps) {
  const prefetchCategory = usePrefetchCategoryProducts();

  return (
    <div className={`flex gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-0 py-1 ${className}`}>
      <button
        onClick={() => onSelect(undefined)}
        className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
          !selected ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {!selected && (
          <motion.span
            layoutId="category-pill-active"
            className="absolute inset-0 rounded-full bg-gray-900"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative">Tous</span>
      </button>

      {categories.map((category) => {
        const isActive = selected === category.slug;
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.slug)}
            onMouseEnter={() => prefetchCategory(category.slug)}
            onTouchStart={() => prefetchCategory(category.slug)}
            className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors ${
              isActive ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill-active"
                className="absolute inset-0 rounded-full bg-gray-900"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
