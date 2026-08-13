import { Link } from 'react-router-dom';
import { SITE, FOOTER_COLUMNS, SOCIAL_ICONS } from '../../constants/site';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.socials}>
          <span className={styles.socialsLabel}>Suivez Spentana sur les réseaux sociaux</span>
          <div className={styles.socialsRow}>
            {SOCIAL_ICONS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                title={s.name}
                className={styles.socialLink}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.about}>
            <span className={styles.brand}>
              <span className={styles.logoBadge}>
                <img src="/Logo/LogoSpentana.png" alt="Spentana" />
              </span>
              <span className={styles.brandText}>
                <strong>SPENTANA</strong>
                <span>{SITE.tagline}</span>
              </span>
            </span>
            <p className={styles.aboutText}>
              Complexe sportif et de loisirs à Antananarivo. Terrains, piscine, académie
              sportive et musicale, centre de formation Taninketsa.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div className={styles.col} key={col.title}>
              <strong className={styles.colTitle}>{col.title}</strong>
              {col.items.map((item) =>
                typeof item === 'string' ? (
                  <span className={styles.colItem} key={item}>
                    {item}
                  </span>
                ) : (
                  <Link className={styles.colItem} key={item.to} to={item.to}>
                    {item.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Spentana. Tous droits réservés.</span>
          <span>Mentions légales · Politique de confidentialité · Conçu à Antananarivo</span>
        </div>
      </div>
    </footer>
  );
}
