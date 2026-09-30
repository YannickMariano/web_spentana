// Configuration de la VISITE 3D du complexe.
//
// Tout ce qui positionne la scène se règle ICI, sans toucher aux composants 3D :
// emplacement, taille, rotation, nom, description, tarif et caméra de chaque
// infrastructure.
//
// Les positions sont saisies en PIXELS DU PLAN (image du plan ramenée à
// 2000 px de large) puis converties en mètres. Pour déplacer un élément, il
// suffit donc de relire ses coordonnées sur le plan : `place(x1, y1, x2, y2)`
// = coin haut-gauche et coin bas-droit du rectangle sur le plan.
//
// Repère 3D :  X = largeur du complexe (gauche → droite du plan)
//              Z = profondeur (haut → bas du plan)
//              Y = hauteur
import { infra } from './infra';

// 1 pixel du plan = 0,15 m (un Foot à 7 du plan mesure alors ≈ 25 × 40 m).
export const PLAN_SCALE = 0.15;
// Point du plan placé à l'origine (0, 0, 0) de la scène.
export const PLAN_ORIGIN = [1000, 780];

export const toWorld = (px, py) => [
  (px - PLAN_ORIGIN[0]) * PLAN_SCALE,
  (py - PLAN_ORIGIN[1]) * PLAN_SCALE,
];

// Rectangle du plan → position (centre) et emprise au sol en mètres.
export function place(x1, y1, x2, y2) {
  const [ax, az] = toWorld(x1, y1);
  const [bx, bz] = toWorld(x2, y2);
  return {
    plan: [x1, y1, x2, y2],
    position: [(ax + bx) / 2, 0, (az + bz) / 2],
    size: [bx - ax, bz - az],
  };
}

// Caméra par défaut d'une infrastructure, reculée en fonction de sa taille.
// Peut être remplacée par `cameraPosition` / `cameraTarget` dans sa fiche.
//  - terrains, piscine… : vue plongeante depuis le sud-ouest ;
//  - bâtiments (`facing`) : vue plus basse, placée devant la façade.
const FRONT = { south: [0, 1], north: [0, -1], west: [-1, 0], east: [1, 0] };

function defaultCamera({ position, size, facing }) {
  const reach = Math.max(size[0], size[1]);
  const [x, , z] = position;
  if (facing) {
    const [fx, fz] = FRONT[facing];
    const back = reach * 0.85 + 12;
    const side = reach * 0.3;
    return {
      cameraPosition: [x + fx * back - fz * side, reach * 0.3 + 8, z + fz * back + fx * side],
      cameraTarget: [x, 3, z],
    };
  }
  return {
    cameraPosition: [x - reach * 0.45, reach * 0.62 + 9, z + reach * 0.85 + 8],
    cameraTarget: [x, 1.5, z],
  };
}

const TARIF_DEFAUT = 'Tarif sur demande';

// Limite du terrain (mur d'enceinte), dans le sens horaire, en pixels du plan.
export const BOUNDARY_PLAN = [
  [462, 97],
  [1535, 95],
  [1535, 695],
  [1881, 712],
  [1883, 1217],
  [837, 1272],
  [836, 1447],
  [133, 1447],
  [135, 423],
  [440, 394],
];
export const BOUNDARY = BOUNDARY_PLAN.map(([x, y]) => toWorld(x, y));

// Entrée principale ("Porte" sur le plan) : ouverture dans le mur sud.
export const GATE = {
  plan: [196, 1447, 283, 1447],
  from: toWorld(196, 1447),
  to: toWorld(283, 1447),
};

