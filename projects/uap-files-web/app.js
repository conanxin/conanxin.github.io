// UAP Files Web — app.js v0.4
// Curated Exhibition Narrative: Reading Routes + Evidence Matrix
// navigateToRoute for 3 curated reading paths
// Minimal JS, no external dependencies

(function () {
  'use strict';

  // ── Category color map ────────────────────────────────
  var CAT_COLORS = {
    NASA:       { bg: 'rgba(79,195,247,0.12)',  color: '#4fc3f7', border: 'rgba(79,195,247,0.3)' },
    Military:   { bg: 'rgba(239, 83, 80,0.12)', color: '#ef5350', border: 'rgba(239, 83, 80,0.3)' },
    Historical: { bg: 'rgba(255,183,77,0.12)', color: '#ffb74d', border: 'rgba(255,183,77,0.3)' },
    FBI:        { bg: 'rgba(102,187,106,0.12)', color: '#66bb6a', border: 'rgba(102,187,106,0.3)' },
    Visual:     { bg: 'rgba(206,147,216,0.12)',color: '#ce93d8', border: 'rgba(206,147,216,0.3)' }
  };

  // ── Source status config (from data.js) ─────────────
  function getSourceStatusConfig(status) {
    return SOURCE_STATUS_CONFIG[status] || SOURCE_STATUS_CONFIG['needs_review'];
  }

  // ── Source type config ───────────────────────────────
  function getSourceTypeConfig(type) {
    return SOURCE_TYPE_CONFIG[type] || SOURCE_TYPE_CONFIG['secondary'];
  }

  // ── Escape HTML ────────────────────────────────────────
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Build evidence pip bar ─────────────────────────────
  function buildEvidenceBar(strength) {
    var html = '<div class="evidence-bar">';
    for (var i = 0; i < 6; i++) {
      var filled = i < strength;
      var high = i < strength && strength >= 5;
      html += '<div class="evidence-pip' + (filled ? ' filled' + (high ? ' high' : '') : '') + '"></div>';
    }
    html += '</div>';
    return html;
  }

  // ── Get category badge style ───────────────────────────
  function getBadgeStyle(categoryId) {
    var c = CAT_COLORS[categoryId] || { bg: 'rgba(255,255,255,0.06)', color: '#a0a0a0', border: 'rgba(255,255,255,0.1)' };
    return 'background:' + c.bg + ';color:' + c.color + ';border:1px solid ' + c.border;
  }

  // ── Get source status badge style ────────────────────
  function getSourceStatusStyle(status) {
    var c = getSourceStatusConfig(status);
    return 'background:' + c.bg + ';color:' + c.color + ';border:1px solid ' + c.border;
  }

  // ── Build source status badge ─────────────────────────
  function buildSourceStatusBadge(status) {
    var c = getSourceStatusConfig(status);
    return '<span class="src-status-badge src-status-' + status + '" style="' + getSourceStatusStyle(status) + '">' + c.label + '</span>';
  }

  // ── Build source type badge ────────────────────────────
  function buildSourceTypeBadge(type) {
    var c = getSourceTypeConfig(type);
    return '<span class="src-type-badge src-type-' + type + '">' + c.label + '</span>';
  }

  // ── Count helpers ──────────────────────────────────────
  function countByCategory(catId) {
    if (catId === 'all') return UAP_CASES.length;
    return UAP_CASES.filter(function (c) { return c.category === catId; }).length;
  }

  function countByStatus(statusId) {
    if (statusId === 'all') return UAP_CASES.length;
    return UAP_CASES.filter(function (c) { return c.source_status === statusId; }).length;
  }

  // ── Build expandable secondary sources (v0.3.1) ────────
  function buildSecondarySourcesExpandable(sources) {
    if (!sources || sources.length === 0) return '';
    var n = sources.length;
    var items = sources.map(function (s) {
      var typeLabel = SOURCE_TYPE_CONFIG[s.type] ? SOURCE_TYPE_CONFIG[s.type].label : s.type;
      var noteHtml = s.note ? '<p class="ss-note">' + escapeHtml(s.note) + '</p>' : '';
      var urlHtml = s.url
        ? '<a href="' + escapeHtml(s.url) + '" target="_blank" rel="noopener noreferrer" class="ss-url">↗ 链接</a>'
        : '';
      return (
        '<li class="ss-item">' +
          '<span class="ss-type">[' + escapeHtml(typeLabel) + ']</span> ' +
          '<span class="ss-title">' + escapeHtml(s.title) + '</span>' +
          noteHtml +
          urlHtml +
        '</li>'
      );
    }).join('');
    return (
      '<details class="sec-sources-expandable">' +
        '<summary class="sec-sources-toggle">展开补充来源 (' + n + ') ▼</summary>' +
        '<ul class="sec-sources-list">' + items + '</ul>' +
      '</details>'
    );
  }

  // ── Build source section ─────────────────────────────
  function buildSourceSection(c) {
    if (!c.source_url) return '';

    var typeBadge = buildSourceTypeBadge(c.source_type);
    var statusBadge = buildSourceStatusBadge(c.source_status);
    var caution = c.caution_note ? '<p class="src-caution">' + escapeHtml(c.caution_note) + '</p>' : '';
    var boundaryNote = c.evidence_level_note ? '<p class="src-boundary">' + escapeHtml(c.evidence_level_note) + '</p>' : '';

    // v0.3.1: expandable secondary sources (replaces simple count paragraph)
    var secSourcesHtml = buildSecondarySourcesExpandable(c.secondary_sources);

    return (
      '<div class="src-section">' +
        '<div class="src-row">' +
          '<span class="src-label">来源</span>' +
          '<span class="src-badges">' + typeBadge + ' ' + statusBadge + '</span>' +
        '</div>' +
        '<div class="src-title">' + escapeHtml(c.source_title) + '</div>' +
        '<div class="src-meta">' +
          '<span class="src-archive-label">' + escapeHtml(c.archive_label || '') + '</span>' +
        '</div>' +
        caution +
        boundaryNote +
        secSourcesHtml +
        '<div class="src-actions">' +
          '<a href="' + escapeHtml(c.source_url) + '" target="_blank" rel="noopener noreferrer" class="src-link-btn">查看来源 ↗</a>' +
        '</div>' +
      '</div>'
    );
  }

  // ── Build verification hint (needs_review cases only) ──
  function buildVerificationHint(c) {
    if (c.source_status !== 'needs_review' || !c.verification_hint) return '';
    var h = c.verification_hint;
    var terms = (h.query_terms || []).map(function (t) {
      return '<span class="vh-term">' + escapeHtml(t) + '</span>';
    }).join(' ');

    // v0.3.1: research_path steps
    var rpHtml = '';
    if (h.research_path && h.research_path.length > 0) {
      var rpItems = h.research_path.map(function (step) {
        var urlPart = step.url
          ? '<a href="' + escapeHtml(step.url) + '" target="_blank" rel="noopener noreferrer" class="vh-step-url"> ↗</a>'
          : '';
        return (
          '<li class="vh-step">' +
            '<span class="vh-step-label">' + escapeHtml(step.label) + '</span>' + urlPart +
            (step.note ? '<br><span class="vh-step-note">→ ' + escapeHtml(step.note) + '</span>' : '') +
          '</li>'
        );
      }).join('');
      rpHtml = '<ul class="vh-steps">' + rpItems + '</ul>';
    }

    return (
      '<div class="verif-hint">' +
        '<div class="vh-label">🔍 协助核实</div>' +
        '<div class="vh-row">' +
          '<span class="vh-tag">档案库: ' + escapeHtml(h.archive || '') + '</span>' +
        '</div>' +
        '<div class="vh-row">' +
          '<span class="vh-tag">目标: ' + escapeHtml(h.target || '') + '</span>' +
        '</div>' +
        '<div class="vh-row vh-terms">' +
          '<span class="vh-tag-label">查询关键词:</span>' +
          terms +
        '</div>' +
        rpHtml +
      '</div>'
    );
  }

  // ── Build deep dive section (v0.6.1) ──────────────────────
  function buildDeepDive(c) {
    if (!c.deep_dive) return '';
    var d = c.deep_dive;
    var rows = [
      { label: '📌 发生了什么', key: 'what_happened' },
      { label: '💡 为什么有意思', key: 'why_interesting' },
      { label: '📊 证据边界', key: 'evidence_boundary' },
      { label: '🔎 合理推测', key: 'likely_context' },
      { label: '📂 如何继续查', key: 'how_to_read' }
    ];
    var items = rows.map(function (row) {
      var val = d[row.key];
      if (!val) return '';
      return (
        '<div class="dd-row">' +
          '<div class="dd-label">' + row.label + '</div>' +
          '<div class="dd-value">' + escapeHtml(val) + '</div>' +
        '</div>'
      );
    }).join('');
    return (
      '<details class="deep-dive-expandable">' +
        '<summary class="deep-dive-toggle">📖 详细解读 ▼</summary>' +
        '<div class="deep-dive-content">' + items + '</div>' +
      '</details>'
    );
  }

  // ── Render one case card ─────────────────────────────
  function renderCard(c) {
    var badgeStyle = getBadgeStyle(c.category);
    var evidenceRow =
      '<div class="evidence-row">' +
        '<span class="evidence-label">证据强度</span>' +
        buildEvidenceBar(c.evidence_strength) +
      '</div>';

    var sourceSection = buildSourceSection(c);
    var verifHint = buildVerificationHint(c);
    var deepDive = buildDeepDive(c);

    return (
      '<article class="case-card" data-category="' + c.category + '" data-id="' + c.id + '" data-status="' + c.source_status + '">' +
        '<div class="card-header">' +
          '<span class="card-year">' + c.year + ' &mdash; ' + escapeHtml(c.location) + '</span>' +
          '<span class="card-category-badge" style="' + badgeStyle + '">' + c.category + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<h3 class="card-title">' + escapeHtml(c.title) + '</h3>' +
          '<p class="card-meta">' + escapeHtml(c.agency) + ' &nbsp;|&nbsp; ' + escapeHtml(c.evidence_type) + '</p>' +
          '<p class="card-description">' + escapeHtml(c.description) + '</p>' +
          evidenceRow +
          '<p style="font-size:0.72rem;color:var(--text-muted);font-family:var(--font-mono);margin-bottom:0;">' +
            '证据等级 ' + c.evidence_strength + '/6：' + escapeHtml(EVIDENCE_LABELS[c.evidence_strength - 1] || '未知') +
          '</p>' +
        '</div>' +
        sourceSection +
        verifHint +
        deepDive +
        '<div class="card-footer">' +
          '<span class="status-badge status-' + c.status_label + '">' + escapeHtml(c.status) + '</span>' +
          '<p class="card-note">⚠ ' + escapeHtml(c.note) + '</p>' +
        '</div>' +
      '</article>'
    );
  }

  // ── Source status filter config ────────────────────────
  var STATUS_FILTERS = [
    { id: 'all',       label: '全部来源' },
    { id: 'verified',  label: '官方来源 Verified' },
    { id: 'secondary_only', label: '二手来源 Secondary' },
    { id: 'needs_review',   label: '待核实 Needs Review' }
  ];

  // ── Render filter bars ─────────────────────────────────
  function renderFilterBars() {
    var catBar  = document.getElementById('filter-bar');
    var statBar = document.getElementById('status-filter-bar');
    if (!catBar || !statBar) return;

    CATEGORIES.forEach(function (cat, i) {
      var btn = document.createElement('button');
      btn.className = 'filter-btn' + (i === 0 ? ' active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('data-cat', cat.id);
      btn.textContent = cat.label + ' (' + countByCategory(cat.id) + ')';
      btn.style.cssText = i > 0 && cat.id !== 'all'
        ? 'border-color:' + (CAT_COLORS[cat.id] ? CAT_COLORS[cat.id].border : 'rgba(255,255,255,0.1)')
        : '';
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-cat]').forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        applyFilters();
      });
      catBar.appendChild(btn);
    });

    STATUS_FILTERS.forEach(function (f, i) {
      var cfg = SOURCE_STATUS_CONFIG[f.id] || { color: '#a0a0a0' };
      var btn = document.createElement('button');
      btn.className = 'filter-btn status-filter' + (i === 0 ? ' active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('data-status', f.id);
      btn.textContent = f.label + ' (' + countByStatus(f.id) + ')';
      if (i > 0) {
        btn.style.borderColor = cfg.border || 'rgba(255,255,255,0.1)';
      }
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-status]').forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        applyFilters();
      });
      statBar.appendChild(btn);
    });
  }

  // ── Get active filter values ───────────────────────────
  function getActiveCategory() {
    var active = document.querySelector('[data-cat].active');
    return active ? active.getAttribute('data-cat') : 'all';
  }

  function getActiveStatus() {
    var active = document.querySelector('[data-status].active');
    return active ? active.getAttribute('data-status') : 'all';
  }

  // ── Apply combined filters ─────────────────────────────
  function applyFilters() {
    var catFilter   = getActiveCategory();
    var statusFilter = getActiveStatus();
    document.querySelectorAll('.case-card').forEach(function (card) {
      var cat    = card.getAttribute('data-category');
      var status = card.getAttribute('data-status');
      var catMatch   = (catFilter === 'all') || (cat === catFilter);
      var statusMatch = (statusFilter === 'all') || (status === statusFilter);
      card.classList.toggle('hidden', !(catMatch && statusMatch));
    });
  }

  // ── Legacy filterCards (kept for compat) ────────────────
  function filterCards(categoryId) {
    var catBtns = document.querySelectorAll('[data-cat]');
    catBtns.forEach(function (b) {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    var target = document.querySelector('[data-cat="' + categoryId + '"]');
    if (target) {
      target.classList.add('active');
      target.setAttribute('aria-selected', 'true');
    }
    applyFilters();
  }

  // ── Render all cards ───────────────────────────────────
  function renderAllCards() {
    var grid = document.getElementById('cases-grid');
    if (!grid) return;
    grid.innerHTML = UAP_CASES.map(renderCard).join('');
  }

  // ── Animate sections on scroll ─────────────────────────
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    document.querySelectorAll('.section-header, .info-grid, .archive-box, .timeline-item, .conclusion-box, .reasons-grid, .evidence-table, .source-explainer, .guide-cards, .matrix-grid, .routes-grid, .route-card, .guide-card').forEach(function (el) {
      el.classList.add('animate-in');
      io.observe(el);
    });
  }

  // ── Bootstrap ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    renderFilterBars();
    renderAllCards();
    initScrollAnimations();
  });

  // ═══════════════════════════════════════════════
  // READING ROUTES — v0.4
  // Route → category mapping for curated navigation
  // ═══════════════════════════════════════════════
  var ROUTE_CATEGORIES = {
    space:    ['NASA'],
    military: ['Military'],
    archive:  ['Historical', 'FBI']
  };

  // Exposed globally for onclick="navigateToRoute(...)" in HTML
  window.navigateToRoute = function (routeId) {
    var cats = ROUTE_CATEGORIES[routeId];
    if (!cats) return;

    // 1. Highlight the route nav button
    document.querySelectorAll('.route-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    var targetBtn = document.querySelector('.route-btn[data-route="' + routeId + '"]');
    if (targetBtn) targetBtn.classList.add('active');

    // 2. Scroll to the cases section
    var casesSection = document.getElementById('top-cases');
    if (casesSection) {
      casesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 3. Apply category filter to show only matching cases
    // Reset status filter to 'all' first
    var allStatusBtn = document.querySelector('[data-status="all"]');
    if (allStatusBtn) {
      document.querySelectorAll('[data-status]').forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      allStatusBtn.classList.add('active');
      allStatusBtn.setAttribute('aria-selected', 'true');
    }

    // Apply category filter
    if (cats.length === 1) {
      // Single category: click the corresponding category tab
      var catBtn = document.querySelector('[data-cat="' + cats[0] + '"]');
      if (catBtn) catBtn.click();
    } else {
      // Multiple categories: reset to 'all'
      var allCatBtn = document.querySelector('[data-cat="all"]');
      if (allCatBtn) allCatBtn.click();
      // Then filter cards manually by hiding non-matching
      document.querySelectorAll('.case-card').forEach(function (card) {
        var cat = card.getAttribute('data-category');
        card.classList.toggle('hidden', !cats.includes(cat));
      });
    }
  };

}());
