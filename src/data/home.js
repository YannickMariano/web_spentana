// Contenu propre à la page d'accueil (hors hero, infra, events, gallery,
// testimonials qui vivent dans leurs propres fichiers de données).
export const heroFacts = [
  { k: '8', v: 'infrastructures' },
  { k: '5', v: 'disciplines' },
  { k: '7j/7', v: '6h → 22h' },
  { k: '200+', v: 'membres actifs' },
];

export const introTags = ['Familles', 'Clubs sportifs', 'Entreprises', 'Écoles', 'Événements privés'];

export const univers = [
  {
    id: 'complexe',
    tag: 'Complexe',
    accent: '#2c85c8',
    title: 'Le Complexe',
    desc: "Terrains, piscine, salles et espaces de loisirs, réservables à l'heure ou à la journée.",
    cta: 'Voir les infrastructures',
    image: '/Spentana/spspentana2.jpg',
    alt: 'Vue aérienne du complexe Spentana',
    to: '/complexe',
  },
  {
    id: 'academy',
    tag: 'Academy',
    accent: '#14528c',
    title: 'Spentana Academy',
    desc: 'Football, basket, natation, sport-études et cours de musique, de 5 à 18 ans.',
    cta: 'Découvrir les disciplines',
    image: '/Academy/entrainement2.JPG',
    alt: "Jeunes à l'entraînement à la Spentana Academy",
    to: '/academy',
  },
  {
    id: 'taninketsa',
    tag: 'Taninketsa',
    accent: '#2c85c8',
    title: 'Taninketsa Academy',
    desc: 'Centre de formation : école, sport, cantine et internat pour les jeunes talents.',
    cta: 'Découvrir le centre',
    image: '/Taninketsa/taninketsa1.jpg',
    alt: 'Élèves du centre de formation Taninketsa',
    to: '/taninketsa',
  },
];

export const whyPoints = [
  { n: '01', accent: '#2c85c8', t: 'Terrains entretenus', d: 'Gazon de qualité, lignes claires, éclairage vérifié avant chaque soirée.' },
  { n: '02', accent: '#14528c', t: 'Encadrants diplômés', d: 'Formateurs licenciés et maîtres-nageurs présents à chaque séance.' },
  { n: '03', accent: '#2f9e44', t: 'Réservation claire', d: "Tarifs affichés, acompte de 30 %, report gratuit jusqu'à 48h." },
  { n: '04', accent: '#2c85c8', t: 'Site sécurisé', d: 'Entrée gardiennée.' },
  { n: '05', accent: '#14528c', t: 'Un lieu pour toute la famille', d: "Billard, pétanque et restauration pendant que les enfants s'entraînent." },
  { n: '06', accent: '#2f9e44', t: 'Un seul numéro', d: 'Réservations, inscriptions et devis se règlent en un appel, tous les jours de 8h à 20h.' },
];

// Les compteurs (0 → valeur) sont animés par le hook useCountUp au scroll.
export const stats = [
  { target: 8, suffix: '', label: 'Infrastructures', accent: '#2c85c8' },
  { target: 5, suffix: '', label: 'Disciplines enseignées', accent: '#14528c' },
  { target: 1200, suffix: '+', label: 'Membres actifs', accent: '#2f9e44' },
  { target: 40, suffix: '', label: 'Places à Taninketsa', accent: '#2c85c8' },
  { target: 12, suffix: '+', label: 'Événements par an', accent: '#14528c' },
];
