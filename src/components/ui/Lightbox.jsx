import styles from './Lightbox.module.css';

// Visionneuse plein écran pour la galerie. `total`/`index` alimentent le
// compteur "3 / 26". Fermeture au clic en dehors de l'image ou touche Échap
// (gérée par le hook useLightbox).
export default function Lightbox({ item, index, total, onClose, onNext, onPrev }) {
  if (!item) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt || item.cat}
    >
      <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
        ×
      </button>
      <figure className={styles.figure} onClick={stop}>
        <img className={styles.image} src={item.image} alt={item.alt || ''} />
      </figure>
      <div className={styles.controls} onClick={stop}>
        <button type="button" className={styles.navBtn} onClick={onPrev} aria-label="Image précédente">
          ←
        </button>
        <span className={styles.meta}>
          {item.cat ? `${item.cat} · ` : ''}
          {index + 1} / {total}
        </span>
        <button type="button" className={styles.navBtn} onClick={onNext} aria-label="Image suivante">
          →
        </button>
      </div>
      <span className={styles.hint}>Cliquez en dehors de l'image pour fermer · ← → pour naviguer</span>
    </div>
  );
}
