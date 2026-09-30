import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Matrix4, Quaternion, Vector3 } from 'three';
import { seeded } from './textures';

const TEAMS = ['#f4f4f2', '#1f4fb4', '#e8c21a', '#c8262c', '#1f7a43'];
const SKIN = ['#8d5a3b', '#6f452c', '#a36b47', '#5c3a26'];

const _m = new Matrix4();
const _q = new Quaternion();
const _p = new Vector3();
const _s = new Vector3();
const _up = new Vector3(0, 1, 0);
const _c = new Color();

// Quelques silhouettes très simples qui se déplacent lentement sur les
// terrains, pour que le complexe paraisse vivant. `courts` = terrains occupés.
export default function People({ courts }) {
  const legs = useRef();
  const torso = useRef();
  const head = useRef();

  const players = useMemo(() => {
    const rnd = seeded(915);
    const list = [];
    courts.forEach(({ position, size, count }) => {
      for (let i = 0; i < count; i++) {
        list.push({
          cx: position[0] + (rnd() - 0.5) * size[0] * 0.55,
          cz: position[2] + (rnd() - 0.5) * size[1] * 0.55,
          ax: 1.5 + rnd() * size[0] * 0.12,
          az: 1.5 + rnd() * size[1] * 0.12,
          w: 0.12 + rnd() * 0.16,
          ph: rnd() * Math.PI * 2,
          team: TEAMS[Math.floor(rnd() * TEAMS.length)],
          skin: SKIN[Math.floor(rnd() * SKIN.length)],
          h: 0.88 + rnd() * 0.16,
        });
      }
    });
    return list;
  }, [courts]);

  const colored = useRef(false);

  useFrame(({ clock }) => {
    if (!legs.current) return;
    const t = clock.elapsedTime;
    players.forEach((pl, i) => {
      const a = t * pl.w + pl.ph;
      const x = pl.cx + Math.sin(a) * pl.ax;
      const z = pl.cz + Math.sin(a * 0.7 + 1.3) * pl.az;
      const vx = Math.cos(a) * pl.ax;
      const vz = Math.cos(a * 0.7 + 1.3) * pl.az * 0.7;
      _q.setFromAxisAngle(_up, Math.atan2(vx, vz));
      const bob = Math.abs(Math.sin(t * 5 + pl.ph)) * 0.04;

      legs.current.setMatrixAt(i, _m.compose(_p.set(x, 0.42 * pl.h, z), _q, _s.set(0.3, 0.84 * pl.h, 0.2)));
      torso.current.setMatrixAt(i, _m.compose(_p.set(x, 1.13 * pl.h + bob, z), _q, _s.set(0.44, 0.62 * pl.h, 0.26)));
      head.current.setMatrixAt(i, _m.compose(_p.set(x, 1.6 * pl.h + bob, z), _q, _s.set(0.23, 0.26, 0.23)));
      if (!colored.current) {
        legs.current.setColorAt(i, _c.set('#20242b'));
        torso.current.setColorAt(i, _c.set(pl.team));
        head.current.setColorAt(i, _c.set(pl.skin));
      }
    });
    [legs, torso, head].forEach((r) => {
      r.current.instanceMatrix.needsUpdate = true;
      if (!colored.current && r.current.instanceColor) r.current.instanceColor.needsUpdate = true;
    });
    colored.current = true;
  });

  if (!players.length) return null;
  const n = players.length;
  return (
    <group>
      <instancedMesh ref={legs} args={[undefined, undefined, n]} frustumCulled={false}>
        <boxGeometry />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={torso} args={[undefined, undefined, n]} frustumCulled={false}>
        <capsuleGeometry args={[0.5, 0.2, 4, 12]} />
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={head} args={[undefined, undefined, n]} frustumCulled={false}>
        <sphereGeometry args={[0.5, 14, 10]} />
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
    </group>
  );
}
