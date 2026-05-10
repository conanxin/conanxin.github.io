// ===== SVG PLACEHOLDER GENERATOR =====
function generateSVGPlaceholder(colorRoom, seed) {
  const configs = {
    red:      { bg: '#E63946', shapes: 'circle,rect', seed: seed || 1 },
    yellow:   { bg: '#FFB703', shapes: 'circle,rect', seed: seed || 2 },
    blue:     { bg: '#219EBC', shapes: 'circle', seed: seed || 3 },
    white:    { bg: '#F1FAEE', shapes: 'rect', seed: seed || 4 },
    green:    { bg: '#2D6A4F', shapes: 'circle,rect', seed: seed || 5 },
    pink:     { bg: '#E8A0BF', shapes: 'circle,rect', seed: seed || 6 },
    black:    { bg: '#1D3557', shapes: 'circle', seed: seed || 7 },
    color:    { bg: '#9B59B6', shapes: 'circle,rect', seed: seed || 8 },
  };
  const cfg = configs[colorRoom] || configs.blue;
  const r = (n) => ((cfg.seed * 9301 + 49297) % 233280) / 233280;

  let shapes = '';
  if (cfg.shapes.includes('circle')) {
    for (let i = 0; i < 3; i++) {
      const cx = Math.round(r() * 60 + 10);
      const cy = Math.round(r() * 60 + 10);
      const cr = Math.round(r() * 15 + 5);
      const opacity = (r() * 0.3 + 0.1).toFixed(2);
      shapes += `<circle cx="${cx}%" cy="${cy}%" r="${cr}%" fill="white" opacity="${opacity}"/>`;
    }
  }
  if (cfg.shapes.includes('rect')) {
    for (let i = 0; i < 2; i++) {
      const x = Math.round(r() * 70);
      const y = Math.round(r() * 70);
      const w = Math.round(r() * 30 + 10);
      const h = Math.round(r() * 30 + 10);
      const opacity = (r() * 0.2 + 0.05).toFixed(2);
      shapes += `<rect x="${x}%" y="${y}%" width="${w}%" height="${h}%" fill="white" opacity="${opacity}"/>`;
    }
  }

  return `<svg class="exhibit-svg-placeholder" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="${cfg.bg}"/>
  ${shapes}
  <text x="50" y="50" text-anchor="middle" dominant-baseline="middle" fill="white" opacity="0.9" font-size="6" font-family="Noto Sans SC, sans-serif" font-weight="900">COLOR</text>
</svg>`;
}

// ===== DATA LOADER (Phase 5 — embedded data, no fetch required) =====
async function loadData() {
  // 优先使用内嵌数据（GitHub Pages / 文件协议可用）
  if (typeof EMBEDDED_EXHIBITS !== 'undefined' && typeof EMBEDDED_MUSIC !== 'undefined') {
    return { exhibits: EMBEDDED_EXHIBITS, music: EMBEDDED_MUSIC };
  }
  // Fallback：开发模式使用 fetch（需本地 server）
  try {
    const [exhibitsRes, musicRes] = await Promise.all([
      fetch('./data/exhibits.json'),
      fetch('./data/music.json')
    ]);
    if (!exhibitsRes.ok) throw new Error('Failed to load exhibits.json');
    if (!musicRes.ok) throw new Error('Failed to load music.json');
    const exhibits = await exhibitsRes.json();
    const music = await musicRes.json();
    return { exhibits, music };
  } catch (err) {
    console.error('数据加载失败（embedded未定义 + fetch失败）:', err);
    throw err;
  }
}

