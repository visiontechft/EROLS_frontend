import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/Modal';

export function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  const [itemToRemove, setItemToRemove] = React.useState<number | null>(null);

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
    setItemToRemove(null);
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearDialog(false);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Votre panier est vide
          </h2>
          <p className="text-gray-600 mb-8">
            Ajoutez des produits pour commencer vos achats
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/produits')}
            leftIcon={<ShoppingBag className="h-5 w-5" />}
          >
            Découvrir nos produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
            <p className="text-gray-600 mt-1">
              {cart.itemCount} article{cart.itemCount > 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/produits')}
            leftIcon={<ArrowLeft className="h-5 w-5" />}
          >
            Continuer mes achats
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const primaryImage =
                item.product.images?.find((img) => img.is_primary) ||
                item.product.images?.[0];
              const itemTotal = (item.product.price || 0) * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <Link
                      to={`/produits/${item.product.slug}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={primaryImage?.url || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/produits/${item.product.slug}`}
                        className="text-lg font-semibold text-gray-900 hover:text-orange-500 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.product.category?.name || 'Sans catégorie'}
                      </p>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <p className="text-xl font-bold text-orange-500">
                            {(item.product.price || 0).toLocaleString('fr-FR')} FCFA
                          </p>
                          {item.product.original_price &&
                            item.product.original_price > (item.product.price || 0) && (
                              <p className="text-sm text-gray-400 line-through">
                                {(item.product.original_price || 0).toLocaleString('fr-FR')}{' '}
                                FCFA
                              </p>
                            )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="px-3 py-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="px-3 py-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity >= (item.product.stock || 0)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => setItemToRemove(item.product.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Retirer du panier"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= (item.product.stock || 0) && (
                        <p className="text-sm text-orange-600 mt-2">
                          Stock maximum atteint
                        </p>
                      )}

                      {/* Subtotal */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Sous-total:</span>
                          <span className="text-lg font-semibold text-gray-900">
                            {itemTotal.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart Button */}
            <Button
              variant="ghost"
              onClick={() => setShowClearDialog(true)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vider le panier
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Résumé de la commande
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Sous-total ({cart.itemCount} articles)</span>
                  <span className="font-medium">
                    {(cart.total || 0).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="font-medium">Calculé à l'étape suivante</span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-orange-500">
                      {(cart.total || 0).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                fullWidth
                onClick={() => navigate('/commander')}
              >
                Passer la commande
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Les frais de livraison seront calculés lors du paiement
              </p>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">✓</span>
                  </div>
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">✓</span>
                  </div>
                  <span>Livraison rapide et fiable</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">✓</span>
                  </div>
                  <span>Support client disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Item Confirmation */}
      <ConfirmDialog
        isOpen={itemToRemove !== null}
        onClose={() => setItemToRemove(null)}
        onConfirm={() => itemToRemove && handleRemoveItem(itemToRemove)}
        title="Retirer du panier"
        message="Êtes-vous sûr de vouloir retirer cet article du panier?"
        confirmText="Retirer"
        cancelText="Annuler"
        variant="danger"
      />

      {/* Clear Cart Confirmation */}
      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearCart}
        title="Vider le panier"
        message="Êtes-vous sûr de vouloir vider tout le panier? Cette action est irréversible."
        confirmText="Vider"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}