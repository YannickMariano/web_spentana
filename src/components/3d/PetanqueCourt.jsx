import { useMemo } from 'react';
import Parts from './Parts';
import { createBuilder } from './builder';
import { sandTexture, tiled } from './textures';

// Terrain de pétanque : sable stabilisé, traverses en bois, boules, banc et
// arbustes aux extrémités. `L` × `W` = emprise du plan, grand axe sur X.
export default function PetanqueCourt({ L, W }) {
  const map = useMemo(() => tiled(sandTexture(), Math.max(1, L / 2), Math.max(1, W / 2)), [L, W]);

  const model = useMemo(() => {
    const b = createBuilder();
    const wood = '#6b4a2f';
    b.add('wood', wood, { p: [0, 0.12, -W / 2], s: [L, 0.24, 0.18] });
    b.add('wood', wood, { p: [0, 0.12, W / 2], s: [L, 0.24, 0.18] });
    b.add('wood', wood, { p: [-L / 2, 0.12, 0], s: [0.18, 0.24, W + 0.18] });
    b.add('wood', wood, { p: [L / 2, 0.12, 0], s: [0.18, 0.24, W + 0.18] });
    // Séparation basse entre les deux pistes.
    b.add('wood', wood, { p: [0, 0.07, 0], s: [L - 0.4, 0.1, 0.08] });

    const steel = { shape: 'sphere', rough: 0.25, metal: 0.9 };
    [
      [L * 0.28, -W * 0.22],
      [L * 0.31, -W * 0.3],
      [L * 0.24, -W * 0.12],
      [-L * 0.2, W * 0.26],
      [-L * 0.26, W * 0.2],
    ].forEach(([x, z]) => {
      b.add('boule', '#b9c0c6', { p: [x, 0.1, z], s: [0.09, 0.09, 0.09] }, steel);
    });
    b.add('jack', '#e04a2a', { p: [L * 0.34, 0.08, -W * 0.2], s: [0.04, 0.04, 0.04] }, { shape: 'sphere' });

    // Banc le long de la piste et arbustes d'angle.
    b.add('bench', wood, { p: [0, 0.45, -W / 2 - 0.55], s: [2.2, 0.07, 0.42] });
    b.add('bench', wood, { p: [-0.9, 0.22, -W / 2 - 0.55], s: [0.08, 0.44, 0.38] });
    b.add('bench', wood, { p: [0.9, 0.22, -W / 2 - 0.55], s: [0.08, 0.44, 0.38] });
    [-1, 1].forEach((side) => {
      b.add('shrub', '#3f7d3b', { p: [side * (L / 2 - 0.6), 0.5, -W / 2 - 0.6], s: [1.2, 1, 1] }, { shape: 'blob' });
    });
    return b.result();
  }, [L, W]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} receiveShadow>
        <planeGeometry args={[L, W]} />
        <meshStandardMaterial map={map} roughness={1} />
      </mesh>
      <Parts model={model} />
    </group>
  );
}
