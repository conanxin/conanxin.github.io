import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ── Diagnostics State ──
const diagnostics = {
  threejs: false,
  statesLoaded: false,
  partsLoaded: false,
  stlTotal: 0,
  stlLoaded: 0,
  webgl: false,
  lastError: null
};

// ── Loading State ──
const loadingState = {
  resources: [],
  timeoutId: null
};

// ── State ──
let scene, camera, renderer, controls, raycaster, pointer;
let partsConfig = [];
let statesConfig = null;
let parts = new Map();
let labels = new Map();
let motionLines = [];
let currentMode = 'assembly';
let explodeFactor = 0;
let autoRotate = true;
let isWireframe = false;
let showLabels = true;
let showMotionPath = false;
let mechanismOnly = false;
let selectedPartId = null;
let assemblyMesh = null;

// ── Motion State ──
let motion = {
  playing: false,
  phaseDeg: 0,
  speed: 1,
  amplitude: 0.6,
  profile: 'slow',
  followerDisp: 0,
  bodyOffset: 0
};

// ── State Machine ──
let stateMachine = {
  currentStateId: 'idle',
  stateStartTime: Date.now(),
  autoCycle: false,
  cycleIndex: 0,
  cycleTimer: null,
  targetParams: { speed: 1, amplitude: 0.4, profile: 'sleeping' },
  currentParams: { speed: 1, amplitude: 0.4, profile: 'sleeping' },
  transitionProgress: 1
};

const SPEED_LABELS = { 1: 'Very Slow', 2: 'Slow', 3: 'Normal', 4: 'Fast', 5: 'Very Fast' };
const AMP_LABELS = { 0.3: 'Minimal', 0.6: 'Subtle', 0.9: 'Normal', 1.2: 'Clear', 1.5: 'Exaggerated' };

// ── DOM refs ──
const container = document.getElementById('canvas-container');
const loading = document.getElementById('loading-overlay');
const loadingStatus = document.getElementById('loading-status');
const loadingResources = document.getElementById('loading-resources');
const loadingError = document.getElementById('loading-error');
const partsList = document.getElementById('parts-list');
const motionSection = document.getElementById('motion-section');
const explodeSection = document.getElementById('explode-section');
const infoContent = document.getElementById('info-content');
const stateBadge = document.getElementById('state-badge');
const narrativeText = document.getElementById('narrative-text');
const stateDuration = document.getElementById('state-duration');
const stateSelect = document.getElementById('state-select');
const btnAutoCycle = document.getElementById('btn-auto-cycle');
const btnNextState = document.getElementById('btn-next-state');
const btnPlay = document.getElementById('btn-play');
const btnStep = document.getElementById('btn-step');
const phaseSlider = document.getElementById('phase-slider');
const phaseValue = document.getElementById('phase-value');
const speedSlider = document.getElementById('speed-slider');
const speedLabel = document.getElementById('speed-label');
const ampSlider = document.getElementById('amp-slider');
const ampLabel = document.getElementById('amp-label');
const profileSelect = document.getElementById('profile-select');

// ── Diagnostics DOM refs ──
const diagThreejs = document.getElementById('diag-threejs');
const diagStates = document.getElementById('diag-states');
const diagParts = document.getElementById('diag-parts');
const diagStl = document.getElementById('diag-stl');
const diagMode = document.getElementById('diag-mode');
const diagState = document.getElementById('diag-state');
const diagProfile = document.getElementById('diag-profile');
const diagWebgl = document.getElementById('diag-webgl');
const diagError = document.getElementById('diag-error');

