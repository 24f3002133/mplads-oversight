// Splits extracted/component.js into data and state modules.
//
//   node tools/split-logic.mjs
//
// The canvas class is already a React class component (DCLogic resolves to
// React.Component inside the canvas runtime), so almost nothing changes here:
// the seed data moves out, the dynamic asset import becomes a static one, and
// dark mode is rewired to a data-theme attribute + CSS custom properties.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'extracted', 'component.js');

// Line 170 declares the lazily-loaded map data; it is class state in spirit,
// so it stays with the component rather than in the seed-data module.
const MAP_DECL_LINE = 170;
const CLASS_LINE = 184;

function main() {
  const lines = readFileSync(SRC, 'utf8').split('\n');
  const mapDecl = lines[MAP_DECL_LINE - 1];
  const dataSrc = [
    ...lines.slice(0, MAP_DECL_LINE - 1),
    ...lines.slice(MAP_DECL_LINE, CLASS_LINE - 1),
  ].join('\n');
  let classSrc = lines.slice(CLASS_LINE - 1).join('\n');

  const names = [...dataSrc.matchAll(/^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/gm)]
    .map((m) => m[1]);

  mkdirSync(join(ROOT, 'js', 'data'), { recursive: true });
  mkdirSync(join(ROOT, 'js', 'state'), { recursive: true });

  writeFileSync(
    join(ROOT, 'js', 'data', 'mock.js'),
    '// Seed data for the MPLADS prototype, lifted verbatim from the canvas\n' +
      '// export. Everything here is generated from a fixed mulberry32 seed, so\n' +
      '// the numbers are stable across reloads — there is no backend.\n\n' +
      dataSrc.trimEnd() + '\n\nexport {\n  ' +
      names.join(',\n  ') + ',\n};\n',
  );

  // Only the names the component actually mentions get imported.
  const used = names.filter((n) => new RegExp(`\\b${n}\\b`).test(classSrc));

  classSrc = classSrc.replace(
    /^class Component extends DCLogic \{/m,
    'export default class AppState extends React.Component {',
  );

  // componentDidMount fetched the map through the canvas resource table.
  classSrc = classSrc.replace(
    /import\(\(window\.__resources && window\.__resources\.indiaMapData\) \|\| '[^']*'\)/,
    "import('../../assets/js/india-map-data.js')",
  );

  // Accessibility (WCAG 1.4.3): the light palette's textMuted was #78838C,
  // only 3.87:1 on the #fff card — under 4.5:1 for the 11-13px secondary text
  // it paints. #6C7780 is the same hue stepped 12 levels darker: 4.58:1, still
  // clearly muted against textSec #4A555F. The dark palette's #7C8AA0 clears
  // 4.5:1 on the card/page/sidebar it normally sits on but not on the
  // surfaceMuted/surfaceActive chips (4.10:1 / 3.61:1); #8E9CB2 clears every
  // dark surface at >= 4.55:1. Patched here, not in the generated
  // js/state/AppState.jsx, because `npm run convert` rewrites that file.
  // Keep css/tokens.css (--text-muted) in sync with these values.
  for (const [was, now] of [["textMuted:'#78838C'", "textMuted:'#6C7780'"], ["textMuted:'#7C8AA0'", "textMuted:'#8E9CB2'"]]) {
    if (!classSrc.includes(was)) throw new Error(`contrast patch: ${was} not found in component source`);
    classSrc = classSrc.split(was).join(now);
  }

  const header = `import React from 'react';
import Root from '../Root.jsx';
import { ValsContext } from './ValsContext.js';
import { THEME_VARS } from './theme-vars.js';
import {
  ${used.join(',\n  ')},
} from '../data/mock.js';

${mapDecl}

`;

  // The class had renderVals() but no render() — the canvas runtime consumed
  // the view-model directly. Give it a real render() that publishes the
  // view-model through context, and mirror the theme into CSS variables.
  const tail = `
  // The JSX reads colours as var(--…), so the palette is pushed to :root
  // instead of threaded through 830 inline styles.
  syncTheme(vals) {
    const root = document.documentElement;
    root.dataset.theme = this.state.darkMode ? 'dark' : 'light';
    for (const [key, cssVar] of Object.entries(THEME_VARS)) {
      const value = vals[key];
      if (value != null) root.style.setProperty('--' + cssVar, String(value));
    }
  }

  // The India map geometry is 56 KB that only the Overview map reads, so the
  // download is deferred until the dashboard route is actually on screen —
  // the login page must not pull dashboard payload. Memoised, so the repeated
  // calls from componentDidUpdate cost nothing.
  _loadIndiaMap() {
    if (this._indiaMapPromise) return this._indiaMapPromise;
    this._indiaMapPromise = import('../../assets/js/india-map-data.js').then((m) => {
      INDIA_STATE_PATHS = m.INDIA_STATE_PATHS; INDIA_MAP_W = m.INDIA_MAP_W; INDIA_MAP_H = m.INDIA_MAP_H;
      this.forceUpdate();
    });
    return this._indiaMapPromise;
  }

  render() {
    // Cached so componentDidUpdate can sync the theme without recomputing the
    // whole view-model; render itself stays free of DOM side effects.
    this._vals = this.renderVals();
    return (
      <ValsContext.Provider value={this._vals}>
        <Root />
      </ValsContext.Provider>
    );
  }
}
`;
  let closed = classSrc.trimEnd().replace(/\}\s*$/, tail);

  // Hook the theme sync into the existing lifecycle rather than into render.
  closed = closed.replace(
    /(componentDidMount\(\) \{)/,
    '$1\n    this.syncTheme(this._vals ?? {});',
  );
  closed = closed.replace(
    /(  componentWillUnmount\(\) \{)/,
    '  componentDidUpdate() {\n    this.syncTheme(this._vals ?? {});\n' +
      "    if (this.state.route === 'app') this._loadIndiaMap();\n  }\n\n$1",
  );

  // Lift the eager map fetch out of componentDidMount; _loadIndiaMap() (added
  // in `tail`) is driven from componentDidUpdate once route === 'app'.
  const eagerMapFetch =
    /[ \t]*import\('\.\.\/\.\.\/assets\/js\/india-map-data\.js'\)\.then\(\(m\) => \{[\s\S]*?\n[ \t]*\}\);\n/;
  if (!eagerMapFetch.test(closed)) throw new Error('eager india-map fetch not found — check split-logic');
  closed = closed.replace(eagerMapFetch, "    if (this.state.route === 'app') this._loadIndiaMap();\n");

  writeFileSync(
    join(ROOT, 'js', 'state', 'AppState.jsx'),
    header + closed.trimEnd() + '\n',
  );

  writeFileSync(
    join(ROOT, 'js', 'state', 'ValsContext.js'),
    `import { createContext } from 'react';

// The flat view-model that renderVals() produces, shared with every page so
// the split components stay prop-free.
export const ValsContext = createContext(null);
`,
  );

  writeFileSync(
    join(ROOT, 'js', 'state', 'useVals.js'),
    `import { useContext } from 'react';
import { ValsContext } from './ValsContext.js';

export function useVals() {
  const vals = useContext(ValsContext);
  if (!vals) throw new Error('useVals() must be used inside <AppState>');
  return vals;
}
`,
  );

  console.log(`js/data/mock.js        ${(dataSrc.length / 1024).toFixed(1)} KB, ${names.length} exports`);
  console.log(`js/state/AppState.jsx  ${(classSrc.length / 1024).toFixed(1)} KB, ${used.length} imports`);
}

main();
