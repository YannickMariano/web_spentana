import { useMemo } from 'react';
import Boxes from './Boxes';

// Tous les véhicules de la scène sont dessinés en quelques lots instanciés.
// `list` = [{ x, z, heading, color, kind: 'car' | 'moto' | 'van' }]
export default function Vehicles({ list }) {
  const parts = useMemo(() => {
    const body = [];
    const glass = [];
    const wheels = [];
    const trim = [];
    list.forEach(({ x, z, heading: h, color, kind }) => {
      const fx = Math.sin(h);
      const fz = Math.cos(h);
      const rx = Math.cos(h);
      const rz = -Math.sin(h);
      const at = (side, fwd, y) => [x + rx * side + fx * fwd, y, z + rz * side + fz * fwd];

      if (kind === 'moto') {
        // Réservoir coloré, selle, moteur, fourche et guidon.
        body.push({ p: at(0, 0.12, 0.74), s: [0.28, 0.24, 0.62], ry: h, c: color });
        trim.push({ p: at(0, -0.38, 0.8), s: [0.26, 0.1, 0.62], ry: h });
        trim.push({ p: at(0, -0.05, 0.48), s: [0.22, 0.3, 0.5], ry: h });
        trim.push({ p: at(0, 0.56, 0.7), s: [0.07, 0.75, 0.07], ry: h, rx: 0.42 });
        trim.push({ p: at(0, 0.44, 1.06), s: [0.6, 0.05, 0.05], ry: h });
        [-0.66, 0.7].forEach((f) => {
          wheels.push({ p: at(0, f, 0.31), s: [0.62, 0.1, 0.62], ry: h, rz: Math.PI / 2 });
        });
        return;
      }

      const van = kind === 'van';
      const len = van ? 4.9 : 4.3;
      const top = van ? 1.05 : 0.6;
      body.push({ p: at(0, 0, 0.64), s: [1.82, 0.74, len], ry: h, c: color });
      body.push({ p: at(0, van ? -0.35 : -0.25, 0.98 + top / 2), s: [1.64, top, van ? 3.6 : 2.3], ry: h, c: color });
      const gy = van ? 1.62 : 1.26;
      const gf = van ? -0.35 : -0.25;
      glass.push({ p: at(0, gf, gy), s: [1.68, 0.36, van ? 3.2 : 1.95], ry: h });
      glass.push({ p: at(0, gf, gy), s: [1.38, 0.36, van ? 3.64 : 2.34], ry: h });
      [-1, 1].forEach((side) => {
        [-1, 1].forEach((fwd) => {
          wheels.push({
            p: at(side * 0.86, fwd * (len / 2 - 0.85), 0.34),
            s: [0.68, 0.24, 0.68],
            ry: h,
            rz: Math.PI / 2,
          });
        });
        // Phares avant et feux arrière.
        trim.push({ p: at(side * 0.62, len / 2, 0.72), s: [0.36, 0.16, 0.05], ry: h, c: '#f3f0dc' });
        trim.push({ p: at(side * 0.62, -len / 2, 0.76), s: [0.36, 0.14, 0.05], ry: h, c: '#b3202a' });
      });
    });
    trim.forEach((t) => {
      if (!t.c) t.c = '#22262b';
    });
    return { body, glass, wheels, trim };
  }, [list]);

  return (
    <group>
      <Boxes items={parts.body} shape="rbox" rough={0.3} metal={0.55} />
      <Boxes items={parts.glass} color="#1b242d" rough={0.1} metal={0.8} castShadow={false} />
      <Boxes items={parts.wheels} shape="cyl" color="#17191c" rough={0.85} castShadow={false} />
      <Boxes items={parts.trim} rough={0.5} castShadow={false} />
    </group>
  );
}
