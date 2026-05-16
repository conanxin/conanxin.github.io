/**
 * 信抵达之前 — Phase 3 研究型草稿
 * 数据驱动：motifs / works / journey / routes / sources / source_audit JSON
 * 原生实现：筛选、时间线、SVG 图谱、路线联动、来源系统、无障碍 Modal
 */

(function () {
  'use strict';

  // Data stores
  let motifs = [];
  let works = [];
  let journey = [];
  let routes = [];
  let sources = [];
  let sourceAudit = null;
  let qiaopiData = null;

  // UI state
  let activeMotif = 'all';
  let activeStatus = 'all';
  let activeRouteId = null;
  let activeJourneyStage = null;
  let modalOpen = false;
  let lastFocusedCard = null;

  // DOM refs
  const filterBar = document.getElementById('filter-bar');
  const statusBar = document.getElementById('status-bar');
  const worksGrid = document.getElementById('works-grid');
  const worksEmpty = document.getElementById('works-empty');
  const worksError = document.getElementById('works-error');
  const journeyTimeline = document.getElementById('journey-timeline');
  const journeyHint = document.getElementById('journey-hint');
  const graphContainer = document.getElementById('graph-svg-container');
  const routeList = document.getElementById('route-list');
  const routeActiveInfo = document.getElementById('route-active-info');
  const routeResetBtn = document.getElementById('route-reset-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');
  const sourceAuditStats = document.getElementById('source-audit-stats');
  const sourceAuditGaps = document.getElementById('source-audit-gaps');
  const sourcesList = document.getElementById('sources-list');

  // Motif color fallback map
  const MOTIF_COLORS = {
    ghostwriting: '#5B7C99',
    delayed: '#C4A35A',
    afterlife: '#8B7B8B',
    migration: '#2E8B8B',
    wartime: '#6B5B4F',
    unsent: '#9B8AA5',
    messenger: '#6B8E6B',
    archive: '#8B7355'
  };

  // Status label map
  const STATUS_LABELS = {
    verified: '已核实',
    partial: '部分核实',
    placeholder: '待核实',
    needs_review: '需复核',
    not_found: '未找到'
  };

  // Status color map
  const STATUS_COLORS = {
    verified: '#2e7d32',
    partial: '#ef6c00',
    placeholder: '#757575',
    needs_review: '#c62828',
    not_found: '#616161'
  };

  // Icon paths (inline SVG for timeline)
  const STAGE_ICONS = {
    write: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    seal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    wait: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    arrive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    reread: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    archive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><line x1="10" y1="12" x2="14" y2="12"/></svg>'
  };

  // ============================================================
  // Initialize
  // ============================================================
  async function init() {
    try {
      const [motifsRes, worksRes, journeyRes, routesRes, sourcesRes, auditRes] = await Promise.all([
        fetch('data/motifs.json'),
        fetch('data/works.json'),
        fetch('data/journey.json'),
        fetch('data/routes.json'),
        fetch('data/sources.json'),
        fetch('data/source_audit.json')
      ]);

      if (!motifsRes.ok) throw new Error('motifs.json: ' + motifsRes.status);
      if (!worksRes.ok) throw new Error('works.json: ' + worksRes.status);
      if (!journeyRes.ok) throw new Error('journey.json: ' + journeyRes.status);
      if (!routesRes.ok) throw new Error('routes.json: ' + routesRes.status);
      if (!sourcesRes.ok) throw new Error('sources.json: ' + sourcesRes.status);
      if (!auditRes.ok) throw new Error('source_audit.json: ' + auditRes.status);

      motifs = await motifsRes.json();
      works = await worksRes.json();
      journey = await journeyRes.json();
      routes = await routesRes.json();
      sources = await sourcesRes.json();
      sourceAudit = await auditRes.json();

      if (![motifs, works, journey, routes, sources].every(Array.isArray)) {
        throw new Error('JSON 格式错误：期望数组');
      }

      renderFilters();
      renderStatusFilters();
      renderJourney();
      renderGraph();
      renderRoutes();
      renderWorks();
      renderSourcesSection();
      bindEvents();
      openModalFromHash();

      // Load qiaopi data non-blocking
      try {
        const qiaopiRes = await fetch('data/qiaopi.json');
        if (qiaopiRes.ok) {
          qiaopiData = await qiaopiRes.json();
          renderQiaopiSection();
        }
      } catch (qErr) {
        console.warn('qiaopi.json 加载失败:', qErr);
        const qSection = document.getElementById('qiaopi');
        if (qSection) qSection.style.display = 'none';
      }
    } catch (err) {
      console.error('初始化失败:', err);
      showError();
    }
  }

  function showError() {
    worksGrid.style.display = 'none';
    worksEmpty.style.display = 'none';
    worksError.style.display = 'block';
  }

  // ============================================================
  // Helpers
  // ============================================================
  function getMotif(id) { return motifs.find(m => m.id === id) || null; }

  function getMotifColor(id) {
    const m = getMotif(id);
    return m && m.colorHint ? m.colorHint : (MOTIF_COLORS[id] || '#6B6B6B');
  }

  function getSource(id) { return sources.find(s => s.id === id) || null; }

  function getWorkById(id) { return works.find(w => w.id === id) || null; }

  function escapeHtml(str) {
    if (typeof str !== 'string') return String(str || '');
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ============================================================
  // Motif Filters
  // ============================================================
  function renderFilters() {
    motifs.forEach(m => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.motif = m.id;
      btn.textContent = m.title;
      filterBar.appendChild(btn);
    });
  }

  function setActiveMotif(mid) {
    activeMotif = mid;
    activeRouteId = null;
    activeJourneyStage = null;

    filterBar.querySelectorAll('.filter-btn').forEach(b => {
      const isActive = b.dataset.motif === activeMotif;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });

    routeList.querySelectorAll('.route-item').forEach(r => r.classList.remove('active'));
    routeActiveInfo.style.display = 'none';
    journeyTimeline.querySelectorAll('.journey-stage').forEach(s => s.classList.remove('active'));
    journeyHint.textContent = '点击上方阶段，探索相关作品';

    renderWorks();
  }

  // ============================================================
  // Status Filters
  // ============================================================
  function renderStatusFilters() {
    // Buttons already in HTML
  }

  function setActiveStatus(status) {
    activeStatus = status;
    statusBar.querySelectorAll('.status-btn').forEach(b => {
      const isActive = b.dataset.status === activeStatus;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });
    renderWorks();
  }

  // ============================================================
  // Journey Timeline
  // ============================================================
  function renderJourney() {
    journeyTimeline.innerHTML = journey.map(stage => {
      const icon = STAGE_ICONS[stage.id] || '';
      return `
        <div class="journey-stage" role="listitem" tabindex="0"
             data-stage="${escapeHtml(stage.id)}"
             aria-label="${escapeHtml(stage.title)}：${escapeHtml(stage.subtitle)}">
          <div class="journey-stage-icon" aria-hidden="true">${icon}</div>
          <div class="journey-stage-title">${escapeHtml(stage.title)}</div>
          <div class="journey-stage-subtitle">${escapeHtml(stage.subtitle)}</div>
          <div class="journey-stage-desc">${escapeHtml(stage.description)}</div>
        </div>
      `;
    }).join('');

    journeyTimeline.querySelectorAll('.journey-stage').forEach(el => {
      el.addEventListener('click', () => activateJourneyStage(el.dataset.stage));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateJourneyStage(el.dataset.stage);
        }
      });
    });
  }

  function activateJourneyStage(stageId) {
    const stage = journey.find(s => s.id === stageId);
    if (!stage) return;

    activeJourneyStage = stageId;
    activeRouteId = null;

    journeyTimeline.querySelectorAll('.journey-stage').forEach(s => {
      s.classList.toggle('active', s.dataset.stage === stageId);
    });

    journeyHint.textContent = `${stage.title} — ${stage.relatedWorks.length} 个相关作品`;

    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    routeList.querySelectorAll('.route-item').forEach(r => r.classList.remove('active'));
    routeActiveInfo.style.display = 'none';

    renderWorks();
  }

  // ============================================================
  // Relationship Graph (Native SVG)
  // ============================================================
  function renderGraph() {
    const w = 900, h = 560;
    const cx = w / 2, cy = h / 2;
    const centerR = 28, motifR = 22, workR = 10;
    const motifDist = 180, workDist = 260;

    const centerNode = { id: 'letters-to-ama', label: '《给阿嬷的情书》', x: cx, y: cy, r: centerR, type: 'center' };

    const motifNodes = motifs.map((m, i) => {
      const angle = (i / motifs.length) * Math.PI * 2 - Math.PI / 2;
      return {
        id: m.id, label: m.title,
        x: cx + Math.cos(angle) * motifDist,
        y: cy + Math.sin(angle) * motifDist,
        r: motifR, type: 'motif',
        color: getMotifColor(m.id)
      };
    });

    const seenWorkIds = new Set();
    const workNodes = [];

    motifNodes.forEach(mn => {
      const motifWorks = works.filter(w => w.motifs && w.motifs.includes(mn.id) && w.id !== 'letters-to-ama');
      const selected = motifWorks.slice(0, 3);
      selected.forEach((w, wi) => {
        if (seenWorkIds.has(w.id)) return;
        seenWorkIds.add(w.id);
        const parentAngle = Math.atan2(mn.y - cy, mn.x - cx);
        const spread = 0.35;
        const angle = parentAngle - spread + (wi / Math.max(selected.length - 1, 1)) * spread * 2;
        workNodes.push({
          id: w.id, label: w.title.replace(/《|》/g, ''),
          x: cx + Math.cos(angle) * workDist,
          y: cy + Math.sin(angle) * workDist,
          r: workR, type: 'work', motifId: mn.id
        });
      });
    });

    const allNodes = [centerNode, ...motifNodes, ...workNodes];
    const edges = [];
    motifNodes.forEach(mn => edges.push({ from: centerNode.id, to: mn.id, type: 'center-motif' }));
    workNodes.forEach(wn => edges.push({ from: wn.motifId, to: wn.id, type: 'motif-work' }));

    let svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-label="作品与母题关系网络">`;
    svg += `<rect width="${w}" height="${h}" fill="var(--bg-page, #F7F5F0)"/>`;

    edges.forEach(e => {
      const from = allNodes.find(n => n.id === e.from);
      const to = allNodes.find(n => n.id === e.to);
      if (!from || !to) return;
      const isHighlight = e.type === 'center-motif';
      const isWorkEdge = e.type === 'motif-work';
      svg += `<line class="graph-edge${isHighlight ? ' highlight' : ''}${isWorkEdge ? ' graph-edge-work' : ''}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke-dasharray="${isWorkEdge ? '4 3' : 'none'}"/>`;
    });

    allNodes.forEach(n => {
      let fill = '#9B9B9B', stroke = 'none', strokeWidth = 0, textColor = '#fff', fontSize = 11;
      if (n.type === 'center') { fill = '#B85C50'; fontSize = 12; }
      else if (n.type === 'motif') { fill = n.color || '#4A6FA5'; fontSize = 12; }
      else { fill = '#fff'; stroke = '#9B9B9B'; strokeWidth = 1.5; textColor = '#6B6B6B'; fontSize = 10; }

      const labelY = n.type === 'work' ? n.y + n.r + 14 : n.y + 5;
      svg += `<g class="graph-node" data-id="${escapeHtml(n.id)}" data-type="${n.type}" role="button" tabindex="0" aria-label="${escapeHtml(n.label)}">`;
      svg += `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
      if (n.type === 'work') {
        svg += `<text x="${n.x}" y="${labelY}" text-anchor="middle" fill="${textColor}" font-size="${fontSize}" font-family="var(--font-serif, Georgia, serif)">${escapeHtml(n.label)}</text>`;
      } else {
        svg += `<text x="${n.x}" y="${n.y - 4}" text-anchor="middle" fill="${textColor}" font-size="${fontSize}" font-family="var(--font-serif, Georgia, serif)">${escapeHtml(n.label)}</text>`;
      }
      svg += `</g>`;
    });
    svg += '</svg>';
    graphContainer.innerHTML = svg;

    graphContainer.querySelectorAll('.graph-node').forEach(node => {
      const id = node.dataset.id, type = node.dataset.type;
      const handleActivate = () => {
        if (type === 'motif') { setActiveMotif(id); document.getElementById('works').scrollIntoView({ behavior: 'smooth' }); }
        else if (type === 'work') { const work = getWorkById(id); if (work) openModal(work, node); }
        else if (type === 'center') { const work = getWorkById(id); if (work) openModal(work, node); }
      };
      node.addEventListener('click', handleActivate);
      node.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleActivate(); } });
    });
    renderGraphMobileList();
  }



  // ============================================================
  // Mobile Graph List View (rendered alongside SVG)
  // ============================================================
  function renderGraphMobileList() {
    const fallback = document.getElementById('graph-fallback');
    if (!fallback) return;

    let html = '<h3 class="graph-mobile-heading">按母题浏览作品</h3><div class="graph-mobile-list">';
    motifs.forEach(m => {
      const motifWorks = works.filter(w => w.motifs && w.motifs.includes(m.id) && w.id !== 'letters-to-ama');
      if (motifWorks.length === 0) return;
      const color = getMotifColor(m.id);
      html += `<div class="graph-mobile-group">
        <div class="graph-mobile-group-title" style="color:${color}">${escapeHtml(m.title)}</div>
        <div class="graph-mobile-works">`;
      motifWorks.forEach(w => {
        html += `<div class="graph-mobile-work" data-id="${escapeHtml(w.id)}" tabindex="0" role="button" aria-label="${escapeHtml(w.title)}">${escapeHtml(w.title)}</div>`;
      });
      html += '</div></div>';
    });
    html += '</div>';
    fallback.innerHTML = html;
    fallback.style.display = 'block';

    fallback.querySelectorAll('.graph-mobile-work').forEach(el => {
      const activate = () => {
        const work = getWorkById(el.dataset.id);
        if (work) openModal(work, el);
      };
      el.addEventListener('click', activate);
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    });
  }

  // ============================================================
  // Reading Routes
  // ============================================================
  function renderRoutes() {
    routeList.innerHTML = routes.map((r, i) => {
      const workTags = r.works.map(wid => {
        const w = getWorkById(wid);
        return w ? `<span class="route-tag">${escapeHtml(w.title)}</span>` : '';
      }).join('');
      return `
        <div class="route-item" data-route="${escapeHtml(r.id)}" tabindex="0" role="button"
             aria-label="阅读路线：${escapeHtml(r.title)}">
          <div class="route-number">0${i + 1}</div>
          <h3 class="route-title">${escapeHtml(r.title)}</h3>
          <p class="route-tagline">${escapeHtml(r.tagline)}</p>
          <p class="route-desc">${escapeHtml(r.description)}</p>
          <div class="route-works">${workTags}</div>
        </div>
      `;
    }).join('');

    routeList.querySelectorAll('.route-item').forEach(item => {
      item.addEventListener('click', () => activateRoute(item.dataset.route));
      item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateRoute(item.dataset.route); } });
    });
  }

  function activateRoute(routeId) {
    const route = routes.find(r => r.id === routeId);
    if (!route) return;
    activeRouteId = routeId; activeMotif = 'all'; activeJourneyStage = null;
    routeList.querySelectorAll('.route-item').forEach(r => r.classList.toggle('active', r.dataset.route === routeId));
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    filterBar.querySelector('.filter-btn[data-motif="all"]').classList.add('active');
    journeyTimeline.querySelectorAll('.journey-stage').forEach(s => s.classList.remove('active'));
    journeyHint.textContent = '点击上方阶段，探索相关作品';
    routeActiveInfo.style.display = 'block';
    renderWorks();
  }

  function resetRoute() {
    activeRouteId = null;
    routeList.querySelectorAll('.route-item').forEach(r => r.classList.remove('active'));
    routeActiveInfo.style.display = 'none';
    setActiveMotif('all');
  }

  // ============================================================
  // Works Grid
  // ============================================================
  function renderWorks() {
    let filtered = works;

    if (activeJourneyStage) {
      const stage = journey.find(s => s.id === activeJourneyStage);
      if (stage && stage.relatedWorks) filtered = works.filter(w => stage.relatedWorks.includes(w.id));
    } else if (activeRouteId) {
      const route = routes.find(r => r.id === activeRouteId);
      if (route && route.works) filtered = works.filter(w => route.works.includes(w.id));
    } else if (activeMotif !== 'all') {
      filtered = works.filter(w => w.motifs && w.motifs.includes(activeMotif));
    }

    if (activeStatus !== 'all') {
      filtered = filtered.filter(w => (w.verification_status || 'placeholder') === activeStatus);
    }

    if (filtered.length === 0) {
      worksGrid.style.display = 'none';
      worksEmpty.style.display = 'block';
      worksError.style.display = 'none';
      return;
    }

    worksGrid.style.display = 'grid';
    worksEmpty.style.display = 'none';
    worksError.style.display = 'none';

    filtered.sort((a, b) => {
      if ((a.priority || 99) !== (b.priority || 99)) return (a.priority || 99) - (b.priority || 99);
      return (b.year || 0) - (a.year || 0);
    });

    worksGrid.innerHTML = filtered.map(w => buildCardHTML(w)).join('');

    worksGrid.querySelectorAll('.work-card').forEach(card => {
      card.addEventListener('click', () => { const id = card.dataset.id; const work = getWorkById(id); if (work) openModal(work, card); });
    });
  }

  function buildCardHTML(w) {
    const motifTags = (w.motifs || []).map(mid => {
      const m = getMotif(mid);
      const color = getMotifColor(mid);
      return `<span class="motif-tag" style="background:${color}15;color:${color};border:1px solid ${color}30;">${m ? m.title : mid}</span>`;
    }).join('');

    const priorityClass = w.priority === 1 ? 'priority-1' : '';
    const status = w.verification_status || 'placeholder';
    const statusLabel = STATUS_LABELS[status] || status;
    const statusTag = `<span class="work-status-tag ${status}">${escapeHtml(statusLabel)}</span>`;

    return `
      <article class="work-card ${priorityClass}" data-id="${escapeHtml(w.id)}" id="work-${escapeHtml(w.id)}" tabindex="0"
               aria-label="${escapeHtml(w.title)}，${w.type || ''}，${w.year || ''}，状态：${statusLabel}">
        ${statusTag}
        <div class="work-card-header">
          <h3 class="work-card-title">${escapeHtml(w.title)}</h3>
          <span class="work-card-year">${w.year || ''}</span>
        </div>
        <div class="work-card-meta">
          <span class="work-card-type">${escapeHtml(w.type || '')}</span>
          <span class="work-card-region">${escapeHtml(w.region || '')}</span>
        </div>
        <div class="work-card-motifs">${motifTags}</div>
        <p class="work-card-lead">${escapeHtml(w.lead || '')}</p>
      </article>
    `;
  }

  // ============================================================
  // Sources Section
  // ============================================================
  function renderSourcesSection() {
    if (!sourceAudit) return;

    // Stats
    const stats = [
      { num: sourceAudit.total_sources, label: '来源总数' },
      { num: sourceAudit.verified_count, label: '已核实' },
      { num: sourceAudit.partial_count, label: '部分核实' },
      { num: sourceAudit.works_total, label: '作品总数' },
      { num: sourceAudit.works_verified, label: '已核实作品' },
      { num: sourceAudit.works_partial, label: '部分核实作品' }
    ];
    sourceAuditStats.innerHTML = stats.map(s => `
      <div class="stat-card">
        <div class="stat-number">${s.num}</div>
        <div class="stat-label">${escapeHtml(s.label)}</div>
      </div>
    `).join('');

    // Gaps
    const gaps = sourceAudit.high_priority_gaps || [];
    if (gaps.length > 0) {
      sourceAuditGaps.innerHTML = `
        <div class="gaps-title">待核实高优先级项</div>
        <div class="gaps-list">
          <p>以下条目缺乏已核实的权威来源，需要进一步补充：</p>
          <ul>${gaps.map(g => `<li>《${escapeHtml(g.title)}》— ${escapeHtml(g.reason)}</li>`).join('')}</ul>
        </div>
      `;
    } else {
      sourceAuditGaps.innerHTML = `
        <div class="gaps-title">待核实高优先级项</div>
        <div class="gaps-list">
          <p>当前所有作品均已关联来源，无高优先级缺口。</p>
        </div>
      `;
    }

    // Sources list
    const displaySources = sources.filter(s => s.status !== 'placeholder').slice(0, 20);
    sourcesList.innerHTML = displaySources.map(s => {
      const statusClass = s.status || 'placeholder';
      const statusLabel = STATUS_LABELS[s.status] || s.status;
      const metaParts = [s.source_type, s.language, s.accessed_hint].filter(Boolean);
      return `
        <div class="source-item">
          <div class="source-header">
            <div class="source-title">${escapeHtml(s.title)}</div>
            <span class="source-status ${statusClass}">${escapeHtml(statusLabel)}</span>
          </div>
          <div class="source-meta">${escapeHtml(metaParts.join(' · '))}</div>
          <div class="source-note">${escapeHtml(s.note || '')}</div>
        </div>
      `;
    }).join('');
  }

  // ============================================================
  // Modal (with accessibility & sources)
  // ============================================================
  function openModal(work, triggerEl) {
    lastFocusedCard = triggerEl || document.activeElement;

    const motifTags = (work.motifs || []).map(mid => {
      const m = getMotif(mid);
      const color = getMotifColor(mid);
      return `<span class="motif-tag" style="background:${color}15;color:${color};border:1px solid ${color}30;">${m ? m.title : mid}</span>`;
    }).join('');

    const keywords = (work.visual_keywords || []).map(kw => `<span class="keyword-tag">${escapeHtml(kw)}</span>`).join('');

    const status = work.verification_status || 'placeholder';
    const statusLabel = STATUS_LABELS[status] || status;
    const statusColor = STATUS_COLORS[status] || '#757575';

    // Build sources list
    let sourcesHTML = '';
    if (work.source_ids && work.source_ids.length > 0) {
      const workSources = work.source_ids.map(sid => getSource(sid)).filter(Boolean);
      if (workSources.length > 0) {
        sourcesHTML = `<div class="modal-section">
          <div class="modal-section-title">来源与参考</div>
          <div class="modal-sources">
            ${workSources.map(s => {
              const sStatus = s.status || 'placeholder';
              const sLabel = STATUS_LABELS[sStatus] || sStatus;
              return `<div class="modal-source-item">
                <span class="modal-source-title">${escapeHtml(s.title)}</span>
                <span class="modal-source-status" style="color:${STATUS_COLORS[sStatus] || '#757575'}">${escapeHtml(sLabel)}</span>
                ${s.url ? `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="modal-source-link">链接 ↗</a>` : ''}
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }
    }

    const expandedNote = work.expanded_note ? `<div class="modal-section">
      <div class="modal-section-title">详细说明</div>
      <p>${escapeHtml(work.expanded_note)}</p>
    </div>` : '';

    const whyItMatters = work.why_it_matters ? `<div class="modal-section">
      <div class="modal-section-title">为什么值得放入本专题</div>
      <div class="modal-relation">
        <p>${escapeHtml(work.why_it_matters)}</p>
      </div>
    </div>` : '';

    const entryPoint = work.recommended_entry_point ? `<div class="modal-section">
      <div class="modal-section-title">推荐入口</div>
      <p>${escapeHtml(work.recommended_entry_point)}</p>
    </div>` : '';

    const contentWarning = work.content_warning ? `<div class="modal-content-warning" role="alert" aria-live="polite">&#9888; ${escapeHtml(work.content_warning)}</div>` : '';

    modalBody.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title" id="modal-title">${escapeHtml(work.title)}</h2>
        <div class="modal-meta-row">
          <span class="modal-type">${escapeHtml(work.type || '')}</span>
          <span class="modal-year">${work.year || ''}</span>
          <span class="modal-region">${escapeHtml(work.region || '')}</span>
          <span class="modal-verification-status" style="color:${statusColor};font-size:12px;font-family:var(--font-mono);padding:2px 8px;border-radius:4px;border:1px solid ${statusColor}40;background:${statusColor}10;">${escapeHtml(statusLabel)}</span>
        </div>
        <div class="modal-motifs">${motifTags}</div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">一句话</div>
        <p>${escapeHtml(work.lead || '')}</p>
      </div>

      ${expandedNote}
      ${whyItMatters}

      <div class="modal-section">
        <div class="modal-section-title">与《给阿嬷的情书》的关系</div>
        <div class="modal-relation">
          <p>${escapeHtml(work.relation || '暂无说明')}</p>
        </div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">典型写信场景</div>
        <div class="modal-scene">
          <p>${escapeHtml(work.scene || '暂无场景描述')}</p>
        </div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">画面关键词</div>
        <div class="modal-keywords">
          ${keywords || '<span class="keyword-tag">暂无</span>'}
        </div>
      </div>

      ${entryPoint}
      ${contentWarning}
      ${sourcesHTML}
      <div class="modal-actions">
        <button class="modal-copy-link" id="modal-copy-link" aria-label="复制此条目链接">复制此条目链接</button>
      </div>
    `;

    const copyBtn = modalBody.querySelector('#modal-copy-link');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const url = window.location.href.split('#')[0] + '#work-' + work.id;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            copyBtn.textContent = '已复制';
            setTimeout(() => copyBtn.textContent = '复制此条目链接', 2000);
          }).catch(() => { fallbackCopyLink(url); });
        } else { fallbackCopyLink(url); }
      });
    }

    modalOverlay.style.display = 'flex';
    void modalOverlay.offsetWidth;
    modalOverlay.classList.add('show');
    modalOpen = true;
    document.body.style.overflow = 'hidden';
    modalOverlay.setAttribute('aria-labelledby', 'modal-title');
    requestAnimationFrame(() => modalClose.focus());
  }

  function closeModal() {
    modalOverlay.classList.remove('show');
    modalOpen = false;
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!modalOpen) {
        modalOverlay.style.display = 'none';
        if (lastFocusedCard && lastFocusedCard.focus) lastFocusedCard.focus();
      }
    }, 300);
  }

  function trapFocus(e) {
    if (!modalOpen || e.key !== 'Tab') return;
    const focusables = modalOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // ============================================================
  // Hash / Deep Linking
  // ============================================================
  function openModalFromHash() {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#work-')) return;
    const workId = hash.slice(6);
    const work = getWorkById(workId);
    if (work) {
      setTimeout(() => {
        openModal(work, null);
        document.getElementById('works').scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  }

  function fallbackCopyLink(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      prompt('请手动复制以下链接:', text);
    }
    document.body.removeChild(ta);
  }

  // ============================================================
  // Events
  // ============================================================
  function bindEvents() {
    // Motif filter buttons
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      const mid = btn.dataset.motif;
      if (mid === 'all') setActiveMotif('all');
      else if (activeMotif === mid) setActiveMotif('all');
      else setActiveMotif(mid);
    });

    // Status filter buttons
    statusBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.status-btn');
      if (!btn) return;
      const status = btn.dataset.status;
      if (status === 'all') setActiveStatus('all');
      else if (activeStatus === status) setActiveStatus('all');
      else setActiveStatus(status);
    });

    // Modal
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOpen) closeModal();
      trapFocus(e);
    });

    // Route reset
    routeResetBtn.addEventListener('click', resetRoute);

    // Hero scroll
    document.querySelector('.hero-scroll').addEventListener('click', () => {
      document.getElementById('intro').scrollIntoView({ behavior: 'smooth' });
    });
  }


  // ============================================================
  // Qiaopi Section
  // ============================================================
  function renderQiaopiSection() {
    if (!qiaopiData) return;
    renderQiaopiStructure();
    renderQiaopiRoute();
    renderQiaopiArchive();
    renderQiaopiRelated();
  }

  function renderQiaopiStructure() {
    const grid = document.getElementById('qiaopi-structure-grid');
    const detail = document.getElementById('qiaopi-structure-detail');
    if (!grid) return;
    const items = qiaopiData.structure || [];
    grid.innerHTML = items.map((item, idx) => `
      <button class="qiaopi-part-card" data-idx="${idx}" type="button" aria-label="${escapeHtml(item.title)}">
        <div class="qiaopi-part-number">0${idx + 1}</div>
        <div class="qiaopi-part-title">${escapeHtml(item.title)}</div>
        <div class="qiaopi-part-subtitle">${escapeHtml(item.subtitle || '')}</div>
      </button>
    `).join('');

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.qiaopi-part-card');
      if (!card) return;
      const idx = parseInt(card.dataset.idx, 10);
      const item = items[idx];
      if (!item) return;

      grid.querySelectorAll('.qiaopi-part-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      detail.style.display = 'block';
      detail.innerHTML = `
        <div class="qiaopi-detail-inner">
          <h4>${escapeHtml(item.title)} <span class="qiaopi-detail-sub">${escapeHtml(item.subtitle || '')}</span></h4>
          <p>${escapeHtml(item.description)}</p>
          ${item.relatedWorkIds && item.relatedWorkIds.length ? `
            <div class="qiaopi-detail-works">
              <span class="qiaopi-detail-label">关联作品：</span>
              ${item.relatedWorkIds.map(wid => {
                const w = getWorkById(wid);
                return w ? `<button class="qiaopi-detail-work" data-work="${escapeHtml(wid)}" type="button">${escapeHtml(w.title)}</button>` : '';
              }).join('')}
            </div>
          ` : ''}
        </div>
      `;
    });

    detail.addEventListener('click', (e) => {
      const btn = e.target.closest('.qiaopi-detail-work');
      if (!btn) return;
      const wid = btn.dataset.work;
      const w = getWorkById(wid);
      if (w) openModal(w, null);
    });
  }

  function renderQiaopiRoute() {
    const track = document.getElementById('qiaopi-route-track');
    const detail = document.getElementById('qiaopi-route-detail');
    if (!track) return;
    const nodes = qiaopiData.route || [];
    track.innerHTML = nodes.map((node, idx) => `
      <div class="qiaopi-route-node" data-idx="${idx}" tabindex="0" role="button" aria-label="${escapeHtml(node.title)}">
        <div class="qiaopi-route-dot"></div>
        <div class="qiaopi-route-label">${escapeHtml(node.title)}</div>
        ${idx < nodes.length - 1 ? '<div class="qiaopi-route-line" aria-hidden="true"></div>' : ''}
      </div>
    `).join('');

    track.addEventListener('click', (e) => {
      const nodeEl = e.target.closest('.qiaopi-route-node');
      if (!nodeEl) return;
      const idx = parseInt(nodeEl.dataset.idx, 10);
      const node = nodes[idx];
      if (!node) return;

      track.querySelectorAll('.qiaopi-route-node').forEach(n => n.classList.remove('active'));
      nodeEl.classList.add('active');

      detail.style.display = 'block';
      detail.innerHTML = `
        <div class="qiaopi-detail-inner">
          <h4>${escapeHtml(node.title)}</h4>
          <p>${escapeHtml(node.description)}</p>
        </div>
      `;
    });
  }

  function renderQiaopiArchive() {
    const container = document.getElementById('qiaopi-archive-stages');
    if (!container) return;
    const stages = qiaopiData.archiveStages || [];
    container.innerHTML = stages.map((stage, idx) => `
      <div class="qiaopi-archive-card">
        <div class="qiaopi-archive-num">0${idx + 1}</div>
        <div class="qiaopi-archive-content">
          <h4>${escapeHtml(stage.title)}</h4>
          <p>${escapeHtml(stage.description)}</p>
        </div>
      </div>
    `).join('');
  }

  function renderQiaopiRelated() {
    const container = document.getElementById('qiaopi-related-works');
    if (!container) return;
    const ids = qiaopiData.relatedWorks || [];
    container.innerHTML = ids.map(wid => {
      const w = getWorkById(wid);
      if (!w) return '';
      return `
        <button class="qiaopi-related-work" data-work="${escapeHtml(wid)}" type="button">
          <span class="qiaopi-related-title">${escapeHtml(w.title)}</span>
          <span class="qiaopi-related-type">${escapeHtml(w.type)}</span>
        </button>
      `;
    }).join('');

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.qiaopi-related-work');
      if (!btn) return;
      const wid = btn.dataset.work;
      const w = getWorkById(wid);
      if (w) openModal(w, null);
    });
  }

  // Start
  init();
})();
