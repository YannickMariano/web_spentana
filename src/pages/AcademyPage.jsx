import PageHero from '../components/sections/PageHero';
import SectionHeader from '../components/ui/SectionHeader';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import Accordion from '../components/ui/Accordion';
import DisciplineCard from '../components/cards/DisciplineCard';
import CoachCard from '../components/cards/CoachCard';
import { disciplines } from '../data/disciplines';
import { coaches } from '../data/coaches';
import { academyFacts, academyIntroPhoto, registrationSteps, faqAcademy } from '../data/academy';
import { SITE } from '../constants/site';
import styles from './AcademyPage.module.css';

export default function AcademyPage() {
  return (
    <>
      <PageHero
        eyebrow="Spentana Academy"
        title="Apprendre un sport, un instrument, une discipline de vie."
        washColor="rgba(20,82,140,.34)"
        minHeight={440}
        image="/Academy/spentanaaccademy.JPG"
        imageAlt="Les jeunes de la Spentana Academy réunis sur le terrain"
      >
        <div className={styles.heroActions}>
          <Button href={SITE.phoneHref} variant="marine">
            Appeler {SITE.phone}
          </Button>
          <Button href="#disciplines" variant="onDark">
            Voir les disciplines et tarifs
          </Button>
        </div>
        <span className={styles.heroNote}>
          Inscriptions uniquement sur place, à l'accueil du complexe.
        </span>
      </PageHero>

      <section className="section">
        <div className={`container ${styles.intro}`}>
          <Reveal className={styles.introText}>
            <span className={styles.eyebrow}>Présentation</span>
            <h2>Une école, cinq disciplines, un même encadrement.</h2>
            <p>
              De 4 à 18 ans, les élèves progressent par groupes de niveau, avec des séances
              hebdomadaires et des évaluations trimestrielles.
              <br />
              Le sport-études combine scolarité et entraînement quotidien.
            </p>
            <div className={styles.factsRow}>
              {academyFacts.map((a) => (
                <div className={styles.factBox} key={a.v}>
                  <strong>{a.k}</strong>
                  <span>{a.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal as="div" className={styles.introPhoto}>
            <img src={academyIntroPhoto.image} alt={academyIntroPhoto.alt} loading="lazy" />
          </Reveal>
        </div>
      </section>

      <section className="section section-soft" id="disciplines">
        <div className="container">
          <SectionHeader
            eyebrow="Les disciplines"
            accent="var(--color-marine)"
            title="Chaque discipline, ses horaires et son tarif."
          />
          <div className={styles.discGrid}>
            {disciplines.map((d) => (
              <DisciplineCard key={d.id} discipline={d} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Nos entraîneurs"
            accent="var(--color-marine)"
            title="Des encadrants diplômés et connus des familles."
          />
          <div className={styles.coachGrid}>
            {coaches.map((c) => (
              <CoachCard key={c.id} coach={c} />
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.registration}`}>
        <div className={`container ${styles.registrationInner}`}>
          <Reveal className={styles.registrationText}>
            <span style={{ color: '#a9d9f7' }} className="eyebrow">
              Inscription
            </span>
            <h2>Les inscriptions se font uniquement sur place.</h2>
            <p>
              Il n'y a pas d'inscription en ligne. Présentez-vous à l'accueil du complexe avec
              votre enfant : l'équipe vous explique les groupes, les horaires et vous remet le
              dossier à compléter sur place.
            </p>
            <div className={styles.steps}>
              {registrationSteps.map((s) => (
                <div className={styles.stepRow} key={s.t}>
                  <span className={styles.stepNum}>{s.n}</span>
                  <div className={styles.stepText}>
                    <strong>{s.t}</strong>
                    <span>{s.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal as="div" className={styles.contactCard}>
            <span className={styles.contactBadge}>Inscription sur place uniquement</span>
            <h3>Besoin d'informations avant de venir ?</h3>
            <div className={styles.contactRows}>
              <div className={styles.contactRow}>
                <span>Téléphone</span>
                <a href={SITE.phoneHref}>{SITE.phone}</a>
              </div>
              <div className={styles.contactRow}>
                <span>Accueil du complexe</span>
                <p>{SITE.address}</p>
              </div>
            </div>
            <div className={styles.contactActions}>
              <Button href={SITE.phoneHref} variant="accent">
                Appeler l'accueil
              </Button>
              <Button href={SITE.whatsappHref} variant="onDark">
                Écrire sur WhatsApp
              </Button>
            </div>
            <span className={styles.contactFoot}>
              Vous pouvez aussi nous joindre via Facebook, Instagram ou TikTok — liens en bas
              de page.
            </span>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className={styles.faqWrap}>
          <Reveal className={styles.faqHead}>
            <span className={styles.eyebrow}>FAQ Academy</span>
            <h2>Ce que les parents demandent le plus.</h2>
          </Reveal>
          <Accordion items={faqAcademy} />
        </div>
      </section>
    </>
  );
}
