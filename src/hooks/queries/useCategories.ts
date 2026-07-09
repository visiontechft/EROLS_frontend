import { useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi, productsApi } from '../../lib/api';
import { queryKeys } from '../../lib/queryClient';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.getCategories,
    staleTime: 1000 * 60 * 10, // categories barely change — keep fresh longer
  });
}

/** Prefetch a category's product list on hover so the click feels instant. */
export function usePrefetchCategoryProducts() {
  const queryClient = useQueryClient();
  return (categorySlug: string) => {
    const filters = { category: categorySlug };
    queryClient.prefetchQuery({
      queryKey: queryKeys.products(filters),
      queryFn: () => productsApi.getProducts(filters),
    });
  };
}
