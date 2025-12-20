import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Calendar, MessageCircle } from 'lucide-react';
import { ordersApi, formatDate, getOrderStatusLabel } from '../lib/api';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import type { Order, OrderStats } from '../types';
import { toast } from 'react-toastify';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [ordersData, statsData] = await Promise.all([
          ordersApi.getOrderHistory(),
          ordersApi.getOrderStats(),
        ]);
        setOrders(ordersData);
        setStats(statsData);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        toast.error('Erreur lors du chargement des commandes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'redirected':
      default:
        return 'warning';
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
          <p className="text-gray-600 mt-2">
            Consultez l'historique de vos demandes de commande
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_orders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En cours</p>
                  <p className="text-2xl font-bold text-orange-500">{stats.redirected}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Complétées</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Annulées</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl">✕</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aucune commande
            </h2>
            <p className="text-gray-600 mb-8">
              Vous n'avez pas encore passé de commande
            </p>
            <Link
              to="/produits"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Package className="h-5 w-5 mr-2" />
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.product_name}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status_display}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{order.city_name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Prix:</span>
                        <span className="font-semibold text-orange-500">
                          {parseFloat(order.product_price).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {order.status === 'redirected' && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                      Vous avez été redirigé vers WhatsApp pour finaliser cette commande.
                      Si vous n'avez pas encore finalisé, veuillez contacter le service client.
                    </p>
                    <div className="flex gap-3">
                      <a
                        href={`https://wa.me/${order.city_name === 'Douala' ? '237691563244' : order.city_name === 'Yaoundé' ? '237698566659' : '237659270205'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contacter via WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Comment ça marche ?
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Vous cliquez sur "Commander" sur un produit</li>
                <li>Vous choisissez votre ville (Douala, Yaoundé ou Bafoussam)</li>
                <li>Vous êtes redirigé vers WhatsApp avec un message pré-rempli</li>
                <li>Vous finalisez votre commande directement avec notre équipe sur WhatsApp</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}