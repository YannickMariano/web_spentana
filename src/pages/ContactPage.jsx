import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contactRows, contactFields } from '../data/contact';
import { SOCIAL_ICONS } from '../constants/site';
import Map from '../components/ui/Map';
import { sendContactEmail } from '../utils/sendContactEmail';
import styles from './ContactPage.module.css';

// `/contact?sujet=Témoignage` préremplit le champ Sujet et amène le visiteur
// directement au formulaire (bouton « Faire un témoignage » de l'accueil).
const MESSAGE_PLACEHOLDERS = {
  Témoignage: 'Racontez-nous votre expérience à Spentana…',
};

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const presetSubject = searchParams.get('sujet') ?? '';
  const formRef = useRef(null);
  // idle | sending | sent | error
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!presetSubject || !formRef.current) return;
    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    formRef.current.querySelector('input[name="name"]')?.focus({ preventScroll: true });
  }, [presetSubject]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    // Champ piège invisible : rempli uniquement par les robots.
    if (data.website) return;
    delete data.website;

    setStatus('sending');
    try {
      await sendContactEmail(data);
      setStatus('sent');
      form.reset();
    } catch (err) {
      console.error('Envoi du formulaire impossible :', err);
      setStatus('error');
    }
  };

  return (
    <>
      <section className="section">
        <div className={`container ${styles.grid}`}>
          <div className={styles.info}>
            <span className={styles.eyebrow}>Contact</span>
            <h1 className={styles.title}>Parlons de votre visite.</h1>
            <div className={styles.rows}>
              {contactRows.map((c) => (
                <div className={styles.row} key={c.k}>
                  <span>{c.k}</span>
                  <span>{c.v}</span>
                </div>
              ))}
            </div>
            <div className={styles.socials}>
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className={styles.socialTag}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          <form
            ref={formRef}
            key={presetSubject}
            className={styles.form}
            onSubmit={onSubmit}
            style={{ scrollMarginTop: 100 }}
          >
            <h2>Formulaire de contact</h2>
            {contactFields.map((f) => (
              <label className={styles.field} key={f.name}>
                <span>{f.label}</span>
                <input
                  type={f.type}
                  name={f.name}
                  placeholder={f.ph}
                  defaultValue={f.name === 'subject' ? presetSubject : undefined}
                  required
                />
              </label>
            ))}
            <label className={styles.field}>
              <span>Message</span>
              <textarea
                rows="4"
                name="message"
                required
                placeholder={MESSAGE_PLACEHOLDERS[presetSubject] ?? 'Dites-nous en quelques mots…'}
              />
            </label>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className={styles.honeypot}
            />
            <button type="submit" className={styles.submit} disabled={status === 'sending'}>
              {status === 'sending' ? 'Envoi en cours…' : 'Envoyer'}
            </button>
            {status === 'sent' && (
              <p className={styles.success} role="status">
                Merci, votre message a bien été envoyé. Nous vous répondrons rapidement. Pour une
                réponse immédiate, appelez-nous au {contactRows[1].v}.
              </p>
            )}
            {status === 'error' && (
              <p className={styles.error} role="alert">
                L'envoi a échoué. Réessayez dans un instant ou écrivez-nous directement à{' '}
                {contactRows[3].v}.
              </p>
            )}
          </form>
        </div>
      </section>

      <section className={styles.map}>
        <Map minHeight={380} title="Itinéraire vers Spentana Academy sur Google Maps" />
      </section>
    </>
  );
}
