import { useMemo } from 'react';
import Parts, { Sign } from './Parts';
import { addWindow, createBuilder, GLASS } from './builder';
import { RESTO_BODY } from './layout';

// Table ronde entourée de `seats` chaises tournées vers elle.
function addTable(b, x, z, seats, chairColor) {
  b.add('tabletop', '#efe8da', { p: [x, 0.78, z], s: [1.15, 0.06, 1.15] }, { shape: 'cyl', rough: 0.5 });
  b.add('leg', '#3a3f45', { p: [x, 0.39, z], s: [0.12, 0.76, 0.12] }, { shape: 'cyl', rough: 0.4, metal: 0.5 });
  for (let i = 0; i < seats; i++) {
    const a = (i / seats) * Math.PI * 2 + 0.4;
    const cx = Math.cos(a);
    const cz = Math.sin(a);
    b.add('chair', chairColor, { p: [x + cx * 0.95, 0.46, z + cz * 0.95], s: [0.44, 0.06, 0.44], ry: Math.PI / 2 - a });
    b.add('chair', chairColor, { p: [x + cx * 1.17, 0.72, z + cz * 1.17], s: [0.44, 0.5, 0.05], ry: Math.PI / 2 - a });
    b.add('leg', '#3a3f45', { p: [x + cx * 0.95, 0.23, z + cz * 0.95], s: [0.3, 0.44, 0.3] }, { shape: 'cyl' });
  }
}

const STYLES = {
  resto: {
    height: 4.2,
    wall: '#efe9dc',
    roof: '#4a97d8',
    fascia: '#1d5f96',
    chair: '#c8353b',
    sign: 'RESTAURANT',
  },
  gargotte: {
    height: 3.1,
    wall: '#e6cf6e',
    roof: '#4a97d8',
    fascia: '#2f6fa8',
    chair: '#2f6fa8',
    sign: 'GARGOTTE',
  },
};

// Restaurant ou gargotte : salle au fond, terrasse couverte en façade (+Z)
// avec piliers béton, comptoir, tables, chaises et luminaires.
export default function Restaurant({ W, D, variant = 'resto' }) {
  const style = STYLES[variant];
  const H = style.height;
  const bodyD = D * RESTO_BODY[variant];
  const front = -D / 2 + bodyD;

  const model = useMemo(() => {
    const b = createBuilder();
    b.add('wall', style.wall, { p: [0, H / 2, -D / 2 + bodyD / 2], s: [W, H, bodyD] });
    b.add('terrace', '#bdb2a4', { p: [0, 0.06, front + (D - bodyD) / 2], s: [W, 0.12, D - bodyD] });

    // Façade : grande baie vitrée et comptoir de service.
    b.add('glass', '#3a566e', { p: [-W * 0.22, 1.6, front + 0.04], s: [W * 0.4, 2.3, 0.08] }, GLASS);
    b.add('door', '#2b2f33', { p: [W * 0.08, 1.15, front + 0.05], s: [1.3, 2.3, 0.08] });
    b.add('counter', '#7a5236', { p: [W * 0.3, 0.55, front + 0.5], s: [W * 0.3, 1.1, 0.7] });
    b.add('countertop', '#efe8da', { p: [W * 0.3, 1.13, front + 0.5], s: [W * 0.32, 0.07, 0.85] });
    b.add('glass', '#3a566e', { p: [W * 0.3, 2.1, front + 0.04], s: [W * 0.28, 1.2, 0.08] }, GLASS);
    [-1, 1].forEach((side) => {
      addWindow(b, { x: (side * W) / 2, y: 1.9, z: -D / 2 + bodyD / 2, w: bodyD * 0.4, h: 1.2, axis: 'x', out: side });
    });

    // Piliers de la terrasse couverte.
    const cols = Math.max(2, Math.round(W / 6));
    for (let i = 0; i <= cols; i++) {
      const x = -W / 2 + 0.2 + ((W - 0.4) * i) / cols;
      b.add('pillar', '#b7b7b3', { p: [x, H / 2, D / 2 - 0.2], s: [0.34, H, 0.34] });
      // Suspensions lumineuses sous la toiture.
      if (i < cols) {
        const lx = x + (W - 0.4) / cols / 2;
        b.add('cord', '#2b2f33', { p: [lx, H - 0.35, front + (D - bodyD) / 2], s: [0.03, 0.7, 0.03] });
        b.add(
          'lamp',
          '#ffffff',
          { p: [lx, H - 0.8, front + (D - bodyD) / 2], s: [0.34, 0.34, 0.34] },
          { shape: 'sphere', emissive: '#ffd9a0', emissiveIntensity: 1.4, castShadow: false },
        );
      }
    }

    // Tables de la terrasse.
    const tz = front + (D - bodyD) / 2 + 0.3;
    if (variant === 'resto') {
      const n = Math.max(3, Math.floor((W * 0.55) / 3.6));
      for (let i = 0; i < n; i++) {
        const x = -W / 2 + 2.4 + i * 3.6;
        addTable(b, x, tz - 1.6, 4, style.chair);
        addTable(b, x + 1.4, tz + 1.8, 4, style.chair);
      }
    } else {
      addTable(b, -W * 0.26, tz, 3, style.chair);
      addTable(b, W * 0.22, tz + 0.6, 3, style.chair);
      // Auvent incliné au-dessus du comptoir.
      b.add('awning', '#2c85c8', { p: [W * 0.3, 2.6, front + 0.9], s: [W * 0.36, 0.06, 1.9], rx: 0.22 });
    }

    // Jardinières aux angles de la terrasse.
    [-1, 1].forEach((side) => {
      b.add('planter', '#c7c8ca', { p: [side * (W / 2 - 1), 0.4, D / 2 + 0.7], s: [1.6, 0.6, 0.7] });
      b.add('shrub', '#3f7d3b', { p: [side * (W / 2 - 1), 1, D / 2 + 0.7], s: [1.5, 1, 0.9] }, { shape: 'blob' });
    });

    b.add('fascia', style.fascia, { p: [0, H + 0.3, 0], s: [W + 1, 0.6, D + 1] });
    b.roof([0, H + 0.66, 0], [W + 1.3, 0.12, D + 1.3], style.roof);
    return b.result();
  }, [W, D, H, bodyD, front, style, variant]);

  return (
    <group>
      <Parts model={model} />
      <Sign
        text={style.sign}
        position={[0, H + 0.3, D / 2 + 0.52]}
        size={[Math.min(W * 0.6, 9), 0.56]}
        bg={style.fascia}
        color="#ffffff"
      />
    </group>
  );
}
