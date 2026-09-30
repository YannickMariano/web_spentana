import { useEffect, useRef } from 'react';
import { visitState } from './visitState';
import styles from './visite.module.css';

const RADIUS = 40;

// Joystick virtuel (mobile) : pilote le déplacement en visite libre.
export default function Joystick() {
  const base = useRef();
  const knob = useRef();

  useEffect(() => {
    const el = base.current;
    let id = null;

    const set = (dx, dy) => {
      const len = Math.hypot(dx, dy);
      const k = len > RADIUS ? RADIUS / len : 1;
      const x = dx * k;
      const y = dy * k;
      knob.current.style.transform = `translate(${x}px, ${y}px)`;
      visitState.move.x = x / RADIUS;
      visitState.move.y = -y / RADIUS;
    };
    const fromEvent = (e) => {
      const r = el.getBoundingClientRect();
      set(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    };
    const down = (e) => {
      id = e.pointerId;
      el.setPointerCapture(id);
      fromEvent(e);
    };
    const move = (e) => {
      if (e.pointerId === id) fromEvent(e);
    };
    const up = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      set(0, 0);
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      visitState.move.x = 0;
      visitState.move.y = 0;
    };
  }, []);

  return (
    <div ref={base} className={`${styles.joystick} ${styles.glass}`} aria-label="Joystick de déplacement">
      <span ref={knob} className={styles.joystickKnob} />
    </div>
  );
}
