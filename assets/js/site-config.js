/* ==========================================================================
   Moha - site configuration  ★ THE ONLY FILE YOU NEED TO EDIT ★
   --------------------------------------------------------------------------
   Everything below is optional. The website is fully functional with all
   values empty: artwork slots render as labelled placeholder plates and
   social buttons render as disabled "link pending" chips.

   When you receive the real Figma exports / videos / mascot, drop the files
   into the folders shown and type the path here. Nothing else to change.
   ========================================================================== */

window.Moha = {

  /* ------------------------------------------------------------------ BRAND
     Official logo files from Figma.
       logo   -> full "Moha" lockup      (used in navbar + footer if provided)
       mark   -> the "M" mark only      (navbar tile, loading veil, favicon-size uses)
       studio -> the BLACK MIRAGE logo  (footer)
     Leave "" to keep the built-in typographic wordmark / monogram.          */
  brand: {
    logo:   "",   // e.g. "assets/logos/moha-logo.svg"
    mark:   "",   // e.g. "assets/logos/moha-m-mark.svg"
    studio: ""    // e.g. "assets/logos/black-mirage-logo.svg"
  },

  /* ---------------------------------------------------------------- MASCOT
     The Moha mascot artwork from Figma (transparent PNG/SVG recommended).
     When set, it floats in the hero corner with a slow breathing animation. */
  mascot: "",     // e.g. "assets/images/mascot/moha-mascot.png"

  /* ------------------------------------------------------------ HERO MEDIA
     Optional cinematic hero backdrop. Leave empty for the procedural
     atmosphere (fog + dust + light). A video, if set, plays muted + looped. */
  hero: {
    image: "",    // e.g. "assets/images/hero/moha-hero.jpg"
    video: ""     // e.g. "assets/videos/clips/hero-ambient.mp4"
  },

  /* ---------------------------------------------------------------- VIDEOS
     Real trailer / teaser files only. Never point these at third-party URLs.
     When a trailer source is set the MEDIA page shows an HTML5 player with a
     poster frame and proper controls; until then a clean placeholder plate
     is shown instead. */
  videos: {
    trailer: {
      src:    "",  // e.g. "assets/videos/clips/moha-trailer.mp4"
      poster: ""   // e.g. "assets/videos/poster/moha-trailer-poster.jpg"
    }
  },

  /* ---------------------------------------------------------------- SOCIAL
     Official accounts only. Provide real URLs when they exist; while empty
     the icons stay visible but disabled (no fake links anywhere).          */
  social: {
    instagram: "",  // e.g. "https://www.instagram.com/..."
    youtube:   "",  // e.g. "https://www.youtube.com/@..."
    tiktok:    "",  // e.g. "https://www.tiktok.com/@..."
    discord:   ""   // e.g. "https://discord.gg/..."
  }
};