// ===== COLOR NAMES & DOTS =====
const COLOR_NAMES = {
  red: '红', yellow: '黄', blue: '蓝',
  white: '白', green: '绿', pink: '粉',
  black: '黑', color: '彩'
};
const COLOR_DOTS = {
  red: '#E63946', yellow: '#FFB703', blue: '#219EBC',
  white: '#F1FAEE', green: '#2D6A4F', pink: '#E8A0BF',
  black: '#1D3557', color: '#9B59B6'
};
const ROUTE_NAMES = {
  color_structure: '🎨 色彩结构',
  dream_surreal: '🌙 梦与超现实',
  modern_body: '💪 现代身体',
  abstraction_zero: '⬜ 抽象与零度',
  media_politics: '📺 媒体与政治',
  chinese_response: '🐉 中国当代回应',
  music_rhythm: '🎵 色彩与节奏'
};
const MOOD_ICONS = {
  spiritual: '✨', violent: '🔥', quiet: '🌿', dreamlike: '🌙',
  urban: '🏙', bodily: '💪', playful: '🎭', minimal: '⬜',
  tragic: '💧', lyrical: '🎶', romantic: '💕', ironic: '🎭',
  powerful: '⚡', mysterious: '🔮', contemplative: '🧘'
};

// ===== AREA PANEL =====
function renderColorAreaPanel(colorAreas, activeArea) {
  const panel = document.getElementById('areaPanel');
  if (!colorAreas) { panel.innerHTML = '<p style="color:#999">数据加载中…</p>'; return; }

  const areas = Object.keys(colorAreas);
  let html = '';

  areas.forEach(key => {
    const area = colorAreas[key];
    const bg = area.color;
    const isActive = key === activeArea;
    const display = (activeArea === 'all' || isActive) ? '' : 'display:none';
    const works = window._allWorks ? window._allWorks.filter(w => w.color_area === key) : [];

    html += `
    <div class="area-section" data-area="${key}" style="${display}">
      <div class="area-header" style="--area-bg:${bg};background:${bg}">
        <div class="area-name-zh">${area.name}</div>
        <div class="area-name-en">${area.name_en}</div>
        <div class="area-keywords">${area.keywords.split('、').map(k => `<span class="kw-tag">${k}</span>`).join('')}</div>
      </div>
      <div class="area-theme">${area.theme}</div>
      <div class="area-works-grid">
        ${works.map(w => `
          <div class="area-work-chip">
            <span class="awc-title">${w.title}</span>
            <span class="awc-artist">${w.artist_en || w.artist}</span>
            <span class="awc-year">${w.year}</span>
          </div>
        `).join('')}
      </div>
      <div class="area-work-count">共 ${works.length} 件展品</div>
    </div>`;
  });

  panel.innerHTML = html;
}

// ===== AREA TABS =====
function setupAreaTabs(colorAreas) {
  const tabs = document.querySelectorAll('.area-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const area = tab.dataset.area;
      renderColorAreaPanel(colorAreas, area);
      filterExhibitsByArea(area);
    });
  });
}

