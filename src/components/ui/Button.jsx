import { Link } from 'react-router-dom';
import styles from './Button.module.css';

// Bouton polymorphe : rend un <Link> (route interne), un <a> (tel:, mailto:,
// lien externe) ou un <button>, selon les props reçues.
export default function Button({
  variant = 'primary',
  size,
  to,
  href,
  className = '',
  children,
  ...rest
}) {
  const classes = [styles.btn, styles[variant], size ? styles[size] : '', className]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
