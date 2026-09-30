/* ==========================================================================
   Moha - atmosphere layer (dust / ember particles)
   assets/js/moha-atmosphere.js
   --------------------------------------------------------------------------
   A single lightweight canvas of drifting ash + ember motes. Bounded particle
   count, capped devicePixelRatio, paused while the tab is hidden and removed
   entirely when the visitor prefers reduced motion. The fog sheets and film
   grain are pure CSS (see main.css) so this is the only canvas on the site.
   ========================================================================== */
(function () {
  "use strict";

  var canvas = document.querySelector(".atmo__dust");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  var w = 0, h = 0;
  var motes = [];
  var rafId = null;
  var running = false;

  function size() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(randomY) {
    var ember = Math.random() < 0.18;
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + 8,
      vy: -(0.08 + Math.random() * 0.3),
      vx: (Math.random() - 0.5) * 0.16,
      r: ember ? 0.7 + Math.random() * 1.1 : 0.5 + Math.random() * 1.4,
      a: 0.1 + Math.random() * 0.34,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.002 + Math.random() * 0.004,
      ember: ember
    };
  }

  function populate() {
    var target = Math.min(42, Math.max(16, Math.round((w * h) / 52000)));
    motes = [];
    for (var i = 0; i < target; i++) motes.push(spawn(true));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < motes.length; i++) {
      var m = motes[i];
      m.sway += m.swaySpeed * 16;
      m.x += m.vx + Math.sin(m.sway) * 0.12;
      m.y += m.vy;
      if (m.y < -10 || m.x < -10 || m.x > w + 10) { motes[i] = spawn(false); continue; }
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, 6.2832);
      ctx.fillStyle = m.ember
        ? "rgba(190, 60, 40," + (m.a * 0.9).toFixed(3) + ")"
        : "rgba(200, 192, 176," + (m.a * 0.55).toFixed(3) + ")";
      ctx.fill();
    }
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { size(); populate(); }, 160);
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  size();
  populate();
  start();
})();