// ── Init ──
function init() {
  // Mobile detection
  if (window.innerWidth < 768) {
    document.getElementById('mobile-notice').classList.remove('hidden');
  }

  // WebGL check
  try {
    const canvas = document.createElement('canvas');
    diagnostics.webgl = !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
  } catch (e) {
    diagnostics.webgl = false;
  }

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1e);

  const w = container.clientWidth;
  const h = container.clientHeight;
  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 2000);
  camera.position.set(120, 90, 120);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  diagnostics.threejs = true;
  updateDiagnostics();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;
  controls.target.set(0, 40, 0);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(80, 120, 80);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xd4c5b0, 0.3);
  fillLight.position.set(-60, 50, -60);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x8899aa, 0.25);
  rimLight.position.set(-40, 80, -100);
  scene.add(rimLight);

  // Grid
  const grid = new THREE.GridHelper(200, 40, 0x333333, 0x222222);
  grid.position.y = -0.5;
  scene.add(grid);

  // Raycaster
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  // Events
  window.addEventListener('resize', onResize);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);

  // UI bindings
  document.getElementById('mode-assembly').addEventListener('click', () => setMode('assembly'));
  document.getElementById('mode-parts').addEventListener('click', () => setMode('parts'));
  document.getElementById('mode-exploded').addEventListener('click', () => setMode('exploded'));
  document.getElementById('mode-motion').addEventListener('click', () => setMode('motion'));

  document.querySelectorAll('.angle-btn').forEach(btn => {
    btn.addEventListener('click', () => setViewAngle(btn.dataset.angle));
  });

  btnPlay.addEventListener('click', togglePlay);
  btnStep.addEventListener('click', () => {
    motion.phaseDeg = (motion.phaseDeg + 10) % 360;
    updateMotionUI();
    if (currentMode === 'motion') applyMotion();
  });

  phaseSlider.addEventListener('input', e => {
    motion.phaseDeg = parseInt(e.target.value, 10);
    motion.playing = false;
    updatePlayButton();
    updateMotionUI();
    if (currentMode === 'motion') applyMotion();
  });

  speedSlider.addEventListener('input', e => {
    motion.speed = parseInt(e.target.value, 10);
    speedLabel.textContent = SPEED_LABELS[motion.speed] || motion.speed;
  });

  ampSlider.addEventListener('input', e => {
    motion.amplitude = parseFloat(e.target.value);
    const closest = Object.keys(AMP_LABELS).map(Number).reduce((a, b) =>
      Math.abs(b - motion.amplitude) < Math.abs(a - motion.amplitude) ? b : a
    );
    ampLabel.textContent = AMP_LABELS[closest] || motion.amplitude.toFixed(1);
    if (currentMode === 'motion') applyMotion();
  });

  profileSelect.addEventListener('change', e => {
    motion.profile = e.target.value;
    updateStateInfo();
    if (currentMode === 'motion') applyMotion();
  });

  document.getElementById('chk-motion-path').addEventListener('change', e => {
    showMotionPath = e.target.checked;
    updateMotionPath();
  });

  document.getElementById('chk-mechanism-only').addEventListener('change', e => {
    mechanismOnly = e.target.checked;
    updatePartsVisibility();
  });

  document.getElementById('chk-auto-rotate').addEventListener('change', e => {
    autoRotate = e.target.checked;
    controls.autoRotate = autoRotate;
  });
  document.getElementById('chk-wireframe').addEventListener('change', e => {
    isWireframe = e.target.checked;
    updateWireframe();
  });
  document.getElementById('chk-dark-bg').addEventListener('change', e => {
    const dark = e.target.checked;
    scene.background = new THREE.Color(dark ? 0x1a1a1e : 0xf0eeeb);
    document.body.classList.toggle('light-mode', !dark);
  });
  document.getElementById('chk-labels').addEventListener('change', e => {
    showLabels = e.target.checked;
    updateLabels();
  });

  // Performance mode
  document.getElementById('chk-performance').addEventListener('change', e => {
    const perf = e.target.checked;
    showLabels = !perf;
    autoRotate = !perf;
    controls.autoRotate = autoRotate;
    showMotionPath = false;
    document.getElementById('chk-labels').checked = !perf;
    document.getElementById('chk-auto-rotate').checked = !perf;
    document.getElementById('chk-motion-path').checked = false;
    updateLabels();
    updateMotionPath();
  });

  document.getElementById('btn-reset').addEventListener('click', resetView);
  document.getElementById('btn-fit').addEventListener('click', fitToView);

  // State machine UI
  stateSelect.addEventListener('change', e => {
    const stateId = e.target.value;
    if (stateId) switchState(stateId);
  });

  btnAutoCycle.addEventListener('click', toggleAutoCycle);
  btnNextState.addEventListener('click', advanceState);

  // Diagnostics toggle
  document.getElementById('btn-toggle-diagnostics').addEventListener('click', () => {
    const content = document.getElementById('diagnostics-content');
    const btn = document.getElementById('btn-toggle-diagnostics');
    content.classList.toggle('collapsed');
    btn.textContent = content.classList.contains('collapsed') ? '▶ Diagnostics' : '▼ Diagnostics';
  });

  // Presets
  document.getElementById('preset-best-look').addEventListener('click', applyPresetBestLook);
  document.getElementById('preset-mechanism').addEventListener('click', applyPresetMechanism);
  document.getElementById('preset-exploded').addEventListener('click', applyPresetExploded);

  // Mobile notice dismiss
  document.getElementById('btn-dismiss-mobile').addEventListener('click', () => {
    document.getElementById('mobile-notice').classList.add('hidden');
  });

  // Reload button
  document.getElementById('btn-reload').addEventListener('click', () => {
    window.location.reload();
  });

  // Start loading timeout
  loadingState.timeoutId = setTimeout(() => {
    showLoadingError();
  }, 10000);

  // Load
  loadConfigs();
  animate();
}

