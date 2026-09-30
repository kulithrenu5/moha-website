#!/usr/bin/env python3
"""
OPTIONAL developer tool - regenerates the static HTML pages from shared
partials so the navbar / footer / ornaments stay identical on every page.

The generated .html files at the repository root are plain, hand-editable
static pages: you may edit them directly and never run this script again.
If you prefer, delete this whole tools/ folder - the website does not need it.

    python3 tools/build_pages.py
"""
import os, re, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --------------------------------------------------------------------- icons
IC = {
 "arrow":  '<path d="M4 12h15M13 6l6 6-6 6"/>',
 "chevR":  '<path d="M9 5l7 7-7 7"/>',
 "chevL":  '<path d="M15 5l-7 7 7 7"/>',
 "plus":   '<path d="M12 5v14M5 12h14"/>',
 "x":      '<path d="M6 6l12 12M18 6L6 18"/>',
 "skull":  '<path d="M12 3a7 7 0 0 0-7 7v3.2L4 16h3v3h10v-3h3l-1-2.8V10a7 7 0 0 0-7-7z"/><circle cx="9.4" cy="11" r="1.5"/><circle cx="14.6" cy="11" r="1.5"/>',
 "eye":    '<path d="M2.5 12S6 6.2 12 6.2 21.5 12 21.5 12 18 17.8 12 17.8 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>',
 "play":   '<path d="M8.5 5.5v13l10.5-6.5z"/>',
 "compass":'<circle cx="12" cy="12" r="8.6"/><path d="M15.4 8.6l-2.1 4.7-4.7 2.1 2.1-4.7z"/>',
 "flame":  '<path d="M12 3c3 4 6 6 6 10a6 6 0 0 1-12 0c0-4 3-6 6-10z"/><path d="M12 20.6a3 3 0 0 1-3-3c0-2 1.5-3.1 3-5 1.5 1.9 3 3 3 5a3 3 0 0 1-3 3z"/>',
 "book":   '<path d="M4.5 5a2 2 0 0 1 2-2h13v16h-13a2 2 0 0 0-2 2z"/><path d="M4.5 19a2 2 0 0 1 2-2h13"/>',
 "bolt":   '<path d="M13 2.5L5.5 13H11l-1 8.5L17.5 11H12z"/>',
 "waves":  '<path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/>',
 "shield": '<path d="M12 3l7 2.8V12c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V5.8z"/>',
 "map":    '<path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
 "layers": '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
 "insta":  '<rect x="3.5" y="3.5" width="17" height="17" rx="4.6"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none"/>',
 "yt":     '<rect x="2.5" y="6" width="19" height="12.6" rx="3.6"/><path d="M10.4 9.6l4.7 2.7-4.7 2.7z"/>',
 "tiktok": '<path d="M14.6 3.5v10.9a3.7 3.7 0 1 1-3.7-3.7"/><path d="M14.6 5.3c.7 2 2.4 3.4 4.6 3.6"/>',
 "discord":'<path d="M9 6.3C7.4 6.7 6 7.4 4.9 8.3 3.6 10.9 3.1 13.6 3.4 16.3c1.5 1.1 3 1.8 4.6 2.1l1-1.7"/><path d="M15 6.3c1.6.4 3 1.1 4.1 2 1.3 2.6 1.8 5.3 1.5 8-1.5 1.1-3 1.8-4.6 2.1l-1-1.7"/><path d="M9 6.3c1-.2 2-.3 3-.3s2 .1 3 .3"/><path d="M8.7 16.4c1.1.3 2.2.4 3.3.4s2.2-.1 3.3-.4"/><circle cx="9.7" cy="12" r="1.2"/><circle cx="14.3" cy="12" r="1.2"/>',
}
def icon(name, cls=""):
    return ('<svg class="%s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">%s</svg>'
            % (cls, IC[name]))

# ---------------------------------------------------------------- ornaments
SPRITE_PATH = os.path.join(ROOT, "assets", "svg", "motifs.svg")
_sprite_src = open(SPRITE_PATH).read()
SYMBOLS = "\n".join(re.findall(r"(  <!--.*?</symbol>)", _sprite_src, re.S))
def orn(sym, cls="orn"):
    return ('<svg class="%s" aria-hidden="true" focusable="false"><use href="#%s"></use></svg>' % (cls, sym))

