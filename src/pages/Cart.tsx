import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MapPin, MessageCircle, X, Clock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { citiesApi, ordersApi } from '../lib/api';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/Modal';
import type { City } from '../types';
import { toast } from 'react-toastify';

export function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await citiesApi.getCities();
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
    setItemToRemove(null);
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearDialog(false);
  };

  const handleCheckoutClick = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast.info('Veuillez vous connecter pour commander');
      navigate('/login', { state: { from: '/panier' } });
      return;
    }
    setShowCityModal(true);
  };

  const handleCitySelect = async (city: City) => {
    try {
      setIsOrdering(true);
      setSelectedCity(city);

      const items = cart.items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      const response = await ordersApi.initiateCartOrder({
        items,
        city_id: city.id,
      });

      toast.success('Commande initiée sur WhatsApp !');
      clearCart();
      window.open(response.whatsapp_url, '_blank');
      
      setTimeout(() => {
        navigate('/mes-commandes');
      }, 2000);
    } catch (error: any) {
      console.error('Error initiating order:', error);
      toast.error(error.message || 'Erreur lors de l\'initiation de la commande');
    } finally {
      setIsOrdering(false);
      setShowCityModal(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShoppingBag className="h-16 w-16 text-orange-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Votre panier est vide
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Ajoutez des produits pour commencer vos achats
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/produits')}
            className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Découvrir nos produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">Mon Panier</h1>
            <p className="text-gray-600 mt-2 font-bold">
              {cart.itemCount} article{cart.itemCount > 1 ? 's' : ''} • {(cart.total || 0).toLocaleString('fr-FR')} FCFA
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/produits')}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continuer mes achats
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const imageUrl = item.product.image_url || '/placeholder-product.jpg';
              const itemTotal = (item.product.price || 0) * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-orange-200 transition-all"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <Link
                      to={`/produits/${item.product.slug}`}
                      className="flex-shrink-0"
                    >
                      <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100">
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/produits/${item.product.slug}`}
                        className="text-lg font-black text-gray-900 hover:text-orange-500 transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1 font-bold">
                        {item.product.category?.name || 'Sans catégorie'}
                      </p>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
                        <div>
                          <p className="text-xl font-black text-orange-600">
                            {(item.product.price || 0).toLocaleString('fr-FR')} FCFA
                          </p>
                          {item.product.original_price &&
                            item.product.original_price > (item.product.price || 0) && (
                              <p className="text-sm text-gray-400 line-through font-bold">
                                {(item.product.original_price || 0).toLocaleString('fr-FR')} FCFA
                              </p>
                            )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 font-black min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                              disabled={item.quantity >= (item.product.stock || 0)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => setItemToRemove(item.product.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            aria-label="Retirer du panier"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= (item.product.stock || 0) && (
                        <p className="text-sm text-orange-600 mt-2 font-bold">
                          ⚠️ Stock maximum atteint
                        </p>
                      )}

                      {/* Subtotal */}
                      <div className="mt-3 pt-3 border-t-2 border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 font-bold">Sous-total:</span>
                          <span className="text-lg font-black text-gray-900">
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
              className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vider le panier
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border-2 border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6">
                Résumé de la commande
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-gray-600 font-bold">
                  <span>Sous-total ({cart.itemCount} articles)</span>
                  <span>
                    {(cart.total || 0).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div className="pt-4 border-t-2 border-gray-200">
                  <div className="flex items-center justify-between text-xl font-black">
                    <span className="text-gray-900">Total</span>
                    <span className="text-orange-600">
                      {(cart.total || 0).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                size="lg"
                fullWidth
                onClick={handleCheckoutClick}
                className="bg-green-600 hover:bg-green-700 text-white border-none shadow-lg mb-4"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Commander via WhatsApp
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Vous serez redirigé vers WhatsApp pour finaliser
              </p>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="font-bold">Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-orange-600" size={16} />
                  </div>
                  <span className="font-bold">Livraison en 10 min - 1h</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-blue-600" size={16} />
                  </div>
                  <span className="font-bold">Support client disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de sélection de ville - Optimisé Mobile */}
      {showCityModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-6 sm:p-8 relative animate-in slide-in-from-bottom sm:fade-in sm:zoom-in duration-300 shadow-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col">
            
            {/* Barre de glissement mobile */}
            <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
            
            {/* Bouton fermer */}
            <button 
              onClick={() => setShowCityModal(false)} 
              className="absolute right-4 sm:right-6 top-4 sm:top-6 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2 transition-all z-10"
            >
              <X size={24} />
            </button>
            
            {/* Header */}
            <div className="mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <MapPin className="text-orange-600" size={32} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2 text-center sm:text-left">Votre ville ?</h3>
              <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
                Sélectionnez votre ville pour finaliser votre commande sur WhatsApp avec livraison express.
              </p>
            </div>
            
            {/* Liste des villes - Scrollable */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <div className="space-y-3 pb-4">
                {cities.map(city => (
                  <button 
                    key={city.id} 
                    onClick={() => handleCitySelect(city)}
                    disabled={isOrdering && selectedCity?.id === city.id}
                    className="w-full p-4 sm:p-5 border-2 border-gray-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 active:scale-98 flex justify-between items-center transition-all group shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <MapPin className="text-orange-600" size={20} />
                      </div>
                      <span className="font-bold text-gray-800 text-base sm:text-lg">{city.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOrdering && selectedCity?.id === city.id ? (
                        <span className="text-xs font-bold text-orange-600">Redirection...</span>
                      ) : (
                        <>
                          <span className="hidden sm:inline text-xs font-bold text-gray-400 group-hover:text-green-600 transition-colors">
                            Livraison express
                          </span>
                          <MessageCircle className="text-gray-300 group-hover:text-green-600 transition-colors" size={20} />
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer info */}
            <div className="mt-4 pt-4 border-t-2 border-gray-100">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Clock size={16} className="text-orange-500" />
                <span className="font-bold">Livraison en 10 min - 1h max • Total: {(cart.total || 0).toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          </div>
        </div>
      )}

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