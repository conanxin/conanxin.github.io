/* ============================================================
   Sunset Time Ambient Art Wall Lamp — V3 pull-chain interaction
   - Beads translate via CSS --pull variable (set on :root by JS)
   - Cord length: SVG line y2 attribute updates on pull
   - Red bead: pull → raise sun (3-step: low=0.56, middle=0.45, high=0.36)
   - Black bead: pull → brighten glow (3-step: dim/warm/sunset, continuous fill)
   - Bead always springs back to rest after release; lamp state retained
   - Auto Demo: simulated pulls on both beads
   - Reset: sun=middle, glow=warm
   ============================================================ */

(function () {
  'use strict';

  // ---------- elements ----------
  const panel        = document.getElementById('panel');
  const panelSky     = document.getElementById('panelSky');
  const panelSun     = document.getElementById('panelSun');
  const lampGlow     = document.getElementById('lampGlow');
  const cordRed      = document.querySelector('.cord[data-cord="red"]');
  const cordBlack    = document.querySelector('.cord[data-cord="black"]');
  const beadHitRed   = document.getElementById('beadHitRed');
  const beadHitBlack = document.getElementById('beadHitBlack');
  const beadRed      = document.getElementById('beadRed');
  const beadBlack    = document.getElementById('beadBlack');
  const cordStringRed   = document.getElementById('cordStringRed');
  const cordStringBlack = document.getElementById('cordStringBlack');
  const cordLineRed     = document.getElementById('cordLineRed');
  const cordLineBlack   = document.getElementById('cordLineBlack');
  const btnReset     = document.getElementById('btnReset');
  const btnAuto      = document.getElementById('btnAuto');
  const readSun      = document.getElementById('readSun');
  const readGlow     = document.getElementById('readGlow');

  // ---------- constants ----------
  const CORD_REST = 110;   // matches --cord-rest-len in CSS
  const CORD_PULL_MAX = 80; // matches --cord-max-pull in CSS

  // Sun y positions (fraction of panel height, top=0)
  const SUN_LOW    = 0.56;
  const SUN_MIDDLE = 0.45;
  const SUN_HIGH   = 0.36;
  const SUN_STEPS  = [SUN_LOW, SUN_MIDDLE, SUN_HIGH];
  const SUN_LABELS = ['Low', 'Middle', 'High'];

  // Glow 3 tiers (continuous fill between them)
  const GLOW_DIM    = 0.20;
  const GLOW_WARM   = 0.58;
  const GLOW_SUNSET = 0.95;
  const GLOW_TIERS  = [GLOW_DIM, GLOW_WARM, GLOW_SUNSET];
  const GLOW_LABELS = ['Dim', 'Warm', 'Sunset'];

  // Default state
  const DEFAULT_SUN_IDX  = 1; // Middle
  const DEFAULT_GLOW_IDX = 1; // Warm

  // ---------- live state ----------
  const state = {
    sunIdx:  DEFAULT_SUN_IDX,
    glowIdx: DEFAULT_GLOW_IDX,
    // current pull depth in px (0..CORD_PULL_MAX), per cord
    pullRed:   0,
    pullBlack: 0,
  };

  // ---------- helpers ----------
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  function easeOutBack(t) {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function sunSize(idx) {
    // high → smaller, low → larger
    // idx 0 (low) = 100px, idx 2 (high) = 80px
    return Math.round(100 - idx * 10);
  }

  function sunOpacityFromGlowIdx(idx) {
    // base 0.55, +0.225 per tier up
    return 0.55 + idx * 0.225;
  }

  function ambientColorFromGlowIdx(idx) {
    const tier = GLOW_TIERS[idx];
    const r = Math.round(140 + tier * 110);
    const gr = Math.round(60  + tier * 90);
    const b = Math.round(30  + tier * 30);
    const a = (0.10 + tier * 0.32).toFixed(3);
    return `rgba(${r}, ${gr}, ${b}, ${a})`;
  }

  function panelGlowFromIdx(idx) {
    const tier = GLOW_TIERS[idx];
    const r = Math.round(180 + tier * 75);
    const gr = Math.round(80  + tier * 80);
    const b = Math.round(40  + tier * 20);
    const a = (0.20 + tier * 0.45).toFixed(3);
    return `rgba(${r}, ${gr}, ${b}, ${a})`;
  }

  function skyBrightness(idx) {
    return (0.88 + GLOW_TIERS[idx] * 0.22).toFixed(2);
  }

  // ---------- core render ----------
  function applyLampState() {
    const sIdx = state.sunIdx;
    const gIdx = state.glowIdx;

    const top = SUN_STEPS[sIdx];
    const size = sunSize(sIdx);
    const op   = sunOpacityFromGlowIdx(gIdx);

    panelSun.style.setProperty('--sun-top', top.toFixed(3));
    panelSun.style.setProperty('--sun-size', size + 'px');
    panelSun.style.setProperty('--sun-opacity', op.toFixed(2));

    panel.style.setProperty('--ambient-warm', panelGlowFromIdx(gIdx));
    lampGlow.style.background =
      `radial-gradient(ellipse 50% 50% at 50% 50%, ${ambientColorFromGlowIdx(gIdx)} 0%, transparent 65%)`;

    panelSky.style.filter =
      `brightness(${skyBrightness(gIdx)}) saturate(${(0.95 + GLOW_TIERS[gIdx] * 0.2).toFixed(2)})`;

    if (readSun)  readSun.textContent  = SUN_LABELS[sIdx];
    if (readGlow) readGlow.textContent = GLOW_LABELS[gIdx];
  }

  // ---------- cord + bead visual ----------
  // The bead is centered in the hit area; its visual position is
  //   translateY(60px + --pull) inside the hit area, where the hit area's
  //   bottom edge lines up with the resting cord length. So at rest the bead
  //   sits 60px above the bottom of the hit area, and pulling extends the cord
  //   downward by --pull.
  //
  // We update TWO things:
  //   (1) --red-pull / --black-pull on :root (drives the bead transform via CSS)
  //   (2) the SVG line y2 attribute (drives the visible cord length)
  function applyCord(cordString, cordLine, pullPx) {
    const y2 = CORD_REST + pullPx;
    if (cordLine) cordLine.setAttribute('y2', y2);
  }

  function applyPullVars() {
    document.documentElement.style.setProperty('--red-pull',   state.pullRed   + 'px');
    document.documentElement.style.setProperty('--black-pull', state.pullBlack + 'px');
    applyCord(cordStringRed,   cordLineRed,   state.pullRed);
    applyCord(cordStringBlack, cordLineBlack, state.pullBlack);
  }

  // ---------- drag handler ----------
  function makeDragger(hitEl, cordEl, key, opts) {
    // opts: { getCurrentIdx, setIdx, onLiveProgress }
    let active = false;
    let pointerId = null;
    let startY = 0;
    let startPull = 0;
    let maxPull = 0;
    let lastTier = opts.getCurrentIdx();

    function onDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      cancelAutoDemo();
      active = true;
      pointerId = e.pointerId;
      startY = e.clientY;
      startPull = state[key];
      maxPull = startPull;
      lastTier = opts.getCurrentIdx();
      try { hitEl.setPointerCapture(pointerId); } catch (_) {}
      cordEl.classList.add('is-dragging');
    }

    function onMove(e) {
      if (!active || e.pointerId !== pointerId) return;
      e.preventDefault();
      // vertical-only: ignore horizontal motion
      const dy = e.clientY - startY;
      let p = startPull + dy;
      if (p < 0) p = 0;
      if (p > CORD_PULL_MAX) p = CORD_PULL_MAX;
      if (p > maxPull) maxPull = p;
      state[key] = p;
      applyPullVars();
      // live tier feedback while pulling (optional)
      if (opts.onLiveProgress) opts.onLiveProgress(p);
    }

    function onUp(e) {
      if (!active || (e.pointerId !== undefined && e.pointerId !== pointerId)) return;
      active = false;
      try { hitEl.releasePointerCapture(pointerId); } catch (_) {}
      cordEl.classList.remove('is-dragging');
      // commit lamp state from the max pull reached
      opts.commit(maxPull);
      // spring the bead back to rest
      state[key] = 0;
      applyPullVars();
    }

    hitEl.addEventListener('pointerdown',   onDown,   { passive: false });
    hitEl.addEventListener('pointermove',   onMove,   { passive: false });
    hitEl.addEventListener('pointerup',     onUp,     { passive: false });
    hitEl.addEventListener('pointercancel', onUp,     { passive: false });
    hitEl.addEventListener('lostpointercapture', () => {
      if (active) { active = false; cordEl.classList.remove('is-dragging'); state[key] = 0; applyPullVars(); }
    });
  }

  // Red bead: pull down → raise sun. Commit on release based on max pull.
  // We use a step model so each "valid" pull beyond a threshold raises by one tier.
  // However, we also let the user drag back down to lower the sun (reverse).
  makeDragger(beadHitRed, cordRed, 'pullRed', {
    getCurrentIdx: () => state.sunIdx,
    commit: (maxPullPx) => {
      // map pull depth → tier offset from current.
      // 24px = one tier up (down to 96px = four tiers, but we only have 3).
      const delta = Math.round(maxPullPx / 24);
      const newIdx = clamp(state.sunIdx + delta, 0, 2);
      if (newIdx !== state.sunIdx) {
        state.sunIdx = newIdx;
        applyLampState();
      }
    }
  });

  // Black bead: pull down → brighten glow. Same step model.
  makeDragger(beadHitBlack, cordBlack, 'pullBlack', {
    getCurrentIdx: () => state.glowIdx,
    commit: (maxPullPx) => {
      const delta = Math.round(maxPullPx / 24);
      const newIdx = clamp(state.glowIdx + delta, 0, 2);
      if (newIdx !== state.glowIdx) {
        state.glowIdx = newIdx;
        applyLampState();
      }
    }
  });

  // ---------- buttons ----------
  function reset() {
    cancelAutoDemo();
    state.sunIdx = DEFAULT_SUN_IDX;
    state.glowIdx = DEFAULT_GLOW_IDX;
    state.pullRed = 0;
    state.pullBlack = 0;
    applyLampState();
    applyPullVars();
  }

  // ---------- Auto Demo: simulated pulls on both beads ----------
  // Sequence: red pulls (raises sun) → black pulls (brightens glow) → repeat
  // Each "pull" animates the bead 0 → 70px → 0 over ~700ms.
  // 3 cycles, ending at sun=High + glow=Sunset, then both beads rest.
  let autoTimer = null;
  let autoStart = 0;
  let autoState = null; // { phase, t0, fromIdx, toIdx, cycle, totalCycles }

  function startAutoDemo() {
    cancelAutoDemo();
    btnAuto.disabled = true;
    btnAuto.textContent = 'Demo…';
    autoStart = performance.now();
    autoState = { phase: 'pullRed', cycle: 0, totalCycles: 3, t0: autoStart };
    autoTimer = requestAnimationFrame(tickAuto);
  }

  function cancelAutoDemo() {
    if (autoTimer) {
      cancelAnimationFrame(autoTimer);
      autoTimer = null;
    }
    autoState = null;
    btnAuto.disabled = false;
    btnAuto.textContent = 'Auto Demo';
    // ensure beads are at rest
    state.pullRed = 0;
    state.pullBlack = 0;
    applyPullVars();
  }

  const PHASE_DUR = 700; // ms per pull animation

  function tickAuto(now) {
    if (!autoState) return;
    const phaseAge = now - autoState.t0;
    const t = clamp(phaseAge / PHASE_DUR, 0, 1);

    // up-and-down envelope: 0..1..0 over t=0..1, with ease
    let env;
    if (t < 0.5) env = easeOutBack(t * 2) * 0.7 + 0.3;       // ramp up to ~0.95 quickly
    else         env = (1 - (t - 0.5) * 2) * 0.7 + 0.3;      // ramp back to 0.3, but we go to 0

    // simpler envelope: pull goes 0 → max → 0 across the phase
    let pull;
    if (t < 0.5) {
      const k = t / 0.5;
      pull = easeOutBack(k) * 60; // reach ~60px
    } else {
      const k = (t - 0.5) / 0.5;
      pull = (1 - easeInOut(k)) * 60;
    }
    pull = clamp(pull, 0, 80);

    // active cord in this phase
    if (autoState.phase === 'pullRed') {
      state.pullRed = pull;
      state.pullBlack = 0;
      // while pulling red, raise sun by one tier per cycle
      // we just commit the new idx live for visual feedback
      if (pull > 40 && autoState.committedRed !== state.sunIdx + 1) {
        // no-op, we commit at end of phase
      }
    } else {
      state.pullRed = 0;
      state.pullBlack = pull;
    }
    applyPullVars();

    if (t < 1) {
      autoTimer = requestAnimationFrame(tickAuto);
      return;
    }

    // phase end — commit and advance
    if (autoState.phase === 'pullRed') {
      // raise sun by one tier if not already at top
      if (state.sunIdx < 2) {
        state.sunIdx = clamp(state.sunIdx + 1, 0, 2);
        applyLampState();
      }
      autoState.phase = 'pullBlack';
      autoState.t0 = now;
      autoState.committedRed = true;
    } else {
      // brighten glow by one tier if not already at top
      if (state.glowIdx < 2) {
        state.glowIdx = clamp(state.glowIdx + 1, 0, 2);
        applyLampState();
      }
      autoState.cycle += 1;
      if (autoState.cycle >= autoState.totalCycles || (state.sunIdx === 2 && state.glowIdx === 2)) {
        // done — hold at peak with beads at rest
        state.pullRed = 0;
        state.pullBlack = 0;
        applyPullVars();
        cancelAutoDemo();
        return;
      }
      autoState.phase = 'pullRed';
      autoState.t0 = now;
    }
    autoTimer = requestAnimationFrame(tickAuto);
  }

  btnReset.addEventListener('click', reset);
  btnAuto.addEventListener('click', startAutoDemo);

  // ---------- prevent page scroll on touch within cord area ----------
  document.querySelector('.cords').addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });

  // ---------- keyboard accessibility ----------
  function onKey(bead, dir) {
    cancelAutoDemo();
    if (bead === 'red') {
      state.sunIdx = clamp(state.sunIdx + (dir === 'down' ? 1 : -1), 0, 2);
    } else {
      state.glowIdx = clamp(state.glowIdx + (dir === 'down' ? 1 : -1), 0, 2);
    }
    applyLampState();
  }

  beadHitRed.addEventListener('keydown',   (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); onKey('red', e.key === 'ArrowDown' ? 'down' : 'up'); }
  });
  beadHitBlack.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); onKey('black', e.key === 'ArrowDown' ? 'down' : 'up'); }
  });

  // ---------- init ----------
  applyLampState();
  applyPullVars();
})();
