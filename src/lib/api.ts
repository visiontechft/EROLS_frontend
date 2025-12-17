import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import type {
  User,
  AuthUser,
  LoginCredentials,
  RegisterData,
  Product,
  Category,
  Order,
  CreateOrderData,
  SpecialRequest,
  CreateSpecialRequestData,
  ContactMessage,
  Review,
  CreateReviewData,
  PaginatedResponse,
  ProductFilters,
  ApiResponse,
  ApiError,
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<never>>) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Une erreur est survenue',
      errors: error.response?.data?.errors,
      status: error.response?.status,
    };

    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }

    return Promise.reject(apiError);
  }
);

// Helper function to handle API calls
const handleApiCall = async <T>(
  apiCall: () => Promise<{ data: ApiResponse<T> }>
): Promise<T> => {
  try {
    const response = await apiCall();
    if (response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data as unknown as T;
  } catch (error) {
    throw error;
  }
};

// Authentication API
export const authApi = {
  // Login - Transforme email en username pour le backend
  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    // Le backend attend username/password, mais le frontend utilise email/password
    const loginData = {
      username: credentials.email, // Utiliser l'email comme username
      password: credentials.password,
    };
    
    const response = await apiClient.post('/users/login/', loginData);
    
    // Stocker le token
    if (response.data.access) {
      localStorage.setItem('auth_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    }
    
    return {
      user: response.data.user,
      token: response.data.access,
    };
  },

  // Register - Transforme les données pour le backend
  register: async (data: RegisterData): Promise<AuthUser> => {
    // Transformer les données pour correspondre à l'API backend
    const registerData = {
      username: data.email.split('@')[0], // Générer username depuis email
      email: data.email,
      phone: data.phone,
      password: data.password,
      password2: data.password, // Le backend attend password2
      user_type: 'client',
      whatsapp: data.whatsapp || data.phone,
      address: data.address,
      city: data.city,
    };
    
    const response = await apiClient.post('/users/register/', registerData);
    
    // Le backend retourne juste l'utilisateur créé, pas de token
    // On doit se connecter ensuite
    if (response.data) {
      // Auto-login après inscription
      return await authApi.login({
        email: data.email,
        password: data.password,
      });
    }
    
    throw new Error('Erreur lors de l\'inscription');
  },

  // Logout - SLASH AJOUTÉ
  logout: async (): Promise<void> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<void>>('/users/logout/')
    );
  },

  // Get current user - SLASH AJOUTÉ
  getCurrentUser: async (): Promise<User> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<User>>('/users/me/')
    );
  },

  // Update profile - SLASH AJOUTÉ
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return handleApiCall(() =>
      apiClient.put<ApiResponse<User>>('/users/profile/', data)
    );
  },

  // Change password - SLASH AJOUTÉ
  changePassword: async (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<void>>('/users/change-password/', data)
    );
  },
};

// Products API
export const productsApi = {
  // Get all products with filters - SLASH AJOUTÉ
  getProducts: async (
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get<PaginatedResponse<Product>>(
      '/products/',
      { params }
    );
    return response.data;
  },

  // Get single product by slug - SLASH AJOUTÉ
  getProduct: async (slug: string): Promise<Product> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Product>>(`/products/${slug}/`)
    );
  },

  // Get featured products - SLASH AJOUTÉ
  getFeaturedProducts: async (): Promise<Product[]> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Product[]>>('/products/featured/')
    );
  },

  // Search products - SLASH AJOUTÉ
  searchProducts: async (query: string): Promise<Product[]> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Product[]>>('/products/search/', {
        params: { q: query },
      })
    );
  },
};

// Categories API
export const categoriesApi = {
  // Get all categories - SLASH AJOUTÉ
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get('/products/categories/');
      
      // Gérer différents formats de réponse possibles
      const data = response.data;
      
      // Si c'est déjà un tableau
      if (Array.isArray(data)) {
        return data;
      }
      
      // Si c'est un objet avec data
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      // Si c'est un objet avec results
      if (data.results && Array.isArray(data.results)) {
        return data.results;
      }
      
      // Fallback: retourner un tableau vide
      console.warn('Format de catégories inattendu:', data);
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  },

  // Get single category - SLASH AJOUTÉ
  getCategory: async (slug: string): Promise<Category> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Category>>(`/categories/${slug}/`)
    );
  },

  // Get products by category - SLASH AJOUTÉ
  getCategoryProducts: async (
    slug: string,
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/categories/${slug}/products/`,
      { params }
    );
    return response.data;
  },
};

// Orders API
export const ordersApi = {
  // Create order - SLASH AJOUTÉ
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<Order>>('/orders/', data)
    );
  },

  // Get user orders - SLASH AJOUTÉ
  getOrders: async (): Promise<Order[]> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Order[]>>('/orders/')
    );
  },

  // Get single order - SLASH AJOUTÉ
  getOrder: async (id: number): Promise<Order> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Order>>(`/orders/${id}/`)
    );
  },

  // Cancel order - SLASH AJOUTÉ
  cancelOrder: async (id: number): Promise<Order> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<Order>>(`/orders/${id}/cancel/`)
    );
  },

  // Get order by number - SLASH AJOUTÉ
  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Order>>(`/orders/number/${orderNumber}/`)
    );
  },
};

// Special Requests API
export const specialRequestsApi = {
  // Create special request - SLASH AJOUTÉ
  createRequest: async (
    data: CreateSpecialRequestData
  ): Promise<SpecialRequest> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<SpecialRequest>>('/special-requests/', data)
    );
  },

  // Get user special requests - SLASH AJOUTÉ
  getRequests: async (): Promise<SpecialRequest[]> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<SpecialRequest[]>>('/special-requests/')
    );
  },

  // Get single special request - SLASH AJOUTÉ
  getRequest: async (id: number): Promise<SpecialRequest> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<SpecialRequest>>(`/special-requests/${id}/`)
    );
  },
};

// Contact API
export const contactApi = {
  // Send contact message - SLASH AJOUTÉ
  sendMessage: async (data: ContactMessage): Promise<void> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<void>>('/contact/', data)
    );
  },
};

// Reviews API
export const reviewsApi = {
  // Get product reviews - SLASH AJOUTÉ
  getProductReviews: async (productId: number): Promise<Review[]> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Review[]>>(`/products/${productId}/reviews/`)
    );
  },

  // Create review - SLASH AJOUTÉ
  createReview: async (data: CreateReviewData): Promise<Review> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<Review>>('/reviews/', data)
    );
  },

  // Delete review - SLASH AJOUTÉ
  deleteReview: async (id: number): Promise<void> => {
    return handleApiCall(() =>
      apiClient.delete<ApiResponse<void>>(`/reviews/${id}/`)
    );
  },
};

// Export the configured axios instance for custom calls
export default apiClient;