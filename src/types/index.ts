// ========== User Types ==========
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  whatsapp?: string;
  user_type: 'client' | 'reseller' | 'vendor';
  user_type_display: string;
  address?: string;
  city: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  city: string;
  password: string;
  password_confirmation: string;
  user_type?: 'client' | 'reseller' | 'vendor';
  terms?: boolean;
}

// ========== Product Types ==========
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: Category;
  image_url: string | null;
  stock: number;
  in_stock: boolean;
  is_available: boolean;
  is_featured?: boolean;
  original_price?: number;
  discount_percentage?: number;
  rating?: number;
  review_count?: number;
  images?: ProductImage[];
  specifications?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
  order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  product_count: number;
}

// ========== Cart Types ==========
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// ========== City Types (NOUVEAU) ==========
export interface City {
  id: number;
  name: string;
  whatsapp_number: string;
  display_order: number;
}

// ========== Order Types (SIMPLIFIÉ) ==========
export interface Order {
  id: number;
  user: number;
  product_name: string;
  product_price: string;
  city_name: string;
  status: OrderStatus;
  status_display: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'redirected' | 'completed' | 'cancelled';

// ========== Initiate Order Types (NOUVEAU) ==========
export interface InitiateOrderData {
  product_id: number;
  city_id: number;
  quantity?: number;
}

export interface InitiateCartOrderData {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  city_id: number;
}

export interface InitiateOrderResponse {
  order_id: number;
  whatsapp_url: string;
  city: string;
  product: string;
  price: number;
}

export interface InitiateCartOrderResponse {
  order_ids: number[];
  whatsapp_url: string;
  city: string;
  items_count: number;
  total_price: number;
}

// ========== Order Stats (SIMPLIFIÉ) ==========
export interface OrderStats {
  total_orders: number;
  redirected: number;
  completed: number;
  cancelled: number;
}

// ========== User Stats ==========
export interface UserStats {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_spent: number;
}

// ========== Pagination Types ==========
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ========== Filter Types ==========
export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
  is_featured?: boolean;
  page?: number;
  page_size?: number;
}

// ========== API Response Types ==========
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// ========== JWT Tokens ==========
export interface JWTTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  tokens: JWTTokens;
}

export interface RegisterResponse {
  message: string;
  user: User;
  tokens: JWTTokens;
}

// ========== Change Password ==========
export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  new_password2: string;
}