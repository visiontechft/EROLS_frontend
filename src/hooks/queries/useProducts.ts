import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productsApi } from '../../lib/api';
import { queryKeys } from '../../lib/queryClient';
import type { ProductFilters } from '../../types';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => productsApi.getProducts(filters),
    // Keep showing the previous page's products while the next page loads,
    // instead of flashing a full-page spinner on every pagination click.
    placeholderData: keepPreviousData,
  });
}