// ── Diagnostics ──
function updateDiagnostics() {
  diagThreejs.textContent = diagnostics.threejs ? 'yes' : 'no';
  diagStates.textContent = diagnostics.statesLoaded ? 'yes' : 'no';
  diagParts.textContent = diagnostics.partsLoaded ? 'yes' : 'no';
  diagStl.textContent = `${diagnostics.stlLoaded}/${diagnostics.stlTotal}`;
  diagMode.textContent = currentMode;
  diagState.textContent = stateMachine.currentStateId;
  diagProfile.textContent = motion.profile;
  diagWebgl.textContent = diagnostics.webgl ? 'yes' : 'no';
  diagError.textContent = diagnostics.lastError || '—';
}

// ── Loading helpers ──
function setLoadingStatus(text) {
  loadingStatus.textContent = text;
  loadingState.resources.push(text);
  updateLoadingResources();
}

function updateLoadingResources() {
  const recent = loadingState.resources.slice(-5);
  loadingResources.innerHTML = recent.map(r => `• ${r}`).join('<br>');
}

function showLoadingError() {
  loadingError.classList.remove('hidden');
  loadingStatus.textContent = 'Loading is taking longer than expected…';
  diagnostics.lastError = 'Loading timeout (>10s)';
  updateDiagnostics();
}

function hideLoading() {
  loading.classList.add('hidden');
  if (loadingState.timeoutId) {
    clearTimeout(loadingState.timeoutId);
    loadingState.timeoutId = null;
  }
}

// ── Presets ──
function applyPresetBestLook() {
  setMode('motion');
  switchState('reading');
  motion.speed = 1;
  motion.amplitude = 0.6;
  motion.profile = 'slow';
  speedSlider.value = 1;
  speedLabel.textContent = 'Very Slow';
  ampSlider.value = 0.6;
  ampLabel.textContent = 'Subtle';
  profileSelect.value = 'slow';
  showLabels = false;
  isWireframe = false;
  autoRotate = true;
  controls.autoRotate = true;
  document.getElementById('chk-labels').checked = false;
  document.getElementById('chk-wireframe').checked = false;
  document.getElementById('chk-auto-rotate').checked = true;
  setViewAngle('threequarter');
  updateLabels();
  updateWireframe();
  updateDiagnostics();
}

function applyPresetMechanism() {
  setMode('motion');
  mechanismOnly = true;
  showMotionPath = true;
  showLabels = true;
  document.getElementById('chk-mechanism-only').checked = true;
  document.getElementById('chk-motion-path').checked = true;
  document.getElementById('chk-labels').checked = true;
  setViewAngle('mechanism');
  updatePartsVisibility();
  updateMotionPath();
  updateLabels();
  updateDiagnostics();
}

function applyPresetExploded() {
  setMode('exploded');
  showLabels = true;
  document.getElementById('chk-labels').checked = true;
  document.getElementById('explode-slider').value = 70;
  document.getElementById('explode-value').textContent = '70%';
  explodeFactor = 0.7;
  setViewAngle('threequarter');
  updatePartsVisibility();
  updateLabels();
  updateDiagnostics();
}

