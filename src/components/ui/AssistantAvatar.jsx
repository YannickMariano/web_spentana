import { useCallback, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Animation Lottie de l'assistant. Déposez le fichier ici :
//   public/Chatbot/assistant.lottie
// Tant qu'il est absent (ou illisible), une icône de bulle s'affiche à la place.
export const ASSISTANT_ANIMATION = '/Chatbot/assistant.lottie';

function FallbackIcon({ size }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size * 0.55}
      height={size * 0.55}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.6" />
    </svg>
  );
}

export default function AssistantAvatar({ size = 40, className }) {
  const [failed, setFailed] = useState(false);

  const onInstance = useCallback((dotLottie) => {
    dotLottie?.addEventListener('loadError', () => setFailed(true));
  }, []);

  return (
    <span
      className={className}
      style={{ width: size, height: size, display: 'grid', placeItems: 'center' }}
      aria-hidden="true"
    >
      {failed ? (
        <FallbackIcon size={size} />
      ) : (
        <DotLottieReact
          src={ASSISTANT_ANIMATION}
          loop
          autoplay
          dotLottieRefCallback={onInstance}
          style={{ width: size, height: size }}
        />
      )}
    </span>
  );
}
