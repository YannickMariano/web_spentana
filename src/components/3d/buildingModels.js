// Géométrie des bâtiments : fonctions pures qui renvoient des lots de pièces.
import { addRailing, addWindow, createBuilder, GLASS } from './builder';

export const FLOOR_H = 3.3;

// Bâtiment long à coursive (école, Taninketsa) : murs blancs, portes et
// fenêtres en alternance, galerie à garde-corps blancs à l'étage, escalier
// extérieur, toiture en tôle débordante. Façade principale = +Z.
export function longBuilding({
  W,
  D,
  floors = 2,
  wall = '#f3f2ee',
  band,
  roof,
  fascia,
  doorColor,
  galleryDepth = 2.2,
  bay = 3.7,
}) {
  const b = createBuilder();
  const H = floors * FLOOR_H;
  const bodyD = D - galleryDepth;
  const zc = -galleryDepth / 2;
  const front = zc + bodyD / 2;
  const back = zc - bodyD / 2;
  const edge = D / 2;

  b.add('wall', wall, { p: [0, H / 2, zc], s: [W, H, bodyD] });
  if (band) {
    b.add('band', band.color, { p: [0, band.h / 2, zc], s: [W + 0.06, band.h, bodyD + 0.06] });
  }
  for (let f = 1; f < floors; f++) {
    b.add('frame', '#f4f4f2', { p: [0, f * FLOOR_H, zc], s: [W + 0.12, 0.24, bodyD + 0.12] });
  }

  const n = Math.max(2, Math.floor(W / bay));
  const step = W / n;
  for (let f = 0; f < floors; f++) {
    const y0 = f * FLOOR_H;
    for (let i = 0; i < n; i++) {
      const x = -W / 2 + step * (i + 0.5);
      if (i % 2 === 0) {
        b.add('frame', '#f4f4f2', { p: [x, y0 + 1.17, front + 0.02], s: [1.25, 2.34, 0.07] });
        b.add('door', doorColor, { p: [x, y0 + 1.12, front + 0.05], s: [1.0, 2.2, 0.07] });
      } else {
        addWindow(b, { x, y: y0 + 1.8, z: front, w: 1.8, h: 1.25 });
      }
      addWindow(b, { x, y: y0 + 1.8, z: back, w: 1.5, h: 1.1, out: -1 });
    }
    [-1, 1].forEach((side) => {
      addWindow(b, { x: (side * W) / 2, y: y0 + 1.8, z: zc, w: 1.5, h: 1.1, axis: 'x', out: side });
    });
  }

  // Coursives d'étage et poteaux porteurs.
  for (let f = 1; f < floors; f++) {
    const y = f * FLOOR_H;
    b.add('concrete', '#d2d1cc', { p: [0, y - 0.1, front + galleryDepth / 2], s: [W, 0.2, galleryDepth] });
    addRailing(b, 0, y, edge - 0.06, W);
  }
  for (let i = 0; i <= n; i += 2) {
    const x = Math.min(W / 2 - 0.14, -W / 2 + step * i + 0.14);
    b.add('frame', '#f4f4f2', { p: [x, H / 2, edge - 0.14], s: [0.26, H, 0.26] });
  }

  // Escalier extérieur en pignon droit, du sol à la coursive.
  if (floors > 1) {
    const steps = 16;
    const sh = FLOOR_H / steps;
    b.add('concrete', '#d2d1cc', {
      p: [W / 2 + 0.8, FLOOR_H - 0.1, front + galleryDepth / 2],
      s: [1.6, 0.2, galleryDepth],
    });
    for (let i = 0; i < steps; i++) {
      const top = FLOOR_H - (i + 1) * sh;
      if (top <= 0.01) break;
      b.add('concrete', '#d2d1cc', {
        p: [W / 2 + 0.8, top / 2, front - 0.15 - i * 0.3],
        s: [1.5, top, 0.3],
      });
    }
    b.add('rail', '#f4f4f2', {
      p: [W / 2 + 1.55, FLOOR_H / 2 + 0.55, front - 2.4],
      s: [0.06, 0.06, Math.hypot(4.8, FLOOR_H)],
      rx: Math.atan2(FLOOR_H, 4.8),
    });
  }

  b.add('fascia', fascia, { p: [0, H + 0.3, 0], s: [W + 1.6, 0.6, D + 1.6] });
  b.roof([0, H + 0.66, 0], [W + 1.9, 0.12, D + 1.9], roof);
  return b.result();
}