// ── Load configs ──
async function loadConfigs() {
  try {
    setLoadingStatus('Fetching states_config.json…');
    const [partsRes, statesRes] = await Promise.all([
      fetch('models/parts_config.json'),
      fetch('states_config.json')
    ]);

    setLoadingStatus('Parsing configurations…');
    partsConfig = await partsRes.json();
    statesConfig = await statesRes.json();

    diagnostics.partsLoaded = true;
    diagnostics.statesLoaded = true;
    diagnostics.stlTotal = partsConfig.length;
    updateDiagnostics();

    buildPartsList();
    buildStateSelector();

    setLoadingStatus('Loading STL models…');
    await loadAllParts();

    // Initialize with default state
    const defaultState = statesConfig.states[0];
    switchState(defaultState.id);

    setLoadingStatus('Ready.');
    hideLoading();
  } catch (err) {
    console.error('Config load error:', err);
    setLoadingStatus('Error loading configuration.');
    diagnostics.lastError = err.message || String(err);
    updateDiagnostics();
    showLoadingError();
  }
}

// ── Build state selector ──
function buildStateSelector() {
  stateSelect.innerHTML = '';
  statesConfig.states.forEach(state => {
    const opt = document.createElement('option');
    opt.value = state.id;
    opt.textContent = state.label;
    stateSelect.appendChild(opt);
  });
}

// ── State Machine ──
function switchState(stateId) {
  const state = statesConfig.states.find(s => s.id === stateId);
  if (!state) return;

  stateMachine.currentStateId = stateId;
  stateMachine.stateStartTime = Date.now();
  stateMachine.cycleIndex = statesConfig.auto_cycle_sequence.indexOf(stateId);
  stateMachine.transitionProgress = 0;

  // Set target params
  stateMachine.targetParams = {
    speed: state.speed,
    amplitude: state.amplitude,
    profile: state.default_motion_profile
  };

  // Update UI
  stateSelect.value = stateId;
  stateBadge.textContent = state.label;
  stateBadge.className = `state-badge state-${stateId}`;
  narrativeText.textContent = state.narrative_note;

  updateStateInfo();
  updateDiagnostics();
}

function updateStateInfo() {
  const state = statesConfig.states.find(s => s.id === stateMachine.currentStateId);
  if (!state) return;

  const profileNames = {
    mechanical: 'A — Mechanical Sine',
    slow: 'B — Slow Breathing',
    tired: 'C — Tired / Resting',
    sleeping: 'D — Sleeping',
    alert: 'E — Alert Lift'
  };

  document.getElementById('si-state').textContent = state.label;
  document.getElementById('si-profile').textContent = profileNames[state.default_motion_profile] || state.default_motion_profile;
  document.getElementById('si-speed').textContent = SPEED_LABELS[state.speed] || state.speed;
  const closestAmp = Object.keys(AMP_LABELS).map(Number).reduce((a, b) =>
    Math.abs(b - state.amplitude) < Math.abs(a - state.amplitude) ? b : a
  );
  document.getElementById('si-amp').textContent = AMP_LABELS[closestAmp] || state.amplitude;
  document.getElementById('si-energy').textContent = `${Math.round(state.body_energy * 100)}%`;

  // Also update motion controls to reflect state
  profileSelect.value = state.default_motion_profile;
  speedSlider.value = state.speed;
  speedLabel.textContent = SPEED_LABELS[state.speed] || state.speed;
  ampSlider.value = state.amplitude;
  const closestAmp2 = Object.keys(AMP_LABELS).map(Number).reduce((a, b) =>
    Math.abs(b - state.amplitude) < Math.abs(a - state.amplitude) ? b : a
  );
  ampLabel.textContent = AMP_LABELS[closestAmp2] || state.amplitude;
}

function advanceState() {
  const seq = statesConfig.auto_cycle_sequence;
  stateMachine.cycleIndex = (stateMachine.cycleIndex + 1) % seq.length;
  const nextStateId = seq[stateMachine.cycleIndex];
  switchState(nextStateId);
}

function toggleAutoCycle() {
  stateMachine.autoCycle = !stateMachine.autoCycle;
  btnAutoCycle.textContent = stateMachine.autoCycle ? 'Auto Cycle: ON' : 'Auto Cycle: OFF';
  btnAutoCycle.classList.toggle('active', stateMachine.autoCycle);

  if (stateMachine.autoCycle) {
    scheduleNextState();
  } else {
    clearTimeout(stateMachine.cycleTimer);
  }
}

