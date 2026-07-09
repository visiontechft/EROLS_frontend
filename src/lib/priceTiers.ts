// Barème de revente confirmé avec le client : un bonus fixe par palier de prix
// d'achat, utilisé à la fois pour l'ajustement de prix en masse (admin) et pour
// le calcul automatique du prix de vente à la création d'un nouveau produit.
export interface PriceTier {
  label: string;
  min: number;
  max: number | undefined;
  bonus: number;
}

export const PRICE_TIERS: PriceTier[] = [
  { label: '200 – 499 F', min: 0, max: 499, bonus: 300 },
  { label: '500 – 1 499 F', min: 500, max: 1499, bonus: 500 },
  { label: '1 500 – 3 999 F', min: 1500, max: 3999, bonus: 1000 },
  { label: '4 000 – 19 999 F', min: 4000, max: 19999, bonus: 2000 },
  { label: '20 000 – 49 999 F', min: 20000, max: 49999, bonus: 3000 },
  { label: '50 000 F et plus', min: 50000, max: undefined, bonus: 5000 },
];

/** Retourne le prix de vente suggéré pour un prix d'achat donné, en appliquant
 * le bonus du palier correspondant. Retourne le prix d'achat inchangé si
 * aucun palier ne matche (prix invalide, ex. négatif). */
export function applyTierBonus(costPrice: number): number {
  const tier = PRICE_TIERS.find(
    (t) => costPrice >= t.min && (t.max === undefined || costPrice <= t.max)
  );
  return tier ? costPrice + tier.bonus : costPrice;
}
