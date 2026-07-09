import { Link } from 'react-router-dom';
import {
  Smartphone,
  Home as HomeIcon,
  Shirt,
  Sparkles,
  UtensilsCrossed,
  Dumbbell,
  Sofa,
  Layers,
  Refrigerator,
  LayoutGrid,
  Package,
  type LucideIcon,
} from 'lucide-react';
import type { Category } from '../../types';

interface MobileCategoryIconsProps {
  categories: Category[];
}

const ICONS_BY_KEYWORD: [string, LucideIcon][] = [
  ['électronique', Smartphone],
  ['électroménager', Refrigerator],
  ['maison', HomeIcon],
  ['décoration', HomeIcon],
  ['mode', Shirt],
  ['beauté', Sparkles],
  ['cuisine', UtensilsCrossed],
  ['sport', Dumbbell],
  ['meubles', Sofa],
  ['rangement', Sofa],
  ['matériaux', Layers],
];

function iconForCategory(name: string): LucideIcon {
  const lower = name.toLowerCase();
  const match = ICONS_BY_KEYWORD.find(([keyword]) => lower.includes(keyword));
  return match ? match[1] : Package;
}

export function MobileCategoryIcons({ categories }: MobileCategoryIconsProps) {
  if (categories.length === 0) return null;

  const top = [...categories].sort((a, b) => b.product_count - a.product_count).slice(0, 4);

  return (
    <div className="lg:hidden grid grid-cols-5 gap-2 px-4 py-4">
      {top.map((category) => {
        const Icon = iconForCategory(category.name);
        return (
          <Link
            key={category.id}
            to={`/produits?category=${category.slug}`}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
          >
            <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
              <Icon className="h-6 w-6 text-gray-700" />
            </div>
            <span className="text-[11px] font-medium text-gray-700 text-center leading-tight line-clamp-1">
              {category.name}
            </span>
          </Link>
        );
      })}
      <Link to="/produits" className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
        <div className="h-14 w-14 rounded-full bg-orange-50 flex items-center justify-center">
          <LayoutGrid className="h-6 w-6 text-orange-600" />
        </div>
        <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">Plus</span>
      </Link>
    </div>
  );
}
