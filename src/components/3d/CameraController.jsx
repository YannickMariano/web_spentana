import { useImperativeHandle, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { visitState } from './visitState';
import { ENTRANCE } from '../../data/visite';

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const _dir = new Vector3();

// Caméra de la visite :
//  - vue aérienne : orbite, zoom et déplacement à la souris / au doigt ;
//  - vols cinématiques (easeInOut) vers un point de vue, sans téléportation.
// `apiRef.current.flyTo({ position, target, duration, lift, onDone })`.
export default function CameraController({ apiRef }) {
  const controls = useRef();
  const flight = useRef(null);
  // Point réellement regardé par la caméra (source de vérité entre les modes).
  const look = useRef(new Vector3(...ENTRANCE.introTarget));
  const get = useThree((s) => s.get);

  useImperativeHandle(apiRef, () => ({
    flyTo({ position, target, duration = 2.2, lift = 0, onDone }) {
      const { camera } = get();
      flight.current = {
        t: 0,
        duration: Math.max(0.01, duration),
        lift,
        fromPos: camera.position.clone(),
        toPos: new Vector3(...position),
        fromTarget: look.current.clone(),
        toTarget: new Vector3(...target),
        onDone,
      };
    },
    isFlying: () => flight.current !== null,
  }));

  // Priorité -1 : s'exécute avant la mise à jour interne d'OrbitControls.
  useFrame(({ camera }, dt) => {
    const f = flight.current;
    const orbit = controls.current;

    if (f) {
      f.t = Math.min(1, f.t + Math.min(dt, 0.05) / f.duration);
      const k = easeInOut(f.t);
      camera.position.lerpVectors(f.fromPos, f.toPos, k);
      // Légère courbe en cloche : la caméra prend de la hauteur en cours de vol.
      camera.position.y += Math.sin(Math.PI * k) * f.lift;
      look.current.lerpVectors(f.fromTarget, f.toTarget, k);
      camera.lookAt(look.current);
      if (f.t >= 1) {
        flight.current = null;
        if (orbit) orbit.target.copy(look.current);
        f.onDone?.();
      }
    } else if (visitState.mode === 'walk') {
      camera.getWorldDirection(_dir);
      look.current.copy(camera.position).addScaledVector(_dir, 25);
    } else if (orbit) {
      // On garde le point visé au-dessus du sol et près du complexe.
      orbit.target.x = Math.max(-260, Math.min(260, orbit.target.x));
      orbit.target.z = Math.max(-240, Math.min(240, orbit.target.z));
      orbit.target.y = Math.max(0, Math.min(40, orbit.target.y));
      look.current.copy(orbit.target);
    }

    if (orbit) orbit.enabled = !flight.current && visitState.mode === 'aerial';

    camera.getWorldDirection(_dir);
    visitState.camera.x = camera.position.x;
    visitState.camera.z = camera.position.z;
    visitState.camera.yaw = Math.atan2(_dir.x, -_dir.z);
  }, -1);

  return (
    <OrbitControls
      ref={controls}
      enabled={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={6}
      maxDistance={430}
      maxPolarAngle={Math.PI / 2 - 0.07}
      zoomSpeed={0.9}
      rotateSpeed={0.55}
      panSpeed={0.9}
      screenSpacePanning={false}
    />
  );
}