// ===== EXHIBIT CARDS (Phase 4 — enriched) =====
function renderExhibits(works) {
  const grid = document.getElementById('exhibitsGrid');
  window._allWorks = works;

  if (!works || works.length === 0) {
    grid.innerHTML = '<p style="color:#999;padding:2rem">暂无展品数据。</p>';
    return;
  }

  // Stats bar
  const statsBar = document.getElementById('statsBar');
  const total = works.length;
  const byArea = {};
  works.forEach(w => { byArea[w.color_area] = (byArea[w.color_area] || 0) + 1; });
  statsBar.innerHTML = `
    <div class="stat-chip">
      <span class="stat-num">${total}</span>
      <span class="stat-label">导览册确认展品</span>
    </div>
    <div class="stat-chip">
      <span class="stat-num">8</span>
      <span class="stat-label">颜色展区</span>
    </div>
    <div class="stat-chip">
      <span class="stat-num">${Object.keys(byArea).length}</span>
      <span class="stat-label">已收录展区</span>
    </div>
    <div class="stat-chip stat-warning">
      <span class="stat-num">⚠️</span>
      <span class="stat-label">图片均为占位图，不代表原作</span>
    </div>
  `;

  document.getElementById('count-all').textContent = total;
  Object.keys(byArea).forEach(area => {
    const el = document.getElementById('count-' + area);
    if (el) el.textContent = byArea[area];
  });

  grid.innerHTML = works.map((w, i) => {
    const dotColor = COLOR_DOTS[w.color_area] || '#ccc';
    const seed = (parseInt(w.id.replace(/\D/g, ''), 10) || i + 1) * 7;
    const colorName = COLOR_NAMES[w.color_area] || w.color_area;

    // Phase 4 enrichment fields
    const shortIntro = w.short_intro || '';
    const lookingPoints = w.looking_points || [];
    const artContext = w.art_context || '';
    const moodTags = (w.mood_tags || []).map(m => MOOD_ICONS[m] ? `${MOOD_ICONS[m]} ${m}` : m).join(' ');
    const recMusic = w.recommended_music_ids || [];
    const routeTags = (w.route_tags || []).map(r => ROUTE_NAMES[r] || r).join('');

    return `
    <article class="exhibit-card" data-area="${w.color_area}" data-routes="${(w.route_tags || []).join(',')}">
      <div class="exhibit-img-wrap">
        ${generateSVGPlaceholder(w.color_area, seed)}
        <div class="exhibit-color-badge" style="background:${dotColor}" title="${colorName}色空间"></div>
        <div class="placeholder-disclaimer">⚠️ 视觉占位，不代表原作图像</div>
      </div>
      <div class="exhibit-body">
        <div class="exhibit-source-badge">✅ 导览册确认</div>
        <h3 class="exhibit-title">${w.title}</h3>
        <div class="exhibit-artist">${w.artist}</div>
        <div class="exhibit-title-en" style="font-size:0.8em;color:#888">${w.title_en || ''}</div>
        <div class="exhibit-meta">${w.year || '年代待确认'} · ${w.medium || '材质待确认'} · ${colorName}色</div>

        ${routeTags ? `<div class="exhibit-route-tags">${routeTags}</div>` : ''}
        ${moodTags ? `<div class="exhibit-mood-tags">${moodTags}</div>` : ''}

        ${shortIntro ? `<p class="exhibit-short-intro">${shortIntro}</p>` : ''}

        <button class="expand-btn" data-id="${w.id}" aria-expanded="false">
          <span class="expand-label">深入了解 ▼</span>
        </button>

        <div class="exhibit-expanded" id="expanded-${w.id}" hidden>
          ${lookingPoints.length > 0 ? `
          <div class="exhibit-section">
            <div class="exhibit-section-title">👁 观展要点</div>
            <div class="exhibit-looking-points">
              ${lookingPoints.map(p => `<div class="lp-item">${p}</div>`).join('')}
            </div>
          </div>` : ''}
          ${artContext ? `
          <div class="exhibit-section">
            <div class="exhibit-section-title">📖 艺术史背景</div>
            <p class="exhibit-art-context">${artContext}</p>
          </div>` : ''}
          ${recMusic.length > 0 ? `
          <div class="exhibit-section">
            <div class="exhibit-section-title">🎧 推荐配乐</div>
            <div class="exhibit-music-ids">${recMusic.map(mid => `<span class="music-id-chip">${mid}</span>`).join('')}</div>
          </div>` : ''}
        </div>
      </div>
    </article>`;
  }).join('');

  // Wire expand buttons
  document.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const panel = document.getElementById('expanded-' + id);
      const isExpanded = panel.hidden === false;
      panel.hidden = isExpanded;
      btn.setAttribute('aria-expanded', !isExpanded);
      btn.querySelector('.expand-label').textContent = isExpanded ? '深入了解 ▼' : '收起 ▲';
    });
  });
}

// ===== FILTERS =====
function filterExhibitsByArea(area) {
  const cards = document.querySelectorAll('.exhibit-card');
  const speedActive = document.getElementById('speedModeBtn').classList.contains('speed-active');
  const activeRoute = document.querySelector('.route-filter-btn:not(.active)')?.dataset.route ||
    (document.querySelector('.route-filter-btn.active')?.dataset.route !== 'all'
      ? document.querySelector('.route-filter-btn.active')?.dataset.route : 'all');

  cards.forEach(card => {
    let show = area === 'all' || card.dataset.area === area;
    // Apply speed mode
    if (show && speedActive) {
      // Only show first card per area
      const firstOfArea = [...cards].filter(c => c.dataset.area === card.dataset.area)[0];
      show = card === firstOfArea;
    }
    // Apply route filter
    if (show && activeRoute !== 'all') {
      const routes = card.dataset.routes ? card.dataset.routes.split(',') : [];
      show = routes.includes(activeRoute);
    }
    card.style.display = show ? '' : 'none';
  });
}

