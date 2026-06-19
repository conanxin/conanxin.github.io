/* ============================================================
   Sunset Time Ambient Art Wall Lamp — V2 interaction logic
   - Pointer Events (touch + mouse unified)
   - Red bead  → sun height  (panel-y 0.58 low → 0.34 high)
   - Black bead→ glow level  (3 tiers: dim / warm / sunset)
   - Cord length visually extends while dragging, spring-backs on release
   - Lamp state retained after release
   - Auto Demo: animated sun rise + glow ramp + bead wiggle
   ============================================================ */

(function () {
  'use strict';

  // ---------- elements ----------
  const panel       = document.getElementById('panel');
  const panelSky    = document.getElementById('panelSky');
  const panelSun    = document.getElementById('panelSun');
  const lampGlow    = document.getElementById('lampGlow');
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

  // ---------- constraints ----------
  // Sun y range inside the panel (0 = top, 1 = bottom)
  // Higher value = lower in the panel. We keep the sun in the upper-middle band.
  const SUN_TOP_MIN  = 0.34;   // top (high sun) — NEVER above 0.34 → never clipped
  const SUN_TOP_MAX  = 0.58;   // bottom (low sun / horizon)

  // Glow tiers (continuous, but UI labels snap to 3 levels)
  const GLOW_DIM    = 0.18;
  const GLOW_WARM   = 0.55;
  const GLOW_SUNSET = 0.92;

  // Default state — looks good immediately
  const DEFAULT = { sun: 0.42, glow: GLOW_WARM };

  // Live state
  const state = {
    sun:  DEFAULT.sun,
    glow: DEFAULT.glow,
  };

  // Cord pull ratios (visual only — separate from lamp state)
  // 0 = rest, 1 = fully pulled
  const pull = { red: 0, black: 0 };

  // ---------- helpers ----------
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function sunSize(s) {
    // smaller when high, larger when low (horizon glow effect)
    // s=0.34 (top) → 76px ;  s=0.58 (bottom) → 102px
    const t = (s - SUN_TOP_MIN) / (SUN_TOP_MAX - SUN_TOP_MIN); // 0..1
    return Math.round(76 + t * 26);
  }

  function sunOpacity(g) {
    return clamp(0.55 + g * 0.45, 0, 1);
  }

  function ambientColor(g) {
    // wall wash: dim warm red → bright orange
    const r = Math.round(140 + g * 110);
    const gr = Math.round(60  + g * 90);
    const b = Math.round(30  + g * 30);
    const a = (0.10 + g * 0.32).toFixed(3);
    return `rgba(${r}, ${gr}, ${b}, ${a})`;
  }

  function panelGlowColor(g) {
    // outer panel box-shadow tint
    const r = Math.round(180 + g * 75);
    const gr = Math.round(80  + g * 80);
    const b = Math.round(40  + g * 20);
    const a = (0.20 + g * 0.45).toFixed(3);
    return `rgba(${r}, ${gr}, ${b}, ${a})`;
  }

  function skyBrightness(g) {
    // 0.88..1.10
    return (0.88 + g * 0.22).toFixed(2);
  }

  function glowLabel(g) {
    if (g < 0.38) return 'Dim';
    if (g < 0.78) return 'Warm';
    return 'Sunset';
  }

  function sunLabel(s) {
    // s closer to SUN_TOP_MIN = top
    if (s < 0.42) return 'High';
    if (s < 0.52) return 'Mid';
    return 'Low';
  }

  // ---------- core render ----------
  function applyLampState() {
    const g = state.glow;
    const s = state.sun;

    panelSun.style.setProperty('--sun-top', s.toFixed(3));
    panelSun.style.setProperty('--sun-size', sunSize(s) + 'px');
    panelSun.style.setProperty('--sun-opacity', sunOpacity(g).toFixed(2));

    panel.style.setProperty('--ambient-warm', panelGlowColor(g));
    lampGlow.style.background =
      `radial-gradient(ellipse 50% 50% at 50% 50%, ${ambientColor(g)} 0%, transparent 65%)`;

    panelSky.style.filter =
      `brightness(${skyBrightness(g)}) saturate(${(0.95 + g * 0.2).toFixed(2)})`;

    document.documentElement.style.setProperty('--glow-strength', g.toFixed(2));

    if (readSun)  readSun.textContent  = sunLabel(s);
    if (readGlow) readGlow.textContent = glowLabel(g);
  }

  // ---------- cord visual ----------
  function applyCord(cordEl, beadEl, cordStringEl, ratio) {
    // ratio: 0..1 (visual pull only)
    const base = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cord-base')) || 92;
    const max  = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cord-pull-max')) || 120;
    const length = base + ratio * max;
    cordStringEl.style.setProperty('--cord-current', length + 'px');
    beadEl.style.top = length + 'px';

    // slight curve on the cord when pulled
    const line = cordStringEl.querySelector('line');
    if (line) {
      const curve = ratio * 5;
      line.setAttribute('transform', `rotate(${curve.toFixed(2)} 10 0)`);
    }
  }

  // ---------- drag handler ----------
  function makeDragger(bead, cordEl, cordStringEl, opts) {
    // opts: { getPull, setPull, getLampValue, setLampValue, lampMin, lampMax, key }
    let active = false;
    let pointerId = null;
    let startY = 0;
    let startPull = 0;
    let maxPull = 0;

    function onDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      // cancel any running auto-demo so it doesn't fight the user
      cancelAutoDemo();
      active = true;
      pointerId = e.pointerId;
      startY = e.clientY;
      startPull = opts.getPull();
      maxPull = startPull;
      try { bead.setPointerCapture(pointerId); } catch (_) {}
      bead.classList.add('is-dragging');
      cordEl.classList.add('is-active');
      bead.style.transition = 'none';
      // also disable cord-string transition during drag
      cordStringEl.style.transition = 'none';
    }

    function onMove(e) {
      if (!active || e.pointerId !== pointerId) return;
      e.preventDefault();
      const dy = e.clientY - startY; // positive = down
      // 1px ≈ 0.005 of pull ratio (200px = full)
      let p = startPull + dy / 200;
      p = clamp(p, 0, 1);
      if (p > maxPull) maxPull = p;
      opts.setPull(p);
      applyCord(cordEl, bead, cordStringEl, p);
      // also map pull → lamp value live
      const lamp = opts.lampMin + (opts.lampMax - opts.lampMin) * p;
      opts.setLampValue(lamp);
      applyLampState();
    }

    function onUp(e) {
      if (!active || (e.pointerId !== undefined && e.pointerId !== pointerId)) return;
      active = false;
      try { bead.releasePointerCapture(pointerId); } catch (_) {}
      bead.classList.remove('is-dragging');
      cordEl.classList.remove('is-active');
      // restore transitions
      bead.style.transition = '';
      cordStringEl.style.transition = '';
      // spring cord back, retain lamp value
      opts.setPull(0);
      applyCord(cordEl, bead, cordStringEl, 0);
    }

    function onCancel(e) {
      if (!active) return;
      onUp(e);
    }

    bead.addEventListener('pointerdown',   onDown,   { passive: false });
    bead.addEventListener('pointermove',   onMove,   { passive: false });
    bead.addEventListener('pointerup',     onUp,     { passive: false });
    bead.addEventListener('pointercancel', onCancel, { passive: false });
    bead.addEventListener('lostpointercapture', () => {
      if (active) { active = false; bead.classList.remove('is-dragging'); cordEl.classList.remove('is-active'); applyCord(cordEl, bead, cordStringEl, 0); }
    });
  }

  // ---------- red bead → sun height (LOW=0.58 .. HIGH=0.34) ----------
  // Pulling DOWN (positive p) should RAISE the sun (smaller s).
  makeDragger(beadRed, cordRed, cordStringRed, {
    getPull: () => pull.red,
    setPull: (p) => { pull.red = p; },
    getLampValue: () => state.sun,
    setLampValue: (v) => {
      // v is 0..1 from drag. Map: v=0 (no pull) -> low (0.58); v=1 (max pull) -> high (0.34)
      state.sun = SUN_TOP_MAX - v * (SUN_TOP_MAX - SUN_TOP_MIN);
    },
    lampMin: 0, lampMax: 1, key: 'sun'
  });

  // ---------- black bead → glow (DIM 0.18 .. SUNSET 0.92) ----------
  makeDragger(beadBlack, cordBlack, cordStringBlack, {
    getPull: () => pull.black,
    setPull: (p) => { pull.black = p; },
    getLampValue: () => state.glow,
    setLampValue: (v) => {
      // v is 0..1 from drag. Map: v=0 -> dim (0.18), v=1 -> sunset (0.92)
      state.glow = GLOW_DIM + v * (GLOW_SUNSET - GLOW_DIM);
    },
    lampMin: 0, lampMax: 1, key: 'glow'
  });

  // ---------- buttons ----------
  function reset() {
    cancelAutoDemo();
    state.sun = DEFAULT.sun;
    state.glow = DEFAULT.glow;
    pull.red = 0;
    pull.black = 0;
    applyLampState();
    applyCord(cordRed,   beadRed,   cordStringRed,   0);
    applyCord(cordBlack, beadBlack, cordStringBlack, 0);
  }

  // ---------- auto demo ----------
  let autoTimer = null;
  let autoStart = 0;
  let autoDuration = 6000; // ms
  let autoFromSun = 0;
  let autoFromGlow = 0;
  let autoTargetSun = 0;
  let autoTargetGlow = 0;

  function startAutoDemo() {
    cancelAutoDemo();
    autoFromSun = state.sun;
    autoFromGlow = state.glow;
    // target: high sun + sunset glow, unless we're already there, then go to dusk
    const atPeak = state.sun < 0.40 && state.glow > 0.80;
    if (atPeak) {
      autoTargetSun = 0.55;
      autoTargetGlow = GLOW_DIM;
    } else {
      autoTargetSun = 0.36;
      autoTargetGlow = GLOW_SUNSET;
    }
    autoStart = performance.now();
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
    const t = clamp((now - autoStart) / autoDuration, 0, 1);
    const e = easeInOut(t);
    state.sun  = autoFromSun  + (autoTargetSun  - autoFromSun)  * e;
    state.glow = autoFromGlow + (autoTargetGlow - autoFromGlow) * e;
    // map current state → cord pull ratios for the bead wiggle
    const redPull   = clamp(1 - (state.sun  - SUN_TOP_MIN) / (SUN_TOP_MAX - SUN_TOP_MIN), 0, 1);
    const blackPull = clamp((state.glow - GLOW_DIM) / (GLOW_SUNSET - GLOW_DIM), 0, 1);
    pull.red = redPull;
    pull.black = blackPull;
    applyCord(cordRed,   beadRed,   cordStringRed,   redPull);
    applyCord(cordBlack, beadBlack, cordStringBlack, blackPull);
    applyLampState();
    if (t < 1) {
      autoTimer = requestAnimationFrame(tickAuto);
    } else {
      // hold at target, then spring back to resting position
      cancelAutoDemo();
      pull.red = 0;
      pull.black = 0;
      applyCord(cordRed,   beadRed,   cordStringRed,   0);
      applyCord(cordBlack, beadBlack, cordStringBlack, 0);
    }
  }

  btnReset.addEventListener('click', reset);
  btnAuto.addEventListener('click', startAutoDemo);

  // ---------- prevent page scroll on touch within cord area ----------
  document.querySelector('.cords').addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });

  // ---------- keyboard accessibility ----------
  beadRed.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    cancelAutoDemo();
    const dir = e.key === 'ArrowDown' ? 1 : -1;
    state.sun = clamp(state.sun - dir * 0.03, SUN_TOP_MIN, SUN_TOP_MAX);
    applyLampState();
  });
  beadBlack.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    cancelAutoDemo();
    const dir = e.key === 'ArrowDown' ? 1 : -1;
    state.glow = clamp(state.glow + dir * 0.05, 0, 1);
    applyLampState();
  });

  // ---------- init ----------
  applyLampState();
  applyCord(cordRed,   beadRed,   cordStringRed,   0);
  applyCord(cordBlack, beadBlack, cordStringBlack, 0);
})();
