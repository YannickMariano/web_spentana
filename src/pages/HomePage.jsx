import { Link } from 'react-router-dom';
import Hero from '../components/sections/hero/Hero';
import SectionHeader from '../components/ui/SectionHeader';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import { Tag } from '../components/ui/Chip';
import UniversCard from '../components/cards/UniversCard';
import InfraCard from '../components/cards/InfraCard';
import EventCard from '../components/cards/EventCard';
import TestimonialCard from '../components/cards/TestimonialCard';
import StatsSection from '../components/sections/StatsSection';
import Map from '../components/ui/Map';
import { introTags, univers, whyPoints } from '../data/home';
import { infra } from '../data/infra';
import { events } from '../data/events';
import { gallery } from '../data/gallery';
import { testimonials } from '../data/testimonials';
import { SITE } from '../constants/site';
import styles from './HomePage.module.css';

const upcomingEvents = events.filter((e) => e.group === 'À venir').slice(0, 3);
const galleryTeaser = gallery.slice(0, 6);

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="section">
        <div className={`container ${styles.intro}`}>
          <div className={styles.introText}>
            <span className={styles.introEyebrow}>Bienvenue à Spentana</span>
            <h2 className={styles.introTitle}>
              Un lieu où le sport, l'éducation et la convivialité se rencontrent.
            </h2>
            <p className={styles.introDesc}>
              Sur un seul site, Spentana réunit des terrains de football, une piscine, des
              espaces basket et volley, des salles de réception et de conférence, et des
              espaces de loisirs. Ici, une famille vient passer son dimanche, un club prépare
              son tournoi, une entreprise réunit ses équipes et un enfant découvre son premier
              sport.
            </p>
            <div className={styles.tags}>
              {introTags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
          <Reveal className={styles.collage}>
            <div className={styles.collageWide}>
              <img src="/Spentana/spspentana2.jpg" alt="Vue générale du complexe Spentana" loading="lazy" />
            </div>
            <img src="/Spentana/sppiscine3.jpg" alt="Piscine du complexe Spentana" loading="lazy" />
            <img src="/Academy/entrainement1.JPG" alt="Enfants à l'entraînement à la Spentana Academy" loading="lazy" />
          </Reveal>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeader
            eyebrow="Trois univers"
            title="Choisissez votre porte d'entrée."
            description="Chaque univers a son rythme, son public et son parcours d'inscription."
          />
          <div className={styles.universGrid}>
            {univers.map((u) => (
              <UniversCard key={u.id} item={u} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Nos infrastructures"
            title="Huit espaces, un seul lieu."
            action={
              <Button to="/complexe" variant="secondary">
                Voir les tarifs détaillés
              </Button>
            }
          />
          <div className={styles.infraGrid}>
            {infra.map((i) => (
              <InfraCard key={i.id} infra={i} />
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.why}`}>
        <div className={`container ${styles.whyInner}`}>
          <Reveal className={styles.whyText}>
            <span className={styles.eyebrow}>Pourquoi Spentana</span>
            <h2>L'exigence d'un grand club, l'accueil d'un lieu de famille.</h2>
            <p>
              Des installations entretenues, des encadrants diplômés, une équipe présente sept
              jours sur sept et un site sécurisé pour les enfants.
            </p>
          </Reveal>
          <Reveal className={styles.whyGrid}>
            {whyPoints.map((w) => (
              <div className={styles.whyCard} key={w.t}>
                <span className={styles.whyBadge} style={{ background: w.accent }}>
                  {w.n}
                </span>
                <h4>{w.t}</h4>
                <p>{w.d}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <StatsSection />

      <section className="section section-soft">
        <div className="container">
          <SectionHeader
            eyebrow="Agenda"
            accent="var(--color-green)"
            title="Les prochains événements."
            action={
              <Button to="/evenements" variant="secondary">
                Tout l'agenda
              </Button>
            }
          />
          <div className={styles.eventsGrid}>
            {upcomingEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Galerie"
            accent="var(--color-marine)"
            title="La vie du complexe."
            action={
              <Button to="/galerie" variant="secondary">
                Ouvrir la galerie
              </Button>
            }
          />
          <Reveal className={styles.galleryTeaser}>
            {galleryTeaser.map((g) => (
              <Link key={g.id} to="/galerie">
                <img src={g.image} alt={g.alt} loading="lazy" decoding="async" />
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <Reveal className={styles.testimonialsHeader}>
            <span className={styles.introEyebrow}>Témoignages</span>
            <h2 className={styles.introTitle}>Ils viennent, ils reviennent.</h2>
          </Reveal>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.location}>
        <div className={styles.locationGrid}>
          <div className={styles.locationText}>
            <span className={styles.introEyebrow}>Nous trouver</span>
            <h2 className={styles.introTitle}>Spentana, Antananarivo.</h2>
            <p>
              Accès voiture et transport en commun, parking gratuit sur place, entrée sécurisée
              et gardiennée.
            </p>
            <div className={styles.locationDetails}>
              <span>{SITE.address}</span>
              <span>
                {SITE.phone} · {SITE.email}
              </span>
              <span>{SITE.hours}</span>
            </div>
            <Button to="/contact" variant="primary" style={{ alignSelf: 'flex-start', marginTop: 6 }}>
              Itinéraire &amp; contact
            </Button>
          </div>
          <div className={styles.map}>
            <Map minHeight={340} />
          </div>
        </div>
      </section>
    </>
  );
}
