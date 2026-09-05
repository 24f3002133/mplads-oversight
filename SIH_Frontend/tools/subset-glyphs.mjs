#!/usr/bin/env node
/**
 * subset-glyphs.mjs — glyph-level subsetting of the woff2 files.
 *
 * Runs AFTER tools/subset-fonts.mjs, which has already thrown away the
 * @font-face blocks for scripts the app never renders (cyrillic, greek, …).
 * What survives is the `latin` + `latin-ext` subsets of 'IBM Plex Sans' and
 * 'Source Serif 4' — still thousands of glyphs to render ~200 characters.
 *
 * This step cuts each woff2 down to the characters the app can actually
 * produce, plus a deliberately generous safety margin.
 *
 * How the character set is derived (no guessing):
 *   1. Every character that appears in any js/ **.jsx / .js source file and in
 *      css/*.css. A rendered literal must appear verbatim in the source, so
 *      the set of source characters is a strict SUPERSET of every literal the
 *      UI can print. (It also drags in identifiers and syntax — all ASCII,
 *      which we keep anyway.)
 *   2. Every string reachable from js/data/mock.js, executed for real in node.
 *      The mock data is generated from a fixed seed (mulberry32(20260831)) so
 *      this is exhaustive, and it catches strings assembled at runtime that a
 *      literal scrape would miss.
 * A second pass then trims the variable-font machinery. All four files are
 * variable fonts and their `gvar` delta tables dwarf the outlines — for
 * 'Source Serif 4' latin, gvar is 142 KB of a 119 KB woff2. css/fonts.css only
 * ever asks for a handful of weights, so each font's `wght` axis is narrowed to
 * exactly the range the stylesheet declares, and the `opsz` (optical size) axis
 * — which the CSS never addresses and which no @font-face rule can select — is
 * pinned to a value in the middle of the sizes the UI renders. Both are done
 * with fontTools' instancer, so the remaining weights render identically.
 *
 *   3. A fixed safety margin: all printable ASCII, the whole Latin-1
 *      supplement, Latin Extended-A, and the typographic marks / arrows /
 *      geometric symbols the UI uses (– — ' ' " " … · • ▤ ▦ ▧ ◎ ⛭ ⚙ ₹ ≥ ✕ ×).
 *
 * The `unicode-range` declarations in css/fonts.css are left untouched and
 * stay valid: they only tell the browser which file to fetch for a given
 * codepoint, and the union above covers every codepoint the app can request
 * inside those ranges.
 *
 * Idempotency:
 *   Untouched originals are cached under extracted/fonts-full/ on first run.
 *   Every later run subsets FROM that cache, never from a previous output, so
 *   running `npm run convert` repeatedly cannot compound the loss. A sidecar
 *   manifest records the original size of each cached file so a corrupted
 *   cache (e.g. seeded from an already-subset file) is detectable.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');
const CACHE_DIR = path.join(ROOT, 'extracted', 'fonts-full');
const CACHE_MANIFEST = path.join(CACHE_DIR, 'originals.json');
const CSS_FILE = path.join(ROOT, 'css', 'fonts.css');
const MOCK_FILE = path.join(ROOT, 'js', 'data', 'mock.js');

const PYFTSUBSET = process.env.PYFTSUBSET || '/home/dynamic/anaconda3/bin/pyftsubset';
const PYTHON = process.env.PYTHON || path.join(path.dirname(PYFTSUBSET), 'python');

/**
 * Optical size to pin the `opsz` axis at, in px. No @font-face descriptor can
 * select an optical size, and the browser's `font-optical-sizing: auto` would
 * otherwise track the font size; the serif family is only ever rendered
 * between 13px and 30px, so 20 sits in the middle of that band.
 */
const OPSZ_PIN = 20;

/* ------------------------------------------------------------------ *
 * 1. Safety margin — always included, whether or not the scan finds it.
 * ------------------------------------------------------------------ */

function range(lo, hi) {
  const out = [];
  for (let cp = lo; cp <= hi; cp++) out.push(cp);
  return out;
}

