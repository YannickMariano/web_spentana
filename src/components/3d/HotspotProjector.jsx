import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { visitState } from './visitState';
import { facilities } from '../../data/visite';

// Distances (m) qui règlent le niveau de détail d'un hotspot selon le mode.
const RANGES = {
  walk: { card: 42, pill: 170 },
  aerial: { card: 95, pill: Infinity },
};

const _v = new Vector3();

// À chaque image, projette le point 3D de chaque infrastructure vers l'écran
// et y place son hotspot (sans re-rendu React). Règle aussi son niveau de
// détail : fiche complète de près, simple pastille de loin, masqué hors champ.
export default function HotspotProjector() {
  useFrame(({ camera, size }) => {
    const range = visitState.mode === 'walk' ? RANGES.walk : RANGES.aerial;
    facilities.forEach((f) => {
      const el = visitState.hotspots[f.id];
      if (!el) return;
      _v.set(f.position[0], f.hotspotHeight, f.position[2]);
      const dist = _v.distanceTo(camera.position);
      _v.project(camera);
      const inFront = _v.z < 1 && Math.abs(_v.x) < 1.3 && Math.abs(_v.y) < 1.3;

      let lod = 'hidden';
      if (inFront && dist < range.pill) lod = dist < range.card && !visitState.compact ? 'card' : 'pill';
      if (el.dataset.lod !== lod) el.dataset.lod = lod;
      if (lod === 'hidden') return;

      const x = (_v.x * 0.5 + 0.5) * size.width;
      const y = (-_v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      // Les plus proches passent devant.
      el.style.zIndex = String(Math.max(1, 2000 - Math.round(dist)));
    });
  });
  return null;
}
