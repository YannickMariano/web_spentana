import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Euler } from 'three';
import { isWalkable } from './layout';
import { visitState } from './visitState';

const EYE_HEIGHT = 1.7;
const WALK_SPEED = 4.6;
const RUN_SPEED = 9.5;
const LOOK_SPEED = 0.0042;

// `e.code` désigne la touche PHYSIQUE : KeyW/KeyA correspondent donc à W/A sur
// un clavier QWERTY et à Z/Q sur un clavier AZERTY. WASD et ZQSD fonctionnent
// ainsi tous les deux, sans réglage.
const KEYS = {
  KeyW: 'fwd',
  ArrowUp: 'fwd',
  KeyS: 'back',
  ArrowDown: 'back',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  ShiftLeft: 'run',
  ShiftRight: 'run',
};

const _euler = new Euler(0, 0, 0, 'YXZ');

// Visite libre à hauteur d'homme : clavier (ou joystick tactile) pour se
// déplacer, glisser à la souris / au doigt pour regarder, collisions simples
// avec les bâtiments, le bassin et le mur d'enceinte.
export default function PlayerController() {
  const dom = useThree((s) => s.gl.domElement);
  const keys = useRef({});
  const view = useRef({ yaw: 0, pitch: 0, active: false, walked: 0 });
  const vel = useRef({ x: 0, z: 0 });

  useEffect(() => {
    const drag = { id: null, x: 0, y: 0 };
    const onKey = (down) => (e) => {
      const k = KEYS[e.code];
      if (!k || visitState.mode !== 'walk') return;
      keys.current[k] = down;
      if (e.code.startsWith('Arrow')) e.preventDefault();
    };
    const keyDown = onKey(true);
    const keyUp = onKey(false);
    const release = () => {
      keys.current = {};
    };
    const pointerDown = (e) => {
      if (visitState.mode !== 'walk') return;
      drag.id = e.pointerId;
      drag.x = e.clientX;
      drag.y = e.clientY;
    };
    const pointerMove = (e) => {
      if (drag.id !== e.pointerId || visitState.mode !== 'walk') return;
      const v = view.current;
      v.yaw += (e.clientX - drag.x) * LOOK_SPEED;
      v.pitch = Math.max(-1.2, Math.min(1.2, v.pitch + (e.clientY - drag.y) * LOOK_SPEED));
      drag.x = e.clientX;
      drag.y = e.clientY;
    };
    const pointerUp = (e) => {
      if (drag.id === e.pointerId) drag.id = null;
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    window.addEventListener('blur', release);
    dom.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointercancel', pointerUp);
    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('blur', release);
      dom.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
    };
  }, [dom]);

  useFrame(({ camera }, delta) => {
    const v = view.current;
    if (visitState.mode !== 'walk') {
      v.active = false;
      return;
    }
    if (!v.active) {
      // Entrée en visite libre : on reprend l'orientation laissée par le vol.
      _euler.setFromQuaternion(camera.quaternion, 'YXZ');
      v.yaw = _euler.y;
      v.pitch = _euler.x;
      v.active = true;
      keys.current = {};
      vel.current.x = 0;
      vel.current.z = 0;
    }

    const dt = Math.min(delta, 0.05);
    const k = keys.current;
    let fwd = (k.fwd ? 1 : 0) - (k.back ? 1 : 0) + visitState.move.y;
    let side = (k.right ? 1 : 0) - (k.left ? 1 : 0) + visitState.move.x;
    const len = Math.hypot(fwd, side);
    if (len > 1) {
      fwd /= len;
      side /= len;
    }
    const speed = k.run ? RUN_SPEED : WALK_SPEED;
    const sin = Math.sin(v.yaw);
    const cos = Math.cos(v.yaw);
    const tx = (-sin * fwd + cos * side) * speed;
    const tz = (-cos * fwd - sin * side) * speed;
    const ease = 1 - Math.exp(-10 * dt);
    vel.current.x += (tx - vel.current.x) * ease;
    vel.current.z += (tz - vel.current.z) * ease;

    // Collision axe par axe : on glisse le long des murs au lieu de s'arrêter net.
    let { x, z } = camera.position;
    const nx = x + vel.current.x * dt;
    if (isWalkable(nx, z)) x = nx;
    else vel.current.x = 0;
    const nz = z + vel.current.z * dt;
    if (isWalkable(x, nz)) z = nz;
    else vel.current.z = 0;

    v.walked += Math.hypot(x - camera.position.x, z - camera.position.z);
    camera.position.set(x, EYE_HEIGHT + Math.sin(v.walked * 1.9) * 0.028, z);
    camera.rotation.set(v.pitch, v.yaw, 0, 'YXZ');
  });

  return null;
}
