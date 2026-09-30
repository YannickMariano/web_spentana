import { useMemo } from 'react';
import Parts, { Sign } from './Parts';
import Trees from './Trees';
import { createBuilder, METAL } from './builder';
import { freeSpots } from './layout';
import { lawnTexture, seeded, tiled } from './textures';
import { BOUNDARY, GATE, gardens } from '../../data/visite';

const WALL_H = 2.6;

// Tronçon de mur entre deux points (x, z), avec chaperon et piliers réguliers.
function addWall(b, [ax, az], [bx, bz]) {
  const len = Math.hypot(bx - ax, bz - az);
  if (len < 0.2) return;
  const ry = Math.atan2(-(bz - az), bx - ax);
  const mid = [(ax + bx) / 2, (az + bz) / 2];
  b.add('wall', '#e6e4dd', { p: [mid[0], WALL_H / 2, mid[1]], s: [len, WALL_H, 0.3], ry });
  b.add('cap', '#2f6fa8', { p: [mid[0], WALL_H + 0.06, mid[1]], s: [len, 0.12, 0.42], ry });
  const n = Math.max(1, Math.round(len / 7));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    b.add('wall', '#e6e4dd', {
      p: [ax + (bx - ax) * t, (WALL_H + 0.3) / 2, az + (bz - az) * t],
      s: [0.5, WALL_H + 0.3, 0.5],
      ry,
    });
  }
}

function Garden({ garden }) {
  const [w, d] = garden.size;
  const map = useMemo(() => tiled(lawnTexture(), w / 5, d / 5), [w, d]);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[garden.position[0], 0.07, garden.position[2]]}
      receiveShadow
    >
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial map={map} roughness={1} />
    </mesh>
  );
}

