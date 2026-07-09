import { useEffect, useState } from 'react';
import { Plus, Save, TrendingUp, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { categoriesApi, productsApi } from '../../lib/api';
import { PRICE_TIERS, applyTierBonus } from '../../lib/priceTiers';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { ConfirmDialog } from '../../components/ui/Modal';
import { AdminProductRow } from './AdminProductRow';
import type { Category } from '../../types';

export interface DraftProductRow {
  localId: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  category_id: string;
  images: File[];
  status: 'idle' | 'saving' | 'saved' | 'error';
  error?: string;
}

function emptyRow(): DraftProductRow {
  return {
    localId: Math.random().toString(36).slice(2),
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    images: [],
    status: 'idle',
  };
}

export function AdminProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState<DraftProductRow[]>([emptyRow()]);
  const [isSavingAll, setIsSavingAll] = useState(false);

  const [priceMode, setPriceMode] = useState<'percent' | 'fixed'>('percent');
  const [priceValue, setPriceValue] = useState('');
  const [priceCategoryId, setPriceCategoryId] = useState('');
  const [priceMinPrice, setPriceMinPrice] = useState('');
  const [priceMaxPrice, setPriceMaxPrice] = useState('');
  const [showPriceConfirm, setShowPriceConfirm] = useState(false);
  const [isApplyingPrice, setIsApplyingPrice] = useState(false);
  const [showBaremeConfirm, setShowBaremeConfirm] = useState(false);
  const [isApplyingBareme, setIsApplyingBareme] = useState(false);

  const applyPreset = (tier: (typeof PRICE_TIERS)[number]) => {
    setPriceMode('fixed');
    setPriceValue(String(tier.bonus));
    setPriceMinPrice(String(tier.min));
    setPriceMaxPrice(tier.max !== undefined ? String(tier.max) : '');
  };

  const applyFullBareme = async () => {
    setIsApplyingBareme(true);
    try {
      const result = await productsApi.bulkUpdatePriceTiers({
        tiers: PRICE_TIERS.map((t) => ({ min_price: t.min, max_price: t.max, bonus: t.bonus })),
      });
      toast.success(`${result.updated} produit(s) ajusté(s) selon le barème complet`);
      setShowBaremeConfirm(false);
    } catch (error: any) {
      toast.error(error?.message || "Échec de l'application du barème");
    } finally {
      setIsApplyingBareme(false);
    }
  };

  useEffect(() => {
    categoriesApi.getCategories()
      .then(setCategories)
      .catch(() => toast.error('Erreur de chargement des catégories'))
      .finally(() => setIsLoading(false));
  }, []);

  const updateRow = (localId: string, patch: Partial<DraftProductRow>) => {
    setRows((prev) => prev.map((r) => (r.localId === localId ? { ...r, ...patch } : r)));
  };

  const removeRow = (localId: string) => {
    setRows((prev) => prev.filter((r) => r.localId !== localId));
  };

  const saveRow = async (row: DraftProductRow) => {
    updateRow(row.localId, { status: 'saving', error: undefined });
    try {
      const product = await productsApi.createProduct({
        name: row.name,
        description: row.description,
        category: Number(row.category_id),
        // row.price est le prix d'achat saisi ; le prix de vente réel applique
        // automatiquement le bonus du barème confirmé (voir lib/priceTiers.ts).
        price: applyTierBonus(Number(row.price)),
        stock: Number(row.stock),
        is_available: true,
      });

      if (row.images.length > 0) {
        await productsApi.uploadProductImages(product.slug, row.images);
      }

      updateRow(row.localId, { status: 'saved' });
    } catch (error: any) {
      updateRow(row.localId, {
        status: 'error',
        error: error?.message || "Échec de l'enregistrement",
      });
    }
  };

  const saveAll = async () => {
    setIsSavingAll(true);
    const pending = rows.filter((r) => r.status === 'idle' || r.status === 'error');
    for (const row of pending) {
      await saveRow(row);
    }
    setIsSavingAll(false);

    // Recompter les erreurs après la boucle (l'état a été mis à jour ligne par ligne)
    setRows((current) => {
      const errors = current.filter((r) => r.status === 'error').length;
      const saved = current.filter((r) => r.status === 'saved').length;
      if (pending.length > 0) {
        toast[errors > 0 ? 'warning' : 'success'](
          `${saved} produit(s) enregistré(s)${errors > 0 ? `, ${errors} erreur(s)` : ''}`
        );
      }
      return current;
    });
  };

  const applyBulkPrice = async () => {
    const value = Number(priceValue);
    if (!priceValue || Number.isNaN(value)) {
      toast.error('Entre une valeur valide');
      return;
    }
    setIsApplyingPrice(true);
    try {
      const result = await productsApi.bulkUpdatePrices({
        mode: priceMode,
        value,
        category_id: priceCategoryId ? Number(priceCategoryId) : undefined,
        min_price: priceMinPrice ? Number(priceMinPrice) : undefined,
        max_price: priceMaxPrice ? Number(priceMaxPrice) : undefined,
      });
      toast.success(`${result.updated} produit(s) mis à jour`);
      setShowPriceConfirm(false);
      setPriceValue('');
      setPriceMinPrice('');
      setPriceMaxPrice('');
    } catch (error: any) {
      toast.error(error?.message || "Échec de l'ajustement des prix");
    } finally {
      setIsApplyingPrice(false);
    }
  };

  const priceRangeLabel =
    priceMinPrice && priceMaxPrice
      ? ` entre ${priceMinPrice} et ${priceMaxPrice} FCFA`
      : priceMinPrice
      ? ` à partir de ${priceMinPrice} FCFA`
      : priceMaxPrice
      ? ` jusqu'à ${priceMaxPrice} FCFA`
      : '';
  const priceScopeLabel =
    (priceCategoryId
      ? categories.find((c) => String(c.id) === priceCategoryId)?.name || 'cette catégorie'
      : 'tous les produits') + priceRangeLabel;
  const priceChangeLabel = priceMode === 'percent'
    ? `${Number(priceValue) >= 0 ? '+' : ''}${priceValue || 0}%`
    : `${Number(priceValue) >= 0 ? '+' : ''}${priceValue || 0} FCFA`;

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">Ajouter des produits</h1>
            <p className="text-gray-600 mt-1">Créez plusieurs produits d'un coup, avec leurs images</p>
          </div>
          <Button onClick={saveAll} isLoading={isSavingAll} leftIcon={<Save size={18} />}>
            Tout enregistrer
          </Button>
        </div>

        {/* AJUSTEMENT DES PRIX EN MASSE */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900">Ajuster les prix en masse</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Applique une marge sur les prix existants (utile après un import au prix de gros).
          </p>

          {/* Action recommandée : tout le barème en une seule passe atomique côté serveur,
              sans risque de double-ajustement (contrairement aux paliers cliqués un par un). */}
          <div className="mb-5 rounded-xl border-2 border-orange-200 bg-orange-50 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck size={18} className="text-orange-600" />
              <h3 className="text-sm font-bold text-gray-900">Appliquer tout le barème (recommandé)</h3>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Applique les 6 paliers d'un coup, chaque produit n'étant évalué qu'une seule fois
              contre son prix actuel — aucun risque qu'un produit déjà ajusté soit repris par le
              palier suivant.
            </p>
            <Button variant="primary" size="sm" onClick={() => setShowBaremeConfirm(true)}>
              Appliquer tout le barème
            </Button>
          </div>

          {/* Barèmes rapides : pour un ajustement ponctuel (une seule tranche/catégorie).
              ⚠️ Ne cliquez ces boutons qu'un par un et un seul à la fois : un produit déjà
              ajusté peut changer de tranche et se faire re-ajuster par un palier suivant. */}
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
              Barèmes rapides (ajustement ponctuel d'un seul palier)
            </p>
            <p className="text-xs text-gray-500 mb-2">
              ⚠️ N'applique qu'un seul palier à la fois — utilisez plutôt "Appliquer tout le
              barème" ci-dessus pour ajuster tout le catalogue sans risque.
            </p>
            <div className="flex flex-wrap gap-2">
              {PRICE_TIERS.map((tier) => (
                <button
                  key={tier.label}
                  onClick={() => applyPreset(tier)}
                  className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {tier.label} → +{tier.bonus.toLocaleString('fr-FR')} F
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <select
              value={priceMode}
              onChange={(e) => setPriceMode(e.target.value as 'percent' | 'fixed')}
              className="col-span-2 sm:col-span-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="percent">Pourcentage (%)</option>
              <option value="fixed">Montant fixe (FCFA)</option>
            </select>
            <Input
              type="number"
              placeholder={priceMode === 'percent' ? 'ex. 20' : 'ex. 2000'}
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Prix min"
              value={priceMinPrice}
              onChange={(e) => setPriceMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Prix max"
              value={priceMaxPrice}
              onChange={(e) => setPriceMaxPrice(e.target.value)}
            />
            <select
              value={priceCategoryId}
              onChange={(e) => setPriceCategoryId(e.target.value)}
              className="col-span-2 sm:col-span-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Button
              variant="secondary"
              onClick={() => setShowPriceConfirm(true)}
              disabled={!priceValue}
            >
              Appliquer
            </Button>
          </div>
        </div>

        <ConfirmDialog
          isOpen={showPriceConfirm}
          onClose={() => setShowPriceConfirm(false)}
          onConfirm={applyBulkPrice}
          isLoading={isApplyingPrice}
          title="Confirmer l'ajustement des prix"
          message={`Cette action va modifier le prix de ${priceScopeLabel} : ${priceChangeLabel}. Cette action ne peut pas être annulée automatiquement.`}
          confirmText="Confirmer"
        />

        <ConfirmDialog
          isOpen={showBaremeConfirm}
          onClose={() => setShowBaremeConfirm(false)}
          onConfirm={applyFullBareme}
          isLoading={isApplyingBareme}
          title="Confirmer l'application du barème complet"
          message="Cette action va appliquer les 6 paliers de prix à tous les produits, chacun évalué une seule fois selon son prix actuel. Cette action ne peut pas être annulée automatiquement."
          confirmText="Confirmer"
        />

        <div className="space-y-4">
          {rows.map((row) => (
            <AdminProductRow
              key={row.localId}
              row={row}
              categories={categories}
              onChange={(patch) => updateRow(row.localId, patch)}
              onRemove={() => removeRow(row.localId)}
              onSave={() => saveRow(row)}
            />
          ))}
        </div>

        <button
          onClick={() => setRows((prev) => [...prev, emptyRow()])}
          className="mt-4 w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-orange-400 hover:text-orange-600 transition-colors"
        >
          <Plus size={20} /> Ajouter une ligne
        </button>
      </div>
    </div>
  );
}