// ---------------------------------------------------------------------------
// INFRASTRUCTURES PRINCIPALES (chacune a son hotspot et sa fiche)
// ---------------------------------------------------------------------------
// Champs :
//   id, name, short      identifiant, nom complet, nom court du hotspot
//   type                 composant 3D utilisé (football, basket, piscine, …)
//   variant / facing     variante visuelle / côté vers lequel regarde la façade
//   category, icon       catégorie et icône (nom défini dans src/components/ui/Icon.jsx)
//   infraId              lien vers src/data/infra.js (tarifs, capacité, horaires)
//   price                tarif forcé (sinon celui de infra.js, sinon "Tarif sur demande") ;
//                        `price: null` = aucune rubrique tarif pour cette infrastructure
//   description          texte de la fiche
//   rotation             rotation supplémentaire [x, y, z] en radians
//   hotspotHeight        hauteur du hotspot au-dessus du sol (m)
//   cameraPosition / cameraTarget   point de vue lors du clic sur "VOIR"
const RAW_FACILITIES = [
  {
    id: 'football7-1',
    name: 'Foot à 7 — Terrain 1',
    short: 'Foot à 7 · T1',
    type: 'football',
    variant: 'foot7',
    category: 'Football · gazon synthétique',
    icon: 'football',
    infraId: 'foot-7',
    description: 'Terrain nord, en gazon synthétique, avec sa tribune couverte en bout de terrain.',
    ...place(516, 215, 685, 485),
    hotspotHeight: 9,
  },
  {
    id: 'football7-2',
    name: 'Foot à 7 — Terrain 2',
    short: 'Foot à 7 · T2',
    type: 'football',
    variant: 'foot7',
    category: 'Football · gazon synthétique',
    icon: 'football',
    infraId: 'foot-7',
    description: 'Terrain ouest, bordé par sa tribune latérale, à côté du billard et de la pétanque.',
    ...place(437, 707, 582, 938),
    hotspotHeight: 9,
  },
  {
    id: 'football7-3',
    name: 'Foot à 7 — Terrain 3',
    short: 'Foot à 7 · T3',
    type: 'football',
    variant: 'foot7',
    category: 'Football · gazon synthétique',
    icon: 'football',
    infraId: 'foot-7',
    description: "Terrain sud, le premier que l'on découvre en entrant dans le complexe.",
    ...place(383, 1190, 614, 1335),
    hotspotHeight: 9,
    // Vue depuis le nord-ouest : la tribune (au sud) reste face à la caméra.
    cameraPosition: [toWorld(330, 0)[0], 26, toWorld(0, 1010)[1]],
    cameraTarget: [toWorld(498, 0)[0], 1.5, toWorld(0, 1275)[1]],
  },
  {
    id: 'football9',
    name: 'Foot à 9',
    short: 'Foot à 9',
    type: 'football',
    variant: 'foot9',
    category: 'Football · grand terrain',
    icon: 'football',
    infraId: 'foot-9',
    description: 'Le grand terrain du complexe, avec ses deux tribunes et ses bancs de touche.',
    ...place(1408, 855, 1807, 1069),
    hotspotHeight: 11,
  },
  {
    id: 'basket-1',
    name: 'Basket — Terrain 1',
    short: 'Basket · T1',
    type: 'basket',
    variant: 'green',
    category: 'Basket · Volley',
    icon: 'basketball',
    infraId: 'basket-volley',
    description: 'Surface en dalles vertes et bleues, raquettes rouges.',
    ...place(830, 432, 1125, 531),
    hotspotHeight: 8,
  },
  {
    id: 'basket-2',
    name: 'Basket — Terrain 2',
    short: 'Basket · T2',
    type: 'basket',
    variant: 'red',
    category: 'Basket · Volley',
    icon: 'basketball',
    infraId: 'basket-volley',
    description: 'Surface rouge et jaune aux couleurs de Spentana, logo au centre.',
    ...place(830, 550, 1125, 650),
    hotspotHeight: 8,
  },
  {
    id: 'piscine',
    name: 'Piscine',
    short: 'Piscine',
    type: 'piscine',
    category: 'Natation',
    icon: 'pool',
    infraId: 'piscine',
    description: 'Grand bassin et pataugeoire surveillée, entourés de plages carrelées.',
    ...place(1170, 432, 1282, 657),
    hotspotHeight: 7,
  },
  {
    id: 'restaurant',
    price: null,
    name: 'Restaurant',
    short: 'Restaurant',
    type: 'restaurant',
    variant: 'resto',
    facing: 'west',
    category: 'Restauration',
    icon: 'restaurant',
    description: 'Salle et terrasse couverte, au cœur du complexe.',
    ...place(816, 1098, 980, 1209),
    hotspotHeight: 9,
  },
  {
    id: 'gargotte',
    price: null,
    name: 'Gargotte',
    short: 'Gargotte',
    type: 'restaurant',
    variant: 'gargotte',
    facing: 'south',
    category: 'Restauration rapide',
    icon: 'coffee',
    description: 'Comptoir et quelques tables, juste à côté des terrains de basket.',
    ...place(836, 667, 915, 741),
    hotspotHeight: 7,
  },
  {
    id: 'bureaux',
    price: null,
    name: 'Bureaux',
    short: 'Bureaux',
    type: 'building',
    variant: 'bureau',
    // Façade principale tournée vers l'est (à l'opposé du Foot à 7 — Terrain 2).
    facing: 'east',
    category: 'Accueil · Réservation',
    icon: 'building',
    description:
      "Le bâtiment principal : accueil, réservation, bureau des coachs et de la logistique.",
    ...place(842, 838, 1065, 1026),
    hotspotHeight: 15,
  },
  {
    id: 'ecole',
    price: null,
    name: 'Établissement scolaire',
    short: 'École',
    type: 'building',
    variant: 'ecole',
    facing: 'south',
    category: 'Enseignement',
    icon: 'school',
    description: 'Bâtiment scolaire sur deux niveaux, avec coursive donnant sur les terrains de basket.',
    ...place(770, 294, 1125, 405),
    hotspotHeight: 12,
  },
  {
    id: 'taninketsa',
    price: null,
    name: 'Taninketsa Academy',
    short: 'Taninketsa Academy',
    type: 'building',
    variant: 'taninketsa',
    facing: 'west',
    category: 'Centre de formation',
    icon: 'graduation',
    description: 'Centre de formation pour jeunes talents : internat, cantine et salles d’étude.',
    link: { to: '/taninketsa', label: 'Découvrir Taninketsa' },
    ...place(1341, 330, 1483, 690),
    hotspotHeight: 13,
  },
  {
    id: 'billard',
    name: 'Billard',
    short: 'Billard',
    type: 'billard',
    facing: 'south',
    category: 'Loisirs · en salle',
    icon: 'billiard',
    infraId: 'billard',
    description: 'Salle de billard avec deux tables. Entrez : la porte est ouverte.',
    ...place(514, 947, 583, 977),
    hotspotHeight: 12,
    // Vue à hauteur d'homme, depuis le parking, à travers la façade vitrée.
    cameraPosition: [toWorld(556, 0)[0], 2.3, toWorld(0, 1046)[1]],
    cameraTarget: [toWorld(562, 0)[0], 1.2, toWorld(0, 962)[1]],
  },
  {
    id: 'petanque',
    name: 'Pétanque',
    short: 'Pétanque',
    type: 'petanque',
    category: 'Loisirs',
    icon: 'petanque',
    infraId: 'petanque',
    description: 'Piste en sable stabilisé, bordée de traverses en bois.',
    ...place(437, 946, 498, 965),
    hotspotHeight: 5,
  },
];

