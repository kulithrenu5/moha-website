#!/usr/bin/env python3
"""Regenerates the six static pages. See build_lib.py docstring."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_lib import page, plate, phead, orn, icon

# ============================================================ shared content
# All copy below is carried over verbatim from the original project's approved
# content (lore, bestiary, mechanics, locations). No facts were invented.
DEMONS = [
    dict(id="mahasona", name="Mahasona", title="The King of Cemeteries",
         desc="A colossal, 12-foot-tall demon with the head of a fierce bear (or lion) turned backward, riding a giant black boar. He was once Jayasena, a human giant of legendary strength, who was decapitated in a duel of honor. His friends panic-attached a bear's head to revive him. Shamed and filled with absolute hatred, he became the supreme stalker of the dead.",
         mech="Sound-based tracker. He cannot see, but has hyper-acute hearing. Running or stepping on twigs will immediately reveal your location. When he approaches, your flashlight will flicker and chromatic aberration will distort your screen.",
         quote="&ldquo;His paw slams onto the victim&rsquo;s back, leaving a cold blue bruise that rots the soul in hours.&rdquo;",
         img="assets/images/characters/mahasona.jpg"),
    dict(id="mohini", name="Mohini", title="The Ghostly Mother",
         desc="Appears under the full moon as an ethereal, beautiful young woman dressed in white, cradling a baby on lonely forest roads. She asks travelers to hold her child for a moment while she ties her hair. Anyone who takes the baby falls under an instant curse, as the baby turns into a demonic doll and Mohini reveals her fanged, rotting visage.",
         mech="A siren-like illusion entity. She lures you with soft, echoing baby cries. If you approach, you must maintain eye contact and walk backward slowly. Turning your back or running triggers an instant throat-slitting charge.",
         quote="&ldquo;Can you hold my child, traveler? Just for a second&hellip;&rdquo;",
         img="assets/images/folklore/mohini.jpg"),
    dict(id="kalukumaraya", name="Kalukumaraya", title="The Dark Prince",
         desc="A shadowy, seductive demon prince who haunts the dreams of young women and travelers sleeping in old manor houses (Walawwas). He manifests as a dark cloud or a handsome black-clad youth, inducing sleep paralysis, severe night sweats, and physical weakness, slowly draining the victim's life force.",
         mech="A dream-state predator. He spawns while you investigate the indoor bedrooms of the Walawwa. He attacks by raising the room temperature and inducing hallucinations. You must find hidden talisman mirrors to reflect his gaze and break the sleep paralysis.",
         quote="&ldquo;Do not fall asleep in the master bedroom. He is already waiting.&rdquo;",
         img="assets/images/folklore/kalukumaraya.jpg"),
    dict(id="ririyaka", name="Ririyaka", title="The Blood Demon",
         desc="A small, manic, and highly hyperactive demon who is perpetually drenched in blood. He carries a small club and has skin covered in raw sores. Ririyaka is the physical manifestation of high fevers, hemorrhages, and pure animalistic bloodlust, dwelling near moonlit paddy fields and stagnant waters.",
         mech="A high-speed skirmisher. Ririyaka travels in packs. They attack from the tall paddy grasses, biting and inflicting a bleeding status effect. Wielding an ancient iron sickle or using salt-water Thovil powder are the only ways to repel them.",
         quote="&ldquo;He drinks the blood of cattle and men, leaving dry husks in the mud.&rdquo;",
         img="assets/images/folklore/ririyaka.jpg"),
    dict(id="kinduri", name="Kinduri", title="The Forest Siren",
         desc="A tragic, weeping creature with the upper torso of a pregnant woman and the lower body of a majestic bird. In ancient folklore, she was a pregnant woman banished to the jungle who died in childbed. Now, her spirit haunts the deep valleys of Meemure, weeping mournfully and striking down anyone who dares to cross her nesting trees.",
         mech="An environmental sound obstacle. Her agonizing wails block out other sounds (including Mahasona's footsteps). You must burn incense to soothe her spirit and quiet her cries to safely navigate the sector.",
         quote="&ldquo;Her weeping mimics the wind, but it carries a mother&rsquo;s cold wrath.&rdquo;",
         img="assets/images/folklore/kinduri.jpg"),
]

GALLERY = [
    dict(cat="temple", catl="Temple", title="The Ancient Ruins of Ritigala",
         desc="A crumbling Buddhist monastery temple dating back to the 1st Century BC, now claimed by dense roots and ancient curses.",
         img="assets/images/gallery/ritigala-ruins.jpg"),
    dict(cat="walawwa", catl="Walawwa", title="Inside the Abandoned Walawwa",
         desc="The ancestral manor of the local village chieftain, abandoned in haste in 1973. Legends say the walls still whisper of the blood spill.",
         img="assets/images/gallery/walawwa-interior.jpg"),
    dict(cat="character", catl="Demons", title="Mahasona's Shadow",
         desc="A chilling silhouette of the graveyard king moving through the Meemure cemetery ruins under a blood-red moon.",
         img="assets/images/gallery/mahasona-shadow.jpg"),
    dict(cat="character", catl="Demons", title="The Call of Mohini",
         desc="An ethereal and terrifying demon that appears as a beautiful woman holding a child, luring travelers into the dark forest.",
         img="assets/images/gallery/mohini-call.jpg"),
    dict(cat="concept", catl="Concept art", title="Forest Canopy Fog Concept",
         desc="Initial environment concept art showcasing the choking volumetric fog of Meemure's dense rainforest canopy.",
         img="assets/images/gallery/canopy-fog-concept.jpg"),
    dict(cat="screenshot", catl="Screenshot", title="Moonlit Paddy Fields",
         desc="A safe-looking path that holds immediate danger. Step lightly, or the Ririyaka (Blood Demon) will hear you.",
         img="assets/images/gallery/moonlit-paddy.jpg"),
]

# ==================================================================== HOME
def home():
    letters = "".join('<span class="t-letter">%s</span>' % c for c in "Moha")
    hero = """
