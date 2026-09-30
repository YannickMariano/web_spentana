import BasketballCourt from './BasketballCourt';
import BilliardRoom from './BilliardRoom';
import Building from './Building';
import FootballField from './FootballField';
import PetanqueCourt from './PetanqueCourt';
import Restaurant from './Restaurant';
import SwimmingPool from './SwimmingPool';
import { FACING, localDims } from './builder';
import { buildingHeight } from './buildingModels';
import { BILLIARD, longAxis } from './layout';

// Choisit le modèle 3D d'une infrastructure d'après son `type` et renvoie
// aussi son orientation et le volume cliquable qui l'englobe.
function resolve(f, quality) {
  if (f.type === 'building' || f.type === 'restaurant' || f.type === 'billard') {
    const [W, D] = localDims(f.size, f.facing);
    const rotY = FACING[f.facing] ?? 0;
    if (f.type === 'building') {
      return { rotY, box: [W, buildingHeight(f.variant), D], node: <Building variant={f.variant} W={W} D={D} /> };
    }
    if (f.type === 'restaurant') {
      return { rotY, box: [W, 4.6, D], node: <Restaurant variant={f.variant} W={W} D={D} /> };
    }
    return { rotY, box: [W + 0.6, BILLIARD.height + 0.5, D + 0.6], node: <BilliardRoom W={W} D={D} /> };
  }

  const { L, W, rotY } = longAxis(f.size);
  if (f.type === 'football') {
    return { rotY, box: [L, 1.2, W], node: <FootballField L={L} W={W} variant={f.variant} /> };
  }
  if (f.type === 'basket') {
    return { rotY, box: [L, 1.2, W], node: <BasketballCourt L={L} W={W} variant={f.variant} /> };
  }
  if (f.type === 'piscine') {
    return { rotY, box: [L, 0.8, W], node: <SwimmingPool size={f.size} quality={quality} /> };
  }
  return { rotY, box: [L, 0.8, W], node: <PetanqueCourt L={L} W={W} /> };
}

// Une infrastructure du complexe : modèle 3D placé selon la configuration
// (src/data/visite.js) + volume invisible qui la rend cliquable.
export default function Facility({ facility, quality, onSelect }) {
  const { rotY, box, node } = resolve(facility, quality);
  const [rx, ry, rz] = facility.rotation;

  return (
    <group position={facility.position} rotation={[rx, rotY + ry, rz]}>
      {node}
      <mesh
        position={[0, box[1] / 2, 0]}
        onClick={(e) => {
          // Un glisser (rotation de la vue) n'est pas un clic.
          if (e.delta > 6) return;
          e.stopPropagation();
          onSelect(facility.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = '';
        }}
      >
        <boxGeometry args={box} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