function setupExhibitsFilter() {
  const filterBtns = document.querySelectorAll('.ex-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterExhibitsByArea(btn.dataset.areaFilter);
    });
  });
}

// ===== ROUTE FILTER (Phase 4) =====
function setupRouteFilter() {
  const routeBtns = document.querySelectorAll('.route-filter-btn[data-route]');
  routeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      routeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyAllFilters();
    });
  });

  // Random route
  document.getElementById('randomRouteBtn').addEventListener('click', () => {
    const works = window._allWorks || [];
    if (!works.length) return;
    // Pick 8 works, one from each area, prioritizing route diversity
    const routeKeys = ['color_structure', 'dream_surreal', 'modern_body', 'abstraction_zero', 'media_politics', 'chinese_response', 'music_rhythm'];
    const selected = [];
    const shuffled = [...works].sort(() => Math.random() - 0.5);
    shuffled.forEach(w => {
      if (selected.length >= 8) return;
      if (!selected.find(s => s.color_area === w.color_area)) {
        selected.push(w);
      }
    });
    // Fill remaining slots
    if (selected.length < 8) {
      shuffled.forEach(w => {
        if (selected.length >= 8) return;
        if (!selected.includes(w)) selected.push(w);
      });
    }
    // Show only selected
    document.querySelectorAll('.exhibit-card').forEach(card => {
      const id = card.querySelector('.expand-btn')?.dataset.id;
      card.style.display = selected.some(s => s.id === id) ? '' : 'none';
    });
    alert(`🎲 随机路线已生成！共 ${selected.length} 件作品，跨越 ${[...new Set(selected.map(s => s.color_area))].length} 个颜色展区。`);
  });

  // Speed mode
  document.getElementById('speedModeBtn').addEventListener('click', () => {
    const btn = document.getElementById('speedModeBtn');
    btn.classList.toggle('speed-active');
    const active = btn.classList.contains('speed-active');
    btn.textContent = active ? '⚡ 速看模式（开启）' : '⚡ 速看模式';
    applyAllFilters();
  });
}

function applyAllFilters() {
  const activeArea = document.querySelector('.ex-filter-btn.active')?.dataset.areaFilter || 'all';
  filterExhibitsByArea(activeArea);
}

