import Reveal from '../ui/Reveal';
import Button from '../ui/Button';
import { SITE } from '../../constants/site';
import styles from './InfraCard.module.css';

// `detailed` affiche la description, les tarifs par créneau et le bouton
// d'appel (page Le Complexe). Sans, une carte compacte pour l'aperçu accueil.
export default function InfraCard({ infra, detailed = false }) {
  return (
    <Reveal as="div" className={`${styles.card} ${detailed ? styles.detailed : ''}`}>
      <div className={styles.media}>
        {detailed && (
          <span className={styles.badge} style={{ background: infra.accent }}>
            {infra.cat}
          </span>
        )}
        <img src={infra.image} alt={infra.alt} loading="lazy" decoding="async" />
      </div>
      <div className={styles.body}>
        {!detailed && (
          <span className={styles.cat} style={{ color: infra.accent }}>
            {infra.cat}
          </span>
        )}
        <h3 className={styles.name}>{infra.name}</h3>

        {!detailed && <span className={styles.tarifInline}>{infra.tarif}</span>}

        {detailed && (
          <>
            <p className={styles.desc}>{infra.desc}</p>
            <div className={styles.metaRow}>
              <span className={styles.metaChip}>{infra.capacite}</span>
              <span className={styles.metaChip}>{infra.horaire}</span>
            </div>

            {infra.rates && infra.rates.length > 0 && (
              <div className={styles.rates}>
                <div className={styles.ratesHead}>
                  <span>Créneau</span>
                  <span>Sans projecteur</span>
                  <span>Avec projecteur</span>
                </div>
                {infra.rates.map((r) => (
                  <div className={styles.ratesRow} key={r.when}>
                    <span className={styles.when}>{r.when}</span>
                    <span className={styles.sans}>{r.sans}</span>
                    <span className={styles.avec}>{r.avec}</span>
                  </div>
                ))}
                <span className={styles.ratesFoot}>
                  Tarifs par heure · projecteur = éclairage nocturne
                </span>
              </div>
            )}

            <div className={styles.footer}>
              <span className={styles.footerLabel}>
                <span>Tarif</span>
                <strong>{infra.tarif}</strong>
              </span>
              <Button href={SITE.phoneHref} variant="primary" size="sm">
                Appeler
              </Button>
            </div>
          </>
        )}
      </div>
    </Reveal>
  );
}
