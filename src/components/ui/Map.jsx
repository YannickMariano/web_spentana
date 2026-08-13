import styles from './Map.module.css';

// Carte Google Maps intégrée (sans clé API, via output=embed) centrée sur
// SPENTANA ACADEMY MADAGASCAR — Alasora, Antananarivo.
// Source : https://maps.app.goo.gl/tELxmPc34J4p5iq3A
const EMBED_SRC =
  'https://www.google.com/maps?q=SPENTANA+ACADEMY+MADAGASCAR&ll=-18.9479211,47.5564275&z=16&hl=fr&output=embed';

export default function Map({
  title = 'Localisation de Spentana Academy sur Google Maps',
  minHeight,
}) {
  return (
    <iframe
      title={title}
      className={styles.frame}
      style={minHeight ? { minHeight } : undefined}
      src={EMBED_SRC}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
