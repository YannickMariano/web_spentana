import { useEffect, useRef, useState } from 'react';
import styles from './ImageHeroSlideshow.module.css';

const INTERVAL_MS = 6500;

// Slideshow "façon vidéo" pour le hero : fondu enchaîné entre quelques photos
// soigneusement choisies + effet Ken Burns (léger zoom) sur l'image active.
// Conçu pour être remplacé par <VideoHero /> sans toucher au reste de la page
// (voir HeroMedia.jsx et README.md).
export default function ImageHeroSlideshow({ slides }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tick = () => setActive((i) => (i + 1) % slides.length);

    const start = () => {
      timerRef.current = window.setInterval(tick, reduceMotion ? INTERVAL_MS * 1.4 : INTERVAL_MS);
    };
    const stop = () => window.clearInterval(timerRef.current);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [slides.length]);

  return (
    <div className={styles.stage} aria-hidden="true">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
        >
          {/* key force le remount de l'image à chaque activation, ce qui
              relance l'animation Ken Burns depuis le début. */}
          {i === active && <img key={`${slide.id}-${active}`} src={slide.image} alt="" />}
          {i !== active && <img src={slide.image} alt="" loading="lazy" />}
        </div>
      ))}
      <div className={styles.overlay} />
      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              aria-label={`Aller à l'image ${i + 1}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
