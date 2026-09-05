// Converts the canvas template (a serialized JSX tree) into real JSX modules.
//
//   node tools/jsxify.mjs
//
// Reads  extracted/template.html
// Writes js/pages/*.jsx, js/components/*.jsx, css/fonts.css
//
// The template is not a bespoke template language — it is JSX that has been
// serialized to XML. `sc-camel-on-click` is `onClick`, `sc-raw-td` is `td`,
// `sc-if`/`sc-for` are `&&`/`.map()`. So this is a mechanical transform, and
// keeping it as a script means a newer canvas export can be re-converted.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE = join(ROOT, 'extracted', 'template.html');
const ASSET_INDEX = join(ROOT, 'extracted', 'manifest-index.json');

// uuid -> assets/… path, so bare `src="<uuid>"` becomes a real import that
// Vite can hash and copy. Populated in main().
const ASSETS = new Map();
// Per-file record of which assets were referenced, filled during emit().
let assetRefs = new Set();

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

// Values that are purely a function of theme + density become CSS custom
// properties, so 830 inline styles stop threading the palette through props.
// Verified against the top-level return block of renderVals() — anything
// state-dependent (scopeLocalBg, queueNavBg, tickerBg, item.borderColor …)
// is deliberately absent and stays a JS expression.
const THEME_VARS = {
  pageBg: 'page-bg', sidebarBg: 'sidebar-bg', sidebarBorder: 'sidebar-border',
  cardBg: 'card-bg', borderColor: 'border-color',
  textPrimary: 'text-primary', textSecondary: 'text-secondary', textMuted: 'text-muted',
  headingColor: 'heading-color', bodyColor: 'body-color',
  surfaceMuted: 'surface-muted', surfaceActive: 'surface-active',
  surfaceSubtle: 'surface-subtle', sectorBadgeBg: 'sector-badge-bg',
  mapBg: 'map-bg', mapMuted: 'map-muted',
  primaryColor: 'primary', primaryFg: 'primary-fg',
  riskHighColor: 'risk-high', riskMedColor: 'risk-med', riskClearColor: 'risk-clear',
  riskHighWash: 'risk-high-wash', riskMedWash: 'risk-med-wash', riskClearWash: 'risk-clear-wash',
  copilotAccent: 'copilot-accent', copilotAccentLine: 'copilot-accent-line',
  copilotAccentFg: 'copilot-accent-fg', copilotHeaderBg: 'copilot-header-bg',
  copilotChipBg: 'copilot-chip-bg',
  cellPad: 'cell-pad',
};

// sc-if guards that become their own module. Order matters only for reporting.
const SPLITS = [
  ['showLogin', 'pages', 'Login'],
  ['showRegister', 'pages', 'Register'],
  ['isOverview', 'pages', 'Overview'],
  ['isAllworks', 'pages', 'AllWorks'],
  ['isFundflow', 'pages', 'FundFlow'],
  ['isTracker', 'pages', 'Tracker'],
  ['isQueue', 'pages', 'Queue'],
  ['isContractors', 'pages', 'Contractors'],
  ['isReports', 'pages', 'Reports'],
  ['isSettings', 'pages', 'Settings'],
  ['paletteOpen', 'components', 'CommandPalette'],
  ['copilotOpen', 'components', 'Copilot'],
  ['districtModalOpen', 'components', 'DistrictModal'],
  ['workModalOpen', 'components', 'WorkModal'],
  ['showApp', 'components', 'AppShell'],
];

// Login/Register are the landing screens, so they ship in the entry chunk.
// Everything else — the shell, the ten pages and the four overlays — is
// behind a React.lazy() boundary, so visiting `/` downloads no dashboard.
const EAGER = new Set(['Login', 'Register']);
const isLazy = (split) => !EAGER.has(split.name);

