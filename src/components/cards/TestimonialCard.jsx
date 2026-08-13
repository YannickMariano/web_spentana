import Reveal from '../ui/Reveal';
import styles from './TestimonialCard.module.css';

export default function TestimonialCard({ testimonial }) {
  const initial = testimonial.name.trim().charAt(0);

  return (
    <Reveal as="blockquote" className={styles.card}>
      <p className={styles.quote}>« {testimonial.quote} »</p>
      <footer className={styles.footer}>
        <span className={styles.avatar} aria-hidden="true">
          {initial}
        </span>
        <span className={styles.who}>
          <strong className={styles.name}>{testimonial.name}</strong>
          <span className={styles.role}>{testimonial.role}</span>
        </span>
      </footer>
    </Reveal>
  );
}
