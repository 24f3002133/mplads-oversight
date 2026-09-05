import { createContext } from 'react';

// The flat view-model that renderVals() produces, shared with every page so
// the split components stay prop-free.
export const ValsContext = createContext(null);
