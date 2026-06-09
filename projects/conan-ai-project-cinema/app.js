/**
 * app.js — CP-1D: Release Candidate Polish
 * Conan AI Project Cinema · Phase CP-1D
 * Features: search + constellation tooltip/click + all prior features
 */

(function () {
  'use strict';

  // ── Reduced motion check ──
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ══════════════════════════════════════════════════════════════
  // SCROLL PROGRESS BAR
  // ══════════════════════════════════════════════════════════════
  function initScrollProgress() {
    var progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    function update() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ══════════════════════════════════════════════════════════════
  // SECTION REVEAL (IntersectionObserver)
  // ══════════════════════════════════════════════════════════════
  function initSectionReveal() {
    var scenes = document.querySelectorAll('.scene');
    if (prefersReducedMotion) {
      scenes.forEach(function (s) { s.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    scenes.forEach(function (s) { observer.observe(s); });
  }

  // ══════════════════════════════════════════════════════════════
  // DATA LAYER
  // ══════════════════════════════════════════════════════════════
  var DATA = window.CP_ARTIFACTS;
  var hasData = DATA && Array.isArray(DATA.projects) && Array.isArray(DATA.artifacts);

  function statusClass(status) {
    switch (status) {
      case 'shipped':    return 'status-active';
      case 'active':     return 'status-active';
      case 'alpha':      return 'status-active';
      case 'published':  return 'status-active';
      case 'private':    return 'status-private';
      case 'concept':    return 'status-concept';
      default:           return 'status-done';
    }
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER PROJECT CARDS
  // ══════════════════════════════════════════════════════════════
  function renderProjects() {
    var container = document.getElementById('projectGrid');
    if (!container || !hasData) return;
    container.innerHTML = '';
    DATA.projects.forEach(function (proj) {
      var isExternal = proj.href && proj.href.startsWith('http');
      var card;
      if (proj.href) {
        card = document.createElement('a');
        card.href = proj.href;
        if (isExternal) {
          card.target = '_blank';
          card.rel = 'noopener noreferrer';
        }
      } else {
        card = document.createElement('div');
      }
      card.className = 'project-card' + (proj.visibility === 'internal' ? ' private-card' : '');
      card.setAttribute('data-desc', proj.description || '');

      var header = document.createElement('div');
      header.className = 'pc-header';

      var tagEl = document.createElement('span');
      tagEl.className = 'pc-tag';
      tagEl.textContent = proj.tag || proj.id;

      var statusEl = document.createElement('span');
      statusEl.className = 'pc-status ' + statusClass(proj.status);
      statusEl.textContent = proj.status || '';

      header.appendChild(tagEl);
      header.appendChild(statusEl);

      var title = document.createElement('div');
      title.className = 'pc-title';
      title.textContent = proj.name;

      var desc = document.createElement('div');
      desc.className = 'pc-desc';
      desc.textContent = proj.description || '';

      card.appendChild(header);
      card.appendChild(title);
      card.appendChild(desc);
      container.appendChild(card);
    });
  }

  // ══════════════════════════════════════════════════════════════
  // SEARCH STATE
  // ══════════════════════════════════════════════════════════════
  var gSearchQuery = '';
  var gActiveFilter = 'all';

  // ══════════════════════════════════════════════════════════════
  // RENDER ARTIFACT CARDS (with search + filter)
  // ══════════════════════════════════════════════════════════════
  function artifactMatches(art) {
    // Visibility filter
    if (gActiveFilter === 'Internal') {
      if (art.visibility !== 'internal') return false;
    } else {
      if (art.visibility === 'internal') return false;
      if (gActiveFilter !== 'all' && art.type !== gActiveFilter) return false;
    }
    // Search filter
    if (gSearchQuery) {
      var q = gSearchQuery.toLowerCase();
      var haystack = [
        art.title    || '',
        art.type     || '',
        art.source   || '',
        art.status   || '',
        art.description || '',
      ].join(' ').toLowerCase();
      if (haystack.indexOf(q) === -1) return false;
    }
    return true;
  }

  function renderArtifacts() {
    var container   = document.getElementById('artifactGrid');
    var emptyState  = document.getElementById('artifactEmptyState');
    if (!container || !hasData) return;

    container.innerHTML = '';
    var shown = 0;

    DATA.artifacts.forEach(function (art) {
      if (!artifactMatches(art)) return;
      shown++;

      var isExternal = art.href && art.href.startsWith('http');
      var link;

      if (art.href) {
        link = document.createElement('a');
        link.href = art.href;
        if (isExternal) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      } else {
        link = document.createElement('div');
        link.className = 'artifact-card artifact-card--no-link';
      }

      if (art.href) link.className = 'artifact-card';

      // Type badge
      var typeEl = document.createElement('div');
      typeEl.className = 'ac-type';
      var typeTag = document.createElement('span');
      typeTag.className = 'ac-type-tag';
      typeTag.textContent = art.type;
      typeEl.appendChild(typeTag);

      var title = document.createElement('div');
      title.className = 'ac-title';
      title.textContent = art.title;

      var source = document.createElement('div');
      source.className = 'ac-source';
      source.textContent = art.source;

      var desc = document.createElement('div');
      desc.className = 'ac-desc';
      desc.textContent = art.description || '';

      var status = document.createElement('div');
      status.className = 'ac-status';
      status.textContent = art.status || '';

      link.appendChild(typeEl);
      link.appendChild(title);
      link.appendChild(source);
      link.appendChild(desc);
      link.appendChild(status);
      container.appendChild(link);
    });

    if (emptyState) {
      emptyState.style.display = shown === 0 ? 'flex' : 'none';
    }
  }

  // ══════════════════════════════════════════════════════════════
  // ARTIFACT SEARCH INTERACTION
  // ══════════════════════════════════════════════════════════════
  function initSearch() {
    var searchInput = document.getElementById('artifactSearch');
    var clearBtn    = document.getElementById('searchClear');
    if (!searchInput) return;

    function updateUI() {
      gSearchQuery = searchInput.value.trim();
      if (clearBtn) clearBtn.style.display = gSearchQuery ? 'inline-block' : 'none';
      renderArtifacts();
    }

    searchInput.addEventListener('input', updateUI);

    // ESC to clear
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        updateUI();
        searchInput.blur();
      }
    });

    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        updateUI();
        searchInput.focus();
      });
    }
  }

  // ══════════════════════════════════════════════════════════════
  // ARTIFACT FILTER INTERACTION
  // ══════════════════════════════════════════════════════════════
  function initFilters() {
    var filterBar = document.getElementById('artifactFilters');
    if (!filterBar) return;

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-chip');
      if (!btn) return;

      filterBar.querySelectorAll('.filter-chip').forEach(function (c) {
        c.classList.remove('active');
      });
      btn.classList.add('active');

      gActiveFilter = btn.getAttribute('data-filter') || 'all';
      renderArtifacts();
    });
  }

  // ══════════════════════════════════════════════════════════════
  // CONSTELLATION TOOLTIP + CLICK
  // ══════════════════════════════════════════════════════════════
  function initConstellation() {
    var tooltip   = document.getElementById('constTooltip');
    var container = document.getElementById('constellation');
    if (!container || !hasData || !DATA.constellation) return;

    // Render SVG lines
    if (DATA.constellationLines && DATA.constellationLines.length > 0) {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'const-lines');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('preserveAspectRatio', 'none');
      DATA.constellationLines.forEach(function (line) {
        var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l.setAttribute('x1', line[0]);
        l.setAttribute('y1', line[1]);
        l.setAttribute('x2', line[2]);
        l.setAttribute('y2', line[3]);
        svg.appendChild(l);
      });
      container.appendChild(svg);
    }

    // Render nodes
    DATA.constellation.forEach(function (node) {
      var el = document.createElement('div');
      el.className = 'const-node';
      el.setAttribute('data-label', node.label || node.id);
      el.style.cssText = '--cx:' + (node.cx || '50%') + ';--cy:' + (node.cy || '50%');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', (node.label || node.id) + (node.href ? ' — click to open' : ' — internal'));
      el.setAttribute('data-href', node.href || '');
      el.setAttribute('data-description', node.description || '');
      el.setAttribute('data-status', node.status || '');
      container.appendChild(el);
    });

    // Tooltip elements
    var activeTooltip = null;

    function showTooltip(nodeEl, evt) {
      if (!tooltip) return;
      var href      = nodeEl.getAttribute('data-href');
      var desc      = nodeEl.getAttribute('data-description') || '';
      var label     = nodeEl.getAttribute('data-label') || '';
      var status    = nodeEl.getAttribute('data-status') || '';
      var isInternal = !href;

      var html = '<div class="ct-label">' + label + '</div>';
      if (status) html += '<div class="ct-status">' + status + '</div>';
      if (desc)   html += '<div class="ct-desc">' + desc + '</div>';
      if (href)   html += '<div class="ct-open">Open ↗</div>';
      else        html += '<div class="ct-internal">internal · no public link</div>';

      tooltip.innerHTML = html;
      tooltip.setAttribute('aria-hidden', 'false');

      // Position tooltip above the node
      var rect = nodeEl.getBoundingClientRect();
      var tw   = tooltip.offsetWidth  || 180;
      var th   = tooltip.offsetHeight || 80;
      var left = rect.left + rect.width / 2 - tw / 2;
      var top  = rect.top - th - 10;

      // Clamp to viewport
      left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
      if (top < 8) top = rect.bottom + 10;

      tooltip.style.left    = left + 'px';
      tooltip.style.top     = top  + 'px';
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
      activeTooltip = nodeEl;
    }

    function hideTooltip() {
      if (!tooltip) return;
      tooltip.style.opacity   = '0';
      tooltip.setAttribute('aria-hidden', 'true');
      activeTooltip = null;
    }

    function handleNodeInteraction(nodeEl, evt) {
      evt.preventDefault();
      var href = nodeEl.getAttribute('data-href');
      if (href) {
        var isExternal = href.startsWith('http');
        if (isExternal) {
          window.open(href, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = href;
        }
      }
    }

    container.addEventListener('mouseover', function (e) {
      var node = e.target.closest('.const-node');
      if (node) showTooltip(node, e);
    });
    container.addEventListener('mouseout', function (e) {
      var node = e.target.closest('.const-node');
      if (node && !node.contains(e.relatedTarget)) hideTooltip();
    });
    container.addEventListener('click', function (e) {
      var node = e.target.closest('.const-node');
      if (node) handleNodeInteraction(node, e);
    });
    container.addEventListener('keydown', function (e) {
      var node = e.target.closest('.const-node');
      if (node && (e.key === 'Enter' || e.key === ' ')) handleNodeInteraction(node, e);
    });

    // Click outside tooltip to dismiss
    document.addEventListener('click', function (e) {
      if (activeTooltip && !e.target.closest('.const-node') && !e.target.closest('.const-tooltip')) {
        hideTooltip();
      }
    });
  }

  // ══════════════════════════════════════════════════════════════
  // PROJECT CARD EXPAND TOOLTIP
  // ══════════════════════════════════════════════════════════════
  function initProjectExpand() {
    var tooltip = document.getElementById('expandTooltip');
    var hideT;
    document.addEventListener('click', function (e) {
      var card = e.target.closest('.project-card');
      if (card) {
        var desc = card.getAttribute('data-desc') || '';
        if (tooltip && desc) {
          tooltip.textContent = desc;
          tooltip.classList.add('show');
          clearTimeout(hideT);
          hideT = setTimeout(function () { tooltip.classList.remove('show'); }, 3000);
        }
      } else {
        if (tooltip) tooltip.classList.remove('show');
        clearTimeout(hideT);
      }
    });
  }

  // ══════════════════════════════════════════════════════════════
  // AGENT STRIP HORIZONTAL SCROLL
  // ══════════════════════════════════════════════════════════════
  function initAgentStripScroll() {
    var strip = document.getElementById('agentStrip');
    if (!strip) return;
    strip.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        strip.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }

  // ══════════════════════════════════════════════════════════════
  // SCENE NAVIGATOR
  // ══════════════════════════════════════════════════════════════
  function initSceneNavigator() {
    var nav = document.getElementById('sceneNav');
    var snProgress = document.getElementById('snProgress');
    if (!nav) return;

    var sceneIds = ['hero', 'scene-01', 'scene-02', 'scene-03', 'scene-04', 'scene-05', 'scene-06'];
    var navItems = nav.querySelectorAll('.sn-item');

    function setActive(sceneId) {
      navItems.forEach(function (item) {
        item.classList.remove('active');
        if (item.getAttribute('data-scene') === sceneId) {
          item.classList.add('active');
        }
      });
      // Also set document-level active scene for CSS selectors
      document.documentElement.dataset.activeScene = sceneId;
    }

    // Click navigation
    navItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var target = item.getAttribute('data-scene');
        var el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
      });
    });

    // Scroll-driven active state
    var scrollHandler = function () {
      var scrollY = window.scrollY;
      var wh = window.innerHeight;
      var docH = document.documentElement.scrollHeight;

      // Update progress bar
      if (snProgress) {
        snProgress.style.height = (docH > wh ? (scrollY / (docH - wh)) * 100 : 0) + '%';
      }

      // Find current scene
      var current = 'hero';
      sceneIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
          var rect = el.getBoundingClientRect();
          if (rect.top <= wh * 0.5) {
            current = id;
          }
        }
      });
      setActive(current);
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler();
  }

  // ══════════════════════════════════════════════════════════════
  // CINEMATIC DEPTH (CP-3C)
  // ══════════════════════════════════════════════════════════════
  function initCinematicDepth() {
    if (prefersReducedMotion) return;
    if (!('requestAnimationFrame' in window)) return;


    var ticking = false;

    var update = function () {
      var scrollY = window.scrollY;
      var docH = document.documentElement.scrollHeight;
      var wh = window.innerHeight;
      var progress = docH > wh ? scrollY / (docH - wh) : 0;
      document.documentElement.style.setProperty('--cinema-scroll-progress', progress.toFixed(4));
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    // Initialize on load
    update();
  }


  // ══════════════════════════════════════════════════════════════
  // FEATURED PROJECT STRIP (CP-3B)
  // ══════════════════════════════════════════════════════════════
  function renderFeaturedProjects() {
    var strip = document.getElementById('featuredStrip');
    if (!strip) return;
    var data = window.CP_ARTIFACTS && window.CP_ARTIFACTS.featured;
    if (!data || !data.length) return;


    strip.innerHTML = '';
    data.forEach(function (item) {
      var isExternal = item.href && item.href.indexOf('://') !== -1;
      var linkAttrs = isExternal
        ? ' target="_blank" rel="noopener noreferrer"'
        : '';
      var visualClass = 'fpv-' + (item.visual || 'default');


      var card = document.createElement('div');
      card.className = 'featured-card';
      card.setAttribute('data-visual', item.visual || 'default');


      card.innerHTML =
        '<div class="featured-card__visual ' + visualClass + '">' +
          '<span class="fpv-icon">' + getFeaturedIcon(item.visual) + '</span>' +
        '</div>' +
        '<div class="featured-card__body">' +
          '<div class="fp-label">' + escHtml(item.label) + '</div>' +
          '<div class="fp-title">' + escHtml(item.title) + '</div>' +
          '<div class="fp-desc">' + escHtml(item.description) + '</div>' +
          '<div class="fp-meta">' +
            '<span class="fp-status status-' + item.status + '">' + escHtml(item.status) + '</span>' +
          '</div>' +
          (item.href
            ? '<a href="' + escAttr(item.href) + '" class="fp-open"' + linkAttrs + '>Open →</a>'
            : '<span class="fp-open fp-open--none">no link</span>') +
        '</div>';


      strip.appendChild(card);
    });
  }

  function getFeaturedIcon(visual) {
    var icons = {
      cinema: '🎬',
      lens: '🔍',
      stage: '🎤',
      terminal: '⌨',
      cards: '📋',
      archive: '📁',
      files: '📎',
      default: '◆',
    };
    return icons[visual] || icons.default;
  }


  // ══════════════════════════════════════════════════════════════
  // ARTIFACT PREVIEW WALL (CP-3B)
  // ══════════════════════════════════════════════════════════════
  function renderPreviewWall() {
    var wall = document.getElementById('previewWall');
    if (!wall) return;
    var data = window.CP_ARTIFACTS && window.CP_ARTIFACTS.previews;
    if (!data || !data.length) return;


    wall.innerHTML = '';
    data.forEach(function (item) {
      var isExternal = item.href && item.href.indexOf('://') !== -1;
      var linkAttrs = isExternal
        ? ' target="_blank" rel="noopener noreferrer"'
        : '';
      var motifClass = 'motif-' + (item.motif || 'default');


      var card = document.createElement('div');
      card.className = 'preview-card ' + motifClass;


      card.innerHTML =
        '<div class="preview-card__chrome">' +
          '<span class="pcc-dot"></span>' +
          '<span class="pcc-dot"></span>' +
          '<span class="pcc-dot"></span>' +
          '<span class="pcc-url">' + escHtml(item.title) + '</span>' +
        '</div>' +
        '<div class="preview-card__screen">' +
          '<div class="pcs-motif pcs-motif--' + (item.motif || 'default') + '">' +
            '<span class="pcs-icon">' + getPreviewIcon(item.motif) + '</span>' +
          '</div>' +
          '<div class="pcs-type">' + escHtml(item.type) + '</div>' +
        '</div>' +
        '<div class="preview-card__body">' +
          '<div class="pct-title">' + escHtml(item.title) + '</div>' +
          '<div class="pct-desc">' + escHtml(item.description) + '</div>' +
          '<div class="pct-status status-' + item.status + '">' + escHtml(item.status) + '</div>' +
        '</div>' +
        (item.href
          ? '<a href="' + escAttr(item.href) + '" class="preview-card__cta"' + linkAttrs + '>View →</a>'
          : '<span class="preview-card__cta preview-card__cta--none">no link</span>');

      wall.appendChild(card);
    });
  }


  function getPreviewIcon(motif) {
    var icons = {
      cards: '📋',
      archive: '📁',
      lens: '🔍',
      terminal: '⌨',
      files: '📎',
      stage: '🎤',
      default: '◆',
    };
    return icons[motif] || icons.default;
  }

  // ══════════════════════════════════════════════════════════════
  // FALLBACK: reveal all scenes if JS fails
  // ══════════════════════════════════════════════════════════════
  function revealAllScenesFallback() {
    document.querySelectorAll('.scene').forEach(function (scene) {
      scene.classList.add('visible');
    });
  }

  // ══════════════════════════════════════════════════════════════
  // SAFE RUNNER: prevent any single init failure from blanking the page
  // ══════════════════════════════════════════════════════════════
  function safeRun(name, fn) {
    try {
      fn();
    } catch (err) {
      console.error('[Cinema] ' + name + ' failed:', err);
      revealAllScenesFallback();
    }
  }

  // ══════════════════════════════════════════════════════════════
  // BOOT — always reveal content first, then try to enhance
  // ══════════════════════════════════════════════════════════════

  // Step 0: Scene navigator (scroll-driven side nav)
  safeRun('scene navigator', initSceneNavigator);
  safeRun('cinematic depth', initCinematicDepth);

  // Step 1: Always reveal scenes immediately (fallback)
  safeRun('section reveal', function () {
    // If IntersectionObserver is unavailable, reveal all now
    if (!('IntersectionObserver' in window)) {
      revealAllScenesFallback();
      return;
    }
    initSectionReveal();
  });

  // Step 2: Try data-dependent renders
  if (hasData) {
    safeRun('featured projects render', renderFeaturedProjects);
    safeRun('preview wall render', renderPreviewWall);
    safeRun('project cards render', renderProjects);
    safeRun('artifact cards render', renderArtifacts);
    safeRun('constellation render', initConstellation);
  } else {
    console.warn('[Cinema] artifacts.js data layer not found');
    revealAllScenesFallback();
  }

  // Step 3: Try UI interactions (non-critical)
  safeRun('scroll progress', initScrollProgress);
  safeRun('artifact search', initSearch);
  safeRun('artifact filters', initFilters);
  safeRun('project expand', initProjectExpand);
  safeRun('agent strip scroll', initAgentStripScroll);

})();