<section class="hero" data-mascot-slot>
  <div class="hero__bg" data-hero-bg></div>
  <div class="hero__ornament" aria-hidden="true">%s</div>
  <div class="hero__inner">
    <p class="hero__kicker" data-hero="kicker">Black Mirage Studio presents</p>
    <h1 class="hero__title" aria-label="Moha">%s</h1>
    <p class="hero__sub" data-hero="sub">A dark cinematic Sri Lankan horror experience.</p>
    <p class="hero__tag" data-hero="tag">Sri Lankan Folklore Survival Horror</p>
    <div class="hero__cta" data-hero="cta">
      <a class="btn btn--primary" data-magnetic href="world.html">Enter the World %s</a>
      <a class="btn btn--ghost" data-magnetic href="characters.html">Meet the Mahasona</a>
      <a class="btn btn--ghost" data-magnetic href="media.html">View Media</a>
    </div>
  </div>
  <div class="hero__scroll" data-hero="scroll" aria-hidden="true">
    <span>Descend</span><span class="hero__scroll-line"></span>
  </div>
</section>
""" % (orn("motif-moonstone", "orn"), letters, icon("arrow"))

    tabs, panels = [], []
    for i, d in enumerate(DEMONS):
        sel = "true" if i == 0 else "false"
        tabs.append("""          <button class="viewer__btn" type="button" role="tab" id="tab-%s" aria-controls="panel-%s" aria-selected="%s" data-demon="%s">
            <span><span class="viewer__btn-name">%s</span><span class="viewer__btn-title">%s</span></span>
            <span class="viewer__btn-arrow">%s</span>
          </button>""" % (d["id"], d["id"], sel, d["id"], d["name"], d["title"], icon("chevR")))
        panels.append("""        <div class="viewer__panel" role="tabpanel" id="panel-%s" aria-labelledby="tab-%s"%s>
          <div class="viewer__media">%s</div>
          <div class="viewer__body">
            <p class="eyebrow">%s</p>
            <h3 class="viewer__name">%s</h3>
            <p class="viewer__desc">%s</p>
            <div class="viewer__mech">
              <p class="label" style="margin-bottom:8px">Gameplay mechanics</p>
              <p class="viewer__desc">%s</p>
            </div>
            <blockquote class="viewer__quote">%s</blockquote>
          </div>
        </div>""" % (d["id"], d["id"], "" if i == 0 else " hidden",
                     plate(d["img"], "4-5", "motif-lotus"), d["title"], d["name"], d["desc"], d["mech"], d["quote"]))

    folklore = """
