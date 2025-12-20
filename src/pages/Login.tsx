import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { LoginCredentials } from '../types';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const from = (location.state as any)?.from?.pathname || '/';

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setIsSubmitting(true);
      setLoginError('');
      
      await login(data);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(
        error.message || 
        error.error || 
        'Identifiants incorrects. Veuillez réessayer.'
      );
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
            Connectez-vous pour accéder à votre compte
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {loginError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <p className="text-sm">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email or Username */}
            <Input
              label="Email ou Nom d'utilisateur"
              type="text"
              placeholder="votre@email.com ou username"
              leftIcon={<Mail className="h-5 w-5" />}
              {...register('email', {
                required: "L'email ou le nom d'utilisateur est requis",
              })}
              error={errors.email?.message}
              helperText="Vous pouvez utiliser votre email ou votre nom d'utilisateur"
              required
            />

            {/* Password */}
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-5 w-5" />}
              {...register('password', {
                required: 'Le mot de passe est requis',
              })}
              error={errors.password?.message}
              required
            />

            {/* Remember & Forgot */}
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
                to="/mot-de-passe-oublie"
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Mot de passe oublié?
              </Link>
            </div>

            {/* Submit Button */}
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

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte?{' '}
              <Link
                to="/register"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Login Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 text-center">
            💡 <strong>Astuce:</strong> Utilisez votre email ou nom d'utilisateur pour vous connecter
          </p>
        </div>
      </div>
    </div>
  );
}