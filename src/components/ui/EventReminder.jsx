import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import AddToCalendar from './AddToCalendar';
import { getReminderEvents, parseDay } from '../../data/events';
import styles from './EventReminder.module.css';

const DAY_MS = 24 * 60 * 60 * 1000;

function countdown(event, today) {
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.round((parseDay(event.start) - day) / DAY_MS);
  if (days < 0) return 'En cours';
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Demain';
  return `Dans ${days} jours`;
}

// Fenêtre de rappel affichée à l'ouverture du site : événements qui commencent
// dans 7 jours ou moins et ne sont pas encore terminés (voir getReminderEvents).
// Plusieurs événements → carrousel. Monté une seule fois dans le Layout : une
// fois fermée, elle ne réapparaît pas en changeant de page, seulement au
// prochain chargement du site.
export default function EventReminder() {
  const [today] = useState(() => new Date());
  const [items] = useState(() => getReminderEvents(undefined, today));
  const [open, setOpen] = useState(items.length > 0);
  const [index, setIndex] = useState(0);
  const count = items.length;

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      else if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % count);
      else if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + count) % count);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, count]);

  if (!open || count === 0) return null;

  const event = items[index];
  const go = (by) => setIndex((i) => (i + by + count) % count);

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-reminder-title"
      >
        <button
          type="button"
          className={styles.close}
          onClick={() => setOpen(false)}
          aria-label="Fermer"
        >
          <Icon name="close" size={18} strokeWidth={2.2} />
        </button>

        <div className={styles.media}>
          <img key={event.id} src={event.image} alt={event.title} />
          <span className={styles.badge}>{countdown(event, today)}</span>
        </div>

        <div className={styles.body} key={event.id}>
          <span className={styles.eyebrow}>
            {count > 1 ? `Événements à venir · ${index + 1} / ${count}` : 'Événement à venir'}
          </span>
          <h2 id="event-reminder-title" className={styles.title}>
            {event.title}
          </h2>
          <span className={styles.meta}>
            {event.date} · {event.cat}
          </span>
          <p className={styles.desc}>{event.desc}</p>

          <div className={styles.actions}>
            <AddToCalendar event={event} />
            <Link to="/evenements" className={styles.link} onClick={() => setOpen(false)}>
              Voir tous les événements
            </Link>
          </div>
        </div>

        {count > 1 && (
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => go(-1)}
              aria-label="Événement précédent"
            >
              <Icon name="arrowLeft" size={18} />
            </button>
            <div className={styles.dots}>
              {items.map((e, i) => (
                <button
                  key={e.id}
                  type="button"
                  className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Afficher ${e.title}`}
                  aria-current={i === index}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => go(1)}
              aria-label="Événement suivant"
            >
              <Icon name="arrowRight" size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
