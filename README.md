# Spentana — Site officiel

Site vitrine du complexe sportif et de loisirs **Spentana** (Sports Entertainment
Tananarive), à Antananarivo. Construit avec **React 19 + Vite** et **React Router**,
fidèle au design réalisé sur Claude Design.

Le principe de l'architecture est simple :

```
DONNÉES (src/data)  →  COMPOSANTS (src/components)  →  PAGES (src/pages)
```

Les données sont séparées du code : pour faire évoluer le site (ajouter un joueur,
un événement, changer une photo…), il suffit dans la plupart des cas de modifier un
fichier dans `src/data/` et/ou une image dans `public/`, **sans toucher à
l'architecture React**.

---

## Installation & lancement

Prérequis : Node.js 20+ et npm.

```bash
npm install        # installer les dépendances
npm run dev        # serveur de développement (http://localhost:5173)
npm run build      # build de production → dossier dist/
npm run preview    # prévisualiser le build de production
npm run lint       # vérifier le code avec ESLint
```

---

## Structure du projet

```
public/                     Images servies telles quelles (voir « Emplacement des images »)
  ├── Logo/LogoSpentana.png
  ├── Spentana/             Photos du complexe (terrains, piscine, salles…)
  ├── Academy/              Photos de la Spentana Academy (séances, groupes, musique)
  ├── Taninketsa/           Portraits des joueurs + internat / cantine / étude
  ├── Coach/                Portraits des encadrants
  ├── Ancien/               Photos d'archive (avant construction)
  └── Event/                Affiches d'inscription (non utilisées pour l'instant)

src/
  ├── data/                 ← LES DONNÉES ÉDITABLES (voir plus bas)
  ├── constants/site.js     Coordonnées, navigation, réseaux sociaux
  ├── hooks/                useInView, useCountUp, useLightbox
  ├── components/
  │   ├── ui/               Button, SectionHeader, Reveal, Accordion, Chip, Lightbox
  │   ├── cards/            InfraCard, UniversCard, DisciplineCard, CoachCard,
  │   │                     PlayerCard, EventCard, TestimonialCard, GalleryTile
  │   ├── sections/         Hero (+ ImageHeroSlideshow / VideoHero), PageHero,
  │   │                     StatsSection, GalleryMasonry
  │   ├── layout/           Header, Footer, Layout, ScrollToTop
  │   └── navigation/       MobileMenu
  ├── pages/                HomePage, ComplexePage, AcademyPage, TaninketsaPage,
  │                         EventsPage, GalleryPage, ContactPage, NotFoundPage
  ├── routes/AppRoutes.jsx  Déclaration des routes
  ├── App.jsx               BrowserRouter + routes
  ├── main.jsx              Point d'entrée
  └── index.css             Tokens du design (couleurs, typo) + styles globaux
```

Chaque composant possède son propre fichier `*.module.css` (CSS Modules, styles
isolés). Les couleurs, la typographie (Sora + Manrope) et les espacements du design
sont définis comme variables CSS dans `src/index.css` (`:root`).

---

## Pages

| Route          | Page            | Contenu principal                                   |
| -------------- | --------------- | --------------------------------------------------- |
| `/`            | Accueil         | Hero slideshow, univers, infrastructures, agenda…   |
| `/complexe`    | Le Complexe     | Histoire, 8 infrastructures + tarifs, FAQ           |
| `/academy`     | Academy         | 5 disciplines, entraîneurs, inscription, FAQ        |
| `/taninketsa`  | Taninketsa      | Mission, journée type, internat, effectif joueurs   |
| `/evenements`  | Événements      | Agenda à onglets (À venir / En cours / Passés / Résultats) |
| `/galerie`     | Galerie         | Grille masonry filtrable + lightbox                 |
| `/contact`     | Contact         | Coordonnées, réseaux, formulaire                    |

---

## Emplacement des données

Tout le contenu dynamique vit dans **`src/data/`** :

| Fichier            | Contenu                                            |
| ------------------ | -------------------------------------------------- |
| `hero.js`          | Photos du slideshow de la page d'accueil           |
| `infra.js`         | Les 8 infrastructures et leurs tarifs              |
| `disciplines.js`   | Les disciplines de l'Academy                       |
| `coaches.js`       | Les encadrants                                     |
| `players.js`       | L'effectif de Taninketsa                           |
| `events.js`        | L'agenda / les événements                          |
| `gallery.js`       | Les photos et catégories de la galerie             |
| `testimonials.js`  | Les témoignages                                    |
| `home.js`          | Univers, « pourquoi Spentana », chiffres clés      |
| `complexe.js`      | Frise chronologique + FAQ réservation              |
| `academy.js`       | Chiffres, étapes d'inscription, FAQ Academy        |
| `taninketsa.js`    | Piliers, journée type, blocs (cantine, internat…)  |
| `contact.js`       | Lignes de coordonnées + champs du formulaire       |

