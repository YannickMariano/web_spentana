import { useMemo } from 'react';
import { BackSide } from 'three';
import Parts from './Parts';
import Water from './Water';
import { addRailing, createBuilder, METAL } from './builder';
import { poolLayout } from './layout';
import { deckTexture, poolTileTexture, tiled } from './textures';

const DECK_TOP = 0.16;

// Dalle de plage carrelée entre (x1, z1) et (x2, z2).
function DeckPiece({ x1, x2, z1, z2 }) {
  const w = x2 - x1;
  const d = z2 - z1;
  const map = useMemo(() => tiled(deckTexture(), Math.max(1, w / 2.4), Math.max(1, d / 2.4)), [w, d]);
  if (w <= 0.01 || d <= 0.01) return null;
  return (
    <mesh position={[(x1 + x2) / 2, DECK_TOP / 2, (z1 + z2) / 2]} receiveShadow>
      <boxGeometry args={[w, DECK_TOP, d]} />
      <meshStandardMaterial map={map} roughness={0.75} />
    </mesh>
  );
}

// Cuve carrelée (vue de l'intérieur) + eau animée.
function Basin({ x, z, l, w, depth, quality }) {
  const map = useMemo(() => tiled(poolTileTexture(), l / 3, w / 3), [l, w]);
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, DECK_TOP - depth / 2, 0]}>
        <boxGeometry args={[l, depth, w]} />
        <meshStandardMaterial map={map} side={BackSide} roughness={0.35} />
      </mesh>
      <group position={[0, DECK_TOP - 0.14, 0]}>
        <Water length={l} width={w} segments={quality.waterSegments} />
      </group>
    </group>
  );
}

// Piscine : grand bassin, pataugeoire, plages, margelles, garde-corps,
// échelles, chaise de surveillance, transats et parasols.
export default function SwimmingPool({ size, quality }) {
  const lay = useMemo(() => poolLayout(size), [size]);
  const { L, W, main, kids } = lay;

  const model = useMemo(() => {
    const b = createBuilder();
    // Margelles en pierre claire autour de chaque bassin.
    [main, kids].forEach((bs) => {
      const y = DECK_TOP + 0.03;
      const t = 0.32;
      b.add('coping', '#f3efe6', { p: [bs.x, y, bs.z - bs.w / 2 - t / 2], s: [bs.l + 2 * t, 0.08, t] });
      b.add('coping', '#f3efe6', { p: [bs.x, y, bs.z + bs.w / 2 + t / 2], s: [bs.l + 2 * t, 0.08, t] });
      b.add('coping', '#f3efe6', { p: [bs.x - bs.l / 2 - t / 2, y, bs.z], s: [t, 0.08, bs.w] });
      b.add('coping', '#f3efe6', { p: [bs.x + bs.l / 2 + t / 2, y, bs.z], s: [t, 0.08, bs.w] });
    });
    // Garde-corps de sécurité tout autour des plages (accès laissé libre côté +Z).
    addRailing(b, 0, DECK_TOP, -W / 2 + 0.1, L, '#e9edf0');
    addRailing(b, -L / 4 - 1, DECK_TOP, W / 2 - 0.1, L / 2 - 2, '#e9edf0');
    addRailing(b, L / 4 + 1, DECK_TOP, W / 2 - 0.1, L / 2 - 2, '#e9edf0');
    addRailing(b, -L / 2 + 0.1, DECK_TOP, 0, W, '#e9edf0', 'z');
    addRailing(b, L / 2 - 0.1, DECK_TOP, 0, W, '#e9edf0', 'z');

    // Échelles chromées.
    [-1, 1].forEach((sx) => {
      const x = main.x + sx * (main.l / 2 - 1.2);
      const z = main.w / 2 + 0.1;
      [-0.25, 0.25].forEach((o) => {
        b.add('chrome', '#dfe5ea', { p: [x + o, DECK_TOP + 0.1, z], s: [0.05, 1.5, 0.05] }, { rough: 0.2, metal: 0.9 });
      });
      b.add('chrome', '#dfe5ea', { p: [x, DECK_TOP + 0.85, z], s: [0.55, 0.05, 0.05] }, { rough: 0.2, metal: 0.9 });
    });

    // Chaise haute du maître-nageur.
    const cx = main.x;
    const cz = -main.w / 2 - 1.6;
    [-0.35, 0.35].forEach((ox) => {
      [-0.35, 0.35].forEach((oz) => {
        b.add('white', '#f4f4f2', { p: [cx + ox, DECK_TOP + 0.9, cz + oz], s: [0.07, 1.8, 0.07] });
      });
    });
    b.add('white', '#f4f4f2', { p: [cx, DECK_TOP + 1.8, cz], s: [0.85, 0.08, 0.85] });
    b.add('white', '#f4f4f2', { p: [cx, DECK_TOP + 2.25, cz - 0.4], s: [0.85, 0.85, 0.06] });

    // Transats et parasols sur la plage côté +Z.
    const count = Math.max(3, Math.floor(main.l / 4.5));
    for (let i = 0; i < count; i++) {
      const x = main.x - main.l / 2 + (main.l * (i + 0.5)) / count;
      const z = main.w / 2 + (W / 2 - main.w / 2) * 0.55;
      b.add('white', '#f4f4f2', { p: [x - 0.6, DECK_TOP + 0.3, z], s: [0.65, 0.09, 1.9] });
      b.add('white', '#f4f4f2', { p: [x - 0.6, DECK_TOP + 0.55, z + 0.78], s: [0.65, 0.09, 0.75], rx: -0.9 });
      b.add('white', '#f4f4f2', { p: [x - 0.6, DECK_TOP + 0.15, z], s: [0.55, 0.3, 1.5] });
      if (i % 2 === 0) {
        b.add('pole', '#dfe5ea', { p: [x + 0.5, DECK_TOP + 1.15, z], s: [0.06, 2.3, 0.06] }, METAL);
        b.add(
          'parasol',
          i % 4 === 0 ? '#2c85c8' : '#f4f4f2',
          { p: [x + 0.5, DECK_TOP + 2.35, z], s: [2.6, 0.55, 2.6] },
          { shape: 'pyramid' },
        );
      }
    }
    return b.result();
  }, [L, W, main, kids]);

  const hl = L / 2;
  const hw = W / 2;
  const mainX1 = main.x - main.l / 2;
  const mainX2 = main.x + main.l / 2;
  const kidsX1 = kids.x - kids.l / 2;
  const kidsX2 = kids.x + kids.l / 2;

  return (
    <group>
      {/* Plages : deux bandes longues puis les pièces entre et autour des bassins. */}
      <DeckPiece x1={-hl} x2={hl} z1={-hw} z2={-main.w / 2} />
      <DeckPiece x1={-hl} x2={hl} z1={main.w / 2} z2={hw} />
      <DeckPiece x1={mainX2} x2={hl} z1={-main.w / 2} z2={main.w / 2} />
      <DeckPiece x1={-hl} x2={kidsX1} z1={-main.w / 2} z2={main.w / 2} />
      <DeckPiece x1={kidsX2} x2={mainX1} z1={-main.w / 2} z2={main.w / 2} />
      <DeckPiece x1={kidsX1} x2={kidsX2} z1={-main.w / 2} z2={-kids.w / 2} />
      <DeckPiece x1={kidsX1} x2={kidsX2} z1={kids.w / 2} z2={main.w / 2} />

      <Basin {...main} depth={lay.depth} quality={quality} />
      <Basin {...kids} depth={0.7} quality={quality} />
      <Parts model={model} />
    </group>
  );
}
