/**
 * immersive.js — CP-4A Immersive Mode (Fixed)
 * Vanilla Three.js. Camera click-switching for 6 scenes.
 * Uses direct ES module import (not window.THREE).
 */

import * as THREE from 'three';

(function () {
  'use strict';

  var ImmersiveApp = function () {
    this.scenes = window.CP_IMMERSIVE_SCENES || [];
    this.currentIndex = 0;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.objects = [];
    this.audio = null;
    this.soundEnabled = false; // true only if user entered with sound
    this.muted = false;
    this.frameId = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.clockTime = 0;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Camera base positions (set by _gotoScene, used in animation loop)
    this.baseCameraPos = null;
    this.baseCameraTarget = new THREE.Vector3(0, 0, 0);
  };

  // ── Init ─────────────────────────────────────────────────────────
  ImmersiveApp.prototype.init = function () {
    var self = this;

    // Detect WebGL
    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      this._showFallback();
      return false;
    }

    // Check THREE is available
    if (typeof THREE === 'undefined') {
      this._showFallback();
      return false;
    }

    try {
      // Setup renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      document.getElementById('immersive-canvas').appendChild(this.renderer.domElement);

      // Scene + camera
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x060810);
      this.scene.fog = new THREE.Fog(0x060810, 20, 60);

      this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);

      // Build scene objects
      this._buildScene();

      // HUD events
      this._bindHUD();

      // Mouse parallax
      window.addEventListener('mousemove', function (e) {
        self.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        self.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      // Resize
      window.addEventListener('resize', function () {
        self.camera.aspect = window.innerWidth / window.innerHeight;
        self.camera.updateProjectionMatrix();
        self.renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Page visibility
      document.addEventListener('visibilitychange', function () {
        if (self.audio) {
          if (document.hidden) self.audio.suspend();
          else self.audio.resume();
        }
      });

      // Start loop
      this.clockTime = performance.now();
      this._animate();

    } catch (err) {
      console.error('[Immersive] init error:', err);
      this._showFallback();
      return false;
    }

    return true;
  };

  // ── Build 3D Scene Objects ────────────────────────────────────────
  ImmersiveApp.prototype._buildScene = function () {
    var self = this;

    // Ambient light
    var ambient = new THREE.AmbientLight(0x1a2040, 0.8);
    this.scene.add(ambient);

    // Point lights for each scene accent color
    this.accentLights = [];
    this.scenes.forEach(function (s) {
      var light = new THREE.PointLight(s.accentColor, 0.6, 15);
      light.position.set(
        s.cameraPosition.x * 0.3,
        s.cameraPosition.y * 0.5,
        s.cameraPosition.z * 0.3
      );
      self.scene.add(light);
      self.accentLights.push(light);
    });

    // Ground plane (dark desk surface)
    var groundGeo = new THREE.PlaneGeometry(40, 40);
    var groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d18,
      roughness: 0.9,
      metalness: 0.1,
    });
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grid overlay
    var gridHelper = new THREE.GridHelper(30, 30, 0x1a2040, 0x0d1428);
    gridHelper.position.y = -0.49;
    this.scene.add(gridHelper);

    // Particles
    this._buildParticles();

    // Command desk
    this._buildCommandDesk();

    // Scene nodes (6 spheres)
    this.sceneNodes = [];
    this.sceneRings = [];
    this.scenes.forEach(function (s, i) {
      var geo = new THREE.SphereGeometry(0.3, 16, 16);
      var mat = new THREE.MeshStandardMaterial({
        color: s.accentColor,
        emissive: s.accentColor,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.5,
      });
      var mesh = new THREE.Mesh(geo, mat);
      var angle = (i / 6) * Math.PI * 2;
      var r = 5;
      mesh.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      mesh.castShadow = true;
      self.scene.add(mesh);
      self.sceneNodes.push(mesh);

      // Ring around node
      var ringGeo = new THREE.TorusGeometry(0.5, 0.03, 8, 32);
      var ringMat = new THREE.MeshStandardMaterial({
        color: s.accentColor,
        emissive: s.accentColor,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.5,
      });
      var ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.copy(mesh.position);
      self.scene.add(ring);
      self.sceneRings.push(ring);
    });

    // Floating artifact cards
    this._buildArtifactCards();

    // Agent workflow line
    this._buildAgentLine();

    // Initial camera position (set base positions)
    var firstScene = this.scenes[0];
    this.baseCameraPos = new THREE.Vector3(
      firstScene.cameraPosition.x,
      firstScene.cameraPosition.y,
      firstScene.cameraPosition.z
    );
    this.baseCameraTarget.set(
      firstScene.cameraTarget.x,
      firstScene.cameraTarget.y,
      firstScene.cameraTarget.z
    );
    this.camera.position.copy(this.baseCameraPos);
    this.camera.lookAt(this.baseCameraTarget);
  };

  ImmersiveApp.prototype._buildParticles = function () {
    var count = 300;
    var positions = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      var c = new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.5, 0.5);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    var mat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    this.particleSystem = new THREE.Points(geo, mat);
    this.scene.add(this.particleSystem);
  };

  ImmersiveApp.prototype._buildCommandDesk = function () {
    var geo = new THREE.BoxGeometry(4, 0.3, 2.5);
    var mat = new THREE.MeshStandardMaterial({
      color: 0x0d1122,
      emissive: 0x0a1535,
      emissiveIntensity: 0.2,
      roughness: 0.7,
      metalness: 0.3,
    });
    var desk = new THREE.Mesh(geo, mat);
    desk.position.y = -0.15;
    desk.castShadow = true;
    desk.receiveShadow = true;
    this.scene.add(desk);

    var edgeColor = 0x1a3060;
    var edgeMat = new THREE.MeshStandardMaterial({
      color: edgeColor,
      emissive: edgeColor,
      emissiveIntensity: 1.0,
    });
    var edgeGeo = new THREE.BoxGeometry(4.05, 0.05, 0.05);
    var topEdge = new THREE.Mesh(edgeGeo, edgeMat);
    topEdge.position.set(0, 0.03, 1.27);
    this.scene.add(topEdge);
    var bottomEdge = new THREE.Mesh(edgeGeo, edgeMat);
    bottomEdge.position.set(0, 0.03, -1.27);
    this.scene.add(bottomEdge);

    var screenColors = [0x7eb8f7, 0xa08cf7, 0x7af7b8];
    for (var i = 0; i < 3; i++) {
      var sGeo = new THREE.PlaneGeometry(0.8, 0.5);
      var sMat = new THREE.MeshStandardMaterial({
        color: screenColors[i],
        emissive: screenColors[i],
        emissiveIntensity: 0.8,
        side: THREE.DoubleSide,
      });
      var screen = new THREE.Mesh(sGeo, sMat);
      screen.position.set(-1.2 + i * 1.2, 0.26, 0);
      screen.rotation.x = -0.3;
      this.scene.add(screen);
    }
  };

  ImmersiveApp.prototype._buildArtifactCards = function () {
    var colors = [0x7eb8f7, 0xa08cf7, 0x7af7b8, 0xf7c87a, 0xf78c7a, 0x7ac8f7];
    for (var i = 0; i < 18; i++) {
      var geo = new THREE.PlaneGeometry(0.4, 0.25);
      var mat = new THREE.MeshStandardMaterial({
        color: colors[i % 6],
        emissive: colors[i % 6],
        emissiveIntensity: 0.4,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      var card = new THREE.Mesh(geo, mat);
      var angle = Math.random() * Math.PI * 2;
      var r = 3 + Math.random() * 5;
      card.position.set(
        Math.cos(angle) * r,
        0.1 + Math.random() * 1.5,
        Math.sin(angle) * r
      );
      card.rotation.x = -0.2;
      card.rotation.y = Math.random() * 0.5;
      this.scene.add(card);
    }
  };

  ImmersiveApp.prototype._buildAgentLine = function () {
    var points = [
      new THREE.Vector3(-6, 0.5, 0),
      new THREE.Vector3(-2, 0.5, 0),
      new THREE.Vector3(2, 0.5, 0),
      new THREE.Vector3(6, 0.5, 0),
    ];
    var curve = new THREE.CatmullRomCurve3(points);
    var geo = new THREE.TubeGeometry(curve, 20, 0.04, 8, false);
    var mat = new THREE.MeshStandardMaterial({
      color: 0xf7c87a,
      emissive: 0xf7c87a,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.7,
    });
    var tube = new THREE.Mesh(geo, mat);
    this.scene.add(tube);

    points.forEach(function (p) {
      var geo = new THREE.SphereGeometry(0.2, 12, 12);
      var mat = new THREE.MeshStandardMaterial({
        color: 0xf7c87a,
        emissive: 0xf7c87a,
        emissiveIntensity: 0.9,
      });
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(p);
      this.scene.add(mesh);
    }.bind(this));
  };

  // ── Scene switching ──────────────────────────────────────────────
  ImmersiveApp.prototype._gotoScene = function (index, animate) {
    if (index < 0 || index >= this.scenes.length) return;
    this.currentIndex = index;
    var sceneData = this.scenes[index];

    // Update HUD
    document.getElementById('hud-scene-title').textContent = sceneData.title;
    document.getElementById('hud-scene-title-zh').textContent = sceneData.titleZh;
    document.getElementById('hud-scene-desc').textContent = sceneData.description;

    // Update nav active
    document.querySelectorAll('.hud-scene-btn').forEach(function (btn, i) {
      btn.classList.toggle('active', i === index);
    });

    // Set base camera positions for this scene
    this.baseCameraPos = new THREE.Vector3(
      sceneData.cameraPosition.x,
      sceneData.cameraPosition.y,
      sceneData.cameraPosition.z
    );
    this.baseCameraTarget.set(
      sceneData.cameraTarget.x,
      sceneData.cameraTarget.y,
      sceneData.cameraTarget.z
    );

    // Camera movement
    if (animate && !this.prefersReducedMotion) {
      this._tweenCamera(this.baseCameraPos, this.baseCameraTarget);
    } else {
      this.camera.position.copy(this.baseCameraPos);
      this.camera.lookAt(this.baseCameraTarget);
    }

    // Accent lights
    this.accentLights.forEach(function (light) {
      light.color.set(sceneData.accentColor);
    });

    // Audio mood
    if (this.audio && this.audio.started) {
      this.audio.setMood(sceneData.audioMood);
    }
  };

  ImmersiveApp.prototype._tweenCamera = function (targetPos, targetLook) {
    var self = this;
    var startPos = this.camera.position.clone();
    var startLook = new THREE.Vector3();
    this.camera.getWorldDirection(startLook);
    startLook.multiplyScalar(5).add(startPos);
    var t0 = performance.now();
    var duration = 1200;
    function step(now) {
      var t = Math.min((now - t0) / duration, 1);
      var ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      self.camera.position.lerpVectors(startPos, targetPos, ease);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        self.camera.position.copy(targetPos);
        self.camera.lookAt(targetLook);
        self.baseCameraPos = targetPos.clone();
        self.baseCameraTarget = targetLook.clone();
      }
    }
    requestAnimationFrame(step);
  };

  // ── HUD Binding ─────────────────────────────────────────────────
  ImmersiveApp.prototype._bindHUD = function () {
    var self = this;
    var container = document.getElementById('hud-scene-nav');

    this.scenes.forEach(function (s, i) {
      var btn = document.createElement('button');
      btn.className = 'hud-scene-btn' + (i === 0 ? ' active' : '');
      btn.textContent = '0' + (i + 1);
      btn.setAttribute('title', s.title);
      btn.addEventListener('click', function () {
        self._gotoScene(i, true);
      });
      container.appendChild(btn);
    });

    document.getElementById('hud-back').addEventListener('click', function () {
      window.location.href = '../';
    });

    document.getElementById('hud-sound').addEventListener('click', function () {
      self._toggleSound();
    });
  };

  ImmersiveApp.prototype._toggleSound = function () {
    if (!this.soundEnabled) {
      // Sound was never enabled
      return;
    }
    this.muted = !this.muted;
    this._updateSoundIcon();
    if (this.audio) {
      this.audio.toggleMute();
    }
  };

  ImmersiveApp.prototype._updateSoundIcon = function () {
    var icon = document.getElementById('sound-icon');
    if (!this.soundEnabled) {
      icon.textContent = '➤';
      return;
    }
    icon.textContent = this.muted ? '🔇' : '🔊';
  };

  // ── Animation Loop ───────────────────────────────────────────────
  ImmersiveApp.prototype._animate = function () {
    var self = this;
    this.frameId = requestAnimationFrame(function (ts) { self._animate(); });

    var now = ts / 1000;

    // Particle drift
    if (this.particleSystem) {
      this.particleSystem.rotation.y += 0.0003;
    }

    // Node gentle float
    if (this.sceneNodes) {
      this.sceneNodes.forEach(function (node, i) {
        node.position.y = Math.sin(now * 0.5 + i * 0.8) * 0.1;
      });
    }

    // Camera: base position + subtle parallax (no hard override)
    if (this.baseCameraPos) {
      var px = this.prefersReducedMotion ? 0 : this.mouseX * 0.25;
      var py = this.prefersReducedMotion ? 0 : this.mouseY * -0.15;
      var tx = this.baseCameraPos.x + px;
      var ty = this.baseCameraPos.y + py;
      var tz = this.baseCameraPos.z;
      this.camera.position.x += (tx - this.camera.position.x) * 0.04;
      this.camera.position.y += (ty - this.camera.position.y) * 0.04;
      this.camera.position.z += (tz - this.camera.position.z) * 0.04;
      this.camera.lookAt(this.baseCameraTarget);
    }

    this.renderer.render(this.scene, this.camera);
  };

  // ── Fallback ────────────────────────────────────────────────────
  ImmersiveApp.prototype._showFallback = function () {
    var el = document.getElementById('immersive-canvas');
    if (el) {
      el.innerHTML = '' +
        '<div class="immersive-fallback">' +
          '<div class="ifb-icon">⚠</div>' +
          '<p>This device cannot run the immersive 3D mode.</p>' +
          '<a href="../" class="ifb-link">← Continue with the standard page</a>' +
        '</div>';
    }
  };

  // ── Start ───────────────────────────────────────────────────────
  ImmersiveApp.prototype.startWithSound = function () {
    this.soundEnabled = true;
    this.muted = false;
    this.audio = new window.CP_ImmersiveAudio();
    try {
      var ok = this.audio.init();
      if (ok) {
        this.audio.start();
        this.audio.setMood(this.scenes[this.currentIndex].audioMood);
      } else {
        this.soundEnabled = false;
      }
    } catch (e) {
      console.error('[Immersive] Audio init failed:', e);
      this.soundEnabled = false;
    }
    this._updateSoundIcon();
  };

  ImmersiveApp.prototype.startWithoutSound = function () {
    this.soundEnabled = false;
    this.muted = true;
    this.audio = new window.CP_ImmersiveAudio();
    try {
      this.audio.init(); // no sound, just ready for potential unmute
    } catch (e) {
      // silent failure ok
    }
    this._updateSoundIcon();
  };

  ImmersiveApp.prototype.destroy = function () {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    if (this.audio) this.audio.destroy();
    if (this.renderer) this.renderer.dispose();
  };

  window.CP_ImmersiveApp = ImmersiveApp;

})();