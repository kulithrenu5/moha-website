/* ==========================================================================
   Moha - cinematic motion layer
   assets/js/moha-motion.js
   --------------------------------------------------------------------------
   Lenis smooth scrolling + GSAP / ScrollTrigger reveals and parallax.
   Everything degrades gracefully:
     - prefers-reduced-motion  -> no animation, content simply visible
     - libraries missing       -> content simply visible
     - touch devices           -> native scrolling preserved (Lenis wheel-only)
   ========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";

  var lenis = null;

  /* ------------------------------------------------------- scroll locking */
  window.addEventListener("moha:scroll-lock", function (e) {
    if (!lenis) return;
    if (e.detail) lenis.stop(); else lenis.start();
  });

  /* ------------------------------------------------------------- smooth scroll */
  function initLenis() {
    if (!hasLenis || reduced) return;

    lenis = new window.Lenis({
      lerp: 0.1,                   // heavy, cinematic glide
      smoothWheel: true,
      smoothTouch: false,          // keep native momentum scrolling on touch
      touchMultiplier: 1.6,
      wheelMultiplier: 1
    });

    if (hasGsap) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    }

    /* anchor links scroll smoothly through Lenis */
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute("href");
      if (id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70, duration: 1.4 });
    });
  }

  /* ------------------------------------------------------------- reveals */
  function initReveals() {
    if (!hasGsap || reduced) return;
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    gsap.defaults({ ease: "power3.out", duration: 1.05 });

    $$("[data-reveal]").forEach(function (node) {
      var kind = node.getAttribute("data-reveal");
      var delay = parseFloat(node.getAttribute("data-delay") || "0");
      var from = { opacity: 0 };

      if (kind === "up" || kind === "" ) from.y = 34;
      else if (kind === "left") from.x = -40;
      else if (kind === "right") from.x = 40;
      else if (kind === "clip") {
        from.clipPath = "inset(0 0 100% 0)";
        from.y = 24;
      } else if (kind === "scale") { from.scale = 0.94; from.y = 20; }
      else if (kind === "stagger") {
        var kids = node.children;
        gsap.set(kids, { opacity: 0, y: 30 });
        window.ScrollTrigger.create({
          trigger: node,
          start: "top 86%",
          once: true,
          onEnter: function () {
            gsap.to(kids, { opacity: 1, y: 0, duration: 0.95, stagger: 0.09, ease: "power3.out", delay: delay });
          }
        });
        return;
      }

      gsap.set(node, from);
      window.ScrollTrigger.create({
        trigger: node,
        start: "top 88%",
        once: true,
        onEnter: function () {
          gsap.to(node, {
            opacity: 1, x: 0, y: 0, scale: 1,
            clipPath: kind === "clip" ? "inset(0 0 0% 0)" : undefined,
            delay: delay,
            clearProps: "transform,clipPath"
          });
        }
      });
    });

    /* subtle parallax */
    $$("[data-parallax]").forEach(function (node) {
      var amount = parseFloat(node.getAttribute("data-parallax") || "6");
      gsap.fromTo(node,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: "none",
          scrollTrigger: { trigger: node, start: "top bottom", end: "bottom top", scrub: 1.1 }
        });
    });

    window.addEventListener("moha:refresh-scroll", function () {
      window.ScrollTrigger.refresh();
    });
    window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* ------------------------------------------------------- hero entrance */
  function initHero() {
    var hero = $(".hero");
    if (!hero) return;
    if (!hasGsap || reduced) return;
    var gsap = window.gsap;

    var letters = $$(".hero__title .t-letter", hero);
    var tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });

    tl.from($("[data-hero=kicker]", hero), { opacity: 0, y: 14, duration: 0.9 }, 0)
      .from(letters, { opacity: 0, y: 46, filter: "blur(10px)", duration: 1.15, stagger: 0.055 }, 0.12)
      .from($("[data-hero=sub]", hero), { opacity: 0, y: 18, duration: 1.0 }, 0.62)
      .from($("[data-hero=tag]", hero), { opacity: 0, duration: 1.1 }, 0.8)
      .from($("[data-hero=cta]", hero) ? $("[data-hero=cta]", hero).children : [], { opacity: 0, y: 22, duration: 0.9, stagger: 0.1 }, 0.92)
      .from($("[data-hero=scroll]", hero), { opacity: 0, duration: 1.2 }, 1.25)
      .from($(".hero__ornament", hero), { opacity: 0, y: 30, duration: 1.4 }, 0.7);

    /* slow hero background drift */
    gsap.to($(".hero__bg", hero), {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1.2 }
    });
  }

  function $(sel, root) { return (root || document).querySelector(sel); }

  /* -------------------------------------------------------------- boot */
  function boot() {
    document.documentElement.classList.add(reduced ? "motion-reduced" : "motion-full");
    initLenis();
    initReveals();
    initHero();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
