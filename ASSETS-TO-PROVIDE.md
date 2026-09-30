# Assets still to be provided

The website is complete and fully functional **without** any of the files below.
Every slot renders as a labelled, art-directed placeholder plate so nothing ever
looks broken. This document is the single checklist of what is outstanding and
exactly where each file goes.

> Rule followed throughout: nothing was invented. No logo, mascot, screenshot,
> trailer, social account or character fact has been fabricated. Where an asset
> is missing there is a placeholder structure and a comment/path telling you
> where the real file belongs.

---

## 1. Logos (from Figma)

| File to provide | Place at / register in | Used on |
|---|---|---|
| Full "Moha" logo | `assets/js/site-config.js` → `brand.logo` | navbar + footer wordmark |
| The "M" mark | `assets/js/site-config.js` → `brand.mark` | navbar tile, footer tile, loading veil |
| BLACK MIRAGE logo | `assets/js/site-config.js` → `brand.studio` | footer "Developed by" block |
| Browser tab icon | overwrite `assets/logos/favicon.svg` | all pages |

Until provided, a typographic Cinzel wordmark + monogram tile is used, which is
deliberately neutral and easy to replace.

## 2. Mascot (from Figma)

| File | Place at | Used on |
|---|---|---|
| Moha mascot (transparent PNG/SVG) | `assets/js/site-config.js` → `mascot` (suggested `assets/images/mascot/moha-mascot.png`) | floats in the hero corner with a slow breathing animation |

The mascot element is **not rendered at all** until the file exists, so it can
never cover text or show as a gap.

## 3. Character artwork

| File | Used on |
|---|---|
| `assets/images/characters/mahasona.jpg` (3:4 portrait, ~1200x1600) | Characters dossier, Home teaser |

Further characters: none added. The dossier page carries a sealed-placeholder
row that is replaced when you send the character document; all future copy will
be transcribed from that document verbatim.

## 4. Folklore / bestiary art (5 demon sculpt previews)

| File | Used on |
|---|---|
| `assets/images/folklore/mahasona.jpg` | Home folklore viewer (or reuse the character art) |
| `assets/images/folklore/mohini.jpg` | Home folklore viewer, World bestiary |
| `assets/images/folklore/kalukumaraya.jpg` | Home folklore viewer, World bestiary |
| `assets/images/folklore/ririyaka.jpg` | Home folklore viewer, World bestiary |
| `assets/images/folklore/kinduri.jpg` | Home folklore viewer, World bestiary |

## 5. Gallery (media archive) - 16:9, ~1600x900

| File | Caption on site |
|---|---|
| `assets/images/gallery/ritigala-ruins.jpg` | The Ancient Ruins of Ritigala |
| `assets/images/gallery/walawwa-interior.jpg` | Inside the Abandoned Walawwa |
| `assets/images/gallery/mahasona-shadow.jpg` | Mahasona's Shadow |
| `assets/images/gallery/mohini-call.jpg` | The Call of Mohini |
| `assets/images/gallery/canopy-fog-concept.jpg` | Forest Canopy Fog Concept |
| `assets/images/gallery/moonlit-paddy.jpg` | Moonlit Paddy Fields |

Add more items by copying any `<button class="gitem">` block in `media.html`.

## 6. World / game imagery

| File | Used on |
|---|---|
| `assets/images/locations/ritigala.jpg` | World - key locations |
| `assets/images/locations/meemure.jpg` | World - key locations |
| `assets/images/locations/walawwa.jpg` | World - key locations |
| `assets/images/game/flagship-ue5.jpg` | Game - flagship title split |
| `assets/images/game/thovil-ritual.jpg` | Game - mechanics split |

## 7. Video (real files only - no embeds, no invented trailers)

| File | Register in | Behaviour |
|---|---|---|
| `assets/videos/clips/moha-trailer.mp4` | `site-config.js` → `videos.trailer.src` | HTML5 player on MEDIA page |
| `assets/videos/poster/moha-trailer-poster.jpg` | `site-config.js` → `videos.trailer.poster` | poster frame |
| `assets/videos/clips/hero-ambient.mp4` (optional) | `site-config.js` → `hero.video` | muted + looped hero backdrop |
| `assets/images/hero/moha-hero.jpg` (optional) | `site-config.js` → `hero.image` | static hero backdrop |

## 8. Social accounts (real URLs only)

Register in `site-config.js` → `social`: `instagram`, `youtube`, `tiktok`,
`discord`. Until a URL is supplied the icon stays visible in the side rail,
mobile menu and footer but is disabled and tooltips "Link pending" - no fake
accounts are claimed anywhere.

---

### How a drop-in works (no rebuild)

1. Copy the file to the exact path above.
2. Refresh. The plate's tag disappears and the real artwork fades in.

Images are referenced with `loading="lazy"` and `decoding="async"`; keep files
under ~400 KB where possible.
