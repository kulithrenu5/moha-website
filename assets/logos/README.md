# Logo drop-in folder

Placeholders are in use until the official Figma exports arrive:
- navbar / footer show a typographic "Moha" wordmark + an "M" monogram tile
- the page veil (loading transition) shows the same monogram
- `favicon.svg` is a neutral placeholder mark

To swap in the real assets, export them from Figma and either
1. set the paths in `assets/js/site-config.js` -> `brand` (recommended), or
2. overwrite `favicon.svg` here for the browser tab icon.

Suggested filenames: `moha-logo.svg`, `moha-m-mark.svg`, `black-mirage-logo.svg`.
Use SVG (or transparent PNG at 2x) so the marks stay crisp on dark backgrounds.
