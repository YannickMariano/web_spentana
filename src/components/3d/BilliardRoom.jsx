import { useMemo } from 'react';
import Parts, { Sign } from './Parts';
import { createBuilder } from './builder';
import { BILLIARD } from './layout';

const BALLS = ['#f5f5f0', '#e8c21a', '#1f4fb4', '#c8262c', '#5a2a82', '#e46a1c', '#1f7a43', '#7a1f24', '#111111'];

// Table de billard complète : piètement, caisse, bandes, tapis, poches, billes, queue.
function addTable(b, x, z) {
  const { l, w } = BILLIARD.table;
  const top = 0.82;
  [-1, 1].forEach((sx) => {
    [-1, 1].forEach((sz) => {
      b.add('wood', '#5a3620', { p: [x + sx * (l / 2 - 0.22), 0.32, z + sz * (w / 2 - 0.2)], s: [0.2, 0.64, 0.2] }, { rough: 0.45 });
    });
  });
  b.add('wood', '#5a3620', { p: [x, 0.73, z], s: [l, 0.22, w] }, { rough: 0.45 });
  b.add('felt', '#1f7d4f', { p: [x, top + 0.02, z], s: [l - 0.3, 0.04, w - 0.3] }, { rough: 1 });
  b.add('wood', '#5a3620', { p: [x, top + 0.05, z - w / 2 + 0.08], s: [l, 0.1, 0.16] }, { rough: 0.45 });
  b.add('wood', '#5a3620', { p: [x, top + 0.05, z + w / 2 - 0.08], s: [l, 0.1, 0.16] }, { rough: 0.45 });
  b.add('wood', '#5a3620', { p: [x - l / 2 + 0.08, top + 0.05, z], s: [0.16, 0.1, w] }, { rough: 0.45 });
  b.add('wood', '#5a3620', { p: [x + l / 2 - 0.08, top + 0.05, z], s: [0.16, 0.1, w] }, { rough: 0.45 });
  [-1, 0, 1].forEach((px) => {
    [-1, 1].forEach((pz) => {
      b.add('pocket', '#0d0f11', {
        p: [x + px * (l / 2 - 0.17), top + 0.045, z + pz * (w / 2 - 0.17)],
        s: [0.15, 0.02, 0.15],
      }, { shape: 'cyl' });
    });
  });
  // Billes : la blanche d'un côté, un triangle de l'autre.
  b.add('balls', '#ffffff', { p: [x - l * 0.25, top + 0.075, z + 0.06], s: [0.07, 0.07, 0.07], c: BALLS[0] }, { shape: 'sphere', rough: 0.15 });
  let n = 1;
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i <= row; i++) {
      b.add('balls', '#ffffff', {
        p: [x + l * 0.2 + row * 0.064, top + 0.075, z + (i - row / 2) * 0.074],
        s: [0.07, 0.07, 0.07],
        c: BALLS[n++],
      }, { shape: 'sphere', rough: 0.15 });
    }
  }
  b.add('cue', '#d8b47a', { p: [x - l * 0.08, top + 0.12, z - w * 0.2], s: [1.45, 0.025, 0.025], ry: 0.35 });
  // Suspension lumineuse au-dessus de la table.
  b.add('cord', '#1b1d20', { p: [x - 0.5, 2.65, z], s: [0.02, 1, 0.02] });
  b.add('cord', '#1b1d20', { p: [x + 0.5, 2.65, z], s: [0.02, 1, 0.02] });
  b.add('shade', '#1d4f3a', { p: [x, 2.12, z], s: [1.7, 0.18, 0.55] });
  b.add('lamp', '#ffffff', { p: [x, 2.02, z], s: [1.5, 0.04, 0.4] }, { emissive: '#ffe2ad', emissiveIntensity: 2.2, castShadow: false });
}

