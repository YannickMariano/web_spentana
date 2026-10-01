import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import AddToCalendar from '../ui/AddToCalendar';
import { SITE } from '../../constants/site';
import styles from './EventCard.module.css';

const GROUP_BADGE = {
  Passés: '#69747e',
  'En cours': '#2c85c8',
  Résultats: '#69747e',
};

function ctaHref(btn) {
  if (/photo|feuille|détail/i.test(btn)) return '/galerie';
  return SITE.phoneHref;
}

export default function EventCard({ event }) {
  const badgeBg = GROUP_BADGE[event.group] || '#2f9e44';
  const isMuted = event.group === 'Passés' || event.group === 'Résultats';
  const canAddToCalendar = Boolean(event.start) && !isMuted;
  // Bouton d'action facultatif : affiché seulement si `btn` est renseigné.
  const href = ctaHref(event.btn ?? '');
  const isInternal = href.startsWith('/');
  const CtaTag = isInternal ? Link : 'a';
  const ctaProp = isInternal ? { to: href } : { href };

  return (
    <Reveal as="div" className={styles.card}>
      <div className={styles.media}>
        <span className={styles.date} style={{ background: badgeBg }}>
          {event.date}
        </span>
        <img src={event.image} alt={event.title} loading="lazy" decoding="async" />
      </div>
      <div className={styles.body}>
        <span className={styles.cat}>{event.cat}</span>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.desc}>{event.desc}</p>
        {event.result && <span className={styles.result}>{event.result}</span>}
        <div className={styles.actions}>
          {event.btn && (
            <CtaTag
              {...ctaProp}
              className={styles.cta}
              style={{
                background: isMuted ? 'var(--color-surface-tint)' : '#2f9e44',
                color: isMuted ? 'var(--color-ink)' : '#fff',
              }}
            >
              {event.btn}
            </CtaTag>
          )}
          {canAddToCalendar && <AddToCalendar event={event} />}
        </div>
      </div>
    </Reveal>
  );
}