// Mur d'enceinte, portail d'entrée, jardins, arbres et éclairage des allées.
export default function Enclosure({ quality }) {
  const gateX = (GATE.from[0] + GATE.to[0]) / 2;
  const gateZ = GATE.from[1];
  const gateW = GATE.to[0] - GATE.from[0];

  const model = useMemo(() => {
    const b = createBuilder();

    BOUNDARY.forEach((a, i) => {
      const c = BOUNDARY[(i + 1) % BOUNDARY.length];
      const onGateEdge =
        Math.abs(a[1] - gateZ) < 0.01 &&
        Math.abs(c[1] - gateZ) < 0.01 &&
        Math.min(a[0], c[0]) < GATE.from[0] &&
        Math.max(a[0], c[0]) > GATE.to[0];
      if (!onGateEdge) {
        addWall(b, a, c);
        return;
      }
      const [left, right] = a[0] < c[0] ? [a, c] : [c, a];
      addWall(b, left, GATE.from);
      addWall(b, GATE.to, right);
    });

    // Portail : deux piliers, un fronton, et les vantaux ouverts vers l'intérieur.
    [GATE.from[0], GATE.to[0]].forEach((x) => {
      b.add('gatePillar', '#f1f0ec', { p: [x, 2.6, gateZ], s: [1.1, 5.2, 1.1] });
      b.add('cap', '#2f6fa8', { p: [x, 5.3, gateZ], s: [1.4, 0.2, 1.4] });
      b.add('cap', '#2f6fa8', { p: [x, 0.5, gateZ], s: [1.2, 1, 1.2] });
    });
    b.add('cap', '#2f6fa8', { p: [gateX, 5.9, gateZ], s: [gateW + 1.4, 1.5, 0.5] });
    [-1, 1].forEach((side) => {
      const hinge = gateX + (side * gateW) / 2 - side * 0.6;
      const leaf = gateW / 2 - 1;
      for (let i = 0; i <= 10; i++) {
        b.add('bars', '#1d5f96', { p: [hinge, 1.3, gateZ - 0.4 - (leaf * i) / 10], s: [0.06, 2.6, 0.06] }, METAL);
      }
      [0.15, 1.3, 2.5].forEach((y) => {
        b.add('bars', '#1d5f96', { p: [hinge, y, gateZ - 0.4 - leaf / 2], s: [0.08, 0.08, leaf] }, METAL);
      });
    });
    // Guérite du gardien, juste après le portail.
    const bx = GATE.to[0] + 3.2;
    b.add('gatePillar', '#f1f0ec', { p: [bx, 1.3, gateZ - 2.6], s: [2.6, 2.6, 2.6] });
    b.add('glass', '#3a566e', { p: [bx - 1.32, 1.6, gateZ - 2.6], s: [0.05, 0.9, 1.4] }, { rough: 0.08, metal: 0.75 });
    b.add('cap', '#2f6fa8', { p: [bx, 2.72, gateZ - 2.6], s: [3.2, 0.16, 3.2] });

    // Bordures et bancs des jardins.
    gardens.forEach(({ position: [x, , z], size: [w, d] }) => {
      b.add('kerb', '#d9d7cf', { p: [x, 0.09, z - d / 2], s: [w + 0.3, 0.18, 0.2] });
      b.add('kerb', '#d9d7cf', { p: [x, 0.09, z + d / 2], s: [w + 0.3, 0.18, 0.2] });
      b.add('kerb', '#d9d7cf', { p: [x - w / 2, 0.09, z], s: [0.2, 0.18, d] });
      b.add('kerb', '#d9d7cf', { p: [x + w / 2, 0.09, z], s: [0.2, 0.18, d] });
      if (Math.min(w, d) > 8) {
        const benches = Math.max(1, Math.floor(Math.max(w, d) / 28));
        for (let i = 0; i < benches; i++) {
          const o = ((i + 0.5) / benches - 0.5) * Math.max(w, d);
          const p = w >= d ? [x + o, z + d / 2 - 1.2] : [x + w / 2 - 1.2, z + o];
          const ry = w >= d ? 0 : Math.PI / 2;
          b.add('bench', '#6b4a2f', { p: [p[0], 0.5, p[1]], s: [2, 0.08, 0.5], ry });
          b.add('bench', '#6b4a2f', { p: [p[0], 0.28, p[1]], s: [1.7, 0.4, 0.1], ry });
        }
      }
    });

    // Lampadaires le long des allées principales.
    freeSpots(30, 3.5).forEach(([x, z]) => {
      b.add('lampPole', '#3a4048', { p: [x, 2.6, z], s: [0.14, 5.2, 0.14] }, { shape: 'cyl', ...METAL });
      b.add('lampArm', '#3a4048', { p: [x + 0.35, 5.15, z], s: [0.9, 0.08, 0.08] }, METAL);
      b.add(
        'lampHead',
        '#ffffff',
        { p: [x + 0.75, 5.05, z], s: [0.5, 0.12, 0.26] },
        { emissive: '#fff1cc', emissiveIntensity: 1.2, castShadow: false },
      );
    });
    return b.result();
  }, [gateX, gateZ, gateW]);

  // Plantations des jardins (placement aléatoire reproductible).
  const trees = useMemo(() => {
    const rnd = seeded(77);
    const list = [];
    gardens.forEach(({ position: [x, , z], size: [w, d] }) => {
      const area = w * d;
      const count = Math.max(2, Math.round((area / 150) * quality.vegetation));
      for (let i = 0; i < count; i++) {
        const small = Math.min(w, d) < 8;
        list.push({
          x: x + (rnd() - 0.5) * (w - 3),
          z: z + (rnd() - 0.5) * (d - 3),
          k: small ? 0.75 + rnd() * 0.25 : 0.9 + rnd() * 0.6,
          seed: rnd(),
          shrub: rnd() < (small ? 0.45 : 0.3),
        });
      }
    });
    return list;
  }, [quality.vegetation]);

  return (
    <group>
      <Parts model={model} />
      {gardens.map((g) => (
        <Garden key={g.id} garden={g} />
      ))}
      <Trees items={trees} castShadow={quality.shadows} />
      <Sign
        text="SPENTANA ACADEMY"
        position={[gateX, 5.9, gateZ + 0.27]}
        size={[gateW, 1.1]}
        bg="#2f6fa8"
        color="#ffffff"
      />
      <Sign
        text="BIENVENUE"
        position={[gateX, 5.9, gateZ - 0.27]}
        rotation={[0, Math.PI, 0]}
        size={[gateW, 1.1]}
        bg="#2f6fa8"
        color="#ffffff"
      />
    </group>
  );
}
