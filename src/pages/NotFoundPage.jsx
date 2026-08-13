import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <section
      className="section"
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        textAlign: 'center',
      }}
    >
      <span className="eyebrow" style={{ color: 'var(--color-primary)' }}>
        Erreur 404
      </span>
      <h1 style={{ font: '600 clamp(32px,5vw,56px)/1.05 var(--font-display)', margin: 0 }}>
        Cette page est introuvable.
      </h1>
      <p style={{ color: 'var(--color-text)', maxWidth: '40ch' }}>
        Le lien est peut-être cassé ou la page a été déplacée.
      </p>
      <Button to="/" variant="primary">
        Retour à l'accueil
      </Button>
    </section>
  );
}
