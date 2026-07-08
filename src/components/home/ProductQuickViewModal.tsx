import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StockBadge } from '../ui/Badge';
import { ProductImage } from '../ProductImage';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-toastify';
import type { Product } from '../../types';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const { addToCart } = useCart();

  return (
    <Modal isOpen={!!product} onClose={onClose} size="lg" title="Aperçu rapide">
      {product && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
            <ProductImage
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
              {product.category?.name}
            </p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-2xl font-black text-orange-600 mb-2">
              {product.price.toLocaleString('fr-FR')} FCFA
            </p>
            <div className="mb-4">
              <StockBadge stock={product.stock} />
            </div>
            <p className="text-sm text-gray-600 line-clamp-4 mb-6">{product.description}</p>

            <div className="mt-auto space-y-2">
              <Button
                fullWidth
                leftIcon={<ShoppingCart size={18} />}
                disabled={!product.is_available || product.stock === 0}
                onClick={() => {
                  addToCart(product, 1);
                  toast.success('Ajouté au panier');
                  onClose();
                }}
              >
                Ajouter au panier
              </Button>
              <Link to={`/produits/${product.slug}`} onClick={onClose}>
                <Button fullWidth variant="outline" leftIcon={<Eye size={18} />}>
                  Voir tous les détails
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
