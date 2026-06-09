/**
 * app.js — CP-1C: Data-driven rendering + filter interaction
 * Conan AI Project Cinema · Phase CP-1C
 */

(function () {
  'use strict';

  // ── Reduced motion check ──
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // ── Scroll Progress Bar ──
  const progressBar = document.getElementById('scrollProgress');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ── Section Enter Animations (IntersectionObserver) ──
  if (!prefersReducedMotion) {
    const scenes = document.querySelectorAll('.scene');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    scenes.forEach((scene) => observer.observe(scene));
  } else {
    document.querySelectorAll('.scene').forEach((s) => s.classList.add('visible'));
  }

  // ── Data Layer ──
  const DATA = window.CP_ARTIFACTS;
  const hasData = DATA && Array.isArray(DATA.projects) && Array.isArray(DATA.artifacts);

  // ── Status class helper ──
  function statusClass(status) {
    switch (status) {
      case 'shipped': return 'status-active';
      case 'active':  return 'status-active';
      case 'alpha':   return 'status-active';
      case 'published': return 'status-active';
      case 'private': return 'status-private';
      case 'concept': return 'status-concept';
      default:        return 'status-done';
    }
  }

  // ── Render Project Cards ──
  function renderProjects() {
    const container = document.getElementById('projectGrid');
    if (!container || !hasData) return;

    container.innerHTML = '';
    DATA.projects.forEach(function (proj) {
      const isExternal = proj.href && proj.href.startsWith('http');
      const card = document.createElement(proj.href ? 'a' : 'div');
      if (proj.href) {
        card.href = proj.href;
        if (isExternal) {
          card.target = '_blank';
          card.rel = 'noopener noreferrer';
        }
      }
      card.className = 'project-card' + (proj.visibility === 'internal' ? ' private-card' : '');
      card.setAttribute('data-desc', proj.description);

      const tagEl = document.createElement('span');
      tagEl.className = 'pc-tag';
      tagEl.textContent = proj.tag;

      const statusEl = document.createElement('span');
      statusEl.className = 'pc-status ' + statusClass(proj.status);
      statusEl.textContent = proj.status;

      const header = document.createElement('div');
      header.className = 'pc-header';
      header.appendChild(tagEl);
      header.appendChild(statusEl);

      const title = document.createElement('div');
      title.className = 'pc-title';
      title.textContent = proj.name;

      const desc = document.createElement('div');
      desc.className = 'pc-desc';
      desc.textContent = proj.description;

      card.appendChild(header);
      card.appendChild(title);
      card.appendChild(desc);
      container.appendChild(card);
    });
  }

  // ── Render Artifact Cards ──
  function renderArtifacts(filter) {
    const container = document.getElementById('artifactGrid');
    const emptyState = document.getElementById('artifactEmptyState');
    if (!container || !hasData) return;

    container.innerHTML = '';
    let shown = 0;

    DATA.artifacts.forEach(function (art) {
      // Internal filter shows only internal/non-public visibility items
      if (filter === 'Internal') {
        if (art.visibility !== 'internal') return;
      } else {
        if (art.visibility === 'internal') return;
        if (filter !== 'all' && art.type !== filter) return;
      }

      shown++;
      const isExternal = art.href && art.href.startsWith('http');
      let link;
      if (art.href) {
        link = document.createElement('a');
        link.href = art.href;
        if (isExternal) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      } else {
        // No href — render as a non-link card (e.g. private/internal projects)
        link = document.createElement('div');
        link.className = 'artifact-card artifact-card--no-link';
      }
      link.classList.add('artifact-card');

      const typeEl = document.createElement('div');
      typeEl.className = 'ac-type';
      const typeTag = document.createElement('span');
      typeTag.className = 'ac-type-tag';
      typeTag.textContent = art.type;
      typeEl.appendChild(typeTag);

      const title = document.createElement('div');
      title.className = 'ac-title';
      title.textContent = art.title;

      const source = document.createElement('div');
      source.className = 'ac-source';
      source.textContent = art.source;

      const desc = document.createElement('div');
      desc.className = 'ac-desc';
      desc.textContent = art.description;

      const status = document.createElement('div');
      status.className = 'ac-status';
      status.textContent = art.status;

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

  // ── Render Constellation ──
  function renderConstellation() {
    const container = document.getElementById('constellation');
    if (!container || !hasData || !DATA.constellation) return;

    // SVG connection lines
    if (DATA.constellationLines && DATA.constellationLines.length > 0) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('const-lines');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('preserveAspectRatio', 'none');
      DATA.constellationLines.forEach(function (line) {
        const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l.setAttribute('x1', line[0]);
        l.setAttribute('y1', line[1]);
        l.setAttribute('x2', line[2]);
        l.setAttribute('y2', line[3]);
        svg.appendChild(l);
      });
      container.appendChild(svg);
    }

    // Nodes
    DATA.constellation.forEach(function (node) {
      const el = document.createElement('div');
      el.className = 'const-node';
      el.setAttribute('data-label', node.label);
      el.style.cssText = '--cx:' + node.cx + ';--cy:' + node.cy;
      container.appendChild(el);
    });
  }

  // ── Artifact Filter Interaction ──
  function setupFilters() {
    const filterBar = document.getElementById('artifactFilters');
    if (!filterBar) return;

    filterBar.addEventListener('click', function (e) {
      const btn = e.target.closest('.filter-chip');
      if (!btn) return;

      // Update active state
      filterBar.querySelectorAll('.filter-chip').forEach(function (chip) {
        chip.classList.remove('active');
      });
      btn.classList.add('active');

      // Render with new filter
      const filter = btn.getAttribute('data-filter');
      renderArtifacts(filter);
    });
  }

  // ── Project Card Expand ──
  function setupProjectExpand() {
    const tooltip = document.getElementById('expandTooltip');
    let hideTimeout;

    document.addEventListener('click', function (e) {
      const card = e.target.closest('.project-card');
      if (card) {
        const desc = card.getAttribute('data-desc') || 'No description available.';
        if (tooltip) {
          tooltip.textContent = desc;
          tooltip.classList.add('show');
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(function () {
            tooltip.classList.remove('show');
          }, 3000);
        }
      } else {
        if (tooltip) {
          tooltip.classList.remove('show');
          clearTimeout(hideTimeout);
        }
      }
    });
  }

  // ── Agent strip horizontal scroll with mouse wheel ──
  function setupAgentStripScroll() {
    const strip = document.getElementById('agentStrip');
    if (!strip) return;
    strip.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        strip.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }

  // ── Constellation node interaction ──
  function setupConstellationNodes() {
    document.querySelectorAll('.const-node').forEach(function (node) {
      node.addEventListener('click', function () {
        console.log('[Cinema] Constellation node:', node.getAttribute('data-label'));
      });
    });
  }

  // ── Boot ──
  if (hasData) {
    renderProjects();
    renderArtifacts('all');
    renderConstellation();
  } else {
    // Fallback: show a subtle notice that data layer is unavailable
    var grid = document.getElementById('projectGrid');
    if (grid) {
      grid.style.opacity = '0.4';
    }
    console.warn('[Cinema] artifacts.js data layer not found — rendering from static HTML');
  }

  setupFilters();
  setupProjectExpand();
  setupAgentStripScroll();
  setupConstellationNodes();

})();