<section class="section" id="folklore">
  <div class="wrap">
    <div class="head-block head-block--center">
      <p class="eyebrow eyebrow--rule" data-reveal="up">The Ancient Curse Is Real</p>
      <h2 class="title" data-reveal="up" data-delay="0.06">Sri Lankan Folklore</h2>
      <p class="lede" data-reveal="up" data-delay="0.12">Five demons of local legend stand between the living
         and the grave. Learn their nature before you walk into Meemure.</p>
      <div data-reveal="up" data-delay="0.18">%s</div>
    </div>
    <div class="viewer" style="margin-top:clamp(40px,5vw,64px)">
      <div class="viewer__list" role="tablist" aria-label="Demons of Sri Lankan folklore">
%s
      </div>
%s
    </div>
  </div>
</section>
""" % (orn("motif-moonstone", "orn rule-orn"), "\n".join(tabs), "\n".join(panels))

    mechs = [
        ("compass", "First-Person Dread", "Full physical presence controls. Inspect objects in 3D, solve complex machinery, and carefully manage resources like flashlight batteries and exorcism charms."),
        ("layers", "UE5 Hyper-Realism", "Lumen dynamic lighting and photogrammetry of actual ruins from Ritigala create a claustrophobic, suffocatingly dark setting where danger lurks in every shadow."),
        ("flame", "Thovil Exorcism Systems", "Wield a mixture of dynamic weaponry and traditional folklore rituals: draw protective circles in the mud, chant ancient spells, and light holy clay lamps to survive."),
        ("waves", "Psychological Sound", "Spatial binaural audio captures every twig snap in the distance, heavy panting of the protagonist, and terrifying whispers that emerge directly behind your ears."),
    ]
    cards = "\n".join("""        <article class="card">
          <span class="card__num">0%d</span>
          <span class="card__icon">%s</span>
          <h3 class="card__title">%s</h3>
          <p class="card__body">%s</p>
        </article>""" % (i + 1, icon(ic), t, b) for i, (ic, t, b) in enumerate(mechs))
    mechanics = """
<section class="section section--tight" id="mechanics-preview">
  <div class="wrap">
    <div class="head-block head-block--center">
      <p class="eyebrow eyebrow--rule" data-reveal="up">Unparalleled Immersion</p>
      <h2 class="title" data-reveal="up" data-delay="0.06">Survival Horror Mechanics</h2>
      <div data-reveal="up" data-delay="0.12">%s</div>
    </div>
    <div class="cards cards--4" style="margin-top:clamp(36px,4.5vw,58px)" data-reveal="stagger">
%s
    </div>
  </div>
</section>
""" % (orn("motif-moonstone", "orn rule-orn"), cards)

    teaser = """
<section class="teaser">
  <div class="teaser__orn" aria-hidden="true">%s</div>
  <div class="wrap teaser__inner">
    <div>
      <p class="eyebrow eyebrow--blood" data-reveal="up">The King of Cemeteries</p>
      <h2 class="teaser__title" data-reveal="up" data-delay="0.06">Mahasona</h2>
      <p class="teaser__body" data-reveal="up" data-delay="0.12">The supreme hunter of Moha. His footsteps echo
         like thunder, and he tracks purely via the sound of your movements and panic-induced breathing.</p>
      <div data-reveal="up" data-delay="0.18" style="margin-top:28px">
        <a class="btn btn--ghost" data-magnetic href="characters.html">Open the dossier %s</a>
      </div>
    </div>
    <div style="width:min(300px,38vw)" data-reveal="clip" data-parallax="4">%s</div>
  </div>
