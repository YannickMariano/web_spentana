import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Remonte en haut de page à chaque changement de route (comportement du
// prototype : `window.scrollTo({ top: 0 })` sur navigation).
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
