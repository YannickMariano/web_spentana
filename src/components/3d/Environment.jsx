import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Color, Path, Shape, Vector3 } from 'three';
import Boxes from './Boxes';
import Trees from './Trees';
import Vehicles from './Vehicles';
import { poolBasinsWorld } from './layout';
import { applyGlows, dayNight, stepDayNight } from './dayNight';
import { FOG_COLOR, SUN_DIRECTION } from './sky';
import {
  asphaltTexture,
  earthTexture,
  meadowTexture,
  paddyTexture,
  paversTexture,
  seeded,
  tiled,
} from './textures';
import { BOUNDARY, GATE, facilityById } from '../../data/visite';

const xs = BOUNDARY.map((p) => p[0]);
const zs = BOUNDARY.map((p) => p[1]);
const BOUNDS = {
  minX: Math.min(...xs),
  maxX: Math.max(...xs),
  minZ: Math.min(...zs),
  maxZ: Math.max(...zs),
};

const ROAD_Z = BOUNDS.maxZ + 62;
const GATE_X = (GATE.from[0] + GATE.to[0]) / 2;

// Rizières inondées qui entourent le complexe (nord, est, ouest).
const PADDIES = [
  { minX: BOUNDS.minX - 60, maxX: BOUNDS.maxX + 210, minZ: BOUNDS.minZ - 230, maxZ: BOUNDS.minZ - 9 },
  { minX: BOUNDS.maxX + 9, maxX: BOUNDS.maxX + 260, minZ: BOUNDS.minZ + 4, maxZ: BOUNDS.maxZ - 20 },
  { minX: BOUNDS.minX - 250, maxX: BOUNDS.minX - 9, minZ: BOUNDS.minZ - 5, maxZ: BOUNDS.maxZ - 60 },
];

// Zones où l'on ne pose ni maison ni arbre.
const RESERVED = [
  { minX: BOUNDS.minX - 12, maxX: BOUNDS.maxX + 12, minZ: BOUNDS.minZ - 12, maxZ: BOUNDS.maxZ + 12 },
  { minX: -900, maxX: 900, minZ: ROAD_Z - 12, maxZ: ROAD_Z + 12 },
  { minX: GATE_X - 12, maxX: GATE_X + 12, minZ: BOUNDS.maxZ, maxZ: ROAD_Z },
  ...PADDIES,
];

const isReserved = (x, z, m = 0) =>
  RESERVED.some((r) => x > r.minX - m && x < r.maxX + m && z > r.minZ - m && z < r.maxZ + m);

// Contour → forme plane (le sol est une forme tournée à plat : y = -z).
function outline(points, Ctor = Shape) {
  const s = new Ctor();
  points.forEach(([x, z], i) => (i ? s.lineTo(x, -z) : s.moveTo(x, -z)));
  s.closePath();
  return s;
}

const rectPoints = (r) => [
  [r.minX, r.minZ],
  [r.maxX, r.minZ],
  [r.maxX, r.maxZ],
  [r.minX, r.maxZ],
];

function Flat({ rect, y, texture, tile, color = '#ffffff', rough = 1, metal = 0 }) {
  const w = rect.maxX - rect.minX;
  const d = rect.maxZ - rect.minZ;
  const map = useMemo(() => tiled(texture(), w / tile, d / tile), [texture, w, d, tile]);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[(rect.minX + rect.maxX) / 2, y, (rect.minZ + rect.maxZ) / 2]}
      receiveShadow
    >
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial map={map} color={color} roughness={rough} metalness={metal} />
    </mesh>
  );
}

