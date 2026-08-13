import Reveal from '../ui/Reveal';
import styles from './CoachCard.module.css';

export default function CoachCard({ coach }) {
  return (
    <Reveal as="div" className={styles.card}>
      <div className={styles.media}>
        <img src={coach.image} alt={coach.name} loading="lazy" decoding="async" />
      </div>
      <div className={styles.info}>
        <strong className={styles.name}>{coach.name}</strong>
        <span className={styles.role}>{coach.role}</span>
      </div>
    </Reveal>
  );
}
