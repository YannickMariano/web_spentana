import { Link } from 'react-router-dom';
import styles from './InteractiveHoverButton.module.css';

// Bouton à animation de survol (texte qui glisse + flèche + pastille qui
// remplit). Adapté de InteractiveHoverButton (TSX + Tailwind) au stack
// JSX + CSS Modules. Polymorphe : rend un <a> (tel:/lien), un <Link> (route
// interne) ou un <button>. Flèche en SVG inline (pas de lucide-react).
function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function InteractiveHoverButton({
  text = 'Button',
  to,
  href,
  className = '',
  children,
  ...props
}) {
  const label = children ?? text;
  const classes = `${styles.btn} ${className}`;

  const inner = (
    <>
      <span className={styles.front}>{label}</span>
      <span className={styles.hover} aria-hidden="true">
        <span>{label}</span>
        <ArrowRightIcon />
      </span>
      <span className={styles.circle} aria-hidden="true" />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {inner}
    </button>
  );
}
