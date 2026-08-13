import Reveal from '../ui/Reveal';
import styles from './PlayerCard.module.css';

const STAT_LABELS = [
  ['an', 'Né en'],
  ['pied', 'Pied'],
  ['ville', 'Origine'],
];

// Les champs sportifs peuvent être vides tant qu'ils n'ont pas été renseignés
// dans src/data/players.js : seules les valeurs présentes s'affichent.
export default function PlayerCard({ player }) {
  const stats = STAT_LABELS.filter(([key]) => player[key]);

  return (
    <Reveal as="div" className={styles.card}>
      <div className={styles.media}>
        {player.numero && <span className={styles.number}>{player.numero}</span>}
        <img src={player.image} alt={player.name} loading="lazy" decoding="async" />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{player.name}</h3>
        {player.poste && <span className={styles.poste}>{player.poste}</span>}

        {stats.length > 0 ? (
          <div className={styles.stats}>
            {stats.map(([key, label]) => (
              <span className={styles.statRow} key={key}>
                {label}
                <strong>{player[key]}</strong>
              </span>
            ))}
          </div>
        ) : (
          <span className={styles.pending}>Fiche à compléter</span>
        )}
      </div>
    </Reveal>
  );
}
