import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_LINKS, SITE } from '../../constants/site';
import Button from '../ui/Button';
import MobileMenu from '../navigation/MobileMenu';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const goHome = () => {
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button type="button" className={styles.brand} onClick={goHome}>
          <img src="/Logo/LogoSpentana.png" alt="Spentana" className={styles.logo} />
          <span className={styles.wordmark}>
            <strong>SPENTANA</strong>
            <span>Sports Entertainment Tananarive</span>
          </span>
        </button>

        <nav className={styles.nav} aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Button href={SITE.phoneHref} variant="primary" className={styles.cta}>
          Appeler pour réserver
        </Button>

        <MobileMenu
          open={menuOpen}
          onToggle={() => setMenuOpen((v) => !v)}
          onClose={() => setMenuOpen(false)}
        />
      </div>
    </header>
  );
}
