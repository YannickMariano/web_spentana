import { forwardRef, useImperativeHandle, useRef } from 'react';

const SKIN = '#8a5a3c';
const JERSEY = '#2c85c8';
const SHORTS = '#14283d';
const SHOES = '#f2f2ee';
const HAIR = '#1b1512';

// Membre articulé : un pivot (épaule ou hanche) et un segment qui pend dessous.
function Limb({ pivotRef, position, length, radius, color, sleeve, shoe }) {
  return (
    <group ref={pivotRef} position={position}>
      <mesh position={[0, -length / 2 - radius, 0]} castShadow>
        <capsuleGeometry args={[radius, length, 4, 10]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {sleeve && (
        <mesh position={[0, -0.09, 0]} castShadow>
          <capsuleGeometry args={[radius + 0.02, 0.1, 4, 10]} />
          <meshStandardMaterial color={sleeve} roughness={0.8} />
        </mesh>
      )}
      {shoe && (
        <mesh position={[0, -length - radius * 2 - 0.02, 0.05]} castShadow>
          <boxGeometry args={[0.13, 0.09, 0.27]} />
          <meshStandardMaterial color={shoe} roughness={0.6} />
        </mesh>
      )}
    </group>
  );
}

// Personnage du visiteur en visite libre (vu à la troisième personne) :
// maillot bleu Spentana, short, baskets. `ref.current.pose(x, z, cap, phase, allure)`
// le place et anime la marche (jambes et bras en balancier).
const Avatar = forwardRef(function Avatar(props, ref) {
  const root = useRef();
  const legL = useRef();
  const legR = useRef();
  const armL = useRef();
  const armR = useRef();
  const body = useRef();

  useImperativeHandle(ref, () => ({
    setVisible(v) {
      if (root.current) root.current.visible = v;
    },
    pose(x, z, heading, phase, stride) {
      if (!root.current) return;
      root.current.position.set(x, 0, z);
      root.current.rotation.y = heading;
      const swing = Math.sin(phase) * 0.62 * stride;
      legL.current.rotation.x = swing;
      legR.current.rotation.x = -swing;
      armL.current.rotation.x = -swing * 0.8;
      armR.current.rotation.x = swing * 0.8;
      body.current.position.y = Math.abs(Math.cos(phase)) * 0.035 * stride;
    },
  }));

  return (
    <group ref={root} visible={false}>
      <group ref={body}>
        <Limb pivotRef={legL} position={[0.11, 0.92, 0]} length={0.68} radius={0.075} color={SKIN} shoe={SHOES} />
        <Limb pivotRef={legR} position={[-0.11, 0.92, 0]} length={0.68} radius={0.075} color={SKIN} shoe={SHOES} />
        {/* Short */}
        <mesh position={[0, 0.86, 0]} castShadow>
          <boxGeometry args={[0.38, 0.26, 0.24]} />
          <meshStandardMaterial color={SHORTS} roughness={0.8} />
        </mesh>
        {/* Maillot */}
        <mesh position={[0, 1.27, 0]} scale={[1, 1, 0.72]} castShadow>
          <capsuleGeometry args={[0.18, 0.36, 4, 12]} />
          <meshStandardMaterial color={JERSEY} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.27, 0.125]}>
          <boxGeometry args={[0.07, 0.4, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>
        <Limb pivotRef={armL} position={[0.25, 1.48, 0]} length={0.5} radius={0.055} color={SKIN} sleeve={JERSEY} />
        <Limb pivotRef={armR} position={[-0.25, 1.48, 0]} length={0.5} radius={0.055} color={SKIN} sleeve={JERSEY} />
        {/* Cou, tête, cheveux */}
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.055, 0.06, 0.1, 10]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.75, 0]} castShadow>
          <sphereGeometry args={[0.125, 18, 14]} />
          <meshStandardMaterial color={SKIN} roughness={0.65} />
        </mesh>
        <mesh position={[0, 1.83, -0.04]} scale={[1, 0.72, 1]}>
          <sphereGeometry args={[0.132, 18, 14]} />
          <meshStandardMaterial color={HAIR} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
});

export default Avatar;