// ===== ROUTES =====
function renderRoutes(routes) {
  const list = document.getElementById('routesList');
  if (!routes || routes.length === 0) { list.innerHTML = '<p style="color:#999;padding:2rem">暂无路线数据。</p>'; return; }

  list.innerHTML = routes.map(r => `
    <div class="route-card">
      <div class="route-header">
        <span class="route-name">${r.name}</span>
        <span class="route-name-en">${r.name_en || ''}</span>
        <span class="route-color-room" style="background:${COLOR_DOTS[r.color_room] || '#ccc'}">${COLOR_NAMES[r.color_room] || r.color_room}色</span>
      </div>
      <p class="route-desc">${r.description}</p>
      <div class="route-artists">
        ${(r.artists || []).map(a => `<span class="route-artist-tag">${a}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// ===== MUSIC (Phase 4 — new structure) =====
function renderMusic(musicData) {
  const list = document.getElementById('musicList');
  if (!musicData || musicData.length === 0) {
    list.innerHTML = '<p style="color:#999;padding:2rem">暂无音乐数据。</p>';
    return;
  }

  list.innerHTML = musicData.map(m => {
    const c = COLOR_DOTS[m.color_area] || '#ccc';
    const routeLabel = ROUTE_NAMES[m.route_tag] || m.route_tag || '';
    return `
    <div class="music-card" style="--mc:${c}" data-color="${m.color_area}">
      <div class="music-color-dot" style="--mc:${c}">${COLOR_NAMES[m.color_area] || m.color_area}</div>
      <div class="music-info">
        <div class="music-title">${m.title}</div>
        <div class="music-artist">${m.artist}</div>
        <div class="music-year-tag">${m.year}</div>
        ${routeLabel ? `<div class="music-route-tag">${routeLabel}</div>` : ''}
        ${m.why_it_fits ? `<div class="music-why" style="--mc:${c}">${m.why_it_fits}</div>` : ''}
        ${m.listening_note ? `<div class="music-note">💡 ${m.listening_note}</div>` : ''}
        ${m.best_for_works && m.best_for_works.length > 0 ? `
        <div class="music-best-works">
          <strong>最佳搭配展品：</strong>${m.best_for_works.map(wid => {
            const work = (window._allWorks || []).find(x => x.id === wid);
            return work ? `<span class="best-work-chip">${work.title}</span>` : `<span class="best-work-chip">${wid}</span>`;
          }).join('')}
        </div>` : ''}
      </div>
    </div>`;
  }).join('');
}

// ===== SOUNDSCAPES (Phase 4) =====
function renderSoundscapes(soundscapeData) {
  const grid = document.getElementById('soundscapesGrid');
  if (!soundscapeData || Object.keys(soundscapeData).length === 0) {
    grid.innerHTML = '<p style="color:#999;padding:2rem">音景数据加载中…</p>';
    return;
  }

  const ORDER = ['color', 'pink', 'blue', 'red', 'green', 'yellow', 'white', 'black'];
  grid.innerHTML = ORDER.map(key => {
    const s = soundscapeData[key];
    if (!s) return '';
    const c = COLOR_DOTS[key] || '#ccc';
    const name = COLOR_NAMES[key] || key;
    return `
    <div class="soundscape-card" data-area="${key}">
      <div class="soundscape-header" style="--sc:${c};background:${c}">
        <div class="soundscape-color-dot" style="background:${c}"></div>
        <div class="soundscape-area-name">${name}色展区</div>
        <div class="soundscape-area-en">${s.name_en || ''}</div>
      </div>
      <div class="soundscape-body">
        <div class="soundscape-direction">
          <span class="sd-label">🎧 听</span>
          <span class="sd-value">${s.direction}</span>
        </div>
        <div class="soundscape-feel">
          <span class="sf-label">💫 感受</span>
          <span class="sf-value">${s.feel}</span>
        </div>
        <div class="soundscape-recommendation">${s.recommendation || ''}</div>
      </div>
    </div>`;
  }).join('');
}

function setupMusicFilter() {
  const filterBtns = document.querySelectorAll('.music-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const cards = document.querySelectorAll('.music-card');
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.color === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ===== INTERSECTION OBSERVER =====
function setupObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('section').forEach(s => observer.observe(s));
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const { exhibits, music } = await loadData();

    const allWorks = exhibits.confirmed_site_guide_photo || [];
    window._allWorks = allWorks;

    renderColorAreaPanel(exhibits.color_areas, 'all');
    setupAreaTabs(exhibits.color_areas);

    renderExhibits(allWorks);
    setupExhibitsFilter();
    setupRouteFilter(); // Phase 4

    renderRoutes(exhibits.viewing_routes);

    // Phase 4: music.tracks instead of music.playlist
    renderMusic(music.tracks || music.playlist || []);
    setupMusicFilter();

    // Phase 4: area soundscapes
    renderSoundscapes(music.area_soundscapes || {});

    setupObserver();
  } catch (err) {
    console.error('Failed to load exhibition data:', err);
    const panel = document.getElementById('areaPanel');
    if (panel) panel.innerHTML = '<p style="color:#E63946;padding:2rem">数据加载失败（' + err.message + '），请刷新页面。</p>';
    const grid = document.getElementById('exhibitsGrid');
    if (grid) grid.innerHTML = '<p style="color:#E63946;padding:2rem">数据加载失败，请刷新页面重试。</p>';
  }
});
