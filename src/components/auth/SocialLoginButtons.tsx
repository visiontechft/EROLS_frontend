import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || '';

// Debug en dehors du composant (sans hook)
console.log('=== CONFIG SOCIAL LOGIN ===');
console.log('Google Client ID:', GOOGLE_CLIENT_ID ? '✓ Défini' : '✗ Non défini');
console.log('Facebook App ID:', FACEBOOK_APP_ID ? '✓ Défini' : '✗ Non défini');

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
  const { googleLogin, facebookLogin } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingProvider, setLoadingProvider] = React.useState<'google' | 'facebook' | null>(null);

  // Hook CORRECTEMENT placé à l'intérieur du composant
  React.useEffect(() => {
    console.log('Composant monté - Google:', GOOGLE_CLIENT_ID ? 'Défini' : 'Non défini');
    console.log('Composant monté - Facebook:', FACEBOOK_APP_ID ? 'Défini' : 'Non défini');
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setLoadingProvider('google');
      
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
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleGoogleError = () => {
    if (onError) {
      onError('Erreur lors de la connexion avec Google. Veuillez réessayer.');
    }
  };

  const handleFacebookSuccess = async (response: any) => {
    if (response.accessToken) {
      try {
        setIsLoading(true);
        setLoadingProvider('facebook');
        
        await facebookLogin(response.accessToken);
        
        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        console.error('Facebook login error:', error);
        const errorMessage = error.message || 'Erreur lors de la connexion avec Facebook';
        if (onError) {
          onError(errorMessage);
        }
      } finally {
        setIsLoading(false);
        setLoadingProvider(null);
      }
    }
  };

  const handleFacebookError = (error: any) => {
    console.error('Facebook login error:', error);
    if (onError) {
      onError('Erreur lors de la connexion avec Facebook. Veuillez réessayer.');
    }
  };

  // Si aucun provider n'est configuré, afficher un message de debug en dev
  if (!GOOGLE_CLIENT_ID && !FACEBOOK_APP_ID) {
    if (import.meta.env.DEV) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Aucun provider social configuré. Vérifiez vos variables d'environnement.
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

      {/* Social Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {/* Google Login */}
        {GOOGLE_CLIENT_ID && (
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text={mode === 'login' ? 'continue_with' : 'signup_with'}
                width="100%"
                locale="fr"
                disabled={isLoading}
              />
            </div>
          </GoogleOAuthProvider>
        )}

        {/* Facebook Login */}
        {FACEBOOK_APP_ID && (
          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            onSuccess={handleFacebookSuccess}
            onFail={handleFacebookError}
            render={({ onClick }) => (
              <button
                onClick={onClick}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loadingProvider === 'facebook' ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-600" />
                ) : (
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                {mode === 'login' ? 'Continuer' : "S'inscrire"} avec Facebook
              </button>
            )}
          />
        )}
      </div>

      {/* Info message */}
      {mode === 'register' && (
        <p className="text-xs text-center text-gray-500">
          En vous inscrivant via Google ou Facebook, vous acceptez nos{' '}
          <a href="/conditions" className="text-orange-500 hover:text-orange-600">
            conditions d'utilisation
          </a>
        </p>
      )}
    </div>
  );
}