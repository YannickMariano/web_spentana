import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Euler, Vector3 } from 'three';
import Avatar from './Avatar';
import { isWalkable } from './layout';
import { visitState } from './visitState';

// Caméra à la troisième personne : point visé (à hauteur d'épaules) et
// distance derrière le personnage.
const PIVOT_HEIGHT = 1.55;
const BOOM_LENGTH = 4.4;
const PITCH_MIN = -0.95;
const PITCH_MAX = 0.4;
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
const _pivot = new Vector3();
const _goal = new Vector3();

// Distance de caméra possible sans traverser un bâtiment ni le mur d'enceinte.
function clearBoom(px, pz, dx, dz) {
  let d = 0.6;
  while (d < BOOM_LENGTH && isWalkable(px - dx * (d + 0.3), pz - dz * (d + 0.3), 0.15)) d += 0.3;
  return Math.min(d, BOOM_LENGTH);
}

// Visite libre à la troisième personne : on dirige un personnage visible,
// la caméra le suit par-dessus l'épaule. Clavier (ou joystick tactile) pour se
// déplacer, glisser à la souris / au doigt pour tourner la vue autour de lui,
// collisions simples avec les bâtiments, le bassin et le mur d'enceinte.
export default function PlayerController() {
  const dom = useThree((s) => s.gl.domElement);
  const keys = useRef({});
  const view = useRef({ yaw: 0, pitch: -0.28, active: false, phase: 0, x: 0, z: 0, heading: 0 });
  const avatar = useRef();
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
      // Glisser vers la droite tourne la vue vers la droite, vers le bas la
      // fait plonger vers le bas.
      v.yaw -= (e.clientX - drag.x) * LOOK_SPEED;
      v.pitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, v.pitch - (e.clientY - drag.y) * LOOK_SPEED));
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
      if (v.active) avatar.current?.setVisible(false);
      v.active = false;
      return;
    }
    if (!v.active) {
      // Entrée en visite libre : le personnage apparaît là où le vol s'est
      // posé, tourné dans la direction du regard ; la caméra recule derrière lui.
      _euler.setFromQuaternion(camera.quaternion, 'YXZ');
      v.yaw = _euler.y;
      v.pitch = -0.28;
      v.heading = v.yaw + Math.PI;
      v.x = camera.position.x;
      v.z = camera.position.z;
      v.active = true;
      keys.current = {};
      vel.current.x = 0;
      vel.current.z = 0;
      avatar.current?.setVisible(true);
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
    const nx = v.x + vel.current.x * dt;
    if (isWalkable(nx, v.z)) v.x = nx;
    else vel.current.x = 0;
    const nz = v.z + vel.current.z * dt;
    if (isWalkable(v.x, nz)) v.z = nz;
    else vel.current.z = 0;

    // Le personnage se tourne en douceur vers sa direction de marche.
    const moving = Math.hypot(vel.current.x, vel.current.z);
    if (moving > 0.3) {
      const target = Math.atan2(vel.current.x, vel.current.z);
      let diff = target - v.heading;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      v.heading += diff * (1 - Math.exp(-12 * dt));
    }
    v.phase += moving * dt * 2.3;
    avatar.current?.pose(v.x, v.z, v.heading, v.phase, Math.min(1, moving / WALK_SPEED));

    // Caméra : derrière et au-dessus du personnage, rapprochée si un mur gêne.
    const cp = Math.cos(v.pitch);
    const dx = -Math.sin(v.yaw) * cp;
    const dz = -Math.cos(v.yaw) * cp;
    const dy = Math.sin(v.pitch);
    const boom = clearBoom(v.x, v.z, dx, dz);
    _pivot.set(v.x, PIVOT_HEIGHT, v.z);
    _goal.set(v.x - dx * boom, Math.max(0.5, PIVOT_HEIGHT - dy * boom), v.z - dz * boom);
    camera.position.lerp(_goal, 1 - Math.exp(-9 * dt));
    camera.lookAt(_pivot);

    // La mini-carte suit le personnage, pas la caméra.
    visitState.camera.x = v.x;
    visitState.camera.z = v.z;
    visitState.camera.yaw = -v.yaw;
  });

  return <Avatar ref={avatar} />;
}
