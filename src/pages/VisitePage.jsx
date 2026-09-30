import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FacilityInfo from '../components/3d/FacilityInfo';
import HotspotLayer from '../components/3d/HotspotLayer';
import Joystick from '../components/3d/Joystick';
import MiniMap from '../components/3d/MiniMap';
import { visitState } from '../components/3d/visitState';
import Icon from '../components/ui/Icon';
import styles from '../components/3d/visite.module.css';
import { ENTRANCE, OVERVIEW_CAMERA, cameraPresets, facilityById } from '../data/visite';

// La scène (Three.js) est chargée à la demande : le reste du site ne
// télécharge rien de plus tant que l'on n'ouvre pas la visite.
const SpentanaScene = lazy(() => import('../components/3d/SpentanaScene'));

// Si le navigateur ne peut pas afficher la 3D (WebGL indisponible), on
// affiche un message plutôt qu'un écran cassé.
class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Loader({ done }) {
  const [pct, setPct] = useState(4);

  // Progression : avance vers 92 % pendant la préparation, puis 100 % dès
  // que la scène a rendu ses premières images.
  useEffect(() => {
    if (done) return undefined;
    const id = setInterval(() => setPct((p) => p + Math.max(0.4, (92 - p) * 0.07)), 120);
    return () => clearInterval(id);
  }, [done]);

  const shown = done ? 100 : Math.min(92, Math.round(pct));
  return (
    <div className={styles.loader} data-done={done || undefined} aria-hidden={done}>
      <img src="/Logo/LogoSpentana.png" alt="" />
      <h1>SPENTANA ACADEMY</h1>
      <p>Préparation de votre visite…</p>
      <div className={styles.loaderBar}>
        <span style={{ width: `${shown}%` }} />
      </div>
      <span className={styles.loaderPct}>{shown} %</span>
    </div>
  );
}

