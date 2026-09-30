import {
  BackSide,
  Color,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  PMREMGenerator,
  Scene,
  SphereGeometry,
  Vector3,
} from 'three';

// Direction du soleil (matinée, lumière chaude venant du sud-est) : elle
// éclaire les façades vues depuis l'entrée et allonge les ombres vers l'ouest.
export const SUN_DIRECTION = new Vector3(0.52, 0.62, 0.56).normalize();

export const FOG_COLOR = '#cfdceb';
export const NIGHT_COLOR = '#0a1220';

// Fabrique une carte d'environnement (ciel dégradé + soleil) sans aucun
// fichier HDR à télécharger. Elle donne les reflets des vitres, de l'eau et
// des carrosseries, et une lumière ambiante naturelle.
export function applySkyEnvironment(gl, scene) {
  const env = new Scene();
  const geo = new SphereGeometry(10, 48, 24);
  const top = new Color('#4f8fd8');
  const horizon = new Color('#eef4fa');
  const ground = new Color('#8a8172');
  const colors = [];
  const pos = geo.attributes.position;
  const c = new Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 10;
    if (y >= 0) c.copy(horizon).lerp(top, Math.pow(y, 0.5));
    else c.copy(horizon).lerp(ground, Math.min(1, -y * 5));
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
  env.add(new Mesh(geo, new MeshBasicMaterial({ vertexColors: true, side: BackSide })));

  const sun = new Mesh(new SphereGeometry(0.7, 16, 8), new MeshBasicMaterial({ color: new Color(14, 12.5, 10) }));
  sun.position.copy(SUN_DIRECTION).multiplyScalar(9);
  env.add(sun);

  const pmrem = new PMREMGenerator(gl);
  const target = pmrem.fromScene(env, 0.03);
  scene.environment = target.texture;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();
  geo.dispose();
}
