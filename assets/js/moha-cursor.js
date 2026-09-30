/* ==========================================================================
   Moha - premium cursor system
   assets/js/moha-cursor.js
   --------------------------------------------------------------------------
   Small centre dot + softly interpolated ring follower.
     hover link/button  -> ring expands slightly
     hover image/media  -> soft larger circle
     hover gallery item -> ring grows and shows a "VIEW" indicator
     press              -> ring contracts
     [data-magnetic]    -> element drifts subtly toward the pointer

   Automatically DISABLED on touch devices, coarse pointers, narrow viewports
   and when the visitor prefers reduced motion - the native cursor returns.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  var enabled = false;
  var cursor = null, dot = null, ring = null;
  var mx = -100, my = -100, rx = -100, ry = -100;
  var rafId = null;
  var down = false;
  var magnets = [];

  function eligible() {
    return finePointer.matches && !reduced && window.innerWidth >= 1024;
  }

  function build() {
    cursor = doc.createElement("div");
    cursor.className = "cursor";
    cursor.setAttribute("aria-hidden", "true");
    dot = doc.createElement("span");
    dot.className = "cursor__dot";
    ring = doc.createElement("span");
    ring.className = "cursor__ring";
    var label = doc.createElement("span");
    label.className = "cursor__label";
    label.textContent = "View";
    ring.appendChild(label);
    cursor.appendChild(ring);
    cursor.appendChild(dot);
    doc.body.appendChild(cursor);
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    if (cursor && cursor.parentNode) cursor.parentNode.removeChild(cursor);
    cursor = dot = ring = null;
    root.classList.remove("has-cursor");
    magnets.forEach(function (m) { m.node.style.transform = ""; });
  }

  function loop() {
    /* ring lags behind for the trailing feel; dot is instant */
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    if (ring) ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0) scale(" + (down ? 0.82 : 1) + ")";
    if (dot) dot.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
    rafId = requestAnimationFrame(loop);
  }

  function setState(state) {
    if (cursor) cursor.setAttribute("data-state", state || "default");
  }

  function stateFor(target) {
    if (!target || !target.closest) return "default";
    var explicit = target.closest("[data-cursor]");
    if (explicit) return explicit.getAttribute("data-cursor");
    if (target.closest("a, button, [role='button'], input, select, textarea")) return "link";
    if (target.closest("img, video, .plate")) return "media";
    return "default";
  }

  function onMove(e) {
    mx = e.clientX; my = e.clientY;
    if (!enabled) return;
    /* magnetic drift */
    magnets.forEach(function (m) {
      var r = m.node.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = mx - cx, dy = my - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var range = Math.max(r.width, r.height) / 2 + 46;
      if (dist < range) {
        var pull = (1 - dist / range) * m.strength;
        m.node.style.transform = "translate3d(" + (dx * pull) + "px," + (dy * pull) + "px,0)";
      } else if (m.node.style.transform) {
        m.node.style.transform = "";
      }
    });
  }

  function enable() {
    if (enabled) return;
    enabled = true;
    build();
    root.classList.add("has-cursor");
    magnets = Array.prototype.slice.call(doc.querySelectorAll("[data-magnetic]")).map(function (n) {
      return { node: n, strength: parseFloat(n.getAttribute("data-magnetic") || "0.16") };
    });
    loop();
  }

  function sync() {
    if (eligible()) enable();
    else { enabled = false; destroy(); }
  }

  doc.addEventListener("mousemove", onMove, { passive: true });
  doc.addEventListener("mouseover", function (e) { setState(stateFor(e.target)); }, { passive: true });
  doc.addEventListener("mousedown", function () { down = true; if (cursor) cursor.classList.add("is-down"); });
  doc.addEventListener("mouseup", function () { down = false; if (cursor) cursor.classList.remove("is-down"); });
  doc.addEventListener("mouseleave", function () { if (cursor) cursor.style.opacity = "0"; });
  doc.addEventListener("mouseenter", function () { if (cursor) cursor.style.opacity = "1"; });
  window.addEventListener("blur", function () { if (cursor) cursor.style.opacity = "0"; });
  window.addEventListener("focus", function () { if (cursor) cursor.style.opacity = "1"; });

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(sync, 180);
  });
  if (finePointer.addEventListener) finePointer.addEventListener("change", sync);

  sync();
})();
