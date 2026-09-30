import { useMemo } from 'react';
import Boxes from './Boxes';
import Fence, { NetPanel } from './Fence';
import { footballTexture } from './textures';

const GOAL = { width: 6, height: 2.1, depth: 1.5 };

// Cage : montants, transversale et filets (arrière, dessus, côtés).
function Goal({ x, dir }) {
  const { width: w, height: h, depth: d } = GOAL;
  const back = x + dir * d;
  const mid = x + (dir * d) / 2;
  return (
    <group>
      <NetPanel size={[w, h]} position={[back, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} opacity={0.55} mesh={0.25} />
      <NetPanel size={[d, w]} position={[mid, h, 0]} rotation={[-Math.PI / 2, 0, 0]} opacity={0.55} mesh={0.25} />
      <NetPanel size={[d, h]} position={[mid, h / 2, -w / 2]} opacity={0.55} mesh={0.25} />
      <NetPanel size={[d, h]} position={[mid, h / 2, w / 2]} opacity={0.55} mesh={0.25} />
    </group>
  );
}

// Terrain de football synthétique. `L` × `W` = emprise du plan, grand axe sur X.
export default function FootballField({ L, W, variant = 'foot7' }) {
  const turfL = L - 1;
  const turfW = W - 1;
  const map = useMemo(() => footballTexture(turfL, turfW, variant), [turfL, turfW, variant]);
  const goalX = turfL / 2 - 1.6;

  const { white, blue, lamps, masts } = useMemo(() => {
    const wh = [];
    const bl = [];
    const lp = [];
    const ms = [];
    const { width: w, height: h, depth: d } = GOAL;
    [-1, 1].forEach((dir) => {
      const x = dir * goalX;
      wh.push({ p: [x, h / 2, -w / 2], s: [0.12, h, 0.12] });
      wh.push({ p: [x, h / 2, w / 2], s: [0.12, h, 0.12] });
      wh.push({ p: [x, h, 0], s: [0.12, 0.12, w + 0.12] });
      wh.push({ p: [x + dir * d, h / 2, -w / 2], s: [0.06, h, 0.06] });
      wh.push({ p: [x + dir * d, h / 2, w / 2], s: [0.06, h, 0.06] });
      wh.push({ p: [x + dir * d, h, 0], s: [0.06, 0.06, w] });
    });
    // Bancs de touche abrités, côté +Z.
    [-0.2, 0.2].forEach((k) => {
      const x = L * k;
      const z = W / 2 - 0.75;
      bl.push({ p: [x, 1, z + 0.4], s: [3.4, 2, 0.08] });
      bl.push({ p: [x, 2, z], s: [3.6, 0.08, 1] });
      bl.push({ p: [x - 1.7, 1, z], s: [0.08, 2, 0.9] });
      bl.push({ p: [x + 1.7, 1, z], s: [0.08, 2, 0.9] });
      wh.push({ p: [x, 0.45, z + 0.1], s: [3, 0.08, 0.4] });
    });
    // Mâts d'éclairage aux quatre coins.
    const mastH = variant === 'foot9' ? 13 : 11;
    [-1, 1].forEach((sx) => {
      [-1, 1].forEach((sz) => {
        const x = sx * (L / 2 - 0.2);
        const z = sz * (W / 2 - 0.2);
        ms.push({ p: [x, mastH / 2, z], s: [0.28, mastH, 0.28] });
        lp.push({ p: [x - sx * 0.4, mastH, z - sz * 0.4], s: [1.5, 0.55, 0.35], ry: (sx * sz * Math.PI) / 4 });
      });
    });
    return { white: wh, blue: bl, lamps: lp, masts: ms };
  }, [L, W, goalX, variant]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[turfL, turfW]} />
        <meshStandardMaterial map={map} roughness={0.95} />
      </mesh>
      <Fence L={L} W={W} height={variant === 'foot9' ? 6 : 5.2} />
      <Boxes items={white} color="#f6f6f4" rough={0.5} />
      <Boxes items={blue} color="#3d8fd4" rough={0.6} />
      <Boxes items={masts} shape="cyl" color="#c9ccd0" rough={0.4} metal={0.6} />
      <Boxes items={lamps} color="#ffffff" emissive="#fff6d8" emissiveIntensity={0.9} castShadow={false} />
      <Goal x={-goalX} dir={-1} />
      <Goal x={goalX} dir={1} />
    </group>
  );
}
