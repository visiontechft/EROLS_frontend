import { QueryClient } from '@tanstack/react-query';

/**
 * staleTime: data is considered fresh for 2 minutes — navigating back to a
 * page you already visited renders instantly from cache with no spinner.
 * gcTime: unused data stays in memory for 10 minutes before eviction, so a
 * quick "product -> home -> product" round trip still hits cache.
 * refetchOnWindowFocus is off on purpose: an e-commerce catalog doesn't need
 * to re-fetch every time the tab regains focus, and the perceived-speed goal
 * favors "instant" over "always perfectly fresh".
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const queryKeys = {
  homepage: ['homepage'] as const,
  categories: ['categories'] as const,
  products: (filters?: object) => ['products', filters ?? {}] as const,
  product: (slug: string) => ['product', slug] as const,
  relatedProducts: (slug: string) => ['product', slug, 'related'] as const,
  brands: ['brands'] as const,
};
