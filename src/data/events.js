// Calendrier de la saison 2026 – 2027 (source : public/Evenement.txt). Chaque
// entrée alimente à la fois l'aperçu de l'accueil, la page Événements (onglets
// À venir / En cours / Passés / Résultats) et la fenêtre de rappel affichée
// 7 jours avant l'événement.
//
// Le classement « À venir », « En cours » ou « Passés » est AUTOMATIQUE : il
// est calculé à partir des dates de l'événement et de la date du jour.
//   start : premier jour, au format 'AAAA-MM-JJ' (obligatoire)
//   end   : dernier jour, si l'événement dure plusieurs jours (facultatif)
// Avant `start` → À venir ; de `start` à `end` → En cours ; après → Passés.
// La date affichée sur la carte est elle aussi générée à partir de ces dates.
//
// `types` : filtres de la page Événements auxquels l'événement appartient
// (valeurs de EVENT_TYPES ; un événement peut en avoir plusieurs ou aucun).
//
// Seuls les « Résultats » se renseignent à la main : `group: 'Résultats'`
// (et `label` pour le texte du badge, ex. 'FINALE').
export const EVENT_TYPES = ['Réunion', 'Match Amical', 'Examen', 'JCS', 'Vacances', 'Tournoi'];

const IMG = {
  rentree: '/Academy/spentanaaccademy.JPG',
  porte: '/Academy/Porte ouverte.JPG',
  reunion: '/Academy/Reunion1.jpg',
  reunion2: '/Academy/Reunion2.jpg',
  jcs: '/Event/JSC.jpg',
  examen: '/Academy/match2.JPG',
  bulletin: '/Academy/Remise.jpeg',
  matchFoot: '/Academy/match1.JPG',
  matchJeunes: '/Academy/U9-2.jpg',
  matchAines: '/Academy/U15.JPG',
  basket: '/Academy/abasket1.jpg',
  kids: '/Academy/U11.jpg',
  youth: '/Event/Youth Spentana Tournament.png',
  vacances: '/Spentana/sppiscine2.jpg',
};

