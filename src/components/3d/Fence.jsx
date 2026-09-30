import { useMemo } from 'react';
import { DoubleSide } from 'three';
import Boxes from './Boxes';
import { netTexture, tiled } from './textures';

// Panneau de filet / grillage (plan semi-transparent à maille répétée).
export function NetPanel({ size, position, rotation, color = '#ffffff', opacity = 0.4, mesh = 0.5 }) {
  const map = useMemo(
    () => tiled(netTexture(), Math.max(1, Math.round(size[0] / mesh)), Math.max(1, Math.round(size[1] / mesh))),
    [size, mesh],
  );
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        map={map}
        color={color}
        transparent
        opacity={opacity}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Clôture d'un terrain : muret blanc, poteaux et filets pare-ballons.
// Centrée sur l'origine, emprise `L` (le long de X) × `W` (le long de Z).
export default function Fence({ L, W, height = 5, poleColor = '#2c6b4a', netColor = '#bfe3c8' }) {
  const { kerb, poles } = useMemo(() => {
    const k = [
      { p: [0, 0.22, -W / 2], s: [L, 0.44, 0.28] },
      { p: [0, 0.22, W / 2], s: [L, 0.44, 0.28] },
      { p: [-L / 2, 0.22, 0], s: [0.28, 0.44, W] },
      { p: [L / 2, 0.22, 0], s: [0.28, 0.44, W] },
    ];
    const p = [];
    const nx = Math.max(2, Math.round(L / 5));
    const nz = Math.max(2, Math.round(W / 5));
    for (let i = 0; i <= nx; i++) {
      const x = -L / 2 + (L * i) / nx;
      p.push({ p: [x, height / 2, -W / 2], s: [0.12, height, 0.12] });
      p.push({ p: [x, height / 2, W / 2], s: [0.12, height, 0.12] });
    }
    for (let i = 1; i < nz; i++) {
      const z = -W / 2 + (W * i) / nz;
      p.push({ p: [-L / 2, height / 2, z], s: [0.12, height, 0.12] });
      p.push({ p: [L / 2, height / 2, z], s: [0.12, height, 0.12] });
    }
    // Lisses hautes.
    p.push({ p: [0, height, -W / 2], s: [L, 0.07, 0.07] });
    p.push({ p: [0, height, W / 2], s: [L, 0.07, 0.07] });
    p.push({ p: [-L / 2, height, 0], s: [0.07, 0.07, W] });
    p.push({ p: [L / 2, height, 0], s: [0.07, 0.07, W] });
    return { kerb: k, poles: p };
  }, [L, W, height]);

  const y = height / 2 + 0.2;
  return (
    <group>
      <Boxes items={kerb} color="#f2f2ee" />
      <Boxes items={poles} color={poleColor} rough={0.5} metal={0.4} />
      <NetPanel size={[L, height - 0.4]} position={[0, y, -W / 2]} color={netColor} opacity={0.3} />
      <NetPanel size={[L, height - 0.4]} position={[0, y, W / 2]} color={netColor} opacity={0.3} />
      <NetPanel size={[W, height - 0.4]} position={[-L / 2, y, 0]} rotation={[0, Math.PI / 2, 0]} color={netColor} opacity={0.3} />
      <NetPanel size={[W, height - 0.4]} position={[L / 2, y, 0]} rotation={[0, Math.PI / 2, 0]} color={netColor} opacity={0.3} />
    </group>
  );
}
