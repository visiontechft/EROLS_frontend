import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Filter, Calendar, ChevronRight } from 'lucide-react';
import { ordersApi } from '../lib/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PageLoader } from '../components/ui/LoadingSpinner';
import type { Order, OrderStatus } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await ordersApi.getOrders();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        toast.error('Erreur lors du chargement des commandes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let result = [...orders];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.order_number.toLowerCase().includes(query) ||
          order.items.some((item) =>
            item.product_name.toLowerCase().includes(query)
          )
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

  if (isLoading) {
    return <PageLoader />;
  }

  const statusOptions: Array<{ value: OrderStatus | 'all'; label: string }> = [
    { value: 'all', label: 'Toutes' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmées' },
    { value: 'processing', label: 'En traitement' },
    { value: 'shipped', label: 'Expédiées' },
    { value: 'delivered', label: 'Livrées' },
    { value: 'cancelled', label: 'Annulées' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
          <p className="text-gray-600 mt-1">
            Suivez et gérez toutes vos commandes
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Rechercher par numéro de commande ou produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
              />
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all'
                ? 'Aucune commande trouvée'
                : 'Aucune commande'}
            </h2>
            <p className="text-gray-600 mb-8">
              {searchQuery || statusFilter !== 'all'
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Vous n\'avez pas encore passé de commande'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button
                size="lg"
                onClick={() => window.location.href = '/produits'}
                leftIcon={<Package className="h-5 w-5" />}
              >
                Découvrir nos produits
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                to={`/commande/${order.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="mb-3 md:mb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Commande #{order.order_number}
                        </h3>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Passée le{' '}
                          {format(new Date(order.created_at), 'dd MMMM yyyy', {
                            locale: fr,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-orange-500">
                          {order.total_amount.toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                      <ChevronRight className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={item.id}
                          className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-100"
                          style={{ zIndex: 10 - index }}
                        >
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.items[0]?.product_name}
                        {order.items.length > 1 &&
                          ` et ${order.items.length - 1} autre${
                            order.items.length > 2 ? 's' : ''
                          }`}
                      </p>
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <PaymentStatusBadge status={order.payment_status} />
                      {order.tracking_number && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Suivi:</span>{' '}
                          {order.tracking_number}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-orange-500 font-medium">
                      Voir les détails →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination (if needed) */}
        {filteredOrders.length > 10 && (
          <div className="mt-8 flex justify-center">
            <p className="text-sm text-gray-600">
              Affichage de {filteredOrders.length} commande
              {filteredOrders.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
