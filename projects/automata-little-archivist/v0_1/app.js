import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ── State ──
let scene, camera, renderer, controls;
let currentMesh = null;
let autoRotate = true;
let isWireframe = false;
let modelList = [];
let defaultModelIndex = 0;

// ── DOM refs ──
const container = document.getElementById('canvas-container');
const select = document.getElementById('model-select');
const btnReset = document.getElementById('btn-reset');
const btnFit = document.getElementById('btn-fit');
const chkAutoRotate = document.getElementById('chk-auto-rotate');
const chkWireframe = document.getElementById('chk-wireframe');
const chkDarkBg = document.getElementById('chk-dark-bg');
const elCurrent = document.getElementById('current-model');
const elCategory = document.getElementById('current-category');
const elTriangles = document.getElementById('triangle-count');
const elDescription = document.getElementById('model-description');
const loading = document.getElementById('loading-overlay');

// ── Init ──
function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1e);

  // Camera
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 2000);
  camera.position.set(150, 100, 150);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.5;
  controls.target.set(0, 40, 0);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(100, 150, 100);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xd4c5b0, 0.3);
  fillLight.position.set(-80, 60, -80);
  scene.add(fillLight);

  const backLight = new THREE.DirectionalLight(0x8899aa, 0.2);
  backLight.position.set(0, 80, -120);
  scene.add(backLight);

  // Grid helper (subtle)
  const grid = new THREE.GridHelper(200, 40, 0x333333, 0x222222);
  grid.position.y = -0.5;
  scene.add(grid);

  // Events
  window.addEventListener('resize', onResize);
  select.addEventListener('change', onModelChange);
  btnReset.addEventListener('click', resetView);
  btnFit.addEventListener('click', fitToView);
  chkAutoRotate.addEventListener('change', e => {
    autoRotate = e.target.checked;
    controls.autoRotate = autoRotate;
  });
  chkWireframe.addEventListener('change', e => {
    isWireframe = e.target.checked;
    updateWireframe();
  });
  chkDarkBg.addEventListener('change', e => {
    const dark = e.target.checked;
    scene.background = new THREE.Color(dark ? 0x1a1a1e : 0xf0eeeb);
    document.body.classList.toggle('light-mode', !dark);
  });

  // Load model list then default
  loadModelList();

  // Start loop
  animate();
}

// ── Load model list ──
async function loadModelList() {
  try {
    const res = await fetch('models/models.json');
    modelList = await res.json();

    // Populate dropdown
    select.innerHTML = '';
    modelList.forEach((m, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = m.label;
      select.appendChild(opt);
      if (m.default) defaultModelIndex = i;
    });

    select.value = defaultModelIndex;
    await loadModel(defaultModelIndex);
    loading.classList.add('hidden');
  } catch (err) {
    console.error('Failed to load model list:', err);
    loading.textContent = 'Error loading model list.';
  }
}

// ── Load STL ──
function loadModel(index) {
  return new Promise((resolve, reject) => {
    if (currentMesh) {
      scene.remove(currentMesh);
      currentMesh.geometry?.dispose();
      currentMesh.material?.dispose();
      currentMesh = null;
    }

    const info = modelList[index];
    if (!info) return reject('Invalid model index');

    const loader = new STLLoader();
    loader.load(
      `models/${info.filename}`,
      (geometry) => {
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
          color: 0xc8c4be,
          metalness: 0.1,
          roughness: 0.6,
          flatShading: false,
          side: THREE.DoubleSide
        });

        currentMesh = new THREE.Mesh(geometry, material);
        currentMesh.castShadow = true;
        currentMesh.receiveShadow = true;

        // Center geometry
        geometry.computeBoundingBox();
        const bbox = geometry.boundingBox;
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        currentMesh.position.sub(center);

        // Move so bottom sits near y=0
        const size = new THREE.Vector3();
        bbox.getSize(size);
        currentMesh.position.y += size.y / 2;

        scene.add(currentMesh);

        // Update info
        elCurrent.textContent = info.label;
        elCategory.textContent = info.category;
        elTriangles.textContent = geometry.index
          ? (geometry.index.count / 3).toLocaleString()
          : (geometry.attributes.position.count / 3).toLocaleString();
        elDescription.textContent = info.description;

        // Camera hint
        if (info.camera_hint) {
          const ch = info.camera_hint;
          camera.position.set(ch.distance * 0.8, ch.distance * 0.6, ch.distance * 0.8);
          controls.target.set(0, ch.target_y || 0, 0);
        }

        updateWireframe();
        controls.update();
        resolve();
      },
      undefined,
      (err) => {
        console.error('STL load error:', err);
        elCurrent.textContent = 'Load failed';
        reject(err);
      }
    );
  });
}

// ── Model change ──
async function onModelChange() {
  loading.classList.remove('hidden');
  try {
    await loadModel(parseInt(select.value, 10));
  } finally {
    loading.classList.add('hidden');
  }
}

// ── Wireframe ──
function updateWireframe() {
  if (!currentMesh) return;
  currentMesh.material.wireframe = isWireframe;
}

// ── Reset view ──
function resetView() {
  if (!currentMesh) return;
  const idx = parseInt(select.value, 10);
  const info = modelList[idx];
  if (info?.camera_hint) {
    const ch = info.camera_hint;
    camera.position.set(ch.distance * 0.8, ch.distance * 0.6, ch.distance * 0.8);
    controls.target.set(0, ch.target_y || 0, 0);
  } else {
    camera.position.set(150, 100, 150);
    controls.target.set(0, 40, 0);
  }
  camera.lookAt(controls.target);
  controls.update();
}

// ── Fit to view ──
function fitToView() {
  if (!currentMesh) return;
  const bbox = new THREE.Box3().setFromObject(currentMesh);
  const size = new THREE.Vector3();
  bbox.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * 0.7;

  const center = new THREE.Vector3();
  bbox.getCenter(center);
  controls.target.copy(center);
  camera.position.set(
    center.x + cameraDistance * 0.6,
    center.y + cameraDistance * 0.5,
    center.z + cameraDistance * 0.6
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
  renderer.render(scene, camera);
}

// ── Start ──
init();
