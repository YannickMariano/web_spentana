import styles from './Chip.module.css';

// Filtre / onglet cliquable (galerie, agenda). `accent` définit la couleur de
// l'état actif.
export function FilterChip({ label, active, onClick, accent = 'var(--color-ink)' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.chip} ${active ? styles.chipActive : ''}`}
      style={active ? { '--chip-active-color': accent } : undefined}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

// Simple étiquette non interactive (ex. "Familles", "Clubs sportifs").
export function Tag({ children }) {
  return <span className={styles.tag}>{children}</span>;
}
