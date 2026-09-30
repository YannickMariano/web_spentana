// Passage progressif du jour au soir. Un seul nombre pilote toute la scène :
// `dayNight.value` va de 0 (plein jour) à 1 (coucher de soleil, lumières
// allumées). Il est animé image par image (voir Environment.jsx), jamais
// basculé d'un coup.
export const dayNight = {
  target: 0, // état demandé par l'interrupteur : 0 = jour, 1 = soir
  progress: 0, // avancement linéaire de la transition
  value: 0, // avancement adouci (départ et arrivée en douceur)
};

// Durée de la transition, en secondes.
export const TRANSITION_SECONDS = 6;

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Les lumières artificielles ne s'allument que lorsque le soleil est déjà bas.
export const lightsLevel = () => smooth(0.4, 1, dayNight.value);

// Fait avancer la transition de `dt` secondes. Renvoie vrai si elle a bougé.
export function stepDayNight(dt) {
  const d = dayNight;
  if (d.progress === d.target) return false;
  const step = dt / TRANSITION_SECONDS;
  d.progress = d.target > d.progress ? Math.min(d.target, d.progress + step) : Math.max(d.target, d.progress - step);
  d.value = smooth(0, 1, d.progress);
  return true;
}

// --- Matériaux lumineux (fenêtres, projecteurs, lampadaires) ---------------
const glows = new Set();

// Inscrit un matériau à éclairer le soir. `lit` : vitrage qui s'allume de
// l'intérieur ; sinon, source déjà lumineuse le jour, qui brille davantage.
export function registerGlow(material, { lit, intensity }) {
  const entry = { material, lit, intensity };
  glows.add(entry);
  return () => glows.delete(entry);
}

export function applyGlows() {
  const k = lightsLevel();
  glows.forEach(({ material, lit, intensity }) => {
    material.emissiveIntensity = lit ? 0.85 * k : intensity * (1 + 2.5 * k);
  });
}
