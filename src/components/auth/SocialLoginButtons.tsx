import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

interface SocialLoginButtonsProps {
  onError?: (error: string) => void;
  onSuccess?: () => void;
  mode?: 'login' | 'register';
}

export function SocialLoginButtons({
  onError,
  onSuccess,
  mode = 'login'
}: SocialLoginButtonsProps) {
  const { googleLogin } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await googleLogin(credentialResponse.credential);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMessage = error.message || 'Erreur lors de la connexion avec Google';
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const handleGoogleError = () => {
    if (onError) {
      onError('Erreur lors de la connexion avec Google. Veuillez réessayer.');
    }
  };

  if (!GOOGLE_CLIENT_ID) {
    if (import.meta.env.DEV) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 flex items-center gap-1.5">
            <AlertTriangle size={16} /> Aucun provider social configuré. Vérifiez vos variables d'environnement.
          </p>
        </div>
      );
    }
    return null;
  }

  const actionText = mode === 'login' ? 'continuer' : 'inscrire';

  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Ou {actionText} avec
          </span>
        </div>
      </div>

      {/* Google Login */}
      <div className="flex justify-center">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text={mode === 'login' ? 'continue_with' : 'signup_with'}
            width="320"
            locale="fr"
          />
        </GoogleOAuthProvider>
      </div>

      {/* Info message */}
      {mode === 'register' && (
        <p className="text-xs text-center text-gray-500">
          En vous inscrivant via Google, vous acceptez nos{' '}
          <a href="/conditions" className="text-orange-500 hover:text-orange-600">
            conditions d'utilisation
          </a>
        </p>
      )}
    </div>
  );
}
