import Reveal from './Reveal';
import styles from './SectionHeader.module.css';

export default function SectionHeader({
  eyebrow,
  title,
  description,
  accent = 'var(--color-primary)',
  action,
  className = '',
}) {
  return (
    <Reveal as="div" className={`${styles.wrap} ${className}`}>
      <div className={styles.stack}>
        {eyebrow && (
          <span className={styles.eyebrow} style={{ color: accent }}>
            {eyebrow}
          </span>
        )}
        <h2 className={styles.title}>{title}</h2>
      </div>
      {description && <p className={styles.description}>{description}</p>}
      {action}
    </Reveal>
  );
}
