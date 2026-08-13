import { useState } from 'react';
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from 'framer-motion';
import styles from './CardSpotlight.module.css';

// Effet "spotlight" au survol : une nappe lumineuse (masque radial) suit le
// curseur et révèle une grille de points bleu/violet. Adapté du composant
// CardSpotlight (Aceternity) au stack JSX + CSS Modules du projet, sans la
// dépendance three.js de CanvasRevealEffect.
export default function CardSpotlight({
  children,
  radius = 260,
  as: Tag = 'div',
  className = '',
  ...props
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const mask = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, white, transparent 80%)`;

  return (
    <Tag
      className={`${styles.wrapper} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      {...props}
    >
      {!reduceMotion && (
        <motion.div
          className={styles.overlay}
          style={{ maskImage: mask, WebkitMaskImage: mask }}
          aria-hidden="true"
        >
          {hovering && <div className={styles.dots} />}
        </motion.div>
      )}
      {children}
    </Tag>
  );
}
