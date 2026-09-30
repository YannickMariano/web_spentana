import { useMemo } from 'react';
import Boxes from './Boxes';
import Vehicles from './Vehicles';
import { asphaltTexture, seeded, tiled } from './textures';
import { noParkingZones } from '../../data/visite';

const isClear = (x, z) =>
  noParkingZones.every(({ center, radius }) => Math.hypot(x - center[0], z - center[1]) > radius);

const CAR_COLORS = ['#e9e9e6', '#c3c7cb', '#2a2d31', '#5b6067', '#8e1f26', '#1f4a7a', '#d8d2c2', '#3d3f37'];
const MOTO_COLORS = ['#c0262d', '#22262b', '#1f4a7a', '#e9e9e6'];

// Découpe un parking en places : lignes peintes + véhicules garés (aléatoire
// reproductible, pour que la scène soit identique à chaque visite).
function layoutParking(parking, rnd, fill) {
  const [cx, , cz] = parking.position;
  const [w, d] = parking.size;
  const moto = parking.kind === 'moto';
  const alongX = w >= d;
  const len = alongX ? w : d;
  const depth = alongX ? d : w;
  const bay = moto ? 1.15 : 2.7;
  const bayLen = moto ? 2 : 4.8;
  const rows = !moto && depth >= 11 ? 2 : 1;
  const n = Math.floor((len - 0.6) / bay);
  const start = -(n * bay) / 2;
  const lines = [];
  const vehicles = [];

  for (let r = 0; r < rows; r++) {
    const across = rows === 1 ? 0 : (r ? 1 : -1) * (depth / 2 - bayLen / 2 - 0.3);
    for (let i = 0; i <= n; i++) {
      const along = start + i * bay;
      const p = alongX ? [cx + along, 0.045, cz + across] : [cx + across, 0.045, cz + along];
      lines.push({ p, s: alongX ? [0.1, 0.01, bayLen] : [bayLen, 0.01, 0.1] });
      if (i < n && rnd() < fill) {
        const mid = along + bay / 2;
        const colors = moto ? MOTO_COLORS : CAR_COLORS;
        const vx = alongX ? cx + mid : cx + across;
        const vz = alongX ? cz + across : cz + mid;
        if (!isClear(vx, vz)) continue;
        vehicles.push({
          x: vx,
          z: vz,
          heading: (alongX ? 0 : Math.PI / 2) + (rnd() > 0.5 ? Math.PI : 0) + (rnd() - 0.5) * 0.06,
          color: colors[Math.floor(rnd() * colors.length)],
          kind: moto ? 'moto' : rnd() > 0.88 ? 'van' : 'car',
        });
      }
    }
  }
  return { lines, vehicles };
}

function ParkingSurface({ parking }) {
  const [w, d] = parking.size;
  const map = useMemo(() => tiled(asphaltTexture(), w / 4, d / 4), [w, d]);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[parking.position[0], 0.035, parking.position[2]]}
      receiveShadow
    >
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial map={map} roughness={0.95} />
    </mesh>
  );
}

// Parkings voitures et motos du plan, avec marquage au sol et véhicules.
export default function ParkingLots({ parkings, fill = 0.42 }) {
  const { lines, vehicles } = useMemo(() => {
    const rnd = seeded(2024);
    const all = { lines: [], vehicles: [] };
    parkings.forEach((p) => {
      const lay = layoutParking(p, rnd, p.kind === 'moto' ? fill + 0.15 : fill);
      all.lines.push(...lay.lines);
      all.vehicles.push(...lay.vehicles);
    });
    return all;
  }, [parkings, fill]);

  return (
    <group>
      {parkings.map((p) => (
        <ParkingSurface key={p.id} parking={p} />
      ))}
      <Boxes items={lines} color="#f1f1ee" castShadow={false} receiveShadow={false} />
      <Vehicles list={vehicles} />
    </group>
  );
}
