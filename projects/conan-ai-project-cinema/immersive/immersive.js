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

    // CP-5D-Hotfix-1: Global error handlers for runtime ReferenceError detection
    window.addEventListener('error', function (e) {
      console.error('[Immersive] uncaught error:', e.error);
    });
    window.addEventListener('unhandledrejection', function (e) {
      console.error('[Immersive] unhandled rejection:', e.reason);
    });

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
    // CP-5D-Hotfix-1: Enhanced error detail — distinguishes ReferenceError vs WebGL
    function showBootFallback(reason, detail, errObj) {
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

      // CP-5D-Hotfix-1: Show detailed error info for runtime errors
      var debugMode = new URLSearchParams(window.location.search).get('debugScene') === '1';
      if (errObj && (errObj instanceof ReferenceError || errObj instanceof TypeError || errObj.name === 'SyntaxError')) {
        // Scene runtime error — show structured detail
        var errDetail = document.createElement('small');
        errDetail.style.cssText = 'color:#c05050;font-size:0.65rem;margin-top:0.3rem;display:block;max-width:420px;word-break:break-all;';
        var errLines = [];
        errLines.push(errObj.name + ': ' + errObj.message);
        if (debugMode && errObj.stack) {
          var stackParts = errObj.stack.split('\n').slice(0, 4);
          errLines = errLines.concat(stackParts.slice(1));
        }
        errDetail.textContent = errLines.join(' | ').slice(0, 300);
        box.appendChild(errDetail);

        // Update title to reflect runtime error
        title.textContent = 'Scene runtime error';
        title.style.color = '#c05050';
      }

      // CP-5D-Hotfix-1: Show phase/version hint
      var hint = document.createElement('small');
      hint.style.cssText = 'color:#4a5a7a;font-size:0.6rem;margin-top:0.4rem;display:block;';
      hint.textContent = 'Phase CP-5D · v=cp5d-hotfix1';
      box.appendChild(hint);


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

    // ═══════════════════════════════════════════════════════════════
    // CP-5D: Material helpers — cinematic look development
    // ═══════════════════════════════════════════════════════════════

    // Glass-like material with transparency
    function createGlassMaterial(hexColor, opacity) {
      var c = new THREE.Color(hexColor);
      return new THREE.MeshStandardMaterial({
        color: c,
        emissive: c,
        emissiveIntensity: 0.15,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: opacity !== undefined ? opacity : 0.6,
        side: THREE.DoubleSide,
        depthWrite: false
      });
    }

    // Glow material for emissive objects
    function createGlowMaterial(hexColor, intensity) {
      var c = new THREE.Color(hexColor);
      return new THREE.MeshStandardMaterial({
        color: c,
        emissive: c,
        emissiveIntensity: intensity !== undefined ? intensity : 1.0,
        roughness: 0.2,
        metalness: 0.3
      });
    }

    // Panel material for UI-like surfaces
    function createPanelMaterial(hexColor) {
      var c = new THREE.Color(hexColor);
      return new THREE.MeshStandardMaterial({
        color: 0x0a1220,
        emissive: c,
        emissiveIntensity: 0.12,
        roughness: 0.6,
        metalness: 0.4
      });
    }

    // Dark metal material
    function createDarkMetalMaterial(hexColor, emissiveIntensity) {
      var c = new THREE.Color(hexColor);
      return new THREE.MeshStandardMaterial({
        color: 0x0d1520,
        emissive: c,
        emissiveIntensity: emissiveIntensity !== undefined ? emissiveIntensity : 0.05,
        roughness: 0.8,
        metalness: 0.5
      });
    }

    // Create a small glowing status badge
    function createStatusBadge(sceneGroup, x, y, z, label, accentColor, app) {
      var c = new THREE.Color(accentColor);
      // Badge base
      var badgeGeo = new THREE.BoxGeometry(0.7, 0.14, 0.05);
      var badgeMat = new THREE.MeshStandardMaterial({
        color: c, emissive: c, emissiveIntensity: 0.6,
        roughness: 0.3, metalness: 0.5
      });
      var badge = new THREE.Mesh(badgeGeo, badgeMat);
      badge.position.set(x, y, z);
      app._addToSceneGroup(sceneGroup, badge);
      return badge;
    }

    // Create pulsing dot that travels along a path
    function createPulsingDot(sceneGroup, x1, y1, z1, x2, y2, z2, color, app) {
      var c = new THREE.Color(color);
      var dotGeo = new THREE.SphereGeometry(0.08, 8, 8);
      var dotMat = new THREE.MeshStandardMaterial({
        color: c, emissive: c, emissiveIntensity: 1.5,
        roughness: 0.1, transparent: true, opacity: 0.9
      });
      var dot = new THREE.Mesh(dotGeo, dotMat);
      dot.userData.pulsePath = [
        new THREE.Vector3(x1, y1, z1),
        new THREE.Vector3(x2, y2, z2)
      ];
      dot.userData.pulseT = Math.random();
      dot.userData.pulseSpeed = 0.3 + Math.random() * 0.2;
      app._addToSceneGroup(sceneGroup, dot);
      return dot;
    }

    // Create connecting line between two points
    function createConnectionLine(sceneGroup, x1, y1, z1, x2, y2, z2, color, opacity, app) {
      var c = new THREE.Color(color);
      var points = [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2)];
      var geo = new THREE.BufferGeometry().setFromPoints(points);
      var mat = new THREE.LineBasicMaterial({
        color: c, transparent: true,
        opacity: opacity !== undefined ? opacity : 0.35
      });
      var line = new THREE.Line(geo, mat);
      app._addToSceneGroup(sceneGroup, line);
      return line;
    }

    // Create a radar ring at given height
    function createRadarRing(sceneGroup, radius, y, color, app) {
      var c = new THREE.Color(color);
      var ringGeo = new THREE.TorusGeometry(radius, 0.03, 6, 48);
      var ringMat = new THREE.MeshStandardMaterial({
        color: c, emissive: c, emissiveIntensity: 0.5,
        transparent: true, opacity: 0.6
      });
      var ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, y, 0);
      ring.rotation.x = Math.PI / 2;
      app._addToSceneGroup(sceneGroup, ring);
      return ring;
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
        // CP-5D: Cinematic tone mapping
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

        document.getElementById('immersive-canvas')
          .appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060810);
        // CP-5D: Atmospheric fog — deeper cinematic feel
        this.scene.fog = new THREE.FogExp2(0x050810, 0.02);

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
        // CP-5D-Hotfix-1: Pass err object for ReferenceError detection
        if (err instanceof ReferenceError || err instanceof TypeError || err.name === 'SyntaxError') {
          showBootFallback('WebGL renderer failed', msg, err);
        } else {
          showBootFallback('WebGL renderer failed', msg);
        }
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

    // CP-5D: Animate pulsing dots along their paths
    ImmersiveApp.prototype._updatePulsingDots = function () {
      var self = this;
      if (!this.sceneGroups) return;
      var activeGroup = this.sceneGroups[this.currentIndex];
      if (!activeGroup) return;
      activeGroup.traverse(function (obj) {
        if (!obj.userData.pulsePath) return;
        var path = obj.userData.pulsePath;
        var t = obj.userData.pulseT;
        var speed = obj.userData.pulseSpeed || 0.3;
        obj.userData.pulseT = (t + speed * 0.016) % 1;
        var p = t;
        obj.position.lerpVectors(path[0], path[1], p);
        // Pulse opacity
        if (obj.material) {
          var mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(function (m) {
            m.opacity = 0.5 + Math.sin(performance.now() * 0.005) * 0.4;
          });
        }
      });
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
        // CP-5D: Update pulsing dots animation
        this._updatePulsingDots();
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
    // CP-5D: Scene 01 — Complex Ideas (Research Desk + Cyan Idea Core)
    ImmersiveApp.prototype._createResearchDeskSetpiece = function () {
      var scene = this.scenes[0];
      if (!scene) return;
      var accent = new THREE.Color(scene.accentColor);
      var cyanGlow = new THREE.Color(0x00ffff);

      // ── Research Desk (HERO — center-left) ──────────────────
      var deskGeo = new THREE.BoxGeometry(6.5, 0.22, 3.0);
      var deskMat = createDarkMetalMaterial(accent, 0.08);
      var desk = new THREE.Mesh(deskGeo, deskMat);
      desk.position.set(-7, 0.7, 1.5);
      desk.castShadow = true;
      this._addToSceneGroup(0, desk);

      // Desk legs
      [-3.0, 3.0].forEach(function (x) {
        [-1.1, 1.1].forEach(function (z) {
          var legGeo = new THREE.BoxGeometry(0.1, 0.7, 0.1);
          var legMat = createDarkMetalMaterial(accent, 0.03);
          var leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(x, 0.35, z);
          this._addToSceneGroup(0, leg);
        }, this);
      }, this);

      // Desk edge trim (emissive line)
      var trimGeo = new THREE.BoxGeometry(6.5, 0.04, 0.04);
      var trimMat = createGlowMaterial(accent, 0.4);
      var trimTop = new THREE.Mesh(trimGeo, trimMat);
      trimTop.position.set(-7, 0.82, -0.5);
      this._addToSceneGroup(0, trimTop);

      // ── Paper Fragments (6 sheets, scattered on desk) ────────
      var paperConfigs = [
        { x: -9.5, y: 1.05, z: 0.8, ry: -0.25, pw: 1.4, ph: 1.0 },
        { x: -8.2, y: 1.12, z: 1.8, ry:  0.15, pw: 1.2, ph: 0.9 },
        { x: -6.8, y: 1.08, z: 0.6, ry: -0.4,  pw: 1.5, ph: 1.1 },
        { x: -5.5, y: 1.15, z: 2.0, ry:  0.3,  pw: 1.1, ph: 0.85 },
        { x: -4.2, y: 1.03, z: 0.9, ry: -0.15, pw: 1.3, ph: 0.95 },
        { x: -9.0, y: 1.20, z: 2.3, ry:  0.45, pw: 0.9, ph: 0.7 }
      ];
      var self = this;
      paperConfigs.forEach(function (cfg, i) {
        // Paper sheet
        var sheetGeo = new THREE.PlaneGeometry(cfg.pw, cfg.ph);
        var sheetMat = new THREE.MeshStandardMaterial({
          color: 0xf0f4ff,
          emissive: accent,
          emissiveIntensity: 0.12,
          roughness: 0.95,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.88
        });
        var sheet = new THREE.Mesh(sheetGeo, sheetMat);
        sheet.position.set(cfg.x, cfg.y, cfg.z);
        sheet.rotation.y = cfg.ry;
        sheet.rotation.x = -0.05;
        self._addToSceneGroup(0, sheet);

        // Text lines on paper (3 lines per sheet)
        for (var j = 0; j < 3; j++) {
          var lw = cfg.pw * 0.65;
          var lGeo = new THREE.PlaneGeometry(lw, 0.035);
          var lMat = new THREE.MeshStandardMaterial({
            color: accent,
            emissive: accent,
            emissiveIntensity: 0.35,
            transparent: true,
            opacity: 0.55
          });
          var lMesh = new THREE.Mesh(lGeo, lMat);
          lMesh.position.set(
            cfg.x - 0.08,
            cfg.y + 0.22 - j * 0.2,
            cfg.z + 0.012
          );
          lMesh.rotation.y = cfg.ry;
          self._addToSceneGroup(0, lMesh);
        }
      });

      // ── Idea Core (cyan glow, above desk center) ─────────────
      // Inner core sphere
      var coreGeo = new THREE.SphereGeometry(0.28, 16, 16);
      var coreMat = createGlowMaterial(cyanGlow, 1.4);
      var core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(-7, 1.65, 1.5);
      this._addToSceneGroup(0, core);

      // Core outer glow ring
      var coreRingGeo = new THREE.TorusGeometry(0.42, 0.04, 8, 32);
      var coreRingMat = createGlowMaterial(cyanGlow, 0.9);
      var coreRing = new THREE.Mesh(coreRingGeo, coreRingMat);
      coreRing.position.set(-7, 1.65, 1.5);
      coreRing.rotation.x = Math.PI / 3;
      coreRing.rotation.y = Math.PI / 6;
      this._addToSceneGroup(0, coreRing);

      // Secondary glow ring
      var coreRing2Geo = new THREE.TorusGeometry(0.55, 0.025, 8, 32);
      var coreRing2Mat = createGlowMaterial(cyanGlow, 0.5);
      var coreRing2 = new THREE.Mesh(coreRing2Geo, coreRing2Mat);
      coreRing2.position.set(-7, 1.65, 1.5);
      coreRing2.rotation.x = Math.PI / 2;
      this._addToSceneGroup(0, coreRing2);

      // ── Fine connection lines (papers → core) ─────────────────
      paperConfigs.forEach(function (cfg, i) {
        createConnectionLine(0, cfg.x, cfg.y + 0.1, cfg.z, -7, 1.65, 1.5, cyanGlow, 0.3, self);
      });

      // ── Small floating idea particles around core ────────────
      for (var p = 0; p < 8; p++) {
        var angle = (p / 8) * Math.PI * 2;
        var pGeo = new THREE.SphereGeometry(0.04, 6, 6);
        var pMat = createGlowMaterial(cyanGlow, 0.7);
        var particle = new THREE.Mesh(pGeo, pMat);
        particle.position.set(
          -7 + Math.cos(angle) * 0.65,
          1.65 + (p % 3) * 0.12 - 0.12,
          1.5 + Math.sin(angle) * 0.65
        );
        this._addToSceneGroup(0, particle);
      }

      // ── Knowledge Wall (LOW-OPACITY silhouette, not blocking) ─
      var wallMat = new THREE.MeshStandardMaterial({
        color: 0x040810,
        emissive: accent,
        emissiveIntensity: 0.02,
        roughness: 1.0,
        transparent: true,
        opacity: 0.35,
        side: THREE.BackSide
      });
      // Left wall silhouette
      var lWallGeo = new THREE.BoxGeometry(0.25, 5.5, 9);
      var lWall = new THREE.Mesh(lWallGeo, wallMat);
      lWall.position.set(-10.5, 2.75, 1.5);
      this._addToSceneGroup(0, lWall);
      // Right wall silhouette
      var rWallGeo = new THREE.BoxGeometry(0.25, 5.5, 9);
      var rWall = new THREE.Mesh(rWallGeo, wallMat);
      rWall.position.set(-3.5, 2.75, 1.5);
      this._addToSceneGroup(0, rWall);
      // Back wall (very faint)
      var bWallGeo = new THREE.BoxGeometry(7.5, 5.5, 0.15);
      var bWall = new THREE.Mesh(bWallGeo, wallMat);
      bWall.position.set(-7, 2.75, -2.5);
      this._addToSceneGroup(0, bWall);

      // ── Per-scene lighting ────────────────────────────────────
      // Key light (from upper front-left)
      var keyLight = new THREE.DirectionalLight(accent, 0.7);
      keyLight.position.set(-10, 5, 4);
      this._addToSceneGroup(0, keyLight);

      // Fill light (from right)
      var fillLight = new THREE.DirectionalLight(0x1a2040, 0.3);
      fillLight.position.set(2, 3, 3);
      this._addToSceneGroup(0, fillLight);

      // Point light for core glow
      var coreLight = new THREE.PointLight(cyanGlow, 0.9, 12);
      coreLight.position.set(-7, 2.0, 1.5);
      this._addToSceneGroup(0, coreLight);

    };

    // ── Scene 2: Chat-to-Terminal Portal ─────────────────────────
    // CP-5D: Scene 02 — AI Beyond Chat (Docs / Browser / Terminal Glass Panels)
    ImmersiveApp.prototype._createBeyondChatSetpiece = function () {
      var scene = this.scenes[1];
      if (!scene) return;
      var accent = new THREE.Color(scene.accentColor);
      var self = this;

      // ── Left Panel: Docs (File folder icon) ───────────────────
      // Glass panel body
      var docsGeo = new THREE.BoxGeometry(3.0, 2.4, 0.08);
      var docsMat = createGlassMaterial(accent, 0.55);
      var docsPanel = new THREE.Mesh(docsGeo, docsMat);
      docsPanel.position.set(-4, 2.0, 0);
      this._addToSceneGroup(1, docsPanel);

      // Top header bar (darker glass)
      var docsHeaderGeo = new THREE.BoxGeometry(3.0, 0.35, 0.04);
      var docsHeaderMat = createDarkMetalMaterial(accent, 0.1);
      var docsHeader = new THREE.Mesh(docsHeaderGeo, docsHeaderMat);
      docsHeader.position.set(-4, 3.2, 0.05);
      this._addToSceneGroup(1, docsHeader);

      // Docs icon (simplified folder shape)
      var folderGeo = new THREE.BoxGeometry(0.5, 0.35, 0.05);
      var folderMat = createGlowMaterial(accent, 0.7);
      var folder = new THREE.Mesh(folderGeo, folderMat);
      folder.position.set(-4.6, 3.2, 0.07);
      this._addToSceneGroup(1, folder);

      // Docs title text line
      for (var d = 0; d < 4; d++) {
        var dLineGeo = new THREE.PlaneGeometry(2.2, 0.06);
        var dLineMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.4,
          transparent: true, opacity: 0.5 + d * 0.05
        });
        var dLine = new THREE.Mesh(dLineGeo, dLineMat);
        dLine.position.set(-4, 2.7 - d * 0.38, 0.05);
        this._addToSceneGroup(1, dLine);
      }

      // ── Center Panel: Terminal ────────────────────────────────
      var termGeo = new THREE.BoxGeometry(3.2, 2.6, 0.08);
      var termMat = createGlassMaterial(accent, 0.6);
      var termPanel = new THREE.Mesh(termGeo, termMat);
      termPanel.position.set(0, 2.0, 0);
      this._addToSceneGroup(1, termPanel);

      // Terminal header bar
      var termHeaderGeo = new THREE.BoxGeometry(3.2, 0.35, 0.04);
      var termHeaderMat = createDarkMetalMaterial(accent, 0.12);
      var termHeader = new THREE.Mesh(termHeaderGeo, termHeaderMat);
      termHeader.position.set(0, 3.25, 0.05);
      this._addToSceneGroup(1, termHeader);

      // Terminal icon (cursor block)
      var cursorGeo = new THREE.BoxGeometry(0.18, 0.22, 0.04);
      var cursorMat = createGlowMaterial(accent, 1.0);
      var cursor = new THREE.Mesh(cursorGeo, cursorMat);
      cursor.position.set(-0.55, 3.25, 0.07);
      this._addToSceneGroup(1, cursor);

      // Terminal text lines (5 lines, varying opacity)
      for (var t = 0; t < 5; t++) {
        var tLineGeo = new THREE.PlaneGeometry(2.3, 0.08);
        var tLineMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.55,
          transparent: true, opacity: 0.6 + (t % 2) * 0.15
        });
        var tLine = new THREE.Mesh(tLineGeo, tLineMat);
        tLine.position.set(0, 2.75 - t * 0.36, 0.05);
        this._addToSceneGroup(1, tLine);
      }

      // Blinking cursor glow (emissive dot)
      var blinkGeo = new THREE.SphereGeometry(0.06, 6, 6);
      var blinkMat = createGlowMaterial(accent, 1.2);
      var blink = new THREE.Mesh(blinkGeo, blinkMat);
      blink.position.set(0.6, 1.3, 0.05);
      this._addToSceneGroup(1, blink);

      // ── Right Panel: Browser ───────────────────────────────────
      var browserGeo = new THREE.BoxGeometry(3.0, 2.4, 0.08);
      var browserMat = createGlassMaterial(accent, 0.55);
      var browserPanel = new THREE.Mesh(browserGeo, browserMat);
      browserPanel.position.set(4, 2.0, 0);
      this._addToSceneGroup(1, browserPanel);

      // Browser header bar
      var browserHeaderGeo = new THREE.BoxGeometry(3.0, 0.35, 0.04);
      var browserHeaderMat = createDarkMetalMaterial(accent, 0.1);
      var browserHeader = new THREE.Mesh(browserHeaderGeo, browserHeaderMat);
      browserHeader.position.set(4, 3.2, 0.05);
      this._addToSceneGroup(1, browserHeader);

      // Browser icon (globe shape)
      var globeGeo = new THREE.SphereGeometry(0.18, 8, 8);
      var globeMat = createGlowMaterial(accent, 0.7);
      var globe = new THREE.Mesh(globeGeo, globeMat);
      globe.position.set(3.5, 3.2, 0.07);
      this._addToSceneGroup(1, globe);

      // Address bar
      var addrGeo = new THREE.PlaneGeometry(2.2, 0.12);
      var addrMat = new THREE.MeshStandardMaterial({
        color: 0x1a2540, emissive: accent, emissiveIntensity: 0.25,
        transparent: true, opacity: 0.75
      });
      var addrBar = new THREE.Mesh(addrGeo, addrMat);
      addrBar.position.set(4, 3.0, 0.05);
      this._addToSceneGroup(1, addrBar);

      // Browser content blocks (3 blocks)
      for (var b = 0; b < 3; b++) {
        var bGeo = new THREE.PlaneGeometry(2.2, 0.38);
        var bMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.18,
          transparent: true, opacity: 0.65
        });
        var bBlock = new THREE.Mesh(bGeo, bMat);
        bBlock.position.set(4, 2.5 - b * 0.55, 0.05);
        this._addToSceneGroup(1, bBlock);
      }

      // ── Workflow Ribbon (flowing between panels) ──────────────
      // Left → Center ribbon
      var ribbon1Points = [
        new THREE.Vector3(-2.5, 1.5, 0.2),
        new THREE.Vector3(-2.0, 1.5, 0.2),
        new THREE.Vector3(-1.5, 1.5, 0.2),
        new THREE.Vector3(-1.0, 1.5, 0.2)
      ];
      var ribbon1Curve = new THREE.CatmullRomCurve3(ribbon1Points);
      var ribbon1Geo = new THREE.TubeGeometry(ribbon1Curve, 20, 0.04, 6, false);
      var ribbon1Mat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.6,
        transparent: true, opacity: 0.55
      });
      var ribbon1 = new THREE.Mesh(ribbon1Geo, ribbon1Mat);
      this._addToSceneGroup(1, ribbon1);

      // Center → Right ribbon
      var ribbon2Points = [
        new THREE.Vector3(1.6, 1.5, 0.2),
        new THREE.Vector3(2.0, 1.5, 0.2),
        new THREE.Vector3(2.5, 1.5, 0.2),
        new THREE.Vector3(3.0, 1.5, 0.2)
      ];
      var ribbon2Curve = new THREE.CatmullRomCurve3(ribbon2Points);
      var ribbon2Geo = new THREE.TubeGeometry(ribbon2Curve, 20, 0.04, 6, false);
      var ribbon2Mat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.6,
        transparent: true, opacity: 0.55
      });
      var ribbon2 = new THREE.Mesh(ribbon2Geo, ribbon2Mat);
      this._addToSceneGroup(1, ribbon2);

      // Flow arrows (small cones on ribbons)
      var arrowPositions = [
        { x: -1.8, y: 1.5, z: 0.2 },
        { x: -1.2, y: 1.5, z: 0.2 },
        { x:  2.2, y: 1.5, z: 0.2 },
        { x:  2.8, y: 1.5, z: 0.2 }
      ];
      arrowPositions.forEach(function (pos) {
        var aGeo = new THREE.ConeGeometry(0.08, 0.2, 4);
        var aMat = createGlowMaterial(accent, 0.8);
        var arrow = new THREE.Mesh(aGeo, aMat);
        arrow.position.set(pos.x, pos.y, pos.z);
        arrow.rotation.z = -Math.PI / 2;
        self._addToSceneGroup(1, arrow);
      });

      // ── Per-scene lighting ─────────────────────────────────────
      var keyLight = new THREE.DirectionalLight(accent, 0.6);
      keyLight.position.set(-5, 6, 4);
      this._addToSceneGroup(1, keyLight);

      var fillLight = new THREE.DirectionalLight(0x20183a, 0.3);
      fillLight.position.set(5, 3, 3);
      this._addToSceneGroup(1, fillLight);

      var pointLight = new THREE.PointLight(accent, 0.7, 18);
      pointLight.position.set(0, 4, 3);
      this._addToSceneGroup(1, pointLight);

    };

    // ── Scene 3: Artifact Exhibition ───────────────────────────
    // CP-5D: Scene 03 — Projects Become Artifacts (Gallery + Production Line)
    ImmersiveApp.prototype._createArtifactExhibitionSetpiece = function () {
      var scene = this.scenes[2];
      if (!scene) return;
      var accent = new THREE.Color(scene.accentColor);
      var self = this;

      // ── Gallery Floor (dark, reflective feel) ─────────────────
      var floorGeo = new THREE.PlaneGeometry(16, 6);
      var floorMat = new THREE.MeshStandardMaterial({
        color: 0x0a1020, emissive: accent, emissiveIntensity: 0.04,
        roughness: 0.7, metalness: 0.4
      });
      var floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, 0.01, 0);
      this._addToSceneGroup(2, floor);

      // ── Display Plinths (5 plinths with varying heights) ────────
      var plinthConfigs = [
        { x: -5.5, h: 1.2, z: -1 },
        { x: -3.0, h: 1.8, z: 0 },
        { x: -0.5, h: 1.4, z: -1 },
        { x:  2.0, h: 2.0, z: 0 },
        { x:  4.5, h: 1.6, z: -1 }
      ];

      plinthConfigs.forEach(function (cfg, i) {
        // Plinth base
        var pGeo = new THREE.BoxGeometry(1.1, cfg.h, 0.8);
        var pMat = createDarkMetalMaterial(accent, 0.06);
        var plinth = new THREE.Mesh(pGeo, pMat);
        plinth.position.set(cfg.x, cfg.h / 2, cfg.z);
        plinth.castShadow = true;
        self._addToSceneGroup(2, plinth);

        // Base glow strip (bottom light)
        var stripGeo = new THREE.BoxGeometry(1.1, 0.04, 0.04);
        var stripMat = createGlowMaterial(accent, 0.5);
        var strip = new THREE.Mesh(stripGeo, stripMat);
        strip.position.set(cfg.x, 0.02, cfg.z + 0.38);
        self._addToSceneGroup(2, strip);

        // Artifact card on plinth (tilted slightly)
        var cardW = 0.9, cardH = 0.7;
        var cardGeo = new THREE.BoxGeometry(cardW, cardH, 0.06);
        var cardMat = new THREE.MeshStandardMaterial({
          color: 0x0d1f35, emissive: accent, emissiveIntensity: 0.25,
          roughness: 0.5, metalness: 0.5
        });
        var card = new THREE.Mesh(cardGeo, cardMat);
        card.position.set(cfg.x, cfg.h + cardH / 2 + 0.05, cfg.z);
        card.rotation.y = -0.15 + i * 0.08;
        card.rotation.x = -0.08;
        self._addToSceneGroup(2, card);

        // Card frame glow
        var frameGeo = new THREE.BoxGeometry(cardW + 0.06, cardH + 0.06, 0.03);
        var frameMat = createGlowMaterial(accent, 0.4);
        var frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(cfg.x, cfg.h + cardH / 2 + 0.05, cfg.z - 0.02);
        frame.rotation.y = card.rotation.y;
        self._addToSceneGroup(2, frame);

        // Card content lines (2 lines)
        for (var j = 0; j < 2; j++) {
          var clGeo = new THREE.PlaneGeometry(cardW * 0.7, 0.055);
          var clMat = new THREE.MeshStandardMaterial({
            color: accent, emissive: accent, emissiveIntensity: 0.45,
            transparent: true, opacity: 0.6
          });
          var clMesh = new THREE.Mesh(clGeo, clMat);
          clMesh.position.set(
            cfg.x - 0.05,
            cfg.h + cardH / 2 + 0.15 - j * 0.22,
            cfg.z + 0.04
          );
          clMesh.rotation.y = card.rotation.y;
          self._addToSceneGroup(2, clMesh);
        }

        // Project stack tag (small marker above card)
        var tagGeo = new THREE.BoxGeometry(0.35, 0.12, 0.04);
        var tagMat = createGlowMaterial(accent, 0.7);
        var tag = new THREE.Mesh(tagGeo, tagMat);
        tag.position.set(cfg.x + 0.25, cfg.h + cardH + 0.2, cfg.z);
        self._addToSceneGroup(2, tag);
      });

      // ── Archive Wall (background — low profile, not blocking) ──
      var wallMat = new THREE.MeshStandardMaterial({
        color: 0x060e1a, emissive: accent, emissiveIntensity: 0.03,
        roughness: 0.95, transparent: true, opacity: 0.4
      });
      var bgWallGeo = new THREE.BoxGeometry(14, 5, 0.12);
      var bgWall = new THREE.Mesh(bgWallGeo, wallMat);
      bgWall.position.set(-0.5, 2.5, -3.5);
      this._addToSceneGroup(2, bgWall);

      // Archive shelves (faint outlines on wall)
      for (var s = 0; s < 3; s++) {
        var shelfLineGeo = new THREE.BoxGeometry(12, 0.04, 0.04);
        var shelfLineMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.2,
          transparent: true, opacity: 0.25
        });
        var shelfLine = new THREE.Mesh(shelfLineGeo, shelfLineMat);
        shelfLine.position.set(-0.5, 1.5 + s * 1.2, -3.45);
        this._addToSceneGroup(2, shelfLine);
      }

      // ── Production Line Arrow Strip (foreground, flowing) ──────
      var stripPoints = [
        new THREE.Vector3(-6, 0.25, 2),
        new THREE.Vector3(-3, 0.25, 2),
        new THREE.Vector3(0, 0.25, 2),
        new THREE.Vector3(3, 0.25, 2),
        new THREE.Vector3(5.5, 0.25, 2)
      ];
      var stripCurve = new THREE.CatmullRomCurve3(stripPoints);
      var stripGeo = new THREE.TubeGeometry(stripCurve, 30, 0.05, 6, false);
      var stripMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.45,
        transparent: true, opacity: 0.5
      });
      var stripLine = new THREE.Mesh(stripGeo, stripMat);
      this._addToSceneGroup(2, stripLine);

      // Directional arrows on production line
      for (var a = 0; a < 4; a++) {
        var aGeo = new THREE.ConeGeometry(0.1, 0.25, 4);
        var aMat = createGlowMaterial(accent, 0.7);
        var arrow = new THREE.Mesh(aGeo, aMat);
        arrow.position.set(-4.5 + a * 3.0, 0.35, 2);
        arrow.rotation.z = -Math.PI / 2;
        self._addToSceneGroup(2, arrow);
      }

      // ── Per-scene lighting ─────────────────────────────────────
      var keyLight = new THREE.DirectionalLight(accent, 0.65);
      keyLight.position.set(0, 7, 5);
      this._addToSceneGroup(2, keyLight);

      var accentLight = new THREE.PointLight(accent, 0.7, 20);
      accentLight.position.set(0, 5, 2);
      this._addToSceneGroup(2, accentLight);

    };

    // ── Scene 4: Agent Orchestration Core ────────────────────────
    // CP-5D: Scene 04 — Agents Join the Workflow (Agent Network)
    ImmersiveApp.prototype._createAgentCoreSetpiece = function () {
      var scene = this.scenes[3];
      if (!scene) return;
      var accent = new THREE.Color(scene.accentColor);
      var self = this;

      // Hub position
      var hubX = 0, hubY = 2.5, hubZ = -15;

      // ── Central Agent Hub (elegant, not huge) ──────────────────
      // Outer glow ring
      var hubRingGeo = new THREE.TorusGeometry(0.6, 0.06, 8, 32);
      var hubRingMat = createGlowMaterial(accent, 0.9);
      var hubRing = new THREE.Mesh(hubRingGeo, hubRingMat);
      hubRing.position.set(hubX, hubY, hubZ);
      hubRing.rotation.x = Math.PI / 2;
      this._addToSceneGroup(3, hubRing);

      // Inner core sphere
      var hubCoreGeo = new THREE.SphereGeometry(0.3, 16, 16);
      var hubCoreMat = createGlowMaterial(accent, 1.3);
      var hubCore = new THREE.Mesh(hubCoreGeo, hubCoreMat);
      hubCore.position.set(hubX, hubY, hubZ);
      this._addToSceneGroup(3, hubCore);

      // Hub vertical beam
      var hubBeamGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6);
      var hubBeamMat = createGlowMaterial(accent, 0.5);
      var hubBeam = new THREE.Mesh(hubBeamGeo, hubBeamMat);
      hubBeam.position.set(hubX, hubY + 0.8, hubZ);
      this._addToSceneGroup(3, hubBeam);

      // ── 4 Agent Nodes (OpenClaw / Hermes / Codex / Phase Report) ─
      var agentNodes = [
        { name: 'OpenClaw', x: -5.5, y: 2.5, z: -1 },
        { name: 'Hermes',   x:  5.5, y: 2.5, z: -1 },
        { name: 'Codex',    x: -3.5, y: 4.0, z:  2 },
        { name: 'Report',   x:  3.5, y: 4.0, z:  2 }
      ];

      agentNodes.forEach(function (agent, i) {
        // Agent node sphere
        var nodeGeo = new THREE.SphereGeometry(0.42, 14, 14);
        var nodeMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.6,
          roughness: 0.25, metalness: 0.55
        });
        var nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.set(agent.x, agent.y, agent.z);
        self._addToSceneGroup(3, nodeMesh);

        // Node inner glow
        var nodeGlowGeo = new THREE.SphereGeometry(0.22, 10, 10);
        var nodeGlowMat = createGlowMaterial(accent, 0.9);
        var nodeGlow = new THREE.Mesh(nodeGlowGeo, nodeGlowMat);
        nodeGlow.position.set(agent.x, agent.y, agent.z);
        self._addToSceneGroup(3, nodeGlow);

        // Glowing connection line from node to hub
        createConnectionLine(3, agent.x, agent.y, agent.z, hubX, hubY, hubZ, accent, 0.35, self);

        // Pulsing dot on the connection line
        createPulsingDot(3, agent.x, agent.y, agent.z, hubX, hubY, hubZ, accent, self);

        // Small status badge below node
        var badgeGeo = new THREE.BoxGeometry(0.9, 0.14, 0.05);
        var badgeMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.7,
          roughness: 0.3, metalness: 0.5
        });
        var badge = new THREE.Mesh(badgeGeo, badgeMat);
        badge.position.set(agent.x, agent.y - 0.75, agent.z);
        self._addToSceneGroup(3, badge);

        // Status indicator dot (top of node)
        var dotGeo = new THREE.SphereGeometry(0.08, 6, 6);
        var dotMat = createGlowMaterial(accent, 1.0);
        var dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(agent.x, agent.y + 0.55, agent.z);
        self._addToSceneGroup(3, dot);
      });

      // ── Signal Rings (orbit around hub) ───────────────────────
      for (var r = 0; r < 3; r++) {
        var ringGeo = new THREE.TorusGeometry(1.6 + r * 0.9, 0.03, 6, 48);
        var ringMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.4 - r * 0.1,
          transparent: true, opacity: 0.5 - r * 0.12
        });
        var ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(hubX, hubY, hubZ);
        ring.rotation.x = Math.PI / 2;
        this._addToSceneGroup(3, ring);
      }

      // ── Background constellation (faint star field) ───────────
      var starPositions = [
        { x: -7, y: 5.5, z: -8 },
        { x:  7, y: 4.5, z: -10 },
        { x: -4, y: 6.5, z: -12 },
        { x:  5, y: 3.5, z: -8 },
        { x:  0, y: 7.0, z: -9 }
      ];
      starPositions.forEach(function (star) {
        var starGeo = new THREE.SphereGeometry(0.06, 5, 5);
        var starMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.4,
          transparent: true, opacity: 0.5
        });
        var starMesh = new THREE.Mesh(starGeo, starMat);
        starMesh.position.set(star.x, star.y, star.z);
        self._addToSceneGroup(3, starMesh);

        // Faint line to nearest star
        var linePoints = [
          new THREE.Vector3(star.x, star.y, star.z),
          new THREE.Vector3(star.x * 0.5, star.y * 0.8, star.z + 3)
        ];
        var lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        var lineMat = new THREE.LineBasicMaterial({
          color: accent, transparent: true, opacity: 0.12
        });
        var line = new THREE.Line(lineGeo, lineMat);
        self._addToSceneGroup(3, line);
      });

      // ── Per-scene lighting ─────────────────────────────────────
      var keyLight = new THREE.DirectionalLight(accent, 0.7);
      keyLight.position.set(0, 8, 3);
      this._addToSceneGroup(3, keyLight);

      var hubLight = new THREE.PointLight(accent, 1.0, 22);
      hubLight.position.set(hubX, hubY + 1, hubZ);
      this._addToSceneGroup(3, hubLight);

    };

    // ── Scene 5: Control Tower ────────────────────────────────────
    // CP-5D: Scene 05 — Control Tower (Multi-part Tower + Radar + Signal)
    ImmersiveApp.prototype._createControlTowerSetpiece = function () {
      var scene = this.scenes[4];
      if (!scene) return;
      var accent = new THREE.Color(scene.accentColor);
      var self = this;

      var towerZ = -20;
      var towerBaseY = 0;

      // ── Tower Base (octagonal platform) ────────────────────────
      var baseGeo = new THREE.CylinderGeometry(1.4, 1.8, 0.5, 8);
      var baseMat = createDarkMetalMaterial(accent, 0.08);
      var towerBase = new THREE.Mesh(baseGeo, baseMat);
      towerBase.position.set(0, 0.25, towerZ);
      towerBase.castShadow = true;
      this._addToSceneGroup(4, towerBase);

      // Base glow ring
      var baseRingGeo = new THREE.TorusGeometry(1.4, 0.06, 6, 32);
      var baseRingMat = createGlowMaterial(accent, 0.5);
      var baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
      baseRing.position.set(0, 0.5, towerZ);
      baseRing.rotation.x = Math.PI / 2;
      this._addToSceneGroup(4, baseRing);

      // ── Tower Core (vertical column) ────────────────────────────
      var coreGeo = new THREE.CylinderGeometry(0.35, 0.5, 5.5, 8);
      var coreMat = createDarkMetalMaterial(accent, 0.1);
      var towerCore = new THREE.Mesh(coreGeo, coreMat);
      towerCore.position.set(0, 3.25, towerZ);
      this._addToSceneGroup(4, towerCore);

      // Core emissive stripe
      var stripeGeo = new THREE.BoxGeometry(0.06, 5.5, 0.06);
      var stripeMat = createGlowMaterial(accent, 0.5);
      var stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(0.35, 3.25, towerZ);
      this._addToSceneGroup(4, stripe);

      // ── Tower Beacon (top signal emitter) ─────────────────────
      var beaconGeo = new THREE.CylinderGeometry(0.15, 0.25, 0.8, 8);
      var beaconMat = createGlowMaterial(accent, 0.8);
      var beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(0, 6.3, towerZ);
      this._addToSceneGroup(4, beacon);

      // Beacon top sphere (signal source)
      var signalGeo = new THREE.SphereGeometry(0.18, 12, 12);
      var signalMat = createGlowMaterial(accent, 1.5);
      var signal = new THREE.Mesh(signalGeo, signalMat);
      signal.position.set(0, 6.9, towerZ);
      this._addToSceneGroup(4, signal);

      // Signal beam (vertical ray above beacon)
      var beamGeo = new THREE.CylinderGeometry(0.04, 0.12, 3.5, 6);
      var beamMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.4,
        transparent: true, opacity: 0.3
      });
      var beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 8.5, towerZ);
      this._addToSceneGroup(4, beam);

      // ── 3 Radar Rings (horizontal, at different heights) ───────
      var radarHeights = [1.2, 2.5, 4.0];
      radarHeights.forEach(function (ry, i) {
        createRadarRing(4, 2.2 + i * 1.2, ry, accent, self);
      });

      // ── 6 System Nodes (surrounding the tower) ─────────────────
      var systemNodes = [
        { x: -4.5, y: 2.5, z: towerZ - 2 },
        { x:  4.5, y: 2.5, z: towerZ - 2 },
        { x: -3.5, y: 4.5, z: towerZ + 1 },
        { x:  3.5, y: 4.5, z: towerZ + 1 },
        { x: -2.5, y: 6.0, z: towerZ - 1 },
        { x:  2.5, y: 6.0, z: towerZ - 1 }
      ];
      systemNodes.forEach(function (node) {
        // Node sphere
        var snGeo = new THREE.SphereGeometry(0.2, 10, 10);
        var snMat = createGlowMaterial(accent, 0.75);
        var snMesh = new THREE.Mesh(snGeo, snMat);
        snMesh.position.set(node.x, node.y, node.z);
        self._addToSceneGroup(4, snMesh);

        // Small status ring on node
        var snRingGeo = new THREE.TorusGeometry(0.28, 0.025, 6, 20);
        var snRingMat = createGlowMaterial(accent, 0.4);
        var snRing = new THREE.Mesh(snRingGeo, snRingMat);
        snRing.position.set(node.x, node.y, node.z);
        self._addToSceneGroup(4, snRing);

        // Connection line to tower beacon
        createConnectionLine(4, node.x, node.y, node.z, 0, 6.9, towerZ, accent, 0.2, self);
      });

      // ── Background Constellation Lines ──────────────────────────
      var bgStars = [
        { x: -8, y: 7, z: towerZ - 8 },
        { x:  8, y: 6, z: towerZ - 8 },
        { x: -6, y: 8, z: towerZ - 5 },
        { x:  6, y: 5, z: towerZ - 6 },
        { x:  0, y: 9, z: towerZ - 10 },
        { x: -4, y: 5, z: towerZ - 3 },
        { x:  4, y: 7, z: towerZ - 4 }
      ];
      bgStars.forEach(function (star, i) {
        var starGeo = new THREE.SphereGeometry(0.07, 6, 6);
        var starMat = new THREE.MeshStandardMaterial({
          color: accent, emissive: accent, emissiveIntensity: 0.35,
          transparent: true, opacity: 0.4
        });
        var starMesh = new THREE.Mesh(starGeo, starMat);
        starMesh.position.set(star.x, star.y, star.z);
        self._addToSceneGroup(4, starMesh);

        // Faint connection to beacon
        if (i % 2 === 0) {
          createConnectionLine(4, star.x, star.y, star.z, 0, 6.9, towerZ, accent, 0.08, self);
        }
      });

      // ── Per-scene lighting ─────────────────────────────────────
      var keyLight = new THREE.DirectionalLight(accent, 0.65);
      keyLight.position.set(-5, 10, 3);
      this._addToSceneGroup(4, keyLight);

      var beaconLight = new THREE.PointLight(accent, 1.2, 25);
      beaconLight.position.set(0, 7.5, towerZ);
      this._addToSceneGroup(4, beaconLight);

      var fillLight = new THREE.PointLight(0x1a1528, 0.4, 18);
      fillLight.position.set(5, 3, towerZ - 3);
      this._addToSceneGroup(4, fillLight);

    };

    // ── Scene 6: Archive Hall ────────────────────────────────────
    // CP-5D: Scene 06 — Artifact Archive (Deep Archive Hall)
    ImmersiveApp.prototype._createArchiveHallSetpiece = function () {
      var scene = this.scenes[5];
      if (!scene) return;
      var accent = new THREE.Color(scene.accentColor);
      var self = this;

      // ── Archive Back Wall (far depth, low opacity) ───────────────
      var wallGeo = new THREE.BoxGeometry(16, 8, 0.18);
      var wallMat = new THREE.MeshStandardMaterial({
        color: 0x040c18, emissive: accent, emissiveIntensity: 0.04,
        roughness: 0.98, transparent: true, opacity: 0.55
      });
      var wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set(0, 4, -25);
      this._addToSceneGroup(5, wall);

      // ── Side Shelves (left and right, with depth) ──────────────
      var shelfSides = [-1, 1]; // left = -1, right = 1
      shelfSides.forEach(function (side) {
        var sideX = side * 8;

        // Side wall
        var sideWallGeo = new THREE.BoxGeometry(0.18, 6, 8);
        var sideWallMat = new THREE.MeshStandardMaterial({
          color: 0x050e1a, emissive: accent, emissiveIntensity: 0.03,
          roughness: 0.95, transparent: true, opacity: 0.45
        });
        var sideWall = new THREE.Mesh(sideWallGeo, sideWallMat);
        sideWall.position.set(sideX, 3, -18);
        self._addToSceneGroup(5, sideWall);

        // 3 rows of shelves on each side
        for (var row = 0; row < 3; row++) {
          // Shelf board
          var shelfGeo = new THREE.BoxGeometry(3.5, 0.08, 0.6);
          var shelfMat = new THREE.MeshStandardMaterial({
            color: 0x0a1a2a, emissive: accent, emissiveIntensity: 0.12,
            roughness: 0.8
          });
          var shelf = new THREE.Mesh(shelfGeo, shelfMat);
          shelf.position.set(sideX, 1.5 + row * 1.5, -18);
          self._addToSceneGroup(5, shelf);

          // 4 archive blocks per shelf row
          for (var col = 0; col < 4; col++) {
            var bx = sideX + (col - 1.5) * 0.75;

            // Archive block
            var blockGeo = new THREE.BoxGeometry(0.55, 0.4, 0.35);
            var blockMat = new THREE.MeshStandardMaterial({
              color: 0x0d1f30, emissive: accent, emissiveIntensity: 0.18,
              roughness: 0.5, metalness: 0.4
            });
            var block = new THREE.Mesh(blockGeo, blockMat);
            block.position.set(bx, 1.9 + row * 1.5, -18);
            block.rotation.y = side * 0.1;
            self._addToSceneGroup(5, block);

            // Glowing edge on block (top)
            var edgeGeo = new THREE.BoxGeometry(0.55, 0.04, 0.35);
            var edgeMat = createGlowMaterial(accent, 0.4);
            var edge = new THREE.Mesh(edgeGeo, edgeMat);
            edge.position.set(bx, 2.1 + row * 1.5, -18);
            self._addToSceneGroup(5, edge);

            // Faint glow strip on shelf
            var stripGeo = new THREE.BoxGeometry(3.5, 0.03, 0.04);
            var stripMat = new THREE.MeshStandardMaterial({
              color: accent, emissive: accent, emissiveIntensity: 0.25,
              transparent: true, opacity: 0.4
            });
            var strip = new THREE.Mesh(stripGeo, stripMat);
            strip.position.set(sideX, 1.54 + row * 1.5, -17.7);
            self._addToSceneGroup(5, strip);
          }
        }
      });

      // ── Central Archive Gate / Passage ───────────────────────────
      // Arch frame (half-torus)
      var archGeo = new THREE.TorusGeometry(2.0, 0.12, 10, 32, Math.PI);
      var archMat = createGlowMaterial(accent, 0.6);
      var arch = new THREE.Mesh(archGeo, archMat);
      arch.position.set(0, 3.0, -10);
      arch.rotation.x = Math.PI;
      this._addToSceneGroup(5, arch);

      // Arch inner glow
      var archGlowGeo = new THREE.TorusGeometry(1.7, 0.06, 8, 32, Math.PI);
      var archGlowMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.3,
        transparent: true, opacity: 0.4
      });
      var archGlow = new THREE.Mesh(archGlowGeo, archGlowMat);
      archGlow.position.set(0, 3.0, -10);
      archGlow.rotation.x = Math.PI;
      this._addToSceneGroup(5, archGlow);

      // Arch pillars
      [-2.0, 2.0].forEach(function (x) {
        var pillarGeo = new THREE.BoxGeometry(0.18, 3.0, 0.18);
        var pillarMat = createDarkMetalMaterial(accent, 0.08);
        var pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(x, 1.5, -10);
        self._addToSceneGroup(5, pillar);

        // Pillar top glow
        var ptGeo = new THREE.BoxGeometry(0.18, 0.06, 0.18);
        var ptMat = createGlowMaterial(accent, 0.5);
        var pt = new THREE.Mesh(ptGeo, ptMat);
        pt.position.set(x, 3.0, -10);
        self._addToSceneGroup(5, pt);
      });

      // ── Archive Portal (deep background) ──────────────────────
      var portalGeo = new THREE.TorusGeometry(1.2, 0.1, 8, 32);
      var portalMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.35,
        transparent: true, opacity: 0.4
      });
      var portal = new THREE.Mesh(portalGeo, portalMat);
      portal.position.set(0, 4, -23);
      this._addToSceneGroup(5, portal);

      // Portal inner glow
      var portalCoreGeo = new THREE.SphereGeometry(0.8, 12, 12);
      var portalCoreMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.2,
        transparent: true, opacity: 0.2
      });
      var portalCore = new THREE.Mesh(portalCoreGeo, portalCoreMat);
      portalCore.position.set(0, 4, -23);
      this._addToSceneGroup(5, portalCore);

      // ── Floor Glow Strip (leading to arch) ─────────────────────
      var floorStripPoints = [
        new THREE.Vector3(0, 0.02, 0),
        new THREE.Vector3(0, 0.02, -5),
        new THREE.Vector3(0, 0.02, -10)
      ];
      var floorStripCurve = new THREE.CatmullRomCurve3(floorStripPoints);
      var floorStripGeo = new THREE.TubeGeometry(floorStripCurve, 20, 0.15, 6, false);
      var floorStripMat = new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.35,
        transparent: true, opacity: 0.4
      });
      var floorStrip = new THREE.Mesh(floorStripGeo, floorStripMat);
      this._addToSceneGroup(5, floorStrip);

      // ── Per-scene lighting ─────────────────────────────────────
      var keyLight = new THREE.DirectionalLight(accent, 0.6);
      keyLight.position.set(0, 8, 0);
      this._addToSceneGroup(5, keyLight);

      var archLight = new THREE.PointLight(accent, 0.8, 22);
      archLight.position.set(0, 4, -10);
      this._addToSceneGroup(5, archLight);

      var portalLight = new THREE.PointLight(accent, 0.5, 20);
      portalLight.position.set(0, 5, -22);
      this._addToSceneGroup(5, portalLight);

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