</section>
""" % (orn("motif-lotus", "orn"), icon("arrow"), plate("assets/images/characters/mahasona.jpg", "3-4", "motif-torana"))

    strip = "\n".join("""        <a class="gitem" href="media.html#gallery" data-cursor="view">
          %s
          <span class="gitem__veil"></span>
          <span class="gitem__plus">%s</span>
          <span class="gitem__meta"><span class="gitem__cat">%s</span><span class="gitem__title" style="display:block">%s</span></span>
        </a>""" % (plate(g["img"], "16-9", "motif-lotus"), icon("plus"), g["catl"], g["title"]) for g in GALLERY[:3])
    gallery = """
<section class="section section--tight" id="gallery-preview">
  <div class="wrap">
    <div class="head-block head-block--center">
      <p class="eyebrow eyebrow--rule" data-reveal="up">Witness the Nightmare</p>
      <h2 class="title" data-reveal="up" data-delay="0.06">Explore the Visual Art</h2>
      <p class="lede" data-reveal="up" data-delay="0.12">Concepts of real locations, haunted dark forests and
         close views of ancient rituals, gathered in the media archive.</p>
      <div data-reveal="up" data-delay="0.18">%s</div>
    </div>
    <div class="ggrid" data-reveal="stagger">
%s
    </div>
    <div class="head-block head-block--center" style="margin-top:40px" data-reveal="up">
      <a class="btn btn--ghost" data-magnetic href="media.html">Enter the archive %s</a>
    </div>
  </div>
</section>
""" % (orn("motif-moonstone", "orn rule-orn"), strip, icon("arrow"))

    page("index.html", "Moha | Sri Lankan Folklore Survival Horror",
         "Moha is a dark cinematic Sri Lankan horror experience - a first-person survival horror game of "
         "ancient folklore by Black Mirage Studio.",
         "index.html", hero + folklore + mechanics + teaser + gallery)

# ==================================================================== GAME
def game():
    head = phead("Behind the Mirage", "The Game",
                 "A deeply immersive and emotionally driven survival horror game, built to leave players "
                 "thinking about its world long after the journey ends.")
    split1 = """
<section class="section section--tight">
  <div class="wrap split">
    <div data-reveal="clip" data-parallax="3">%s</div>
    <div class="split__body">
      <p class="eyebrow" data-reveal="up">Our Flagship Title</p>
      <h2 class="title" style="font-size:clamp(26px,3.2vw,40px)" data-reveal="up" data-delay="0.06">Built to be remembered</h2>
      <p class="small" data-reveal="up" data-delay="0.12">Moha is a deeply immersive and emotionally driven survival
         horror game, built to leave players thinking about its world and characters long after the journey ends.
         Created by Black Mirage Studio, a leading indie studio representing professional game development
         from Sri Lanka.</p>
      <p class="small" data-reveal="up" data-delay="0.18">Our mission is to introduce global audiences to the ancient,
         occult, and highly terrifying lore of South Asian folklore, utilizing state-of-the-art volumetric lighting,
         performance-captured facial animation, and procedural sound synthesis.</p>
    </div>
  </div>
</section>
""" % plate("assets/images/game/flagship-ue5.jpg", "4-5", "motif-torana")

    vision = [
        ("shield", "Authentic representation", "Our team works closely with archeologists, historians, and cultural advisors in Sri Lanka to ensure that temple layouts, language structures, and exorcism rituals are chillingly authentic."),
        ("compass", "Atmospheric gameplay", "We design horror around the absence of safety. No quick saves, no flashing minimaps. Every shadow must be parsed with physical exploration and flashlight-battery conservation."),
        ("layers", "Technical excellence", "By adopting Unreal Engine 5's Nanite and MetaSound systems, we construct dense, spatial, and photorealistic landscapes that capture the heavy dampness of ancient rain forests."),
    ]
    vcards = "\n".join("""        <article class="card">
          <span class="card__icon">%s</span>
          <h3 class="card__title">%s</h3>
          <p class="card__body">%s</p>
        </article>""" % (icon(ic), t, b) for ic, t, b in vision)
    sec_vision = """
