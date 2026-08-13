import GalleryTile from '../cards/GalleryTile';
import styles from './GalleryMasonry.module.css';

// Grille "masonry" (hauteurs de tuiles variables) construite avec
// `grid-auto-rows` + `grid-row-end: span N`, N venant de `item.span`.
export default function GalleryMasonry({ items, onOpen }) {
  return (
    <div className={styles.grid}>
      {items.map((item, i) => (
        <GalleryTile
          key={item.id}
          item={item}
          onOpen={() => onOpen(i)}
          style={{ gridRowEnd: `span ${item.span || 16}` }}
        />
      ))}
    </div>
  );
}
