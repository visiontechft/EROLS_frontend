import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PageLoader } from '../components/ui/LoadingSpinner';
import type { User as UserType } from '../types';
import { toast } from 'react-toastify';

type ProfileTab = 'info' | 'password';

interface PasswordFormData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export function Profile() {
  const { user, updateUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<Partial<UserType>>({
    defaultValues: user || undefined,
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>();

  const newPassword = watch('password');

  const onProfileSubmit = async (data: Partial<UserType>) => {
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

  const onPasswordSubmit = async (data: PasswordFormData) => {
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
                    {user.first_name[0]?.toUpperCase()}
                    {user.last_name[0]?.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
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

                  <Input
                    label="Téléphone"
                    type="tel"
                    leftIcon={<Phone className="h-5 w-5" />}
                    {...registerProfile('phone')}
                    error={profileErrors.phone?.message}
                  />

                  {/* Address Fields */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Adresse de livraison par défaut
                    </h3>

                    <div className="space-y-4">
                      <Input
                        label="Adresse"
                        leftIcon={<MapPin className="h-5 w-5" />}
                        {...registerProfile('address')}
                        error={profileErrors.address?.message}
                      />

                      <div className="grid md:grid-cols-3 gap-4">
                        <Input
                          label="Ville"
                          {...registerProfile('city')}
                          error={profileErrors.city?.message}
                        />
                        <Input
                          label="Code postal"
                          {...registerProfile('postal_code')}
                          error={profileErrors.postal_code?.message}
                        />
                        <Input
                          label="Pays"
                          {...registerProfile('country')}
                          error={profileErrors.country?.message}
                        />
                      </div>
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
                    {...registerPassword('current_password', {
                      required: 'Le mot de passe actuel est requis',
                    })}
                    error={passwordErrors.current_password?.message}
                    required
                  />

                  <Input
                    label="Nouveau mot de passe"
                    type="password"
                    leftIcon={<Lock className="h-5 w-5" />}
                    {...registerPassword('password', {
                      required: 'Le nouveau mot de passe est requis',
                      minLength: {
                        value: 8,
                        message:
                          'Le mot de passe doit contenir au moins 8 caractères',
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message:
                          'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
                      },
                    })}
                    error={passwordErrors.password?.message}
                    helperText="Au moins 8 caractères avec majuscule, minuscule et chiffre"
                    required
                  />

                  <Input
                    label="Confirmer le nouveau mot de passe"
                    type="password"
                    leftIcon={<Lock className="h-5 w-5" />}
                    {...registerPassword('password_confirmation', {
                      required: 'Veuillez confirmer votre mot de passe',
                      validate: (value) =>
                        value === newPassword ||
                        'Les mots de passe ne correspondent pas',
                    })}
                    error={passwordErrors.password_confirmation?.message}
                    required
                  />

                  {/* Password Requirements */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                      Exigences du mot de passe:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Au moins 8 caractères</li>
                      <li>• Au moins une lettre majuscule</li>
                      <li>• Au moins une lettre minuscule</li>
                      <li>• Au moins un chiffre</li>
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
