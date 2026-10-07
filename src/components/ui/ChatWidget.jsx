import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import AssistantAvatar from './AssistantAvatar';
import { sendMessageToChatbot } from '../../utils/chatbot';
import { SITE } from '../../constants/site';
import styles from './ChatWidget.module.css';

const WELCOME = {
  role: 'bot',
  text: "Bonjour ! Je suis un assistant virtuel. Je m'appelle SPENTA. En quoi puis-je vous aider ?",
};

const SUGGESTIONS = [
  'Comment inscrire mon enfant ?',
  'Quels sont les tarifs des terrains ?',
  'Quel est le prochain événement ?',
];

// Assistant flottant en bas à droite, présent sur toutes les pages du Layout.
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Sur écran tactile, pas de focus automatique : le clavier s'ouvrirait
  // aussitôt et masquerait la moitié de la fenêtre.
  useEffect(() => {
    if (open && !window.matchMedia('(pointer: coarse)').matches) inputRef.current?.focus();
  }, [open]);

  const scrollToBottom = () => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  };

  useEffect(scrollToBottom, [messages, loading, open]);

  // Zone réellement visible (hors clavier virtuel) exposée en variables CSS :
  // la fenêtre se redimensionne quand le clavier s'ouvre au lieu d'être coupée.
  useEffect(() => {
    const root = rootRef.current;
    const vv = window.visualViewport;
    if (!open || !root || !vv) return undefined;
    const update = () => {
      root.style.setProperty('--chat-vh', `${vv.height}px`);
      root.style.setProperty('--chat-top', `${vv.offsetTop}px`);
      scrollToBottom();
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, [open]);

  // Sur mobile la fenêtre occupe tout l'écran : on bloque le défilement de la page.
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 600px)').matches) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (text) => {
    const message = text.trim();
    if (!message || loading) return;
    // Mémoire de la conversation : échanges réels uniquement (sans le message
    // d'accueil ni les messages d'erreur).
    const history = messages
      .filter((m) => m !== WELCOME && !m.error)
      .map((m) => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }));

    setInput('');
    setMessages((m) => [...m, { role: 'user', text: message }]);
    setLoading(true);
    try {
      const reply = await sendMessageToChatbot(message, history);
      setMessages((m) => [...m, { role: 'bot', text: reply }]);
    } catch (error) {
      console.error('Erreur de connexion :', error);
      const text =
        error.status === 429
          ? `Vous avez envoyé beaucoup de messages. Réessayez un peu plus tard, ou appelez-nous au ${SITE.phone}.`
          : `Désolé, je ne peux pas répondre pour le moment. Vous pouvez nous appeler au ${SITE.phone}.`;
      setMessages((m) => [...m, { role: 'bot', error: true, text }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <div ref={rootRef} className={`${styles.root} ${open ? styles.rootOpen : ''}`}>
      {open && (
        <section className={styles.panel} aria-label="Assistant Spentana">
          <header className={styles.header}>
            <AssistantAvatar size={60} className={styles.avatar} />
            <div className={styles.headerText}>
              <strong>Assistant Spentana</strong>
              <span>Questions sur le complexe et l'Academy</span>
            </div>
            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Fermer l'assistant"
            >
              <Icon name="close" size={18} strokeWidth={2.2} />
            </button>
          </header>

          <div className={styles.messages} ref={listRef} aria-live="polite">
            {messages.map((m, i) => (
              <p
                key={i}
                className={`${styles.bubble} ${m.role === 'user' ? styles.user : styles.bot} ${
                  m.error ? styles.error : ''
                }`}
              >
                {m.text}
              </p>
            ))}
            {loading && (
              <p className={`${styles.bubble} ${styles.bot} ${styles.typing}`} aria-label="L'assistant écrit">
                <span />
                <span />
                <span />
              </p>
            )}
            {showSuggestions && (
              <div className={styles.suggestions}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className={styles.suggestion} onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre question…"
              aria-label="Votre question"
              maxLength={500}
            />
            <button
              type="submit"
              className={styles.send}
              disabled={loading || !input.trim()}
              aria-label="Envoyer"
            >
              <Icon name="arrowRight" size={18} strokeWidth={2.2} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={styles.launcher}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant Spentana"}
      >
        {/* Le robot reste affiché, fenêtre ouverte ou fermée. */}
        <AssistantAvatar size={200} />
      </button>
    </div>
  );
}
