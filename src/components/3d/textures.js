// Textures procédurales (dessinées sur <canvas>) : aucune image à télécharger,
// donc un chargement quasi instantané. Chaque texture est mise en cache.
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

const cache = new Map();

function cached(key, make) {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
}

function createCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(2, Math.round(w));
  c.height = Math.max(2, Math.round(h));
  return [c, c.getContext('2d')];
}

// Générateur pseudo-aléatoire déterministe (même rendu à chaque visite).
export function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function speckle(ctx, w, h, count, alpha, seed = 7) {
  const rnd = seeded(seed);
  for (let i = 0; i < count; i++) {
    const light = rnd() > 0.5;
    ctx.fillStyle = `rgba(${light ? '255,255,255' : '0,0,0'},${rnd() * alpha})`;
    const s = 1 + rnd() * 2;
    ctx.fillRect(rnd() * w, rnd() * h, s, s);
  }
}

function toTexture(canvas, { repeat = false } = {}) {
  const t = new CanvasTexture(canvas);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = RepeatWrapping;
  return t;
}

// Copie d'une texture répétable avec son propre nombre de répétitions.
export function tiled(texture, rx, ry) {
  const t = texture.clone();
  t.repeat.set(rx, ry);
  t.needsUpdate = true;
  return t;
}

// --- Surfaces répétables --------------------------------------------------

function flat(key, base, { size = 256, count = 5000, alpha = 0.1, seed = 3, draw } = {}) {
  return cached(key, () => {
    const [c, ctx] = createCanvas(size, size);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);
    if (draw) draw(ctx, size);
    speckle(ctx, size, size, count, alpha, seed);
    return toTexture(c, { repeat: true });
  });
}

export const paversTexture = () =>
  flat('pavers', '#8f9193', {
    alpha: 0.08,
    draw(ctx, s) {
      const rnd = seeded(11);
      const bw = s / 8;
      const bh = s / 16;
      for (let row = 0; row < 16; row++) {
        for (let col = -1; col < 8; col++) {
          const x = col * bw + (row % 2 ? bw / 2 : 0);
          const v = 128 + Math.floor(rnd() * 34);
          ctx.fillStyle = `rgb(${v},${v + 1},${v + 3})`;
          ctx.fillRect(x + 1, row * bh + 1, bw - 2, bh - 2);
        }
      }
    },
  });

export const asphaltTexture = () => flat('asphalt', '#414346', { count: 9000, alpha: 0.12 });
export const earthTexture = () => flat('earth', '#a5603f', { count: 9000, alpha: 0.14, seed: 5 });
export const sandTexture = () => flat('sand', '#cbb68d', { count: 9000, alpha: 0.13, seed: 9 });
export const lawnTexture = () => flat('lawn', '#5d8a43', { count: 12000, alpha: 0.16, seed: 13 });
export const concreteTexture = () => flat('concrete', '#c9c8c3', { count: 6000, alpha: 0.07 });

