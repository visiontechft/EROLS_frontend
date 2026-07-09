import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../lib/api';
import { queryKeys } from '../../lib/queryClient';

export function useHomepageData() {
  return useQuery({
    queryKey: queryKeys.homepage,
    queryFn: productsApi.getHomepageData,
  });
}
