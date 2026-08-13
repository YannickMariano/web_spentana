import { useEffect, useState } from 'react';

// Anime une liste de valeurs de 0 vers leur cible avec un easing "ease-out
// cubic", une seule fois, quand `active` devient vrai (piloté par useInView).
export function useCountUp(targets, active, duration = 1500) {
  const [values, setValues] = useState(() => targets.map(() => 0));

  useEffect(() => {
    if (!active) return undefined;

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setValues(targets.map((v) => Math.round(v * eased)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, duration]);

  return values;
}
