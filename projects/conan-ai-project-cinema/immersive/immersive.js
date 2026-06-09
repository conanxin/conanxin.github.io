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
      // Use esm.sh CDN — properly formatted, no Safari parse issues
      THREE = await import('https://esm.sh/three@0.169.0');
    } catch (e) {
      console.error('[Immersive] THREE load failed:', e);
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

      // Grid
      var gridHelper = new THREE.GridHelper(30, 30, 0x1a2040, 0x0d1428);
      this.scene.add(gridHelper);

      // Particles
      this._buildParticles();

      // Command desk (scene 1)
      this._buildCommandDesk();

      // Artifact cards (scene 2)
      this._buildArtifactCards();

      // Agent line (scene 3)
      this._buildAgentLine();

      // Camera init position
      var sceneData = this.scenes[this.currentIndex];
      if (sceneData) {
        this.baseCameraPos = new THREE.Vector3(
          sceneData.cameraPosition.x,
          sceneData.cameraPosition.y,
          sceneData.cameraPosition.z
        );
        this.camera.position.copy(this.baseCameraPos);
        this.camera.lookAt(this.baseCameraTarget);
      }
    };

    // ── Particles ────────────────────────────────────────────────
    ImmersiveApp.prototype._buildParticles = function () {
      var count = 200;
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
        opacity: 0.7,
        sizeAttenuation: true
      });

      this.particleSystem = new THREE.Points(geo, mat);
      this.scene.add(this.particleSystem);
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

    // ── Scene switch ──────────────────────────────────────────────
    ImmersiveApp.prototype._gotoScene = function (index, animate) {
      if (index < 0 || index >= this.scenes.length) return;
      this.currentIndex = index;
      var sceneData = this.scenes[index];

      this.baseCameraPos = new THREE.Vector3(
        sceneData.cameraPosition.x,
        sceneData.cameraPosition.y,
        sceneData.cameraPosition.z
      );

      if (animate && !this.prefersReducedMotion) {
        this._tweenCamera(this.baseCameraPos, this.baseCameraTarget);
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
    };

    // ── Camera tween ─────────────────────────────────────────────
    ImmersiveApp.prototype._tweenCamera = function (targetPos, targetLook) {
      var self = this;
      var startPos = this.camera.position.clone();
      var startTarget =
        this.camera.target ? this.camera.target.clone() : this.baseCameraTarget.clone();
      var duration = 800;
      var start = performance.now();

      function tick(now) {
        var t = Math.min((now - start) / duration, 1);
        var et = self._easeOutCubic(t);
        self.camera.position.lerpVectors(startPos, targetPos, et);
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
        this.baseCameraPos = new THREE.Vector3(
          sceneData.cameraPosition.x,
          sceneData.cameraPosition.y,
          sceneData.cameraPosition.z
        );
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

      var curPos = new THREE.Vector3(
        curScene.cameraPosition.x,
        curScene.cameraPosition.y,
        curScene.cameraPosition.z
      );
      var nextPos = new THREE.Vector3(
        nextScene.cameraPosition.x,
        nextScene.cameraPosition.y,
        nextScene.cameraPosition.z
      );
      var curTarget = new THREE.Vector3(
        curScene.cameraTarget.x,
        curScene.cameraTarget.y,
        curScene.cameraTarget.z
      );
      var nextTarget = new THREE.Vector3(
        nextScene.cameraTarget.x,
        nextScene.cameraTarget.y,
        nextScene.cameraTarget.z
      );

      this.cameraPathPos.lerpVectors(curPos, nextPos, t);
      this.cameraPathTarget.lerpVectors(curTarget, nextTarget, t);
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
    ImmersiveApp.prototype._animate = function () {
      var self = this;
      this.frameId = requestAnimationFrame(function () {
        self._animate();
      });
      if (this.isPaused) return;

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
    }

    document.getElementById('btnEnterSound')
      .addEventListener('click', function () { launch(true); });
    document.getElementById('btnEnterNoSound')
      .addEventListener('click', function () { launch(false); });

  })(); // end bootImmersive async IIFE

})(); // end module wrapper