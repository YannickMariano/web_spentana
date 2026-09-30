// Icônes vectorielles du site (tracés SVG, aucun emoji). Elles héritent de la
// couleur du texte (`currentColor`) et se règlent avec `size`.
// Pour en ajouter une : une entrée dans ICONS, faite de tracés `d` (grille 24 × 24)
// ou de cercles `[cx, cy, r]` ; un cercle `[cx, cy, r, true]` est plein.
const ICONS = {
  football: [
    [12, 12, 9],
    'M12 7.6l4.2 3-1.6 4.9H9.4l-1.6-4.9z',
    'M12 3v4.6M20.5 9.3l-4.3 1.3M17.3 19.2l-2.7-3.7M6.7 19.2l2.7-3.7M3.5 9.3l4.3 1.3',
  ],
  basketball: [
    [12, 12, 9],
    'M3 12h18M12 3v18',
    'M5.7 5.6c3.1 2.7 3.1 10.1 0 12.8M18.3 5.6c-3.1 2.7-3.1 10.1 0 12.8',
  ],
  pool: [
    'M2 16.5c1.7 0 1.7 1.3 3.3 1.3s1.7-1.3 3.4-1.3 1.6 1.3 3.3 1.3 1.7-1.3 3.3-1.3 1.7 1.3 3.4 1.3 1.6-1.3 3.3-1.3',
    'M2 20.5c1.7 0 1.7 1.3 3.3 1.3s1.7-1.3 3.4-1.3 1.6 1.3 3.3 1.3 1.7-1.3 3.3-1.3 1.7 1.3 3.4 1.3 1.6-1.3 3.3-1.3',
    'M9 13.5V5.5a2.5 2.5 0 0 1 5 0M15 13.5V5.5M9 9.5h6',
  ],
  restaurant: [
    'M7 2.5V21M4.2 2.5v5.2a2.8 2.8 0 0 0 5.6 0V2.5',
    'M17.5 2.5c-2.2 1.6-3.3 4.3-3.3 8h3.3M17.5 2.5V21',
  ],
  coffee: [
    'M4.5 9h11.5v5a5 5 0 0 1-5 5H9.5a5 5 0 0 1-5-5z',
    'M16 10.2h1.4a2.4 2.4 0 0 1 0 4.8H16',
    'M8 3v2.6M11.5 3v2.6M3.5 21.5h13.5',
  ],
  building: [
    'M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17M3 21h18',
    'M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2',
  ],
  school: [
    'M3 21h18M5 21V11.2l7-5 7 5V21',
    'M12 6.2V2.5h3.6v2.2H12',
    'M10 21v-4.2h4V21',
    [12, 12.4, 1.6],
  ],
  graduation: [
    'M2 9l10-5 10 5-10 5z',
    'M6 11.4v4.8c0 1.5 2.7 2.8 6 2.8s6-1.3 6-2.8v-4.8',
    'M22 9v6',
  ],
  billiard: [
    [12, 12, 9],
    [12, 12, 4.3],
    [12, 10.6, 1.1],
    [12, 13.3, 1.3],
  ],
  petanque: [
    [12, 12, 9],
    [12, 12, 5],
    [12, 12, 1.4, true],
  ],
  walk: [
    [13, 4.3, 1.8],
    'M9.5 21l2-6-2.5-2.5 1.5-5 3.5 1.5 2.5 3h3',
    'M13.5 21l-1-5M10.5 7.5L7 9.5v3',
  ],
  eye: [
    'M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z',
    [12, 12, 2.8],
  ],
  settings: [
    'M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1',
    [15, 6, 2],
    [9, 12, 2],
    [17, 18, 2],
  ],
  info: [[12, 12, 9], 'M12 11v5.5', [12, 7.8, 0.6, true]],
  moon: ['M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2z'],
  sun: [
    [12, 12, 4],
    'M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6',
  ],
  arrowLeft: ['M19 12H5', 'M11 6l-6 6 6 6'],
  arrowRight: ['M5 12h14', 'M13 6l6 6-6 6'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, className, ...rest }) {
  const shapes = ICONS[name];
  if (!shapes) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {shapes.map((s, i) =>
        typeof s === 'string' ? (
          <path key={i} d={s} />
        ) : (
          <circle key={i} cx={s[0]} cy={s[1]} r={s[2]} fill={s[3] ? 'currentColor' : 'none'} />
        ),
      )}
    </svg>
  );
}