export const meadowTexture = () =>
  flat('meadow', '#7f8c5e', {
    size: 512,
    count: 26000,
    alpha: 0.16,
    seed: 21,
    draw(ctx, s) {
      const rnd = seeded(23);
      for (let i = 0; i < 46; i++) {
        const r = 30 + rnd() * 90;
        const x = rnd() * s;
        const y = rnd() * s;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        const tone = rnd() > 0.5 ? '160,112,74' : '84,112,66';
        g.addColorStop(0, `rgba(${tone},0.32)`);
        g.addColorStop(1, `rgba(${tone},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
    },
  });

function gridTexture(key, base, line, cells, lineWidth = 2) {
  return flat(key, base, {
    count: 2500,
    alpha: 0.05,
    draw(ctx, s) {
      ctx.strokeStyle = line;
      ctx.lineWidth = lineWidth;
      const step = s / cells;
      for (let i = 0; i <= cells; i++) {
        ctx.beginPath();
        ctx.moveTo(i * step, 0);
        ctx.lineTo(i * step, s);
        ctx.moveTo(0, i * step);
        ctx.lineTo(s, i * step);
        ctx.stroke();
      }
    },
  });
}

export const deckTexture = () => gridTexture('deck', '#ded3be', 'rgba(150,135,110,0.55)', 4);
export const poolTileTexture = () => gridTexture('pooltile', '#8fdcef', 'rgba(255,255,255,0.7)', 8);
export const floorTileTexture = () => gridTexture('floortile', '#b9ada0', 'rgba(90,80,70,0.5)', 4);

// Tôle ondulée : dégradés clairs/foncés, teintée par la couleur du matériau.
export const roofTexture = () =>
  cached('roof', () => {
    const [c, ctx] = createCanvas(64, 64);
    const g = ctx.createLinearGradient(0, 0, 64, 0);
    g.addColorStop(0, '#d2d2d2');
    g.addColorStop(0.5, '#ffffff');
    g.addColorStop(1, '#c6c6c6');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return toTexture(c, { repeat: true });
  });

// Maille de filet / grillage (fond transparent).
export const netTexture = () =>
  cached('net', () => {
    const [c, ctx] = createCanvas(64, 64);
    ctx.clearRect(0, 0, 64, 64);
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, 64, 64);
    return toTexture(c, { repeat: true });
  });

// Rizières inondées : eau boueuse et rangs de jeunes pousses.
export const paddyTexture = () =>
  flat('paddy', '#6d7f86', {
    count: 5000,
    alpha: 0.1,
    draw(ctx, s) {
      const rnd = seeded(31);
      for (let y = 6; y < s; y += 12) {
        for (let x = 4; x < s; x += 9) {
          if (rnd() > 0.35) {
            ctx.fillStyle = `rgba(${70 + rnd() * 40},${130 + rnd() * 50},70,0.75)`;
            ctx.fillRect(x + rnd() * 3, y + rnd() * 3, 3, 4);
          }
        }
      }
    },
  });

// --- Terrains de sport (une texture par terrain, non répétée) --------------

// Terrain de football : `length` × `width` en mètres, grand axe le long de X.
export function footballTexture(length, width, variant) {
  return cached(`foot:${length.toFixed(1)}:${width.toFixed(1)}:${variant}`, () => {
    const k = 1024 / length;
    const W = 1024;
    const H = Math.round(width * k);
    const [c, ctx] = createCanvas(W, H);
    const big = variant === 'foot9';
    const bands = big ? 16 : 12;
    for (let i = 0; i < bands; i++) {
      ctx.fillStyle = i % 2 ? '#2a7337' : '#348a41';
      ctx.fillRect((i * W) / bands, 0, W / bands + 1, H);
    }
    speckle(ctx, W, H, 26000, 0.09, 41);

    const m = 1.6 * k; // marge entre le bord du gazon et la ligne de touche
    const pw = W - 2 * m;
    const ph = H - 2 * m;
    ctx.strokeStyle = 'rgba(255,255,255,0.93)';
    ctx.fillStyle = 'rgba(255,255,255,0.93)';
    ctx.lineWidth = Math.max(2.5, 0.13 * k);
    ctx.strokeRect(m, m, pw, ph);
    ctx.beginPath();
    ctx.moveTo(W / 2, m);
    ctx.lineTo(W / 2, H - m);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, (big ? 6 : 4.5) * k, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 0.22 * k, 0, Math.PI * 2);
    ctx.fill();

    const boxDepth = (big ? 10 : 8) * k;
    const boxWidth = Math.min(ph - 3 * k, (big ? 22 : 16) * k);
    const areaDepth = (big ? 4 : 3) * k;
    const areaWidth = Math.min(boxWidth - 2 * k, (big ? 11 : 8) * k);
    const spot = (big ? 7.5 : 6) * k;
    [0, 1].forEach((side) => {
      const x0 = side ? W - m : m;
      const dir = side ? -1 : 1;
      ctx.strokeRect(side ? x0 - boxDepth : x0, H / 2 - boxWidth / 2, boxDepth, boxWidth);
      ctx.strokeRect(side ? x0 - areaDepth : x0, H / 2 - areaWidth / 2, areaDepth, areaWidth);
      ctx.beginPath();
      ctx.arc(x0 + dir * spot, H / 2, 0.22 * k, 0, Math.PI * 2);
      ctx.fill();
      // Arc de cercle à l'entrée de la surface.
      const a = Math.acos((boxDepth - spot) / (4.2 * k));
      ctx.beginPath();
      if (side) ctx.arc(x0 + dir * spot, H / 2, 4.2 * k, Math.PI - a, Math.PI + a);
      else ctx.arc(x0 + dir * spot, H / 2, 4.2 * k, -a, a);
      ctx.stroke();
    });
    return toTexture(c);
  });
}

const BASKET_PALETTES = {
  // Terrain rouge et jaune, raquettes vertes, logo central.
  red: { apron: '#e0b11e', court: '#b52a30', key: '#2f7f5b', circle: '#e0b11e', center: '#2f7f5b' },
  // Terrain en dalles vertes, pourtour bleu, raquettes rouges.
  green: { apron: '#4468c8', court: '#2fa577', key: '#e22d33', circle: '#2fa577', center: '#a3202b' },
};

// Terrain de basket : dalle de `length` × `width` m ; le terrain peint
// (`courtLength` × `courtWidth`) est centré dessus.
export function basketTexture(length, width, courtLength, courtWidth, variant) {
  return cached(`basket:${length.toFixed(1)}:${width.toFixed(1)}:${variant}`, () => {
    const pal = BASKET_PALETTES[variant] ?? BASKET_PALETTES.red;
    const k = 1024 / length;
    const W = 1024;
    const H = Math.round(width * k);
    const [c, ctx] = createCanvas(W, H);
    ctx.fillStyle = pal.apron;
    ctx.fillRect(0, 0, W, H);

    // On dessine ensuite en "mètres de terrain réglementaire" (28 × 15).
    ctx.save();
    ctx.translate(W / 2 - (courtLength * k) / 2, H / 2 - (courtWidth * k) / 2);
    ctx.scale((courtLength * k) / 28, (courtWidth * k) / 15);
    ctx.fillStyle = pal.court;
    ctx.fillRect(0, 0, 28, 15);
    ctx.lineWidth = 0.09;
    ctx.strokeStyle = '#ffffff';

    [0, 1].forEach((side) => {
      ctx.save();
      if (side) {
        ctx.translate(28, 15);
        ctx.rotate(Math.PI);
      }
      // Demi-cercle des lancers francs puis raquette.
      ctx.fillStyle = pal.circle;
      ctx.beginPath();
      ctx.arc(5.8, 7.5, 1.8, -Math.PI / 2, Math.PI / 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = pal.key;
      ctx.fillRect(0, 5.05, 5.8, 4.9);
      ctx.strokeRect(0, 5.05, 5.8, 4.9);
      // Demi-cercle sous le panier.
      ctx.beginPath();
      ctx.arc(1.575, 7.5, 1.25, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      // Ligne à trois points.
      ctx.beginPath();
      ctx.moveTo(0, 0.9);
      ctx.lineTo(2.99, 0.9);
      ctx.arc(1.575, 7.5, 6.75, -1.357, 1.357);
      ctx.lineTo(0, 14.1);
      ctx.stroke();
      ctx.restore();
    });

    ctx.strokeRect(0, 0, 28, 15);
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(14, 15);
    ctx.stroke();
    ctx.fillStyle = pal.center;
    ctx.beginPath();
    ctx.arc(14, 7.5, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (variant === 'red') {
      ctx.fillStyle = '#f4e7b0';
      ctx.beginPath();
      ctx.arc(14, 7.5, 1.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = pal.center;
      ctx.font = '700 2.1px Sora, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('S', 14, 7.62);
    }
    ctx.restore();

    speckle(ctx, W, H, 9000, 0.06, 51);
    return toTexture(c);
  });
}

// --- Enseignes -------------------------------------------------------------

// Panneau texte (enseigne de bâtiment). `ratio` = largeur / hauteur.
export function signTexture(text, { bg = '#ffffff', color = '#14528c', ratio = 6, border } = {}) {
  return cached(`sign:${text}:${bg}:${color}:${ratio}`, () => {
    const H = 128;
    const W = Math.round(H * ratio);
    const [c, ctx] = createCanvas(W, H);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    if (border) {
      ctx.strokeStyle = border;
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, W - 8, H - 8);
    }
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let size = 78;
    do {
      ctx.font = `700 ${size}px Sora, Arial, sans-serif`;
      size -= 4;
    } while (ctx.measureText(text).width > W - 48 && size > 18);
    ctx.fillText(text, W / 2, H / 2 + 4);
    return toTexture(c);
  });
}