const RESERVED = new Set([
  'true', 'false', 'null', 'undefined', 'this', 'new', 'typeof', 'in', 'of',
  'Math', 'Object', 'Array', 'String', 'Number', 'Boolean', 'JSON', 'Date',
  'React', 'window', 'document', 'console',
]);

/* ---------------------------------------------------------------- parsing */

function parse(src) {
  let i = 0;
  const root = { tag: '#root', attrs: [], children: [] };
  const stack = [root];

  const top = () => stack[stack.length - 1];

  while (i < src.length) {
    const lt = src.indexOf('<', i);
    if (lt === -1) {
      pushText(top(), src.slice(i));
      break;
    }
    if (lt > i) pushText(top(), src.slice(i, lt));

    if (src.startsWith('<!--', lt)) {
      i = src.indexOf('-->', lt) + 3;
      continue;
    }
    if (src.startsWith('<!', lt)) {
      i = src.indexOf('>', lt) + 1;
      continue;
    }
    if (src.startsWith('</', lt)) {
      const gt = src.indexOf('>', lt);
      const tag = src.slice(lt + 2, gt).trim();
      // Close up to the matching open tag; tolerate unclosed inline elements.
      for (let k = stack.length - 1; k > 0; k--) {
        if (stack[k].tag === tag) {
          stack.length = k;
          break;
        }
      }
      i = gt + 1;
      continue;
    }

    const { tag, attrs, end, selfClose } = parseOpenTag(src, lt);
    const node = { tag, attrs, children: [] };
    top().children.push(node);
    if (!selfClose && !VOID.has(tag)) stack.push(node);
    i = end;
  }
  return root;
}

function pushText(parent, text) {
  if (text.length) parent.children.push({ tag: '#text', value: text });
}

function parseOpenTag(src, lt) {
  let i = lt + 1;
  const nameEnd = (() => {
    let k = i;
    while (k < src.length && /[^\s/>]/.test(src[k])) k++;
    return k;
  })();
  const tag = src.slice(i, nameEnd);
  i = nameEnd;

  const attrs = [];
  while (i < src.length) {
    while (/\s/.test(src[i])) i++;
    if (src[i] === '>') return { tag, attrs, end: i + 1, selfClose: false };
    if (src[i] === '/' && src[i + 1] === '>') return { tag, attrs, end: i + 2, selfClose: true };

    let k = i;
    while (k < src.length && /[^\s=/>]/.test(src[k])) k++;
    const name = src.slice(i, k);
    i = k;
    while (/\s/.test(src[i])) i++;

    let value = null;
    if (src[i] === '=') {
      i++;
      while (/\s/.test(src[i])) i++;
      const q = src[i];
      if (q === '"' || q === "'") {
        const close = src.indexOf(q, i + 1);
        value = src.slice(i + 1, close);
        i = close + 1;
      } else {
        let m = i;
        while (m < src.length && /[^\s>]/.test(src[m])) m++;
        value = src.slice(i, m);
        i = m;
      }
    }
    if (name) attrs.push({ name, value });
  }
  return { tag, attrs, end: i, selfClose: false };
}

/* ------------------------------------------------------------ expressions */

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// `sc-camel-dangerously-set-inner-h-t-m-l` -> `dangerouslySetInnerHTML`
function camelProp(kebab) {
  return kebab
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/-([A-Z])/g, (_, c) => c);
}

