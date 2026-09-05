// Re-encodes the extracted bitmaps as WebP at display size.
//
//   node tools/optimize-assets.mjs
//
// The canvas export ships 1024x1024 PNGs at ~2-3 MB each. They render inside
// 4/3 panels in the work modal (~450 CSS px, so 900 px covers a 2x screen),
// which makes the PNGs roughly 14x larger than they need to be.
//
// Runs after unbundle.mjs and before jsxify.mjs: it rewrites the asset index
// in place, so the generated JSX imports the .webp files.

import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const INDEX = join(ROOT, 'extracted', 'manifest-index.json');

const MAX_EDGE = 900;
const QUALITY = 80;

function main() {
  if (!existsSync(INDEX)) {
    throw new Error('extracted/manifest-index.json missing — run tools/unbundle.mjs first');
  }
  const index = JSON.parse(readFileSync(INDEX, 'utf8'));

  let before = 0;
  let after = 0;
  let n = 0;

  for (const [uuid, entry] of Object.entries(index)) {
    if (!entry.carried || !entry.mime.startsWith('image/')) continue;
    if (entry.mime === 'image/webp' || entry.mime === 'image/svg+xml') continue;

    const src = join(ROOT, entry.file);
    if (!existsSync(src)) continue;

    const dest = src.slice(0, -extname(src).length) + '.webp';
    execFileSync('magick', [
      src,
      '-resize', `${MAX_EDGE}x${MAX_EDGE}>`,
      '-quality', String(QUALITY),
      '-strip',
      dest,
    ]);

    const wasBytes = entry.bytes;
    const nowBytes = readFileSync(dest).length;
    // Intrinsic size lets the JSX carry width/height, which fixes layout shift.
    const [w, h] = execFileSync('magick', ['identify', '-format', '%w %h', dest])
      .toString().trim().split(' ').map(Number);
    before += wasBytes;
    after += nowBytes;
    n += 1;

    rmSync(src);
    index[uuid] = {
      ...entry,
      file: dest.slice(ROOT.length + 1),
      mime: 'image/webp',
      bytes: nowBytes,
      width: w,
      height: h,
    };

    console.log(
      `  ${(wasBytes / 1e6).toFixed(2)} MB -> ${(nowBytes / 1e3).toFixed(0)} KB  ${uuid.slice(0, 8)}`,
    );
  }

  writeFileSync(INDEX, JSON.stringify(index, null, 2));
  console.log(
    `\n${n} images: ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(2)} MB ` +
      `(${(before / after).toFixed(1)}x smaller)`,
  );
}

main();
