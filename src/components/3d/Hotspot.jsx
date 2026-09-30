import { useState } from 'react';
import Icon from '../ui/Icon';
import { visitState } from './visitState';
import styles from './visite.module.css';

// Point d'information flottant au-dessus d'une infrastructure : pastille
// (icône + nom) qui se déploie en fiche (catégorie, tarif, bouton VOIR) au
// survol, au toucher, ou quand la caméra est proche.
// Sa position à l'écran est pilotée par HotspotProjector, à chaque image.
export default function Hotspot({ facility, selected, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={styles.hotspotAnchor}
      ref={(el) => {
        if (el) visitState.hotspots[facility.id] = el;
        else delete visitState.hotspots[facility.id];
      }}
      data-lod="hidden"
    >
      <div
        className={styles.hotspot}
        data-open={open || undefined}
        data-selected={selected || undefined}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      >
        <button
          type="button"
          className={styles.hotspotPill}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className={styles.hotspotIcon}>
            <Icon name={facility.icon} size={15} />
          </span>
          <span className={styles.hotspotName}>{facility.short}</span>
        </button>
        <div className={styles.hotspotCard}>
          <span className={styles.hotspotCat}>{facility.category}</span>
          {facility.price && <span className={styles.hotspotPrice}>{facility.price}</span>}
          <button type="button" className={styles.hotspotBtn} onClick={() => onSelect(facility.id)}>
            Voir
          </button>
        </div>
        <span className={styles.hotspotStem} aria-hidden="true" />
      </div>
    </div>
  );
}
