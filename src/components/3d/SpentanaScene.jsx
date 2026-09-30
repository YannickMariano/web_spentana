import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import CameraController from './CameraController';
import Enclosure from './Enclosure';
import Environment from './Environment';
import Facility from './Facility';
import Grandstand from './Grandstand';
import HotspotProjector from './HotspotProjector';
import ParkingLots from './ParkingLots';
import Parts from './Parts';
import People from './People';
import PlayerController from './PlayerController';
import { FACING, localDims } from './builder';
import { toiletBlock } from './buildingModels';
import { dayNight, lightsLevel } from './dayNight';
import { applySkyEnvironment } from './sky';
import { ENTRANCE, facilities, grandstands, parkings, toilets } from '../../data/visite';

// Deux niveaux de qualité : ordinateur et mobile (allégé : pas d'ombres,
// moins de végétation et de décor, résolution plafonnée).
const QUALITY = {
  high: { shadows: true, shadowMap: 4096, dpr: 1.75, houses: 300, outerTrees: 220, vegetation: 1, people: 1, waterSegments: 3, fill: 0.42 },
  low: { shadows: false, shadowMap: 1024, dpr: 1.25, houses: 70, outerTrees: 50, vegetation: 0.55, people: 0.5, waterSegments: 1.5, fill: 0.28 },
};

function ToiletBlock({ block }) {
  const [W, D] = localDims(block.size, block.facing);
  const model = useMemo(() => toiletBlock({ W, D }), [W, D]);
  return (
    <group position={block.position} rotation={[0, FACING[block.facing], 0]}>
      <Parts model={model} />
    </group>
  );
}

// Éclairage du soir : chaque terrain est inondé par ses projecteurs et la
// piscine est éclairée. L'intensité suit la tombée du jour (dayNight.js).
const NIGHT_LIGHTS = facilities
  .filter((f) => ['football', 'basket', 'piscine'].includes(f.type))
  .map((f) => ({
    id: f.id,
    position: [f.position[0], f.type === 'football' ? 15 : 11, f.position[2]],
    color: f.type === 'piscine' ? '#9fe6ff' : '#fff4dc',
    intensity: { football: 1500, basket: 800, piscine: 380 }[f.type],
    distance: Math.max(f.size[0], f.size[1]) * 1.5 + 14,
  }));

function NightLights() {
  const group = useRef();
  useFrame(() => {
    const k = lightsLevel();
    group.current?.children.forEach((light, i) => {
      light.intensity = NIGHT_LIGHTS[i].intensity * k;
    });
  });
  return (
    <group ref={group}>
      {NIGHT_LIGHTS.map((l) => (
        <pointLight key={l.id} position={l.position} color={l.color} intensity={0} distance={l.distance} decay={1.7} />
      ))}
    </group>
  );
}

// Garde les projecteurs montés tant qu'il ne fait pas plein jour (ils
// s'éteignent progressivement), puis les retire : aucun coût en journée.
function NightLightsSwitch({ night }) {
  const [dim, setDim] = useState(false);
  const last = useRef(false);
  useFrame(() => {
    const now = dayNight.value > 0.001;
    if (now !== last.current) {
      last.current = now;
      setDim(now);
    }
  });
  return night || dim ? <NightLights /> : null;
}

// Prévient l'interface quand les premières images sont réellement affichées
// (shaders compilés) : l'écran de chargement peut alors disparaître.
function ReadySignal({ onReady }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 4) onReady();
  });
  return null;
}

// Scène 3D complète du complexe. Chaque élément est placé d'après
// src/data/visite.js ; ce composant ne fait qu'assembler.
export default function SpentanaScene({ mobile, night, onSelect, onReady, apiRef }) {
  const quality = mobile ? QUALITY.low : QUALITY.high;
  const [dpr, setDpr] = useState(quality.dpr);

  const courts = useMemo(
    () =>
      facilities
        .filter((f) => f.type === 'football' || f.type === 'basket')
        .map((f) => ({
          position: f.position,
          size: f.size,
          count: Math.round((f.type === 'football' ? 8 : 4) * quality.people),
        })),
    [quality.people],
  );

  return (
    <Canvas
      shadows={quality.shadows}
      dpr={[1, dpr]}
      camera={{ position: ENTRANCE.introPosition, fov: 50, near: 0.3, far: 4000 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, scene, camera }) => {
        applySkyEnvironment(gl, scene);
        gl.toneMappingExposure = 0.92;
        camera.lookAt(...ENTRANCE.introTarget);
      }}
    >
      {/* Si la machine peine, on baisse la résolution plutôt que la fluidité. */}
      <PerformanceMonitor onDecline={() => setDpr(1)} />

      <NightLightsSwitch night={night} />
      <Environment quality={quality} night={night} />
      <Enclosure quality={quality} />
      <ParkingLots parkings={parkings} fill={quality.fill} />

      {facilities.map((f) => (
        <Facility key={f.id} facility={f} quality={quality} onSelect={onSelect} />
      ))}
      {grandstands.map((g) => {
        const [L, D] = localDims(g.size, g.facing);
        return (
          <group key={g.id} position={g.position} rotation={[0, FACING[g.facing], 0]}>
            <Grandstand L={L} D={D} />
          </group>
        );
      })}
      {toilets.map((t) => (
        <ToiletBlock key={t.id} block={t} />
      ))}
      <People courts={courts} />

      <HotspotProjector />
      <CameraController apiRef={apiRef} />
      <PlayerController />
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
