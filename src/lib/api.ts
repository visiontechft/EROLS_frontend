import axios, { AxiosError, AxiosInstance } from 'axios';
import type {
  User,
  AuthUser,
  LoginCredentials,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  Product,
  Category,
  City,
  Order,
  InitiateOrderData,
  InitiateOrderResponse,
  OrderStats,
  UserStats,
  PaginatedResponse,
  ProductFilters,
  ApiError,
  ChangePasswordData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ========== Axios Instance Configuration ==========
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// ========== Request Interceptor ==========
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========== Response Interceptor ==========
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const apiError: ApiError = {
      message: error.response?.data?.error || 
               error.response?.data?.message || 
               error.message || 
               'Une erreur est survenue',
      errors: error.response?.data?.errors,
      status: error.response?.status,
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
      
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(apiError);
  }
);

// ========== Authentication API ==========
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    const response = await apiClient.post<LoginResponse>('/users/login/', {
      username: credentials.email,
      password: credentials.password,
    });
    
    const { tokens, user } = response.data;
    
    localStorage.setItem('auth_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return {
      user: user,
      token: tokens.access,
    };
  },

  register: async (data: RegisterData): Promise<AuthUser> => {
    const username = data.username || data.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
    
    const registerData = {
      username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      password2: data.password_confirmation,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      whatsapp: data.whatsapp || data.phone,
      address: data.address || '',
      city: data.city || 'Douala',
      user_type: data.user_type || 'client',
    };
    
    const response = await apiClient.post<RegisterResponse>('/users/register/', registerData);
    
    const { tokens, user } = response.data;
    
    localStorage.setItem('auth_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return {
      user: user,
      token: tokens.access,
    };
  },

  /**
   * Authentification via Google OAuth
   */
  googleLogin: async (idToken: string): Promise<AuthUser> => {
    const response = await apiClient.post<LoginResponse>('/users/auth/google/', {
      id_token: idToken,
    });
    
    const { tokens, user } = response.data;
    
    localStorage.setItem('auth_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return {
      user: user,
      token: tokens.access,
    };
  },

  /**
   * Authentification via Facebook OAuth
   */
  facebookLogin: async (accessToken: string): Promise<AuthUser> => {
    const response = await apiClient.post<LoginResponse>('/users/auth/facebook/', {
      access_token: accessToken,
    });
    
    const { tokens, user } = response.data;
    
    localStorage.setItem('auth_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return {
      user: user,
      token: tokens.access,
    };
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      try {
        await apiClient.post('/users/logout/', { refresh: refreshToken });
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    }
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/profile/');
    localStorage.setItem('auth_user', JSON.stringify(response.data));
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>('/users/profile/', data);
    localStorage.setItem('auth_user', JSON.stringify(response.data));
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<void> => {
    await apiClient.post('/users/change-password/', data);
  },

  getUserStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>('/users/stats/');
    return response.data;
  },

  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiClient.post<{ access: string }>('/users/token/refresh/', {
      refresh: refreshToken,
    });
    
    const newAccessToken = response.data.access;
    localStorage.setItem('auth_token', newAccessToken);
    
    return newAccessToken;
  },
};

// ========== Products API ==========
export const productsApi = {
  getProducts: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.min_price) params.append('min_price', filters.min_price.toString());
      if (filters.max_price) params.append('max_price', filters.max_price.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.is_featured !== undefined) params.append('is_featured', filters.is_featured.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.page_size) params.append('page_size', filters.page_size.toString());
    }
    
    const response = await apiClient.get<PaginatedResponse<Product>>('/products/', { params });
    return response.data;
  },

  getProduct: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${slug}/`);
    return response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products/search/', {
      params: { q: query },
    });
    return response.data;
  },
};

// ========== Categories API ==========
export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/products/categories/');
    
    const data = response.data;
    
    if (Array.isArray(data)) {
      return data;
    }
    
    if ('results' in data && Array.isArray(data.results)) {
      return data.results;
    }
    
    console.warn('Format de catégories inattendu:', data);
    return [];
  },

  getCategory: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/products/categories/${slug}/`);
    return response.data;
  },

  getCategoryProducts: async (slug: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    params.append('category', slug);
    
    if (filters) {
      if (filters.min_price) params.append('min_price', filters.min_price.toString());
      if (filters.max_price) params.append('max_price', filters.max_price.toString());
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.page_size) params.append('page_size', filters.page_size.toString());
    }
    
    const response = await apiClient.get<PaginatedResponse<Product>>('/products/', { params });
    return response.data;
  },
};

// ========== Cities API ==========
export const citiesApi = {
  getCities: async (): Promise<City[]> => {
    const response = await apiClient.get<City[] | { results: City[] }>('/orders/cities/');
    
    const data = response.data;
    
    if (Array.isArray(data)) {
      return data;
    }
    
    if ('results' in data && Array.isArray(data.results)) {
      return data.results;
    }
    
    console.warn('Format de cities inattendu:', data);
    return [];
  },
};

// ========== Orders API ==========
export const ordersApi = {
  initiateOrder: async (data: InitiateOrderData): Promise<InitiateOrderResponse> => {
    const response = await apiClient.post<InitiateOrderResponse>('/orders/orders/initiate/', data);
    return response.data;
  },

  initiateCartOrder: async (data: any): Promise<any> => {
    const response = await apiClient.post<any>('/orders/orders/initiate_cart/', data);
    return response.data;
  },

  getOrderHistory: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders/orders/history/');
    
    const data = response.data;
    if ('results' in data && Array.isArray(data.results)) {
      return data.results;
    }
    
    return Array.isArray(data) ? data : [];
  },

  getOrderStats: async (): Promise<OrderStats> => {
    const response = await apiClient.get<OrderStats>('/orders/orders/stats/');
    return response.data;
  },

  updateOrderStatus: async (id: number, status: 'completed' | 'cancelled'): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/orders/${id}/update_status/`, { status });
    return response.data;
  },
};

// ========== Helper Functions ==========
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  return !!token;
};

export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('auth_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

export const formatDate = (dateStr: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
};

export const getOrderStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    redirected: 'Redirigé vers WhatsApp',
    completed: 'Complétée',
    cancelled: 'Annulée',
  };
  return labels[status] || status;
};

export default apiClient;