# ------------------------------------------------------------------- shared
def head(title, desc, path):
    return """<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s</title>
<meta name="description" content="%(desc)s">
<meta name="theme-color" content="#050505">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Moha">
<meta property="og:title" content="%(title)s">
<meta property="og:description" content="%(desc)s">
<meta name="twitter:card" content="summary">
<link rel="icon" type="image/svg+xml" href="assets/logos/favicon.svg">
<link rel="stylesheet" href="assets/css/vendor-lenis.css">
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/main.css">
<link rel="preload" href="assets/fonts/cinzel-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/manrope-var.woff2" as="font" type="font/woff2" crossorigin>
<script>document.documentElement.className = "js";</script>
</head>
""" % {"title": html.escape(title), "desc": html.escape(desc)}

ATMO = """
<div class="atmo" aria-hidden="true">
  <div class="fog">
    <div class="fog__layer fog__layer--a"></div>
    <div class="fog__layer fog__layer--b"></div>
    <div class="fog__layer fog__layer--c"></div>
  </div>
  <canvas class="atmo__dust"></canvas>
  <div class="atmo__grain"></div>
  <div class="atmo__vignette"></div>
</div>
"""

VEIL = """
<div class="veil" aria-hidden="true"><span class="veil__mark">M</span></div>
"""

NAV_LINKS = [("index.html", "Home"), ("game.html", "Game"), ("characters.html", "Characters"),
             ("world.html", "World"), ("media.html", "Media")]

def nav(active):
    links = []
    for href, name in NAV_LINKS:
        cls = "nav__link" + (" is-active" if href == active else "")
        cur = ' aria-current="page"' if href == active else ""
        links.append('          <a class="%s" href="%s"%s>%s</a>' % (cls, href, cur, name))
    mlinks = []
    for i, (href, name) in enumerate(NAV_LINKS):
        cls = "mmenu__link" + (" is-active" if href == active else "")
        cur = ' aria-current="page"' if href == active else ""
        mlinks.append('        <a class="%s" href="%s"%s><i>0%d</i>%s</a>' % (cls, href, cur, i + 1, name))
    social = social_rail()
    return """
<header class="nav" id="top">
  <div class="wrap nav__inner">
    <a class="brand" href="index.html" aria-label="Moha - home">
      <span class="brand__mark" aria-hidden="true">M</span>
      <span class="brand__text">
        <span class="brand__name">Moha</span>
        <span class="brand__studio">Black Mirage Studio</span>
      </span>
    </a>
    <nav class="nav__links" aria-label="Primary">
%s
    </nav>
    <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
      <span class="burger__box" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>
  </div>
</header>

<div class="mmenu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu">
  <nav class="mmenu__list" aria-label="Mobile">
%s
  </nav>
  <div class="mmenu__foot">
    <span class="label">Moha &middot; Black Mirage Studio</span>
    <div class="mmenu__social">
%s
    </div>
  </div>
</div>
""" % ("\n".join(links), "\n".join(mlinks), social)

def social_rail():
    out = []
    for key, name, ic in [("instagram", "Instagram", "insta"), ("youtube", "YouTube", "yt"),
                          ("tiktok", "TikTok", "tiktok"), ("discord", "Discord", "discord")]:
        out.append('      <a data-social="%s" data-social-name="%s" href="#" aria-disabled="true" aria-label="%s">%s<span class="rail__tip">Link pending</span></a>'
                   % (key, name, name, icon(ic)))
    return "\n".join(out)

def rail():
    return """
<aside class="rail" aria-label="Official social channels">
%s
</aside>
""" % social_rail()

