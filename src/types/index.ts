// User types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
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
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  category: Category;
  images: ProductImage[];
  stock: number;
  is_available: boolean;
  is_featured: boolean;
  rating?: number;
  review_count?: number;
  specifications?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: number;
  product_count?: number;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Order types
export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: OrderStatus;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  tax_amount?: number;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_image?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  address_2?: string;
  city: string;
  postal_code: string;
  country: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod =
  | 'cash_on_delivery'
  | 'bank_transfer'
  | 'mobile_money'
  | 'credit_card';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface CreateOrderData {
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  notes?: string;
}

// Special Request types
export interface SpecialRequest {
  id: number;
  user_id?: number;
  name: string;
  email: string;
  phone: string;
  product_name: string;
  product_url?: string;
  description: string;
  budget?: number;
  quantity: number;
  delivery_deadline?: string;
  status: SpecialRequestStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export type SpecialRequestStatus =
  | 'pending'
  | 'reviewing'
  | 'quoted'
  | 'accepted'
  | 'rejected'
  | 'completed';

export interface CreateSpecialRequestData {
  name: string;
  email: string;
  phone: string;
  product_name: string;
  product_url?: string;
  description: string;
  budget?: number;
  quantity: number;
  delivery_deadline?: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Filter types
export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
  is_featured?: boolean;
  page?: number;
  per_page?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Contact types
export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Review types
export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  user_name: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  product_id: number;
  rating: number;
  comment: string;
}
