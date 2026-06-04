'use strict';

/* ============================================================
   HERO CANVAS — particle orbit animation
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      const angle = Math.random() * Math.PI * 2;
      const r = 60 + Math.random() * (Math.min(W, H) * 0.35);
      this.x = W / 2 + Math.cos(angle) * r;
      this.y = H / 2 + Math.sin(angle) * r;
      this.speed = 0.3 + Math.random() * 0.5;
      this.angle = angle + (Math.random() - 0.5) * 0.02;
      this.radius = 1 + Math.random() * 1.5;
      this.opacity = 0.3 + Math.random() * 0.5;
      this.hue = 220 + Math.random() * 40;
    }
    update() {
      this.angle += 0.002 * this.speed;
      const r = Math.sqrt((this.x - W / 2) ** 2 + (this.y - H / 2) ** 2);
      this.x = W / 2 + Math.cos(this.angle) * r;
      this.y = H / 2 + Math.sin(this.angle) * r;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(120, Math.floor((W * H) / 8000));
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawGrid() {
    const spacing = 50;
    ctx.strokeStyle = 'rgba(100,110,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += spacing) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += spacing) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  function drawOrbitRings() {
    const cx = W / 2, cy = H / 2;
    const radii = [80, 140, 210, 290];
    ctx.strokeStyle = 'rgba(0,212,255,0.05)';
    ctx.lineWidth = 1;
    radii.forEach(r => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.5, 0.3, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  function loop() {
    ctx.fillStyle = 'rgba(11,13,26,0.15)';
    ctx.fillRect(0, 0, W, H);
    drawGrid();
    drawOrbitRings();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  init();
  loop();
}

/* ============================================================
   NAV TOGGLE
   ============================================================ */
function initNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ============================================================
   MODULE A: Finite State Recurrence Simulator
   ============================================================ */