// Bâtiment des bureaux : trois niveaux gris, volume central rose percé de
// fentes vitrées, balcons à garde-corps blancs, bandeau de toiture bleu.
export function bureauBuilding({ W, D }) {
  const b = createBuilder();
  const floors = 3;
  const H = floors * FLOOR_H;
  const pinkW = W * 0.46;
  const wingW = (W - pinkW) / 2;
  const wingX = pinkW / 2 + wingW / 2;

  b.add('wall', '#a9acb1', { p: [0, H / 2, 0], s: [W, H, D] });

  [1, -1].forEach((out) => {
    const face = (out * D) / 2;
    // Volume rose en saillie, du premier étage à la toiture.
    b.add('pink', '#c9616e', {
      p: [0, FLOOR_H + (H - FLOOR_H) / 2, face + out * 0.3],
      s: [pinkW, H - FLOOR_H, 0.7],
    });
    const pinkFace = face + out * 0.65;
    // Fentes verticales du premier étage (hauteurs décalées, comme sur site).
    for (let i = 0; i < 6; i++) {
      const x = -pinkW / 2 + (pinkW * (i + 0.5)) / 6;
      const low = i === 1 || i === 4;
      b.add('glass', '#3a566e', {
        p: [x, FLOOR_H + (low ? 1.35 : 1.75), pinkFace + out * 0.02],
        s: [0.5, 2.1, 0.07],
      }, GLASS);
    }
    // Deux larges baies au dernier étage.
    [-1, 1].forEach((sx) => {
      addWindow(b, {
        x: sx * pinkW * 0.25,
        y: 2 * FLOOR_H + 1.85,
        z: pinkFace - out * 0.03,
        w: pinkW * 0.38,
        h: 1.25,
        out,
        frame: '#2b2f33',
      });
    });

    [-1, 1].forEach((sx) => {
      const cx = sx * wingX;
      for (let f = 1; f < floors; f++) {
        const y = f * FLOOR_H;
        b.add('concrete', '#c7c8ca', { p: [cx, y - 0.1, face + out * 0.75], s: [wingW, 0.2, 1.5] });
        addRailing(b, cx, y, face + out * 1.44, wingW);
        [-1, 1].forEach((end) => {
          b.add('rail', '#f4f4f2', {
            p: [cx + (end * wingW) / 2, y + 0.53, face + out * 0.75],
            s: [0.05, 1.06, 1.45],
          });
        });
        b.add('door', '#f1f1ee', { p: [cx + wingW * 0.18, y + 1.2, face + out * 0.04], s: [1.7, 2.35, 0.08] });
        addWindow(b, { x: cx - wingW * 0.24, y: y + 1.75, z: face, w: 1.3, h: 1.25, out, frame: '#2b2f33' });
      }
      // Rez-de-chaussée : vitrines.
      b.add('glass', '#3a566e', { p: [cx, 1.35, face + out * 0.04], s: [wingW * 0.62, 2.5, 0.08] }, GLASS);
    });
    b.add('glass', '#3a566e', { p: [-pinkW * 0.24, 1.35, face + out * 0.04], s: [pinkW * 0.36, 2.5, 0.08] }, GLASS);
    b.add('glass', '#3a566e', { p: [pinkW * 0.24, 1.35, face + out * 0.04], s: [pinkW * 0.36, 2.5, 0.08] }, GLASS);

    // Jardinières au pied de la façade.
    for (let i = 0; i < 5; i++) {
      const x = -W / 2 + (W * (i + 0.5)) / 5;
      b.add('concrete', '#c7c8ca', { p: [x, 0.3, face + out * 2.6], s: [2.6, 0.6, 0.8] });
      b.add('shrub', '#3f7d3b', { p: [x - 0.6, 0.95, face + out * 2.6], s: [1.2, 1.1, 1] }, { shape: 'blob' });
      b.add('shrub', '#3f7d3b', { p: [x + 0.55, 0.85, face + out * 2.6], s: [1.1, 0.9, 0.9] }, { shape: 'blob' });
    }
  });

  // Pignons : trois petites fenêtres par niveau.
  [-1, 1].forEach((side) => {
    for (let f = 0; f < floors; f++) {
      for (let i = 0; i < 3; i++) {
        addWindow(b, {
          x: (side * W) / 2,
          y: f * FLOOR_H + 1.8,
          z: -D / 2 + (D * (i + 0.5)) / 3,
          w: 1.3,
          h: 1.1,
          axis: 'x',
          out: side,
          frame: '#2b2f33',
        });
      }
    }
  });

  b.add('fascia', '#1a5f8f', { p: [0, H + 0.45, 0], s: [W + 1.8, 0.9, D + 1.8] });
  b.roof([0, H + 0.96, 0], [W + 2.1, 0.12, D + 2.1], '#4f9fdc');
  return b.result();
}

// Bloc sanitaire : petit volume blanc, portes bleues, toit en tôle.
export function toiletBlock({ W, D }) {
  const b = createBuilder();
  const H = 3;
  b.add('wall', '#f1f0ec', { p: [0, H / 2, 0], s: [W, H, D] });
  b.add('band', '#3d84c4', { p: [0, 0.35, 0], s: [W + 0.06, 0.7, D + 0.06] });
  const doors = Math.max(2, Math.round(W / 4));
  for (let i = 0; i < doors; i++) {
    const x = -W / 2 + (W * (i + 0.5)) / doors;
    b.add('door', '#2f6fa8', { p: [x, 1.05, D / 2 + 0.04], s: [0.95, 2.1, 0.08] });
    b.add('glass', '#3a566e', { p: [x, 2.55, D / 2 + 0.04], s: [0.9, 0.35, 0.06] }, GLASS);
  }
  b.add('fascia', '#1d5f96', { p: [0, H + 0.15, 0], s: [W + 0.8, 0.3, D + 0.8] });
  b.roof([0, H + 0.36, 0], [W + 1, 0.1, D + 1], '#4a97d8');
  return b.result();
}

const VARIANTS = {
  bureau: { height: 3 * FLOOR_H + 1 },
  ecole: { height: 2 * FLOOR_H + 0.7 },
  taninketsa: { height: 2 * FLOOR_H + 0.7 },
};

export const buildingHeight = (variant) => VARIANTS[variant]?.height ?? 7;
