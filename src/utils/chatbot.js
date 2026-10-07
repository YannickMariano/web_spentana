// Appel de la fonction serveur /api/chat (api/chat.js), qui interroge Gemini
// sans exposer la clé API dans le navigateur.
// `history` : échanges précédents [{ role: 'user' | 'model', text }] pour que
// l'assistant comprenne les questions de suite (« et pour le basket ? »).
const HISTORY_SIZE = 10;

export async function sendMessageToChatbot(userMessage, history = []) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage, history: history.slice(-HISTORY_SIZE) }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.reply) {
    const error = new Error(data.error || `Erreur ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data.reply;
}
