import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PageLoader } from '../components/ui/LoadingSpinner';
import type { User as UserType, ChangePasswordData } from '../types';
import { toast } from 'react-toastify';

type ProfileTab = 'info' | 'password';

// Type pour la mise à jour du profil
interface UpdateProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  city: string;
}

export function Profile() {
  const { user, updateUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<UpdateProfileData>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      whatsapp: user?.whatsapp || '',
      address: user?.address || '',
      city: user?.city || 'Douala',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordData>();

  const newPassword = watch('new_password');

  const onProfileSubmit = async (data: UpdateProfileData) => {
    try {
      setIsSubmitting(true);
      const updatedUser = await authApi.updateProfile(data);
      updateUser(updatedUser);
      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordData) => {
    try {
      setIsSubmitting(true);
      await authApi.changePassword(data);
      toast.success('Mot de passe modifié avec succès');
      resetPasswordForm();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  // Obtenir les initiales pour l'avatar
  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-1">Gérez vos informations personnelles</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* User Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-3xl">
                    {getInitials()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {user.full_name || user.username}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                {user.is_verified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    Vérifié
                  </span>
                )}
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'info'
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Informations</span>
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'password'
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="h-5 w-5" />
                  <span className="font-medium">Mot de passe</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Profile Information Tab */}
              {activeTab === 'info' && (
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Informations personnelles
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Mettez à jour vos informations personnelles
                    </p>
                  </div>

                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Prénom"
                      leftIcon={<User className="h-5 w-5" />}
                      {...registerProfile('first_name', {
                        required: 'Le prénom est requis',
                      })}
                      error={profileErrors.first_name?.message}
                      required
                    />
                    <Input
                      label="Nom"
                      {...registerProfile('last_name', {
                        required: 'Le nom est requis',
                      })}
                      error={profileErrors.last_name?.message}
                      required
                    />
                  </div>

                  {/* Contact Fields */}
                  <Input
                    label="Email"
                    type="email"
                    leftIcon={<Mail className="h-5 w-5" />}
                    {...registerProfile('email', {
                      required: "L'email est requis",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide',
                      },
                    })}
                    error={profileErrors.email?.message}
                    required
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Téléphone"
                      type="tel"
                      leftIcon={<Phone className="h-5 w-5" />}
                      placeholder="+237 6XX XX XX XX"
                      {...registerProfile('phone', {
                        required: 'Le téléphone est requis',
                      })}
                      error={profileErrors.phone?.message}
                      required
                    />
                    <Input
                      label="WhatsApp (optionnel)"
                      type="tel"
                      leftIcon={<Phone className="h-5 w-5" />}
                      placeholder="+237 6XX XX XX XX"
                      {...registerProfile('whatsapp')}
                      error={profileErrors.whatsapp?.message}
                    />
                  </div>

                  {/* Address Fields */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Adresse de livraison
                    </h3>

                    <div className="space-y-4">
                      <Input
                        label="Adresse"
                        leftIcon={<MapPin className="h-5 w-5" />}
                        placeholder="123 Rue de la Paix, Quartier..."
                        {...registerProfile('address')}
                        error={profileErrors.address?.message}
                      />

                      <Input
                        label="Ville"
                        placeholder="Douala, Yaoundé..."
                        {...registerProfile('city', {
                          required: 'La ville est requise',
                        })}
                        error={profileErrors.city?.message}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      leftIcon={<Save className="h-5 w-5" />}
                    >
                      Enregistrer les modifications
                    </Button>
                  </div>
                </form>
              )}

              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <form
                  onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Changer le mot de passe
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Assurez-vous d'utiliser un mot de passe fort et unique
                    </p>
                  </div>

                  <Input
                    label="Mot de passe actuel"
                    type="password"
                    leftIcon={<Lock className="h-5 w-5" />}
                    {...registerPassword('old_password', {
                      required: 'Le mot de passe actuel est requis',
                    })}
                    error={passwordErrors.old_password?.message}
                    required
                  />

                  <Input
                    label="Nouveau mot de passe"
                    type="password"
                    leftIcon={<Lock className="h-5 w-5" />}
                    {...registerPassword('new_password', {
                      required: 'Le nouveau mot de passe est requis',
                      minLength: {
                        value: 8,
                        message:
                          'Le mot de passe doit contenir au moins 8 caractères',
                      },
                    })}
                    error={passwordErrors.new_password?.message}
                    helperText="Au moins 8 caractères"
                    required
                  />

                  <Input
                    label="Confirmer le nouveau mot de passe"
                    type="password"
                    leftIcon={<Lock className="h-5 w-5" />}
                    {...registerPassword('new_password2', {
                      required: 'Veuillez confirmer votre mot de passe',
                      validate: (value) =>
                        value === newPassword ||
                        'Les mots de passe ne correspondent pas',
                    })}
                    error={passwordErrors.new_password2?.message}
                    required
                  />

                  {/* Password Requirements */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                      Exigences du mot de passe:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Au moins 8 caractères</li>
                      <li>• Utilisez un mot de passe unique</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      leftIcon={<Save className="h-5 w-5" />}
                    >
                      Changer le mot de passe
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}