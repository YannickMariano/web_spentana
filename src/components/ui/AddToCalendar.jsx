import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { downloadIcs, googleCalendarUrl } from '../../utils/calendar';
import styles from './AddToCalendar.module.css';

// Bouton « Ajouter à l'agenda » : ouvre un petit menu Google Agenda / fichier
// .ics (Apple, Outlook, Android). Le menu se ferme au clic extérieur ou Échap.
export default function AddToCalendar({ event, className }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`${styles.root} ${className ?? ''}`}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="calendar" size={16} />
        Ajouter à l'agenda
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          <a
            role="menuitem"
            className={styles.item}
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Google Agenda
          </a>
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={() => {
              downloadIcs(event);
              setOpen(false);
            }}
          >
            Apple / Outlook (.ics)
          </button>
        </div>
      )}
    </div>
  );
}