const EVENTS = [
  // --- Septembre – Octobre 2026
  {
    id: 'rentree-2026',
    start: '2026-09-05',
    types: [],
    cat: 'Rentrée',
    title: 'Rentrée 2026 – 2027',
    desc: "Reprise des entraînements et des cours pour toute l'Academy.",
    image: IMG.rentree,
  },
  {
    id: 'porte-ouverte-2026',
    start: '2026-09-26',
    types: [],
    cat: 'Porte ouverte',
    title: 'Journée portes ouvertes',
    desc: "Visite du complexe et découverte des disciplines de l'Academy.",
    image: IMG.porte,
  },
  {
    id: 'reunion-parents-oct-2026',
    start: '2026-10-03',
    types: ['Réunion'],
    cat: 'Réunion',
    title: 'Réunion des parents',
    desc: 'Présentation de la saison et échanges avec les entraîneurs.',
    image: IMG.reunion,
  },
  {
    id: 'jcs-oct-2026',
    start: '2026-10-03',
    types: ['JCS'],
    cat: 'JCS',
    title: 'JCS',
    desc: "Journée JCS pour les élèves de l'Academy.",
    image: IMG.jcs,
  },
  {
    id: 'match-amical-oct-2026',
    start: '2026-10-31',
    types: ['Match Amical'],
    cat: 'Match amical',
    title: 'Match amical Foot et Basket',
    desc: 'Rencontres amicales pour les équipes de football et de basket.',
    image: IMG.matchFoot,
  },

  // --- Décembre 2026
  {
    id: 'examen-dec-2026-1',
    start: '2026-12-02',
    types: ['Examen'],
    cat: 'Examen',
    title: 'Examen',
    desc: 'Évaluation du premier trimestre (1re journée).',
    image: IMG.examen,
  },
  {
    id: 'examen-dec-2026-2',
    start: '2026-12-05',
    types: ['Examen'],
    cat: 'Examen',
    title: 'Examen',
    desc: 'Évaluation du premier trimestre (2e journée).',
    image: IMG.examen,
  },
  {
    id: 'kids-tournament-dec-2026',
    start: '2026-12-12',
    types: ['Tournoi'],
    cat: 'Tournoi',
    title: 'Kids Spentana Tournament',
    desc: "Le tournoi des plus jeunes de l'Academy.",
    image: IMG.kids,
  },
  {
    id: 'youth-tournament-dec-2026',
    start: '2026-12-19',
    end: '2026-12-20',
    types: ['Tournoi'],
    cat: 'Tournoi',
    title: 'Youth Spentana Tournament (TANA)',
    desc: 'Deux jours de compétition pour les catégories jeunes.',
    image: IMG.youth,
  },
  {
    id: 'vacances-noel-2026',
    start: '2026-12-20',
    end: '2027-01-05',
    types: ['Vacances'],
    cat: 'Vacances',
    title: 'Vacances de Noël',
    desc: "Pause des entraînements et des cours pour les fêtes de fin d'année.",
    image: IMG.vacances,
  },

  // --- Janvier – Mars 2027
  {
    id: 'rentree-noel-2027',
    start: '2027-01-06',
    types: [],
    cat: 'Rentrée',
    title: 'Rentrée des vacances de Noël',
    desc: 'Reprise des entraînements et des cours.',
    image: IMG.rentree,
  },
  {
    id: 'bulletin-jan-2027',
    start: '2027-01-09',
    types: [],
    cat: 'Bulletin',
    title: 'Remise de bulletin',
    desc: 'Remise des bulletins du premier trimestre aux familles.',
    image: IMG.bulletin,
  },
  {
    id: 'match-amical-jan-2027',
    start: '2027-01-30',
    types: ['Match Amical'],
    cat: 'Match amical',
    title: 'Match amical (U7 – U9 – U11)',
    desc: 'Rencontres amicales pour les catégories U7, U9 et U11.',
    image: IMG.matchJeunes,
  },
  {
    id: 'match-amical-feb-2027',
    start: '2027-02-06',
    types: ['Match Amical'],
    cat: 'Match amical',
    title: 'Match amical (U7 – U9 – U11)',
    desc: 'Sortie 2e partie pour les catégories U7, U9 et U11.',
    image: IMG.matchJeunes,
  },
  {
    id: 'examen-feb-2027',
    start: '2027-02-13',
    types: ['Examen'],
    cat: 'Examen',
    title: 'Examen',
    desc: 'Évaluation du deuxième trimestre.',
    image: IMG.examen,
  },
  {
    id: 'sortie-basket-feb-2027',
    start: '2027-02-20',
    types: [],
    cat: 'Sortie',
    title: 'Sortie Basket',
    desc: "Sortie des équipes de basket de l'Academy.",
    image: IMG.basket,
  },
  {
    id: 'jcs-test-feb-2027',
    start: '2027-02-27',
    types: ['JCS'],
    cat: 'JCS',
    title: 'JCS / Test',
    desc: 'Journée JCS et tests des élèves.',
    image: IMG.jcs,
  },
  {
    id: 'bulletin-mar-2027',
    start: '2027-03-20',
    types: [],
    cat: 'Bulletin',
    title: 'Remise de bulletin',
    desc: 'Remise des bulletins du deuxième trimestre aux familles.',
    image: IMG.bulletin,
  },
  {
    id: 'vacances-paques-2027',
    start: '2027-03-25',
    end: '2027-04-06',
    types: ['Vacances'],
    cat: 'Vacances',
    title: 'Vacances de Pâques',
    desc: 'Pause des entraînements et des cours pour les vacances de Pâques.',
    image: IMG.vacances,
  },

  // --- Avril – Juillet 2027
  {
    id: 'youth-tournament-apr-2027',
    start: '2027-04-01',
    end: '2027-04-03',
    types: ['Tournoi'],
    cat: 'Tournoi',
    title: 'Youth Spentana Tournament (TANA)',
    desc: 'Trois jours de compétition pour les catégories jeunes.',
    image: IMG.youth,
  },
  {
    id: 'rentree-paques-2027',
    start: '2027-04-07',
    types: [],
    cat: 'Rentrée',
    title: 'Rentrée des vacances de Pâques',
    desc: 'Reprise des entraînements et des cours.',
    image: IMG.rentree,
  },
  {
    id: 'kids-tournament-apr-2027',
    start: '2027-04-24',
    types: ['Tournoi'],
    cat: 'Tournoi',
    title: 'Kids Tournament',
    desc: "Le tournoi des plus jeunes de l'Academy.",
    image: IMG.kids,
  },
  {
    id: 'jcs-may-2027',
    start: '2027-05-08',
    types: ['JCS'],
    cat: 'JCS',
    title: 'JCS',
    desc: "Journée JCS pour les élèves de l'Academy.",
    image: IMG.jcs,
  },
  {
    id: 'reunion-parents-may-2027',
    start: '2027-05-22',
    types: ['Réunion'],
    cat: 'Réunion',
    title: 'Réunion des parents',
    desc: 'Bilan de la saison et échanges avec les entraîneurs.',
    image: IMG.reunion2,
  },
  {
    id: 'match-amical-may-2027',
    start: '2027-05-29',
    types: ['Match Amical'],
    cat: 'Match amical',
    title: 'Match amical (U13 – U15 – U17)',
    desc: 'Sortie 1re partie pour les catégories U13, U15 et U17.',
    image: IMG.matchAines,
  },
  {
    id: 'match-amical-jun-2027',
    start: '2027-06-05',
    types: ['Match Amical'],
    cat: 'Match amical',
    title: 'Match amical (U13 – U15 – U17)',
    desc: 'Sortie 2e partie pour les catégories U13, U15 et U17.',
    image: IMG.matchAines,
  },
  {
    id: 'jcs-examen-jun-2027',
    start: '2027-06-19',
    types: ['JCS', 'Examen'],
    cat: 'JCS · Examen',
    title: 'JCS et Examen',
    desc: 'Journée JCS et évaluation du troisième trimestre.',
    image: IMG.jcs,
  },
  {
    id: 'porte-ouverte-bulletin-2027',
    start: '2027-07-03',
    types: [],
    cat: 'Porte ouverte',
    title: 'Porte ouverte et remise de bulletin',
    desc: "Journée portes ouvertes et remise des bulletins de fin d'année.",
    image: IMG.porte,
  },
];

