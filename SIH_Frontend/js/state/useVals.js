import { useContext } from 'react';
import { ValsContext } from './ValsContext.js';

export function useVals() {
  const vals = useContext(ValsContext);
  if (!vals) throw new Error('useVals() must be used inside <AppState>');
  return vals;
}
