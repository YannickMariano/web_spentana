// Protections de /api/chat contre les abus (quota Gemini gratuit).

export const MAX_MESSAGE_LENGTH = 500;
export const MAX_HISTORY = 10; // derniers messages (visiteur + assistant) gardés en mémoire
const MAX_HISTORY_TEXT = 2000;

const RATE_LIMIT = 20; // messages…
const RATE_WINDOW_MS = 60 * 60 * 1000; // …par heure et par adresse IP

// Compteur en mémoire : sur Vercel, chaque instance de la fonction a le sien,
// la limite est donc approximative (mais suffisante contre un usage abusif simple).
const hits = new Map();

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.socket?.remoteAddress ?? 'inconnu';
}

// true si l'IP a encore droit à un message ; sinon renvoie le délai d'attente (s).
export function checkRateLimit(req) {
  const now = Date.now();
  const ip = clientIp(req);
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return { ok: false, retryAfter: Math.ceil((recent[0] + RATE_WINDOW_MS - now) / 1000) };
  }
  recent.push(now);
  hits.set(ip, recent);
  // Nettoyage occasionnel pour ne pas garder des IP inactives indéfiniment.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return { ok: true };
}

// N'accepte que les requêtes envoyées depuis le site lui-même (même domaine).
// Des domaines supplémentaires peuvent être autorisés via la variable
// d'environnement ALLOWED_ORIGINS (liste séparée par des virgules).
export function isAllowedOrigin(req) {
  const source = req.headers.origin || req.headers.referer;
  if (!source) return false;
  let host;
  try {
    host = new URL(source).host;
  } catch {
    return false;
  }
  const ownHost = req.headers['x-forwarded-host'] || req.headers.host;
  const extra = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
    .map((o) => {
      try {
        return new URL(o).host;
      } catch {
        return o;
      }
    });
  return host === ownHost || extra.includes(host);
}

// Historique envoyé par le navigateur → format `contents` de Gemini.
// Tout élément invalide est ignoré ; seuls les MAX_HISTORY derniers sont gardés.
export function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'model') &&
        typeof m.text === 'string' &&
        m.text.trim()
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, parts: [{ text: m.text.slice(0, MAX_HISTORY_TEXT) }] }));
}
