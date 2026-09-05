#!/usr/bin/env node
/**
 * prerender.mjs — bake the login screen into dist/index.html.
 *
 * Runs AFTER `vite build`. Without it the first paint has to wait for the
 * module graph to download, parse and boot React before a single pixel of the
 * login card exists, which is exactly the FCP -> LCP gap Lighthouse reports.
 * Rendering the initial state to static markup moves the card into the HTML
 * document itself; React then hydrates it in place (see js/main.jsx).
 *
 * How it works:
 *   1. Vite builds an SSR bundle from a generated entry that simply re-exports
 *      js/state/AppState.jsx. Going through Vite (rather than a bespoke JSX
 *      transform) means the SSR bundle resolves imports exactly the way the
 *      client bundle does.
 *   2. react-dom/server renders <AppState /> — whose initial state is
 *      `route: 'login'` — to a string.
 *   3. The markup is injected into the EXISTING dist/index.html between
 *      <div id="root"> and </div>. Everything else in that file, <head>
 *      included, is passed through untouched: the head is owned by the source
 *      index.html and must survive verbatim.
 *
 * Determinism: the login render path reads no clock, no random source and no
 * browser API (AppState only touches window/document from componentDidMount
 * onwards), so the server markup matches React's first client render and
 * hydration is silent. If that ever stops being true, hydration warnings in
 * the console are the signal.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_HTML = path.join(ROOT, 'dist', 'index.html');
const ROOT_OPEN = '<div id="root">';
const ROOT_CLOSE = '</div>';

async function buildSsrBundle() {
  const { build } = await import('vite');
  // The temp dir lives inside the project so that node can resolve `react`
  // and `react-dom/server` from ./node_modules when the bundle is imported.
  const workDir = fs.mkdtempSync(path.join(ROOT, 'node_modules', '.mplads-prerender-'));
  const entry = path.join(workDir, 'ssr-entry.jsx');
  fs.writeFileSync(
    entry,
    [
      "import React from 'react';",
      "import { renderToString } from 'react-dom/server';",
      `import AppState from ${JSON.stringify(path.join(ROOT, 'js', 'state', 'AppState.jsx'))};`,
      '',
      'export function render() {',
      '  return renderToString(React.createElement(AppState));',
      '}',
      '',
    ].join('\n')
  );

  await build({
    root: ROOT,
    configFile: path.join(ROOT, 'vite.config.js'),
    logLevel: 'warn',
    build: {
      ssr: entry,
      outDir: path.join(workDir, 'out'),
      emptyOutDir: true,
      // CSS is already shipped by the client build; the SSR pass only needs
      // markup, so anything non-JS the graph pulls in is inert here.
      cssCodeSplit: false,
      minify: false,
      rollupOptions: { output: { format: 'esm', entryFileNames: 'ssr-entry.mjs' } },
    },
  });

  return { workDir, bundle: path.join(workDir, 'out', 'ssr-entry.mjs') };
}

function inject(html, markup) {
  const open = html.indexOf(ROOT_OPEN);
  if (open === -1) {
    throw new Error(`could not find ${ROOT_OPEN} in dist/index.html`);
  }
  const contentStart = open + ROOT_OPEN.length;
  const close = html.indexOf(ROOT_CLOSE, contentStart);
  if (close === -1) throw new Error('unterminated <div id="root"> in dist/index.html');
  const existing = html.slice(contentStart, close).trim();
  if (existing) {
    // A previous prerender (or another tool) already filled the root. Replace
    // it rather than nesting a second copy, so the step stays idempotent.
    console.log('[prerender] replacing existing #root content');
  }
  return html.slice(0, contentStart) + markup + html.slice(close);
}

async function main() {
  if (!fs.existsSync(DIST_HTML)) {
    console.error('[prerender] dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }

  const { workDir, bundle } = await buildSsrBundle();
  let markup;
  try {
    const mod = await import(pathToFileURL(bundle).href);
    markup = mod.render();
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }

  if (!markup || markup.length < 500) {
    throw new Error(`suspiciously small render output (${markup ? markup.length : 0} bytes) — refusing to inject`);
  }
  if (!/भारत सरकार/.test(markup)) {
    throw new Error('rendered markup does not look like the login screen — refusing to inject');
  }

  const before = fs.readFileSync(DIST_HTML, 'utf8');
  const after = inject(before, markup);
  fs.writeFileSync(DIST_HTML, after);

  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log(
    `[prerender] injected ${kb(Buffer.byteLength(markup))} of login markup; ` +
      `dist/index.html ${kb(Buffer.byteLength(before))} -> ${kb(Buffer.byteLength(after))}`
  );
}

main().catch((err) => {
  console.error('[prerender] failed:', err.stack || err.message);
  process.exit(1);
});