<section class="section section--tight">
  <div class="wrap">
    <div class="cards cards--3" data-reveal="stagger">
%s
    </div>
  </div>
</section>
""" % vcards

    split2 = """
<section class="section section--tight" id="mechanics">
  <div class="wrap split split--rev">
    <div data-reveal="clip" data-parallax="3">%s</div>
    <div class="split__body">
      <p class="eyebrow eyebrow--blood" data-reveal="up">The Rules of Engagement</p>
      <h2 class="title" style="font-size:clamp(26px,3.2vw,40px)" data-reveal="up" data-delay="0.06">First-Person Survival Horror</h2>
      <p class="small" data-reveal="up" data-delay="0.12">Moha delivers a brutal, unforgiving experience that
         prioritizes tactical planning and acute physical awareness over simple fast-paced shooting.</p>
      <p class="small" data-reveal="up" data-delay="0.18">To survive, players must leverage a mixture of modern items
         like highly-focused high-intensity flashlights, mechanical keys, and hand-held cameras, alongside traditional
         Sri Lankan Thovil talismans and salt-water powders to craft holy barriers against the dark.</p>
    </div>
  </div>
</section>
""" % plate("assets/images/game/thovil-ritual.jpg", "16-9", "motif-lotus")

    mechs = [
        ("bolt", "Tactical Flashlight System", "Your flashlight is your lifeline, but batteries are rare and drain rapidly. You must conserve your light, clicking it on and off, or choosing to walk in absolute, terrifying pitch darkness to hide your position."),
        ("eye", "Physical Item Examination", "Every document, diary page, and key can be rotated, flipped, and opened in 3D in your hand to find hidden drawer compartments, etched numbers, and cryptic symbols required to bypass lock mechanisms."),
        ("waves", "Binaural Heartbeat Response", "When encountering spirits like Mohini or hearing Mahasona's grunt, your character's panic rises, speeding up your heartbeat. A fast heartbeat blocks out subtle environmental hints and increases the chance of hyperventilating."),
    ]
    mcards = "\n".join("""        <article class="card">
          <span class="card__icon">%s</span>
          <h3 class="card__title">%s</h3>
          <p class="card__body">%s</p>
        </article>""" % (icon(ic), t, b) for ic, t, b in mechs)
    sec_mechs = """
<section class="section section--tight">
  <div class="wrap">
    <div class="cards cards--3" data-reveal="stagger">
%s
    </div>
  </div>
</section>
""" % mcards

    page("game.html", "The Game | Moha",
         "Moha is a first-person survival horror game by Black Mirage Studio - tactical flashlight systems, "
         "physical item examination and traditional Thovil exorcism rituals.",
         "game.html", head + split1 + sec_vision + split2 + sec_mechs)

# ============================================================ CHARACTERS
def characters():
    head = phead("Character Dossier", "Characters",
                 "Dossiers of the entities that hunt the forests of Meemure, recorded one seal at a time.")
    d = DEMONS[0]
    dossier = """
<section class="section" id="mahasona">
  <div class="wrap">
    <div class="dossier">
      <div class="dossier__art" data-reveal="clip">
        %s
        <span class="dossier__frame" aria-hidden="true">%s</span>
        <span class="dossier__seal" aria-hidden="true">%s</span>
      </div>
      <div class="dossier__body">
        <p class="eyebrow eyebrow--blood" data-reveal="up">Dossier I &middot; King of Cemeteries</p>
        <h2 class="dossier__name" data-reveal="up" data-delay="0.06">Mahasona</h2>
        <p class="dossier__epithet" data-reveal="up" data-delay="0.12">The King of Cemeteries</p>
        <p class="dossier__desc" data-reveal="up" data-delay="0.18">%s</p>
        <dl class="dossier__facts" data-reveal="stagger">
          <div class="dossier__fact"><dt>Origin</dt><dd>Reborn warrior with a backward bear head.</dd></div>
          <div class="dossier__fact"><dt>Domain</dt><dd>Grave-dwelling demon of the deep forests and cemetery ruins.</dd></div>
          <div class="dossier__fact"><dt>The Hunt</dt><dd>Blind, with hyper-acute hearing. He tracks purely via the sound of your movements and panic-induced breathing; running or stepping on twigs reveals your location.</dd></div>
          <div class="dossier__fact"><dt>Repellent</dt><dd>Draw a protective clay boundary, remain completely silent.</dd></div>
        </dl>
        <blockquote class="dossier__quote" data-reveal="up">%s</blockquote>
      </div>
    </div>
    <p class="dossier__pending" data-reveal="up">
      <span class="orn" aria-hidden="true">%s</span>
      <span>Further dossiers remain sealed &mdash; additional characters will be published with the official character document.</span>
    </p>
  </div>
