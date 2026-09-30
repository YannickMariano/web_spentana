import Hotspot from './Hotspot';
import styles from './visite.module.css';
import { facilities } from '../../data/visite';

// Calque des hotspots, posé au-dessus de la scène 3D : un par infrastructure.
export default function HotspotLayer({ selectedId, onSelect }) {
  return (
    <div className={styles.hotspotLayer}>
      {facilities.map((f) => (
        <Hotspot key={f.id} facility={f} selected={f.id === selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}
