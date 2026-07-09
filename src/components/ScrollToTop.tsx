import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // behavior: 'instant' est requis explicitement car le CSS global "scroll-smooth"
    // transforme sinon ce scrollTo en animation lente (window.scrollTo(0,0) hérite
    // du scroll-behavior CSS quand behavior n'est pas précisé), ce qui laissait
    // la page arriver encore scrollée, masquant l'entête pendant la transition.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}