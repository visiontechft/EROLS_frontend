import { useEffect, useState } from 'react';
import { citiesApi } from '../lib/api';
import type { City } from '../types';

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    citiesApi
      .getCities()
      .then((data) => {
        if (isMounted) setCities(data);
      })
      .catch(() => {
        if (isMounted) setError('Erreur lors du chargement des quartiers');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { cities, isLoading, error };
}
