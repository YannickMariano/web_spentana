import styles from './PageHero.module.css';

// Bannière d'en-tête de page. `variant="dark"` reproduit le bandeau sombre
// texturé du Complexe / de l'Academy / de Taninketsa ; `variant="plain"` le
// bloc de titre simple des pages Événements / Galerie / Contact.
export default function PageHero({
  variant = 'dark',
  eyebrow,
  title,
  description,
  minHeight = 420,
  washColor,
  image,
  imageAlt = '',
  eyebrowColor = 'var(--color-primary)',
  children,
}) {
  if (variant === 'plain') {
    return (
      <section className={styles.plain}>
        <div className={styles.plainInner}>
          {eyebrow && (
            <span className={styles.plainEyebrow} style={{ color: eyebrowColor }}>
              {eyebrow}
            </span>
          )}
          <h1 className={styles.plainTitle}>{title}</h1>
          {description && <p className={styles.plainDesc}>{description}</p>}
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.dark} style={{ minHeight }}>
      {image ? (
        <img className={styles.bgImage} src={image} alt={imageAlt} />
      ) : (
        <div className={styles.pattern} />
      )}
      <div className={styles.wash} style={washColor ? { '--wash-color': washColor } : undefined} />
      <div className={styles.darkInner}>
        {eyebrow && <span className={styles.darkEyebrow}>{eyebrow}</span>}
        <h1 className={styles.darkTitle}>{title}</h1>
        {description && <p className={styles.darkDesc}>{description}</p>}
        {children}
      </div>
    </section>
  );
}
