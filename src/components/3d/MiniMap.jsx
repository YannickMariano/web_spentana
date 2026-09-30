import { useEffect, useRef } from 'react';
import { visitState } from './visitState';
import styles from './visite.module.css';
import {
  BOUNDARY_PLAN,
  GATE,
  PLAN_ORIGIN,
  PLAN_SCALE,
  facilities,
  gardens,
  grandstands,
  parkings,
} from '../../data/visite';

// La mini-carte est dessinée directement en pixels du plan fourni.
const VIEW = { x: 100, y: 70, w: 1820, h: 1410 };

const COLORS = {
  football: '#38b455',
  basket: '#e88a3c',
  piscine: '#36b4ea',
  building: '#7fa9d6',
  restaurant: '#e0606a',
  billard: '#a78bfa',
  petanque: '#d9b56a',
};

function Rect({ plan, ...rest }) {
  const [x1, y1, x2, y2] = plan;
  return <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} {...rest} />;
}

// Plan 2D du complexe : infrastructures cliquables, entrée, et position du
// visiteur mise à jour à chaque image (sans re-rendu React).
export default function MiniMap({ mode, selectedId, onSelect }) {
  const marker = useRef();

  useEffect(() => {
    let raf;
    const tick = () => {
      const { x, z, yaw } = visitState.camera;
      const px = Math.max(VIEW.x + 30, Math.min(VIEW.x + VIEW.w - 30, x / PLAN_SCALE + PLAN_ORIGIN[0]));
      const py = Math.max(VIEW.y + 30, Math.min(VIEW.y + VIEW.h - 30, z / PLAN_SCALE + PLAN_ORIGIN[1]));
      marker.current?.setAttribute('transform', `translate(${px} ${py}) rotate(${(yaw * 180) / Math.PI})`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const gateX = (GATE.plan[0] + GATE.plan[2]) / 2;

  return (
    <div className={`${styles.minimap} ${styles.glass}`}>
      <div className={styles.minimapHead}>
        <span>{mode === 'walk' ? 'Plan' : 'Plan du complexe'}</span>
        {mode === 'walk' && <span className={styles.minimapHere}>Vous êtes ici</span>}
      </div>
      <svg viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} role="img" aria-label="Plan du complexe">
        <polygon
          points={BOUNDARY_PLAN.map((p) => p.join(',')).join(' ')}
          fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        {gardens.map((g) => (
          <Rect key={g.id} plan={g.plan} fill="rgba(90,170,90,0.35)" />
        ))}
        {parkings.map((p) => (
          <Rect key={p.id} plan={p.plan} fill="rgba(255,255,255,0.12)" />
        ))}
        {grandstands.map((g) => (
          <Rect key={g.id} plan={g.plan} fill="rgba(255,255,255,0.3)" />
        ))}
        {facilities.map((f) => (
          <Rect
            key={f.id}
            plan={f.plan}
            rx="8"
            className={styles.mapZone}
            fill={COLORS[f.type]}
            stroke={f.id === selectedId ? '#ffffff' : 'rgba(255,255,255,0.35)'}
            strokeWidth={f.id === selectedId ? 14 : 4}
            onClick={() => onSelect(f.id)}
          >
            <title>{f.name}</title>
          </Rect>
        ))}
        {/* Entrée principale */}
        <g transform={`translate(${gateX} ${GATE.plan[1]})`}>
          <rect x="-46" y="-9" width="92" height="18" fill="#ffd166" rx="6" />
          <text y="-24" textAnchor="middle" fontSize="54" fontWeight="700" fill="#ffd166">
            Entrée
          </text>
        </g>
        {/* Visiteur / caméra : pastille + cône de vision */}
        <g ref={marker}>
          <path d="M0 0 L-62 -120 A135 135 0 0 1 62 -120 Z" fill="rgba(127,227,154,0.35)" />
          <circle r="26" fill="#7fe39a" stroke="#0e1a24" strokeWidth="8" />
        </g>
      </svg>
    </div>
  );
}
