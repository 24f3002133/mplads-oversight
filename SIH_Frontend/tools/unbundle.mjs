// Unpacks the Claude Design Canvas standalone export into readable source.
//
//   node tools/unbundle.mjs
//
// Reads the 15 MB single-file export and writes:
//   assets/          every manifest asset, gunzipped, with a real extension
//   extracted/       template.html + component.js, pretty-printed
//   extracted/manifest-index.json   uuid -> filename map
//
// Re-runnable: safe to delete assets/ and extracted/ and run again.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(ROOT, '..', 'MPLADS Oversight - Standalone (24) (1).html');

const ASSETS = join(ROOT, 'assets');
const EXTRACTED = join(ROOT, 'extracted');

// The two runtime blobs are the canvas interpreter and its loader; npm React
// replaces them, so we keep them out of assets/ but stash them for reference.
const RUNTIME_UUIDS = new Set([
  '92785059-1ad6-4f4b-b56a-0e9467b34de4',
  'b8c72d56-b9f2-402c-9e1a-e573d10c5387',
]);

const EXT_BY_MIME = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/gif': 'gif',
  'font/woff2': 'woff2',
  'font/woff': 'woff',
  'font/ttf': 'ttf',
  'text/javascript': 'js',
  'application/javascript': 'js',
  'text/css': 'css',
  'application/json': 'json',
};

const dirFor = (mime) =>
  mime.startsWith('image/') ? 'img' : mime.startsWith('font/') ? 'fonts' : 'js';

function findBundlerBlock(html, type) {
  const open = `<script type="__bundler/${type}">`;
  const start = html.indexOf(open);
  if (start === -1) throw new Error(`no __bundler/${type} block found`);
  const from = start + open.length;
  const end = html.indexOf('</script>', from);
  return JSON.parse(html.slice(from, end).trim());
}

function main() {
  console.log('reading export…');
  const html = readFileSync(SOURCE, 'utf8');
  console.log(`  ${(html.length / 1e6).toFixed(1)} MB`);

  const manifest = findBundlerBlock(html, 'manifest');
  const extResources = findBundlerBlock(html, 'ext_resources');
  const template = findBundlerBlock(html, 'template');

  for (const d of [ASSETS, EXTRACTED]) rmSync(d, { recursive: true, force: true });
  for (const d of ['img', 'fonts', 'js']) mkdirSync(join(ASSETS, d), { recursive: true });
  mkdirSync(join(EXTRACTED, 'runtime'), { recursive: true });

  // ext_resources gives real names to three of the UUIDs.
  const nameByUuid = new Map();
  for (const { id, uuid } of extResources) {
    if (id === 'indiaMapData') nameByUuid.set(uuid, 'india-map-data');
    else if (id.includes('react-dom')) nameByUuid.set(uuid, 'react-dom.umd');
    else if (id.includes('react')) nameByUuid.set(uuid, 'react.umd');
  }

  const index = {};
  let total = 0;
  let n = 0;

  for (const [uuid, entry] of Object.entries(manifest)) {
    let bytes = Buffer.from(entry.data, 'base64');
    if (entry.compressed) bytes = gunzipSync(bytes);

    const ext = EXT_BY_MIME[entry.mime] ?? 'bin';
    const base = nameByUuid.get(uuid) ?? uuid;
    const name = `${base}.${ext}`;

    // React UMD builds are superseded by the npm dependency; the canvas runtime
    // is not carried forward at all. Both land in extracted/runtime/ instead.
    const isDiscardable = RUNTIME_UUIDS.has(uuid) || base.startsWith('react');
    const out = isDiscardable
      ? join(EXTRACTED, 'runtime', name)
      : join(ASSETS, dirFor(entry.mime), name);

    writeFileSync(out, bytes);
    if (!isDiscardable) {
      total += bytes.length;
      n += 1;
    }
    index[uuid] = {
      file: out.slice(ROOT.length + 1),
      mime: entry.mime,
      bytes: bytes.length,
      carried: !isDiscardable,
    };
  }

  writeFileSync(
    join(EXTRACTED, 'manifest-index.json'),
    JSON.stringify(index, null, 2),
  );

  // Split the template into its three parts. The x-dc script is the app logic;
  // everything before it is markup (with the font-face <style> at the top).
  const scriptOpen = template.search(/<script type="text\/x-dc"[^>]*>/);
  const scriptTagEnd = template.indexOf('>', scriptOpen) + 1;
  const scriptClose = template.indexOf('</script>', scriptTagEnd);
  if (scriptOpen === -1 || scriptClose === -1) {
    throw new Error('could not locate the text/x-dc script in the template');
  }

  const markup = template.slice(0, scriptOpen);
  const logic = template.slice(scriptTagEnd, scriptClose);

  writeFileSync(join(EXTRACTED, 'template.html'), markup);
  writeFileSync(join(EXTRACTED, 'component.js'), logic.trim() + '\n');
  writeFileSync(join(EXTRACTED, 'template.full.html'), template);

  console.log(`\nassets/      ${n} files, ${(total / 1e6).toFixed(1)} MB`);
  console.log(`extracted/   template.html  ${(markup.length / 1024).toFixed(1)} KB`);
  console.log(`             component.js   ${(logic.length / 1024).toFixed(1)} KB`);
  console.log(`             runtime/       ${Object.values(index).filter((e) => !e.carried).length} files (reference only)`);
}

main();