function scheduleNextState() {
  if (!stateMachine.autoCycle) return;

  const state = statesConfig.states.find(s => s.id === stateMachine.currentStateId);
  const duration = state ? state.typical_duration_seconds * 1000 : 15000;

  stateMachine.cycleTimer = setTimeout(() => {
    if (stateMachine.autoCycle) {
      advanceState();
      scheduleNextState();
    }
  }, duration);
}

// ── Update state duration display ──
function updateStateDuration() {
  const elapsed = Math.floor((Date.now() - stateMachine.stateStartTime) / 1000);
  stateDuration.textContent = `In this state: ${elapsed}s`;
}

// ── Smooth parameter transition ──
function updateStateTransition(delta) {
  if (stateMachine.transitionProgress >= 1) {
    // Fully transitioned, keep current params in sync
    stateMachine.currentParams = { ...stateMachine.targetParams };
    motion.speed = stateMachine.currentParams.speed;
    motion.amplitude = stateMachine.currentParams.amplitude;
    motion.profile = stateMachine.currentParams.profile;
    return;
  }

  stateMachine.transitionProgress = Math.min(1, stateMachine.transitionProgress + delta * 0.5);
  const t = easeInOutCubic(stateMachine.transitionProgress);

  motion.speed = lerp(stateMachine.currentParams.speed, stateMachine.targetParams.speed, t);
  motion.amplitude = lerp(stateMachine.currentParams.amplitude, stateMachine.targetParams.amplitude, t);
  // Profile doesn't interpolate, switch immediately
  motion.profile = stateMachine.targetParams.profile;

  // Update UI sliders
  speedSlider.value = Math.round(motion.speed);
  speedLabel.textContent = SPEED_LABELS[Math.round(motion.speed)] || Math.round(motion.speed);
  ampSlider.value = motion.amplitude;
  const closest = Object.keys(AMP_LABELS).map(Number).reduce((a, b) =>
    Math.abs(b - motion.amplitude) < Math.abs(a - motion.amplitude) ? b : a
  );
  ampLabel.textContent = AMP_LABELS[closest] || motion.amplitude.toFixed(1);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ── Build parts list UI ──
function buildPartsList() {
  partsList.innerHTML = '';
  partsConfig.forEach(cfg => {
    const div = document.createElement('div');
    div.className = 'part-item';
    div.dataset.id = cfg.id;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = cfg.visible_by_default;
    cb.dataset.id = cfg.id;
    cb.addEventListener('change', e => {
      const mesh = parts.get(cfg.id);
      if (mesh) mesh.visible = e.target.checked;
      updateLabels();
      updateMotionPath();
    });

    const color = document.createElement('span');
    color.className = 'part-color';
    color.style.backgroundColor = cfg.color_hint;

    const name = document.createElement('span');
    name.className = 'part-name';
    name.textContent = cfg.label;

    const cat = document.createElement('span');
    cat.className = 'part-cat';
    cat.textContent = cfg.category;

    div.appendChild(cb);
    div.appendChild(color);
    div.appendChild(name);
    div.appendChild(cat);

    div.addEventListener('click', e => {
      if (e.target.tagName === 'INPUT') return;
      selectPart(cfg.id);
    });

    partsList.appendChild(div);
  });
}

// ── Load all parts ──
async function loadAllParts() {
  const loader = new STLLoader();
  const promises = partsConfig.map(cfg => loadPart(loader, cfg));
  await Promise.all(promises);
}

function loadPart(loader, cfg) {
  return new Promise((resolve, reject) => {
    loader.load(
      `models/${cfg.filename}`,
      (geometry) => {
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(cfg.color_hint),
          metalness: 0.15,
          roughness: 0.55,
          flatShading: false,
          side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.partId = cfg.id;

        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        mesh.geometry.translate(-center.x, -center.y, -center.z);

        mesh.visible = false;
        scene.add(mesh);
        parts.set(cfg.id, mesh);

        const label = document.createElement('div');
        label.className = 'label-tag';
        label.textContent = cfg.label;
        container.appendChild(label);
        labels.set(cfg.id, label);

        const pathDiv = document.createElement('div');
        pathDiv.className = 'motion-path-line';
        container.appendChild(pathDiv);
        motionLines.push({ id: cfg.id, element: pathDiv });

        diagnostics.stlLoaded++;
        updateDiagnostics();
        setLoadingStatus(`Loaded ${cfg.filename}`);
        resolve();
      },
      undefined,
      (err) => {
        diagnostics.lastError = `STL load failed: ${cfg.filename}`;
        updateDiagnostics();
        reject(err);
      }
    );
  });
}

// ── Mode switching ──
function setMode(mode) {
  currentMode = mode;

  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`mode-${mode}`).classList.add('active');

  if (mode === 'exploded') {
    explodeSection.classList.remove('disabled');
  } else {
    explodeSection.classList.add('disabled');
    explodeSlider.value = 0;
    document.getElementById('explode-value').textContent = '0%';
    explodeFactor = 0;
  }

  if (mode === 'motion') {
    motionSection.classList.remove('disabled');
    if (!motion.playing) {
      motion.playing = true;
      updatePlayButton();
    }
  } else {
    motionSection.classList.add('disabled');
    motion.playing = false;
    updatePlayButton();
  }

  if (mode === 'assembly') {
    parts.forEach(m => m.visible = false);
    updateLabels();
    loadAssemblyPreview();
  } else {
    if (assemblyMesh) assemblyMesh.visible = false;
    updatePartsVisibility();
  }

  updateDiagnostics();
}