function initFiniteStateDemo() {
  const grid = document.getElementById('stateGrid');
  const countSelect = document.getElementById('stateCount');
  const speedSelect = document.getElementById('simSpeed');
  const startBtn = document.getElementById('simStartBtn');
  const resetBtn = document.getElementById('simResetBtn');
  const stepEl = document.getElementById('simStep');
  const visitedEl = document.getElementById('simVisited');
  const recEl = document.getElementById('simRecurrence');
  const loopEl = document.getElementById('simLoopLen');

  if (!grid) return;

  let cells = [];
  let stateCount = 24;
  let activeIdx = 0;
  let visitedSet = new Set();
  let stepCount = 0;
  let recurrenceStep = null;
  let loopLength = null;
  let timer = null;
  let running = false;

  function buildGrid(n) {
    stateCount = n;
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(n))}, 1fr)`;
    cells = [];
    for (let i = 0; i < n; i++) {
      const cell = document.createElement('div');
      cell.className = 'state-cell';
      cell.title = `状态 ${i}`;
      grid.appendChild(cell);
      cells.push(cell);
    }
    reset();
  }

  function reset() {
    running = false;
    if (timer) { clearInterval(timer); timer = null; }
    activeIdx = 0;
    visitedSet = new Set([0]);
    stepCount = 0;
    recurrenceStep = null;
    loopLength = null;
    cells.forEach(c => { c.classList.remove('active', 'visited'); });
    cells[0].classList.add('active', 'visited');
    stepEl.textContent = '0';
    visitedEl.textContent = '1';
    recEl.textContent = '—';
    loopEl.textContent = '—';
    startBtn.textContent = '▶ 开始演化';
    const insightEl = document.getElementById('recurrenceInsight');
    if (insightEl) insightEl.classList.remove('visible');
  }

  function tick() {
    stepCount++;
    // deterministic next: a modular rule so we get interesting patterns
    activeIdx = (activeIdx * 3 + 1) % stateCount;
    cells.forEach(c => c.classList.remove('active'));
    cells[activeIdx].classList.add('active');

    if (!visitedSet.has(activeIdx)) {
      visitedSet.add(activeIdx);
      cells[activeIdx].classList.add('visited');
    }

    stepEl.textContent = stepCount;
    visitedEl.textContent = visitedSet.size;

    if (recurrenceStep === null && visitedSet.has(activeIdx) && stepCount > 1) {
      recurrenceStep = stepCount;
      recEl.textContent = `第 ${recurrenceStep} 步`;

      // find loop length: from first visit of activeIdx to now
      const allCells = grid.querySelectorAll('.state-cell');
      let firstVisit = -1;
      for (let i = 0; i <= stepCount; i++) {
        // reverse-trace
      }
      // simple loop detection
      loopLength = stepCount - recurrenceStep + 1;
      loopEl.textContent = loopLength;
      running = false;
      clearInterval(timer);
      timer = null;
      startBtn.textContent = '▶ 已结束';
      // show recurrence insight
      const insightEl = document.getElementById('recurrenceInsight');
      if (insightEl) insightEl.classList.add('visible');
      return;
    }

    if (stepCount > stateCount * 20) {
      running = false;
      clearInterval(timer);
      timer = null;
      recEl.textContent = '未检测到';
      startBtn.textContent = '▶ 已结束';
    }
  }

  startBtn.addEventListener('click', () => {
    if (running) {
      running = false;
      clearInterval(timer);
      timer = null;
      startBtn.textContent = '▶ 继续';
    } else {
      if (recurrenceStep !== null) reset();
      running = true;
      startBtn.textContent = '⏸ 暂停';
      const speed = parseInt(speedSelect.value, 10);
      timer = setInterval(tick, speed);
    }
  });

  resetBtn.addEventListener('click', () => { reset(); });

  countSelect.addEventListener('change', () => {
    if (timer) { clearInterval(timer); timer = null; }
    buildGrid(parseInt(countSelect.value, 10));
  });

  buildGrid(parseInt(countSelect.value, 10));
}

/* ============================================================
   MODULE B: Phase Space / Near-Recurrence
   ============================================================ */
function initPhaseSpaceDemo() {
  const canvas = document.getElementById('phaseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const speedSlider = document.getElementById('psSpeed');
  const epsSlider = document.getElementById('psEpsilon');
  const trailSlider = document.getElementById('psTrail');
  const speedVal = document.getElementById('psSpeedVal');
  const epsVal = document.getElementById('psEpsilonVal');
  const trailVal = document.getElementById('psTrailVal');
  const startBtn = document.getElementById('psStartBtn');
  const pauseBtn = document.getElementById('psPauseBtn');
  const resetBtn = document.getElementById('psResetBtn');
  const stepEl = document.getElementById('psStep');
  const recEl = document.getElementById('psRecurrence');
  const statusEl = document.getElementById('psStatus');

  const W = canvas.width;
  const H = canvas.height;

  let x, y, vx, vy;
  let initRegion = null; // {x, y, r}
  let trail = [];
  let stepCount = 0;
  let firstRecurrenceStep = null;
  let running = false;
  let animId = null;
  let speed = 2, epsilon = 15, maxTrail = 200;

  function reset() {
    x = W / 2; y = H / 2;
    vx = 2.3; vy = 1.7;
    trail = [];
    stepCount = 0;
    firstRecurrenceStep = null;
    running = false;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    initRegion = { x, y, r: epsilon };
    stepEl.textContent = '0';
    recEl.textContent = '—';
    statusEl.textContent = '等待开始';
    startBtn.textContent = '▶ 开始';
  }

  function draw() {
    ctx.fillStyle = 'rgba(11,13,26,0.25)';
    ctx.fillRect(0, 0, W, H);

    // grid
    ctx.strokeStyle = 'rgba(100,110,255,0.08)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (let gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

    // initial region
    if (initRegion) {
      ctx.beginPath();
      ctx.arc(initRegion.x, initRegion.y, initRegion.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,0.12)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,212,255,0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // trail
    ctx.strokeStyle = 'rgba(0,212,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    trail.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // dots
    trail.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,0.6)';
      ctx.fill();
    });

    // current point
    if (running || trail.length > 0) {
      const cur = trail.length > 0 ? trail[trail.length - 1] : { x, y };
      ctx.beginPath();
      ctx.arc(cur.x, cur.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cur.x, cur.y, 9, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,212,255,0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function step() {
    x = (x + vx * speed + W) % W;
    y = (y + vy * speed + H) % H;
    trail.push({ x, y });
    if (trail.length > maxTrail) trail.shift();
    stepCount++;
    stepEl.textContent = stepCount;

    // check proximity to initRegion
    if (initRegion && firstRecurrenceStep === null) {
      const dx = x - initRegion.x;
      const dy = y - initRegion.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < epsilon && stepCount > 20) {
        firstRecurrenceStep = stepCount;
        recEl.textContent = `第 ${firstRecurrenceStep} 步`;
        statusEl.textContent = '✅ 接近回归发生！';
      }
    }
  }

  function loop() {
    if (running) step();
    draw();
    animId = requestAnimationFrame(loop);
  }

  speedSlider.addEventListener('input', () => {
    speed = parseFloat(speedSlider.value);
    speedVal.textContent = speed;
  });

  epsSlider.addEventListener('input', () => {
    epsilon = parseInt(epsSlider.value, 10);
    epsVal.textContent = epsilon;
    if (initRegion) initRegion.r = epsilon;
  });

  trailSlider.addEventListener('input', () => {
    maxTrail = parseInt(trailSlider.value, 10);
    trailVal.textContent = maxTrail;
  });

  startBtn.addEventListener('click', () => {
    if (!running) {
      running = true;
      startBtn.textContent = '▶ 运行中…';
    }
  });

  pauseBtn.addEventListener('click', () => {
    running = false;
    startBtn.textContent = '▶ 继续';
  });

  resetBtn.addEventListener('click', () => { reset(); });

  reset();
  loop();
}

/* ============================================================
   MODULE C: Entropy / Ink Diffusion
   ============================================================ */
function initEntropyDemo() {
  const canvas = document.getElementById('entropyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const CELL = 4;
  const COLS = Math.floor(W / CELL);
  const ROWS = Math.floor(H / CELL);

  const countSlider = document.getElementById('particleCount');
  const countVal = document.getElementById('particleCountVal');
  const diffuseBtn = document.getElementById('diffuseBtn');
  const stepBtn = document.getElementById('diffuseStepBtn');
  const resetBtn = document.getElementById('diffuseResetBtn');
  const entropyEl = document.getElementById('entropyScore');
  const stepEl = document.getElementById('diffuseStep');
  const hintEl = document.getElementById('entropyHint');

  let particles = [];
  let stepCount = 0;
  let animId = null;
  let running = false;

  const MAX_PARTICLES = 400;
  const INITIAL_CLUSTER = 60; // initial compact blob radius in cells

  function initParticles(n) {
    particles = [];
    const cx = Math.floor(COLS / 2);
    const cy = Math.floor(ROWS / 2);
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * INITIAL_CLUSTER;
      particles.push({
        px: cx + Math.cos(angle) * r,
        py: cy + Math.sin(angle) * r
      });
    }
    stepCount = 0;
    running = false;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    entropyEl.textContent = '0.00';
    stepEl.textContent = '0';
    hintEl.textContent = '点击"扩散"开始';
    diffuseBtn.textContent = '💧 扩散';
  }

  function computeEntropy() {
    // measure spatial variance as proxy for entropy
    let sx = 0, sy = 0;
    particles.forEach(p => { sx += p.px; sy += p.py; });
    sx /= particles.length; sy /= particles.length;
    let variance = 0;
    particles.forEach(p => {
      const dx = p.px - sx; const dy = p.py - sy;
      variance += dx * dx + dy * dy;
    });
    variance /= particles.length;
    // normalize to [0,1] by comparing to max possible variance (diagonal of grid)
    const maxVar = (COLS * COLS + ROWS * ROWS) / 4;
    return Math.min(variance / maxVar, 1);
  }

  function step() {
    stepCount++;
    stepEl.textContent = stepCount;
    particles.forEach(p => {
      p.px += (Math.random() - 0.5) * 2;
      p.py += (Math.random() - 0.5) * 2;
      p.px = Math.max(0, Math.min(COLS - 1, p.px));
      p.py = Math.max(0, Math.min(ROWS - 1, p.py));
    });
    const e = computeEntropy();
    entropyEl.textContent = e.toFixed(2);
    if (stepCount > 10 && e < 0.15) hintEl.textContent = '⚠️ 回到低熵态概率极低';
    else if (stepCount > 10) hintEl.textContent = '混合进行中…';
  }

  function draw() {
    ctx.fillStyle = '#0f1225';
    ctx.fillRect(0, 0, W, H);

    // dividing line
    ctx.strokeStyle = 'rgba(100,110,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H);
    ctx.stroke();

    // left label
    ctx.fillStyle = 'rgba(136,144,200,0.5)';
    ctx.font = '11px sans-serif';
    ctx.fillText('初始侧', 6, 14);
    ctx.fillText('混合区', W / 2 + 6, 14);

    // draw particles
    particles.forEach(p => {
      ctx.fillStyle = `rgba(108,99,255,${0.6 + Math.random() * 0.4})`;
      ctx.fillRect(Math.floor(p.px) * CELL, Math.floor(p.py) * CELL, CELL, CELL);
    });
  }

  function loop() {
    if (running) step();
    draw();
    animId = requestAnimationFrame(loop);
  }

  countSlider.addEventListener('input', () => {
    const n = parseInt(countSlider.value, 10);
    countVal.textContent = n;
    initParticles(n);
  });

  diffuseBtn.addEventListener('click', () => {
    if (!running) {
      running = true;
      diffuseBtn.textContent = '⏸ 暂停';
    } else {
      running = false;
      diffuseBtn.textContent = '💧 继续';
    }
  });

  stepBtn.addEventListener('click', () => { step(); draw(); });

  resetBtn.addEventListener('click', () => {
    const n = parseInt(countSlider.value, 10);
    initParticles(n);
    draw();
  });

  initParticles(parseInt(countSlider.value, 10));
  loop();
}

/* ============================================================
   MODULE D: Time Scale Calculator
   ============================================================ */
function initTimeScaleCalculator() {
  const logNSlider = document.getElementById('logN');
  const logFSlider = document.getElementById('logF');
  const logNVal = document.getElementById('logNVal');
  const logFVal = document.getElementById('logFVal');
  const estTimeEl = document.getElementById('estTime');
  const cmpLife = document.getElementById('cmpLife');
  const cmpLifeNote = document.getElementById('cmpLifeNote');
  const cmpCivil = document.getElementById('cmpCivil');
  const cmpCivilNote = document.getElementById('cmpCivilNote');
  const cmpUniverse = document.getElementById('cmpUniverse');
  const cmpUniverseNote = document.getElementById('cmpUniverseNote');

  if (!logNSlider) return;

  const LIFE_YEARS = 80;
  const CIVIL_YEARS = 6000;
  const UNIVERSE_YEARS = 1.38e10;

  function formatTime(seconds) {
    if (seconds < 60) return `${seconds.toExponential(1)} 秒`;
    if (seconds < 3600) return `${(seconds / 60).toExponential(1)} 分钟`;
    if (seconds < 86400 * 365) return `${(seconds / 86400).toExponential(1)} 天`;
    if (seconds < 86400 * 365 * 1e9) return `${(seconds / (86400 * 365)).toExponential(1)} 年`;
    if (seconds < 86400 * 365 * 1e12) return `${(seconds / (86400 * 365 * 1e9)).toExponential(1)} 十亿年`;
    return `${(seconds / (86400 * 365 * UNIVERSE_YEARS)).toExponential(1)} × 宇宙年龄`;
  }

  function compute() {
    const logN = parseInt(logNSlider.value, 10);
    const logF = parseInt(logFSlider.value, 10);
    logNVal.textContent = logN;
    logFVal.textContent = logF;

    // T ≈ N / f  (toy estimate)
    const seconds = Math.pow(10, logN - logF);
    estTimeEl.textContent = formatTime(seconds);

    const lifeSec = LIFE_YEARS * 86400 * 365;
    const civilSec = CIVIL_YEARS * 86400 * 365;
    const uniSec = UNIVERSE_YEARS * 86400 * 365;

    const lifeRatio = Math.min(seconds / lifeSec, 1);
    const civilRatio = Math.min(seconds / civilSec, 1);
    const uniRatio = Math.min(seconds / uniSec, 1);

    cmpLife.style.setProperty('--fill', (lifeRatio * 100) + '%');
    cmpLifeNote.textContent = lifeRatio < 1
      ? `${(lifeSec / seconds).toExponential(1)} 倍于此`
      : '小于人类寿命';
    cmpLifeNote.textContent = lifeRatio > 1
      ? `${(seconds / lifeSec).toExponential(1)}× 人类寿命`
      : `${(lifeSec / seconds).toExponential(1)}× 快于此`;

    cmpCivil.style.setProperty('--fill', (civilRatio * 100) + '%');
    cmpCivilNote.textContent = civilRatio > 1
      ? `${(seconds / civilSec).toExponential(1)}× 文明史`
      : `${(civilSec / seconds).toExponential(1)}× 快于此`;

    cmpUniverse.style.setProperty('--fill', (uniRatio * 100) + '%');
    cmpUniverseNote.textContent = uniRatio > 1
      ? `${(seconds / uniSec).toExponential(1)}× 宇宙年龄`
      : '小于宇宙年龄';
  }

  logNSlider.addEventListener('input', compute);
  logFSlider.addEventListener('input', compute);
  compute();
}

/* ============================================================
   ACCORDION
   ============================================================ */
function initAccordions() {
  const accordion = document.getElementById('extAccordion');
  if (!accordion) return;

  accordion.addEventListener('click', (e) => {
    const trigger = e.target.closest('.accordion-trigger');
    if (!trigger) return;
    const item = trigger.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    // close all
    accordion.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
}

/* ============================================================
   BOOTSTRAP
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initNav();
  initFiniteStateDemo();
  initPhaseSpaceDemo();
  initEntropyDemo();
  initTimeScaleCalculator();
  initAccordions();
});