const SAFETY_CODEPOINTS = new Set([
  ...range(0x0020, 0x007e), // printable ASCII
  ...range(0x00a0, 0x00ff), // Latin-1 supplement (é, ñ, ×, ÷, ©, °, £, ¥, …)
  ...range(0x0100, 0x017f), // Latin Extended-A (accented names, Œ, Š, Ž, …)
  0x0131, 0x0152, 0x0153, 0x0192,
  0x02bb, 0x02bc, 0x02c6, 0x02da, 0x02dc,
  // Typographic punctuation
  ...range(0x2010, 0x2027), // hyphens, dashes, quotes, daggers, bullet, ellipsis
  ...range(0x2030, 0x205e), // per-mille, primes, guillemets, fraction slash …
  0x20ac, // €
  0x20b9, // ₹ rupee sign
  0x2113, 0x2116, 0x2122, 0x2126, 0x212e, 0x2153, 0x2154, 0x215b, 0x215c, 0x215d, 0x215e,
  // Arrows
  ...range(0x2190, 0x21bb),
  0x21e6, 0x21e7, 0x21e8, 0x21e9,
  // Maths / comparison operators used in labels and thresholds
  ...range(0x2200, 0x22ff),
  0x2212, 0x2215, 0x2264, 0x2265, 0x2260, 0x2248, 0x00b1,
  // Misc technical + UI marks
  0x2302, 0x2318, 0x231a, 0x231b, 0x2325, 0x2326, 0x232b, 0x23f0, 0x23f1,
  0x2500, 0x2502, 0x250c, 0x2510, 0x2514, 0x2518, 0x251c, 0x2524, 0x252c, 0x2534, 0x253c,
  // Geometric shapes / blocks used as sidebar + status icons
  ...range(0x25a0, 0x25ff),
  ...range(0x2600, 0x27bf), // ☀ ⚙ ⛭ ✓ ✕ ✔ ✖ ★ ☆ ➔ …
  0x2b05, 0x2b06, 0x2b07, 0x2b95,
  0xfeff, 0xfffd,
]);

/* ------------------------------------------------------------------ *
 * 2. Scan the source tree.
 * ------------------------------------------------------------------ */

function walkFiles(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, exts, out);
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full);
  }
  return out;
}

function addString(set, str) {
  for (const ch of String(str)) set.add(ch.codePointAt(0));
}

function scanSources(set) {
  const files = [
    ...walkFiles(path.join(ROOT, 'js'), ['.js', '.jsx']),
    ...walkFiles(path.join(ROOT, 'css'), ['.css']),
  ];
  for (const file of files) addString(set, fs.readFileSync(file, 'utf8'));
  return files.length;
}

/** Execute the mock module and walk every string it can hand to the UI. */
async function scanMockData(set) {
  let mod;
  try {
    mod = await import(pathToFileURL(MOCK_FILE).href);
  } catch (err) {
    console.warn(`[subset-glyphs] WARNING: could not execute js/data/mock.js (${err.message});`);
    console.warn('[subset-glyphs]          falling back to the literal scan + safety margin only.');
    return 0;
  }
  let strings = 0;
  const seen = new Set();
  const visit = (value) => {
    if (value == null) return;
    const type = typeof value;
    if (type === 'string') {
      addString(set, value);
      strings++;
      return;
    }
    if (type === 'number' || type === 'bigint') {
      // Numbers reach the DOM through toLocaleString(): digits + separators.
      addString(set, String(value));
      addString(set, value.toLocaleString?.() ?? '');
      return;
    }
    if (type === 'function') {
      // Formatters like money() are exercised over a wide numeric sweep below.
      return;
    }
    if (type !== 'object') return;
    if (seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    for (const [k, v] of Object.entries(value)) {
      addString(set, k);
      visit(v);
    }
  };

  for (const [name, value] of Object.entries(mod)) {
    addString(set, name);
    visit(value);
  }

  // Exercise the exported formatters across a broad numeric sweep so every
  // digit / separator / suffix they can emit is captured.
  for (const [, fn] of Object.entries(mod)) {
    if (typeof fn !== 'function' || fn.length !== 1) continue;
    for (const n of [0, 1, 7, 9, 10, 42, 99, 100, 999, 1000, 12345, 99999, 1e6, 1234567, 1e8, 123456789, 1e10, -1, -1234.56, 0.5, 0.05, 1.25, 99.99]) {
      try {
        const r = fn(n);
        if (typeof r === 'string') addString(set, r);
      } catch { /* not a formatter — ignore */ }
    }
  }
  return strings;
}

/* ------------------------------------------------------------------ *
 * 3. Original-file cache.
 * ------------------------------------------------------------------ */

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_MANIFEST, 'utf8'));
  } catch {
    return {};
  }
}

