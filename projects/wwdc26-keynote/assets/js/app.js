/* ============================================
   WWDC26 Interactive Page — JavaScript
   ============================================ */

(function() {
  'use strict';

  /* ---- Load Data ---- */
  let WWDC_DATA = null;
  async function loadData() {
    try {
      const r = await fetch('data/wwdc26.json');
      WWDC_DATA = await r.json();
    } catch(e) {
      console.warn('Failed to load wwdc26.json', e);
    }
  }

  /* ---- Init All ---- */
  async function init() {
    await loadData();
    if (!WWDC_DATA) return;

    buildAnnounceGrid();
    buildCapabilityMatrix();
    buildAIAppsGrid();
    buildPlatformTabs();
    buildChildSafetyCards();
    buildPerfGrid();
    buildArchitectureMap();
    buildAnalysis();
    buildSources();
    buildFeatureFilter();
    initScrollReveal();
    initProgressBar();
    initThemeToggle();
    initSearchPalette();
    initGlassSlider();
    initAvailabilityChecker();
    initSourceDrawer();
    initNav();
  }

  /* ---- Progress Bar ---- */
  function initProgressBar() {
    const fill = document.getElementById('progressFill');
    if (!fill) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* ---- Theme Toggle ---- */
  function initThemeToggle() {
    const btn = document.getElementById('themeBtn');
    if (!btn) return;
    // Follow system preference initially
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('wwdc26-theme');
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.body.dataset.theme = theme;
    btn.addEventListener('click', () => {
      const current = document.body.dataset.theme;
      const next = current === 'dark' ? 'light' : 'dark';
      document.body.dataset.theme = next;
      localStorage.setItem('wwdc26-theme', next);
    });
  }

  /* ---- Scroll Reveal ---- */
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section > .container > *:not(.hero)').forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  /* ---- Sticky Nav ---- */
  function initNav() {
    const nav = document.getElementById('stickyNav');
    if (!nav) return;
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      nav.style.borderBottomColor = scroll > 50 ? 'var(--glass-border)' : 'transparent';
      lastScroll = scroll;
    }, { passive: true });
    // Smooth scroll for nav links
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  }

  /* ---- Search Palette ---- */
  function initSearchPalette() {
    const palette = document.getElementById('cmdPalette');
    const input = document.getElementById('cmdInput');
    const results = document.getElementById('cmdResults');
    const searchBtn = document.getElementById('searchBtn');
    if (!palette || !input) return;

    const allSections = [
      { id: 'overview', label: '发布会概览', section: 'overview' },
      { id: 'top10', label: '十大发布重点', section: 'top10' },
      { id: 'siri-deep', label: 'Siri AI 深度拆解', section: 'siri-deep' },
      { id: 'ai-apps', label: 'Apple Intelligence 应用', section: 'ai-apps' },
      { id: 'platforms', label: '平台更新', section: 'platforms' },
      { id: 'child-safety', label: '儿童安全', section: 'child-safety' },
      { id: 'performance', label: '性能与设计', section: 'performance' },
      { id: 'developer', label: '开发者框架', section: 'developer' },
      { id: 'availability', label: '可用性查询', section: 'availability' },
      { id: 'analysis', label: '产品分析', section: 'analysis' },
      { id: 'sources', label: '来源', section: 'sources' },
    ];

    function openPalette() { palette.classList.add('open'); input.focus(); }
    function closePalette() { palette.classList.remove('open'); input.value = ''; renderResults(''); }

    searchBtn?.addEventListener('click', openPalette);
    document.addEventListener('keydown', e => {
      if ((e.key === '/' || e.key === 'k') && (e.metaKey || e.ctrlKey || e.key === '/')) {
        e.preventDefault(); openPalette();
      }
      if (e.key === 'Escape') closePalette();
    });
    input.addEventListener('input', () => renderResults(input.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const first = results.querySelector('.cmd-result-item');
        first?.click();
      }
    });

    function renderResults(query) {
      const q = query.toLowerCase().trim();
      const filtered = q ? allSections.filter(s => s.label.toLowerCase().includes(q) || s.id.includes(q)) : allSections;
      results.innerHTML = filtered.map((s, i) => `
        <div class="cmd-result-item${i === 0 ? ' active' : ''}" data-id="${s.id}">
          <span>${s.label}</span>
          <span class="cmd-section">${s.section}</span>
        </div>
      `).join('');
      results.querySelectorAll('.cmd-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const el = document.getElementById(item.dataset.id);
          if (el) { el.scrollIntoView({ behavior: 'smooth' }); closePalette(); }
        });
      });
    }
    renderResults('');
  }

  /* ---- Build: Top 10 Announcements ---- */
  function buildAnnounceGrid() {
    const grid = document.getElementById('announceGrid');
    if (!grid || !WWDC_DATA) return;
    const items = WWDC_DATA.keyAnnouncements;
    grid.innerHTML = items.map((a, i) => `
      <div class="announce-card" data-platforms="${a.platform.join(',')}">
        <div class="announce-num">0${i + 1}</div>
        <h3 class="announce-title">${a.title}</h3>
        <p class="announce-desc">${a.summary}</p>
        <div class="announce-meta">
          ${a.platform.map(p => `<span class="announce-platform">${p}</span>`).join('')}
          <span class="announce-layer layer-${a.layer.includes('用户') ? 'user' : a.layer.includes('开发者') ? 'developer' : 'eco'}">${a.layer}</span>
        </div>
      </div>
    `).join('');
  }

  /* ---- Build: Capability Matrix ---- */
  function buildCapabilityMatrix() {
    const matrix = document.getElementById('capabilityMatrix');
    if (!matrix || !WWDC_DATA) return;
    matrix.innerHTML = WWDC_DATA.siriAICapabilities.map((cap, i) => `
      <div class="cap-card" data-index="${i}">
        <div class="cap-header">
          <h4>${cap.capability}</h4>
          <span class="cap-expand">+</span>
        </div>
        <div class="cap-detail">
          <div class="cap-detail-grid">
            <div class="cap-detail-item">
              <label>用户能做什么</label>
              <p>${cap.userAction}</p>
            </div>
            <div class="cap-detail-item">
              <label>系统意义</label>
              <p>${cap.systemMeaning}</p>
            </div>
          </div>
          <span class="cap-availability">${cap.availability}</span>
        </div>
      </div>
    `).join('');
    matrix.querySelectorAll('.cap-header').forEach(h => {
      h.addEventListener('click', () => {
        const card = h.closest('.cap-card');
        card.classList.toggle('open');
      });
    });
  }

  /* ---- Build: AI Apps Grid ---- */
  function buildAIAppsGrid() {
    const grid = document.getElementById('aiAppsGrid');
    if (!grid || !WWDC_DATA) return;
    grid.innerHTML = WWDC_DATA.appleIntelligenceFeatures.map(f => `
      <div class="ai-app-card" data-type="${f.type}">
        <div class="ai-app-app">${f.app}</div>
        <h3 class="ai-app-feature">${f.feature}</h3>
        <p class="ai-app-desc">${f.description}</p>
      </div>
    `).join('');
  }

  /* ---- Build: Platform Tabs ---- */
  function buildPlatformTabs() {
    const tabs = document.querySelectorAll('.platform-tab');
    const content = document.getElementById('platformContent');
    if (!tabs.length || !content || !WWDC_DATA) return;

    function renderPlatform(id) {
      const p = WWDC_DATA.platformUpdates[id];
      if (!p) return '';
      return `
        <h3 class="platform-hl">${p.title}</h3>
        ${p.highlights.map(h => `<p class="platform-detail">${h}</p>`).join('')}
        <div style="margin-top:16px">
          ${p.details.map(d => `<p class="platform-detail">${d}</p>`).join('')}
        </div>
      `;
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        content.innerHTML = renderPlatform(tab.dataset.platform);
      });
    });
    // Default: show iOS 27
    content.innerHTML = renderPlatform('ios27');
  }

  /* ---- Build: Child Safety Cards ---- */
  function buildChildSafetyCards() {
    const cards = document.getElementById('safetyCards');
    if (!cards || !WWDC_DATA) return;
    cards.innerHTML = WWDC_DATA.childSafety.features.map(f => `
      <div class="safety-card">
        <h4>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          ${f.name}
        </h4>
        <p>${f.description}</p>
      </div>
    `).join('');
  }

  /* ---- Build: Performance Grid ---- */
  function buildPerfGrid() {
    const grid = document.getElementById('perfGrid');
    if (!grid || !WWDC_DATA) return;
    grid.innerHTML = WWDC_DATA.performanceDesign.numbers.map(n => `
      <div class="perf-item">
        <div class="perf-number">${n.improvement}</div>
        <div class="perf-metric">${n.metric}</div>
        <div class="perf-device">${n.device}</div>
      </div>
    `).join('');
  }

  /* ---- Build: Architecture Map ---- */
  function buildArchitectureMap() {
    const map = document.getElementById('archMap');
    const details = document.getElementById('archDetails');
    if (!map || !WWDC_DATA) return;

    const nodes = [
      { id: 'user-intent', label: '用户意图', color: '#6e6e73' },
      { id: 'siri-ai', label: 'Siri AI', color: '#0071e3' },
      { id: 'apple-intel', label: 'Apple Intelligence', color: '#5856d6' },
      { id: 'app-intents', label: 'App Intents', color: '#34c759' },
      { id: 'spotlight', label: 'Spotlight', color: '#ff9500' },
      { id: 'foundation', label: 'Foundation Models', color: '#ff2d55' },
      { id: 'core-ai', label: 'Core AI', color: '#af52de' },
      { id: 'app-actions', label: 'App Actions', color: '#00c7be' },
      { id: 'pcc', label: 'Private Cloud Compute', color: '#64d2ff' },
    ];

    map.innerHTML = nodes.map(n => `<button class="arch-node" data-id="${n.id}" style="border-left: 3px solid ${n.color}">${n.label}</button>`).join('');
    map.innerHTML += `<span class="arch-arrow">→</span>`.repeat(2) + `<button class="arch-node" data-id="local-model" style="border-left: 3px solid #64d2ff">Local Model</button>`;

    const detailData = {
      'user-intent': { title: '用户意图', desc: '用户通过自然语言表达需求，是整个系统的入口。' },
      'siri-ai': { title: 'Siri AI', desc: 'Apple Intelligence 驱动的全新 Siri，理解自然对话、屏幕感知、个人上下文、跨 App 执行动作。' },
      'apple-intel': { title: 'Apple Intelligence', desc: '系统级 AI 能力，渗透到 iOS/iPadOS/macOS/watchOS/visionOS 的每一个系统 App 和操作。' },
      'app-intents': { title: 'App Intents', desc: '让第三方 App 接入 Siri，Entity schemas 让内容进入 Spotlight 语义索引，Intent schemas 让行为被自然语言调用。' },
      'spotlight': { title: 'Spotlight 语义索引', desc: '整合个人数据（消息、邮件、照片、App 内容），在隐私保护下提供语义搜索。' },
      'foundation': { title: 'Foundation Models', desc: '原生 Swift API，访问 on-device 模型，支持 Claude/Gemini 等云端模型，Multimodal prompts。' },
      'core-ai': { title: 'Core AI', desc: 'OS 内置框架，为 Apple Silicon 设计，完全设备端运行，无服务器依赖，保护用户数据。' },
      'app-actions': { title: 'App Actions', desc: 'Siri 调用第三方 App 执行具体动作，如发消息、创建笔记、设置提醒。' },
      'pcc': { title: 'Private Cloud Compute', desc: '隐私保护的云端 AI 计算，Small Business Program 用户可免费使用云端 Apple Foundation Models。' },
      'local-model': { title: 'Local Model', desc: 'Apple Silicon 专用模型，完全设备端运行，无 token 成本，数据不离设备。' },
    };

    map.querySelectorAll('.arch-node').forEach(node => {
      node.addEventListener('click', () => {
        map.querySelectorAll('.arch-node').forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        const d = detailData[node.dataset.id];
        if (d) {
          details.innerHTML = `<div class="arch-detail-card"><h4>${d.title}</h4><p>${d.desc}</p></div>`;
        }
      });
    });
  }

  /* ---- Build: Analysis ---- */
  function buildAnalysis() {
    const thesis = document.getElementById('analysisThesis');
    const points = document.getElementById('analysisPoints');
    if (!thesis || !points || !WWDC_DATA) return;

    thesis.textContent = WWDC_DATA.interpretation.coreThesis;
    points.innerHTML = WWDC_DATA.interpretation.points.map(p => `
      <div class="analysis-point">
        <h3>${p.title}</h3>
        <p>${p.content}</p>
      </div>
    `).join('');
  }

  /* ---- Build: Sources ---- */
  function buildSources() {
    const grid = document.getElementById('sourcesGrid');
    const drawerSources = document.getElementById('drawerSources');
    if (!grid || !WWDC_DATA) return;

    const html = WWDC_DATA.sources.map((s, i) => `
      <div class="source-item" data-source-id="${s.id}">
        <div class="source-num">S${String(i + 1).padStart(2, '0')}</div>
        <div>
          <h4>${s.title}</h4>
          <p class="source-name">${s.source}</p>
          <a href="${s.url}" target="_blank" rel="noopener">${s.url}</a>
        </div>
      </div>
    `).join('');
    grid.innerHTML = html;
    if (drawerSources) drawerSources.innerHTML = html;

    // Add superscript numbers to content sections
    document.querySelectorAll('[data-source-id]').forEach(el => {
      const num = el.dataset.sourceId;
      const sourceItem = WWDC_DATA.sources.find(s => s.id === num);
      if (!sourceItem) return;
    });
  }

  /* ---- Build: Feature Filter ---- */
  function buildFeatureFilter() {
    const filterTags = document.getElementById('filterTags');
    const itemsContainer = document.getElementById('filteredItems');
    if (!filterTags || !itemsContainer || !WWDC_DATA) return;

    const allFeatures = [
      // AI features
      { icon: '🤖', label: 'Siri AI', type: 'AI', sub: '自然对话 + 屏幕感知 + 跨 App 执行' },
      { icon: '🎨', label: 'Image Playground', type: 'AI', sub: 'photorealistic style + describe to change' },
      { icon: '🔍', label: 'Safari Notify Me', type: 'AI', sub: '网页变化监控，补货/降价通知' },
      { icon:'✉️', label: 'Messages 一键建议', type: 'AI', sub: '基于上下文创建提醒/笔记' },
      { icon: '📬', label: 'Mail Top Hits 排名', type: 'AI', sub: '搜索结果相关性提升' },
      { icon: '📸', label: 'Photos Spatial Reframing', type: 'AI', sub: '拍完后重新智能构图' },
      { icon: '🧹', label: 'Photos Clean Up 升级', type: 'AI', sub: '更精准移除不需要的元素' },
      { icon: '🗺️', label: 'Apple Maps Flyover 增强', type: 'AI', sub: 'AI + 航拍影像，更详细建筑细节' },
      { icon: '🏠', label: 'Home App AI', type: 'AI', sub: '智能合并通知、描述录像、AI搜索' },
      // OS
      { icon: '📱', label: 'iOS 27', type: 'OS', sub: 'Siri AI + Camera mode + AI 编辑 + 儿童安全' },
      { icon: '📲', label: 'iPadOS 27', type: 'OS', sub: 'Siri AI + 外接硬盘 5x 提速 + Visual Intelligence' },
      { icon: '💻', label: 'macOS 27 Golden Gate', type: 'OS', sub: 'Siri AI + Visual Intelligence + 统一 toolbar' },
      { icon: '⌚', label: 'watchOS 27', type: 'OS', sub: 'Siri AI + Dynamic app grid + Find My 整合' },
      { icon: '🥽', label: 'visionOS 27', type: 'OS', sub: 'Siri AI + 全景转空间场景 + Wi-Fi 3x 提速' },
      // Safety
      { icon: '🛡️', label: 'Child Account Setup', type: 'Safety', sub: '简化设置，推荐 App 组合' },
      { icon:'🌐', label: 'Ask to Browse', type: 'Safety', sub: '网页浏览需家长批准' },
      { icon: '⏰', label: 'Time Allowances', type: 'Safety', sub: '娱乐/游戏/社交每日时长上限' },
      { icon: '📅', label: 'Schedules', type: 'Safety', sub: '使用时间段设置（如上课时间）' },
      { icon: '🔒', label: 'Screen Time Redesigned', type: 'Safety', sub: '全新设计家长控制界面' },
      // Developer
      { icon: '🔧', label: 'Foundation Models API', type: 'Developer', sub: 'Swift API 访问 on-device 模型 + Claude/Gemini' },
      { icon: '🔌', label: 'App Intents', type: 'Developer', sub: '第三方 App 接入 Siri 和 Spotlight 语义索引' },
      { icon: '⚡', label: 'Core AI', type: 'Developer', sub: '设备端模型运行框架，无 token 成本' },
      { icon:'👁️', label: 'Visual Intelligence API', type: 'Developer', sub: '屏幕/相机/图像理解' },
      // Performance
      { icon: '🚀', label: 'App 启动提速30%', type: 'Performance', sub: 'iPhone / iPad' },
      { icon: '📷', label: 'Photos 加载提速 70%', type: 'Performance', sub: '拍摄后立即查看' },
      { icon: '📡', label: 'AirDrop 提速 80%', type: 'Performance', sub: '无 Wi-Fi 网络下的文件传输' },
      { icon: '💾', label: 'iPad 外接硬盘 5x', type: 'Performance', sub: 'Files app 浏览和传输' },
      // Design
      { icon: '✨', label: 'Liquid Glass', type: 'Design', sub: 'ultra-clear → fully tinted 可调透明度' },
      { icon: '🎯', label: 'App icons 更清晰', type: 'Design', sub: '锐度和定义感提升' },
      { icon: '🔲', label: 'Mac toolbar 统一', type: 'Design', sub: 'edge-to-edge sidebars + colored icons' },
      // Health
      { icon: '❤️', label: 'Health Cycle Tracking', type: 'Health', sub: 'perimenopause / menopause 支持' },
      { icon: '🎧', label: 'AirPods Custom EQ', type: 'Health', sub: '个性化声音调整' },
      { icon: '🏋️', label: 'GymKit on iPhone', type: 'Health', sub: '连接健身设备获取精准数据' },
      // Photos
      { icon: '📸', label: 'Spatial Reframing', type: 'Photos', sub: '智能重新构图' },
      { icon: '🧹', label: 'Clean Up 升级', type: 'Photos', sub: '精准移除元素' },
      { icon: '�album', label: 'iCloud Shared Albums', type: 'Photos', sub: '跨平台完整分辨率分享' },
      // Safari
      { icon: '🔔', label: 'Notify Me', type: 'Safari', sub: '网页变化监控通知' },
      // Messages
      { icon: '💬', label: '一键建议', type: 'Messages', sub: '上下文感知创建提醒/笔记' },
      // Vision
      { icon: '🌄', label: '全景转空间场景', type: 'Vision', sub: 'Apple Vision Pro' },
      { icon: '🏠', label: 'Personal Environments', type: 'Vision', sub: 'Apple Vision Pro' },
    ];

    function renderItems(filter) {
      const filtered = filter === 'all' ? allFeatures : allFeatures.filter(f => f.type === filter);
      itemsContainer.innerHTML = filtered.map(f => `
        <div class="filtered-item">
          <span class="fi-icon">${f.icon}</span>
          <div>
            <div class="fi-label">${f.label}</div>
            <div class="fi-type">${f.sub}</div>
          </div>
        </div>
      `).join('');
    }

    renderItems('all');
    filterTags.querySelectorAll('.filter-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        filterTags.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        renderItems(tag.dataset.filter);
      });
    });
  }

  /* ---- Glass Slider ---- */
  function initGlassSlider() {
    const slider = document.getElementById('glassSlider');
    const cards = document.getElementById('glassDemoCards');
    if (!slider || !cards) return;

    function getGlassStyle(val) {
      const alpha = val / 100;
      const r = Math.round(255 * (1 - alpha) + 255 * alpha);
      const g = Math.round(255 * (1 - alpha) + 255 * alpha);
      const b = Math.round(255 * (1 - alpha) + 255 * alpha);
      const borderAlpha = 0.1 + alpha * 0.4;
      return {
        background: `rgba(${Math.round(255 * (1 - alpha * 0.9))}, ${Math.round(255 * (1 - alpha * 0.9))}, ${Math.round(255 * (1 - alpha * 0.95))}, ${0.5 + alpha * 0.4})`,
        border: `1px solid rgba(0,0,0,${borderAlpha.toFixed(2)})`,
        backdropFilter: `blur(${Math.round(10 + alpha * 20)}px)`,
      };
    }

    function updateGlass() {
      const val = parseInt(slider.value);
      const cards_ = cards.querySelectorAll('.glass-card');
      const [ultra, med, tinted] = cards_;
      const uStyle = getGlassStyle(Math.max(0, val - 20));
      const mStyle = getGlassStyle(val);
      const tStyle = getGlassStyle(Math.min(100, val + 20));
      Object.assign(ultra.style, uStyle);
      Object.assign(med.style, mStyle);
      Object.assign(tinted.style, tStyle);
    }

    slider.addEventListener('input', updateGlass);
    updateGlass();
  }

  /* ---- Availability Checker ---- */
  function initAvailabilityChecker() {
    const btn = document.getElementById('avCheckBtn');
    const results = document.getElementById('avResults');
    if (!btn || !results) return;

    btn.addEventListener('click', () => {
      const region = document.getElementById('avRegion').value;
      const language = document.getElementById('avLanguage').value;
      const device = document.getElementById('avDevice').value;

      const unsupported = ['OLD'];
      const aiCapable = ['IP16', 'IP15P', 'IPM', 'MAC', 'VP', 'WATCH'];

      const results_list = [];

      // Apple Intelligence
      if (unsupported.includes(device)) {
        results_list.push({ label: 'Apple Intelligence', status: 'unavailable', note: '设备不支持 Apple Intelligence（需要 iPhone 15 Pro 或更新）' });
      } else if (region === 'CN') {
        results_list.push({ label: 'Apple Intelligence', status: 'unavailable', note: '中国大陆暂不可用（Apple 正在处理监管要求）' });
      } else if (language !== 'EN' && language !== 'ZH') {
        results_list.push({ label: 'Apple Intelligence', status: 'limited', note: `当前支持16 种语言，${language === 'JA' ? '日语' : language === 'KO' ? '韩语' : '部分语言'}可用，部分功能可能受限` });
      } else {
        results_list.push({ label: 'Apple Intelligence', status: 'available', note: '今年秋季随 iOS 27 等系统更新推出' });
      }

      // Siri AI
      if (unsupported.includes(device)) {
        results_list.push({ label: 'Siri AI', status: 'unavailable', note: '设备不支持' });
      } else if (region === 'CN') {
        results_list.push({ label: 'Siri AI', status: 'unavailable', note: '中国大陆暂不可用（监管原因）' });
      } else if (region === 'EU' && ['ios27', 'ipados27'].some(() => false)) {
        if (device === 'MAC' || device === 'VP' || device === 'WATCH') {
          results_list.push({ label: 'Siri AI', status: 'available', note: 'EU地区 Mac / Watch / Vision Pro 可用' });
        } else {
          results_list.push({ label: 'Siri AI', status: 'unavailable', note: 'EU 地区 iOS / iPadOS 初期不可用' });
        }
      } else if (language !== 'EN') {
        results_list.push({ label: 'Siri AI', status: 'beta', note: 'Siri AI 今年晚些时候推出英文 Beta，其他语言逐步支持' });
      } else {
        results_list.push({ label: 'Siri AI', status: 'beta', note: '今年晚些时候推出英文 Beta' });
      }

      // Image Generation
      if (unsupported.includes(device)) {
        results_list.push({ label: '图像生成（Image Playground 等）', status: 'unavailable', note: '设备不支持' });
      } else {
        results_list.push({ label: '图像生成', status: 'limited', note: '有每日使用限额，iCloud+ 订阅可增加额度' });
      }

      results.innerHTML = results_list.map(r => `
        <div class="av-result-item">
          <span class="av-status-dot ${r.status}"></span>
          <div>
            <strong>${r.label}</strong>
            <p style="font-size:13px;color:var(--text-secondary);margin-top:2px">${r.note}</p>
          </div>
        </div>
      `).join('');
    });
  }

  /* ---- Source Drawer ---- */
  function initSourceDrawer() {
    const drawer = document.getElementById('sourceDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const closeBtn = document.getElementById('drawerClose');
    if (!drawer) return;
    // Find any source reference buttons and hook them
    document.querySelectorAll('[data-open-sources]').forEach(btn => {
      btn.addEventListener('click', () => {
        drawer.classList.add('open');
        overlay?.classList.add('open');
      });
    });
    function close() {
      drawer.classList.remove('open');
      overlay?.classList.remove('open');
    }
    closeBtn?.addEventListener('click', close);
    overlay?.addEventListener('click', close);
  }

  /* ---- Run ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();