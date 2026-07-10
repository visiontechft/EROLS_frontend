import { LayoutGrid } from 'lucide-react';
import { iconForCategory } from '../lib/categoryIcons';
import { usePrefetchCategoryProducts } from '../hooks/queries/useCategories';
import type { Category } from '../types';

interface CategoryIconBarProps {
  categories: Category[];
  selected: string | undefined;
  onSelect: (slug: string | undefined) => void;
  className?: string;
}

/** Same circular-icon style as the homepage's category shortcuts, adapted for
 * the products page: horizontally scrollable so every category stays reachable
 * (not just a top-4 shortcut), with an active state for the current filter. */
export function CategoryIconBar({ categories, selected, onSelect, className = '' }: CategoryIconBarProps) {
  const prefetchCategory = usePrefetchCategoryProducts();

  return (
    <div className={`flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-0 py-1 ${className}`}>
      <button
        onClick={() => onSelect(undefined)}
        className="flex shrink-0 flex-col items-center gap-1.5 active:scale-95 transition-transform"
      >
        <div
          className={`h-14 w-14 rounded-full flex items-center justify-center transition-colors ${
            !selected ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <LayoutGrid className="h-6 w-6" />
        </div>
        <span className={`text-[11px] font-semibold ${!selected ? 'text-orange-600' : 'text-gray-700'}`}>
          Tous
        </span>
      </button>

      {categories.map((category) => {
        const isActive = selected === category.slug;
        const Icon = iconForCategory(category.name);
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.slug)}
            onMouseEnter={() => prefetchCategory(category.slug)}
            onTouchStart={() => prefetchCategory(category.slug)}
            className="flex shrink-0 flex-col items-center gap-1.5 w-16 active:scale-95 transition-transform"
          >
            <div
              className={`h-14 w-14 rounded-full flex items-center justify-center transition-colors ${
                isActive ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <span
              className={`text-[11px] font-semibold text-center leading-tight line-clamp-2 ${
                isActive ? 'text-orange-600' : 'text-gray-700'
              }`}
            >
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