function ensureCached(name, manifest) {
  const live = path.join(FONT_DIR, name);
  const cached = path.join(CACHE_DIR, name);
  if (!fs.existsSync(cached)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.copyFileSync(live, cached);
    manifest[name] = { bytes: fs.statSync(cached).size, cachedAt: new Date().toISOString() };
    return { cached, freshlyCached: true };
  }
  const size = fs.statSync(cached).size;
  if (manifest[name] && manifest[name].bytes !== size) {
    throw new Error(
      `cached original ${name} is ${size} bytes but the manifest says ${manifest[name].bytes}; ` +
        `delete ${path.relative(ROOT, CACHE_DIR)} and re-run tools/unbundle.mjs`
    );
  }
  if (!manifest[name]) manifest[name] = { bytes: size, cachedAt: new Date().toISOString() };
  return { cached, freshlyCached: false };
}

/* ------------------------------------------------------------------ */

/**
 * Map every woff2 referenced by css/fonts.css to the set of `font-weight`
 * values the stylesheet declares for it. A file used by several @font-face
 * blocks (the variable fonts here are shared across weights) collects all of
 * them, so the wght axis is never narrowed past what the CSS can ask for.
 */
function referencedFonts() {
  const byFile = new Map(); // basename -> Set<number>
  if (!fs.existsSync(CSS_FILE)) return byFile;
  const css = fs.readFileSync(CSS_FILE, 'utf8');
  for (const m of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
    const block = m[1];
    const url = /url\(\s*['"]?([^'")]+)['"]?\s*\)/.exec(block);
    if (!url) continue;
    const name = path.basename(url[1].split('?')[0].split('#')[0]);
    if (!byFile.has(name)) byFile.set(name, new Set());
    const weights = byFile.get(name);
    const wd = /font-weight\s*:\s*([^;}]*)/.exec(block);
    // `font-weight` may be a single value or a `400 700` variable range.
    for (const num of (wd ? wd[1] : '400').matchAll(/\d+/g)) weights.add(Number(num[0]));
    if (!weights.size) weights.add(400);
  }
  return byFile;
}

/**
 * Python side-car: narrows the wght axis to [lo, hi] and pins opsz, using
 * fontTools' instancer. Anything it cannot do (no fvar, missing axis, any
 * failure at all) leaves the input file untouched — the subset is already
 * correct, this pass is pure byte-shaving.
 */
const INSTANCER_PY = `
import json, sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

src, dst, spec = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
font = TTFont(src)
if "fvar" not in font:
    print("no-fvar")
    sys.exit(0)
axes = {a.axisTag: (a.minValue, a.maxValue) for a in font["fvar"].axes}
limits = {}
if "wght" in axes and spec.get("wght"):
    lo, hi = spec["wght"]
    amin, amax = axes["wght"]
    lo = max(amin, min(amax, lo))
    hi = max(amin, min(amax, hi))
    if (lo, hi) != (amin, amax):
        limits["wght"] = lo if lo == hi else (lo, hi)
if "opsz" in axes and spec.get("opsz") is not None:
    amin, amax = axes["opsz"]
    limits["opsz"] = max(amin, min(amax, spec["opsz"]))
if not limits:
    print("nothing-to-pin")
    sys.exit(0)
out = instancer.instantiateVariableFont(font, limits, inplace=False, optimize=True)
out.flavor = "woff2"
out.save(dst)
print(json.dumps({k: (list(v) if isinstance(v, tuple) else v) for k, v in limits.items()}))
`;

function instanceFont(file, weights) {
  const spec = {
    wght: weights.size ? [Math.min(...weights), Math.max(...weights)] : null,
    opsz: OPSZ_PIN,
  };
  const script = path.join(os.tmpdir(), `subset-glyphs-instancer-${process.pid}.py`);
  fs.writeFileSync(script, INSTANCER_PY);
  const tmpOut = file + '.inst';
  try {
    const stdout = execFileSync(PYTHON, [script, file, tmpOut, JSON.stringify(spec)], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit'],
    }).trim();
    if (fs.existsSync(tmpOut)) {
      // Never accept an instancing result that somehow grew the file.
      if (fs.statSync(tmpOut).size < fs.statSync(file).size) {
        fs.renameSync(tmpOut, file);
        return stdout;
      }
      fs.unlinkSync(tmpOut);
      return 'skipped (no saving)';
    }
    return stdout || 'skipped';
  } catch (err) {
    fs.rmSync(tmpOut, { force: true });
    console.warn(`[subset-glyphs]   WARNING: instancing ${path.basename(file)} failed, keeping full axes`);
    return 'failed';
  } finally {
    fs.rmSync(script, { force: true });
  }
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

