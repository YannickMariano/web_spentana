import { useState } from 'react';
import styles from './Accordion.module.css';

// Accordéon FAQ générique. `items` = [{ q, a }]. Un seul champ ouvert à la fois
// n'est pas imposé : chaque question se déplie indépendamment.
export default function Accordion({ items }) {
  const [open, setOpen] = useState(() => new Set());

  const toggle = (i) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className={styles.list}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div className={styles.item} key={item.q}>
            <button
              type="button"
              className={styles.trigger}
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              {item.q}
              <span className={styles.sign} aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && <p className={styles.answer}>{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
