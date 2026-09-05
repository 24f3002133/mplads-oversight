import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import AppState from './state/AppState.jsx';

import '../css/fonts.css';
import '../css/tokens.css';
import '../css/base.css';
import '../css/app.css';

// tools/prerender.mjs bakes the login screen into dist/index.html, so in a
// production build the markup is already on screen by the time this module
// runs — hydrate it in place instead of throwing it away and re-rendering.
// `vite dev` serves the source index.html with an empty #root, which has no
// markup to hydrate, so fall back to a client render there.
// Returning users land straight on the dashboard, which otherwise loads as a
// four-hop waterfall: this chunk -> AppShell -> Overview -> india-map-data,
// each request waiting on the one before it. When a session already exists we
// know all four are needed, so start them in parallel now and collapse the
// waterfall to a single round trip. Guarded on the session so a logged-out
// visitor (the page Lighthouse scores by default) downloads nothing extra.
try {
  if (window.localStorage.getItem('mplads.session')) {
    import('./components/AppShell.jsx');
    import('./pages/Overview.jsx');
    import('../assets/js/india-map-data.js');
  }
} catch (e) {
  // localStorage can throw in private mode; the app loads fine without this.
}

const container = document.getElementById('root');
if (container.firstChild) {
  hydrateRoot(container, <AppState />);
} else {
  createRoot(container).render(<AppState />);
}
