import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Check,
  CreditCard,
  MapPin,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersApi } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import type { ShippingAddress, PaymentMethod, CreateOrderData } from '../types';
import { toast } from 'react-toastify';

type CheckoutStep = 'shipping' | 'payment' | 'review';

interface CheckoutFormData extends ShippingAddress {
  payment_method: PaymentMethod;
  notes?: string;
}

export function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormData>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      postal_code: user?.postal_code || '',
      country: user?.country || 'Côte d\'Ivoire',
      payment_method: 'cash_on_delivery',
    },
  });

  const formData = watch();
  const SHIPPING_COST = 5000; // Fixed shipping cost

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/panier');
    }
  }, [cart.items, navigate]);

  const steps = [
    { id: 'shipping', label: 'Livraison', icon: MapPin },
    { id: 'payment', label: 'Paiement', icon: CreditCard },
    { id: 'review', label: 'Confirmation', icon: ShoppingBag },
  ];

  const handleNextStep = async () => {
    let isValid = false;

    if (currentStep === 'shipping') {
      isValid = await trigger([
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'city',
        'postal_code',
        'country',
      ]);
      if (isValid) setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      isValid = await trigger(['payment_method']);
      if (isValid) setCurrentStep('review');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'payment') setCurrentStep('shipping');
    else if (currentStep === 'review') setCurrentStep('payment');
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true);

      const orderData: CreateOrderData = {
        items: cart.items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shipping_address: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          address_2: data.address_2,
          city: data.city,
          postal_code: data.postal_code,
          country: data.country,
        },
        payment_method: data.payment_method,
        notes: data.notes,
      };

      const order = await ordersApi.createOrder(orderData);

      clearCart();
      toast.success('Commande passée avec succès!');
      navigate(`/commande/${order.id}`);
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.message || 'Erreur lors de la création de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Finaliser ma commande</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted =
                steps.findIndex((s) => s.id === currentStep) > index;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <step.icon className="h-6 w-6" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-orange-500' : 'text-gray-600'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Shipping Information */}
                {currentStep === 'shipping' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Informations de livraison
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Prénom"
                        {...register('first_name', {
                          required: 'Le prénom est requis',
                        })}
                        error={errors.first_name?.message}
                        required
                      />
                      <Input
                        label="Nom"
                        {...register('last_name', {
                          required: 'Le nom est requis',
                        })}
                        error={errors.last_name?.message}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Email"
                        type="email"
                        {...register('email', {
                          required: "L'email est requis",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email invalide',
                          },
                        })}
                        error={errors.email?.message}
                        required
                      />
                      <Input
                        label="Téléphone"
                        type="tel"
                        {...register('phone', {
                          required: 'Le téléphone est requis',
                        })}
                        error={errors.phone?.message}
                        required
                      />
                    </div>

                    <Input
                      label="Adresse"
                      {...register('address', {
                        required: "L'adresse est requise",
                      })}
                      error={errors.address?.message}
                      required
                    />

                    <Input
                      label="Complément d'adresse (optionnel)"
                      {...register('address_2')}
                    />

                    <div className="grid md:grid-cols-3 gap-4">
                      <Input
                        label="Ville"
                        {...register('city', {
                          required: 'La ville est requise',
                        })}
                        error={errors.city?.message}
                        required
                      />
                      <Input
                        label="Code postal"
                        {...register('postal_code', {
                          required: 'Le code postal est requis',
                        })}
                        error={errors.postal_code?.message}
                        required
                      />
                      <Input
                        label="Pays"
                        {...register('country', {
                          required: 'Le pays est requis',
                        })}
                        error={errors.country?.message}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                {currentStep === 'payment' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Mode de paiement
                    </h2>

                    <div className="space-y-3">
                      {[
                        {
                          value: 'cash_on_delivery',
                          label: 'Paiement à la livraison',
                          description: 'Payez en espèces lors de la réception',
                        },
                        {
                          value: 'bank_transfer',
                          label: 'Virement bancaire',
                          description: 'Transférez le montant sur notre compte',
                        },
                        {
                          value: 'mobile_money',
                          label: 'Mobile Money',
                          description: 'Orange Money, MTN Mobile Money, etc.',
                        },
                      ].map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            formData.payment_method === method.value
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            value={method.value}
                            {...register('payment_method', {
                              required: 'Veuillez sélectionner un mode de paiement',
                            })}
                            className="mt-1 w-4 h-4 text-orange-500 focus:ring-orange-500"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">
                              {method.label}
                            </p>
                            <p className="text-sm text-gray-600">
                              {method.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {errors.payment_method && (
                      <p className="text-sm text-red-600">
                        {errors.payment_method.message}
                      </p>
                    )}

                    <Textarea
                      label="Notes de commande (optionnel)"
                      {...register('notes')}
                      placeholder="Instructions spéciales pour la livraison..."
                      rows={3}
                    />
                  </div>
                )}

                {/* Order Review */}
                {currentStep === 'review' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Vérifier votre commande
                    </h2>

                    {/* Shipping Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Adresse de livraison
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          {formData.first_name} {formData.last_name}
                        </p>
                        <p>{formData.address}</p>
                        {formData.address_2 && <p>{formData.address_2}</p>}
                        <p>
                          {formData.city}, {formData.postal_code}
                        </p>
                        <p>{formData.country}</p>
                        <p>Tél: {formData.phone}</p>
                        <p>Email: {formData.email}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Mode de paiement
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formData.payment_method === 'cash_on_delivery' &&
                          'Paiement à la livraison'}
                        {formData.payment_method === 'bank_transfer' &&
                          'Virement bancaire'}
                        {formData.payment_method === 'mobile_money' &&
                          'Mobile Money'}
                      </p>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Articles commandés
                      </h3>
                      <div className="space-y-3">
                        {cart.items.map((item) => {
                          const primaryImage =
                            item.product.images.find((img) => img.is_primary) ||
                            item.product.images[0];

                          return (
                            <div
                              key={item.product.id}
                              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                            >
                              <img
                                src={primaryImage?.url || '/placeholder-product.jpg'}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {item.product.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Quantité: {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                {(item.product.price * item.quantity).toLocaleString(
                                  'fr-FR'
                                )}{' '}
                                FCFA
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {formData.notes && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {formData.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  {currentStep !== 'shipping' && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                      leftIcon={<ArrowLeft className="h-5 w-5" />}
                    >
                      Retour
                    </Button>
                  )}

                  {currentStep !== 'review' ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      rightIcon={<ArrowRight className="h-5 w-5" />}
                      className={currentStep === 'shipping' ? 'ml-auto' : ''}
                    >
                      Continuer
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      className="ml-auto"
                    >
                      Confirmer la commande
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Résumé
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-medium">
                      {cart.total.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className="font-medium">
                      {SHIPPING_COST.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-orange-500">
                        {(cart.total + SHIPPING_COST).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Paiement sécurisé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Livraison en 2-3 semaines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Support client disponible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