def footer():
    links1 = "".join('            <a href="%s">%s</a>\n' % (h, n) for h, n in NAV_LINKS)
    links2 = """            <a href="game.html#mechanics">Gameplay mechanics</a>
            <a href="world.html#locations">Key locations</a>
            <a href="world.html#bestiary">Demons &amp; folklore</a>
            <a href="characters.html#mahasona">Mahasona dossier</a>
            <a href="media.html#gallery">Media archive</a>
"""
    social = []
    for key, name, ic in [("instagram", "Instagram", "insta"), ("youtube", "YouTube", "yt"),
                          ("tiktok", "TikTok", "tiktok"), ("discord", "Discord", "discord")]:
        social.append('          <a data-social="%s" data-social-name="%s" href="#" aria-disabled="true" aria-label="%s">%s</a>' % (key, name, name, icon(ic)))
    return """
<footer class="footer">
  <div class="footer__orn" aria-hidden="true">%s</div>
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__about">
        <a class="brand" href="index.html" aria-label="Moha - home">
          <span class="brand__mark" aria-hidden="true">M</span>
          <span class="brand__text">
            <span class="brand__name">Moha</span>
            <span class="brand__studio">Black Mirage Studio</span>
          </span>
        </a>
        <p>Moha is a deeply psychological first-person survival horror game set in the
           haunted forests of Meemure, Sri Lanka. Based on authentic mythology and legends.</p>
        <div class="footer__studio-logo">
          <span class="label">Developed by</span>
          <span class="footer__studio-fallback"><span class="sq" aria-hidden="true">B</span><span>Black Mirage</span></span>
        </div>
      </div>
      <nav aria-label="Footer - explore">
        <h4>Explore</h4>
        <div class="footer__links">
%s        </div>
      </nav>
      <nav aria-label="Footer - the game">
        <h4>The Game</h4>
        <div class="footer__links">
%s        </div>
      </nav>
      <div>
        <h4>Follow</h4>
        <div class="footer__social">
%s
        </div>
        <p class="footer__note" style="margin-top:18px">Official channels will be linked here
           once live. No account is claimed until then.</p>
      </div>
    </div>
    <div class="footer__bar">
      <span>&copy; <span data-year>2026</span> Moha &middot; a Black Mirage Studio project. All rights reserved.</span>
      <span>Sri Lankan folklore survival horror</span>
    </div>
  </div>
</footer>
""" % (orn("motif-moonstone", "orn"), links1, links2, "\n".join(social))

SCRIPTS = """
<script src="assets/js/site-config.js"></script>
<script src="assets/js/vendor/gsap.min.js"></script>
<script src="assets/js/vendor/ScrollTrigger.min.js"></script>
<script src="assets/js/vendor/lenis.min.js"></script>
<script src="assets/js/moha-cursor.js"></script>
<script src="assets/js/moha-atmosphere.js"></script>
<script src="assets/js/moha-motion.js"></script>
<script src="assets/js/moha-ui.js"></script>
"""

def page(fname, title, desc, active, body, sprite=True):
    parts = [head(title, desc, fname)]
    parts.append("<body>\n")
    parts.append('<a class="skip-link" href="#main">Skip to content</a>\n')
    parts.append(VEIL)
    if sprite:
        parts.append('<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">\n' + SYMBOLS + "\n</svg>\n")
    parts.append(ATMO)
    parts.append(nav(active))
    parts.append(rail())
    parts.append('<main id="main">\n' + body + "\n</main>\n")
    parts.append(footer())
    parts.append(SCRIPTS)
    parts.append("</body>\n</html>\n")
    out = "".join(parts)
    with open(os.path.join(ROOT, fname), "w") as f:
        f.write(out)
    print("wrote", fname, len(out), "bytes")

# convenience builders -------------------------------------------------------
def plate(path, ar="16-9", orn_sym="motif-lotus", extra=""):
    """Artwork slot. data-src is empty until real art is dropped in."""
    return ('<span class="plate plate--ar-%s" %s>'
            '<span class="plate__orn" aria-hidden="true">%s</span>'
            '<img data-src="" alt="" loading="lazy" decoding="async">'
            '<span class="plate__tag">artwork pending &middot; %s</span>'
            '</span>') % (ar, extra, orn(orn_sym), path)

def phead(eyebrow, title, lede, eyebrow_blood=False):
    return """
<section class="phead">
  <div class="wrap">
    <p class="eyebrow%s" data-reveal="up">%s</p>
    <h1 class="title title--xl phead__title" data-reveal="up" data-delay="0.08">%s</h1>
    %s
    <div data-reveal="up" data-delay="0.16">%s</div>
  </div>
</section>""" % (" eyebrow--blood" if eyebrow_blood else "", eyebrow, title,
                ('<p class="lede phead__lede" data-reveal="up" data-delay="0.14">%s</p>' % lede) if lede else "",
                orn("motif-moonstone", "orn rule-orn"))
