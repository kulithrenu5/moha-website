"use client";

import { useEffect, useState } from "react";
import "./veronica.css";

const LANGS = ["English [US]", "English [UK]", "English [Asia]", "Français", "Italiano", "Deutsch", "Español", "Español [LATAM]", "Polski", "Português do Brasil", "繁體中文", "简体中文", "한국어", "العربية", "日本語"];
const NAV = [
  { id: "top", label: "Home" },
  { id: "news", label: "News" },
  { id: "story", label: "Story" },
  { id: "characters", label: "Characters" },
  { id: "media", label: "Media" },
  { id: "product", label: "Product" },
];
const NEWS = [
  { d: "2026.06.06", t: "Announcement", h: "Reveal trailer premieres; the island prison is open for business." },
  { d: "2026.06.06", t: "Platforms", h: "Platforms confirmed: PS5, Xbox Series X|S, Switch 2 and PC." },
  { d: "2026.06.06", t: "Technology", h: "Built on the RE Engine with modernized controls and a restructured story." },
  { d: "TBA", t: "Coming soon", h: "Gameplay reveal and pre-order details to be announced." },
];
const CHARS = [
  { m: "C", n: "Claire Redfield", r: "Protagonist", p: "Still searching for her missing brother, she pushes deeper into Umbrella's secrets and is captured for her trouble." },
  { m: "S", n: "Steve Burnside", r: "Ally", p: "A young prisoner with a nervous streak and a knack for trouble, who crosses paths with Claire at the worst possible time." },
  { m: "A", n: "Alfred & Alexia Ashford", r: "Antagonists", p: "Heirs to a powerful dynasty whose obsession with legacy sets the island's nightmare in motion." },
  { m: "Ch", n: "Chris Redfield", r: "Protagonist", p: "A seasoned survivor who follows the trail to find his sister, whatever waits at the end of it." },
  { m: "W", n: "Albert Wesker", r: "Wildcard", p: "Presumed dead, he resurfaces with a hidden agenda and abilities nobody can explain." },
  { m: "R", n: "Rodrigo Raval", r: "Ally", p: "A soldier with a loyal streak and a stubborn grip on his duty, even as the island falls apart." },
];
const SHOTS = [
  { s: "/veronica/hero.jpg", t: "Rockfort Island", c: "Environments" },
  { s: "/veronica/mansion.jpg", t: "Ashford Residence", c: "Environments" },
  { s: "/veronica/antarctic.jpg", t: "Antarctic Base", c: "Environments" },
  { s: "/veronica/creature.jpg", t: "Something in the dark", c: "Creatures" },
  { s: "/veronica/hero.jpg", t: "Reveal Trailer", c: "Videos", v: true },
  { s: "/veronica/antarctic.jpg", t: "Teaser", c: "Videos", v: true },
];

function Wordmark() {
  return (
    <span className="wm">
      <small>RESIDENT EVIL</small>
      <b>VERONICA</b>
      <i />
    </span>
  );
}

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

function AgeGate({ onPass, fading }: { onPass: () => void; fading: boolean }) {
  const [m, setM] = useState("");
  const [d, setD] = useState("");
  const [y, setY] = useState("");
  const [err, setErr] = useState("");
  const now = new Date().getFullYear();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!m || !d || !y) return setErr("Please enter your full date of birth.");
    const dob = new Date(+y, +m - 1, +d);
    if (dob.getMonth() !== +m - 1) return setErr("That date doesn't exist.");
    const age = (Date.now() - dob.getTime()) / (365.25 * 864e5);
    if (age < 17) return setErr("Sorry, you are not old enough to view this content.");
    sessionStorage.setItem("vero_age_ok", "1");
    onPass();
  };

  return (
    <div className={fading ? "vg out" : "vg"}>
      <div className="vg-logo" style={{ fontSize: 72 }}><Wordmark /></div>
      <form className="vg-form" onSubmit={submit}>
        <div className="vg-label">Date of Birth</div>
        <div className="vg-row">
          <select aria-label="Month" value={m} onChange={(e) => setM(e.target.value)}>
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{String(i + 1).padStart(2, "0")}</option>)}
          </select>
          <select aria-label="Day" value={d} onChange={(e) => setD(e.target.value)}>
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => <option key={i} value={i + 1}>{String(i + 1).padStart(2, "0")}</option>)}
          </select>
          <select aria-label="Year" value={y} onChange={(e) => setY(e.target.value)}>
            <option value="">Year</option>
            {Array.from({ length: 100 }, (_, i) => <option key={i} value={now - i}>{now - i}</option>)}
          </select>
        </div>
        <div className="vg-err" role="alert">{err}</div>
        <button className="vbtn" type="submit">Confirm</button>
      </form>
      <p className="vg-note">Unofficial fan recreation for educational purposes. Not affiliated with or endorsed by CAPCOM. No date of birth is stored.</p>
    </div>
  );
}