// Prefix free identifiers with `v.` so pages can pull everything from one
// context object. Loop variables introduced by sc-for stay bare.
function qualify(expr, scope) {
  let out = '';
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      const end = findStringEnd(expr, i);
      out += expr.slice(i, end);
      i = end;
      continue;
    }
    const m = /^[A-Za-z_$][\w$]*/.exec(expr.slice(i));
    if (m) {
      const word = m[0];
      const before = expr.slice(0, i).trimEnd();
      const after = expr.slice(i + word.length).trimStart();
      const isMember = before.endsWith('.') || before.endsWith('?.');
      const isKey = after.startsWith(':');
      if (!isMember && !isKey && !RESERVED.has(word) && !scope.has(word)) {
        out += `v.${word}`;
      } else {
        out += word;
      }
      i += word.length;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

function findStringEnd(s, start) {
  const q = s[start];
  let i = start + 1;
  while (i < s.length) {
    if (s[i] === '\\') { i += 2; continue; }
    if (s[i] === q) return i + 1;
    i++;
  }
  return s.length;
}

const MUSTACHE = /\{\{\s*([\s\S]*?)\s*\}\}/g;
const isPureMustache = (s) => /^\{\{[\s\S]*\}\}$/.test(s.trim()) &&
  s.trim().indexOf('}}') === s.trim().length - 2;

function exprOf(value, scope) {
  return qualify(value.trim().replace(/^\{\{\s*|\s*\}\}$/g, ''), scope);
}

// Build a JS string expression from text that mixes literals and mustaches.
function interpolate(value, scope) {
  if (!value.includes('{{')) return JSON.stringify(value);
  if (isPureMustache(value)) return exprOf(value, scope);
  let out = '`';
  let last = 0;
  for (const m of value.matchAll(MUSTACHE)) {
    out += value.slice(last, m.index).replace(/[\\`$]/g, (c) => '\\' + c);
    out += '${' + qualify(m[1], scope) + '}';
    last = m.index + m[0].length;
  }
  out += value.slice(last).replace(/[\\`$]/g, (c) => '\\' + c) + '`';
  return out;
}

/* ------------------------------------------------------------------ style */

function styleObject(css, scope) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of css) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { parts.push(cur); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur);

  const entries = [];
  for (const raw of parts) {
    const decl = raw.trim();
    if (!decl) continue;
    const colon = splitDecl(decl);
    if (colon === -1) continue;
    const prop = decl.slice(0, colon).trim();
    let value = decl.slice(colon + 1).trim();

    // Theme tokens become var(--…) so the declaration turns static.
    value = value.replace(MUSTACHE, (full, e) => {
      const key = e.trim();
      return THEME_VARS[key] ? `var(--${THEME_VARS[key]})` : full;
    });

    const key = prop.startsWith('--') ? JSON.stringify(prop) : camel(prop);
    entries.push(`${key}: ${interpolate(value, scope)}`);
  }
  return entries;
}

// The first `:` that is not inside a mustache, a url(), or a data: URI.
function splitDecl(decl) {
  let depth = 0;
  for (let i = 0; i < decl.length; i++) {
    if (decl.startsWith('{{', i)) { const e = decl.indexOf('}}', i); i = e === -1 ? decl.length : e + 1; continue; }
    if (decl[i] === '(') depth++;
    if (decl[i] === ')') depth--;
    if (decl[i] === ':' && depth === 0) return i;
  }
  return -1;
}

/* --------------------------------------------------------------- emission */

// HTML attribute -> JSX property, for names JSX does not simply camelCase.
// Only `autofocus` appears in the current export; the rest are here so a
// future canvas export does not silently emit an invalid DOM property.
const RENAME = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex',
  autofocus: 'autoFocus', autocomplete: 'autoComplete', readonly: 'readOnly',
  maxlength: 'maxLength', minlength: 'minLength', spellcheck: 'spellCheck',
  contenteditable: 'contentEditable', colspan: 'colSpan', rowspan: 'rowSpan',
  novalidate: 'noValidate', enctype: 'encType', usemap: 'useMap',
  datetime: 'dateTime', crossorigin: 'crossOrigin', srcset: 'srcSet',
};

