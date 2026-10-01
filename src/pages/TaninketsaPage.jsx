import PageHero from '../components/sections/PageHero';
import SectionHeader from '../components/ui/SectionHeader';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import CoachCard from '../components/cards/CoachCard';
import CoverflowCarousel from '../components/ui/CoverflowCarousel';
import { taninPillars, journee, taninBlocks, squadStatsExtra } from '../data/taninketsa';
import { players } from '../data/players';
import { SITE } from '../constants/site';
import styles from './TaninketsaPage.module.css';

// Fiche joueur au format des cartes entraîneurs : numéro et poste s'ils sont
// renseignés dans src/data/players.js, sinon le nom du centre.
function toCard(player) {
  const role = [player.numero && `N° ${player.numero}`, player.poste].filter(Boolean).join(' · ');
  return { name: player.name, role: role || 'Taninketsa Academy', image: player.image };
}

export default function TaninketsaPage() {
  const squadStats = [{ k: String(players.length), l: 'Joueurs au centre' }, ...squadStatsExtra];

  return (
    <>
      <PageHero
        eyebrow="Taninketsa Academy"
        title="Là où les jeunes talents grandissent, pas seulement les joueurs."
        description="Un centre de formation qui tient les deux bouts : l'école et le terrain. Internat, cantine, entraînements quotidiens, suivi individuel."
        washColor="rgba(44,133,200,.36)"
        minHeight={470}
        image="/Taninketsa/taninketsa1.jpg"
        imageAlt="Groupe d'élèves du centre de formation Taninketsa"
      />

      <section className="section">
        <Reveal as="div" className={styles.mission}>
          <span className={styles.eyebrow}>Notre mission</span>
          <h2 className={styles.missionQuote}>
            « Un enfant qui réussit à l'école devient un athlète qui réussit sa vie. »
          </h2>
          <p className={styles.missionText}>
            Taninketsa signifie la pépinière : l'endroit où l'on prépare le plant avant de le
            repiquer. Nous accueillons des jeunes venus de tout Madagascar, repérés lors de
            détections, et nous nous engageons auprès de leurs familles : la scolarité passe
            d'abord. Chaque élève a un tuteur, un bulletin scolaire suivi, un carnet sportif et
            un point trimestriel avec ses parents.
          </p>
        </Reveal>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className={`container ${styles.pillars}`}>
          {taninPillars.map((p) => (
            <Reveal as="div" className={styles.pillarCard} key={p.t}>
              <span className={styles.pillarBadge}>{p.n}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeader eyebrow="Une journée type" title="Du réveil à l'étude du soir." />
          <div className={styles.journeeGrid}>
            {journee.map((j) => (
              <Reveal as="div" className={styles.journeeCard} key={j.h}>
                <span>{j.h}</span>
                <strong>{j.t}</strong>
                <span>{j.d}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.blocksGrid}`}>
          {taninBlocks.map((b) => (
            <Reveal as="div" className={styles.block} key={b.id}>
              <div className={styles.blockMedia}>
                <img src={b.image} alt={b.alt} loading="lazy" />
              </div>
              <div className={styles.blockBody}>
                <span className={styles.blockTag}>{b.tag}</span>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className={styles.squadHead}>
            <Reveal as="div" className={styles.squadHeadText}>
              <span className={styles.eyebrow}>Effectif</span>
              <h2>Les joueurs de Taninketsa.</h2>
              <p>
                Ils viennent de toute l'île, vivent à l'internat et suivent leur scolarité au
                centre. Voici la promotion en cours.
              </p>
            </Reveal>
          </div>

          <Reveal as="div" className={styles.squadStats}>
            {squadStats.map((s) => (
              <div className={styles.squadStatCard} key={s.l}>
                <strong>{s.k}</strong>
                <span>{s.l}</span>
              </div>
            ))}
          </Reveal>

          <Reveal>
            <CoverflowCarousel
              slides={players}
              renderSlide={(p) => <CoachCard coach={toCard(p)} />}
              aspect={0.66}
              cardWidth="clamp(200px, 24vw, 270px)"
              label="Joueurs de Taninketsa Academy"
              showNavigation
              showPagination
            />
          </Reveal>
        </div>
      </section>

      <section className={`section-tight ${styles.admission}`}>
        <div className={`container ${styles.admissionInner}`}>
          <div className={styles.admissionText}>
            <span style={{ color: '#a9d9f7' }} className="eyebrow">
              Admission
            </span>
            <h2>Détections ouvertes pour la rentrée 2027.</h2>
            <p>Dossier scolaire, test sportif, entretien avec la famille. Internat compris.</p>
          </div>
          <div className={styles.admissionActions}>
            <Button href={SITE.phoneHref} variant="primary">
              Candidater
            </Button>
            <Button to="/contact" variant="onDark">
              Visiter le centre
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
