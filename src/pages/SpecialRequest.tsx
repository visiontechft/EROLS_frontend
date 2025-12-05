import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Upload, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { specialRequestsApi } from '../lib/api';
import type { SpecialRequest } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RequestFormData {
  product_name: string;
  description: string;
  quantity: number;
  url_reference: string;
  image: FileList;
}

const SpecialRequestContent = () => {
  const [requests, setRequests] = useState<SpecialRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RequestFormData>();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const requests = await specialRequestsApi.getRequests();
      setRequests(requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: RequestFormData) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('product_name', data.product_name);
      formData.append('description', data.description);
      formData.append('quantity', String(data.quantity));
      if (data.url_reference) {
        formData.append('url_reference', data.url_reference);
      }
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      await specialRequestsApi.createRequest(formData as any);
      toast.success('Demande envoyée avec succès !');
      reset();
      fetchRequests();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la demande');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'warning', label: 'En attente' },
    in_review: { icon: FileText, color: 'info', label: 'En révision' },
    approved: { icon: CheckCircle, color: 'success', label: 'Approuvée' },
    rejected: { icon: XCircle, color: 'danger', label: 'Rejetée' },
    completed: { icon: Package, color: 'success', label: 'Complétée' },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Demandes spéciales</h1>
        <p className="text-gray-600 mb-8">
          Vous ne trouvez pas un produit ? Faites-nous une demande spéciale et nous l'importerons pour vous.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nouvelle demande</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Nom du produit *"
                {...register('product_name', { required: 'Nom du produit requis' })}
                error={errors.product_name?.message}
                placeholder="Ex: iPhone 15 Pro Max 256GB"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description détaillée *
                </label>
                <textarea
                  {...register('description', { required: 'Description requise' })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Décrivez le produit en détail (couleur, taille, caractéristiques...)"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <Input
                label="Quantité *"
                type="number"
                min="1"
                defaultValue="1"
                {...register('quantity', { required: 'Quantité requise', min: 1 })}
                error={errors.quantity?.message}
              />

              <Input
                label="Lien URL (optionnel)"
                type="url"
                {...register('url_reference')}
                placeholder="https://www.aliexpress.com/item/..."
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image du produit (optionnel)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-orange-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-500 hover:text-orange-600">
                        <span>Télécharger un fichier</span>
                        <input
                          type="file"
                          accept="image/*"
                          {...register('image')}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                  </div>
                </div>
              </div>

              <Button type="submit" loading={submitting} className="w-full" size="lg">
                <FileText className="w-5 h-5" />
                Envoyer la demande
              </Button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes demandes</h2>

            {loading ? (
              <LoadingSpinner />
            ) : requests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Aucune demande pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => {
                  const config = statusConfig[request.status];
                  const Icon = config.icon;

                  return (
                    <div key={request.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-800">
                          {request.product_name}
                        </h3>
                        <Badge variant={config.color as 'success' | 'warning' | 'danger' | 'info'}>
                          <Icon className="w-4 h-4 mr-1" />
                          {config.label}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{request.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Quantité:</span> {request.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Demandé le:</span>{' '}
                          {format(new Date(request.created_at), 'dd MMM yyyy', { locale: fr })}
                        </div>
                      </div>

                      {request.url_reference && (
                        <a
                          href={request.url_reference}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-orange-500 hover:text-orange-600 underline"
                        >
                          Voir le lien de référence
                        </a>
                      )}

                      {request.image && (
                        <div className="mt-3">
                          <img
                            src={request.image}
                            alt={request.product_name}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SpecialRequest = () => (
  <ProtectedRoute>
    <SpecialRequestContent />
  </ProtectedRoute>
);
