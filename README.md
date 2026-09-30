# Moha — cinematic promotional website

A **frontend-only**, static, cinematic promotional website for *Moha*, a Sri
Lankan folklore survival horror game by Black Mirage Studio.

Open `index.html` directly in a browser, or drop the folder onto any static
host. There is **no backend, no database, no build step and no npm required**.

```
moha-website/
├── index.html          HOME      hero · folklore viewer · mechanics · Mahasona teaser · gallery preview
├── game.html           GAME      flagship title · studio vision · survival-horror mechanics
├── characters.html     CHARACTERS  Mahasona dossier (premium RPG-style character sheet)
├── world.html          WORLD     story · exorcist's diary · key locations · demons & folklore bestiary
├── media.html          MEDIA     trailer slot (HTML5-ready) · filterable gallery · lightbox
├── 404.html                      error page, on-brand
├── ASSETS-TO-PROVIDE.md          checklist of every outstanding logo/art/video file + exact paths
└── assets/
    ├── css/            fonts.css · main.css · vendor-lenis.css
    ├── js/             site-config.js ★ edit me ★ · moha-ui · moha-motion · moha-cursor · moha-atmosphere
    │   └── vendor/     gsap 3.15 · ScrollTrigger 3.15 · lenis 1.3.26 (all local, no CDN)
    ├── fonts/          Cinzel · Cormorant Garamond · Manrope (self-hosted variable woff2, OFL)
    ├── svg/            motifs.svg - original Kandyan/Sri Lankan ornamental line-art sprite
    ├── logos/          favicon placeholder + README (drop Figma logos here)
    ├── images/         artwork drop-in folders (see ASSETS-TO-PROVIDE.md)
    └── videos/         trailer + poster drop-in folders
```

## Run it

* **Locally:** double-click `index.html`, or `python3 -m http.server 8000` for a
  served preview (recommended while editing).
* **GitHub Pages / Netlify / Vercel / Cloudflare Pages:** publish this folder as
  the site root. No configuration needed; `404.html` is picked up automatically.

## Edit it

* **Brand, logos, mascot, videos, social links:** `assets/js/site-config.js`
  (one file, commented).
* **Copy / sections:** edit the HTML pages directly. They are plain, readable
  markup with no templating.
* **Colours, type, spacing, components:** `assets/css/main.css` (design tokens
  at the top).
* `tools/` is an *optional* developer convenience that regenerates the six pages
  from shared partials (navbar/footer/ornaments). You may delete `tools/` and
  keep editing the HTML by hand - nothing at runtime depends on it.

## What is built in

* **Brand:** the name is written exactly "Moha" everywhere - navbar, hero,
  headings, page titles, metadata, footer, mobile menu, loading veil and 404.
* **Presentation-only:** navigation, smooth scrolling (Lenis), scroll/parallax
  reveals (GSAP + ScrollTrigger), page transitions, custom cursor, gallery
  lightbox, hover states. Nothing else.
* **Custom cursor:** centre dot + interpolated ring; expands on links, soft
  circle on imagery, "VIEW" indicator on gallery tiles, magnetic pull on primary
  buttons. Automatically disabled on touch devices, coarse pointers, viewports
  under 1024 px and for `prefers-reduced-motion`.
* **Atmosphere:** drifting fog sheets, film grain, vignette, dust/ember canvas,
  cinematic staggered entrances - all GPU-cheap, all disabled or reduced under
  `prefers-reduced-motion`.
* **Sri Lankan identity:** original ornamental line-art (lotus/nelum rosettes,
  liyawel creeper bands, moonstone/sandakada-pahana dividers, torana niche
  frames, flame palmettes) drawn for this project in `assets/svg/motifs.svg`.
  No Sinhala script is used as decoration.
* **Accessibility:** skip link, landmarks, focus-visible rings, keyboard tab
  viewer + lightbox (arrows/Esc/Tab trap), alt text, aria labels, reduced-motion
  support, readable contrast on the dark palette.
* **Responsive:** 1920 → 375 px with dedicated layouts (mobile menu, single
  column dossiers, side rail folded into the menu + footer). No horizontal
  overflow.

## What was removed from the previous version

The earlier Next.js application (login/admin/CRUD, Prisma + SQLite, newsletter,
analytics, contact forms, localStorage/sessionStorage app state, synthesised
Web-Audio gate, fake Steam/YouTube/Discord/Twitter links, invented release-date
roadmap and the university-project disclaimer) has been retired. It remains in
git history at commit `01dcdf5` on `main` if you ever need to reference it.

All narrative copy (lore, bestiary, mechanics, locations, gallery captions) was
carried over verbatim from that project - nothing was invented.

## Third-party licences

* GSAP + ScrollTrigger © GreenSock - standard licence (bundled locally).
* Lenis © Studio Freight - MIT (bundled locally).
* Cinzel, Cormorant Garamond, Manrope - SIL Open Font License 1.1
  (see `assets/fonts/LICENSE-*.txt`).
