import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
} from 'lucide-react';
import { ordersApi } from '../lib/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/Modal';
import { PageLoader } from '../components/ui/LoadingSpinner';
import type { Order } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await ordersApi.getOrder(Number(id));
        setOrder(data);
      } catch (error: any) {
        console.error('Error fetching order:', error);
        toast.error('Erreur lors du chargement de la commande');
        navigate('/mes-commandes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setIsCancelling(true);
      const updatedOrder = await ordersApi.cancelOrder(order.id);
      setOrder(updatedOrder);
      toast.success('Commande annulée avec succès');
      setShowCancelDialog(false);
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || "Erreur lors de l'annulation de la commande");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!order) {
    return null;
  }

  const canCancel = ['pending', 'confirmed'].includes(order.status);

  const statusTimeline = [
    {
      status: 'pending',
      label: 'En attente',
      icon: Clock,
      completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(
        order.status
      ),
      current: order.status === 'pending',
    },
    {
      status: 'confirmed',
      label: 'Confirmée',
      icon: CheckCircle2,
      completed: ['processing', 'shipped', 'delivered'].includes(order.status),
      current: order.status === 'confirmed',
    },
    {
      status: 'processing',
      label: 'En traitement',
      icon: Package,
      completed: ['shipped', 'delivered'].includes(order.status),
      current: order.status === 'processing',
    },
    {
      status: 'shipped',
      label: 'Expédiée',
      icon: Truck,
      completed: order.status === 'delivered',
      current: order.status === 'shipped',
    },
    {
      status: 'delivered',
      label: 'Livrée',
      icon: CheckCircle2,
      completed: false,
      current: order.status === 'delivered',
    },
  ];

  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/mes-commandes')}
            leftIcon={<ArrowLeft className="h-5 w-5" />}
            className="mb-4"
          >
            Retour aux commandes
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Commande #{order.order_number}
                </h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-gray-600">
                Passée le{' '}
                {format(new Date(order.created_at), 'dd MMMM yyyy à HH:mm', {
                  locale: fr,
                })}
              </p>
            </div>

            {canCancel && (
              <Button
                variant="danger"
                onClick={() => setShowCancelDialog(true)}
                className="mt-4 md:mt-0"
              >
                Annuler la commande
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            {!isCancelled && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Suivi de commande
                </h2>

                <div className="relative">
                  {statusTimeline.map((item, index) => (
                    <div key={item.status} className="flex items-start mb-8 last:mb-0">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                            item.completed
                              ? 'bg-green-500 text-white'
                              : item.current
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          <item.icon className="h-6 w-6" />
                        </div>
                        {index < statusTimeline.length - 1 && (
                          <div
                            className={`w-0.5 h-16 mt-2 ${
                              item.completed ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>

                      <div className="ml-6 flex-1">
                        <h3
                          className={`font-semibold ${
                            item.current ? 'text-orange-500' : 'text-gray-900'
                          }`}
                        >
                          {item.label}
                        </h3>
                        {item.current && (
                          <p className="text-sm text-gray-600 mt-1">
                            Étape actuelle
                          </p>
                        )}
                        {item.completed && (
                          <p className="text-sm text-green-600 mt-1">Terminée</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {order.tracking_number && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between bg-orange-50 rounded-lg p-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Numéro de suivi
                        </p>
                        <p className="font-mono font-semibold text-gray-900">
                          {order.tracking_number}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Suivre le colis
                      </Button>
                    </div>
                  </div>
                )}

                {order.estimated_delivery && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Livraison estimée:</span>{' '}
                      {format(new Date(order.estimated_delivery), 'dd MMMM yyyy', {
                        locale: fr,
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Cancelled Message */}
            {isCancelled && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start">
                  <XCircle className="h-6 w-6 text-red-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">
                      Commande annulée
                    </h3>
                    <p className="text-sm text-red-700">
                      Cette commande a été annulée le{' '}
                      {format(new Date(order.updated_at), 'dd MMMM yyyy à HH:mm', {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Articles commandés
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link
                        to={`/produits/${item.product_slug}`}
                        className="font-semibold text-gray-900 hover:text-orange-500 transition-colors"
                      >
                        {item.product_name}
                      </Link>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>Quantité: {item.quantity}</span>
                        <span>Prix unitaire: {item.price.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {item.subtotal.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Notes de commande
                    </h3>
                    <p className="text-sm text-gray-600">{order.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé</h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-medium">
                    {order.subtotal.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="font-medium">
                    {order.shipping_cost.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                {order.tax_amount && order.tax_amount > 0 && (
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Taxes</span>
                    <span className="font-medium">
                      {order.tax_amount.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-orange-500">
                      {order.total_amount.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>
              </div>

              <PaymentStatusBadge status={order.payment_status} />
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-bold text-gray-900">
                  Adresse de livraison
                </h2>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {order.shipping_address.first_name}{' '}
                  {order.shipping_address.last_name}
                </p>
                <p>{order.shipping_address.address}</p>
                {order.shipping_address.address_2 && (
                  <p>{order.shipping_address.address_2}</p>
                )}
                <p>
                  {order.shipping_address.city},{' '}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
                <p className="pt-2">Tél: {order.shipping_address.phone}</p>
                <p>Email: {order.shipping_address.email}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-bold text-gray-900">
                  Mode de paiement
                </h2>
              </div>

              <p className="text-sm text-gray-600">
                {order.payment_method === 'cash_on_delivery' &&
                  'Paiement à la livraison'}
                {order.payment_method === 'bank_transfer' && 'Virement bancaire'}
                {order.payment_method === 'mobile_money' && 'Mobile Money'}
                {order.payment_method === 'credit_card' && 'Carte de crédit'}
              </p>
            </div>

            {/* Need Help */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Besoin d'aide?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Notre équipe est là pour vous aider avec votre commande
              </p>
              <Link to="/contact">
                <Button variant="outline" size="sm" fullWidth>
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelOrder}
        title="Annuler la commande"
        message="Êtes-vous sûr de vouloir annuler cette commande? Cette action est irréversible."
        confirmText="Annuler la commande"
        cancelText="Retour"
        variant="danger"
        isLoading={isCancelling}
      />
    </div>
  );
}
