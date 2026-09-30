// État partagé entre la scène 3D et l'interface, lu à chaque image sans
// passer par React (aucun re-rendu) : joystick, position du visiteur, hotspots.
export const visitState = {
  // Joystick tactile : x = latéral, y = avant/arrière, entre -1 et 1.
  move: { x: 0, y: 0 },
  // Position et cap de la caméra, pour la mini-carte.
  camera: { x: 0, z: 0, yaw: 0 },
  mode: 'intro',
  // Éléments DOM des hotspots, par identifiant d'infrastructure.
  hotspots: {},
  // Vrai quand une fiche est ouverte : les hotspots restent en pastilles.
  compact: false,
};
