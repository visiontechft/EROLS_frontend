import { Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ImageDropzone } from '../../components/ImageDropzone';
import { applyTierBonus } from '../../lib/priceTiers';
import type { Category } from '../../types';
import type { DraftProductRow } from './AdminProducts';

interface AdminProductRowProps {
  row: DraftProductRow;
  categories: Category[];
  onChange: (patch: Partial<DraftProductRow>) => void;
  onRemove: () => void;
  onSave: () => void;
}

export function AdminProductRow({ row, categories, onChange, onRemove, onSave }: AdminProductRowProps) {
  const isSaved = row.status === 'saved';
  const isSaving = row.status === 'saving';
  const costPrice = Number(row.price);
  const suggestedSellPrice = row.price && !Number.isNaN(costPrice) ? applyTierBonus(costPrice) : null;

  return (
    <div
      className={`bg-white rounded-xl border-2 p-5 space-y-4 ${
        isSaved ? 'border-green-200' : row.status === 'error' ? 'border-red-200' : 'border-gray-100'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <Input
            label="Nom du produit"
            value={row.name}
            onChange={(e) => onChange({ name: e.target.value })}
            disabled={isSaved}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={row.category_id}
              onChange={(e) => onChange({ category_id: e.target.value })}
              disabled={isSaved}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Input
              label="Prix d'achat (FCFA)"
              type="number"
              value={row.price}
              onChange={(e) => onChange({ price: e.target.value })}
              disabled={isSaved}
              required
            />
            {suggestedSellPrice !== null && (
              <p className="mt-1 text-xs font-bold text-orange-600">
                Prix de vente (barème auto) : {suggestedSellPrice.toLocaleString('fr-FR')} FCFA
              </p>
            )}
          </div>
          <Input
            label="Stock"
            type="number"
            value={row.stock}
            onChange={(e) => onChange({ stock: e.target.value })}
            disabled={isSaved}
            required
          />
        </div>

        <button
          onClick={onRemove}
          disabled={isSaving}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
          aria-label="Retirer cette ligne"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <Textarea
        label="Description"
        rows={3}
        value={row.description}
        onChange={(e) => onChange({ description: e.target.value })}
        disabled={isSaved}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
        {!isSaved && (
          <ImageDropzone files={row.images} onChange={(images) => onChange({ images })} />
        )}
        {isSaved && row.images.length > 0 && (
          <p className="text-sm text-gray-500">{row.images.length} image(s) envoyée(s)</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="text-sm">
          {row.status === 'error' && (
            <span className="flex items-center gap-1.5 text-red-600">
              <AlertCircle size={16} /> {row.error}
            </span>
          )}
          {isSaved && (
            <span className="flex items-center gap-1.5 text-green-600 font-medium">
              <CheckCircle2 size={16} /> Enregistré
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={onSave}
          isLoading={isSaving}
          disabled={isSaved || !row.name || !row.category_id || !row.price || !row.stock}
        >
          {isSaved ? 'Enregistré' : 'Enregistrer'}
        </Button>
      </div>
    </div>
  );
}
