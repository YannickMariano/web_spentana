import styles from './VideoHero.module.css';

// Prêt à l'emploi pour le jour où la vidéo drone sera disponible : déposez le
// fichier dans public/hero/complexe.mp4 (+ une affiche poster.jpg) puis
// remplacez <ImageHeroSlideshow /> par <VideoHero /> dans Hero.jsx — voir
// README.md "Remplacer le slideshow par une vidéo".
export default function VideoHero({ src, poster }) {
  return (
    <div className={styles.stage} aria-hidden="true">
      <video
        className={styles.video}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className={styles.overlay} />
    </div>
  );
}