function updatePartsVisibility() {
  partsConfig.forEach(cfg => {
    const mesh = parts.get(cfg.id);
    const cb = partsList.querySelector(`input[data-id="${cfg.id}"]`);
    if (!mesh || !cb) return;

    let visible = cb.checked;
    if (mechanismOnly && currentMode === 'motion') {
      visible = visible && (cfg.category === 'mechanism');
    }

    mesh.visible = visible;

    if (currentMode === 'exploded') {
      const pos = lerpVec(cfg.default_position, cfg.exploded_offset, explodeFactor);
      mesh.position.set(pos[0], pos[1], pos[2]);
    } else {
      mesh.position.set(cfg.default_position[0], cfg.default_position[1], cfg.default_position[2]);
    }
    mesh.rotation.set(0, 0, 0);
  });

  updateLabels();
  updateMotionPath();
}

// ── Assembly preview ──
function loadAssemblyPreview() {
  if (assemblyMesh) {
    assemblyMesh.visible = true;
    return;
  }
  const loader = new STLLoader();
  loader.load('models/assembly_preview.stl', (geometry) => {
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0xc8c4be,
      metalness: 0.1,
      roughness: 0.6,
      side: THREE.DoubleSide
    });
    assemblyMesh = new THREE.Mesh(geometry, material);
    assemblyMesh.castShadow = true;
    assemblyMesh.receiveShadow = true;

    geometry.computeBoundingBox();
    const center = new THREE.Vector3();
    geometry.boundingBox.getCenter(center);
    assemblyMesh.position.sub(center);
    const size = new THREE.Vector3();
    geometry.boundingBox.getSize(size);
    assemblyMesh.position.y += size.y / 2;

    scene.add(assemblyMesh);
  });
}

// ── Motion Simulation ──
function getProfileDisplacement(phase) {
  const t = phase / (2 * Math.PI);

  switch (motion.profile) {
    case 'mechanical':
      return (1 - Math.cos(phase)) / 2;
    case 'slow':
      const s = (1 - Math.cos(phase)) / 2;
      return s * s * (3 - 2 * s);
    case 'tired': {
      if (t < 0.35) return Math.sin(t / 0.35 * Math.PI / 2) * 0.6;
      if (t < 0.55) return 0.6 + (t - 0.35) / 0.2 * 0.4;
      if (t < 0.8) return 1.0 - Math.sin((t - 0.55) / 0.25 * Math.PI / 2) * 0.7;
      return 0.3 - (t - 0.8) / 0.2 * 0.3;
    }
    case 'sleeping': {
      if (t < 0.6) return 0.1 + Math.sin(t / 0.6 * Math.PI) * 0.15;
      return 0.1;
    }
    case 'alert': {
      if (t < 0.15) return t / 0.15;
      if (t < 0.3) return 1.0;
      return Math.pow(1 - (t - 0.3) / 0.7, 2);
    }
    default:
      return (1 - Math.cos(phase)) / 2;
  }
}

