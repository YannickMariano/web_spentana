import styles from './CoachCard.module.css';

// Carte d'un encadrant, affichée dans le carrousel coverflow de la page Academy.
export default function CoachCard({ coach }) {
  return (
    <div className={styles.card}>
      <div className={styles.media}>
        <img
          src={coach.image}
          alt={coach.name}
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className={styles.info}>
        <strong className={styles.name}>{coach.name}</strong>
        <span className={styles.role}>{coach.role}</span>
      </div>
    </div>
  );
}
