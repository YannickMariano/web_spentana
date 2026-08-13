import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';
import { stats } from '../../data/home';
import styles from './StatsSection.module.css';

export default function StatsSection() {
  const [ref, inView] = useInView();
  const values = useCountUp(
    stats.map((s) => s.target),
    inView
  );

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.grid}>
        {stats.map((s, i) => (
          <div className={styles.stat} key={s.label}>
            <span className={styles.value} style={{ color: s.accent }}>
              {values[i].toLocaleString('fr-FR')}
              {s.suffix}
            </span>
            <span className={styles.label}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
