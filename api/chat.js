import { GoogleGenAI } from '@google/genai';
import { systemInstruction } from './_spentanaContext.js';
import {
  MAX_MESSAGE_LENGTH,
  checkRateLimit,
  isAllowedOrigin,
  sanitizeHistory,
} from './_guard.js';

const MODEL = 'gemini-3.6-flash';

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

    const response = await ai.models.generateContent({
      model: MODEL,
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
