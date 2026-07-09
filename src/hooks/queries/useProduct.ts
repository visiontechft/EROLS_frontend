import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../../lib/api';
import { queryKeys } from '../../lib/queryClient';

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.product(slug ?? ''),
    queryFn: () => productsApi.getProduct(slug!),
    enabled: !!slug,
  });
}

export function useRelatedProducts(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.relatedProducts(slug ?? ''),
    queryFn: () => productsApi.getRelatedProducts(slug!),
    enabled: !!slug,
  });
}

/** Prefetch a product's detail on hover/visibility so the click feels instant. */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();
  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.product(slug),
      queryFn: () => productsApi.getProduct(slug),
    });
  };
}
