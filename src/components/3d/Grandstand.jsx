import { useMemo } from 'react';
import Parts, { Sign } from './Parts';
import { addRailing, addWindow, createBuilder } from './builder';

const STEP = { rise: 0.45, run: 0.85 };
// Hauteur du rez-de-chaussée, occupé par les vestiaires.
const BASE = 2.9;

// Tribune couverte sur deux niveaux, comme sur le site :
//  - en bas, les VESTIAIRES (murs jaunes, portes bleues, impostes vitrées) ;
//  - au-dessus, les gradins en béton et leurs sièges bleus et rouges,
//    accessibles par un escalier latéral ;
//  - une toiture en tôle bleue.
// Les spectateurs regardent vers +Z. `L` = longueur, `D` = profondeur.
export default function Grandstand({ L, D }) {
  const { model, frontZ } = useMemo(() => {
    const b = createBuilder();
    const yellow = '#e4d078';
    const tiers = Math.max(2, Math.min(5, Math.floor((D - 0.5) / STEP.run)));
    const H = BASE + tiers * STEP.rise + 2.6;
    const front = D / 2 - 0.15;
    const back = -D / 2;

    // --- Rez-de-chaussée : vestiaires ---
    b.add('wall', yellow, { p: [0, BASE / 2, (front + back) / 2], s: [L, BASE, front - back] });
    b.add('plinth', '#2f6fa8', { p: [0, 0.3, (front + back) / 2], s: [L + 0.06, 0.6, front - back + 0.06] });
    const doors = Math.max(2, Math.round(L / 7));
    for (let i = 0; i < doors; i++) {
      const x = -L / 2 + (L * (i + 0.5)) / doors;
      b.add('frame', '#f4f4f2', { p: [x, 1.1, front + 0.02], s: [1.2, 2.2, 0.06] });
      b.add('door', '#2f6fa8', { p: [x, 1.05, front + 0.05], s: [1, 2.1, 0.06] });
      if (L / doors > 4.5) {
        addWindow(b, { x: x + 1.7, y: 2.05, z: front, w: 1.2, h: 0.5 });
        addWindow(b, { x: x - 1.7, y: 2.05, z: front, w: 1.2, h: 0.5 });
      }
    }
    // Dalle de l'étage, en léger débord, et son garde-corps.
    b.add('concrete', '#d5d2c6', { p: [0, BASE + 0.06, (front + back) / 2 + 0.2], s: [L + 0.2, 0.12, front - back + 0.4] });
    addRailing(b, 0, BASE + 0.12, front + 0.34, L);

    // --- Étage : gradins et sièges ---
    for (let i = 0; i < tiers; i++) {
      const h = BASE + 0.12 + i * STEP.rise;
      const z = front - (i + 0.5) * STEP.run;
      if (i > 0) {
        b.add('concrete', '#d5d2c6', { p: [0, BASE + (h - BASE) / 2, z], s: [L, h - BASE, STEP.run] });
      }
      const seats = Math.floor((L - 0.6) / 0.56);
      for (let s = 0; s < seats; s++) {
        const x = -L / 2 + 0.3 + (s + 0.5) * ((L - 0.6) / seats);
        const c = Math.floor(s / 8) % 2 ? '#c93a3f' : '#2c6cc4';
        b.add('seat', '#ffffff', { p: [x, h + 0.09, z + 0.08], s: [0.42, 0.07, 0.4], c }, { rough: 0.5 });
        b.add('seat', '#ffffff', { p: [x, h + 0.29, z - 0.14], s: [0.42, 0.34, 0.06], c }, { rough: 0.5 });
      }
    }

    // Mur de fond et pignons de l'étage, poteaux de toiture.
    b.add('wall', yellow, { p: [0, (BASE + H) / 2, back + 0.1], s: [L, H - BASE, 0.2] });
    [-1, 1].forEach((side) => {
      b.add('wall', yellow, { p: [side * (L / 2 - 0.1), BASE + (H - BASE) * 0.3, 0], s: [0.2, (H - BASE) * 0.6, D] });
    });
    const posts = Math.max(2, Math.round(L / 6));
    for (let i = 0; i <= posts; i++) {
      b.add('post', '#2f6fa8', {
        p: [-L / 2 + 0.1 + ((L - 0.2) * i) / posts, (BASE + H) / 2, front + 0.3],
        s: [0.14, H - BASE, 0.14],
      });
    }

    // Escalier latéral (pignon +X), du sol au niveau des gradins.
    const steps = 14;
    const rise = BASE / steps;
    const run = Math.min(0.3, (D - 0.4) / steps);
    for (let i = 0; i < steps; i++) {
      const top = BASE - i * rise;
      b.add('concrete', '#d5d2c6', {
        p: [L / 2 + 0.65, top / 2, front - 0.2 - (i + 0.5) * run],
        s: [1.3, top, run],
      });
    }
    b.add('rail', '#f4f4f2', {
      p: [L / 2 + 1.28, BASE / 2 + 0.95, front - 0.2 - (steps * run) / 2],
      s: [0.06, 0.06, Math.hypot(steps * run, BASE)],
      rx: -Math.atan2(BASE, steps * run),
    });

    b.add('fascia', '#1d5f96', { p: [0, H + 0.1, 0.25], s: [L + 0.5, 0.2, D + 1] });
    b.roof([0, H + 0.26, 0.25], [L + 0.7, 0.1, D + 1.2], '#4a97d8');
    return { model: b.result(), frontZ: front };
  }, [L, D]);

  return (
    <group>
      <Parts model={model} />
      <Sign
        text="VESTIAIRES"
        position={[0, BASE - 0.38, frontZ + 0.03]}
        size={[Math.min(L * 0.35, 4.6), 0.46]}
        bg="#1d5f96"
        color="#ffffff"
      />
    </group>
  );
}
