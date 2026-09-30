import { useMemo } from 'react';
import Parts, { Sign } from './Parts';
import { bureauBuilding, FLOOR_H, longBuilding } from './buildingModels';

// Bâtiments principaux. `W` = longueur de façade, `D` = profondeur.
export default function Building({ variant, W, D }) {
  const model = useMemo(() => {
    if (variant === 'bureau') return bureauBuilding({ W, D });
    if (variant === 'taninketsa') {
      return longBuilding({
        W,
        D,
        band: { color: '#c8636f', h: 1.5 },
        roof: '#a6dcc8',
        fascia: '#1f6fae',
        doorColor: '#f1f1ee',
      });
    }
    return longBuilding({
      W,
      D,
      band: { color: '#3d84c4', h: 0.9 },
      roof: '#4a97d8',
      fascia: '#1d5f96',
      doorColor: '#2f6fa8',
    });
  }, [variant, W, D]);

  const H = (variant === 'bureau' ? 3 : 2) * FLOOR_H;

  return (
    <group>
      <Parts model={model} />
      {variant === 'taninketsa' && (
        <Sign
          text="TANINKETSA ACADEMY"
          position={[0, H + 1.55, D / 2 + 0.6]}
          size={[Math.min(W * 0.5, 24), 1.5]}
          bg="#1f6fae"
          color="#ffffff"
          border="#ffffff"
        />
      )}
      {variant === 'ecole' && (
        <Sign
          text="ÉTABLISSEMENT SCOLAIRE"
          position={[0, H + 0.3, D / 2 + 0.82]}
          size={[Math.min(W * 0.45, 20), 0.56]}
          bg="#1d5f96"
          color="#ffffff"
        />
      )}
      {variant === 'bureau' && (
        <>
          <Sign
            text="SPENTANA"
            position={[0, H + 0.45, D / 2 + 0.92]}
            size={[9, 0.8]}
            bg="#1a5f8f"
            color="#ffffff"
          />
          <Sign
            text="RÉSERVATION"
            position={[-W * 0.36, 2.95, D / 2 + 0.1]}
            size={[4.2, 0.5]}
            color="#c0262d"
          />
          <Sign
            text="BUREAU COACH & LOGISTIQUE"
            position={[W * 0.36, 2.95, D / 2 + 0.1]}
            size={[5.6, 0.5]}
            color="#c0262d"
          />
        </>
      )}
    </group>
  );
}