const infraById = Object.fromEntries(infra.map((i) => [i.id, i]));

export const facilities = RAW_FACILITIES.map((f) => {
  const source = f.infraId ? infraById[f.infraId] : null;
  return {
    rotation: [0, 0, 0],
    ...defaultCamera(f),
    ...f,
    price: f.price === null ? null : (f.price ?? source?.tarif ?? TARIF_DEFAUT),
    capacity: f.capacity ?? source?.capacite ?? null,
    hours: f.hours ?? source?.horaire ?? null,
    rates: source?.rates ?? null,
  };
});

export const facilityById = Object.fromEntries(facilities.map((f) => [f.id, f]));

// ---------------------------------------------------------------------------
// ÉLÉMENTS SECONDAIRES (décor : pas de hotspot)
// ---------------------------------------------------------------------------
// `facing` d'une tribune = direction vers laquelle regardent les spectateurs.
export const grandstands = [
  { id: 'gradin-f7-1', facing: 'south', ...place(516, 158, 686, 200) },
  { id: 'gradin-basket', facing: 'north', ...place(931, 668, 1124, 692) },
  { id: 'gradin-f7-2', facing: 'east', ...place(390, 707, 426, 937) },
  { id: 'gradin-f9-ouest', facing: 'east', ...place(1369, 856, 1396, 1070) },
  { id: 'gradin-f9-nord', facing: 'south', ...place(1408, 822, 1623, 848) },
  { id: 'gradin-f7-3', facing: 'north', ...place(383, 1346, 613, 1382) },
  { id: 'gradin-est', facing: 'west', ...place(703, 1190, 757, 1337) },
];

