#!/usr/bin/env node
/**
 * subset-fonts.mjs — post-processing step for css/fonts.css.
 *
 * Runs AFTER tools/jsxify.mjs (which GENERATES css/fonts.css from the canvas
 * <helmet> block). jsxify emits every Google-Fonts subset the original export
 * carried — cyrillic, greek, vietnamese and friends — none of which this app
 * can ever render. Each one is a render-blocking @font-face rule plus a woff2
 * on disk, so we strip them here rather than hand-editing the generated file.
 *
 * What it does:
 *   1. Parses every @font-face block out of css/fonts.css.
 *   2. Drops blocks whose `unicode-range` is for a script the app never uses.
 *   3. Adds `font-display: swap` to any surviving block that lacks it.
 *   4. Deletes woff2 files in assets/fonts/ that nothing references any more.
 *   5. Writes css/fonts.css back.
 *
 * Safety / idempotency:
 *   - Classification is driven by `unicode-range`, not by the `/* subset *​/`
 *     comment, so a renamed or missing comment cannot cause a wrong drop.
 *   - Only ranges on an explicit DROP list are removed. Anything unrecognised
 *     (including Devanagari, which the UI needs for "भारत सरकार") is KEPT.
 *     A missing glyph is much worse than a few extra KB.
 *   - A woff2 is deleted only if NO surviving block references it, and only if
 *     it lives under assets/fonts/.
 *   - Re-running on already-subset CSS is a no-op.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CSS_FILE = path.join(ROOT, 'css', 'fonts.css');
const FONT_DIR = path.join(ROOT, 'assets', 'fonts');

/**
 * Scripts this app never renders. Each entry is matched against the block's
 * unicode-range; a block is dropped only when it is *dominated* by the script
 * (see `classify`). Keep this list conservative — additions are cheap to
 * verify, wrong removals show up as tofu boxes in production.
 */
const DROP_SCRIPTS = [
  // name,    representative codepoints that only that script would claim
  { name: 'cyrillic', probes: [0x0400, 0x0410, 0x045f] },
  { name: 'cyrillic-ext', probes: [0x0460, 0x0500, 0xa640] },
  { name: 'greek', probes: [0x0391, 0x03a9, 0x03c9] },
  { name: 'greek-ext', probes: [0x1f00, 0x1f50, 0x1ffe] },
  { name: 'vietnamese', probes: [0x1ea0, 0x1ec7, 0x1ef9] },
  { name: 'hebrew', probes: [0x05d0, 0x05ea] },
  { name: 'arabic', probes: [0x0627, 0x0649] },
  { name: 'thai', probes: [0x0e01, 0x0e2e] },
  { name: 'korean', probes: [0xac00, 0xd7a3] },
  { name: 'japanese', probes: [0x3042, 0x30a2] },
  { name: 'chinese-simplified', probes: [0x4e00, 0x9fa5] },
];

/** Codepoints the app actually needs. If a block covers any of these it is
 *  kept no matter what else it contains. Derived from grepping js/ for
 *  non-ASCII: Latin, the Devanagari of "भारत सरकार" / "सत्यमेव जयते",
 *  the rupee sign ₹ (U+20B9, latin-ext) and assorted punctuation/arrows. */
const REQUIRED_CODEPOINTS = [
  0x0041, // 'A' — latin
  0x00e9, // 'é' — latin supplement
  0x0100, // 'Ā' — latin-ext
  0x20b9, // '₹' — rupee sign, lives in the latin-ext range
  0x2014, // '—' em dash
  0x0905, // 'अ' — devanagari
  0x092d, // 'भ' — devanagari (भारत)
  0x0940, // 'ी' — devanagari vowel sign
];

/** Parse "U+0400-045F, U+2116" into [[lo,hi], ...]. */
function parseUnicodeRange(text) {
  const out = [];
  for (const raw of text.split(',')) {
    const token = raw.trim();
    const m = /^U\+([0-9A-Fa-f?]{1,6})(?:-([0-9A-Fa-f]{1,6}))?$/.exec(token);
    if (!m) continue;
    if (m[1].includes('?')) {
      // Wildcard form, e.g. U+04??
      out.push([
        parseInt(m[1].replace(/\?/g, '0'), 16),
        parseInt(m[1].replace(/\?/g, 'F'), 16),
      ]);
    } else {
      const lo = parseInt(m[1], 16);
      out.push([lo, m[2] === undefined ? lo : parseInt(m[2], 16)]);
    }
  }
  return out;
}

const covers = (ranges, cp) => ranges.some(([lo, hi]) => cp >= lo && cp <= hi);

/**
 * Decide the fate of one block.
 * Returns { keep: boolean, reason: string }.
 */
function classify(ranges) {
  if (!ranges.length) return { keep: true, reason: 'no parsable unicode-range' };

  // Anything the app demonstrably needs wins outright.
  const needed = REQUIRED_CODEPOINTS.filter((cp) => covers(ranges, cp));
  if (needed.length) {
    return {
      keep: true,
      reason: `covers required codepoint(s) ${needed
        .map((c) => 'U+' + c.toString(16).toUpperCase().padStart(4, '0'))
        .join(', ')}`,
    };
  }

  const hit = DROP_SCRIPTS.find((s) => s.probes.some((cp) => covers(ranges, cp)));
  if (hit) return { keep: false, reason: hit.name };

  return { keep: true, reason: 'unrecognised range — kept for safety' };
}