// VISITE 3D : expérience plein écran, indépendante de la mise en page du site.
// `/visite?lieu=piscine` ouvre directement la fiche d'une infrastructure,
// `/visite?vue=general` un point de vue prédéfini (sans l'introduction),
// `/visite?mode=marche` la visite libre, directement à l'entrée ;
// ajouter `nuit=1` ouvre la visite en mode nuit.
export default function VisitePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const api = useRef(null);
  const [ready, setReady] = useState(false);
  const [mode, setModeState] = useState('intro');
  const [selectedId, setSelectedId] = useState(null);
  // Options d'affichage (menu en haut à droite).
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [night, setNight] = useState(() => params.get('nuit') === '1');
  const [mobile] = useState(
    () => window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 820,
  );

  const setMode = useCallback((next) => {
    visitState.mode = next;
    setModeState(next);
  }, []);

  const flyTo = useCallback((options) => api.current?.flyTo(options), []);

  const select = useCallback(
    (id) => {
      const f = facilityById[id];
      if (!f) return;
      setSelectedId(id);
      if (visitState.mode !== 'aerial') setMode('aerial');
      flyTo({ position: f.cameraPosition, target: f.cameraTarget, duration: 2.4, lift: 8 });
    },
    [flyTo, setMode],
  );

  const showOverview = useCallback(
    (duration = 2.8) => {
      setSelectedId(null);
      if (visitState.mode !== 'aerial') setMode('aerial');
      flyTo({ ...OVERVIEW_CAMERA, duration });
    },
    [flyTo, setMode],
  );

  const startWalk = useCallback(() => {
    setSelectedId(null);
    if (visitState.mode !== 'aerial') setMode('aerial');
    flyTo({
      position: ENTRANCE.walkPosition,
      target: ENTRANCE.walkTarget,
      duration: 3.4,
      onDone: () => setMode('walk'),
    });
  }, [flyTo, setMode]);

  const goPreset = useCallback(
    (preset) => {
      if (preset.facilityId) {
        select(preset.facilityId);
        return;
      }
      setSelectedId(null);
      if (visitState.mode !== 'aerial') setMode('aerial');
      flyTo({ position: preset.position, target: preset.target, duration: 2.6, lift: 6 });
    },
    [flyTo, select, setMode],
  );

  // Première image affichée : séquence d'arrivée (de l'entrée vers la vue
  // d'ensemble), ou accès direct à une infrastructure via `?lieu=`.
  const handleReady = useCallback(() => {
    setReady(true);
    const direct = facilityById[params.get('lieu')];
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (direct) {
      setMode('aerial');
      setSelectedId(direct.id);
      flyTo({ position: direct.cameraPosition, target: direct.cameraTarget, duration: 0.01 });
      return;
    }
    const view = cameraPresets.find((p) => p.id === params.get('vue') && p.position);
    if (view) {
      setMode('aerial');
      flyTo({ position: view.position, target: view.target, duration: 0.01 });
      return;
    }
    if (params.get('mode') === 'marche') {
      setMode('aerial');
      flyTo({
        position: ENTRANCE.walkPosition,
        target: ENTRANCE.walkTarget,
        duration: 0.01,
        onDone: () => setMode('walk'),
      });
      return;
    }
    flyTo({
      ...OVERVIEW_CAMERA,
      duration: calm ? 0.01 : 7,
      lift: 18,
      onDone: () => setMode('aerial'),
    });
  }, [flyTo, params, setMode]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (visitState.mode === 'walk') showOverview();
      else setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      visitState.mode = 'intro';
      visitState.move.x = 0;
      visitState.move.y = 0;
      document.body.style.cursor = '';
    };
  }, [showOverview]);

  // Fiche ouverte : les autres hotspots restent de simples pastilles.
  useEffect(() => {
    visitState.compact = Boolean(selectedId);
  }, [selectedId]);

  const back = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate('/');
  };

  const selected = selectedId ? facilityById[selectedId] : null;
  const walking = mode === 'walk';
  const classes = [styles.page, selected ? styles.hasInfo : '', walking ? styles.walking : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className={styles.stage}>
        <SceneBoundary
          fallback={
            <div className={styles.loader}>
              <h1>SPENTANA ACADEMY</h1>
              <p className={styles.error}>
                La visite 3D ne peut pas s’afficher sur cet appareil (accélération graphique
                indisponible). Essayez avec un autre navigateur, ou découvrez le complexe en photos.
              </p>
              <button type="button" className={styles.cta} onClick={() => navigate('/complexe')}>
                Voir le complexe
              </button>
            </div>
          }
        >
          <Suspense fallback={null}>
            <SpentanaScene
              mobile={mobile}
              night={night}
              onSelect={select}
              onReady={handleReady}
              apiRef={api}
            />
          </Suspense>
        </SceneBoundary>
      </div>

      <Loader done={ready} />

      <header className={styles.topbar}>
        <button type="button" className={`${styles.back} ${styles.glass}`} onClick={back}>
          <Icon name="arrowLeft" size={16} strokeWidth={2.2} />
          <span>Retour au site</span>
        </button>
        <div className={`${styles.brand} ${styles.glass}`}>
          <img src="/Logo/LogoSpentana.png" alt="" />
          <div>
            Spentana Academy
            <small>Visite 3D · Alasora</small>
          </div>
        </div>
        <div className={styles.topRight}>
          <div className={styles.options}>
            <button
              type="button"
              className={`${styles.optionsBtn} ${styles.glass}`}
              onClick={() => setOptionsOpen((o) => !o)}
              aria-expanded={optionsOpen}
              aria-label="Options d’affichage"
            >
              <Icon name="settings" size={18} />
            </button>
            {optionsOpen && (
              <div className={`${styles.optionsMenu} ${styles.glass}`}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showInfo}
                  className={styles.option}
                  onClick={() => setShowInfo((v) => !v)}
                >
                  <Icon name="info" size={17} />
                  <span>Affichage des informations</span>
                  <span className={styles.switch} />
                </button>
                <button
                  type="button"
                  role="switch"
                  aria-checked={night}
                  className={styles.option}
                  onClick={() => setNight((v) => !v)}
                >
                  <Icon name={night ? 'moon' : 'sun'} size={17} />
                  <span>Mode nuit</span>
                  <span className={styles.switch} />
                </button>
              </div>
            )}
          </div>
          <div className={`${styles.modes} ${styles.glass}`}>
            <button
              type="button"
              className={styles.modeBtn}
              aria-pressed={!walking}
              onClick={() => showOverview()}
            >
              Vue aérienne
            </button>
            <button type="button" className={styles.modeBtn} aria-pressed={walking} onClick={startWalk}>
              Visite libre
            </button>
          </div>
        </div>
      </header>

      {ready && (
        <>
          {showInfo && <HotspotLayer selectedId={selectedId} onSelect={select} />}
          <MiniMap mode={mode} selectedId={selectedId} onSelect={select} />
          {selected && <FacilityInfo key={selected.id} facility={selected} onClose={() => setSelectedId(null)} />}
          {walking && mobile && <Joystick />}

          <div className={styles.bottom}>
            {mode === 'intro' && (
              <button type="button" className={styles.cta} onClick={() => showOverview(1)}>
                Passer l’introduction
              </button>
            )}
            {walking && (
              <div className={`${styles.hint} ${styles.glass}`}>
                <kbd>Z</kbd>
                <kbd>Q</kbd>
                <kbd>S</kbd>
                <kbd>D</kbd> ou <kbd>W</kbd>
                <kbd>A</kbd>
                <kbd>S</kbd>
                <kbd>D</kbd> pour avancer · glisser pour regarder · <kbd>Maj</kbd> pour courir ·{' '}
                <kbd>Échap</kbd> pour la vue aérienne
              </div>
            )}
            {mode === 'aerial' && !selected && (
              <button type="button" className={styles.cta} onClick={startWalk}>
                Explorer à pied
                <Icon name="arrowRight" size={16} strokeWidth={2.2} />
              </button>
            )}
            <nav className={`${styles.presets} ${styles.glass}`} aria-label="Points de vue">
              {cameraPresets.map((p) => (
                <button type="button" key={p.id} className={styles.preset} onClick={() => goPreset(p)}>
                  {p.label}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
