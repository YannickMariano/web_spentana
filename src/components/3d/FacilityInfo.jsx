import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { SITE } from '../../constants/site';
import styles from './visite.module.css';

// Fiche d'une infrastructure, ouverte après le clic sur "VOIR".
// La réservation passe par le parcours existant du site : appel à l'accueil.
export default function FacilityInfo({ facility, onClose }) {
  const bookable = Boolean(facility.infraId);

  return (
    <aside className={`${styles.info} ${styles.glass}`} aria-label={facility.name}>
      <div className={styles.infoHead}>
        <span className={styles.infoIcon}>
          <Icon name={facility.icon} size={24} />
        </span>
        <div className={styles.infoTitle}>
          <span>{facility.category}</span>
          <h2>{facility.name}</h2>
        </div>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Fermer">
          <Icon name="close" size={15} strokeWidth={2.2} />
        </button>
      </div>

      <p className={styles.infoDesc}>{facility.description}</p>

      {(facility.capacity || facility.hours) && (
        <div className={styles.chips}>
          {facility.capacity && <span className={styles.chip}>Capacité : {facility.capacity}</span>}
          {facility.hours && <span className={styles.chip}>{facility.hours}</span>}
        </div>
      )}

      {facility.price && (
        <div className={styles.price}>
          <span>Tarif</span>
          <strong>{facility.price}</strong>
        </div>
      )}

      {facility.rates && (
        <div className={styles.rates}>
          <div className={styles.ratesRow}>
            <span>Créneau</span>
            <span>Sans projecteur</span>
            <span>Avec projecteur</span>
          </div>
          {facility.rates.map((r) => (
            <div className={styles.ratesRow} key={r.when}>
              <span>{r.when}</span>
              <span>{r.sans}</span>
              <span>{r.avec}</span>
            </div>
          ))}
          <span className={styles.ratesFoot}>Tarifs par heure · projecteur = éclairage nocturne</span>
        </div>
      )}

      <div className={styles.actions}>
        {bookable ? (
          <a className={`${styles.action} ${styles.actionPrimary}`} href={SITE.phoneHref}>
            Réserver
          </a>
        ) : (
          <Link className={`${styles.action} ${styles.actionPrimary}`} to="/contact">
            Nous contacter
          </Link>
        )}
        {facility.link && (
          <Link className={styles.action} to={facility.link.to}>
            {facility.link.label}
          </Link>
        )}
        <button type="button" className={styles.action} onClick={onClose}>
          Fermer
        </button>
      </div>
      {bookable && (
        <p className={styles.infoNote}>
          Réservation par téléphone au {SITE.phone}, ou sur place à l’accueil.
        </p>
      )}
    </aside>
  );
}