export default function VeronicaPage() {
  const [gate, setGate] = useState<"check" | "show" | "out" | "gone">("check");
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState(LANGS[0]);
  const [active, setActive] = useState("top");
  const [tab, setTab] = useState("All");
  const [lb, setLb] = useState<(typeof SHOTS)[number] | null>(null);
  const [email, setEmail] = useState("");
  const [subMsg, setSubMsg] = useState("");
  useReveal();

  useEffect(() => {
    setGate(sessionStorage.getItem("vero_age_ok") ? "gone" : "show");
  }, []);

  useEffect(() => {
    document.body.style.overflow = gate === "show" || gate === "out" || menu || lb ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [gate, menu, lb]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let cur = "top";
      NAV.forEach((n) => {
        const el = document.getElementById(n.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = n.id;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && (setLb(null), setMenu(false), setLangOpen(false));
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const pass = () => { setGate("out"); setTimeout(() => setGate("gone"), 900); };

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setSubMsg("Please enter a valid email address.");
    setSubMsg("Thanks! This is a demo form, so nothing was sent or stored.");
    setEmail("");
  };

  const shots = SHOTS.filter((s) => tab === "All" || s.c === tab);

  if (gate === "check") return <div className="vero" />;

  return (
    <div className="vero">
      {(gate === "show" || gate === "out") && (
        <>
          <AgeGate onPass={pass} fading={gate === "out"} />
        </>
      )}

      <header className={`vh ${scrolled ? "solid" : ""}`}>
        <a href="#top" onClick={go("top")} style={{ fontSize: 26 }} aria-label="Home"><Wordmark /></a>
        <nav>
          {NAV.slice(1).map((n) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? "on" : ""} onClick={go(n.id)}>{n.label}</a>
          ))}
        </nav>
        <div className="vh-r">
          <div className="lang">
            <button onClick={() => setLangOpen(!langOpen)} aria-expanded={langOpen}>🌐 {lang.includes("US") ? "EN-US" : lang.slice(0, 7).toUpperCase()}</button>
            {langOpen && (
              <ul>
                {LANGS.map((l) => (
                  <li key={l}><button className={l === lang ? "on" : ""} onClick={() => { setLang(l); setLangOpen(false); }}>{l}</button></li>
                ))}
              </ul>
            )}
          </div>
          <button className={`burger ${menu ? "open" : ""}`} onClick={() => setMenu(!menu)} aria-label="Menu"><span /><span /><span /></button>
        </div>
      </header>

      <div className={`vmenu ${menu ? "open" : ""}`}>
        {NAV.map((n) => <a key={n.id} href={`#${n.id}`} onClick={go(n.id)}>{n.label}</a>)}
      </div>

      <section id="top" className="hero">
        <div className="hero-bg" />
        <div className="rain" />
        <Wordmark />
        <div className="hero-tag">THE ISLAND REMEMBERS</div>
        <div className="hero-date">2027</div>
        <div className="hero-cta">
          <button className="vbtn" onClick={() => setLb(SHOTS[4])}>Watch Trailer</button>
          <a className="vbtn ghost" href="#product" onClick={go("product")}>Platforms</a>
        </div>
        <div className="scroll">SCROLL</div>
      </section>

      <section id="news" className="sec rv">
        <div className="sec-h"><span>LATEST</span><h2>News</h2><i /></div>
        <ul className="news">
          {NEWS.map((n, i) => (
            <li key={i}>
              <a href="#news" onClick={(e) => e.preventDefault()}>
                <time>{n.d}</time><span className="tagp">{n.t}</span><h3>{n.h}</h3><span className="arr">→</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="story" className="sec">
        <div className="sec-h rv"><span>PROLOGUE</span><h2>Story</h2><i /></div>
        <div className="story">
          <div className="story-img rv" />
          <div className="rv">
            <blockquote>Some legacies are built to be buried.</blockquote>
            <p>After the nightmare in Raccoon City, Claire Redfield keeps searching for her missing brother, and her trail leads straight into the heart of Umbrella. A daring infiltration goes wrong, and she wakes up a prisoner on a remote island.</p>
            <p>When the island&apos;s dark secrets spill out, survival becomes a matter of nerve, and of the uneasy alliances you make along the way. Every locked door, every cold corridor and every whispered name points to a family whose ambition reaches far beyond its walls.</p>
            <p>The search for family carries on, from a storm-lashed fortress to a frozen outpost at the bottom of the world.</p>
          </div>
        </div>
      </section>

      <div className="band"><h2 className="rv">From a storm-lashed island to the frozen edge of the world</h2></div>

      <section id="characters" className="sec">
        <div className="sec-h rv"><span>DOSSIERS</span><h2>Characters</h2><i /></div>
        <div className="chars">
          {CHARS.map((c) => (
            <article key={c.n} className="card rv">
              <span className="mono">{c.m}</span>
              <div className="role">{c.r}</div>
              <h3>{c.n}</h3>
              <p>{c.p}</p>
              <div className="bar" />
            </article>
          ))}
        </div>
      </section>

      <section id="media" className="sec">
        <div className="sec-h rv"><span>GALLERY</span><h2>Media</h2><i /></div>
        <div className="tabs rv">
          {["All", "Environments", "Creatures", "Videos"].map((t) => (
            <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <div className="media">
          {shots.map((s, i) => (
            <button key={s.t + i} style={{ backgroundImage: `url(${s.s})` }} onClick={() => setLb(s)} aria-label={s.t}>
              {s.v && <i className="play" />}
              <span>{s.t}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="product" className="sec prod">
        <div className="sec-h rv"><span>COMING 2027</span><h2>Product</h2><i /></div>
        <div className="plat rv">
          {["PlayStation 5", "Xbox Series X|S", "Nintendo Switch 2", "PC"].map((p) => <span key={p}>{p}</span>)}
        </div>
        <div className="eds">
          <div className="ed rv">
            <h3>Standard Edition</h3>
            <p>The full campaign, rebuilt from the ground up for a new generation.</p>
            <button className="vbtn" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>Pre-order TBA</button>
          </div>
          <div className="ed feat rv">
            <h3>Deluxe Edition</h3>
            <p>Includes bonus in-game content and a digital soundtrack. Details to follow.</p>
            <button className="vbtn" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>Pre-order TBA</button>
          </div>
        </div>
        <div className="sub rv">
          <h3 style={{ fontSize: 20 }}>Get notified</h3>
          <form onSubmit={subscribe}>
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
            <button className="vbtn" type="submit">Subscribe</button>
          </form>
          <p>{subMsg}</p>
        </div>
      </section>

      <footer className="vf">
        <Wordmark />
        <nav>
          {NAV.slice(1).map((n) => <a key={n.id} href={`#${n.id}`} onClick={go(n.id)}>{n.label}</a>)}
        </nav>
        <div className="rating">MATURE 17+</div>
        <p>
          This is an unofficial fan-made recreation of the page layout and experience, built for learning and portfolio purposes.
          It uses original text and AI-generated artwork, and contains no CAPCOM assets. Resident Evil and related names are
          trademarks of CAPCOM CO., LTD. This project is not affiliated with or endorsed by CAPCOM.
        </p>
      </footer>

      <button className={`totop ${scrolled ? "show" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">↑</button>

      {lb && (
        <div className="lb" onClick={() => setLb(null)}>
          <button className="x" aria-label="Close">×</button>
          {lb.v ? (
            <div className="vid" onClick={(e) => e.stopPropagation()}>
              <div>{lb.t}<small>Video placeholder, no trailer is bundled with this recreation.</small></div>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lb.s} alt={lb.t} onClick={(e) => e.stopPropagation()} />
          )}
        </div>
      )}
    </div>
  );
}
