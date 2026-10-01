import { useState } from 'react';
import { FilterChip } from '../components/ui/Chip';
import EventCard from '../components/cards/EventCard';
import { events, EVENT_TYPES } from '../data/events';
import styles from './EventsPage.module.css';

const TABS = ['À venir', 'En cours', 'Passés', 'Résultats'];
const ALL_TYPES = 'Tous';

export default function EventsPage() {
  const [tab, setTab] = useState('À venir');
  const [type, setType] = useState(ALL_TYPES);
  const visible = events.filter(
    (e) => e.group === tab && (type === ALL_TYPES || e.types?.includes(type))
  );

  return (
    <>
      <section className={`section ${styles.heroSection}`}>
        <div className={`container ${styles.heroInner}`}>
          <span className="eyebrow" style={{ color: 'var(--color-green)' }}>
            Événements
          </span>
          <h1 className={styles.title}>Tournois, galas et rencontres à Spentana.</h1>
          <div className={styles.tabs}>
            {TABS.map((t) => (
              <FilterChip
                key={t}
                label={t}
                active={tab === t}
                onClick={() => setTab(t)}
                accent="var(--color-green)"
              />
            ))}
          </div>
          <div className={styles.types} role="group" aria-label="Filtrer par type d'événement">
            {[ALL_TYPES, ...EVENT_TYPES].map((t) => (
              <FilterChip
                key={t}
                label={t}
                active={type === t}
                onClick={() => setType(t)}
                accent="var(--color-marine)"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'clamp(36px,5vw,64px)' }}>
        {visible.length > 0 ? (
          <div className={styles.grid}>
            {visible.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Aucun événement dans cette catégorie pour le moment.</p>
        )}
      </section>
    </>
  );
}
