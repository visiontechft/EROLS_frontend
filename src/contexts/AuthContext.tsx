import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../lib/api';
import type { User, LoginCredentials, RegisterData, AuthUser, ApiError } from '../types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  facebookLogin: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          try {
            const currentUser = await authApi.getProfile();
            setUser(currentUser);
            localStorage.setItem('auth_user', JSON.stringify(currentUser));
          } catch (error) {
            console.error('Token validation failed:', error);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('auth_user');
            setUser(null);
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        }
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const authUser: AuthUser = await authApi.login(credentials);

      setUser(authUser.user);

      toast.success('Connexion réussie!');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Échec de la connexion');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const authUser: AuthUser = await authApi.register(data);

      setUser(authUser.user);

      toast.success('Inscription réussie! Bienvenue sur EROLS EasyBuy!');
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.errors) {
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            toast.error(`${field}: ${message}`);
          });
        });
      } else {
        toast.error(apiError.message || "Échec de l'inscription");
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (idToken: string) => {
    try {
      setIsLoading(true);
      const authUser: AuthUser = await authApi.googleLogin(idToken);

      setUser(authUser.user);

      toast.success('Connexion Google réussie!');
      navigate('/');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Échec de la connexion Google');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const facebookLogin = async (accessToken: string) => {
    try {
      setIsLoading(true);
      const authUser: AuthUser = await authApi.facebookLogin(accessToken);

      setUser(authUser.user);

      toast.success('Connexion Facebook réussie!');
      navigate('/');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Échec de la connexion Facebook');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      try {
        await authApi.logout();
      } catch (error) {
        console.error('Logout API error:', error);
      }

      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
      setUser(null);

      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Erreur lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authApi.getProfile();
      setUser(currentUser);
      localStorage.setItem('auth_user', JSON.stringify(currentUser));
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Error refreshing user:', apiError);

      if (apiError.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('auth_user');
        setUser(null);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    googleLogin,
    facebookLogin,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}