import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Remonter en haut instantanément à chaque changement de route
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}