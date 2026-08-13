import Reveal from '../ui/Reveal';
import Button from '../ui/Button';
import { SITE } from '../../constants/site';
import styles from './DisciplineCard.module.css';

export default function DisciplineCard({ discipline }) {
  return (
    <Reveal as="div" className={styles.card}>
      <div className={styles.media}>
        <span className={styles.badge} style={{ background: discipline.accent }}>
          {discipline.tag}
        </span>
        <img src={discipline.image} alt={discipline.alt} loading="lazy" decoding="async" />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{discipline.name}</h3>
        <p className={styles.desc}>{discipline.desc}</p>
        <div className={styles.infoBox}>
          <span>Âges · {discipline.age}</span>
          <span>Horaires · {discipline.horaires}</span>
          <strong>{discipline.tarif}</strong>
        </div>
        <div className={styles.actions}>
          <span className={styles.note}>Inscription sur place uniquement</span>
          <Button href={SITE.phoneHref} variant="marine">
            Appeler pour se renseigner
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