function emitAttrs(node, scope) {
  const out = [];
  for (const { name, value } of node.attrs) {
    if (name.startsWith('hint-placeholder')) continue;
    if (name === 'data-dc-script') continue;

    // sc-camel-* is a camelCased JSX prop, but its value is not always a
    // mustache — `sc-camel-view-box="0 0 48 48"` is a plain string.
    if (name.startsWith('sc-camel-')) {
      const prop = camelProp(name.slice('sc-camel-'.length));
      out.push(`${prop}=${attrValue(value ?? '', scope)}`);
      continue;
    }
    if (name === 'style') {
      const entries = styleObject(value ?? '', scope);
      if (entries.length) out.push(`style={{ ${entries.join(', ')} }}`);
      continue;
    }
    const prop = RENAME[name] ?? propName(name);
    if (value === null) { out.push(prop); continue; }
    if (prop === 'src' && ASSETS.has(value)) {
      const a = ASSETS.get(value);
      assetRefs.add(value);
      out.push(`src={${identForAsset(value)}}`);
      // These images sit inside a modal, so they are never part of the first
      // paint; intrinsic dimensions keep them from shifting layout.
      out.push('loading="lazy"', 'decoding="async"');
      if (a.width && a.height) out.push(`width={${a.width}}`, `height={${a.height}}`);
      continue;
    }
    out.push(`${prop}=${attrValue(value, scope)}`);
  }
  return out;
}

// data-* and aria-* stay hyphenated in JSX; every other hyphenated attribute
// (the SVG presentation set — stroke-width, text-anchor …) is camelCased.
function propName(name) {
  if (name.startsWith('data-') || name.startsWith('aria-')) return name;
  return camel(name);
}

// A quoted attribute value -> a JSX attribute value, as either a string
// literal or a braced expression.
function attrValue(value, scope) {
  if (isPureMustache(value)) return `{${exprOf(value, scope)}}`;
  if (value.includes('{{')) return `{${interpolate(value, scope)}}`;
  return JSON.stringify(value);
}

const identForAsset = (uuid) => 'asset_' + uuid.replace(/-/g, '');

function emitText(text, scope) {
  if (!text.includes('{{')) {
    if (!text.trim()) return text.includes('\n') ? '' : text;
    return text.replace(/[{}]/g, (c) => `{'${c}'}`);
  }
  let out = '';
  let last = 0;
  for (const m of text.matchAll(MUSTACHE)) {
    out += text.slice(last, m.index).replace(/[{}]/g, (c) => `{'${c}'}`);
    out += `{${qualify(m[1], scope)}}`;
    last = m.index + m[0].length;
  }
  return out + text.slice(last).replace(/[{}]/g, (c) => `{'${c}'}`);
}

function emit(node, scope, indent, splits) {
  const pad = '  '.repeat(indent);

  if (node.tag === '#text') {
    const t = emitText(node.value, scope);
    return t.trim() ? pad + t.trim() : '';
  }

  if (node.tag === 'sc-if') {
    const cond = node.attrs.find((a) => a.name === 'value')?.value ?? '{{ false }}';
    const key = cond.replace(/[{}\s]/g, '');
    const split = splits.get(key);
    if (split) {
      const outer = assetRefs;
      assetRefs = new Set();
      split.body = node.children.map((c) => emit(c, new Set(scope), 2, splits)).filter(Boolean).join('\n');
      split.assets = assetRefs;
      assetRefs = outer;
      return isLazy(split)
        ? `${pad}{v.${key} && (\n${pad}  <React.Suspense fallback={null}>\n${pad}    <${split.name} />\n${pad}  </React.Suspense>\n${pad})}`
        : `${pad}{v.${key} && <${split.name} />}`;
    }
    const body = node.children.map((c) => emit(c, scope, indent + 1, splits)).filter(Boolean).join('\n');
    return `${pad}{${exprOf(cond, scope)} && (\n${pad}  <>\n${body}\n${pad}  </>\n${pad})}`;
  }

  if (node.tag === 'sc-for') {
    const list = node.attrs.find((a) => a.name === 'list')?.value ?? '{{ [] }}';
    const as = node.attrs.find((a) => a.name === 'as')?.value ?? 'item';
    const inner = new Set(scope);
    inner.add(as);
    inner.add(`${as}Index`);
    const body = node.children.map((c) => emit(c, inner, indent + 2, splits)).filter(Boolean).join('\n');
    return `${pad}{(${exprOf(list, scope)} ?? []).map((${as}, ${as}Index) => (\n` +
      `${pad}  <React.Fragment key={${as}Index}>\n${body}\n${pad}  </React.Fragment>\n` +
      `${pad}))}`;
  }

  const tag = node.tag.startsWith('sc-raw-') ? node.tag.slice('sc-raw-'.length) : node.tag;
  const attrs = emitAttrs(node, scope);
  const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';

  if (VOID.has(tag) || node.children.length === 0) {
    return `${pad}<${tag}${attrStr} />`;
  }

  const body = node.children.map((c) => emit(c, scope, indent + 1, splits)).filter(Boolean).join('\n');
  if (!body) return `${pad}<${tag}${attrStr} />`;
  return `${pad}<${tag}${attrStr}>\n${body}\n${pad}</${tag}>`;
}