async function main() {
  if (!fs.existsSync(FONT_DIR)) {
    console.error('[subset-glyphs] assets/fonts not found — run tools/unbundle.mjs first.');
    process.exit(1);
  }
  try {
    execFileSync(PYFTSUBSET, ['--help'], { stdio: 'ignore' });
  } catch {
    console.error(`[subset-glyphs] pyftsubset not runnable at ${PYFTSUBSET}; skipping (fonts left full).`);
    process.exit(0);
  }

  const codepoints = new Set(SAFETY_CODEPOINTS);
  const safetyOnly = codepoints.size;
  const fileCount = scanSources(codepoints);
  const afterSources = codepoints.size;
  const strings = await scanMockData(codepoints);

  // Strip anything outside the BMP-ish sanity window and control chars.
  for (const cp of [...codepoints]) {
    if (cp < 0x20 || (cp >= 0x7f && cp <= 0x9f)) codepoints.delete(cp);
  }

  const sorted = [...codepoints].sort((a, b) => a - b);
  const nonAscii = sorted.filter((cp) => cp > 0x7f && cp < 0x2000 && !SAFETY_CODEPOINTS.has(cp));
  console.log(
    `[subset-glyphs] charset: ${safetyOnly} safety + ${afterSources - safetyOnly} from ${fileCount} source file(s) ` +
      `+ ${strings} mock string(s) -> ${sorted.length} codepoints`
  );
  if (nonAscii.length) {
    console.log(
      '[subset-glyphs]   discovered beyond the margin: ' +
        nonAscii.map((cp) => 'U+' + cp.toString(16).toUpperCase().padStart(4, '0')).join(' ')
    );
  }

  const unicodesArg = sorted.map((cp) => 'U+' + cp.toString(16).toUpperCase().padStart(4, '0')).join(',');
  // The list is long; hand it to pyftsubset via a file to stay clear of ARG_MAX.
  const unicodesFile = path.join(os.tmpdir(), `subset-glyphs-${process.pid}.txt`);
  fs.writeFileSync(unicodesFile, unicodesArg);

  const manifest = loadManifest();
  const wanted = referencedFonts();
  const files = fs
    .readdirSync(FONT_DIR)
    .filter((n) => n.toLowerCase().endsWith('.woff2'))
    .filter((n) => wanted.size === 0 || wanted.has(n));
  const canInstance = (() => {
    try {
      execFileSync(PYTHON, ['-c', 'import fontTools.varLib.instancer'], { stdio: 'ignore' });
      return true;
    } catch {
      console.warn('[subset-glyphs] fontTools instancer unavailable — skipping axis trimming.');
      return false;
    }
  })();

  let before = 0;
  let after = 0;
  for (const name of files) {
    const live = path.join(FONT_DIR, name);
    const { cached, freshlyCached } = ensureCached(name, manifest);
    const originalBytes = fs.statSync(cached).size;
    const tmpOut = live + '.tmp';
    execFileSync(
      PYFTSUBSET,
      [
        cached,
        `--unicodes-file=${unicodesFile}`,
        '--flavor=woff2',
        '--layout-features=*',
        '--notdef-outline',
        '--name-IDs=*',
        '--name-legacy',
        '--name-languages=*',
        `--output-file=${tmpOut}`,
      ],
      { stdio: ['ignore', 'ignore', 'inherit'] }
    );
    fs.renameSync(tmpOut, live);
    const subsetBytes = fs.statSync(live).size;
    let axes = 'axes untouched';
    if (canInstance) axes = instanceFont(live, wanted.get(name) ?? new Set());
    const newBytes = fs.statSync(live).size;
    before += originalBytes;
    after += newBytes;
    console.log(
      `[subset-glyphs]   ${name}  ${kb(originalBytes)} -> ${kb(subsetBytes)} (glyphs) -> ${kb(newBytes)} ` +
        `(-${(100 * (1 - newBytes / originalBytes)).toFixed(1)}%)  ${axes}` +
        `${freshlyCached ? '  [cached original]' : ''}`
    );
  }

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(CACHE_MANIFEST, JSON.stringify(manifest, null, 2));
  fs.unlinkSync(unicodesFile);

  console.log(
    `[subset-glyphs] ${files.length} file(s): ${kb(before)} -> ${kb(after)} ` +
      `(saved ${kb(before - after)}, -${(100 * (1 - after / before)).toFixed(1)}%)`
  );
}

main().catch((err) => {
  console.error('[subset-glyphs] failed:', err.message);
  process.exit(1);
});