Les coordonnées globales (téléphone, email, adresse, horaires, liens réseaux,
libellés de navigation) sont dans **`src/constants/site.js`**.

---

## Emplacement des images

Les images sont dans **`public/`**, rangées par thème (voir la structure ci-dessus).
On les référence par un chemin **absolu** commençant à la racine de `public/`, par
exemple `/Spentana/spfootnight.jpg`. Les sous-dossiers d'origine ont été conservés.

Bonnes pratiques déjà en place : `object-fit: cover`, `loading="lazy"` sur les images
hors écran, `alt` pertinent (ou vide pour les images purement décoratives).

> ⚠️ Les photos originales sont volumineuses (~265 Mo au total, jusqu'à 4000 px de
> large). Pour la production, il est recommandé de générer des versions compressées
> (WebP, largeur ~1600 px) — par ex. avec `sharp` ou le plugin `vite-imagetools`.

---

## Recettes courantes

### Ajouter un joueur (Taninketsa)
1. Déposez la photo dans `public/Taninketsa/` (ex. `Nouveau.jpg`).
2. Ajoutez une entrée dans `src/data/players.js` :
   ```js
   { id: 16, name: 'Nouveau', poste: 'Milieu', numero: '8', an: '2010',
     pied: 'Droitier', ville: 'Antananarivo', image: '/Taninketsa/Nouveau.jpg' },
   ```
   Les champs sportifs vides (`''`) sont simplement masqués sur la fiche : vous
   pouvez les compléter progressivement.

### Ajouter un coach
Photo dans `public/Coach/`, puis une entrée dans `src/data/coaches.js`
(`{ id, name, role, image }`).

### Ajouter un événement
Photo dans `public/`, puis une entrée dans `src/data/events.js`. Le champ `group`
(`'À venir'`, `'En cours'`, `'Passés'`, `'Résultats'`) détermine l'onglet où il
apparaît.

### Ajouter une infrastructure / une discipline
Une entrée dans `src/data/infra.js` (avec éventuellement un tableau `rates`) ou
`src/data/disciplines.js`. Elles s'affichent automatiquement sur l'accueil, la page
Complexe et la page Academy.

### Ajouter une catégorie / des photos à la galerie
Ajoutez la catégorie dans `galleryCategories` et des entrées dans `gallery`
(`src/data/gallery.js`). `span` contrôle la hauteur de la tuile dans la grille
masonry.

### Remplacer une photo
Remplacez le fichier dans `public/` (même nom) **ou** changez le chemin `image`
dans le fichier de données concerné.

---

## Modifier les photos du Hero

Le hero de la page d'accueil est un **slideshow** alimenté par `src/data/hero.js`.
Pour changer les photos, modifiez ce tableau (5 photos environ, en paysage et haute
qualité recommandées) :

```js
export const heroSlides = [
  { id: 1, image: '/Spentana/spfootnight.jpg', alt: '…' },
  // …
];
```

Le composant `ImageHeroSlideshow` gère le fondu enchaîné et l'effet Ken Burns
automatiquement.

## Remplacer le slideshow par une vidéo

Une vidéo drone n'étant pas encore disponible, le hero utilise un slideshow. Tout est
prêt pour basculer vers une vidéo sans réécrire la page :

1. Déposez la vidéo dans `public/hero/` (ex. `public/hero/complexe.mp4`) et, en
   option, une image d'attente `public/hero/poster.jpg`.
2. Dans **`src/components/sections/hero/Hero.jsx`**, remplacez le composant
   `HeroMedia` :
   ```jsx
   import VideoHero from './VideoHero';
   // …
   function HeroMedia() {
     return <VideoHero src="/hero/complexe.mp4" poster="/hero/poster.jpg" />;
   }
   ```
   Rien d'autre ne change : le texte, les boutons et la mise en page du hero restent
   identiques.

---

## Notes

- Le formulaire de contact n'est **pas relié à un backend** (les demandes se règlent
  par téléphone). Pour l'activer, branchez un service d'envoi dans
  `ContactPage.jsx` (`onSubmit`).
- Certains contenus (noms des coachs, témoignages, événements, tarifs) sont des
  **exemples** repris du design : remplacez-les par vos informations réelles dans
  `src/data/`.
- Le dossier `public/Event/` (affiches d'inscription) n'est pas encore utilisé et
  reste disponible pour un usage ultérieur.