/* ------------------------------------------------------------------- main */

function collect(node, pred, out) {
  if (!node) return out;
  if (pred(node)) out.push(node);
  for (const c of node.children ?? []) collect(c, pred, out);
  return out;
}

function findNode(node, pred) {
  if (pred(node)) return node;
  for (const c of node.children ?? []) {
    const hit = findNode(c, pred);
    if (hit) return hit;
  }
  return null;
}

function main() {
  let src = readFileSync(TEMPLATE, 'utf8');

  // Accessibility (WCAG 1.4.3): the login panel's footnote was
  // rgba(250,251,249,0.5), which composites to #8B9BB2 on the #1b3a6b navy —
  // 3.98:1, under the 4.5:1 required for 11.5px text. Alpha 0.57 composites to
  // #9AA8BC = 4.67:1 and stays visibly dimmer than the 0.7 lines above it.
  // Patched here rather than in the generated js/pages/Login.jsx, which this
  // script overwrites on every `npm run convert`.
  const FOOTNOTE_ALPHA = /rgba\(250,251,249,0\.5\)/g;
  if (!FOOTNOTE_ALPHA.test(src)) throw new Error('login footnote rgba(250,251,249,0.5) not found — check jsxify contrast patch');
  src = src.replace(FOOTNOTE_ALPHA, 'rgba(250,251,249,0.57)');

  // Same audit: the login form's helper lines hardcode the old light-theme
  // textMuted #78838C (3.87:1 on white) instead of reading the token. Move
  // them to the new #6C7780 (4.58:1) so they match the palette in
  // tools/split-logic.mjs and css/tokens.css.
  const HARDCODED_MUTED = /color:#78838C/g;
  if (!HARDCODED_MUTED.test(src)) throw new Error('hardcoded #78838C not found — check jsxify contrast patch');
  src = src.replace(HARDCODED_MUTED, 'color:#6C7780');

  const tree = parse(src);

  for (const [uuid, entry] of Object.entries(JSON.parse(readFileSync(ASSET_INDEX, 'utf8')))) {
    if (entry.carried && entry.mime.startsWith('image/')) ASSETS.set(uuid, entry);
  }

  // <helmet> carries two stylesheets: the @font-face payload and the app's
  // own rules (the mp-glow / mp-rec animations). Keep them apart.
  const helmet = findNode(tree, (n) => n.tag === 'helmet');
  const styleNodes = [];
  collect(helmet, (n) => n.tag === 'style', styleNodes);
  const sheets = styleNodes.map((n) => n.children?.[0]?.value ?? '');
  const fontCss = sheets.filter((c) => c.includes('@font-face')).join('\n');
  const appCss = sheets.filter((c) => !c.includes('@font-face')).join('\n');

  mkdirSync(join(ROOT, 'css'), { recursive: true });
  writeFileSync(
    join(ROOT, 'css', 'fonts.css'),
    '/* @font-face rules from the canvas <helmet> block. */\n' +
      fontCss.replace(/url\("([0-9a-f-]{36})"\)/g, (_, u) => `url("../assets/fonts/${u}.woff2")`),
  );
  writeFileSync(
    join(ROOT, 'css', 'app.css'),
    "/* The app's own rules from the canvas <helmet> block (mp-glow, mp-rec). */\n" + appCss,
  );

  const app = findNode(tree, (n) => n.tag === 'x-dc');
  if (!app) throw new Error('no <x-dc> root found');
  app.children = app.children.filter((c) => c.tag !== 'helmet');

  const splits = new Map();
  for (const [key, dir, name] of SPLITS) splits.set(key, { key, dir, name, body: null });

  for (const d of ['pages', 'components']) {
    rmSync(join(ROOT, 'js', d), { recursive: true, force: true });
    mkdirSync(join(ROOT, 'js', d), { recursive: true });
  }

  const rootBody = app.children
    .map((c) => emit(c, new Set(), 3, splits))
    .filter(Boolean)
    .join('\n');

  for (const s of splits.values()) {
    if (s.body === null) {
      console.warn(`  ! guard "${s.key}" never matched — check SPLITS`);
      continue;
    }
    const used = [...splits.values()].filter(
      (o) => o !== s && new RegExp(`<${o.name} />`).test(s.body),
    );
    const imports = [
      ...used.map((o) => (isLazy(o)
        ? `const ${o.name} = React.lazy(() => import('../${o.dir}/${o.name}.jsx'));`
        : `import ${o.name} from '../${o.dir}/${o.name}.jsx';`)),
      ...[...(s.assets ?? [])].map(
        (u) => `import ${identForAsset(u)} from '../../${ASSETS.get(u).file}';`,
      ),
    ].join('\n');
    const file = `import React from 'react';
import { useVals } from '../state/useVals.js';
${imports}

export default function ${s.name}() {
  const v = useVals();
  return (
    <>
${s.body}
    </>
  );
}
`;
    writeFileSync(join(ROOT, 'js', s.dir, `${s.name}.jsx`), file);
  }

  const rootUsed = [...splits.values()].filter((o) => new RegExp(`<${o.name} />`).test(rootBody));
  const rootImports = [
    ...rootUsed.map((o) => (isLazy(o)
      ? `const ${o.name} = React.lazy(() => import('./${o.dir}/${o.name}.jsx'));`
      : `import ${o.name} from './${o.dir}/${o.name}.jsx';`)),
    ...[...assetRefs].map((u) => `import ${identForAsset(u)} from '../${ASSETS.get(u).file}';`),
  ].join('\n');

  writeFileSync(
    join(ROOT, 'js', 'Root.jsx'),
    `import React from 'react';
import { useVals } from './state/useVals.js';
${rootImports}

export default function Root() {
  const v = useVals();
  return (
    <>
${rootBody}
    </>
  );
}
`,
  );

  // Emit the same table as a module so AppState writes exactly the custom
  // properties the JSX now reads. One source of truth for the theme.
  mkdirSync(join(ROOT, 'js', 'state'), { recursive: true });
  writeFileSync(
    join(ROOT, 'js', 'state', 'theme-vars.js'),
    '// GENERATED by tools/jsxify.mjs — do not edit.\n' +
      '// Maps a renderVals() key to the CSS custom property the JSX reads.\n' +
      'export const THEME_VARS = ' + JSON.stringify(THEME_VARS, null, 2) + ';\n',
  );

  console.log('css/fonts.css  ' + (fontCss.length / 1024).toFixed(1) + ' KB');
  console.log('css/app.css    ' + (appCss.length / 1024).toFixed(1) + ' KB');
  for (const s of splits.values()) {
    if (s.body) console.log(`js/${s.dir}/${s.name}.jsx`.padEnd(34) + (s.body.length / 1024).toFixed(1) + ' KB');
  }
  console.log('js/Root.jsx'.padEnd(34) + (rootBody.length / 1024).toFixed(1) + ' KB');
}

main();