</section>
""" % (plate(d["img"], "3-4", "motif-torana"), orn("motif-torana", "orn"), orn("motif-lotus", "orn"),
       d["desc"], d["quote"], orn("motif-lotus", "orn"))
    page("characters.html", "Characters | Moha",
         "Character dossiers from Moha - Mahasona, the king of grave-dwelling demons of Sri Lankan folklore.",
         "characters.html", head + dossier)

# =================================================================== WORLD
def world():
    head = phead("The Annals of Darkness", "World &amp; Story",
                 "An isolated jungle village, a shattered seal, and the folklore that urban culture forgot.")
    story = """
<section class="section section--tight">
  <div class="wrap split">
    <div class="split__body">
      <p class="eyebrow" data-reveal="up">The Awakening of Mahasona</p>
      <p class="lede" data-reveal="up" data-delay="0.08">Driven by skepticism and academic curiosity, a group of
         five teenagers travels to Meemure, an isolated jungle village tucked away in the deep mist-covered hills
         of central Sri Lanka. Their goal is to research ancient exorcism rituals, locally known as Thovil, and
         catalog folklore that urban culture has long since forgotten.</p>
      <p class="small" data-reveal="up" data-delay="0.16">However, their arrival triggers an ancient curse. An occult
         seal buried in the crumbling monastery steps of Ritigala is shattered, releasing Mahasona, the terrifying,
         bear-headed lord of cemeteries, and his army of bloodthirsty spirits. What began as a school research trip
         immediately turns into a desperate, frantic scramble for physical and psychological survival.</p>
    </div>
    <div class="diary" data-reveal="clip">
      <span class="diary__corner diary__corner--tl" aria-hidden="true">%s</span>
      <span class="diary__corner diary__corner--br" aria-hidden="true">%s</span>
      <h3 class="diary__title">%s <span>The Exorcist&rsquo;s Diary (1973)</span></h3>
      <p class="diary__text">&ldquo;We have drawn the lines in the clay, lit the seven torches of the coconut shell,
         and prepared the salt powder. The grunting of a giant boar echoes from the tree canopy, and my assistants
         are shaking. They say the half-man, half-beast is smelling the blood. He does not hunt with eyes, but with
         our breaths&hellip;&rdquo;</p>
      <p class="diary__sig">&mdash; Discovered scroll in Walawwa cellars</p>
    </div>
  </div>
</section>
""" % (orn("motif-corner", "orn"), orn("motif-corner", "orn"), icon("book"))

    locs = [
        ("Ritigala Ruins", "A 1st-century Buddhist monastery sanctuary long reclaimed by massive tree roots. These stone steps hide ancient protective seals and cryptic, occult carvings.", "assets/images/locations/ritigala.jpg"),
        ("Meemure Village", "An isolated jungle settlement nestled beneath the jagged peaks of Knuckles Range. Cut off from modern communication, its residents guard deep secrets of ancient blood-bonds.", "assets/images/locations/meemure.jpg"),
        ("The Walawwa Manor", "A massive, decaying ancestral estate built during the colonial era. Some rooms are boarded up and protected by locks that should never be violated.", "assets/images/locations/walawwa.jpg"),
    ]
    lcards = "\n".join("""        <article class="loc">
          %s
          <div class="loc__body"><h3 class="loc__name">%s</h3><p>%s</p></div>
        </article>""" % (plate(img, "16-9", "motif-torana"), t, b) for t, b, img in locs)
    sec_loc = """
