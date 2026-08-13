import { useCallback, useEffect, useState } from 'react';

// Gère l'état d'une lightbox (index ouvert, navigation clavier ← → et Échap)
// sur une liste d'images donnée.
export function useLightbox(items) {
  const [index, setIndex] = useState(null);
  const isOpen = index !== null;

  const open = useCallback((i) => setIndex(i), []);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta) => {
      setIndex((current) => {
        if (current === null || items.length === 0) return current;
        return (current + delta + items.length) % items.length;
      });
    },
    [items.length]
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close, step]);

  return {
    isOpen,
    item: isOpen ? items[index] : null,
    index,
    open,
    close,
    next: () => step(1),
    prev: () => step(-1),
  };
}
