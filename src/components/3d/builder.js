// Outils communs aux composants 3D : orientation des façades et "constructeur"
// qui regroupe les pièces d'un bâtiment par matériau (un lot = un appel GPU).

// Rotation (autour de Y) qui amène la façade locale (+Z) vers le point cardinal.
// Sur le plan : nord = haut, sud = bas, ouest = gauche, est = droite.
export const FACING = {
  south: 0,
  east: Math.PI / 2,
  north: Math.PI,
  west: -Math.PI / 2,
};

// Emprise [largeur, profondeur] dans le repère local de la façade.
export function localDims(size, facing = 'south') {
  return facing === 'east' || facing === 'west' ? [size[1], size[0]] : [size[0], size[1]];
}

// Point local (façade = +Z) → coordonnées monde autour du centre `position`.
export function localToWorld(position, facing, lx, lz) {
  const a = FACING[facing] ?? 0;
  return [
    position[0] + lx * Math.cos(a) + lz * Math.sin(a),
    position[2] - lx * Math.sin(a) + lz * Math.cos(a),
  ];
}

export function createBuilder() {
  const groups = new Map();
  const roofs = [];
  return {
    // Ajoute une pièce au lot `key` (créé à la première utilisation).
    add(key, color, item, opts) {
      if (!groups.has(key)) groups.set(key, { id: key, color, items: [], ...opts });
      groups.get(key).items.push(item);
    },
    // Toiture en tôle : rendue à part pour recevoir sa texture ondulée.
    roof(p, s, color) {
      roofs.push({ p, s, color });
    },
    result() {
      return { groups: [...groups.values()], roofs };
    },
  };
}

// Matériaux récurrents.
export const GLASS = { rough: 0.08, metal: 0.75, litAtNight: true };
export const METAL = { rough: 0.45, metal: 0.4 };

// Garde-corps : lisse haute, trois lisses fines, poteaux. `axis` = 'x' ou 'z'
// selon la direction dans laquelle il court.
export function addRailing(b, cx, y, cz, length, color = '#f4f4f2', axis = 'x') {
  const along = (len, t) => (axis === 'x' ? [len, t, t] : [t, t, len]);
  b.add('rail', color, { p: [cx, y + 1.05, cz], s: along(length, 0.07) }, METAL);
  [0.28, 0.54, 0.8].forEach((h) => {
    b.add('rail', color, { p: [cx, y + h, cz], s: along(length, 0.035) }, METAL);
  });
  const n = Math.max(1, Math.round(length / 1.5));
  for (let i = 0; i <= n; i++) {
    const o = -length / 2 + (length * i) / n;
    b.add('rail', color, {
      p: axis === 'x' ? [cx + o, y + 0.53, cz] : [cx, y + 0.53, cz + o],
      s: [0.05, 1.06, 0.05],
    }, METAL);
  }
}

// Fenêtre vitrée avec encadrement, posée sur une façade.
// `axis` = 'z' (façade avant/arrière) ou 'x' (pignon) ; `out` = ±1 côté extérieur.
export function addWindow(b, { x, y, z, w, h, axis = 'z', out = 1, frame = '#f4f4f2' }) {
  const t = 0.07;
  if (axis === 'z') {
    b.add('frame', frame, { p: [x, y, z + out * 0.02], s: [w + 0.2, h + 0.2, t] });
    b.add('glass', '#3a566e', { p: [x, y, z + out * 0.05], s: [w, h, t] }, GLASS);
  } else {
    b.add('frame', frame, { p: [x + out * 0.02, y, z], s: [t, h + 0.2, w + 0.2] });
    b.add('glass', '#3a566e', { p: [x + out * 0.05, y, z], s: [t, h, w] }, GLASS);
  }
}