// Sol : prairie extérieure (percée à l'emplacement du complexe) puis dallage
// du complexe (percé à l'emplacement des bassins de la piscine).
function Ground() {
  const { outer, inner, outerMap, innerMap } = useMemo(() => {
    const far = 1500;
    const out = outline([
      [-far, -far],
      [far, -far],
      [far, far],
      [-far, far],
    ]);
    out.holes.push(outline(BOUNDARY, Path));

    const inn = outline(BOUNDARY);
    poolBasinsWorld(facilityById.piscine).forEach((basin) => {
      inn.holes.push(outline(rectPoints(basin), Path));
    });

    // Les UV d'une forme sont ses coordonnées en mètres : on règle la taille du motif.
    const om = tiled(meadowTexture(), 1 / 140, 1 / 140);
    const im = tiled(paversTexture(), 1 / 4, 1 / 4);
    return { outer: out, inner: inn, outerMap: om, innerMap: im };
  }, []);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0, -0.04]} receiveShadow>
        <shapeGeometry args={[outer]} />
        <meshStandardMaterial map={outerMap} roughness={1} />
      </mesh>
      <mesh receiveShadow>
        <shapeGeometry args={[inner]} />
        <meshStandardMaterial map={innerMap} roughness={0.92} />
      </mesh>
    </group>
  );
}

// Quartier environnant : rizières, terre rouge, route, maisons, arbres, collines.
function Surroundings({ quality }) {
  const data = useMemo(() => {
    const rnd = seeded(404);
    const walls = [];
    const roofs = [];
    const flatRoofs = [];
    const windows = [];
    const dikes = [];
    const marks = [];
    const trees = [];
    const hills = [];
    const vehicles = [];

    const WALLS = ['#f0ede4', '#e9dcc3', '#e8c9b8', '#d9d4c8', '#f3e7b8', '#cfd8dc', '#e3b9a8'];
    const ROOFS = ['#a5483c', '#8f3f36', '#b4553f', '#4a7fb0', '#7c8288', '#9a4a3a'];

    // Maisons.
    let guard = 0;
    while (walls.length < quality.houses && guard++ < 4000) {
      const a = rnd() * Math.PI * 2;
      const r = 150 + Math.pow(rnd(), 1.4) * 470;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r * 0.85 + 20;
      if (isReserved(x, z, 10)) continue;
      const floors = 1 + Math.floor(rnd() * 3);
      const w = 10 + rnd() * 11;
      const d = 9 + rnd() * 8;
      const h = floors * 3;
      const ry = Math.floor(rnd() * 4) * (Math.PI / 2) + (rnd() - 0.5) * 0.5;
      walls.push({ p: [x, h / 2, z], s: [w, h, d], ry, c: WALLS[Math.floor(rnd() * WALLS.length)] });
      const rc = ROOFS[Math.floor(rnd() * ROOFS.length)];
      if (rnd() > 0.35) roofs.push({ p: [x, h + 1.1, z], s: [w + 1, 2.2, d + 1], ry, c: rc });
      else flatRoofs.push({ p: [x, h + 0.15, z], s: [w + 0.6, 0.3, d + 0.6], ry, c: rc });
      for (let f = 0; f < floors; f++) {
        windows.push({ p: [x, f * 3 + 1.7, z], s: [w * 0.72, 1.1, d + 0.08], ry });
        windows.push({ p: [x, f * 3 + 1.7, z], s: [w + 0.08, 1.1, d * 0.6], ry });
      }
    }

    // Diguettes des rizières.
    PADDIES.forEach((r) => {
      for (let x = r.minX; x <= r.maxX; x += 42 + rnd() * 26) {
        dikes.push({ p: [x, 0.12, (r.minZ + r.maxZ) / 2], s: [1.6, 0.4, r.maxZ - r.minZ] });
      }
      for (let z = r.minZ; z <= r.maxZ; z += 34 + rnd() * 22) {
        dikes.push({ p: [(r.minX + r.maxX) / 2, 0.12, z], s: [r.maxX - r.minX, 0.4, 1.6] });
      }
    });

    // Marquage et circulation sur la route.
    for (let x = -700; x < 700; x += 9) {
      marks.push({ p: [x, 0.03, ROAD_Z], s: [3.6, 0.01, 0.16] });
    }
    const CARS = ['#e9e9e6', '#c3c7cb', '#2a2d31', '#8e1f26', '#1f4a7a', '#d9a514'];
    for (let i = 0; i < 9; i++) {
      const lane = i % 2 ? 1 : -1;
      vehicles.push({
        x: -260 + i * 62 + rnd() * 25,
        z: ROAD_Z + lane * 2.1,
        heading: lane * (Math.PI / 2),
        color: CARS[Math.floor(rnd() * CARS.length)],
        kind: rnd() > 0.7 ? 'van' : 'car',
      });
    }

    // Arbres.
    guard = 0;
    while (trees.length < quality.outerTrees && guard++ < 4000) {
      const a = rnd() * Math.PI * 2;
      const r = 140 + rnd() * 420;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r * 0.85 + 20;
      if (isReserved(x, z, 5)) continue;
      trees.push({ x, z, k: 1.1 + rnd() * 1.1, seed: rnd() });
    }

    // Collines à l'horizon.
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + rnd() * 0.3;
      const r = 900 + rnd() * 350;
      const s = 260 + rnd() * 320;
      hills.push({ p: [Math.cos(a) * r, -18, Math.sin(a) * r], s: [s * 1.7, 70 + rnd() * 110, s] });
    }

    return { walls, roofs, flatRoofs, windows, dikes, marks, trees, hills, vehicles };
  }, [quality.houses, quality.outerTrees]);

  const road = { minX: -900, maxX: 900, minZ: ROAD_Z - 4.5, maxZ: ROAD_Z + 4.5 };
  const lane = { minX: GATE_X - 4.5, maxX: GATE_X + 4.5, minZ: BOUNDS.maxZ, maxZ: ROAD_Z - 4.5 };
  const forecourt = { minX: BOUNDS.minX - 8, maxX: 60, minZ: BOUNDS.maxZ + 0.3, maxZ: ROAD_Z - 7 };

  return (
    <group>
      {PADDIES.map((r, i) => (
        <Flat key={i} rect={r} y={0.03} texture={paddyTexture} tile={26} rough={0.12} metal={0.25} />
      ))}
      <Flat rect={forecourt} y={0.02} texture={earthTexture} tile={18} />
      <Flat rect={road} y={0.04} texture={asphaltTexture} tile={9} />
      <Flat rect={lane} y={0.05} texture={asphaltTexture} tile={9} />
      <Boxes items={data.dikes} color="#6a7a4a" rough={1} castShadow={false} />
      <Boxes items={data.marks} color="#ecebe4" castShadow={false} receiveShadow={false} />
      <Boxes items={data.walls} rough={0.9} castShadow={false} />
      <Boxes items={data.windows} color="#2a343d" rough={0.2} metal={0.5} castShadow={false} litAtNight />
      <Boxes items={data.roofs} shape="pyramid" rough={0.8} castShadow={false} />
      <Boxes items={data.flatRoofs} rough={0.8} castShadow={false} />
      <Boxes items={data.hills} shape="sphere" color="#5d7760" rough={1} castShadow={false} receiveShadow={false} />
      <Trees items={data.trees} castShadow={false} />
      <Vehicles list={data.vehicles} />
    </group>
  );
}

