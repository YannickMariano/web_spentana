import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS, SITE } from '../../constants/site';
import Button from '../ui/Button';
import styles from './MobileMenu.module.css';

export default function MobileMenu({ open, onToggle, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`${styles.toggle} ${open ? styles.toggleOpen : ''}`}
        onClick={onToggle}
        aria-expanded={open}
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
      >
        <span />
      </button>

      {open && (
        <nav className={styles.panel} aria-label="Navigation mobile">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Button href={SITE.phoneHref} variant="primary" className={styles.cta}>
            Appeler pour réserver
          </Button>
        </nav>
      )}
    </>
  );
}
