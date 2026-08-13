import { useState } from 'react';
import { contactRows, contactFields } from '../data/contact';
import { SOCIAL_ICONS } from '../constants/site';
import Map from '../components/ui/Map';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // Le formulaire n'est pas relié à un backend : les demandes se règlent par
    // téléphone. Branchez ici votre service d'envoi (email, Formspree…) si
    // besoin. On affiche une confirmation côté client.
    setSent(true);
    e.target.reset();
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

          <form className={styles.form} onSubmit={onSubmit}>
            <h2>Formulaire de contact</h2>
            {contactFields.map((f) => (
              <label className={styles.field} key={f.name}>
                <span>{f.label}</span>
                <input type={f.type} name={f.name} placeholder={f.ph} required />
              </label>
            ))}
            <label className={styles.field}>
              <span>Message</span>
              <textarea rows="4" name="message" placeholder="Dites-nous en quelques mots…" />
            </label>
            <button type="submit" className={styles.submit}>
              Envoyer
            </button>
            {sent && (
              <p className={styles.success} role="status">
                Merci, votre demande a bien été enregistrée. Pour une réponse immédiate,
                appelez-nous au {contactRows[1].v}.
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