// Les deux états entre lesquels la scène évolue en douceur.
const DAY = {
  sun: new Color('#fff0d8'),
  sunIntensity: 3.5,
  sky: new Color('#dbe8ff'),
  ground: new Color('#8d8068'),
  ambient: 0.38,
  environment: 0.55,
  haze: new Color(FOG_COLOR),
  exposure: 0.92,
  rayleigh: 1.1,
  turbidity: 5.5,
  mie: 0.006,
};
const DUSK = {
  sun: new Color('#ff8438'),
  sunIntensity: 1.15,
  sky: new Color('#7a6fa8'),
  ground: new Color('#33262a'),
  ambient: 0.26,
  environment: 0.1,
  haze: new Color('#bd7650'),
  exposure: 0.8,
  rayleigh: 3.2,
  turbidity: 11,
  mie: 0.02,
};
// Soleil couchant : bas sur l'horizon, au nord, face à la vue d'arrivée. La lumière reste un peu
// plus haute que le disque visible pour garder des ombres lisibles.
const DUSK_LIGHT_DIRECTION = new Vector3(0.2, 0.17, -1).normalize();
const DUSK_SKY_DIRECTION = new Vector3(0.2, 0.035, -1).normalize();

const mix = (a, b, t) => a + (b - a) * t;
const _dir = new Vector3();

