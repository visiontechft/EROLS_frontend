import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import type { Product, CartItem, Cart } from '../types';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'erols_cart';

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart) as CartItem[];
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Calculate cart totals
  const calculateCart = (): Cart => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: cartItems,
      total,
      itemCount,
    };
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    // Check if product is available
    if (!product.is_available) {
      toast.error('Ce produit n\'est pas disponible');
      return;
    }

    // Check stock
    if (product.stock < quantity) {
      toast.error('Stock insuffisant');
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        // Check if new quantity exceeds stock
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error('Quantité demandée dépasse le stock disponible');
          return prevItems;
        }

        // Update quantity
        toast.success('Quantité mise à jour dans le panier');
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Add new item
        toast.success('Produit ajouté au panier');
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => {
      const filtered = prevItems.filter((item) => item.product.id !== productId);
      toast.success('Produit retiré du panier');
      return filtered;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) => {
      const item = prevItems.find((item) => item.product.id === productId);

      if (!item) {
        return prevItems;
      }

      // Check stock
      if (quantity > item.product.stock) {
        toast.error('Quantité demandée dépasse le stock disponible');
        return prevItems;
      }

      return prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Panier vidé');
  };

  const isInCart = (productId: number): boolean => {
    return cartItems.some((item) => item.product.id === productId);
  };

  const getItemQuantity = (productId: number): number => {
    const item = cartItems.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cart: calculateCart(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
