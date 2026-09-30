import { createContext } from 'react';

// Vrai en mode nuit. Fourni par SpentanaScene, lu par les lots d'objets pour
// allumer les fenêtres, les projecteurs et les lampadaires.
export const NightContext = createContext(false);
