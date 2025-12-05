import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { LoginCredentials } from '../types';

export function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setIsSubmitting(true);
      await login(data);
      // Navigation is handled in the login function
    } catch (error) {
      // Error is handled in the login function
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
          <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
          <p className="mt-2 text-gray-600">
            Connectez-vous à votre compte pour continuer
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {from !== '/' && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                Vous devez être connecté pour accéder à cette page.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-5 w-5" />}
              {...register('password', {
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères',
                },
              })}
              error={errors.password?.message}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Se souvenir de moi
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Mot de passe oublié?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
              leftIcon={<LogIn className="h-5 w-5" />}
            >
              Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte?{' '}
              <Link
                to="/inscription"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-orange-500 text-xl">🔒</span>
            </div>
            <p className="text-xs text-gray-600">Sécurisé</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-orange-500 text-xl">⚡</span>
            </div>
            <p className="text-xs text-gray-600">Rapide</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-orange-500 text-xl">✓</span>
            </div>
            <p className="text-xs text-gray-600">Fiable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
