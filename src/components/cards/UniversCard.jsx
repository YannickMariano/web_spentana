import { useNavigate } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import Reveal from '../ui/Reveal';
import styles from './UniversCard.module.css';

// Effet de tilt 3D au survol (framer-motion) : la carte s'incline légèrement
// vers le curseur, avec lissage par ressort. La perspective est portée par le
// conteneur `.perspective` (chaque carte a son propre point de fuite).
const SPRING = { damping: 15, stiffness: 150 };

export default function UniversCard({ item }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING);
  const springY = useSpring(mouseY, SPRING);
  const rotateX = useTransform(springY, [-0.5, 0.5], ['10.5deg', '-10.5deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-10.5deg', '10.5deg']);

  const handleMouseMove = (e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Reveal as="div" className={styles.perspective}>
      <motion.button
        type="button"
        onClick={() => navigate(item.to)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={styles.card}
      >
        <div className={styles.media}>
          <span className={styles.badge} style={{ background: item.accent }}>
            {item.tag}
          </span>
          <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.desc}>{item.desc}</p>
          <span className={styles.cta} style={{ color: item.accent }}>
            {item.cta} →
          </span>
        </div>
      </motion.button>
    </Reveal>
  );
}
