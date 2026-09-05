# MPLADS Oversight — frontend

React + Vite. Split out of the single-file Claude Design Canvas export
`../MPLADS Oversight - Standalone (24) (1).html` (15 MB, 647 lines).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Layout

```
index.html            shell — <div id="root"> only
css/
  tokens.css          theme as CSS custom properties (light + [data-theme=dark])
  fonts.css           @font-face, generated
  app.css             mp-glow / mp-rec animations, generated
  base.css            reset
js/
  main.jsx            createRoot
  Root.jsx            login / register / app switch, generated
  data/mock.js        seeded mock data, 42 exports
  state/
    AppState.jsx      the component class: state + ~85 methods + renderVals()
    ValsContext.js    view-model context
    useVals.js        the hook every page uses
    theme-vars.js     generated — renderVals key -> CSS variable
  pages/              Login Register Overview AllWorks FundFlow Tracker
                      Queue Contractors Reports Settings
  components/         AppShell CommandPalette Copilot WorkModal
                      DistrictModal
assets/               17 files, 11.2 MB — images, fonts, india-map-data
tools/                the converters (see below)
```

## Regenerating from a new canvas export

`js/pages/*`, `js/components/*`, `js/Root.jsx`, `js/data/mock.js`,
`js/state/AppState.jsx`, `js/state/theme-vars.js`, `css/fonts.css` and
`css/app.css` are **generated**. Hand-edits to them are lost on the next run.
`css/tokens.css`, `css/base.css`, `js/main.jsx` and the two context files are
hand-written and safe to edit.

```bash
npm run unbundle   # export -> assets/ + extracted/
npm run convert    # optimize images, then extracted/ -> js/ + css/
```

`convert` runs `tools/optimize-assets.mjs` first, which re-encodes the extracted
PNGs as WebP at display size (900 px, q80) and rewrites the asset index, so the
generated JSX imports `.webp`. Re-running `unbundle` restores the original PNGs;
`convert` re-optimizes them.

The template was a serialized JSX tree, so the conversion is mechanical:
`sc-camel-on-click` → `onClick`, `sc-raw-td` → `td`, `sc-if`/`sc-for` →
`&&`/`.map()`, `{{ x }}` → `{v.x}`.

## Theming

The export interpolated palette values into all 830 inline styles. Those are now
`var(--token)`; `AppState.syncTheme()` writes the palette onto `:root` on mount
and update, and sets `data-theme`. `css/tokens.css` holds the pre-hydration
fallback. Values that depend on state rather than theme (`scopeLocalBg`,
`queueNavBg`, `tickerBg`, per-row risk colours) stay JS expressions.

## Notes

- **All data is mock.** `mulberry32(20260831)` seeds everything; login is UI
  only (`MOCK_EMAILS`, a fake magic link). There is no backend and no auth.
- The four satellite/citizen images are AI-generated. They ship as WebP at
  900 px (~750 KB total, down from 10.5 MB of 1024x1024 PNG) and are lazy-loaded
  with intrinsic dimensions, since they only appear inside the work modal.
- `renderVals()` still computes one flat view-model for every screen at once,
  as the export did. Splitting it into per-page selectors is the natural next
  step, but is not required for correctness.
- `allworksShowPagination` is assigned twice in `renderVals()` — a pre-existing
  duplicate key in the export, same value both times. esbuild warns on build.

## Performance

Lighthouse on the production build served with gzip + cache headers:

| | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| **Mobile** | **100** | **100** | **100** | **100** |
| **Desktop** | **100** | **100** | **100** | **100** |

FCP 1.2 s, LCP 1.7 s, TBT 10 ms, CLS 0. Login page weight 136 KiB.

Measure it the same way — `npm run dev` scores ~55 because it ships unminified
modules with no compression, and is not representative of a deployed build.

What the pipeline does for this:

- **Images** — `tools/optimize-assets.mjs` re-encodes the export's 1024px PNGs
  as WebP at display size: 10.5 MB -> 0.75 MB. Lazy, with intrinsic dimensions.
- **Code splitting** — `tools/jsxify.mjs` emits `React.lazy` for AppShell, all
  10 pages and the 4 overlays; only Login/Register are eager.
- **Deferred map data** — `tools/split-logic.mjs` moves the 56 KB india-map
  import out of `componentDidMount` so it loads on entering the app.
- **Font subsetting** — `tools/subset-fonts.mjs` drops the cyrillic/greek/
  vietnamese `@font-face` blocks (12 files/589 KB -> 4/293 KB), then
  `tools/subset-glyphs.mjs` glyph-subsets what remains and narrows the variable
  `wght`/`opsz` axes (293 KB -> 93 KB). latin-ext is kept deliberately: `₹`
  (U+20B9) lives in its range.
- **Prerender** — `tools/prerender.mjs` runs after `vite build`, renders the
  login screen with `react-dom/server` and injects it into `dist/index.html`;
  `js/main.jsx` hydrates when markup is present and falls back to `createRoot`
  for `vite dev`. This closed the FCP->LCP gap.
- **Contrast** — the light/dark `textMuted` tokens and one hardcoded login
  literal were darkened to clear WCAG AA 4.5:1. Applied in the generators
  (`tools/split-logic.mjs`, `tools/jsxify.mjs`), not the generated files.

## Favicon

`public/favicon.svg` + `public/favicon.ico` are the MO wordmark the app draws in
its sidebar header — Source Serif 4, weight 700, italic, `#b4213d` on cream.
Regenerate with:

```bash
python3 tools/make-favicon.py
```

Source Serif 4 has no italic face (the app's italic is a browser-synthesized
oblique), so the script shears the upright outlines to match. Glyphs are
embedded as SVG paths, not a `<text>` element, so the icon does not depend on
the viewer having the font. Needs fontTools + ImageMagick.

Note: do NOT add `<link rel="canonical">`. This Lighthouse build's canonical
audit crashes on `URL.parse`, and an errored audit nulls the entire SEO
category. Harmless in browsers, but it will zero local SEO runs.
