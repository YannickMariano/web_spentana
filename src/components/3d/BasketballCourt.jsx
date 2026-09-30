import { useMemo } from 'react';
import Boxes from './Boxes';
import Fence from './Fence';
import { basketTexture } from './textures';

// Terrain de basket. `L` × `W` = dalle du plan (grand axe sur X) ; le terrain
// peint est centré dessus. `variant` : 'red' (rouge/jaune) ou 'green' (vert/bleu).
export default function BasketballCourt({ L, W, variant = 'red' }) {
  const courtL = Math.min(L - 3, 32);
  const courtW = Math.min(W - 2.2, (courtL * 15) / 28);
  const map = useMemo(
    () => basketTexture(L - 0.6, W - 0.6, courtL, courtW, variant),
    [L, W, courtL, courtW, variant],
  );

  const { frame, boards, lamps, masts } = useMemo(() => {
    const fr = [];
    const bd = [];
    const lp = [];
    const ms = [];
    [-1, 1].forEach((dir) => {
      const base = dir * (courtL / 2 + 1.1);
      const board = dir * (courtL / 2 - 1.2);
      // Potence : pied lesté, mât, bras incliné vers le terrain.
      fr.push({ p: [base + dir * 0.3, 0.25, 0], s: [1.5, 0.5, 1.1] });
      fr.push({ p: [base, 1.6, 0], s: [0.2, 3.2, 0.2] });
      fr.push({ p: [(base + board) / 2, 3.25, 0], s: [Math.abs(base - board) + 0.2, 0.16, 0.16] });
      bd.push({ p: [board, 3.45, 0], s: [0.06, 1.05, 1.8] });
      fr.push({ p: [board - dir * 0.05, 3.3, 0], s: [0.04, 0.45, 0.6] });
    });
    [-1, 1].forEach((sx) => {
      [-1, 1].forEach((sz) => {
        const x = sx * (L / 2 - 0.2);
        const z = sz * (W / 2 - 0.2);
        ms.push({ p: [x, 4.5, z], s: [0.2, 9, 0.2] });
        lp.push({ p: [x - sx * 0.35, 9, z - sz * 0.35], s: [1.2, 0.45, 0.3], ry: (sx * sz * Math.PI) / 4 });
      });
    });
    return { frame: fr, boards: bd, lamps: lp, masts: ms };
  }, [L, W, courtL]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[L - 0.6, W - 0.6]} />
        <meshStandardMaterial map={map} roughness={0.7} />
      </mesh>
      <Fence L={L} W={W} height={4} poleColor="#3a4d63" netColor="#d6e2ee" />
      <Boxes items={frame} color="#27364a" rough={0.5} metal={0.4} />
      <Boxes items={boards} color="#f4f6f8" rough={0.25} />
      <Boxes items={masts} shape="cyl" color="#c9ccd0" rough={0.4} metal={0.6} />
      <Boxes items={lamps} color="#ffffff" emissive="#fff6d8" emissiveIntensity={0.9} castShadow={false} />
      {[-1, 1].map((dir) => (
        <mesh
          key={dir}
          position={[dir * (courtL / 2 - 1.2 - 0.3), 3.05, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <torusGeometry args={[0.23, 0.025, 8, 24]} />
          <meshStandardMaterial color="#e8641e" roughness={0.4} metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
}
