import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { RegisterData } from '../types';

export function Register() {
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData) => {
    try {
      setIsSubmitting(true);
      await registerUser(data);
      // Navigation is handled in the register function
    } catch (error) {
      // Error is handled in the register function
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-lg">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">EROLS</span>
              <span className="text-2xl font-bold text-orange-500 ml-1">
                EasyBuy
              </span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
          <p className="mt-2 text-gray-600">
            Rejoignez-nous et commencez vos achats
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                placeholder="John"
                leftIcon={<User className="h-5 w-5" />}
                {...register('first_name', {
                  required: 'Le prénom est requis',
                  minLength: {
                    value: 2,
                    message: 'Le prénom doit contenir au moins 2 caractères',
                  },
                })}
                error={errors.first_name?.message}
                required
              />

              <Input
                label="Nom"
                placeholder="Doe"
                {...register('last_name', {
                  required: 'Le nom est requis',
                  minLength: {
                    value: 2,
                    message: 'Le nom doit contenir au moins 2 caractères',
                  },
                })}
                error={errors.last_name?.message}
                required
              />
            </div>

            {/* Email */}
            <Input
              label="Email"
              type="email"
              placeholder="votre@email.com"
              leftIcon={<Mail className="h-5 w-5" />}
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

            {/* Phone */}
            <Input
              label="Téléphone"
              type="tel"
              placeholder="+225 07 00 00 00 00"
              leftIcon={<Phone className="h-5 w-5" />}
              {...register('phone', {
                pattern: {
                  value: /^[+]?[\d\s-()]+$/,
                  message: 'Numéro de téléphone invalide',
                },
              })}
              error={errors.phone?.message}
              helperText="Optionnel - Format: +225 07 00 00 00 00"
            />

            {/* Password */}
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-5 w-5" />}
              {...register('password', {
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 8,
                  message: 'Le mot de passe doit contenir au moins 8 caractères',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message:
                    'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
                },
              })}
              error={errors.password?.message}
              helperText="Au moins 8 caractères avec majuscule, minuscule et chiffre"
              required
            />

            {/* Password Confirmation */}
            <Input
              label="Confirmer le mot de passe"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-5 w-5" />}
              {...register('password_confirmation', {
                required: 'Veuillez confirmer votre mot de passe',
                validate: (value) =>
                  value === password || 'Les mots de passe ne correspondent pas',
              })}
              error={errors.password_confirmation?.message}
              required
            />

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                {...register('terms', {
                  required: 'Vous devez accepter les conditions',
                })}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-1"
              />
              <label className="ml-2 text-sm text-gray-600">
                J'accepte les{' '}
                <Link
                  to="/conditions"
                  className="text-orange-500 hover:text-orange-600"
                  target="_blank"
                >
                  conditions générales
                </Link>{' '}
                et la{' '}
                <Link
                  to="/politique-confidentialite"
                  className="text-orange-500 hover:text-orange-600"
                  target="_blank"
                >
                  politique de confidentialité
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
              leftIcon={<UserPlus className="h-5 w-5" />}
            >
              Créer mon compte
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte?{' '}
              <Link
                to="/login"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            Pourquoi créer un compte?
          </h3>
          <ul className="space-y-3">
            {[
              'Suivez vos commandes en temps réel',
              'Sauvegardez vos adresses de livraison',
              'Accédez à des offres exclusives',
              'Historique de toutes vos commandes',
            ].map((benefit, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
