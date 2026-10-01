import { Suspense, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { SRGBColorSpace } from 'three';
import Parts, { Sign } from './Parts';
import { createBuilder, GLASS } from './builder';
import { featuredVehicles } from '../../data/visite';

const BLACK = '#1d1f22';
const PAINT = { rough: 0.32, metal: 0.35 };
const TYRE = { shape: 'cyl', rough: 0.9 };
const RIM = { shape: 'cyl', rough: 0.3, metal: 0.8 };
const HEADLIGHT = { emissive: '#fff6dc', emissiveIntensity: 0.25, castShadow: false };

// Roue : pneu + jante, essieu le long de X.
function addWheel(b, x, z, r, w) {
  b.add('tyre', '#16181b', { p: [x, r, z], s: [r * 2, w, r * 2], rz: Math.PI / 2 }, TYRE);
  b.add('rim', '#c9ccd0', { p: [x + Math.sign(x) * 0.01, r, z], s: [r * 1.25, w + 0.02, r * 1.25], rz: Math.PI / 2 }, RIM);
}

// Land Rover Defender 110 Station Wagon (2012) : carrosserie très carrée,
// capot plat, ailes plates, vitres « alpine » sur le pavillon, roue de secours
// sur la porte arrière. Repère local : avant = +Z.
function defender110(color) {
  const b = createBuilder();
  b.add('chassis', '#2a2c30', { p: [0, 0.5, -0.1], s: [1.5, 0.3, 3.9] });
  b.add('paint', color, { p: [0, 0.88, -0.1], s: [1.79, 0.62, 4.02] }, PAINT);
  b.add('paint', color, { p: [0, 1.26, 1.4], s: [1.58, 0.2, 1.06] }, PAINT);
  [-1, 1].forEach((sx) => b.add('paint', color, { p: [sx * 0.82, 1.27, 1.4], s: [0.15, 0.22, 1.06] }, PAINT));
  b.add('paint', color, { p: [0, 1.57, -0.63], s: [1.74, 0.8, 2.95] }, PAINT);
  b.add('roof', '#f7f7f4', { p: [0, 2.0, -0.63], s: [1.72, 0.06, 2.9] }, PAINT);

  b.add('glass', '#2a3540', { p: [0, 1.6, 0.88], s: [1.5, 0.5, 0.06], rx: -0.08 }, GLASS);
  b.add('glass', '#2a3540', { p: [0, 1.62, -0.72], s: [1.76, 0.42, 2.6] }, GLASS);
  b.add('glass', '#2a3540', { p: [0, 1.88, -1.15], s: [1.745, 0.11, 1.05] }, GLASS);
  b.add('glass', '#2a3540', { p: [0.18, 1.62, -2.12], s: [0.8, 0.4, 0.06] }, GLASS);

  b.add('trim', BLACK, { p: [0, 1.0, 1.92], s: [1.32, 0.34, 0.06] });
  b.add('trim', BLACK, { p: [0, 0.56, 2.0], s: [1.86, 0.2, 0.24] });
  b.add('trim', BLACK, { p: [0, 0.56, -2.2], s: [1.86, 0.18, 0.2] });
  [-1, 1].forEach((sx) => {
    [1.38, -1.42].forEach((z) => b.add('trim', BLACK, { p: [sx * 0.91, 1.02, z], s: [0.1, 0.12, 1.0] }));
    b.add('trim', BLACK, { p: [sx * 0.94, 0.45, -0.3], s: [0.2, 0.05, 1.4] });
    b.add('trim', BLACK, { p: [sx * 1.0, 1.45, 0.78], s: [0.2, 0.15, 0.05] });
    b.add('headlight', '#fffbe6', { p: [sx * 0.6, 1.12, 1.94], s: [0.22, 0.05, 0.22], rx: Math.PI / 2 }, { shape: 'cyl', ...HEADLIGHT });
    b.add('taillight', '#b3202a', { p: [sx * 0.82, 1.05, -2.12], s: [0.12, 0.3, 0.04] });
    addWheel(b, sx * 0.8, 1.38, 0.4, 0.27);
    addWheel(b, sx * 0.8, -1.42, 0.4, 0.27);
  });
  // Galerie de toit et roue de secours.
  [-0.2, -1.6].forEach((z) => b.add('trim', BLACK, { p: [0, 2.06, z], s: [1.6, 0.04, 0.04] }));
  b.add('tyre', '#16181b', { p: [-0.25, 1.3, -2.28], s: [0.78, 0.24, 0.78], rx: Math.PI / 2 }, TYRE);
  b.add('rim', '#c9ccd0', { p: [-0.25, 1.3, -2.29], s: [0.48, 0.26, 0.48], rx: Math.PI / 2 }, RIM);
  return b.result();
}

// Minibus Toyota Coaster : caisse haute aux angles arrondis, grand bandeau
// vitré, pare-brise incliné, porte avant droite, bandes bleues Spentana.
function coaster(color) {
  const b = createBuilder();
  b.add('paint', color, { p: [0, 1.43, 0], s: [2.03, 2.05, 6.95] }, { shape: 'rbox', ...PAINT });
  b.add('paint', color, { p: [0, 2.5, -0.1], s: [1.9, 0.18, 6.6] }, { shape: 'rbox', ...PAINT });
  b.add('glass', '#2a3540', { p: [0, 1.96, -0.55], s: [2.05, 0.72, 5.5] }, GLASS);
  b.add('glass', '#2a3540', { p: [0, 1.95, 3.46], s: [1.88, 0.95, 0.06], rx: -0.15 }, GLASS);
  b.add('glass', '#2a3540', { p: [0, 1.95, -3.47], s: [1.7, 0.7, 0.06] }, GLASS);
  b.add('glass', '#2a3540', { p: [-1.02, 1.35, 2.75], s: [0.04, 1.6, 0.8] }, GLASS);
  b.add('stripe', '#2a83c6', { p: [0, 1.46, -0.1], s: [2.045, 0.13, 6.75] }, PAINT);
  b.add('stripe', '#2a83c6', { p: [0, 1.33, -0.1], s: [2.045, 0.04, 6.75] }, PAINT);
  b.add('trim', BLACK, { p: [0, 0.6, 3.5], s: [2.05, 0.3, 0.2] });
  b.add('trim', BLACK, { p: [0, 0.6, -3.5], s: [2.05, 0.3, 0.2] });
  b.add('trim', BLACK, { p: [0, 0.98, 3.49], s: [1.3, 0.3, 0.04] });
  [-1, 1].forEach((sx) => {
    b.add('trim', BLACK, { p: [sx * 1.13, 2.0, 3.25], s: [0.05, 0.4, 0.12] });
    b.add('headlight', '#fffbe6', { p: [sx * 0.75, 0.98, 3.49], s: [0.36, 0.16, 0.04] }, HEADLIGHT);
    b.add('taillight', '#b3202a', { p: [sx * 0.85, 1.0, -3.49], s: [0.16, 0.4, 0.04] });
    addWheel(b, sx * 0.86, 2.35, 0.4, 0.3);
    addWheel(b, sx * 0.86, -1.55, 0.4, 0.3);
  });
  return b.result();
}

// Logo Spentana (image du site) posé comme un autocollant sur la carrosserie.
function LogoDecal({ position, rotation, size }) {
  const map = useTexture('/Logo/LogoSpentana.png', (t) => {
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
  });
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial map={map} transparent alphaTest={0.05} roughness={0.4} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  );
}

