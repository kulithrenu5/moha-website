/* ==========================================================================
   Moha - interface layer
   assets/js/moha-ui.js
   --------------------------------------------------------------------------
   Navbar state, mobile menu, page transitions, brand/mascot asset injection,
   artwork slot activation, social link hydration, gallery filters + lightbox
   and the HTML5 video slots. Frontend-only: no fetches, no storage, no forms.
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.Moha || {};
  var doc = document;

  /* ------------------------------------------------------------- helpers */
  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }

  function el(tag, cls, attrs) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* ================================================= 1. artwork slots
     Every <img data-src="..."> ships without a src attribute so that a site
     with no artwork makes ZERO failed requests (and therefore logs no console
     errors). Filling data-src in the markup activates the image.            */
  function activatePlates() {
    $$("img[data-src]").forEach(function (img) {
      var src = img.getAttribute("data-src");
      if (!src) return;
      img.addEventListener("error", function () {
        img.removeAttribute("src");
        var plate = img.closest(".plate");
        if (plate) plate.setAttribute("data-missing", src);
      });
      img.src = src;
    });
  }

  /* ================================================= 2. brand assets
     Swap the typographic fallback for the real Figma exports when provided. */
  function applyBrand() {
    var b = cfg.brand || {};

    if (b.mark) {
      $$(".brand__mark, .veil__mark").forEach(function (host) {
        var img = el("img", null, { src: b.mark, alt: "" });
        host.textContent = "";
        host.appendChild(img);
      });
    }

    if (b.logo) {
      $$(".brand__name").forEach(function (host) {
        var img = el("img", null, { src: b.logo, alt: "Moha" });
        host.textContent = "";
        host.appendChild(img);
      });
    }

    if (b.studio) {
      $$(".footer__studio-fallback").forEach(function (host) {
        var img = el("img", null, { src: b.studio, alt: "Black Mirage" });
        host.replaceWith(img);
      });
    }
  }

  /* ================================================= 3. mascot
     Rendered only when the real asset exists, probed silently first.        */
  function applyMascot() {
    var src = cfg.mascot;
    if (!src) return;
    var slot = $("[data-mascot-slot]");
    if (!slot) return;

    var probe = new Image();
    probe.onload = function () {
      var fig = el("figure", "mascot", { "aria-hidden": "true" });
      var img = el("img", null, { src: src, alt: "" });
      fig.appendChild(img);
      slot.appendChild(fig);
    };
    probe.src = src;
  }

  /* ================================================= 4. social links
     Real URLs only. Empty config keeps icons visible but disabled.          */
  function applySocial() {
    var s = cfg.social || {};
    $$("[data-social]").forEach(function (a) {
      var url = s[a.getAttribute("data-social")];
      var tip = a.querySelector(".rail__tip");
      if (url) {
        a.href = url;
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
        a.removeAttribute("aria-disabled");
        if (tip) tip.textContent = a.getAttribute("data-social-name") || "";
      } else {
        a.setAttribute("href", "#");
        a.setAttribute("aria-disabled", "true");
        if (tip) tip.textContent = "Link pending";
      }
    });
  }

  /* ================================================= 5. navbar + menu */
  function initNav() {
    var nav = $(".nav");
    var burger = $(".burger");
    var menu = $(".mmenu");

    var onScroll = function () {
      if (!nav) return;
      nav.classList.toggle("is-scrolled", (window.scrollY || window.pageYOffset) > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (!burger || !menu) return;

    var setOpen = function (open) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      menu.classList.toggle("is-open", open);
      doc.documentElement.classList.toggle("menu-open", open);
      window.dispatchEvent(new CustomEvent("moha:scroll-lock", { detail: open }));
      if (open) {
        var first = menu.querySelector("a");
        if (first) first.focus({ preventScroll: true });
      } else {
        burger.focus({ preventScroll: true });
      }
    };

    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setOpen(false);
    });
  }

  /* ================================================= 6. page transitions */
  function initTransitions() {
    var veil = $(".veil");
    if (!veil) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var reveal = function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { veil.classList.add("is-done"); });
      });
    };
    if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", reveal);
    else reveal();

    if (reduced) return;

    doc.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0) return;
      if (a.origin !== location.origin && href.indexOf("http") === 0) return;
      if (a.getAttribute("aria-disabled") === "true") return;

      e.preventDefault();
      veil.classList.add("is-on");
      doc.documentElement.classList.add("is-transitioning");
      window.setTimeout(function () { window.location.href = href; }, 340);
    });

    window.addEventListener("pageshow", function (e) {
      if (e.persisted) { veil.classList.remove("is-on"); doc.documentElement.classList.remove("is-transitioning"); }
    });
  }

  /* ================================================= 7. video slots */
  function initVideos() {
    var v = cfg.videos || {};

    $$("[data-video-slot]").forEach(function (host) {
      var key = host.getAttribute("data-video-slot");
      var conf = v[key];
      if (!conf || !conf.src) return;   // keep the designed placeholder

      var ambient = host.getAttribute("data-video-ambient") === "true";
      var video = el("video", null, {
        playsinline: "",
        preload: ambient ? "none" : "metadata",
        "aria-label": host.getAttribute("data-video-label") || "Moha video"
      });
      if (conf.poster) video.poster = conf.poster;
      if (ambient) {
        video.muted = true; video.loop = true; video.autoplay = true;
        video.setAttribute("muted", ""); video.setAttribute("loop", "");
      } else {
        video.controls = true;
      }
      var source = el("source", null, { src: conf.src, type: videoType(conf.src) });
      video.appendChild(source);
      host.insertBefore(video, host.firstChild);

      if (!ambient) {
        var cover = $(".vslot__inner", host);
        if (cover) cover.remove();   // real player with native controls takes over
      }
    });
  }

  function videoType(src) {
    if (/\.webm$/i.test(src)) return "video/webm";
    if (/\.ogv$/i.test(src)) return "video/ogg";
    return "video/mp4";
  }

  /* ================================================= 8. gallery + lightbox */
  function initGallery() {
    var grid = $(".ggrid");
    if (!grid) return;

    var items = $$(".gitem", grid);
    var filters = $$(".gfilter");
    var visible = items.slice();

    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        filters.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        visible = [];
        items.forEach(function (it) {
          var show = f === "all" || it.getAttribute("data-cat") === f;
          it.classList.toggle("is-hidden", !show);
          if (show) visible.push(it);
        });
        window.dispatchEvent(new CustomEvent("moha:refresh-scroll"));
      });
    });

    /* ---- lightbox */
    var box = $(".lightbox");
    if (!box) return;
    var stage = $(".lightbox__media", box);
    var title = $(".lightbox__title", box);
    var desc = $(".lightbox__desc", box);
    var count = $(".lightbox__count", box);
    var closeBtn = $(".lightbox__close", box);
    var prevBtn = $(".lightbox__prev", box);
    var nextBtn = $(".lightbox__next", box);
    var idx = 0;
    var lastFocus = null;

    function render() {
      var item = visible[idx];
      if (!item) return;
      var plate = $(".plate", item);
      stage.innerHTML = "";
      if (plate) stage.appendChild(plate.cloneNode(true));
      activatePlatesIn(stage);
      title.textContent = $(".gitem__title", item) ? $(".gitem__title", item).textContent : "";
      desc.textContent = item.getAttribute("data-desc") || "";
      count.textContent = (idx + 1) + " / " + visible.length;
    }

    function activatePlatesIn(root) {
      $$("img[data-src]", root).forEach(function (img) {
        var s = img.getAttribute("data-src");
        if (s) img.src = s;
      });
    }

    function open(item) {
      idx = Math.max(0, visible.indexOf(item));
      lastFocus = doc.activeElement;
      render();
      box.classList.add("is-open");
      box.setAttribute("aria-hidden", "false");
      doc.documentElement.classList.add("lightbox-open");
      window.dispatchEvent(new CustomEvent("moha:scroll-lock", { detail: true }));
      closeBtn.focus({ preventScroll: true });
    }

    function close() {
      box.classList.remove("is-open");
      box.setAttribute("aria-hidden", "true");
      doc.documentElement.classList.remove("lightbox-open");
      window.dispatchEvent(new CustomEvent("moha:scroll-lock", { detail: false }));
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }

    function step(d) {
      if (!visible.length) return;
      idx = (idx + d + visible.length) % visible.length;
      render();
    }

    items.forEach(function (it) {
      it.addEventListener("click", function () { open(it); });
    });
    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () { step(-1); });
    nextBtn.addEventListener("click", function () { step(1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });

    doc.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "Tab") {
        var focusables = $$("button", box);
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ================================================= 9. hero backdrop media */
  function initHeroMedia() {
    var host = $("[data-hero-bg]");
    if (!host) return;
    var h = cfg.hero || {};
    if (h.video) {
      var v = el("video", null, { playsinline: "", preload: "none", "aria-hidden": "true", tabindex: "-1" });
      v.muted = true; v.loop = true; v.autoplay = true;
      v.setAttribute("muted", ""); v.setAttribute("loop", "");
      v.appendChild(el("source", null, { src: h.video, type: videoType(h.video) }));
      host.appendChild(v);
    } else if (h.image) {
      host.appendChild(el("img", null, { src: h.image, alt: "" }));
    }
  }

  /* ================================================= 10. folklore viewer tabs */
  function initViewer() {
    var list = $(".viewer__list");
    if (!list) return;
    var tabs = $$(".viewer__btn", list);

    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        var panel = doc.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      window.dispatchEvent(new CustomEvent("moha:refresh-scroll"));
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1
              : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var next = tabs[(i + d + tabs.length) % tabs.length];
        next.focus();
        select(next);
      });
    });
  }

  /* ================================================= 11. copyright year */
  function initYear() {
    var y = String(new Date().getFullYear());
    $$("[data-year]").forEach(function (n) { n.textContent = y; });
  }

  /* ================================================= boot */
  function boot() {
    activatePlates();
    applyBrand();
    applyMascot();
    applySocial();
    initNav();
    initTransitions();
    initVideos();
    initGallery();
    initHeroMedia();
    initViewer();
    initYear();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
