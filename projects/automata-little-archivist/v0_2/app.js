import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ── State ──
let scene, camera, renderer, controls, raycaster, pointer;
let partsConfig = [];
let parts = new Map();        // id -> Mesh
let labels = new Map();       // id -> DOM element
let currentMode = 'assembly'; // 'assembly' | 'parts' | 'exploded'
let explodeFactor = 0;
let autoRotate = true;
let isWireframe = false;
let showLabels = true;
let selectedPartId = null;
let assemblyMesh = null;

// ── DOM refs ──
const container = document.getElementById('canvas-container');
const loading = document.getElementById('loading-overlay');
const partsList = document.getElementById('parts-list');
const explodeSection = document.getElementById('explode-section');
const explodeSlider = document.getElementById('explode-slider');
const explodeValue = document.getElementById('explode-value');
const infoContent = document.getElementById('info-content');

// ── Init ──
function init() {
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

  document.querySelectorAll('.angle-btn').forEach(btn => {
    btn.addEventListener('click', () => setViewAngle(btn.dataset.angle));
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

  document.getElementById('btn-reset').addEventListener('click', resetView);
  document.getElementById('btn-fit').addEventListener('click', fitToView);

  explodeSlider.addEventListener('input', e => {
    explodeFactor = parseInt(e.target.value, 10) / 100;
    explodeValue.textContent = `${e.target.value}%`;
    if (currentMode === 'exploded') updateExplodedPositions();
  });

  // Load
  loadConfigs();
  animate();
}

// ── Load configs ──
async function loadConfigs() {
  try {
    const res = await fetch('models/parts_config.json');
    partsConfig = await res.json();
    buildPartsList();
    await loadAllParts();
    setMode('assembly');
    loading.classList.add('hidden');
  } catch (err) {
    console.error('Config load error:', err);
    loading.textContent = 'Error loading configuration.';
  }
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

// ── Load all individual parts ──
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

        // Center geometry locally
        geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        mesh.geometry.translate(-center.x, -center.y, -center.z);

        mesh.visible = false; // hidden until mode activates
        scene.add(mesh);
        parts.set(cfg.id, mesh);

        // Create label DOM
        const label = document.createElement('div');
        label.className = 'label-tag';
        label.textContent = cfg.label;
        container.appendChild(label);
        labels.set(cfg.id, label);

        resolve();
      },
      undefined,
      reject
    );
  });
}

// ── Mode switching ──
function setMode(mode) {
  currentMode = mode;

  // Update buttons
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`mode-${mode}`).classList.add('active');

  // Explode slider availability
  if (mode === 'exploded') {
    explodeSection.classList.remove('disabled');
  } else {
    explodeSection.classList.add('disabled');
    explodeSlider.value = 0;
    explodeValue.textContent = '0%';
    explodeFactor = 0;
  }

  if (mode === 'assembly') {
    // Hide all individual parts, show assembly
    parts.forEach(m => m.visible = false);
    updateLabels();
    loadAssemblyPreview();
  } else {
    // Hide assembly, show parts based on checkboxes
    if (assemblyMesh) assemblyMesh.visible = false;
    partsConfig.forEach(cfg => {
      const mesh = parts.get(cfg.id);
      const cb = partsList.querySelector(`input[data-id="${cfg.id}"]`);
      if (mesh && cb) {
        mesh.visible = cb.checked;
        // Set position based on mode
        const pos = mode === 'exploded'
          ? lerpVec(cfg.default_position, cfg.exploded_offset, explodeFactor)
          : cfg.default_position;
        mesh.position.set(pos[0], pos[1], pos[2]);
        mesh.rotation.set(0, 0, 0);
      }
    });
    updateLabels();
  }
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

// ── Update exploded positions ──
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

// ── Label positioning ──
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

    // Compute world position at top of mesh
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

// ── Part selection ──
function selectPart(id) {
  selectedPartId = id;

  // UI highlight
  document.querySelectorAll('.part-item').forEach(el => el.classList.remove('selected'));
  const item = partsList.querySelector(`[data-id="${id}"]`);
  if (item) item.classList.add('selected');

  // Show info
  const cfg = partsConfig.find(c => c.id === id);
  if (!cfg) return;

  infoContent.innerHTML = `
    <div class="info-row">
      <span class="label">Name</span>
      <span class="value">${cfg.label}</span>
    </div>
    <div class="info-row">
      <span class="label">Role</span>
      <span class="value">${cfg.role}</span>
    </div>
    <div class="info-row">
      <span class="label">Material</span>
      <span class="value">${cfg.material_hint}</span>
    </div>
    <div class="info-row">
      <span class="label">Print Risk</span>
      <span class="value">${cfg.print_risk}</span>
    </div>
    <div class="info-row">
      <span class="label">Artifact Role</span>
      <span class="value">${cfg.artifact_role}</span>
    </div>
  `;

  // Flash mesh
  const mesh = parts.get(id);
  if (mesh) {
    const orig = mesh.material.emissive.getHex();
    mesh.material.emissive.setHex(0x443322);
    setTimeout(() => mesh.material.emissive.setHex(orig), 400);
  }
}

// ── Click to select ──
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
    case 'front':
      camera.position.set(0, 40, dist);
      break;
    case 'side':
      camera.position.set(dist, 40, 0);
      break;
    case 'top':
      camera.position.set(0, dist, 0);
      target.y = 0;
      break;
    case 'threequarter':
      camera.position.set(dist * 0.7, dist * 0.5, dist * 0.7);
      break;
    case 'mechanism':
      camera.position.set(60, 25, 60);
      target.set(0, 15, 0);
      break;
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

// ── Animate ──
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (currentMode !== 'assembly') updateLabels();
  renderer.render(scene, camera);
}

// ── Start ──
init();