// --- Classement automatique -------------------------------------------------

const MONTHS = ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];
const GROUP_ORDER = ['À venir', 'En cours', 'Passés', 'Résultats'];

// 'AAAA-MM-JJ' → date locale à minuit (sans décalage de fuseau horaire).
export function parseDay(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const pad = (n) => String(n).padStart(2, '0');

// Texte du badge : « 12 SEPT 2026 », ou « 12 → 27 SEPT 2026 » sur plusieurs jours.
function formatDates(start, end) {
  const fmt = (d) => `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  if (!end || end.getTime() === start.getTime()) return fmt(start);
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${pad(start.getDate())} → ${fmt(end)}`;
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${pad(start.getDate())} ${MONTHS[start.getMonth()]} → ${fmt(end)}`;
  }
  return `${fmt(start)} → ${fmt(end)}`;
}

// Calcule le groupe et le texte du badge de chaque événement pour `today`.
export function classifyEvents(list, today = new Date()) {
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return list
    .map((e) => {
      if (e.group === 'Résultats' || !e.start) {
        return { ...e, group: e.group ?? 'Résultats', date: e.label ?? e.date ?? '' };
      }
      const start = parseDay(e.start);
      const end = e.end ? parseDay(e.end) : start;
      let group = 'En cours';
      if (day < start) group = 'À venir';
      else if (day > end) group = 'Passés';
      return {
        ...e,
        group,
        date: group === 'En cours' && end > start ? 'EN COURS' : formatDates(start, e.end ? end : null),
        _time: start.getTime(),
      };
    })
    .sort((a, b) => {
      const g = GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
      if (g || a._time === undefined || b._time === undefined) return g;
      // À venir et En cours : le plus proche d'abord ; Passés : le plus récent d'abord.
      return a.group === 'Passés' ? b._time - a._time : a._time - b._time;
    });
}

// Liste utilisée par l'accueil et la page Événements, classée au chargement.
export const events = classifyEvents(EVENTS);

// Événements à rappeler à l'ouverture du site : de 7 jours avant le début
// jusqu'au dernier jour inclus. Triés du plus proche au plus lointain.
export const REMINDER_DAYS = 7;
export function getReminderEvents(list = events, today = new Date()) {
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const DAY_MS = 24 * 60 * 60 * 1000;
  return list
    .filter((e) => {
      if (!e.start || e.group === 'Résultats') return false;
      const start = parseDay(e.start);
      const end = e.end ? parseDay(e.end) : start;
      return day <= end && Math.round((start - day) / DAY_MS) <= REMINDER_DAYS;
    })
    .sort((a, b) => parseDay(a.start) - parseDay(b.start));
}
