import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'erols_wishlist';

function readStoredIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [ids, setIds] = useState<number[]>(() => readStoredIds());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const isWishlisted = useCallback((productId: number) => ids.includes(productId), [ids]);

  const toggleWishlist = useCallback((productId: number) => {
    setIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  return { wishlistIds: ids, isWishlisted, toggleWishlist };
}
