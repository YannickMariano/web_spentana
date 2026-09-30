import { useMemo } from 'react';
import Boxes from './Boxes';
import { roofTexture, signTexture, tiled } from './textures';

// Pan de toiture en tôle ondulée.
export function RoofSlab({ p, s, color }) {
  const map = useMemo(() => tiled(roofTexture(), Math.max(1, Math.round(s[0] / 0.9)), 1), [s]);
  return (
    <mesh position={p} scale={s} castShadow receiveShadow>
      <boxGeometry />
      <meshStandardMaterial map={map} color={color} roughness={0.5} metalness={0.35} />
    </mesh>
  );
}

// Enseigne : panneau plat portant un texte. `size` = [largeur, hauteur] en m.
export function Sign({ text, position, rotation = [0, 0, 0], size = [6, 1], bg, color, border }) {
  const map = useMemo(
    () => signTexture(text, { bg, color, border, ratio: size[0] / size[1] }),
    [text, bg, color, border, size],
  );
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshStandardMaterial map={map} roughness={0.7} />
    </mesh>
  );
}

// Rend le résultat d'un `createBuilder()` : lots instanciés + toitures.
export default function Parts({ model }) {
  return (
    <>
      {model.groups.map((g) => (
        <Boxes key={g.id} {...g} />
      ))}
      {model.roofs.map((r, i) => (
        <RoofSlab key={i} {...r} />
      ))}
    </>
  );
}
