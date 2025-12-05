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
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<AuthUser>>('/auth/login', credentials)
    );
  },

  // Register
  register: async (data: RegisterData): Promise<AuthUser> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<AuthUser>>('/auth/register', data)
    );
  },

  // Logout
  logout: async (): Promise<void> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<void>>('/auth/logout')
    );
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<User>>('/auth/user')
    );
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return handleApiCall(() =>
      apiClient.put<ApiResponse<User>>('/auth/profile', data)
    );
  },

  // Change password
  changePassword: async (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<void>>('/auth/change-password', data)
    );
  },
};

// Products API
export const productsApi = {
  // Get all products with filters
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
      '/products',
      { params }
    );
    return response.data;
  },

  // Get single product by slug
  getProduct: async (slug: string): Promise<Product> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Product>>(`/products/${slug}`)
    );
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<Product[]> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Product[]>>('/products/featured')
    );
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Product[]>>('/products/search', {
        params: { q: query },
      })
    );
  },
};

// Categories API
export const categoriesApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Category[]>>('/products/categories')
    );
  },

  // Get single category
  getCategory: async (slug: string): Promise<Category> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Category>>(`/categories/${slug}`)
    );
  },

  // Get products by category
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
      `/categories/${slug}/products`,
      { params }
    );
    return response.data;
  },
};

// Orders API
export const ordersApi = {
  // Create order
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<Order>>('/orders', data)
    );
  },

  // Get user orders
  getOrders: async (): Promise<Order[]> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Order[]>>('/orders')
    );
  },

  // Get single order
  getOrder: async (id: number): Promise<Order> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Order>>(`/orders/${id}`)
    );
  },

  // Cancel order
  cancelOrder: async (id: number): Promise<Order> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<Order>>(`/orders/${id}/cancel`)
    );
  },

  // Get order by number
  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Order>>(`/orders/number/${orderNumber}`)
    );
  },
};

// Special Requests API
export const specialRequestsApi = {
  // Create special request
  createRequest: async (
    data: CreateSpecialRequestData
  ): Promise<SpecialRequest> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<SpecialRequest>>('/special-requests', data)
    );
  },

  // Get user special requests
  getRequests: async (): Promise<SpecialRequest[]> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<SpecialRequest[]>>('/special-requests')
    );
  },

  // Get single special request
  getRequest: async (id: number): Promise<SpecialRequest> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<SpecialRequest>>(`/special-requests/${id}`)
    );
  },
};

// Contact API
export const contactApi = {
  // Send contact message
  sendMessage: async (data: ContactMessage): Promise<void> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<void>>('/contact', data)
    );
  },
};

// Reviews API
export const reviewsApi = {
  // Get product reviews
  getProductReviews: async (productId: number): Promise<Review[]> => {
    return handleApiCall(() =>
      apiClient.get<ApiResponse<Review[]>>(`/products/${productId}/reviews`)
    );
  },

  // Create review
  createReview: async (data: CreateReviewData): Promise<Review> => {
    return handleApiCall(() =>
      apiClient.post<ApiResponse<Review>>('/reviews', data)
    );
  },

  // Delete review
  deleteReview: async (id: number): Promise<void> => {
    return handleApiCall(() =>
      apiClient.delete<ApiResponse<void>>(`/reviews/${id}`)
    );
  },
};

// Export the configured axios instance for custom calls
export default apiClient;
