// Dispositions partagées entre le rendu 3D, le sol et les collisions.
import { BOUNDARY, facilities, gardens, grandstands, parkings, toilets } from '../../data/visite';
import { FACING, localDims } from './builder';

// Un terrain ou un bassin a son grand axe le long de X local ; s'il est plus
// profond que large sur le plan, on le tourne d'un quart de tour.
export function longAxis(size) {
  const turned = size[1] > size[0];
  return {
    L: Math.max(size[0], size[1]),
    W: Math.min(size[0], size[1]),
    rotY: turned ? Math.PI / 2 : 0,
  };
}

// Piscine : grand bassin + pataugeoire accolée, en coordonnées locales.
export function poolLayout(size) {
  const { L, W } = longAxis(size);
  const mainL = L * 0.64;
  const mainW = W * 0.52;
  const kidsL = L * 0.15;
  const kidsW = W * 0.34;
  const mainX = L * 0.07;
  const kidsX = mainX - mainL / 2 - 0.35 - kidsL / 2;
  return {
    L,
    W,
    depth: 1.5,
    main: { x: mainX, z: 0, l: mainL, w: mainW },
    kids: { x: kidsX, z: 0, l: kidsL, w: kidsW },
  };
}

// Salle de billard (repère local, façade = +Z).
export const BILLIARD = {
  height: 3.2,
  wall: 0.18,
  door: 2.6,
  tables: [
    { x: -2.55, z: -0.45 },
    { x: 2.55, z: -0.45 },
  ],
  table: { l: 2.7, w: 1.5 },
};

// Restaurant / gargotte : part de la profondeur occupée par le bâti (le reste
// est une terrasse ouverte côté façade).
export const RESTO_BODY = { resto: 0.5, gargotte: 0.46 };

// ---------------------------------------------------------------------------
// Collisions de la visite libre : liste de rectangles { minX, maxX, minZ, maxZ }
// ---------------------------------------------------------------------------
function worldBox(position, angle, lx1, lz1, lx2, lz2) {
  const pts = [
    [lx1, lz1],
    [lx2, lz2],
  ].map(([lx, lz]) => [
    position[0] + lx * Math.cos(angle) + lz * Math.sin(angle),
    position[2] - lx * Math.sin(angle) + lz * Math.cos(angle),
  ]);
  return {
    minX: Math.min(pts[0][0], pts[1][0]),
    maxX: Math.max(pts[0][0], pts[1][0]),
    minZ: Math.min(pts[0][1], pts[1][1]),
    maxZ: Math.max(pts[0][1], pts[1][1]),
  };
}

const fullBox = ({ position, size }) => ({
  minX: position[0] - size[0] / 2,
  maxX: position[0] + size[0] / 2,
  minZ: position[2] - size[1] / 2,
  maxZ: position[2] + size[1] / 2,
});

// Bassins de la piscine en coordonnées monde (trous dans le sol + collisions).
export function poolBasinsWorld(f) {
  const lay = poolLayout(f.size);
  const { rotY } = longAxis(f.size);
  return [lay.main, lay.kids].map((bs) =>
    worldBox(f.position, rotY, bs.x - bs.l / 2, bs.z - bs.w / 2, bs.x + bs.l / 2, bs.z + bs.w / 2),
  );
}

function buildColliders() {
  const list = [];
  facilities.forEach((f) => {
    const angle = FACING[f.facing] ?? 0;
    const [W, D] = localDims(f.size, f.facing);
    if (f.type === 'building') {
      list.push(fullBox(f));
    } else if (f.type === 'restaurant') {
      const bodyD = D * RESTO_BODY[f.variant];
      list.push(worldBox(f.position, angle, -W / 2, -D / 2, W / 2, -D / 2 + bodyD));
    } else if (f.type === 'piscine') {
      list.push(...poolBasinsWorld(f));
    } else if (f.type === 'billard') {
      const t = BILLIARD.wall + 0.1;
      const half = BILLIARD.door / 2;
      list.push(
        worldBox(f.position, angle, -W / 2, -D / 2, W / 2, -D / 2 + t),
        worldBox(f.position, angle, -W / 2, -D / 2, -W / 2 + t, D / 2),
        worldBox(f.position, angle, W / 2 - t, -D / 2, W / 2, D / 2),
        worldBox(f.position, angle, -W / 2, D / 2 - t, -half, D / 2),
        worldBox(f.position, angle, half, D / 2 - t, W / 2, D / 2),
      );
      BILLIARD.tables.forEach(({ x, z }) => {
        const { l, w } = BILLIARD.table;
        list.push(worldBox(f.position, angle, x - l / 2, z - w / 2, x + l / 2, z + w / 2));
      });
    }
  });
  grandstands.forEach((g) => list.push(fullBox(g)));
  toilets.forEach((t) => list.push(fullBox(t)));
  return list;
}

export const colliders = buildColliders();

function insideBoundary(x, z) {
  let inside = false;
  for (let i = 0, j = BOUNDARY.length - 1; i < BOUNDARY.length; j = i++) {
    const [xi, zi] = BOUNDARY[i];
    const [xj, zj] = BOUNDARY[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

function distanceToWall(x, z) {
  let best = Infinity;
  for (let i = 0, j = BOUNDARY.length - 1; i < BOUNDARY.length; j = i++) {
    const [ax, az] = BOUNDARY[j];
    const [bx, bz] = BOUNDARY[i];
    const dx = bx - ax;
    const dz = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    best = Math.min(best, Math.hypot(x - ax - t * dx, z - az - t * dz));
  }
  return best;
}

// Le visiteur (cercle de rayon `r`) peut-il se tenir en (x, z) ?
export function isWalkable(x, z, r = 0.45) {
  if (!insideBoundary(x, z) || distanceToWall(x, z) < r + 0.3) return false;
  for (const c of colliders) {
    if (x > c.minX - r && x < c.maxX + r && z > c.minZ - r && z < c.maxZ + r) return false;
  }
  return true;
}

// Emplacements libres (allées) sur une grille de pas `step` : ni sur une
// infrastructure, ni sur un parking, ni sur un jardin. Sert à poser le mobilier.
const occupied = [...facilities, ...grandstands, ...parkings, ...toilets, ...gardens].map(fullBox);

export function freeSpots(step, margin = 3) {
  const xs = BOUNDARY.map((p) => p[0]);
  const zs = BOUNDARY.map((p) => p[1]);
  const spots = [];
  for (let x = Math.min(...xs) + step / 2; x < Math.max(...xs); x += step) {
    for (let z = Math.min(...zs) + step / 2; z < Math.max(...zs); z += step) {
      if (!insideBoundary(x, z) || distanceToWall(x, z) < margin) continue;
      const blocked = occupied.some(
        (c) => x > c.minX - margin && x < c.maxX + margin && z > c.minZ - margin && z < c.maxZ + margin,
      );
      if (!blocked) spots.push([x, z]);
    }
  }
  return spots;
}