/** Split the stylesheet into text chunks and @font-face blocks. */
function parse(css) {
  const parts = [];
  // Grab any /* subset */ comment sitting immediately above the block so it
  // is dropped along with it instead of being orphaned.
  const re = /(?:[^\S\n]*\/\*[^*]*\*\/[^\S\n]*\n)?[^\S\n]*@font-face\s*\{[^}]*\}\n?/g;
  let last = 0;
  let m;
  while ((m = re.exec(css)) !== null) {
    // The leading-comment group also matches the file header comment when it
    // happens to precede the first block; only swallow it if it looks like a
    // subset label (a single lowercase word).
    let start = m.index;
    let text = m[0];
    const lead = /^([^\S\n]*\/\*\s*([^*]*?)\s*\*\/[^\S\n]*\n)/.exec(text);
    if (lead && !/^[a-z][a-z0-9-]*$/.test(lead[2])) {
      start += lead[1].length;
      text = text.slice(lead[1].length);
    }
    if (start > last) parts.push({ type: 'text', text: css.slice(last, start) });
    parts.push({ type: 'block', text });
    last = re.lastIndex;
  }
  if (last < css.length) parts.push({ type: 'text', text: css.slice(last) });
  return parts;
}

/** Ensure a block declares font-display: swap. */
function ensureFontDisplay(block) {
  if (/font-display\s*:/.test(block)) return { text: block, changed: false };
  // Insert just before `src:` (or, failing that, before the closing brace),
  // matching the indentation already in use.
  const anchor = /^([^\S\n]*)src\s*:/m.exec(block);
  if (anchor) {
    return {
      text: block.replace(anchor[0], `${anchor[1]}font-display: swap;\n${anchor[0]}`),
      changed: true,
    };
  }
  return {
    text: block.replace(/\}/, '  font-display: swap;\n}'),
    changed: true,
  };
}

function main() {
  if (!fs.existsSync(CSS_FILE)) {
    console.error(`[subset-fonts] ${path.relative(ROOT, CSS_FILE)} not found — run jsxify first.`);
    process.exit(1);
  }

  const original = fs.readFileSync(CSS_FILE, 'utf8');
  const parts = parse(original);

  const dropped = new Map(); // reason -> count
  let kept = 0;
  let displayAdded = 0;
  const referenced = new Set();

  const out = [];
  for (const part of parts) {
    if (part.type !== 'block') {
      out.push(part.text);
      continue;
    }
    const rangeMatch = /unicode-range\s*:\s*([^;}]*)/.exec(part.text);
    const ranges = rangeMatch ? parseUnicodeRange(rangeMatch[1]) : [];
    const verdict = classify(ranges);

    if (!verdict.keep) {
      dropped.set(verdict.reason, (dropped.get(verdict.reason) || 0) + 1);
      continue;
    }

    const fixed = ensureFontDisplay(part.text);
    if (fixed.changed) displayAdded++;
    kept++;
    out.push(fixed.text);

    for (const u of fixed.text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
      referenced.add(path.basename(u[1].split('?')[0].split('#')[0]));
    }
  }

  // Collapse any run of blank lines left behind by removed blocks.
  const result = out.join('').replace(/\n{3,}/g, '\n\n');

  if (result !== original) {
    fs.writeFileSync(CSS_FILE, result);
  }

  // Sweep unreferenced woff2 files.
  const removedFiles = [];
  let freedBytes = 0;
  let remainingBytes = 0;
  if (fs.existsSync(FONT_DIR)) {
    for (const name of fs.readdirSync(FONT_DIR)) {
      if (!name.toLowerCase().endsWith('.woff2')) continue;
      const full = path.join(FONT_DIR, name);
      const size = fs.statSync(full).size;
      if (referenced.has(name)) {
        remainingBytes += size;
      } else {
        fs.unlinkSync(full);
        removedFiles.push(name);
        freedBytes += size;
      }
    }
  }

  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log('[subset-fonts] @font-face blocks kept: ' + kept);
  if (dropped.size) {
    for (const [reason, n] of [...dropped].sort()) {
      console.log(`[subset-fonts]   dropped ${n} block(s): ${reason}`);
    }
  } else {
    console.log('[subset-fonts]   nothing to drop (already subset)');
  }
  if (displayAdded) {
    console.log(`[subset-fonts] added font-display: swap to ${displayAdded} block(s)`);
  }
  if (removedFiles.length) {
    console.log(
      `[subset-fonts] deleted ${removedFiles.length} unreferenced woff2 (${kb(freedBytes)} freed)`
    );
  }
  console.log(
    `[subset-fonts] assets/fonts now holds ${referenced.size} file(s), ${kb(remainingBytes)}; ` +
      `css/fonts.css is ${kb(Buffer.byteLength(result))}`
  );

  // Loud warning if the CSS references a file we do not have.
  for (const name of referenced) {
    if (!fs.existsSync(path.join(FONT_DIR, name))) {
      console.warn(`[subset-fonts] WARNING: css references missing font file ${name}`);
    }
  }
}

main();
