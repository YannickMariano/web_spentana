import styles from './GalleryTile.module.css';

// Tuile de la grille masonry. `style` reçoit le grid-row-end calculé par le
// parent (GalleryMasonry) à partir de `item.span`.
export default function GalleryTile({ item, onOpen, style, showBadge = true }) {
  return (
    <button type="button" className={styles.tile} style={style} onClick={onOpen}>
      {showBadge && <span className={styles.catBadge}>{item.cat}</span>}
      <img src={item.image} alt={item.alt || ''} loading="lazy" decoding="async" />
    </button>
  );
}
