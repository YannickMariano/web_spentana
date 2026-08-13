import { useMemo, useState } from 'react';
import { FilterChip } from '../components/ui/Chip';
import GalleryMasonry from '../components/sections/GalleryMasonry';
import Lightbox from '../components/ui/Lightbox';
import { useLightbox } from '../hooks/useLightbox';
import { gallery, galleryCategories } from '../data/gallery';
import styles from './GalleryPage.module.css';

export default function GalleryPage() {
  const [filter, setFilter] = useState('Tout');

  const visible = useMemo(
    () => (filter === 'Tout' ? gallery : gallery.filter((g) => g.cat === filter)),
    [filter]
  );

  const lightbox = useLightbox(visible);

  return (
    <>
      <section className="section" style={{ paddingBottom: 'clamp(24px,3vw,36px)' }}>
        <div className={`container-wide ${styles.heroInner}`}>
          <span className="eyebrow" style={{ color: 'var(--color-marine)' }}>
            Galerie
          </span>
          <h1 className={styles.title}>Spentana en images.</h1>
          <div className={styles.filters}>
            {galleryCategories.map((cat) => (
              <FilterChip
                key={cat}
                label={cat}
                active={filter === cat}
                onClick={() => {
                  setFilter(cat);
                  lightbox.close();
                }}
                accent="var(--color-ink)"
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.gridSection}>
        <GalleryMasonry items={visible} onOpen={lightbox.open} />
      </section>

      {lightbox.isOpen && (
        <Lightbox
          item={lightbox.item}
          index={lightbox.index}
          total={visible.length}
          onClose={lightbox.close}
          onNext={lightbox.next}
          onPrev={lightbox.prev}
        />
      )}
    </>
  );
}