function CoasterBus({ color }) {
  const model = useMemo(() => coaster(color), [color]);
  return (
    <group>
      <Parts model={model} />
      {[1, -1].map((side) => (
        <group key={side} rotation={[0, side * (Math.PI / 2), 0]}>
          {/* Sur chaque flanc : logo à l'arrière, nom en bleu à l'avant. */}
          <Sign
            text="SPENTANA"
            position={[-side * 0.8, 0.95, 1.03]}
            size={[2.6, 0.46]}
            bg={color}
            color="#2a83c6"
          />
          <Suspense fallback={null}>
            <LogoDecal position={[side * 1.95, 0.85, 1.03]} rotation={[0, 0, 0]} size={0.9} />
          </Suspense>
        </group>
      ))}
      <Suspense fallback={null}>
        <LogoDecal position={[0, 1.0, -3.495]} rotation={[0, Math.PI, 0]} size={0.8} />
      </Suspense>
    </group>
  );
}

function Defender({ color }) {
  const model = useMemo(() => defender110(color), [color]);
  return (
    <group>
      <Parts model={model} />
      <Sign text="DEFENDER" position={[0, 1.3, 1.935]} size={[0.8, 0.1]} bg={color} color={BLACK} />
      <Sign text="LAND ROVER" position={[0, 1.05, 1.955]} size={[0.34, 0.12]} bg="#0b5a3a" color="#ffffff" />
    </group>
  );
}

const MODELS = { defender110: Defender, coaster: CoasterBus };

// Véhicules du complexe, placés dans src/data/visite.js (`featuredVehicles`).
export default function FeaturedVehicles() {
  return featuredVehicles.map((v) => {
    const Model = MODELS[v.model];
    return (
      <group key={v.id} position={v.position} rotation={[0, v.heading, 0]}>
        <Model color={v.color} />
      </group>
    );
  });
}
