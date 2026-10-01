import emailjs from '@emailjs/browser';

// Envoi du formulaire de contact par EmailJS (https://www.emailjs.com), sans
// serveur et sans quitter le site. Les trois identifiants se règlent dans le
// fichier `.env` à la racine du projet (voir `.env.example`) :
//   VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
// Le modèle EmailJS reçoit les variables {{name}}, {{email}}, {{phone}},
// {{subject}} et {{message}}.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export function sendContactEmail(values) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return Promise.reject(new Error('EmailJS non configuré : vérifiez le fichier .env.'));
  }
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, values, { publicKey: PUBLIC_KEY });
}