<section class="section section--tight" id="locations">
  <div class="wrap">
    <div class="head-block head-block--center">
      <p class="eyebrow eyebrow--rule" data-reveal="up">Key Locations</p>
      <h2 class="title" data-reveal="up" data-delay="0.06">Places That Remember</h2>
      <p class="lede" data-reveal="up" data-delay="0.12">Haunting, meticulously researched locations reconstructed
         with hyper-realistic UE5 photogrammetry.</p>
      <div data-reveal="up" data-delay="0.18">%s</div>
    </div>
    <div class="cards cards--3" style="margin-top:clamp(36px,4.5vw,56px)" data-reveal="stagger">
%s
    </div>
  </div>
</section>
""" % (orn("motif-moonstone", "orn rule-orn"), lcards)

    bdata = [
        ("Mahasona", "King of Graveyards", "The supreme hunter of Moha. His footsteps echo like thunder, and he tracks purely via the sound of your movements and panic-induced breathing.", "Reborn warrior with a backward bear head.", "Draw a protective clay boundary, remain completely silent.", "assets/images/characters/mahasona.jpg"),
        ("Mohini", "Ghostly Temptress", "She manifests in remote clearings as a young mother in white. If you approach her or break eye contact, her beautiful mask peels back to expose a razor-jawed beast.", "A restless phantom trapped in forest highways.", "Never accept her child, maintain solid eye-contact.", "assets/images/folklore/mohini.jpg"),
        ("Kalukumaraya", "The Dream Devourer", "Haunts old bedchambers in the Walawwa manor. He attacks by trapping you in a sleep paralysis dream-state, slowly siphoning away your physical strength.", "A dark demon prince that targets the sleeping.", "Burn protective salt incenses, place talisman mirrors.", "assets/images/folklore/kalukumaraya.jpg"),
        ("Ririyaka", "The Blood Skirmisher", "Small, fast, and rabid, they hunt in packs within the deep moonlit paddy fields, attacking from the tall grasses and inducing a draining bleed effect.", "Manifestation of fevers and raw violence.", "Fight back with an iron sickle, throw salt-water dust.", "assets/images/folklore/ririyaka.jpg"),
        ("Kinduri", "The Forest Siren", "Her spirit haunts the deep valleys of Meemure, weeping mournfully and striking down anyone who dares to cross her nesting trees.", "A pregnant woman banished to the jungle who died in childbed.", "Burn incense to soothe her spirit and quiet her cries.", "assets/images/folklore/kinduri.jpg"),
    ]
    bcards = "\n".join("""        <article class="beast">
          <span class="beast__skull">%s</span>
          %s
          <div class="beast__body">
            <p class="beast__title">%s</p>
            <h3 class="beast__name">%s</h3>
            <p class="beast__desc">%s</p>
            <div class="beast__facts">
              <div><b>Mythological origin</b>%s</div>
              <div><b>Exorcism ritual repellent</b>%s</div>
            </div>
          </div>
        </article>""" % (icon("skull"), plate(img, "16-9", "motif-lotus"), ti, n, de, or_, ri) for n, ti, de, or_, ri, img in bdata)
    sec_beast = """
<section class="section section--tight" id="bestiary">
  <div class="wrap">
    <div class="head-block head-block--center">
      <p class="eyebrow eyebrow--rule eyebrow--blood" data-reveal="up">The Bestiary of Legend</p>
      <h2 class="title" data-reveal="up" data-delay="0.06">Demons &amp; Folklore</h2>
      <div data-reveal="up" data-delay="0.12">%s</div>
    </div>
    <div class="cards cards--2" style="margin-top:clamp(36px,4.5vw,56px)" data-reveal="stagger">
%s
    </div>
  </div>
</section>
""" % (orn("motif-moonstone", "orn rule-orn"), bcards)

    page("world.html", "World & Story | Moha",
         "The world of Moha - Meemure village, the Ritigala ruins, the Walawwa manor and the demons of "
         "Sri Lankan folklore.",
         "world.html", head + story + sec_loc + sec_beast)

# =================================================================== MEDIA
def media():
    head = phead("The Sightings Chamber", "Media",
                 "Screenshots, concept art and footage from the haunted fields of Meemure.")
    video = """
