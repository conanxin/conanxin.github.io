/**
 * immersive.js — CP-4H-3 Immersive Mode
 * Vanilla Three.js. Camera click-switching for 6 scenes.
 * Uses esm.sh CDN for Three.js (browser parse-safe, no vendor file issues).
 * CP-4H-3: Async IIFE boot module with esm.sh THREE loading.
 */

(function () {
  'use strict';

  // ── Boot ─────────────────────────────────────────────────────
  (async function bootImmersive() {

    // ── THREE load ──────────────────────────────────────────────
    let THREE = null;
    try {
      // CP-5C-Hotfix-1: Try local vendor FIRST (for reliable local testing)
      // then fall back to esm.sh CDN
      try {
        THREE = await import('./vendor/three.module.js');
      } catch (ve) {
        // Fallback to esm.sh CDN
        THREE = await import('https://esm.sh/three@0.169.0');
      }
    } catch (e) {
      console.error('[Immersive] THREE load failed:', e && e.message ? e.message.slice(0, 200) : String(e));
      showBootFallback(
        'Three.js failed to load',
        e && e.message ? e.message.slice(0, 200) : String(e)
      );
      return;
    }

    // ── Fallback helper (DOM API only) ─────────────────────────
    function showBootFallback(reason, detail) {
      var entryOverlay = document.getElementById('entryOverlay');
      if (entryOverlay) {
        entryOverlay.setAttribute('hidden', '');
        entryOverlay.style.display = 'none';
      }

      var stage = document.getElementById('immersive-canvas');
      if (!stage) return;
      stage.textContent = '';

      var box = document.createElement('div');
      box.className = 'immersive-fallback';

      var icon = document.createElement('div');
      icon.className = 'ifb-icon';
      icon.textContent = '⚠';

      var title = document.createElement('h2');
      title.textContent = reason || 'Failed to load the immersive experience';

      var message = document.createElement('p');
      message.style.cssText = 'font-size:0.8rem;color:#8a96b0;margin-top:0.5rem;';
      if (detail) {
        message.textContent = String(detail).slice(0, 200);
      } else {
        message.textContent =
          'Try the standard page or use a browser with WebGL enabled.';
      }

      var help = document.createElement('p');
      help.style.cssText = 'font-size:0.8rem;color:#8a96b0;margin-top:0.5rem;';
      help.textContent =
        'Try: enabling WebGL, disabling privacy blockers, or using a different browser.';

      var link = document.createElement('a');
      link.href = '../';
      link.className = 'ifb-link';
      link.textContent = '\u2190 Back to Project Cinema';

      box.appendChild(icon);
      box.appendChild(title);
      box.appendChild(message);
      box.appendChild(help);
      box.appendChild(link);
      stage.appendChild(box);
    }

    // ── WebGL check ─────────────────────────────────────────────
    function isWebGLAvailable() {
      try {
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl') ||
                 canvas.getContext('experimental-webgl');
        if (!gl) {
          return {
            available: false,
            reason: 'WebGL disabled or blocked by browser/privacy settings'
          };
        }
        return { available: true };
      } catch (err) {
        return {
          available: false,
          reason: 'WebGL check failed: ' + (err.message || String(err))
        };
      }
    }

    // ── ImmersiveApp ────────────────────────────────────────────
    var ImmersiveApp = function () {
      this.scenes = window.CP_IMMERSIVE_SCENES || [];
      this.currentIndex = 0;
      this.renderer = null;
      this.scene = null;
      this.camera = null;
      this.objects = [];
      this.audio = null;
      this.soundEnabled = false;
      this.soundUnavailable = false;
      this.muted = false;
      this.mouseX = 0;
      this.mouseY = 0;
      this.frameId = null;

      // Camera base
      this.baseCameraPos = null;
      this.baseCameraTarget = new THREE.Vector3(0, 0, 0);
      // CP-5C: Debug mode — enabled via ?v=cp5c&debugScene=1
      var urlParams = new URLSearchParams(window.location.search);
      this.debugMode = urlParams.get('debugScene') === '1';

      // Continuous path
      this.continuousCameraEnabled = true;
      this.scrollProgress = 0;
      this.scrollSceneIndex = 0;
      this.scrollSceneT = 0;
      this.cameraPathPos = new THREE.Vector3();
      this.cameraPathTarget = new THREE.Vector3();
      this.needsScrollUpdate = false;
      this.scrollStoryEl = null;

      // Pause
      this.isPaused = false;

      // Entrance fly-in
      this.entryFlyInActive = false;
      this.entryFlyInStart = 0;
      this.entryFlyInDuration = 1600;
      this.entryFlyInFrom = null;

      // Scene focus
      this.sceneNodeMeshes = {};
      this.sceneGroups = [];
      this.activeWorldId = null;

      this.scrollObserver = null;
      this.prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    // ── Init ────────────────────────────────────────────────────
    ImmersiveApp.prototype.init = function () {
      var self = this;
      var webgl = isWebGLAvailable();

      if (!webgl.available) {
        showBootFallback('WebGL unavailable', webgl.reason);
        return false;
      }

      try {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: false
        });

        // Performance guard
        var isMobileUA = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        var isMobileVP = window.innerWidth < 768;
        var isMobile = isMobileUA || isMobileVP;
        var hwConcurrency = navigator.hardwareConcurrency || 4;
        var deviceMemory = navigator.deviceMemory || 8;
        var isLowPower = hwConcurrency <= 4 || deviceMemory <= 4;
        var maxPixelRatio = isLowPower ? 1.0 : (isMobile ? 1.5 : 2.0);

        this.renderer.setPixelRatio(
          Math.min(window.devicePixelRatio, maxPixelRatio)
        );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        document.getElementById('immersive-canvas')
          .appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060810);
        this.scene.fog = new THREE.Fog(0x060810, 20, 60);

        this.camera = new THREE.PerspectiveCamera(
          65,
          window.innerWidth / window.innerHeight,
          0.1,
          100
        );

        this._buildScene();
        this._bindHUD();
        this._initScrollStory();

        // Mouse parallax
        window.addEventListener('mousemove', function (e) {
          self.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
          self.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // Throttled resize
        var resizeRaf = null;
        window.addEventListener('resize', function () {
          if (resizeRaf) return;
          resizeRaf = requestAnimationFrame(function () {
            self.camera.aspect = window.innerWidth / window.innerHeight;
            self.camera.updateProjectionMatrix();
            self.renderer.setSize(window.innerWidth, window.innerHeight);
            resizeRaf = null;
          });
        });

        // Visibility pause
        document.addEventListener('visibilitychange', function () {
          self.isPaused = document.hidden;
          if (self.audio) {
            if (document.hidden) self.audio.suspend();
            else self.audio.resume();
          }
        });

        this.clockTime = performance.now();
        this._animate();

      } catch (err) {
        console.error('[Immersive] init error:', err);
        var msg = err && err.message ?
                  err.message.slice(0, 200) : String(err);
        showBootFallback('WebGL renderer failed', msg);
        return false;
      }

      return true;
    };

    // ── Build scene ──────────────────────────────────────────────
    ImmersiveApp.prototype._buildScene = function () {
      var self = this;

      // Ambient
      var ambient = new THREE.AmbientLight(0x1a2040, 0.8);
      this.scene.add(ambient);

      // Accent point light
      var firstScene = this.scenes[0];
      if (firstScene) {
        var light = new THREE.PointLight(firstScene.accentColor, 0.6, 15);
        light.position.set(0, 5, 5);
        this.scene.add(light);
      }

      // Ground
      var groundGeo = new THREE.PlaneGeometry(40, 40);
      var groundMat = new THREE.MeshStandardMaterial({
        color: 0x0a0f1a,
        roughness: 0.9,
        metalness: 0.1
      });
      var ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      this.scene.add(ground);

      // Fog for atmospheric depth
      this.scene.fog = new THREE.FogExp2(0x050810, 0.025);

      // CP-5C: Global group for background elements (dimmed per scene)
      this.globalGroup = new THREE.Group();
      this.scene.add(this.globalGroup);

      // Grid — add to globalGroup (will be dimmed by _updateSceneGroupVisibility)
      var gridHelper = new THREE.GridHelper(30, 30, 0x1a2040, 0x0d1428);
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.18;
      this.globalGroup.add(gridHelper);
      this.gridHelper = gridHelper;

      // Background silhouettes
      this._buildBackgroundSilhouettes();

      // Particles (midground depth — reduced count)
      this._buildParticles();

      // Foreground dust
      this._buildForegroundDust();

      // CP-5C: Build scene groups BEFORE loading setpieces
      this._buildSceneGroups();
      // CP-5C: Build setpieces into their scene groups (not this.scene)
      // CP-5C: Load setpieces into their scene groups (NOT this.scene)
      var self = this;
      for (var gi = 0; gi < 6; gi++) {
        switch (gi) {
          case 0: self._createResearchDeskSetpiece(); break;
          case 1: self._createBeyondChatSetpiece(); break;
          case 2: self._createArtifactExhibitionSetpiece(); break;
          case 3: self._createAgentCoreSetpiece(); break;
          case 4: self._createControlTowerSetpiece(); break;
          case 5: self._createArchiveHallSetpiece(); break;
        }
      }

      // CP-5C: Camera init from per-scene config
      var initScene = this.scenes[this.currentIndex];
      if (initScene) {
        var isMobile = window.innerWidth < 600;
        var camCfg = initScene.camera;
        var cam = isMobile ? (camCfg.mobile || camCfg.desktop) : (camCfg.desktop || camCfg);
        if (cam) {
          this.baseCameraPos = new THREE.Vector3(cam.position.x, cam.position.y, cam.position.z);
          this.baseCameraTarget = new THREE.Vector3(cam.target.x, cam.target.y, cam.target.z);
        } else {
          this.baseCameraPos = new THREE.Vector3(0, 4, 8);
          this.baseCameraTarget = new THREE.Vector3(0, 0, 0);
          // CP-5C: Debug mode — enabled via ?v=cp5c&debugScene=1
          var urlParams = new URLSearchParams(window.location.search);
          this.debugMode = urlParams.get('debugScene') === '1';
        }
        this.camera.position.copy(this.baseCameraPos);
        this.camera.lookAt(this.baseCameraTarget);
      }

      // CP-5C: Mobile camera adjustment (closer but not贴着大型物体)
      if (window.innerWidth < 600) {
        // Scale down position distance for mobile — setpiece will be scaled1.35x
        this.camera.position.z = this.camera.position.z * 0.6;
        this.camera.fov = 76;
        this.camera.updateProjectionMatrix();
      }

      // CP-5A: Build scene world groups (focus set on first navigation)
    };

    // ── Particles ────────────────────────────────────────────────
    ImmersiveApp.prototype._buildParticles = function () {
      // CP-5C: Reduced count, more subtle — ambient depth only
      var count = 80;
      var positions = new Float32Array(count * 3);
      var colors = new Float32Array(count * 3);

      for (var i = 0; i < count; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = Math.random() * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        var c = new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.5, 0.5);
        colors[i * 3]     = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

      var mat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.5, // CP-5C: reduced from 0.7
        sizeAttenuation: true
      });

      this.particleSystem = new THREE.Points(geo, mat);
      this.globalGroup.add(this.particleSystem);
    };

    // ── Command desk ─────────────────────────────────────────────
    ImmersiveApp.prototype._buildCommandDesk = function () {
      var geo = new THREE.BoxGeometry(4, 0.3, 2.5);
      var mat = new THREE.MeshStandardMaterial({
        color: 0x101828,
        roughness: 0.7
      });
      var desk = new THREE.Mesh(geo, mat);
      desk.position.set(0, 0.15, 0);
      desk.castShadow = true;
      desk.receiveShadow = true;
      this.scene.add(desk);

      var edgeMat = new THREE.MeshStandardMaterial({
        color: 0x1e3050,
        roughness: 0.5
      });
      var edgeGeo = new THREE.BoxGeometry(4.05, 0.05, 0.05);

      var topEdge = new THREE.Mesh(edgeGeo, edgeMat);
      topEdge.position.set(0, 0.3, 1.25);
      this.scene.add(topEdge);

      var bottomEdge = new THREE.Mesh(edgeGeo, edgeMat);
      bottomEdge.position.set(0, 0.3, -1.25);
      this.scene.add(bottomEdge);

      // Screens
      for (var i = 0; i < 3; i++) {
        var sGeo = new THREE.PlaneGeometry(0.8, 0.5);
        var sMat = new THREE.MeshStandardMaterial({
          color: 0x7eb8f7,
          emissive: 0x7eb8f7,
          emissiveIntensity: 0.3,
          side: THREE.DoubleSide
        });
        var screen = new THREE.Mesh(sGeo, sMat);
        screen.position.set(-1.2 + i * 1.2, 0.5, 1.26);
        this.scene.add(screen);
      }
    };

    // ── Artifact cards ───────────────────────────────────────────
    ImmersiveApp.prototype._buildArtifactCards = function () {
      for (var i = 0; i < 4; i++) {
        var geo = new THREE.PlaneGeometry(0.4, 0.25);
        var mat = new THREE.MeshStandardMaterial({
          color: 0x1a2030,
          emissive: 0xa08cf7,
          emissiveIntensity: 0.2,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85
        });
        var card = new THREE.Mesh(geo, mat);
        card.position.set(
          -0.9 + i * 0.6,
          0.8 + (i % 2) * 0.3,
          -2 - (i % 2) * 0.3
        );
        card.rotation.y = -0.2 + i * 0.1;
        this.scene.add(card);

        var key = 'artifact-' + i;
        if (!this.sceneNodeMeshes[key]) this.sceneNodeMeshes[key] = [];
        this.sceneNodeMeshes[key].push(card);
      }
    };

    // ── Agent line ───────────────────────────────────────────────
    ImmersiveApp.prototype._buildAgentLine = function () {
      var points = [
        new THREE.Vector3(-6, 0.5, 0),
        new THREE.Vector3(-2, 0.5, 0),
        new THREE.Vector3(2,  0.5, 0),
        new THREE.Vector3(6,  0.5, 0)
      ];

      var curve = new THREE.CatmullRomCurve3(points);
      var geo = new THREE.TubeGeometry(curve, 20, 0.04, 8, false);
      var mat = new THREE.MeshStandardMaterial({
        color: 0xf7c87a,
        emissive: 0xf7c87a,
        emissiveIntensity: 0.5
      });
      var tube = new THREE.Mesh(geo, mat);
      this.scene.add(tube);

      for (var i = 0; i < 4; i++) {
        var geo = new THREE.SphereGeometry(0.2, 12, 12);
        var mat = new THREE.MeshStandardMaterial({
          color: 0xf7c87a,
          emissive: 0xf7c87a,
          emissiveIntensity: 0.8
        });
        var mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(points[i]);
        this.scene.add(mesh);

        var key = 'agent-' + i;
        if (!this.sceneNodeMeshes[key]) this.sceneNodeMeshes[key] = [];
        this.sceneNodeMeshes[key].push(mesh);
      }
    };

    // ── Scene 04: Agent Hub ──────────────────────────────────────
    ImmersiveApp.prototype._buildAgentHub = function () {
      var hubPos = new THREE.Vector3(0, 1.2, 0);
      var agents = [
        { x: -5, y: 0.8, z: -1 },
        { x:5, y: 0.8, z: -1 },
        { x: -3, y: 1.5, z:  3 },
        { x:  3, y: 1.5, z:  3 }
      ];

      var hubGeo = new THREE.SphereGeometry(0.45, 16, 16);
      var hubMat = new THREE.MeshStandardMaterial({
        color: 0xf7c87a, emissive: 0xf7c87a, emissiveIntensity: 0.6,
        roughness: 0.3, metalness: 0.5
      });
      var hubMesh = new THREE.Mesh(hubGeo, hubMat);
      hubMesh.position.copy(hubPos);
      this.scene.add(hubMesh);
      this._addNodeMesh('agent-hub', hubMesh);

      agents.forEach(function (ag, i) {
        var nodeGeo = new THREE.SphereGeometry(0.22, 12, 12);
        var nodeMat = new THREE.MeshStandardMaterial({
          color: 0xf7c87a, emissive: 0xf7c87a, emissiveIntensity: 0.4, roughness: 0.4
        });
        var node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(ag.x, ag.y, ag.z);
        this.scene.add(node);
        this._addNodeMesh('agent-node-' + i, node);

        var linePoints = [
          new THREE.Vector3(ag.x, ag.y, ag.z),
          hubPos.clone()
        ];
        var lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        var lineMat = new THREE.LineBasicMaterial({ color: 0xf7c87a, transparent: true, opacity: 0.25 });
        this.scene.add(new THREE.Line(lineGeo, lineMat));
      }, this);
    };

    // ── Scene 05: Control Tower ───────────────────────────────────
    ImmersiveApp.prototype._buildControlTower = function () {
      var towerGeo = new THREE.CylinderGeometry(0.5, 0.7, 4, 8);
      var towerMat = new THREE.MeshStandardMaterial({
        color: 0x1a1520, emissive: 0xf78c7a, emissiveIntensity: 0.15, roughness: 0.6
      });
      var tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(0, 2, 0);
      this.scene.add(tower);
      this._addNodeMesh('tower-0', tower);

      var antGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 6);
      var antMat = new THREE.MeshStandardMaterial({
        color: 0xf78c7a, emissive: 0xf78c7a, emissiveIntensity: 0.8, roughness: 0.3
      });
      var antenna = new THREE.Mesh(antGeo, antMat);
      antenna.position.set(0, 4.75, 0);
      this.scene.add(antenna);
      this._addNodeMesh('tower-0', antenna);

      // Radar rings
      for (var r = 0; r < 3; r++) {
        var radius = 1.5 + r * 1.2;
        var ringGeo = new THREE.TorusGeometry(radius, 0.02, 6, 48);
        var ringMat = new THREE.MeshStandardMaterial({
          color: 0xf78c7a, emissive: 0xf78c7a,
          emissiveIntensity: 0.5 - r * 0.12,
          transparent: true, opacity: 0.7 - r * 0.15, roughness: 0.5
        });
        var ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(0, 0.5 + r * 0.8, 0);
        ring.rotation.x = Math.PI / 2;
        this.scene.add(ring);
        this._addNodeMesh('tower-ring-' + r, ring);
      }

      // Constellation nodes
      var constellations = [
        { x: -4, y: 3, z: -2 }, { x: 4, y: 2, z: -3 },
        { x: -3, y: 5, z:  1 }, { x: 3, y: 4, z:  2 },
        { x:  0, y: 6, z: -4 }
      ];
      constellations.forEach(function (cp, i) {
        var cnodeGeo = new THREE.SphereGeometry(0.12, 8, 8);
        var cnodeMat = new THREE.MeshStandardMaterial({
          color: 0xf78c7a, emissive: 0xf78c7a, emissiveIntensity: 0.7, roughness: 0.4
        });
        var cnode = new THREE.Mesh(cnodeGeo, cnodeMat);
        cnode.position.set(cp.x, cp.y, cp.z);
        this.scene.add(cnode);
        this._addNodeMesh('constellation-' + i, cnode);

        var linePoints = [
          new THREE.Vector3(cp.x, cp.y, cp.z),
          new THREE.Vector3(0, 4.75, 0)
        ];
        var lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        var lineMat = new THREE.LineBasicMaterial({ color: 0xf78c7a, transparent: true, opacity: 0.15 });
        this.scene.add(new THREE.Line(lineGeo, lineMat));
      }, this);
    };

    // ── Scene 06: Artifact Archive ───────────────────────────────
    ImmersiveApp.prototype._buildArtifactArchive = function () {
      // Back wall
      var wallGeo = new THREE.BoxGeometry(14, 8, 0.3);
      var wallMat = new THREE.MeshStandardMaterial({
        color: 0x0a1520, emissive: 0x7ac8f7, emissiveIntensity: 0.05, roughness: 0.9
      });
      var wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set(0, 4, -8);
      this.scene.add(wall);
      this._addNodeMesh('archive-0', wall);

      // Shelf rows with glowing items
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 5; col++) {
          var shelfGeo = new THREE.BoxGeometry(0.6, 0.08, 0.4);
          var shelfMat = new THREE.MeshStandardMaterial({
            color: 0x0d1a2a, emissive: 0x7ac8f7, emissiveIntensity: 0.2,
            roughness: 0.7, transparent: true, opacity: 0.8
          });
          var shelf = new THREE.Mesh(shelfGeo, shelfMat);
          shelf.position.set(-3.6 + col * 1.8, 1.0 + row * 1.4, -7.5);
          this.scene.add(shelf);
          this._addNodeMesh('archive-shelf-' + row + '-' + col, shelf);

          var itemGeo = new THREE.BoxGeometry(0.3, 0.25, 0.2);
          var itemMat = new THREE.MeshStandardMaterial({
            color: 0x7ac8f7, emissive: 0x7ac8f7, emissiveIntensity: 0.5, roughness: 0.3
          });
          var item = new THREE.Mesh(itemGeo, itemMat);
          item.position.set(-3.6 + col * 1.8, 1.2 + row * 1.4, -7.5);
          this.scene.add(item);
          this._addNodeMesh('archive-item-' + row + '-' + col, item);
        }
      }

      // Arch passage
      var archGeo = new THREE.TorusGeometry(1.2, 0.1, 8, 24, Math.PI);
      var archMat = new THREE.MeshStandardMaterial({
        color: 0x7ac8f7, emissive: 0x7ac8f7, emissiveIntensity: 0.4, roughness: 0.4
      });
      var arch = new THREE.Mesh(archGeo, archMat);
      arch.position.set(0, 2, -5);
      arch.rotation.x = Math.PI;
      this.scene.add(arch);
      this._addNodeMesh('archive-arch', arch);

      // Floor glow strip
      var stripGeo = new THREE.PlaneGeometry(2, 8);
      var stripMat = new THREE.MeshStandardMaterial({
        color: 0x7ac8f7, emissive: 0x7ac8f7, emissiveIntensity: 0.3,
        transparent: true, opacity: 0.4, side: THREE.DoubleSide
      });
      var strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.set(0, 0.01, -5);
      strip.rotation.x = -Math.PI / 2;
      this.scene.add(strip);
      this._addNodeMesh('archive-strip', strip);
    };

    // ── Foreground dust ───────────────────────────────────────────
    ImmersiveApp.prototype._buildForegroundDust = function () {
      var count = 80;
      var positions = new Float32Array(count * 3);
      var colors = new Float32Array(count * 3);
      for (var i = 0; i < count; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 16;
        positions[i * 3 + 1] = Math.random() * 3;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        var c = new THREE.Color().setHSL(0.58 + Math.random() * 0.15, 0.3, 0.7);
        colors[i * 3]     = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
      var mat = new THREE.PointsMaterial({
        size: 0.04, vertexColors: true, transparent: true, opacity: 0.5, sizeAttenuation: true
      });
      this.foregroundDust = new THREE.Points(geo, mat);
      this.scene.add(this.foregroundDust);
    };

    // ── Background silhouettes ───────────────────────────────────
    ImmersiveApp.prototype._buildBackgroundSilhouettes = function () {
      // CP-5C: Make silhouettes transparent so they can be dimmed
      var silMat = new THREE.MeshStandardMaterial({
        color: 0x080c14, emissive: 0x102030, emissiveIntensity: 0.04,
        roughness: 1.0, side: THREE.BackSide,
        transparent: true, opacity: 0.4
      });
      // Move further back to avoid appearing in scene cameras
      var domeGeo = new THREE.SphereGeometry(20, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      var dome = new THREE.Mesh(domeGeo, silMat);
      dome.position.set(0, -2, -25);
      this.globalGroup.add(dome);

      var wallGeo = new THREE.BoxGeometry(0.5, 10, 20);
      [-14, 14].forEach(function (x) {
        var w = new THREE.Mesh(wallGeo, silMat);
        w.position.set(x, 3, -5);
        this.globalGroup.add(w);
      }, this);
    };

    // ── Helper: add node mesh to tracking ────────────────────────
    ImmersiveApp.prototype._addNodeMesh = function (key, mesh) {
      if (!this.sceneNodeMeshes[key]) this.sceneNodeMeshes[key] = [];
      this.sceneNodeMeshes[key].push(mesh);
    };

    // CP-5B: Tag an object with its scene world ID
    ImmersiveApp.prototype._tagWorldObject = function (mesh, sceneId) {
      if (mesh) mesh.userData.worldSceneId = sceneId;
    };

    // ── Scene switch ──────────────────────────────────────────────
    ImmersiveApp.prototype._gotoScene = function (index, animate) {
      if (index < 0 || index >= this.scenes.length) return;
      this.currentIndex = index;
      var sceneData = this.scenes[index];

      // CP-5C: Read camera from per-scene config (desktop/mobile)
      var isMobile = window.innerWidth < 600;
      var camCfg = sceneData.camera;
      var desktopCam = camCfg && camCfg.desktop;
      var mobileCam = camCfg && camCfg.mobile;
      var cam = isMobile ? (mobileCam || desktopCam) : (desktopCam || camCfg);
      if (cam) {
        this.baseCameraPos = new THREE.Vector3(
          cam.position.x, cam.position.y, cam.position.z
        );
        this.baseCameraTarget = new THREE.Vector3(
          cam.target.x, cam.target.y, cam.target.z
        );
      } else {
        // Fallback
        this.baseCameraPos = new THREE.Vector3(0, 4, 8);
        this.baseCameraTarget = new THREE.Vector3(0, 0, 0);
      // CP-5C: Debug mode — enabled via ?v=cp5c&debugScene=1
      var urlParams = new URLSearchParams(window.location.search);
      this.debugMode = urlParams.get('debugScene') === '1';
      }

      if (animate && !this.prefersReducedMotion) {
        this._tweenCamera(this.baseCameraPos, this.baseCameraTarget);
        this._updateDebugOverlay();
      } else {
        this.camera.position.copy(this.baseCameraPos);
        this.camera.lookAt(this.baseCameraTarget);
      }

      if (this.audio && this.soundEnabled && !this.muted) {
        this.audio.setMood(sceneData.audioMood);
      }

      this._updateObjectFocus(index);
      this._triggerSceneCue(index, sceneData);
      this._updateSceneControl();
      this._updateSceneGroupVisibility(index);
    };

    // ── Camera tween ─────────────────────────────────────────────
    ImmersiveApp.prototype._tweenCamera = function (targetPos, targetLook) {
      var self = this;
      var startPos = this.camera.position.clone();
      var startTarget =
        this.camera.target ? this.camera.target.clone() : this.baseCameraTarget.clone();
      // Cinematic duration: slightly longer for drama
      var duration = this.prefersReducedMotion ? 400 : 1100;
      var start = performance.now();
      // Store orbital angle for cinematic sweep
      var startAngle = Math.atan2(startPos.x, startPos.z);
      var endAngle   = Math.atan2(targetLook.x, targetLook.z);
      // Slight angle delta for orbital feel (max ±0.15 rad)
      var angleDelta = (endAngle - startAngle) * 0.08;
      var radius = Math.sqrt(startPos.x * startPos.x + startPos.z * startPos.z);

      function tick(now) {
        var t = Math.min((now - start) / duration, 1);
        var et = self._easeInOutCubic(t);
        // Lerp position
        self.camera.position.lerpVectors(startPos, targetPos, et);
        // Cinematic orbital offset (subtle sweep)
        var sweep = Math.sin(et * Math.PI) * angleDelta * radius * 0.15;
        self.camera.position.x += sweep;
        // Lerp look target
        var look = new THREE.Vector3().lerpVectors(startTarget, targetLook, et);
        self.camera.lookAt(look);
        if (t < 1) requestAnimationFrame(tick);
      }

      if (!this.camera.target) {
        this.camera.target = new THREE.Vector3();
      }

      requestAnimationFrame(tick);
    };

    // ── HUD ──────────────────────────────────────────────────────
    ImmersiveApp.prototype._bindHUD = function () {
      var self = this;
      var sceneData = this.scenes[this.currentIndex];

      document.getElementById('hud-scene-title').textContent =
        sceneData.title;
      document.getElementById('hud-scene-title-zh').textContent =
        sceneData.titleZh;
      document.getElementById('hud-scene-desc').textContent =
        sceneData.description;

      document.getElementById('hud-sound')
        .addEventListener('click', function () {
          self._toggleSound();
        });
    };

    // ── Scroll story ─────────────────────────────────────────────
    ImmersiveApp.prototype._initScrollStory = function () {
      var self = this;
      var el = document.getElementById('scrollStory');
      if (!el) return;
      this.scrollStoryEl = el;

      el.addEventListener('click', function (e) {
        var target = e.target.closest('[data-scene-index]');
        if (!target) return;
        var idx = parseInt(target.dataset.sceneIndex, 10);
        if (!isNaN(idx)) self._scrollToScene(idx);
      });

      // CP-4J: Use scrollStory as root so IntersectionObserver tracks
      // scrollable container, not the window viewport
      this.scrollObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var idx = parseInt(entry.target.dataset.sceneIndex, 10);
              if (!isNaN(idx) && idx !== self.currentIndex) {
                self._setSceneFromScroll(idx);
              }
            }
          });
        },
        {
          root: el,
          rootMargin: '-30% 0px -30% 0px',
          threshold: 0.1
        }
      );

      var sections = el.querySelectorAll('[data-scene-index]');
      sections.forEach(function (sec) {
        self.scrollObserver.observe(sec);
      });

      // CP-4J: Keyboard navigation (ArrowUp/Down, PageUp/Down, Home/End)
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', function (e) {
        var total = self.scenes.length;
        var current = self.currentIndex;
        var next = current;

        switch (e.key) {
          case 'ArrowDown':
          case 'PageDown':
          case ' ':
            e.preventDefault();
            next = Math.min(current + 1, total - 1);
            break;
          case 'ArrowUp':
          case 'PageUp':
            e.preventDefault();
            next = Math.max(current - 1, 0);
            break;
          case 'Home':
            e.preventDefault();
            next = 0;
            break;
          case 'End':
            e.preventDefault();
            next = total - 1;
            break;
          default:
            return;
        }

        if (next !== current) {
          self._scrollToScene(next);
        }
      });
    };

       ImmersiveApp.prototype._setSceneFromScroll = function (index) {
      this.currentIndex = index;
      var sceneData = this.scenes[index];

      if (sceneData) {
        // CP-5C-Hotfix-1: Use _getSceneCamera helper (same as _gotoScene)
        var cam = this._getSceneCamera(sceneData);
        if (cam) {
          this.baseCameraPos = cam.position;
          this.baseCameraTarget = cam.target;
        } else {
          this.baseCameraPos = new THREE.Vector3(0, 4, 8);
          this.baseCameraTarget = new THREE.Vector3(0, 0, 0);
        }
        this.camera.position.copy(this.baseCameraPos);
        this.camera.lookAt(this.baseCameraTarget);
      }

      document.getElementById('hud-scene-title').textContent =
        sceneData.title;
      document.getElementById('hud-scene-title-zh').textContent =
        sceneData.titleZh;
      document.getElementById('hud-scene-desc').textContent =
        sceneData.description;

      if (this.audio && this.soundEnabled && !this.muted) {
        this.audio.setMood(sceneData.audioMood);
      }

      this._updateObjectFocus(index);
      this._updateSceneProgress();
      this._updateSceneControl();
      this._updateSceneGroupVisibility(index);
    };

    // CP-4J: Scroll scrollStory container to target section
    ImmersiveApp.prototype._scrollToScene = function (index) {
           var story = this.scrollStoryEl;
      if (!story) {
          this._gotoScene(index, true);
        return;
      }
      var target = story.querySelector('[data-scene-index="' + index + '"]');
      if (!target) return;

      var behavior = this.prefersReducedMotion ? 'auto' : 'smooth';
      story.scrollTo({
        top: target.offsetTop,
        behavior: behavior
      });
    };

    // ── Continuous camera ────────────────────────────────────────
    ImmersiveApp.prototype._updateScrollProgress = function () {
      var el = this.scrollStoryEl;
      if (!el) return;

      // CP-4J: Use scrollTop of the real scroll container
      var scrollTop = el.scrollTop;
      var maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;

      this.scrollProgress = Math.max(0, Math.min(1, scrollTop / maxScroll));

      var sceneCount = this.scenes.length;
      var rawIndex = this.scrollProgress * sceneCount;
      var newIndex = Math.max(0, Math.min(sceneCount - 1, Math.floor(rawIndex)));
      this.scrollSceneIndex = newIndex;
      this.scrollSceneT = rawIndex - newIndex;
      this.needsScrollUpdate = true;

      // CP-4J: Also trigger scene change if scroll moved to new scene
      if (newIndex !== this.currentIndex) {
        this._setSceneFromScroll(newIndex);
      }
    };

       // CP-5C-Hotfix-1: Read camera from per-scene config (camera.desktop)
    ImmersiveApp.prototype._getSceneCamera = function (sceneData) {
      if (!sceneData || !sceneData.camera) return null;
      var isMobile = window.innerWidth < 600;
      var cam = isMobile ? (sceneData.camera.mobile || sceneData.camera.desktop) : sceneData.camera.desktop;
      if (!cam) return null;
      return {
        position: new THREE.Vector3(cam.position.x, cam.position.y, cam.position.z),
        target: new THREE.Vector3(cam.target.x, cam.target.y, cam.target.z)
      };
    };

    ImmersiveApp.prototype._updateContinuousCamera = function () {
      if (!this.needsScrollUpdate) return;
      this.needsScrollUpdate = false;
      if (!this.continuousCameraEnabled || this.prefersReducedMotion) return;

      var idx = this.scrollSceneIndex;
      var t = this.scrollSceneT;
      var nextIdx = Math.min(idx + 1, this.scenes.length - 1);

      var curScene = this.scenes[idx];
      var nextScene = this.scenes[nextIdx];
      if (!curScene || !nextScene) return;

      var curCam = this._getSceneCamera(curScene);
      var nextCam = this._getSceneCamera(nextScene);
      if (!curCam || !nextCam) return;

      this.cameraPathPos.lerpVectors(curCam.position, nextCam.position, t);
      this.cameraPathTarget.lerpVectors(curCam.target, nextCam.target, t);
      this.camera.position.copy(this.cameraPathPos);
      this.camera.lookAt(this.cameraPathTarget);
    };

    // ── Object focus ─────────────────────────────────────────────
    ImmersiveApp.prototype._updateObjectFocus = function (activeIndex) {
      var self = this;
      Object.keys(this.sceneNodeMeshes).forEach(function (key) {
        var inKey = key.split('-');
        var sceneIdx = parseInt(inKey[1], 10);
        var meshes = self.sceneNodeMeshes[key];
        if (!meshes) return;
        meshes.forEach(function (mesh) {
          if (sceneIdx === activeIndex) {
            mesh.scale.setScalar(1.25);
            mesh.material.emissiveIntensity = 1.0;
          } else {
            mesh.scale.setScalar(1.0);
            mesh.material.emissiveIntensity = 0.2;
          }
        });
      });
    };

    // ── Scene cue ────────────────────────────────────────────────
    ImmersiveApp.prototype._triggerSceneCue = function (index, sceneData) {
      var cue = document.getElementById('scene-cue');
      if (!cue) return;

      var label = 'Scene ' +
        String(index + 1).padStart(2, '0') + ' \u00b7 ' + sceneData.title;
      cue.textContent = label;
      cue.classList.remove('cue-visible');
      void cue.offsetWidth;
      cue.classList.add('cue-visible');

      var delay = this.prefersReducedMotion ? 200 : 1200;
      setTimeout(function () {
        cue.classList.remove('cue-visible');
      }, delay);
    };

    // ── Control hint (CP-4I) ───────────────────────────────────
    ImmersiveApp.prototype._showControlHint = function () {
      var self = this;
      var hint = document.getElementById('controlHint');
      if (!hint) return;

      hint.classList.remove('is-hidden');
      hint.classList.add('is-visible');

      // Close button
      var closeBtn = document.getElementById('controlHintClose');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          self._hideControlHint();
        }, { once: true });
      }

      // Auto-fade after 6 seconds (or 0.5s if reduced motion)
      var delay = this.prefersReducedMotion ? 500 : 6000;
      setTimeout(function () {
        self._hideControlHint();
      }, delay);
    };


    ImmersiveApp.prototype._hideControlHint = function () {
      var hint = document.getElementById('controlHint');
      if (!hint) return;
      hint.classList.remove('is-visible');
      hint.classList.add('is-hidden');
    };

    // ── Scene progress (CP-4I) ──────────────────────────────────
    ImmersiveApp.prototype._updateSceneProgress = function () {
      var idx = this.currentIndex;
      var sceneData = this.scenes[idx];

      var spIndex = document.getElementById('spIndex');
      var spHint = document.getElementById('spHint');

      if (spIndex) {
        spIndex.textContent = String(idx + 1).padStart(2, '0');
      }
      if (spHint && sceneData) {
        spHint.textContent = 'Scroll to continue';
      }
    };

    // ── Scroll progress binding (CP-4I) ────────────────────────
    ImmersiveApp.prototype._bindScrollProgress = function () {
      var self = this;
      var el = this.scrollStoryEl;
      if (!el) return;

      var hint = document.getElementById('controlHint');
      var progressHint = document.getElementById('sceneProgressHint');
      var hasScrolled = false;


      el.addEventListener('scroll', function () {
        // Hide control hint on first scroll
        if (!hasScrolled && hint) {
          hasScrolled = true;
          self._hideControlHint();
        }
        // Show scene progress hint
        if (progressHint) {
          progressHint.classList.add('is-visible');
        }
      }, { passive: true });
    };

    // ── Toggle sound ─────────────────────────────────────────────
    ImmersiveApp.prototype._toggleSound = function () {
      if (this.soundUnavailable) return;

      if (!this.soundEnabled) {
        try {
          if (!this.audio) this.audio = new window.CP_ImmersiveAudio();
          var ok = this.audio.init();
          if (ok) {
            this.audio.start();
            this.audio.setMood(this.scenes[this.currentIndex].audioMood);
            this.soundEnabled = true;
            this.muted = false;
          } else {
            this.soundUnavailable = true;
          }
        } catch (e) {
          console.error('[Immersive] Audio enable failed:', e);
          this.soundUnavailable = true;
        }
        this._updateSoundIcon();
        return;
      }

      this.muted = !this.muted;
      if (this.audio) this.audio.toggleMute();
      this._updateSoundIcon();
    };

    // ── Entrance fly-in ─────────────────────────────────────────
    ImmersiveApp.prototype._startEntryFlyIn = function () {
      if (this.prefersReducedMotion) return;
      if (!this.baseCameraPos) return;

      this.entryFlyInFrom = this.baseCameraPos.clone();
      this.entryFlyInFrom.z += 8;
      this.entryFlyInFrom.y += 3;
      this.camera.position.copy(this.entryFlyInFrom);
      this.camera.lookAt(this.baseCameraTarget);
      this.entryFlyInActive = true;
      this.entryFlyInStart = performance.now();
    };

    ImmersiveApp.prototype._easeOutCubic = function (t) {
      return 1 - Math.pow(1 - t, 3);
    };

    ImmersiveApp.prototype._easeInOutCubic = function (t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    // ── Sound icon ──────────────────────────────────────────────
    ImmersiveApp.prototype._updateSoundIcon = function () {
      var el = document.getElementById('hud-sound');
      if (!el) return;
      if (this.soundUnavailable) {
        el.textContent = '\ud83d\udd14 Muted';
      } else if (!this.soundEnabled || this.muted) {
        el.textContent = '\ud83d\udd14 Sound Off';
      } else {
        el.textContent = '\ud83d\udd0a Sound On';
      }
    };

    // ── Animate ─────────────────────────────────────────────────
       var _animateDiagLogged = false;
    ImmersiveApp.prototype._animate = function () {
      var self = this;
      this.frameId = requestAnimationFrame(function () {
        self._animate();
      });
      if (this.isPaused) return;

      // CP-5C-HF1: Log camera/group state on first frame only (once)
      if (!_animateDiagLogged) {
        _animateDiagLogged = true;
        var idx = this.currentIndex;
        var scene = this.scenes[idx];
        var cam = this.camera ? this.camera.position : null;
        var tgt = this.baseCameraTarget;
        var camStr = cam ? cam.x.toFixed(1) + ',' + cam.y.toFixed(1) + ',' + cam.z.toFixed(1) : 'N/A';
        var tgtStr = tgt ? tgt.x.toFixed(1) + ',' + tgt.y.toFixed(1) + ',' + tgt.z.toFixed(1) : 'N/A';
        var childCounts = [];
        if (this.sceneGroups) {
          for (var gi = 0; gi < this.sceneGroups.length; gi++) {
            var g = this.sceneGroups[gi];
            childCounts.push('g' + gi + ':' + (g ? g.children.length : -1) + '/' + (g && g.visible));
          }
        }
        console.log('[CP-5C-HF1] INIT scene=' + (idx + 1) + ' ' + (scene ? scene.title : 'N/A'));
        console.log('[CP-5C-HF1] cam pos=' + camStr + ' cam tgt=' + tgtStr);
        console.log('[CP-5C-HF1] groups: ' + childCounts.join(' '));
      }

      this._updateScrollProgress();
      this._updateContinuousCamera();

      // Mouse parallax
      if (this.camera) {
        var tx = this.camera.position.x + this.mouseX * 0.3;
        var ty = this.camera.position.y + this.mouseY * 0.2;
        this.camera.position.x += (tx - this.camera.position.x) * 0.05;
        this.camera.position.y += (ty - this.camera.position.y) * 0.05;
      }

      // Particle drift
      if (this.particleSystem) {
        this.particleSystem.rotation.y += 0.0003;
      }
      if (this.foregroundDust) {
        this.foregroundDust.rotation.y -= 0.0002;
      }

      // Entry fly-in
      if (this.entryFlyInActive) {
        var elapsed = performance.now() - this.entryFlyInStart;
        var t = Math.min(elapsed / this.entryFlyInDuration, 1);
        var et = this._easeOutCubic(t);
        this.camera.position.lerpVectors(
          this.entryFlyInFrom, this.baseCameraPos, et
        );
        this.camera.lookAt(this.baseCameraTarget);
        if (t >= 1) this.entryFlyInActive = false;
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    // ── Entry points ─────────────────────────────────────────────
    ImmersiveApp.prototype.startWithSound = function () {
      this.soundEnabled = true;
      this.muted = false;
      this.soundUnavailable = false;
      this.audio = new window.CP_ImmersiveAudio();
      try {
        var ok = this.audio.init();
        if (ok) {
          this.audio.start();
          this.audio.setMood(this.scenes[this.currentIndex].audioMood);
        } else {
          this.soundEnabled = false;
          this.soundUnavailable = true;
        }
      } catch (e) {
        console.error('[Immersive] Audio init failed:', e);
        this.soundEnabled = false;
        this.soundUnavailable = true;
      }
      this._updateSoundIcon();
      this._startEntryFlyIn();
    };

    ImmersiveApp.prototype.startWithoutSound = function () {
      this.soundEnabled = false;
      this.muted = true;
      this.soundUnavailable = false;
      this.audio = new window.CP_ImmersiveAudio();
      try {
        this.audio.init();
      } catch (e) {
        // silent failure ok
      }
      this._updateSoundIcon();
      this._startEntryFlyIn();
    };

    ImmersiveApp.prototype.destroy = function () {
      if (this.frameId) cancelAnimationFrame(this.frameId);
      if (this.audio) this.audio.destroy();
      if (this.renderer) this.renderer.dispose();
    };

    // ── Launch ──────────────────────────────────────────────────
    var app = new ImmersiveApp();

    // CP-4K: Unified scene navigation via control panel / dots / keyboard
    ImmersiveApp.prototype._goToSceneControl = function (index) {
      index = Math.max(0, Math.min(this.scenes.length - 1, index));
      this._scrollToScene(index);
      this._setSceneFromScroll(index);
      this._updateSceneControl();
    };

    // CP-4K: Bind Prev / Next / dots click handlers
    ImmersiveApp.prototype._bindSceneControls = function () {
      var self = this;

      var prev = document.getElementById('scenePrev');
      var next = document.getElementById('sceneNext');
      var dots = document.querySelectorAll('#sceneDots [data-scene-index]');

      if (prev) {
        prev.addEventListener('click', function () {
          self._goToSceneControl(self.currentIndex - 1);
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          self._goToSceneControl(self.currentIndex + 1);
        });
      }

      dots.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var idx = parseInt(btn.dataset.sceneIndex, 10);
          if (!isNaN(idx)) self._goToSceneControl(idx);
        });
      });
    };

    // CP-4K: Update control panel + dots UI to match currentIndex
    ImmersiveApp.prototype._updateSceneControl = function () {
      var scene = this.scenes[this.currentIndex];
      if (!scene) return;

      var indexEl = document.getElementById('sceneCtrlIndex');
      var titleEl = document.getElementById('sceneCtrlTitle');
      var dots = document.querySelectorAll('#sceneDots [data-scene-index]');
      var prev = document.getElementById('scenePrev');
      var next = document.getElementById('sceneNext');

      if (indexEl) {
        indexEl.textContent = String(this.currentIndex + 1).padStart(2, '0') + ' / 06';
      }
      if (titleEl) {
        titleEl.textContent = scene.title;
      }

      var cur = this.currentIndex;
      dots.forEach(function (btn) {
        var active = parseInt(btn.dataset.sceneIndex, 10) === cur;
        btn.classList.toggle('is-active', active);
      });

      if (prev) prev.disabled = cur === 0;
      if (next) next.disabled = cur === this.scenes.length - 1;
    };


    // CP-5A: Build world groups for each scene — init once, switch by visibility
    ImmersiveApp.prototype._buildSceneGroups = function () {
      var self = this;
      this.scenes.forEach(function (scene, idx) {
        var group = new THREE.Group();
        group.name = 'scene-group-' + String(idx + 1).padStart(2, '0');
        group.userData.sceneIndex = idx;
        group.visible = false;
        self.sceneGroups[idx] = group;
        self.scene.add(group);
      });
    };

    // CP-5C: Add object to scene group by index
    ImmersiveApp.prototype._addToSceneGroup = function (idx, object) {
      if (!object) return;
      if (this.sceneGroups && this.sceneGroups[idx]) {
        this.sceneGroups[idx].add(object);
      } else {
        // Fallback: group not ready, add to root scene (should not happen)
        this.scene.add(object);
      }
    };

    // CP-5C: Set opacity on all materials in a group
    ImmersiveApp.prototype._setGroupOpacity = function (group, opacity) {
      if (!group) return;
      group.traverse(function (child) {
        if (!child.material) return;
        var mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(function (mat) {
          mat.transparent = opacity < 1;
          mat.opacity = opacity;
          mat.depthWrite = opacity >= 0.8;
        });
      });
    };

    // CP-5C: Scene group visibility — active=true, others=false
    // Also dims globalGroup (dome, particles, dust) to 0.12 for cleanliness
    ImmersiveApp.prototype._updateSceneGroupVisibility = function (activeIndex) {
      var self = this;
      if (!this.sceneGroups) return;
      var isMobile = window.innerWidth < 600;
      var rm = this.prefersReducedMotion;

      this.sceneGroups.forEach(function (group, idx) {
        if (!group) return;
        var isActive = (idx === activeIndex);

        if (isActive) {
          group.visible = true;
          var sc = isMobile ? 1.35 : 1.12;
          group.traverse(function (obj) {
            if (!obj.isMesh && !obj.isPoints) return;
            self._setGroupOpacityOnObject(obj, 1.0);
            if (rm) {
              obj.scale.setScalar(sc);
            } else {
              obj.scale.x += (sc - obj.scale.x) * 0.08;
              obj.scale.y += (sc - obj.scale.y) * 0.08;
              obj.scale.z += (sc - obj.scale.z) * 0.08;
            }
          });
        } else {
          group.visible = false;
        }
      });

      // CP-5C-Hotfix-1: Update debug overlay after visibility change
      this._updateDebugOverlay();

      // CP-5C: Dim global group (dome, particles, dust) for scene cleanliness
      if (this.globalGroup) {
        this.globalGroup.traverse(function (obj) {
          if (!obj.isMesh && !obj.isPoints) return;
          self._setGroupOpacityOnObject(obj, 0.12);
        });
      }
    };


    // CP-5C: Update debug overlay
       // CP-5C-Hotfix-1: Enhanced debug overlay — all groups + continuous camera state
    ImmersiveApp.prototype._updateDebugOverlay = function () {
      if (!this.debugMode) { document.getElementById("debug-overlay").style.display = "none"; return; } document.getElementById("debug-overlay").style.display = "block";
      var scene = this.scenes[this.currentIndex];
      var idx = this.currentIndex;
      var pos = this.camera ? this.camera.position : null;
      var tgt = this.baseCameraTarget;
      var groupsHtml = '';

      // Show ALL group children counts and visibility
      if (this.sceneGroups) {
        for (var gi = 0; gi < this.sceneGroups.length; gi++) {
          var g = this.sceneGroups[gi];
          var childCount = g ? g.children.length : 0;
          var vis = g ? g.visible : false;
          var marker = (gi === idx) ? '*' : ' ';
          groupsHtml += '<div style="color:' + (vis ? '#7ef7b8' : '#666') + '">' +
            marker + 'group[' + gi + ']: ' + childCount + ' children, visible=' + vis + '</div>';
        }
      } else {
        groupsHtml = '<div style="color:#f77">sceneGroups not initialized</div>';
      }

      var camPosStr = pos ? pos.x.toFixed(1) + ',' + pos.y.toFixed(1) + ',' + pos.z.toFixed(1) : 'N/A';
      var camTgtStr = tgt ? tgt.x.toFixed(1) + ',' + tgt.y.toFixed(1) + ',' + tgt.z.toFixed(1) : 'N/A';
      var continuousActive = this.continuousCameraEnabled ? 'ON' : 'OFF';
      var scrollProgress = this.scrollProgress ? this.scrollProgress.toFixed(3) : '0.000';

      var html = '<div style="font-size:14px;font-weight:bold;margin-bottom:8px;color:#f7c87a">DEBUG MODE</div>' +
        '<div style="color:#7ef7b8">scene: ' + (idx + 1) + '/06 — ' + (scene ? scene.title : 'N/A') + '</div>' +
        '<div style="margin-top:6px">' + groupsHtml + '</div>' +
        '<div style="margin-top:6px;color:#aaf">cam pos: ' + camPosStr + '</div>' +
        '<div style="color:#aaf">cam tgt: ' + camTgtStr + '</div>' +
        '<div style="color:#888">continuous: ' + continuousActive + ' | scroll: ' + scrollProgress + '</div>';

      var el = document.getElementById('debug-overlay');
      if (el) el.innerHTML = html;
    };

    // CP-5C: Set opacity on single object (not group traverse)
    ImmersiveApp.prototype._setGroupOpacityOnObject = function (obj, opacity) {
      if (!obj || !obj.material) return;
      var mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach(function (mat) {
        mat.transparent = opacity < 1;
        mat.opacity = opacity;
        mat.depthWrite = opacity >= 0.8;
      });
    };


    // ═══════════════════════════════════════════════════════════════
    // CP-5B: Large scene setpieces — each scene has one dominant object
    // ═══════════════════════════════════════════════════════════════

    // ── Scene 1: Research Desk + Knowledge Wall ─────────────────
    ImmersiveApp.prototype._createResearchDeskSetpiece = function () {
      var scene = this.scenes[0];
      if (!scene) return;
      var accent = new THREE.Color(scene.accentColor);

      // Large desk surface
      var deskGeo = new THREE.BoxGeometry(7, 0.25, 3.5);
      var deskMat = new THREE.MeshStandardMaterial({
        color: 0x0d1a2a, emissive: accent, emissiveIntensity: 0.06,
        roughness: 0.8, metalness: 0.2
      });
      var desk = new THREE.Mesh(deskGeo, deskMat);
      desk.position.set(-7, 0.8, 2); // CP-5B-HF1: left side, away from tower
      this._addToSceneGroup(0, desk);


      // Desk legs
      [-3, 3].forEach(function (x) {
        [-1.4, 1.4].forEach(function (z) {
          var legGeo = new THREE.BoxGeometry(0.12, 0.8, 0.12);
          var legMat = new THREE.MeshStandardMaterial({
            color: 0x101828, roughness: 0.9
          });
          var leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(x, 0.4, z);
          this._addToSceneGroup(0, leg);

        }, this);
      }, this);

      // 4 large paper sheets on desk
      for (var i = 0; i < 4; i++) {
        var pw = 1.6 + (i % 2) * 0.4;
        var ph = 1.1 + Math.floor(i / 2) * 0.3;
        var sheetGeo = new THREE.PlaneGeometry(pw, ph);
        var sheetMat = new THREE.MeshStandardMaterial({
          color: 0xf0f4ff, emissive: accent, emissiveIntensity: 0.15,
          roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0.9
        });
        var sheet = new THREE.Mesh(sheetGeo, sheetMat);
        sheet.position.set(-9.0 + i * 1.5, 1.2 + (i % 2) * 0.15, 1.7 + (Math.floor(i / 2) - 0.5) * 1.2);
        sheet.rotation.y = -0.3 + i * 0.1;
        this._addToSceneGroup(0, sheet);


        // Text lines on paper
        for (var j = 0; j < 3; j++) {
          var lineGeo = new THREE.PlaneGeometry(pw * 0.7, 0.04);
          var lineMat = new THREE.MeshStandardMaterial({
            color: accent, emissive: accent, emissiveIntensity: 0.4,
            transparent: true, opacity: 0.6
          });
          var line = new THREE.Mesh(lineGeo, lineMat);
          line.position.set(sheet.position.x -0.1, sheet.position.y + 0.25 - j * 0.22, sheet.position.z + 0.01);
          line.rotation.y = sheet.rotation.y;
          this._addToSceneGroup(0, line);

        }
      }

      // Glowing idea core at center-top of desk
      var coreGeo = new THREE.SphereGeometry(0.35, 16, 16);
      var coreMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.8,
        roughness: 0.2, metalness: 0.5
      });
      var core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(-7, 1.6, 2); // CP-5B-HF1: follows desk
      this._addToSceneGroup(0, core);


      // Connection lines from papers to core
      for (var k = 0; k < 4; k++) {
        var px = -9.0 + k * 1.5;
        var pz = 1.7 + (Math.floor(k / 2) - 0.5) * 1.2;
        var linePoints = [
          new THREE.Vector3(px, 1.2, pz),
          new THREE.Vector3(-7, 1.6, 2)
        ];
        var lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        var lineMat = new THREE.LineBasicMaterial({
          color: accent, transparent: true, opacity: 0.35
        });
        var connLine = new THREE.Line(lineGeo, lineMat);
        this._addToSceneGroup(0, connLine);

      }


      // CP-5C-Hotfix-1: Debug sentinel — bright cyan marker visible from camera
      // Position: (-7, 2.4, 2) — above the idea core, clearly visible
      var anchorGeo = new THREE.SphereGeometry(0.18, 12, 12);
      var anchorMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.0,
        roughness: 0.1, metalness: 0.0
      });
      var anchor = new THREE.Mesh(anchorGeo, anchorMat);
      anchor.position.set(-7, 2.4, 2);
      anchor.name = 'scene01-debug-anchor';
      this._addToSceneGroup(0, anchor);

      // Bright ring around anchor for extra visibility
      var ringGeo = new THREE.TorusGeometry(0.3, 0.03, 8, 32);
      var ringMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5,
        roughness: 0.2
      });
      var ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(-7, 2.4, 2);
      ring.rotation.x = Math.PI / 2;
      ring.name = 'scene01-debug-ring';
      this._addToSceneGroup(0, ring);

      // Left/right knowledge wall silhouettes (background layer)
      var wallMat = new THREE.MeshStandardMaterial({
        color: 0x060c18, emissive: accent, emissiveIntensity: 0.03,
        roughness: 1.0, side: THREE.BackSide
      });
      [-8, 8].forEach(function (x) {
        var wGeo = new THREE.BoxGeometry(0.3, 6, 10);
        var wall = new THREE.Mesh(wGeo, wallMat);
        wall.position.set(x, 3, 1); // CP-5B-HF1: follows desk area
        this._addToSceneGroup(0, wall);

      }, this);

      // Point light for scene1
      var light = new THREE.PointLight(accent, 0.8, 18);
      light.position.set(0, 3, 3);
      this._addToSceneGroup(0, light);

    };

    // ── Scene 2: Chat-to-Terminal Portal ─────────────────────────
    ImmersiveApp.prototype._createBeyondChatSetpiece = function () {
      var scene = this.scenes[1];
      if (!scene) return;
      var accent = new THREE.Color(scene.accentColor);

      // Chat bubble (left panel)
      var chatGeo = new THREE.BoxGeometry(3.5, 2.5, 0.12);
      var chatMat = new THREE.MeshStandardMaterial({
        color: 0x0d1a2a, emissive: accent, emissiveIntensity: 0.08,
        roughness: 0.7, metalness: 0.3
      });
      var chatPanel = new THREE.Mesh(chatGeo, chatMat);
      chatPanel.position.set(-3, 2.0, 0);
      this._addToSceneGroup(1, chatPanel);


      // Chat bubble tail
      var tailGeo = new THREE.BoxGeometry(0.6, 0.4, 0.1);
      var tail = new THREE.Mesh(tailGeo, chatMat);
      tail.position.set(-4.6, 1.1, 0);
      this._addToSceneGroup(1, tail);


      // Simulated chat text lines on chat panel
      for (var c = 0; c < 4; c++) {
        var cLineGeo = new THREE.PlaneGeometry(2.5, 0.1);
        var cLineMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.5,
          transparent: true, opacity: 0.7
        });
        var cLine = new THREE.Mesh(cLineGeo, cLineMat);
        cLine.position.set(-3, 2.7 - c * 0.4, 0.07);
        this._addToSceneGroup(1, cLine);

      }

      // Arrow flow from chat to terminal
      var arrowPoints = [
        new THREE.Vector3(-1.2, 2.0, 0),
        new THREE.Vector3(0, 2.0, 0),
        new THREE.Vector3(1.5, 2.0, 0)
      ];
      var arrowGeo = new THREE.BufferGeometry().setFromPoints(arrowPoints);
      var arrowMat = new THREE.LineBasicMaterial({
        color: accent, transparent: true, opacity: 0.5
      });
      var arrow = new THREE.Line(arrowGeo, arrowMat);
      this._addToSceneGroup(1, arrow);


      // Arrow head
      var headGeo = new THREE.ConeGeometry(0.15, 0.35, 3);
      var headMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.6
      });
      var head = new THREE.Mesh(headGeo, headMat);
      head.position.set(1.5, 2.0, 0);
      head.rotation.z = -Math.PI / 2;
      this._addToSceneGroup(1, head);


      // Terminal window (center)
      var termGeo = new THREE.BoxGeometry(3.2, 2.8, 0.12);
      var termMat = new THREE.MeshStandardMaterial({
        color: 0x080e1a, emissive: accent, emissiveIntensity: 0.12,
        roughness: 0.6, metalness: 0.4
      });
      var termPanel = new THREE.Mesh(termGeo, termMat);
      termPanel.position.set(0, 2.0, 0);
      this._addToSceneGroup(1, termPanel);


      // Terminal text lines
      for (var t = 0; t < 5; t++) {
        var tLineGeo = new THREE.PlaneGeometry(2.4, 0.1);
        var tLineMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.6,
          transparent: true, opacity: 0.8
        });
        var tLine = new THREE.Mesh(tLineGeo, tLineMat);
        tLine.position.set(0, 2.8 - t * 0.35, 0.07);
        this._addToSceneGroup(1, tLine);

      }

      // Second arrow to web panel
      var arrow2Points = [
        new THREE.Vector3(1.6, 2.0, 0),
        new THREE.Vector3(3.2, 2.0, 0)
      ];
      var arrow2Geo = new THREE.BufferGeometry().setFromPoints(arrow2Points);
      var arrow2 = new THREE.Line(arrow2Geo, arrowMat);
      this._addToSceneGroup(1, arrow2);


      // Web browser panel (right)
      var webGeo = new THREE.BoxGeometry(3.2, 2.5, 0.12);
      var webMat = new THREE.MeshStandardMaterial({
        color: 0x0a1525, emissive: accent, emissiveIntensity: 0.1,
        roughness: 0.7, metalness: 0.3
      });
      var webPanel = new THREE.Mesh(webGeo, webMat);
      webPanel.position.set(3.6, 2.0, 0);
      this._addToSceneGroup(1, webPanel);


      // Browser address bar
      var barGeo = new THREE.PlaneGeometry(2.4, 0.18);
      var barMat = new THREE.MeshStandardMaterial({
        color: 0x1a2540, emissive: accent, emissiveIntensity: 0.3,
        transparent: true, opacity: 0.8
      });
      var bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(3.6, 2.9, 0.07);
      this._addToSceneGroup(1, bar);


      // Web content blocks
      for (var w = 0; w < 3; w++) {
        var wBlockGeo = new THREE.PlaneGeometry(2.4, 0.35);
        var wBlockMat = new THREE.MeshStandardMaterial({
          color: 0x0d1f35, emissive: accent, emissiveIntensity: 0.15,
          transparent: true, opacity: 0.8
        });
        var wBlock = new THREE.Mesh(wBlockGeo, wBlockMat);
        wBlock.position.set(3.6, 2.35 - w * 0.55, 0.07);
        this._addToSceneGroup(1, wBlock);

      }

      // Point light
      var light = new THREE.PointLight(accent, 0.8, 18);
      light.position.set(0, 4, 3);
      this._addToSceneGroup(1, light);

    };

    // ── Scene 3: Artifact Exhibition ───────────────────────────
    ImmersiveApp.prototype._createArtifactExhibitionSetpiece = function () {
      var scene = this.scenes[2];
      if (!scene) return;
      var accent = new THREE.Color(scene.accentColor);

      // Long exhibition table
      var tableGeo = new THREE.BoxGeometry(10, 0.18, 2.0);
      var tableMat = new THREE.MeshStandardMaterial({
        color: 0x0d1a2a, emissive: accent, emissiveIntensity: 0.06,
        roughness: 0.8, metalness: 0.3
      });
      var table = new THREE.Mesh(tableGeo, tableMat);
      table.position.set(0, 0.9, 0);
      this._addToSceneGroup(2, table);


      // Table legs
      [-4.5, 4.5].forEach(function (x) {
        [-0.7, 0.7].forEach(function (z) {
          var legGeo = new THREE.BoxGeometry(0.12, 0.9, 0.12);
          var legMat = new THREE.MeshStandardMaterial({
            color: 0x101828, roughness: 0.9
          });
          var leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(x, 0.45, z);
          this._addToSceneGroup(2, leg);

        }, this);
      }, this);

      // 5 artifact cards on table
      var cardPositions = [-4, -2, 0, 2, 4];
      cardPositions.forEach(function (x, i) {
        var cardW = 1.4, cardH = 1.0;
        var cardGeo = new THREE.BoxGeometry(cardW, cardH, 0.08);
        var cardMat = new THREE.MeshStandardMaterial({
          color: 0x0d1f35, emissive: accent, emissiveIntensity: 0.2,
          roughness: 0.6, metalness: 0.4
        });
        var card = new THREE.Mesh(cardGeo, cardMat);
        card.position.set(x, 1.55, 0);
        this._addToSceneGroup(2, card);


        // Card frame border
        var frameGeo = new THREE.BoxGeometry(cardW + 0.08, cardH + 0.08, 0.04);
        var frameMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.5,
          roughness: 0.5
        });
        var frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(x, 1.55, -0.02);
        this._addToSceneGroup(2, frame);


        // Content lines inside card
        for (var j = 0; j < 2; j++) {
          var cLineGeo = new THREE.PlaneGeometry(cardW * 0.75, 0.08);
          var cLineMat = new THREE.MeshStandardMaterial({
            color: accent, emissive: accent, emissiveIntensity: 0.5,
            transparent: true, opacity: 0.7
          });
          var cLine = new THREE.Mesh(cLineGeo, cLineMat);
          cLine.position.set(x, 1.7 - j * 0.3, 0.05);
          this._addToSceneGroup(2, cLine);

        }
      }, this);

      // Archive capsule (right side, taller)
      var capsGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.8, 12);
      var capsMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.5,
        roughness: 0.3, metalness: 0.6
      });
      var capsule = new THREE.Mesh(capsGeo, capsMat);
      capsule.position.set(6.5, 1.8, 0);
      this._addToSceneGroup(2, capsule);


      // Directional flow arrow (left to right)
      for (var f = 0; f < 4; f++) {
        var arrowGeo = new THREE.ConeGeometry(0.12, 0.3, 4);
        var arrowMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.5
        });
        var arrow = new THREE.Mesh(arrowGeo, arrowMat);
        arrow.position.set(-3.5 + f * 2.5, 1.3, 0.8);
        arrow.rotation.z = -Math.PI / 2;
        this._addToSceneGroup(2, arrow);

      }

      // Point light
      var light = new THREE.PointLight(accent, 0.8, 18);
      light.position.set(0, 4, 3);
      this._addToSceneGroup(2, light);

    };

    // ── Scene 4: Agent Orchestration Core ────────────────────────
    ImmersiveApp.prototype._createAgentCoreSetpiece = function () {
      var scene = this.scenes[3];
      if (!scene) return;
      var accent = new THREE.Color(scene.accentColor);

      // Central hub sphere (large)
      var hubGeo = new THREE.SphereGeometry(1.0, 20, 20);
      var hubMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.6,
        roughness: 0.2, metalness: 0.6
      });
      var hub = new THREE.Mesh(hubGeo, hubMat);
      hub.position.set(0, 2.5, -15); // CP-5B-HF1: far z
      this._addToSceneGroup(3, hub);


      // Hub inner glow sphere
      var glowGeo = new THREE.SphereGeometry(0.6, 16, 16);
      var glowMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 1.2,
        roughness: 0.1, transparent: true, opacity: 0.7
      });
      var glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.set(0, 2.5, 0);
      this._addToSceneGroup(3, glow);


      // 4 agent nodes around hub
      var agentNodes = [
        { x: -4.5, y: 2.0, z: -1 },
        { x: 4.5,  y: 2.0, z: -1 },
        { x: -3, y: 3.5, z: 2 },
        { x: 3,    y: 3.5, z: 2 }
      ];
      agentNodes.forEach(function (node, i) {
        // Agent sphere
        var nodeGeo = new THREE.SphereGeometry(0.5, 14, 14);
        var nodeMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.5,
          roughness: 0.3, metalness: 0.5
        });
        var nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.set(node.x, node.y, node.z);
        this._addToSceneGroup(3, nodeMesh);


        // Node label bar
        var barGeo = new THREE.BoxGeometry(0.8, 0.12, 0.06);
        var barMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.7
        });
        var bar = new THREE.Mesh(barGeo, barMat);
        bar.position.set(node.x, node.y - 0.8, node.z);
        this._addToSceneGroup(3, bar);


        // Connection line to hub
        var linePoints = [
          new THREE.Vector3(node.x, node.y, node.z),
          new THREE.Vector3(0, 2.5, 0)
        ];
        var lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        var lineMat = new THREE.LineBasicMaterial({
          color: accent, transparent: true, opacity: 0.4
        });
        var connLine = new THREE.Line(lineGeo, lineMat);
        this._addToSceneGroup(3, connLine);

      }, this);

      // Pulsing rings around hub
      for (var r = 0; r < 3; r++) {
        var ringGeo = new THREE.TorusGeometry(1.8 + r * 0.8, 0.025, 6, 48);
        var ringMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.4 - r * 0.1,
          transparent: true, opacity: 0.5 - r * 0.1
        });
        var ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(0, 2.5, 0);
        ring.rotation.x = Math.PI / 2;
        this._addToSceneGroup(3, ring);

      }

      // Point light
      var light = new THREE.PointLight(accent, 1.0, 20);
      light.position.set(0, 5, 3);
      this._addToSceneGroup(3, light);

    };

    // ── Scene 5: Control Tower ────────────────────────────────────
    ImmersiveApp.prototype._createControlTowerSetpiece = function () {
      var scene = this.scenes[4];
      if (!scene) return;
      var accent = new THREE.Color(scene.accentColor);

      // Tower base (large cylinder)
      var baseGeo = new THREE.CylinderGeometry(0.8, 1.0, 6, 10);
      var baseMat = new THREE.MeshStandardMaterial({
        color: 0x0d1520, emissive: accent, emissiveIntensity: 0.1,
        roughness: 0.7, metalness: 0.4
      });
      var tower = new THREE.Mesh(baseGeo, baseMat);
           tower.position.set(0, 3, -20); // CP-5B-HF1: far z to avoid conflict
      this._addToSceneGroup(4, tower);


      // Tower top antenna
      var antGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.5, 6);
      var antMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.9,
        roughness: 0.2, metalness: 0.7
      });
      var antenna = new THREE.Mesh(antGeo, antMat);
      antenna.position.set(0, 6.75, 0);
      this._addToSceneGroup(4, antenna);


      // Antenna tip glow
      var tipGeo = new THREE.SphereGeometry(0.15, 8, 8);
      var tipMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 1.5,
        roughness: 0.1
      });
      var tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.set(0, 7.9, 0);
      this._addToSceneGroup(4, tip);


      // 3 radar rings
      for (var r = 0; r < 3; r++) {
        var ringGeo = new THREE.TorusGeometry(2.0 + r * 1.4, 0.04, 8, 60);
        var ringMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent,
          emissiveIntensity: 0.6 - r * 0.12,
          transparent: true, opacity: 0.7 - r * 0.15
        });
        var ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(0, 1.0 + r * 1.5, 0);
        ring.rotation.x = Math.PI / 2;
        this._addToSceneGroup(4, ring);

      }

      // 5 constellation nodes with lines to antenna
      var constellations = [
        { x: -5, y: 4, z: -2 },
        { x: 5,  y: 3, z: -3 },
        { x: -4, y: 6, z: 1 },
        { x: 4,  y: 5, z: 2 },
        { x: 0,  y: 7, z: -4 }
      ];
      constellations.forEach(function (cp, i) {
        var cnodeGeo = new THREE.SphereGeometry(0.18, 10, 10);
        var cnodeMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.8,
          roughness: 0.3
        });
        var cnode = new THREE.Mesh(cnodeGeo, cnodeMat);
        cnode.position.set(cp.x, cp.y, cp.z);
        this._addToSceneGroup(4, cnode);


        var linePoints = [
          new THREE.Vector3(cp.x, cp.y, cp.z),
          new THREE.Vector3(0, 7.9, 0)
        ];
        var lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        var lineMat = new THREE.LineBasicMaterial({
          color: accent, transparent: true, opacity: 0.2
        });
        var connLine = new THREE.Line(lineGeo, lineMat);
        this._addToSceneGroup(4, connLine);

      }, this);

      // Point light
      var light = new THREE.PointLight(accent, 1.0, 22);
      light.position.set(0, 6, 4);
      this._addToSceneGroup(4, light);

    };

    // ── Scene 6: Archive Hall ────────────────────────────────────
    ImmersiveApp.prototype._createArchiveHallSetpiece = function () {
      var scene = this.scenes[5];
      if (!scene) return;
      var accent = new THREE.Color(scene.accentColor);

      // Large back wall
      var wallGeo = new THREE.BoxGeometry(16, 8, 0.25);
      var wallMat = new THREE.MeshStandardMaterial({
        color: 0x060f1a, emissive: accent, emissiveIntensity: 0.04,
        roughness: 0.95
      });
      var wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set(0, 4, -25); // CP-5B-HF1: far z
      this._addToSceneGroup(5, wall);


      // 4 rows of 6 shelf units
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 6; col++) {
          // Shelf board
          var shelfGeo = new THREE.BoxGeometry(1.0, 0.1, 0.5);
          var shelfMat = new THREE.MeshStandardMaterial({
            color: 0x0a1a2a, emissive: accent, emissiveIntensity: 0.1,
            roughness: 0.85
          });
          var shelf = new THREE.Mesh(shelfGeo, shelfMat);
          shelf.position.set(-7.0 + col * 2.8, 1.5 + row * 1.6, -9.5);
          this._addToSceneGroup(5, shelf);


          // Glowing artifact on shelf
          var itemGeo = new THREE.BoxGeometry(0.5, 0.4, 0.3);
          var itemMat = new THREE.MeshStandardMaterial({
            color: accent, emissive: accent, emissiveIntensity: 0.55,
            roughness: 0.3, metalness: 0.5
          });
          var item = new THREE.Mesh(itemGeo, itemMat);
          item.position.set(-7.0 + col * 2.8, 1.9 + row * 1.6, -9.5);
          this._addToSceneGroup(5, item);

        }
      }

      // Central arch passage
      var archGeo = new THREE.TorusGeometry(1.8, 0.12, 10, 32, Math.PI);
      var archMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.5,
        roughness: 0.3, metalness: 0.6
      });
      var arch = new THREE.Mesh(archGeo, archMat);
      arch.position.set(0, 2.8, -6);
      arch.rotation.x = Math.PI;
      this._addToSceneGroup(5, arch);


      // Arch side pillars
      [-1.8, 1.8].forEach(function (x) {
        var pillarGeo = new THREE.BoxGeometry(0.2, 2.8, 0.2);
        var pillarMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.3,
          roughness: 0.6
        });
        var pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(x, 1.4, -6);
        this._addToSceneGroup(5, pillar);

      }, this);

      // Floor glow strip (leading to arch)
      var stripGeo = new THREE.PlaneGeometry(2.5, 8);
      var stripMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.3,
        transparent: true, opacity: 0.35, side: THREE.DoubleSide
      });
      var strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.set(0, 0.01, -5);
      strip.rotation.x = -Math.PI / 2;
      this._addToSceneGroup(5, strip);


      // Point light
      var light = new THREE.PointLight(accent, 0.9, 22);
      light.position.set(0, 5, -5);
      this._addToSceneGroup(5, light);

    };


    var launched = false;

    function launch(sound) {
      if (launched) return;
      launched = true;

      var ok = app.init();
      if (!ok) return;

      if (sound) app.startWithSound();
      else app.startWithoutSound();

      document.getElementById('entryOverlay').classList.add('hidden');
      document.getElementById('hud').classList.add('visible');
      // CP-4J: Also make scrollStory visible (it is inside HUD)
      var scrollStoryEl = document.getElementById('scrollStory');
      if (scrollStoryEl) scrollStoryEl.classList.add('visible');

      // CP-4I: Show control hint after entering 3D
      app._showControlHint();
      // CP-4I: Show scene progress hint
      app._updateSceneProgress();
      // CP-4I: Bind scene progress to scroll changes
      app._bindScrollProgress();
      // CP-4K: Bind scene control buttons
      app._bindSceneControls();
      app._updateSceneControl();
      // CP-5C: Set initial scene group visibility
      app._updateSceneGroupVisibility(0);

      // CP-5C-Hotfix-1: Diagnostic — log scene/group state once (for headless testing)
      (function logDiagnostics() {
        var idx = app.currentIndex;
        var scene = app.scenes[idx];
        var group = app.sceneGroups ? app.sceneGroups[idx] : null;
        var cam = app.camera ? app.camera.position : null;
        var tgt = app.baseCameraTarget;
        var camStr = cam ? cam.x.toFixed(1) + ',' + cam.y.toFixed(1) + ',' + cam.z.toFixed(1) : 'N/A';
        var tgtStr = tgt ? tgt.x.toFixed(1) + ',' + tgt.y.toFixed(1) + ',' + tgt.z.toFixed(1) : 'N/A';
        var childCounts = [];
        if (app.sceneGroups) {
          for (var gi = 0; gi < app.sceneGroups.length; gi++) {
            childCounts.push('g' + gi + ':' + (app.sceneGroups[gi] ? app.sceneGroups[gi].children.length : -1));
          }
        }
        console.log('[CP-5C-HF1] scene=' + (idx + 1) + ' title=' + (scene ? scene.title : 'N/A'));
        console.log('[CP-5C-HF1] cam pos=' + camStr + ' tgt=' + tgtStr);
        console.log('[CP-5C-HF1] group children: ' + childCounts.join(' '));
      }());
    }

    document.getElementById('btnEnterSound')
      .addEventListener('click', function () { launch(true); });
    document.getElementById('btnEnterNoSound')
      .addEventListener('click', function () { launch(false); });

  })(); // end bootImmersive async IIFE

})(); // end module wrapper