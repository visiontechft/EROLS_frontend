import { useEffect, useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { categoriesApi, productsApi } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/LoadingSpinner';
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