<section class="section section--tight" id="trailer">
  <div class="wrap">
    <div class="vslot" data-video-slot="trailer" data-video-label="Moha official trailer">
      <div class="vslot__inner">
        <span class="vslot__ring" aria-hidden="true">%s</span>
        <h2 class="vslot__title">Official Trailer</h2>
        <p class="vslot__note">Footage will appear here once released</p>
      </div>
    </div>
  </div>
</section>
""" % icon("play")

    filters = [("all", "All sightings"), ("temple", "The temple"), ("walawwa", "Walawwa"),
               ("character", "Demons"), ("concept", "Concept art"), ("screenshot", "Screenshots")]
    fbtns = "\n".join('        <button class="gfilter" type="button" data-filter="%s" aria-pressed="%s">%s</button>'
                      % (f, "true" if f == "all" else "false", l) for f, l in filters)
    items = "\n".join("""        <button class="gitem" type="button" data-cat="%s" data-cursor="view" data-desc="%s" aria-label="Open %s in the viewer">
          %s
          <span class="gitem__veil"></span>
          <span class="gitem__plus">%s</span>
          <span class="gitem__meta"><span class="gitem__cat">%s</span><span class="gitem__title" style="display:block">%s</span></span>
        </button>""" % (g["cat"], g["desc"].replace('"', "&quot;"), g["title"].replace('"', "&quot;"),
                        plate(g["img"], "16-9", "motif-lotus"), icon("plus"), g["catl"], g["title"]) for g in GALLERY)
    gallery = """
<section class="section section--tight" id="gallery">
  <div class="wrap">
    <div class="head-block head-block--center">
      <p class="eyebrow eyebrow--rule" data-reveal="up">Media Archive</p>
      <h2 class="title" data-reveal="up" data-delay="0.06">The Sightings</h2>
      <div data-reveal="up" data-delay="0.12">%s</div>
    </div>
    <div class="gfilters" data-reveal="up" data-delay="0.14">
%s
    </div>
    <div class="ggrid" data-reveal="stagger">
%s
    </div>
  </div>
</section>

<div class="lightbox" role="dialog" aria-modal="true" aria-label="Media viewer" aria-hidden="true">
  <div class="lightbox__stage">
    <button class="lightbox__btn lightbox__close" type="button" aria-label="Close viewer">%s</button>
    <div class="lightbox__media"></div>
    <div class="lightbox__bar">
      <div>
        <h3 class="lightbox__title"></h3>
        <p class="lightbox__desc"></p>
      </div>
      <span class="lightbox__count"></span>
    </div>
    <div class="lightbox__nav">
      <button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous image">%s</button>
      <button class="lightbox__btn lightbox__next" type="button" aria-label="Next image">%s</button>
    </div>
  </div>
</div>
""" % (orn("motif-moonstone", "orn rule-orn"), fbtns, items, icon("x"), icon("chevL"), icon("chevR"))

    page("media.html", "Media | Moha",
         "The Moha media archive - screenshots, concept art and the official trailer of the Sri Lankan "
         "folklore survival horror game.",
         "media.html", head + video + gallery)

# ===================================================================== 404
def err():
    body = """
<section class="err">
  <div>
    <p class="err__code" aria-hidden="true">404</p>
    <h1 class="err__title">Lost in the fog</h1>
    <p class="lede" style="margin:18px auto 30px;max-width:440px">The path you followed has been reclaimed by
       the forest. Turn back toward the light.</p>
    <a class="btn btn--primary" data-magnetic href="index.html">Return to Moha %s</a>
  </div>
</section>
""" % icon("arrow")
    page("404.html", "Page not found | Moha",
         "This page has been reclaimed by the forest. Return to the official Moha website.",
         "", body)

if __name__ == "__main__":
    home(); game(); characters(); world(); media(); err()
    print("done")
