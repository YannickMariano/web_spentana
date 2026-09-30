import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import Boxes from './Boxes';

// Horloge du vent, partagée par tous les feuillages.
const wind = { value: 0 };

// Balancement léger du feuillage, calculé sur le GPU (aucun coût côté CPU).
function sway(shader) {
  shader.uniforms.uWind = wind;
  shader.vertexShader = `uniform float uWind;\n${shader.vertexShader}`.replace(
    '#include <begin_vertex>',
    `#include <begin_vertex>
    #ifdef USE_INSTANCING
      float phase = instanceMatrix[3].x * 0.35 + instanceMatrix[3].z * 0.27;
      float lift = position.y + 0.5;
      transformed.x += sin(uWind * 1.1 + phase) * 0.035 * lift;
      transformed.z += cos(uWind * 0.9 + phase * 1.3) * 0.03 * lift;
    #endif`,
  );
}

const GREENS = ['#3d7a3a', '#4a8a3f', '#356b35', '#5a9447', '#2f6336'];

// Arbres et arbustes. `items` = [{ x, z, k (taille), seed, shrub? }]
export default function Trees({ items, castShadow = true }) {
  const { trunks, leaves } = useMemo(() => {
    const tr = [];
    const lf = [];
    items.forEach(({ x, z, k = 1, seed = 0, shrub }) => {
      const c = GREENS[Math.abs(Math.floor(seed * 97)) % GREENS.length];
      if (shrub) {
        lf.push({ p: [x, 0.5 * k, z], s: [1.5 * k, 1.1 * k, 1.4 * k], c });
        return;
      }
      const a = seed * 12.9;
      tr.push({ p: [x, 1.5 * k, z], s: [0.34 * k, 3 * k, 0.34 * k] });
      lf.push({ p: [x, 4.1 * k, z], s: [3.6 * k, 3.2 * k, 3.6 * k], c });
      lf.push({
        p: [x + Math.cos(a) * 1.1 * k, 3.4 * k, z + Math.sin(a) * 1.1 * k],
        s: [2.5 * k, 2.2 * k, 2.5 * k],
        c,
      });
      lf.push({
        p: [x - Math.cos(a) * 0.9 * k, 4.9 * k, z - Math.sin(a) * 0.8 * k],
        s: [2.3 * k, 2 * k, 2.3 * k],
        c,
      });
    });
    return { trunks: tr, leaves: lf };
  }, [items]);

  useFrame((state) => {
    wind.value = state.clock.elapsedTime;
  });

  return (
    <group>
      <Boxes items={trunks} shape="cyl" color="#5b4330" rough={0.9} castShadow={castShadow} />
      <Boxes items={leaves} shape="blob" rough={0.9} castShadow={castShadow} onBeforeCompile={sway} />
    </group>
  );
}