function applyMotion() {
  const phaseRad = (motion.phaseDeg * Math.PI) / 180;
  const dispNorm = getProfileDisplacement(phaseRad);
  const maxLift = 5.0;
  motion.followerDisp = dispNorm * maxLift * motion.amplitude;
  motion.bodyOffset = motion.followerDisp * 0.25;

  partsConfig.forEach(cfg => {
    const mesh = parts.get(cfg.id);
    if (!mesh || !mesh.visible) return;

    const basePos = cfg.default_position;

    if (cfg.rotates_with_cam) {
      mesh.position.set(basePos[0], basePos[1], basePos[2]);
      if (cfg.id === 'breathing_cam') {
        mesh.rotation.z = phaseRad;
      } else if (cfg.id === 'crank') {
        mesh.rotation.x = phaseRad;
        mesh.position.x = -45 + Math.cos(phaseRad) * 5;
        mesh.position.z = 20 + Math.sin(phaseRad) * 5;
      }
    }

    if (cfg.moves_with_follower) {
      mesh.position.set(
        basePos[0],
        basePos[1] + motion.followerDisp * cfg.vertical_motion_scale,
        basePos[2]
      );
    }

    if (cfg.moves_with_body) {
      mesh.position.set(
        basePos[0],
        basePos[1] + motion.bodyOffset * cfg.vertical_motion_scale,
        basePos[2]
      );
    }
  });

  updateLabels();
  updateMotionPath();
}

function updateMotionUI() {
  phaseSlider.value = motion.phaseDeg;
  phaseValue.textContent = `${Math.round(motion.phaseDeg)}°`;
}

function updatePlayButton() {
  if (motion.playing) {
    btnPlay.textContent = '⏸ Pause';
    btnPlay.classList.remove('paused');
  } else {
    btnPlay.textContent = '▶ Play';
    btnPlay.classList.add('paused');
  }
}

function togglePlay() {
  motion.playing = !motion.playing;
  updatePlayButton();
}

// ── Explode ──
function updateExplodedPositions() {
  partsConfig.forEach(cfg => {
    const mesh = parts.get(cfg.id);
    if (!mesh || !mesh.visible) return;
    const pos = lerpVec(cfg.default_position, cfg.exploded_offset, explodeFactor);
    mesh.position.set(pos[0], pos[1], pos[2]);
  });
  updateLabels();
}

function lerpVec(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t
  ];
}

// ── Labels ──
function updateLabels() {
  if (!showLabels || currentMode === 'assembly') {
    labels.forEach(l => l.classList.remove('visible'));
    return;
  }

  partsConfig.forEach(cfg => {
    const mesh = parts.get(cfg.id);
    const label = labels.get(cfg.id);
    if (!mesh || !label) return;

    if (!mesh.visible) {
      label.classList.remove('visible');
      return;
    }

    const box = new THREE.Box3().setFromObject(mesh);
    const top = new THREE.Vector3(
      (box.min.x + box.max.x) / 2,
      box.max.y + 2,
      (box.min.z + box.max.z) / 2
    );
    top.project(camera);

    const x = (top.x * 0.5 + 0.5) * container.clientWidth;
    const y = (-top.y * 0.5 + 0.5) * container.clientHeight;

    label.style.left = `${x}px`;
    label.style.top = `${y}px`;
    label.classList.add('visible');
  });
}

// ── Motion Path ──
function updateMotionPath() {
  if (!showMotionPath || currentMode !== 'motion') {
    motionLines.forEach(ml => ml.element.classList.remove('visible'));
    return;
  }

  motionLines.forEach(ml => {
    const cfg = partsConfig.find(c => c.id === ml.id);
    const mesh = parts.get(ml.id);
    if (!mesh || !label || !cfg.vertical_motion_scale) {
      ml.element.classList.remove('visible');
      return;
    }

    const box = new THREE.Box3().setFromObject(mesh);
    const center = new THREE.Vector3(
      (box.min.x + box.max.x) / 2,
      (box.min.y + box.max.y) / 2,
      (box.min.z + box.max.z) / 2
    );
    center.project(camera);

    const x = (center.x * 0.5 + 0.5) * container.clientWidth;
    const y = (-center.y * 0.5 + 0.5) * container.clientHeight;
    const amplitudePx = 30 * motion.amplitude * cfg.vertical_motion_scale;

    ml.element.style.left = `${x}px`;
    ml.element.style.top = `${y - amplitudePx}px`;
    ml.element.style.height = `${amplitudePx * 2}px`;
    ml.element.classList.add('visible');
  });
}

