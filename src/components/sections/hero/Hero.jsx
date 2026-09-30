import Button from '../../ui/Button';
import ImageHeroSlideshow from './ImageHeroSlideshow';
import { heroSlides } from '../../../data/hero';
import { heroFacts } from '../../../data/home';
import { SITE } from '../../../constants/site';
import styles from './Hero.module.css';

// Média du hero : slideshow de photos aujourd'hui. Pour passer à une vraie
// vidéo plus tard, importez VideoHero et remplacez la ligne ci-dessous par
// `<VideoHero src="/hero/complexe.mp4" poster="/hero/poster.jpg" />` — rien
// d'autre à changer, ni ici ni sur la page d'accueil.
function HeroMedia() {
  return <ImageHeroSlideshow slides={heroSlides} />;
}

export default function Hero() {
  return (
    <section className={styles.section}>
      <HeroMedia />
      <div className={styles.content}>
        <span className={styles.eyebrow}>Complexe sportif &amp; loisirs · Antananarivo</span>
        <h1 className={styles.title}>Le terrain de jeu de toute la famille.</h1>
        <p className={styles.desc}>
          Huit infrastructures, une académie sportive et musicale, un centre de formation pour
          jeunes talents. Tout Spentana sur un seul site : un appel suffit pour réserver,
          inscrire, venir vivre le sport.
        </p>
        <div className={styles.actions}>
          <Button to="/complexe" variant="secondary" style={{ background: '#fff' }}>
            Découvrir le complexe
          </Button>
          <Button href={SITE.phoneHref} variant="primary">
            Appeler {SITE.phone}
          </Button>
          <Button to="/visite" variant="accent">
            Faire une visite
          </Button>
        </div>
        <div className={styles.facts}>
          {heroFacts.map((f) => (
            <div className={styles.fact} key={f.v}>
              <strong>{f.k}</strong>
              <span>{f.v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