// Soleil, ciel et brume. Le jour, le soleil est haut et éclaire la scène ;
// quand on passe en mode nuit il descend jusqu'à l'horizon, le ciel vire à
// l'orangé, la lumière baisse et les éclairages du complexe prennent le relais.
// Tout est interpolé image par image : aucun changement brutal.
function Sun({ quality, night }) {
  const sun = useRef();
  const skyRef = useRef();
  const ambient = useRef();
  const frames = useRef(0);

  const mounted = useRef(false);

  useEffect(() => {
    dayNight.target = night ? 1 : 0;
    // À l'ouverture de la visite, on part directement de l'état demandé ;
    // ensuite, chaque bascule est animée.
    if (!mounted.current) {
      mounted.current = true;
      dayNight.progress = dayNight.target;
      dayNight.value = dayNight.target;
    }
  }, [night]);

  useFrame(({ gl, scene }, delta) => {
    const moving = stepDayNight(Math.min(delta, 0.05));
    const first = frames.current < 12;
    if (first) frames.current += 1;
    // Les ombres du décor sont fixes : on ne recalcule la carte d'ombres que
    // pendant les premières images, puis tant que le soleil se déplace.
    if (quality.shadows) {
      gl.shadowMap.autoUpdate = false;
      if (first || moving) gl.shadowMap.needsUpdate = true;
    }
    if (!first && !moving) return;

    const t = dayNight.value;
    _dir.copy(SUN_DIRECTION).lerp(DUSK_LIGHT_DIRECTION, t).normalize();
    sun.current.position.copy(_dir).multiplyScalar(320);
    sun.current.color.copy(DAY.sun).lerp(DUSK.sun, t);
    sun.current.intensity = mix(DAY.sunIntensity, DUSK.sunIntensity, t);

    ambient.current.color.copy(DAY.sky).lerp(DUSK.sky, t);
    ambient.current.groundColor.copy(DAY.ground).lerp(DUSK.ground, t);
    ambient.current.intensity = mix(DAY.ambient, DUSK.ambient, t);

    scene.environmentIntensity = mix(DAY.environment, DUSK.environment, t);
    scene.fog.color.copy(DAY.haze).lerp(DUSK.haze, t);
    scene.background.copy(scene.fog.color);
    gl.toneMappingExposure = mix(DAY.exposure, DUSK.exposure, t);

    const sky = skyRef.current?.material.uniforms;
    if (sky) {
      sky.sunPosition.value.copy(SUN_DIRECTION).lerp(DUSK_SKY_DIRECTION, t).normalize();
      sky.rayleigh.value = mix(DAY.rayleigh, DUSK.rayleigh, t);
      sky.turbidity.value = mix(DAY.turbidity, DUSK.turbidity, t);
      sky.mieCoefficient.value = mix(DAY.mie, DUSK.mie, t);
    }
    applyGlows();
  });

  return (
    <>
      <Sky
        ref={skyRef}
        distance={450000}
        sunPosition={SUN_DIRECTION.toArray()}
        turbidity={DAY.turbidity}
        rayleigh={DAY.rayleigh}
        mieCoefficient={DAY.mie}
        mieDirectionalG={0.82}
      />
      <hemisphereLight ref={ambient} args={['#dbe8ff', '#8d8068', DAY.ambient]} />
      <directionalLight
        ref={sun}
        position={SUN_DIRECTION.clone().multiplyScalar(320).toArray()}
        intensity={DAY.sunIntensity}
        color="#fff0d8"
        castShadow={quality.shadows}
        shadow-mapSize={[quality.shadowMap, quality.shadowMap]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.35}
      >
        <orthographicCamera attach="shadow-camera" args={[-210, 210, 190, -190, 40, 760]} />
      </directionalLight>
    </>
  );
}

// Ciel, brume, lumière, sol et quartier environnant.
export default function Environment({ quality, night }) {
  return (
    <>
      <color attach="background" args={[FOG_COLOR]} />
      <fog attach="fog" args={[FOG_COLOR, 320, 1500]} />
      <Sun quality={quality} night={night} />
      <Ground />
      <Surroundings quality={quality} />
    </>
  );
}