// ── Selection ──
function selectPart(id) {
  selectedPartId = id;

  document.querySelectorAll('.part-item').forEach(el => el.classList.remove('selected'));
  const item = partsList.querySelector(`[data-id="${id}"]`);
  if (item) item.classList.add('selected');

  const cfg = partsConfig.find(c => c.id === id);
  if (!cfg) return;

  infoContent.innerHTML = `
    <div class="info-row"><span class="label">Name</span><span class="value">${cfg.label}</span></div>
    <div class="info-row"><span class="label">Role</span><span class="value">${cfg.role}</span></div>
    <div class="info-row"><span class="label">Material</span><span class="value">${cfg.material_hint}</span></div>
    <div class="info-row"><span class="label">Print Risk</span><span class="value">${cfg.print_risk}</span></div>
    <div class="info-row"><span class="label">Artifact</span><span class="value">${cfg.artifact_role}</span></div>
    ${cfg.motion_note ? `<div class="info-row"><span class="label">Motion</span><span class="value">${cfg.motion_note}</span></div>` : ''}
  `;

  const mesh = parts.get(id);
  if (mesh) {
    const orig = mesh.material.emissive.getHex();
    mesh.material.emissive.setHex(0x443322);
    setTimeout(() => mesh.material.emissive.setHex(orig), 400);
  }
}

function onPointerDown(event) {
  if (currentMode === 'assembly') return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const visibleParts = [];
  parts.forEach(m => { if (m.visible) visibleParts.push(m); });

  const intersects = raycaster.intersectObjects(visibleParts);
  if (intersects.length > 0) {
    const id = intersects[0].object.userData.partId;
    if (id) selectPart(id);
  }
}

// ── View angles ──
function setViewAngle(angle) {
  document.querySelectorAll('.angle-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-angle="${angle}"]`).classList.add('active');

  const dist = 180;
  let target = new THREE.Vector3(0, 40, 0);

  switch (angle) {
    case 'front': camera.position.set(0, 40, dist); break;
    case 'side': camera.position.set(dist, 40, 0); break;
    case 'top': camera.position.set(0, dist, 0); target.y = 0; break;
    case 'threequarter': camera.position.set(dist * 0.7, dist * 0.5, dist * 0.7); break;
    case 'mechanism': camera.position.set(60, 25, 60); target.set(0, 15, 0); break;
  }

  controls.target.copy(target);
  camera.lookAt(target);
  controls.update();
}

// ── Wireframe ──
function updateWireframe() {
  parts.forEach(m => { m.material.wireframe = isWireframe; });
  if (assemblyMesh) assemblyMesh.material.wireframe = isWireframe;
}

// ── Reset / Fit ──
function resetView() {
  camera.position.set(120, 90, 120);
  controls.target.set(0, 40, 0);
  camera.lookAt(controls.target);
  controls.update();
}

function fitToView() {
  let targetObjects = [];
  if (currentMode === 'assembly' && assemblyMesh) {
    targetObjects.push(assemblyMesh);
  } else {
    parts.forEach(m => { if (m.visible) targetObjects.push(m); });
  }
  if (targetObjects.length === 0) return;

  const box = new THREE.Box3();
  targetObjects.forEach(o => box.expandByObject(o));
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const cameraDist = Math.abs(maxDim / Math.sin(fov / 2)) * 0.75;

  const center = new THREE.Vector3();
  box.getCenter(center);
  controls.target.copy(center);
  camera.position.set(
    center.x + cameraDist * 0.6,
    center.y + cameraDist * 0.5,
    center.z + cameraDist * 0.6
  );
  camera.lookAt(controls.target);
  controls.update();
}

// ── Resize ──
function onResize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

// ── Main animate loop ──
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // State machine updates
  updateStateTransition(delta);
  updateStateDuration();

  // Motion updates
  if (motion.playing && currentMode === 'motion') {
    const cycleDuration = 12 / motion.speed;
    const deltaDeg = (delta / cycleDuration) * 360;
    motion.phaseDeg = (motion.phaseDeg + deltaDeg) % 360;
    updateMotionUI();
    applyMotion();
  }

  controls.update();

  if (currentMode !== 'assembly') {
    updateLabels();
    if (showMotionPath && currentMode === 'motion') updateMotionPath();
  }

  renderer.render(scene, camera);
}

// ── Start ──
init();
