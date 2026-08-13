import { useEffect, useRef, useState } from 'react';

// Détecte quand un élément entre dans le viewport, une seule fois (utilisé par
// <Reveal> pour les apparitions au scroll et par les compteurs animés).
export function useInView({ rootMargin = '0px 0px -8% 0px', once = true } = {}) {
  const ref = useRef(null);
  // Si IntersectionObserver n'existe pas (environnement très ancien), on
  // considère l'élément comme visible dès le départ pour ne jamais masquer le
  // contenu.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return [ref, inView];
}