// Salle de billard : on peut y entrer par la porte ouverte en façade (+Z).
// `W` = longueur de façade, `D` = profondeur.
export default function BilliardRoom({ W, D }) {
  const { height: H, wall: t, door } = BILLIARD;

  const model = useMemo(() => {
    const b = createBuilder();
    const wallC = '#ece7dc';
    b.add('floor', '#7b5a3c', { p: [0, 0.05, 0], s: [W, 0.1, D] }, { rough: 0.55 });
    b.add('wall', wallC, { p: [0, H / 2, -D / 2 + t / 2], s: [W, H, t] });
    b.add('wall', wallC, { p: [-W / 2 + t / 2, H / 2, 0], s: [t, H, D] });
    b.add('wall', wallC, { p: [W / 2 - t / 2, H / 2, 0], s: [t, H, D] });
    // Lambris bas peint aux couleurs du complexe, à l'intérieur.
    b.add('dado', '#1d5f96', { p: [0, 0.55, -D / 2 + t + 0.02], s: [W - 2 * t, 1, 0.03] });

    // Façade : piliers d'angle, allège, vitrage, linteau, porte ouverte au centre.
    const glassW = W / 2 - door / 2 - 0.5;
    [-1, 1].forEach((side) => {
      b.add('wall', wallC, { p: [side * (W / 2 - 0.25), H / 2, D / 2 - t / 2], s: [0.5, H, t] });
      const gx = side * (door / 2 + glassW / 2);
      b.add('wall', wallC, { p: [gx, 0.35, D / 2 - t / 2], s: [glassW, 0.7, t] });
      b.add('pane', '#bfe0ee', { p: [gx, 1.65, D / 2 - t / 2], s: [glassW, 1.9, 0.04] }, { opacity: 0.22, rough: 0.05, metal: 0.4, castShadow: false });
      b.add('frame', '#2b2f33', { p: [side * (door / 2 + 0.04), 1.3, D / 2 - t / 2], s: [0.08, 2.6, t] });
      b.add('frame', '#2b2f33', { p: [gx, 0.72, D / 2 - t / 2], s: [glassW, 0.05, t] });
    });
    b.add('wall', wallC, { p: [0, (H + 2.6) / 2, D / 2 - t / 2], s: [W, H - 2.6, t] });

    // Plafond (face intérieure claire) puis toiture.
    b.add('ceiling', '#f4f1ea', { p: [0, H - 0.04, 0], s: [W - 2 * t, 0.08, D - 2 * t] });
    b.add('fascia', '#1d5f96', { p: [0, H + 0.18, 0], s: [W + 0.7, 0.36, D + 0.7] });
    b.roof([0, H + 0.42, 0], [W + 0.9, 0.1, D + 0.9], '#4a97d8');

    BILLIARD.tables.forEach(({ x, z }) => addTable(b, x, z));

    // Mobilier : banquette, porte-queues mural, mange-debout et tabourets.
    b.add('bench', '#2b2f33', { p: [0, 0.42, -D / 2 + t + 0.28], s: [1.5, 0.1, 0.45] });
    b.add('bench', '#2b2f33', { p: [0, 0.2, -D / 2 + t + 0.28], s: [1.4, 0.4, 0.35] });
    b.add('wood', '#5a3620', { p: [-W / 2 + t + 0.03, 1.5, -0.5], s: [0.05, 1.2, 0.9] }, { rough: 0.45 });
    for (let i = 0; i < 5; i++) {
      b.add('cue', '#d8b47a', { p: [-W / 2 + t + 0.08, 1.45, -0.86 + i * 0.18], s: [0.025, 1.45, 0.025] });
    }
    const hx = W / 2 - t - 0.6;
    b.add('tabletop', '#efe8da', { p: [hx, 1.05, D / 2 - t - 0.75], s: [0.7, 0.05, 0.7] }, { shape: 'cyl' });
    b.add('leg', '#3a3f45', { p: [hx, 0.52, D / 2 - t - 0.75], s: [0.08, 1.04, 0.08] }, { shape: 'cyl' });
    [-0.55, 0.0].forEach((o, i) => {
      b.add('stool', '#c8353b', { p: [hx - 0.5 + i * 0.1, 0.72, D / 2 - t - 0.75 + o - 0.1], s: [0.36, 0.07, 0.36] }, { shape: 'cyl' });
      b.add('leg', '#3a3f45', { p: [hx - 0.5 + i * 0.1, 0.35, D / 2 - t - 0.75 + o - 0.1], s: [0.06, 0.7, 0.06] }, { shape: 'cyl' });
    });
    return b.result();
  }, [W, D, H, t, door]);

  return (
    <group>
      <Parts model={model} />
      <Sign
        text="BILLARD"
        position={[0, H - 0.3, D / 2 + 0.02]}
        size={[3.2, 0.5]}
        bg="#1d5f96"
        color="#ffffff"
      />
      {/* Éclairage chaud au-dessus des deux tables. */}
      {BILLIARD.tables.map(({ x, z }) => (
        <pointLight key={x} position={[x, 1.95, z]} color="#ffdcaa" intensity={9} distance={7} decay={2} />
      ))}
    </group>
  );
}
