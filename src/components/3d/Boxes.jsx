import { useLayoutEffect, useRef } from 'react';
import {
  BoxGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Euler,
  IcosahedronGeometry,
  Matrix4,
  Quaternion,
  SphereGeometry,
  Vector3,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { registerGlow } from './dayNight';

// Formes unitaires partagées par toute la scène (1 × 1 × 1 avant mise à l'échelle).
const pyramid = new ConeGeometry(Math.SQRT1_2, 1, 4, 1);
pyramid.rotateY(Math.PI / 4);

const SHAPES = {
  box: new BoxGeometry(1, 1, 1),
  rbox: new RoundedBoxGeometry(1, 1, 1, 3, 0.14),
  cyl: new CylinderGeometry(0.5, 0.5, 1, 20),
  sphere: new SphereGeometry(0.5, 20, 14),
  blob: new IcosahedronGeometry(0.5, 2),
  pyramid,
};

const _m = new Matrix4();
const _q = new Quaternion();
const _e = new Euler();
const _p = new Vector3();
const _s = new Vector3();
const _c = new Color();

// Brique de base de la scène : un lot d'objets identiques dessinés en UN seul
// appel GPU (instancing). `items` = [{ p: [x,y,z], s: [sx,sy,sz], ry?, rx?, rz?, c? }]
// où `c` est une couleur propre à l'élément.
// Le soir : les lots `litAtNight` (vitrages) s'éclairent de l'intérieur et les
// lots déjà lumineux (projecteurs, lampadaires) brillent davantage — de façon
// progressive, pilotée par dayNight.js.
export default function Boxes({
  items,
  shape = 'box',
  color = '#ffffff',
  rough = 0.85,
  metal = 0,
  emissive,
  emissiveIntensity = 1,
  opacity = 1,
  castShadow = true,
  receiveShadow = true,
  litAtNight = false,
  onBeforeCompile,
}) {
  const ref = useRef();
  const glows = litAtNight || Boolean(emissive);

  useLayoutEffect(() => {
    if (!glows || !ref.current) return undefined;
    return registerGlow(ref.current.material, { lit: litAtNight, intensity: emissiveIntensity });
  }, [glows, litAtNight, emissiveIntensity]);
  const tinted = items.some((it) => it.c);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    items.forEach((it, i) => {
      _e.set(it.rx || 0, it.ry || 0, it.rz || 0);
      _q.setFromEuler(_e);
      _p.fromArray(it.p);
      _s.fromArray(it.s);
      mesh.setMatrixAt(i, _m.compose(_p, _q, _s));
      if (tinted) mesh.setColorAt(i, _c.set(it.c || color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items, tinted, color]);

  if (!items.length) return null;

  return (
    <instancedMesh
      ref={ref}
      args={[SHAPES[shape], undefined, items.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      <meshStandardMaterial
        {...(onBeforeCompile ? { onBeforeCompile } : null)}
        color={tinted ? '#ffffff' : color}
        roughness={rough}
        metalness={metal}
        emissive={litAtNight ? '#ffc877' : (emissive ?? '#000000')}
        emissiveIntensity={litAtNight ? 0 : emissiveIntensity}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </instancedMesh>
  );
}
