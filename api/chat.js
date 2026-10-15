import { GoogleGenAI } from '@google/genai';
import { systemInstruction } from './_spentanaContext.js';
import {
  MAX_MESSAGE_LENGTH,
  checkRateLimit,
  isAllowedOrigin,
  sanitizeHistory,
} from './_guard.js';

// Modèles essayés dans l'ordre : si l'un a son quota épuisé (429), n'existe pas
// (404) ou est surchargé (503), on passe au suivant. Surchargeable via la
// variable d'environnement GEMINI_MODELS (liste séparée par des virgules).
const MODELS = (process.env.GEMINI_MODELS
  ?? 'gemini-3-flash-preview,gemini-2.5-flash,gemini-2.5-flash-lite,gemini-2.0-flash')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

const FALLBACK_STATUSES = new Set([404, 429, 503]);

async function generateWithFallback(ai, request) {
  let lastError;
  for (const model of MODELS) {
    try {
      return await ai.models.generateContent({ ...request, model });
    } catch (error) {
      if (!FALLBACK_STATUSES.has(error?.status)) throw error;
      console.warn(`Modèle ${model} indisponible (${error.status}), essai du suivant`);
      lastError = error;
    }
  }
  throw lastError;
}

// Fonction serveur Vercel : la clé GEMINI_API_KEY reste côté serveur et n'est
// jamais envoyée au navigateur. En local, `npm run dev` sert aussi cette route
// (voir vite.config.js).
//
// Corps attendu : { message: string, history?: [{ role: 'user' | 'model', text }] }
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: 'Origine non autorisée' });
  }

  const { message, history } = req.body ?? {};
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message manquant' });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res
      .status(400)
      .json({ error: `Message trop long (${MAX_MESSAGE_LENGTH} caractères maximum)` });
  }

  const limit = checkRateLimit(req);
  if (!limit.ok) {
    res.setHeader('Retry-After', String(limit.retryAfter));
    return res.status(429).json({ error: 'Trop de messages, réessayez plus tard' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await generateWithFallback(ai, {
      // Mémoire de la conversation : derniers échanges + nouveau message.
      contents: [...sanitizeHistory(history), { role: 'user', parts: [{ text: message.trim() }] }],
      config: {
        // Limite le chatbot aux sujets Spentana (voir _spentanaContext.js).
        systemInstruction: systemInstruction(),
      },
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors de la communication avec Gemini' });
  }
}