export const parkings = [
  { id: 'parking-ouest', kind: 'car', ...place(149, 743, 314, 998) },
  { id: 'parking-f7-2', kind: 'car', ...place(596, 706, 648, 976) },
  { id: 'parking-billard', kind: 'car', ...place(334, 982, 586, 1030) },
  { id: 'parking-bureau-o', kind: 'car', ...place(765, 841, 830, 1027) },
  { id: 'parking-bureau-e', kind: 'car', ...place(1082, 842, 1168, 1075) },
  { id: 'parking-f9', kind: 'car', ...place(1284, 853, 1361, 1073) },
  { id: 'parking-f7-3', kind: 'car', ...place(328, 1136, 613, 1182) },
  { id: 'parking-moto-nord', kind: 'moto', ...place(516, 492, 685, 528) },
  { id: 'parking-moto-sud', kind: 'moto', ...place(330, 1193, 372, 1382) },
];

// Zones laissées sans véhicule (accès dégagés), en mètres : { center: [x, z], radius }.
export const noParkingZones = [
  // Devant la porte de la salle de billard.
  { center: toWorld(548, 1005), radius: 7 },
];

export const toilets = [
  { id: 'toilettes-nord', facing: 'south', ...place(305, 480, 416, 525) },
  { id: 'toilettes-sud', facing: 'west', ...place(703, 1348, 757, 1385) },
];

// Espaces verts (pelouse, arbres, arbustes, bancs) dans les zones libres du plan.
export const gardens = [
  { id: 'jardin-nord-ouest', ...place(150, 545, 292, 700) },
  { id: 'jardin-nord', ...place(730, 118, 1515, 222) },
  { id: 'jardin-est', ...place(1560, 728, 1868, 798) },
  { id: 'jardin-sud', ...place(1010, 1118, 1860, 1196) },
  { id: 'jardin-entree', ...place(143, 1030, 186, 1395) },
  { id: 'jardin-taninketsa', ...place(1492, 330, 1527, 690) },
];

// ---------------------------------------------------------------------------
// CAMÉRAS
// ---------------------------------------------------------------------------
export const OVERVIEW_CAMERA = {
  position: [-70, 150, 205],
  target: [2, 0, 8],
};

const [gateX, gateZ] = toWorld(240, 1447);

// Point d'arrivée du visiteur : juste après le portail, regard vers le complexe.
export const ENTRANCE = {
  // Départ de la séquence d'introduction : devant le portail, côté rue.
  introPosition: [gateX - 6, 5, gateZ + 34],
  introTarget: [gateX + 10, 4, gateZ - 30],
  // Position du visiteur en visite libre (hauteur des yeux).
  walkPosition: [gateX, 1.7, gateZ - 7],
  walkTarget: [gateX + 28, 1.7, gateZ - 40],
};

// Points de vue prédéfinis de la barre du bas. `facilityId` réutilise la
// caméra de l'infrastructure ; sinon `position` / `target` explicites.
export const cameraPresets = [
  { id: 'general', label: 'Vue générale', ...OVERVIEW_CAMERA },
  {
    id: 'entree',
    label: 'Entrée',
    position: [gateX - 14, 16, gateZ + 30],
    target: [gateX + 6, 2, gateZ - 14],
  },
  { id: 'football', label: 'Football', facilityId: 'football9' },
  {
    id: 'basket',
    label: 'Basket',
    position: [toWorld(930, 0)[0], 40, toWorld(0, 800)[1]],
    target: [toWorld(978, 0)[0], 0, toWorld(0, 545)[1]],
  },
  { id: 'piscine', label: 'Piscine', facilityId: 'piscine' },
  { id: 'batiment', label: 'Bâtiment principal', facilityId: 'bureaux' },
  { id: 'billard', label: 'Billard', facilityId: 'billard' },
  { id: 'restaurant', label: 'Restaurant', facilityId: 'restaurant' },
];
