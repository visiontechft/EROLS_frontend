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
  Package,
  type LucideIcon,
} from 'lucide-react';

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

export function iconForCategory(name: string): LucideIcon {
  const lower = name.toLowerCase();
  const match = ICONS_BY_KEYWORD.find(([keyword]) => lower.includes(keyword));
  return match ? match[1] : Package;
}
