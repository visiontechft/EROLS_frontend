import { useEffect, useState } from 'react';
import { Plus, Save, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { categoriesApi, productsApi } from '../../lib/api';
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
  const [showPriceConfirm, setShowPriceConfirm] = useState(false);
  const [isApplyingPrice, setIsApplyingPrice] = useState(false);

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
        price: Number(row.price),
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
      });
      toast.success(`${result.updated} produit(s) mis à jour`);
      setShowPriceConfirm(false);
      setPriceValue('');
    } catch (error: any) {
      toast.error(error?.message || "Échec de l'ajustement des prix");
    } finally {
      setIsApplyingPrice(false);
    }
  };

  const priceScopeLabel = priceCategoryId
    ? categories.find((c) => String(c.id) === priceCategoryId)?.name || 'cette catégorie'
    : 'tous les produits';
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <select
              value={priceMode}
              onChange={(e) => setPriceMode(e.target.value as 'percent' | 'fixed')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            <select
              value={priceCategoryId}
              onChange={(e) => setPriceCategoryId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
