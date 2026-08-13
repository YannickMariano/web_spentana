import { useNavigate } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import styles from './UniversCard.module.css';

export default function UniversCard({ item }) {
  const navigate = useNavigate();

  return (
    <Reveal as="button" type="button" className={styles.card} onClick={() => navigate(item.to)}>
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
    </Reveal>
  );
}
