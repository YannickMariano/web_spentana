import PageHero from '../components/sections/PageHero';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import Reveal from '../components/ui/Reveal';
import Accordion from '../components/ui/Accordion';
import InfraCard from '../components/cards/InfraCard';
import { infra } from '../data/infra';
import { timeline, historyPhotos, faqComplexe } from '../data/complexe';
import styles from './ComplexePage.module.css';

export default function ComplexePage() {
  return (
    <>
      <PageHero
        eyebrow="Le Complexe"
        title="Des infrastructures pensées pour jouer sérieusement."
        description="Réservation par téléphone ou sur place, à l'heure, à la demi-journée ou à la journée. Tarifs clairs, aucun frais caché."
        washColor="rgba(44,133,200,.32)"
        image="/Spentana/spfoota9.jpg"
        imageAlt="Vue du grand terrain de football du complexe Spentana"
      >
        <Button to="/visite" variant="accent" style={{ marginTop: 4, alignSelf: 'flex-start' }}>
          Faire une visite
        </Button>
      </PageHero>

      <section className="section">
        <div className={`container ${styles.history}`}>
          <Reveal className={styles.historyText}>
            <span className={styles.eyebrow}>Notre histoire</span>
            <h2>
              Né d'une envie simple : offrir à Antananarivo un lieu de sport digne des
              meilleurs.
            </h2>
            <p>
              Ce qui a commencé par un terrain et quelques ballons est devenu un complexe
              complet. Chaque année, une infrastructure s'ajoute, pensée avec ceux qui
              l'utilisent : clubs, écoles, familles, entreprises.
            </p>
            <div className={styles.timeline}>
              {timeline.map((t) => (
                <div className={styles.timelineRow} key={t.d}>
                  <span>{t.y}</span>
                  <span>{t.d}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className={styles.historyPhotos}>
            <img className={styles.archivePhoto} src={historyPhotos.archive.image} alt={historyPhotos.archive.alt} loading="lazy" />
            <img className={styles.todayPhoto} src={historyPhotos.today.image} alt={historyPhotos.today.alt} loading="lazy" />
          </Reveal>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeader eyebrow="Toutes les infrastructures" title="Capacités et tarifs." />
          <div className={styles.infraGrid}>
            {infra.map((i) => (
              <InfraCard key={i.id} infra={i} detailed />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className={styles.faqWrap}>
          <Reveal className={styles.faqHead}>
            <span className={styles.eyebrow}>FAQ</span>
            <h2>Questions fréquentes sur les réservations.</h2>
          </Reveal>
          <Accordion items={faqComplexe} />
        </div>
      </section>
    </>
  );
}
