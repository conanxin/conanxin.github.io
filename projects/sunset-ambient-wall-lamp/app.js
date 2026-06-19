/* ============================================================
   Sunset Time Ambient Art Wall Lamp — interaction logic
   - Pointer Events for unified touch + mouse
   - Red bead → sun height (top % of panel)
   - Black bead → brightness (glow + ambient wash + sun intensity)
   - Spring-back release + retained state
   - Auto Demo: animates from dim dusk to full sunset
   ============================================================ */

(function () {
  'use strict';

  // ---------- elements ----------
  const panel       = document.getElementById('panel');
  const panelSky    = document.getElementById('panelSky');
  const panelSun    = document.getElementById('panelSun');
  const ambient     = document.getElementById('ambient');
  const cordRed     = document.querySelector('.cord--red');
  const cordBlack   = document.querySelector('.cord--black');
  const beadRed     = document.getElementById('beadRed');
  const beadBlack   = document.getElementById('beadBlack');
  const cordStringRed   = document.getElementById('cordStringRed');
  const cordStringBlack = document.getElementById('cordStringBlack');
  const btnReset    = document.getElementById('btnReset');
  const btnAuto     = document.getElementById('btnAuto');
  const readSun     = document.getElementById('readSun');
  const readGlow    = document.getElementById('readGlow');

  // ---------- state ----------
  // sunHeight: 0 = below horizon, 1 = high in sky (range 0.05–0.92)
  // glow:      0 = dim/dusk, 1 = full bright sunset
  const state = {
    sunHeight: 0.30,   // start: sun low (sunset)
    glow:      0.45,   // start: dim/medium glow
    pullRed:   0,      // 0..1 of how far the cord is currently pulled
    pullBlack: 0,
  };

  // baseline cord length when at rest
  const CORD_BASE = 180;   // px
  const CORD_PULL_MAX = 160; // px additional when fully dragged

  // limits for sun and glow
  const SUN_TOP_MIN = 0.05;
  const SUN_TOP_MAX = 0.92;
  const GLOW_MIN = 0;
  const GLOW_MAX = 1;

  // ---------- derived rendering ----------
  // map sunHeight (0..1) to css --sun-top (0.92..0.08) — invert so high value = high in sky
  function sunTopFromHeight(h) {
    // h=0 -> top=0.88 (low), h=1 -> top=0.10 (high)
    return 0.88 - h * 0.78;
  }

  function sunSizeFromHeight(h) {
    // sun appears slightly smaller when high in sky, larger at horizon
    return 70 + (1 - h) * 35; // 70..105 px
  }

  function sunOpacityFromGlow(g) {
    return 0.45 + g * 0.55; // 0.45..1.0
  }

  function glowColor(g) {
    // mix from dim red to bright orange-yellow
    // g=0:   rgba(120, 30, 20, 0.25)
    // g=0.5: rgba(220, 90, 30, 0.55)
    // g=1:   rgba(255, 170, 60, 0.75)
    const r = Math.round(120 + g * 135);
    const gr = Math.round(30 + g * 140);
    const b = Math.round(20 + g * 40);
    const a = (0.25 + g * 0.5).toFixed(2);
    return `rgba(${r}, ${gr}, ${b}, ${a})`;
  }

  function ambientColor(g) {
    // room wash: warmer/brighter as glow rises
    const r = Math.round(60 + g * 200);
    const gr = Math.round(20 + g * 120);
    const b = Math.round(10 + g * 40);
    const a = (g * 0.32).toFixed(2);
    return `rgba(${r}, ${gr}, ${b}, ${a})`;
  }

  function sunLabel(h) {
    if (h < 0.25) return 'low';
    if (h < 0.6)  return 'rising';
    if (h < 0.85) return 'high';
    return 'noon';
  }

  function glowLabel(g) {
    if (g < 0.25) return 'dim';
    if (g < 0.55) return 'warm';
    if (g < 0.8)  return 'bright';
    return 'sunset';
  }

  function applyState() {
    const top = sunTopFromHeight(state.sunHeight);
    const size = sunSizeFromHeight(state.sunHeight);
    const op = sunOpacityFromGlow(state.glow);

    panelSun.style.setProperty('--sun-top', top);
    panelSun.style.setProperty('--sun-size', size + 'px');
    panelSun.style.setProperty('--sun-opacity', op.toFixed(2));

    panel.style.setProperty('--glow-color', glowColor(state.glow));
    ambient.style.setProperty('--ambient-color', ambientColor(state.glow));

    // slight sky shift: brighter as glow rises
    const g = state.glow;
    const skyBrightness = 0.85 + g * 0.15;
    panelSky.style.filter = `brightness(${skyBrightness.toFixed(2)}) saturate(${0.95 + g * 0.2})`;

    if (readSun)  readSun.textContent  = sunLabel(state.sunHeight);
    if (readGlow) readGlow.textContent = glowLabel(state.glow);
  }

  // ---------- cord visual update ----------
  function applyCord(cordEl, beadEl, cordStringEl, pullRatio) {
    // pullRatio: 0..1
    const length = CORD_BASE + pullRatio * CORD_PULL_MAX;
    cordStringEl.style.setProperty('--cord-length', length + 'px');
    beadEl.style.setProperty('--cord-length', length + 'px');
    beadEl.style.top = length + 'px';

    // bend the cord slightly when pulled
    const line = cordStringEl.querySelector('line');
    if (line) {
      // slight curve outward: translate endpoint a few px
      const curve = pullRatio * 6;
      line.setAttribute('y2', 200);
      line.setAttribute('transform', `rotate(${curve.toFixed(2)} 10 0)`);
    }

    // hint labels are static (CSS-positioned) so they never overlap each other
  }

  // ---------- drag handler ----------
  function makeDragger(bead, cordEl, cordStringEl, onPull) {
    let active = false;
    let pointerId = null;
    let startY = 0;
    let startPull = 0;
    let maxPull = 0; // updated per drag

    function onDown(e) {
      // only primary button / single touch / pen
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      active = true;
      pointerId = e.pointerId;
      startY = e.clientY;
      startPull = onPull.get();
      maxPull = startPull;
      bead.setPointerCapture(pointerId);
      bead.classList.add('is-dragging');
      cordEl.classList.add('is-active');
      bead.style.transition = 'none';
    }

    function onMove(e) {
      if (!active || e.pointerId !== pointerId) return;
      e.preventDefault();
      const dy = e.clientY - startY; // positive when dragging down
      // 1px ≈ 0.005 pull ratio (so 200px drag = full)
      let pull = startPull + dy / 200;
      if (pull < 0) pull = 0;
      if (pull > 1) pull = 1;
      if (pull > maxPull) maxPull = pull;
      onPull.set(pull);
      applyCord(cordEl, bead, cordStringEl, pull);
    }

    function onUp(e) {
      if (!active || (e.pointerId !== undefined && e.pointerId !== pointerId)) return;
      active = false;
      try { bead.releasePointerCapture(pointerId); } catch (_) {}
      bead.classList.remove('is-dragging');
      cordEl.classList.remove('is-active');
      // keep the value the user reached (maxPull) — that's the "retained" state
      onPull.commit(maxPull);
      // visual spring-back: drop the cord back to baseline while keeping the lamp state
      bead.style.transition = '';
      applyCord(cordEl, bead, cordStringEl, 0);
    }

    bead.addEventListener('pointerdown', onDown, { passive: false });
    bead.addEventListener('pointermove', onMove, { passive: false });
    bead.addEventListener('pointerup',     onUp,    { passive: false });
    bead.addEventListener('pointercancel', onUp,    { passive: false });

    // also handle losing pointer outside bead
    bead.addEventListener('lostpointercapture', () => {
      if (active) {
        active = false;
        bead.classList.remove('is-dragging');
        cordEl.classList.remove('is-active');
        applyCord(cordEl, bead, cordStringEl, 0);
      }
    });
  }

  // ---------- red bead: controls sun height ----------
  makeDragger(beadRed, cordRed, cordStringRed, {
    get: () => state.pullRed,
    set: (p) => {
      state.pullRed = p;
      // map pull 0..1 -> sunHeight 0..1
      // (this is the "live" mapping while dragging)
      state.sunHeight = p;
      applyState();
    },
    commit: (maxP) => {
      // retain the highest sun position reached
      state.sunHeight = maxP;
      state.pullRed = 0;
      applyState();
    }
  });

  // ---------- black bead: controls glow/brightness ----------
  makeDragger(beadBlack, cordBlack, cordStringBlack, {
    get: () => state.pullBlack,
    set: (p) => {
      state.pullBlack = p;
      state.glow = p;
      applyState();
    },
    commit: (maxP) => {
      state.glow = maxP;
      state.pullBlack = 0;
      applyState();
    }
  });

  // ---------- buttons ----------
  function reset() {
    cancelAutoDemo();
    state.sunHeight = 0.30;
    state.glow = 0.45;
    state.pullRed = 0;
    state.pullBlack = 0;
    applyState();
    applyCord(cordRed,   beadRed,   cordStringRed,   0);
    applyCord(cordBlack, beadBlack, cordStringBlack, 0);
  }

  // ---------- auto demo ----------
  let autoTimer = null;
  let autoStart = 0;
  let autoFromH = 0;
  let autoFromG = 0;
  let autoDuration = 7000; // ms
  let autoDirection = 1;

  function startAutoDemo() {
    cancelAutoDemo();
    autoFromH = state.sunHeight;
    autoFromG = state.glow;
    autoStart = performance.now();
    autoDirection = (state.glow > 0.85 && state.sunHeight > 0.85) ? -1 : 1;
    btnAuto.disabled = true;
    btnAuto.textContent = 'Demo…';
    autoTimer = requestAnimationFrame(tickAuto);
  }

  function cancelAutoDemo() {
    if (autoTimer) {
      cancelAnimationFrame(autoTimer);
      autoTimer = null;
    }
    btnAuto.disabled = false;
    btnAuto.textContent = 'Auto Demo';
  }

  function tickAuto(now) {
    const t = Math.min(1, (now - autoStart) / autoDuration);
    // smooth ease
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    if (autoDirection === 1) {
      state.sunHeight = autoFromH + (0.95 - autoFromH) * e;
      state.glow      = autoFromG + (0.95 - autoFromG) * e;
    } else {
      state.sunHeight = autoFromH + (0.20 - autoFromH) * e;
      state.glow      = autoFromG + (0.15 - autoFromG) * e;
    }
    applyState();
    if (t < 1) {
      autoTimer = requestAnimationFrame(tickAuto);
    } else {
      // hold at peak, then go back next time the user hits the button
      btnAuto.disabled = false;
      btnAuto.textContent = 'Auto Demo';
      autoTimer = null;
    }
  }

  btnReset.addEventListener('click', reset);
  btnAuto.addEventListener('click', startAutoDemo);

  // ---------- prevent page scroll on touch within cord area ----------
  document.querySelector('.cords').addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });

  // ---------- keyboard accessibility (optional nicety) ----------
  beadRed.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const delta = (e.key === 'ArrowDown' ? 0.05 : -0.05);
      state.sunHeight = Math.max(0, Math.min(1, state.sunHeight + delta));
      applyState();
    }
  });
  beadBlack.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const delta = (e.key === 'ArrowDown' ? 0.05 : -0.05);
      state.glow = Math.max(0, Math.min(1, state.glow + delta));
      applyState();
    }
  });

  // ---------- init ----------
  applyState();
  applyCord(cordRed,   beadRed,   cordStringRed,   0);
  applyCord(cordBlack, beadBlack, cordStringBlack, 0);
})();
