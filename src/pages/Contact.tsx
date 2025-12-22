import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'react-toastify';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    console.log('Contact form:', data);
    toast.success('Message envoyé avec succès ! Nous vous répondrons sous peu.');
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Contactez-nous</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Une question ? Une suggestion ? N'hésitez pas à nous contacter
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Téléphone</h3>
                  <a href="tel:+237674554947" className="text-gray-600 hover:text-orange-500 block">
                    +237 674 55 49 47
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                  <a href="mailto:contact@erols.com" className="text-gray-600 hover:text-orange-500 block text-sm">
                    contact@erols.com
                  </a>
                  <a href="mailto:services_client@erols.com" className="text-gray-600 hover:text-orange-500 block text-sm mt-1">
                    services_client@erols.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Adresse</h3>
                  <p className="text-gray-600">
                    Douala, Cameroun
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-8 h-8" />
                <h3 className="font-bold text-lg">WhatsApp</h3>
              </div>
              <p className="mb-4">Pour une réponse rapide, contactez-nous sur WhatsApp !</p>
              <a
                href="https://wa.me/237695538075"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Ouvrir WhatsApp
              </a>
              <p className="text-sm text-green-100 mt-3 text-center">
                +237 695 53 80 75
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Envoyez-nous un message</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Nom complet *"
                    {...register('name', { required: 'Nom requis' })}
                    error={errors.name?.message}
                    placeholder="Jean Dupont"
                  />
                  <Input
                    label="Email *"
                    type="email"
                    {...register('email', {
                      required: 'Email requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide',
                      },
                    })}
                    error={errors.email?.message}
                    placeholder="jean@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Téléphone *"
                    type="tel"
                    {...register('phone', { required: 'Téléphone requis' })}
                    error={errors.phone?.message}
                    placeholder="+237 6 XX XX XX XX"
                  />
                  <Input
                    label="Sujet *"
                    {...register('subject', { required: 'Sujet requis' })}
                    error={errors.subject?.message}
                    placeholder="Question sur une commande"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    {...register('message', { required: 'Message requis' })}
                    rows={6}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Votre message..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Send className="w-5 h-5" />
                  Envoyer le message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};