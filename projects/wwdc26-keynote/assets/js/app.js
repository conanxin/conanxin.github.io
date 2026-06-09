/* ============================================
   WWDC26 Interactive Page — JavaScript v2.5
   ============================================ */

(function() {
  'use strict';

  /* ---- Load Data ---- */
  let WWDC_DATA = null;
  async function loadData() {
    try {
      const r = await fetch('data/wwdc26.json?v=phase61');
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
    initMobileNav();
    initSourceTags();
    initFocusTrap();
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
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('wwdc26-theme');
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.body.dataset.theme = theme;
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.addEventListener('click', () => {
      const current = document.body.dataset.theme;
      const next = current === 'dark' ? 'light' : 'dark';
      document.body.dataset.theme = next;
      localStorage.setItem('wwdc26-theme', next);
      btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
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

  /* ---- Mobile Nav ---- */
  function initMobileNav() {
    const menuBtn = document.getElementById('navMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (!menuBtn || !navLinks) return;
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.hidden === false;
      navLinks.hidden = isOpen;
      menuBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Source Tags ---- */
  function initSourceTags() {
    document.querySelectorAll('.src-tag[data-source]').forEach(tag => {
      tag.style.cursor = 'pointer';
      tag.setAttribute('role', 'button');
      tag.setAttribute('tabindex', '0');
      tag.setAttribute('aria-label', `查看来源 ${tag.dataset.source}`);
      tag.addEventListener('click', () => {
        openSourceDrawer();
        scrollToSource(tag.dataset.source);
      });
      tag.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openSourceDrawer();
          scrollToSource(tag.dataset.source);
        }
      });
    });
  }

  function scrollToSource(sourceId) {
    const el = document.querySelector(`[data-source-id="${sourceId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.background = 'var(--tag-bg)';
      setTimeout(() => { el.style.background = ''; }, 2000);
    }
  }

  function openSourceDrawer() {
    const drawer = document.getElementById('sourceDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (drawer) {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
    }
    if (overlay) {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
    }
  }

  /* ---- Focus Trap for Command Palette ---- */
  function initFocusTrap() {
    const palette = document.getElementById('cmdPalette');
    if (!palette) return;

    palette.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        const focusable = palette.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---- Sticky Nav ---- */
  function initNav() {
    const nav = document.getElementById('stickyNav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.style.borderBottomColor = window.scrollY > 50 ? 'var(--glass-border)' : 'transparent';
    }, { passive: true });
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

    function openPalette() {
      palette.hidden = false;
      palette.classList.add('open');
      palette.setAttribute('aria-hidden', 'false');
      input.focus();
    }
    function closePalette() {
      palette.hidden = true;
      palette.classList.remove('open');
      palette.setAttribute('aria-hidden', 'true');
      input.value = '';
      renderResults('');
    }

    searchBtn?.addEventListener('click', openPalette);
    document.addEventListener('keydown', e => {
      if (e.key === '/' && !e.target.matches('input, textarea, [contenteditable]')) {
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
        <div class="cmd-result-item${i === 0 ? ' active' : ''}" data-id="${s.id}" role="option" aria-selected="${i === 0}">
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
    grid.innerHTML = WWDC_DATA.keyAnnouncements.map((a, i) => `
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

  /* ---- Build: Capability Matrix (buttons for a11y) ---- */
  function buildCapabilityMatrix() {
    const matrix = document.getElementById('capabilityMatrix');
    if (!matrix || !WWDC_DATA) return;

    matrix.innerHTML = WWDC_DATA.siriAICapabilities.map((cap, i) => `
      <div class="cap-card${i === 0 ? ' is-open' : ''}" data-index="${i}">
        <button class="cap-header" aria-expanded="${i === 0}" aria-controls="cap-detail-${i}">
          <h4>${cap.capability}</h4>
          <span class="cap-expand" aria-hidden="true">+</span>
        </button>
        <div class="cap-detail" id="cap-detail-${i}"${i === 0 ? '' : ' hidden'}>
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

    // Delegate click on the whole matrix (event delegation for stability)
    matrix.addEventListener('click', e => {
      const header = e.target.closest('.cap-header');
      if (!header) return;
      const card = header.closest('.cap-card');
      const detail = card.querySelector('.cap-detail');
      const isOpen = card.classList.contains('is-open');

      // Toggle this card
      card.classList.toggle('is-open', !isOpen);
      detail.hidden = isOpen;
      header.setAttribute('aria-expanded', String(!isOpen));
      header.querySelector('.cap-expand').textContent = isOpen ? '+' : '−';
    });

    // Keyboard support: Enter/Space on the button
    matrix.addEventListener('keydown', e => {
      const header = e.target.closest('.cap-header');
      if (!header) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
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

  /* ---- Build: Platform Tabs (ARIA sync) ---- */
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
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        content.innerHTML = renderPlatform(tab.dataset.platform);
        content.setAttribute('aria-label', tab.textContent + ' 详情');
      });
      // Arrow key navigation
      tab.addEventListener('keydown', e => {
        const tabList = Array.from(tabs);
        const idx = tabList.indexOf(tab);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          tabList[(idx + 1) % tabList.length].focus();
          tabList[(idx + 1) % tabList.length].click();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          tabList[(idx - 1 + tabList.length) % tabList.length].focus();
          tabList[(idx - 1 + tabList.length) % tabList.length].click();
        }
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
      <div class="safety-card" role="listitem">
        <h4>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
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
      <div class="perf-item" role="listitem">
        <div class="perf-number">${n.improvement}</div>
        <div class="perf-metric">${n.metric}</div>
        <div class="perf-device">${n.device}</div>
      </div>
    `).join('');
  }

  /* ---- Build: Architecture Map ---- */
  function buildArchitectureMap() {
    // Handle the swimlane architecture (#archLayers) and detail panel (#archDetails)
    const layers = document.getElementById('archLayers');
    const details = document.getElementById('archDetails');
    if (!layers || !WWDC_DATA) return;

    const detailData = {
      'user-intent':  { title: '用户意图', desc: '用户通过自然语言表达需求，是整个系统的入口。' },
      'siri-ai':      { title: 'Siri AI', desc: 'Apple Intelligence 驱动的全新 Siri，理解自然对话、屏幕感知、个人上下文、跨 App 执行动作。' },
      'apple-intel':  { title: 'Apple Intelligence', desc: '系统级 AI 能力，渗透到 iOS/iPadOS/macOS/watchOS/visionOS 的每一个系统 App 和操作。' },
      'app-intents':  { title: 'App Intents', desc: '让第三方 App 接入 Siri，Entity schemas 让内容进入 Spotlight 语义索引，Intent schemas 让行为被自然语言调用。' },
      'spotlight':    { title: 'Spotlight 语义索引', desc: '整合个人数据（消息、邮件、照片、App 内容），在隐私保护下提供语义搜索。' },
      'foundation':   { title: 'Foundation Models', desc: '原生 Swift API，访问 on-device 模型，支持 Claude/Gemini 等云端模型，Multimodal prompts。' },
      'core-ai':      { title: 'Core AI', desc: 'OS 内置框架，为 Apple Silicon 设计，完全设备端运行，无服务器依赖，保护用户数据。' },
      'app-actions':  { title: 'App Actions', desc: 'Siri 调用第三方 App 执行具体动作，如发消息、创建笔记、设置提醒。' },
      'pcc':          { title: 'Private Cloud Compute', desc: '隐私保护的云端 AI 计算，Small Business Program 用户可免费使用云端 Apple Foundation Models。' },
      'local-model':  { title: 'Local Model', desc: 'Apple Silicon 专用模型，完全设备端运行，无 token 成本，数据不离设备。' },
    };

    function showDetail(id) {
      const d = detailData[id];
      if (!d) return;
      const iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`;
      details.innerHTML = `
        <div class="arch-detail-card arch-detail-highlight">
          <div class="arch-detail-icon" aria-hidden="true">${iconSvg}</div>
          <h4>${d.title}</h4>
          <p>${d.desc}</p>
        </div>
      `;
    }

    // Wire up click on all arch-node buttons in the swimlane
    layers.querySelectorAll('.arch-node').forEach(node => {
      node.addEventListener('click', () => {
        // Deactivate all nodes
        layers.querySelectorAll('.arch-node').forEach(n => {
          n.classList.remove('arch-node-active');
          n.setAttribute('aria-pressed', 'false');
        });
        // Activate clicked node
        node.classList.add('arch-node-active');
        node.setAttribute('aria-pressed', 'true');
        showDetail(node.dataset.id);
      });
      // Keyboard
      node.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); node.click(); }
      });
    });

    // Default: Siri AI is active, show its detail
    const defaultNode = layers.querySelector('[data-id="siri-ai"]');
    if (defaultNode) {
      defaultNode.classList.add('arch-node-active');
      defaultNode.setAttribute('aria-pressed', 'true');
      showDetail('siri-ai');
    }
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
      <div class="source-item" data-source-id="${s.id}" role="article">
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
  }

  /* ---- Build: Feature Filter ---- */
  function buildFeatureFilter() {
    const filterTags = document.getElementById('filterTags');
    const itemsContainer = document.getElementById('filteredItems');
    if (!filterTags || !itemsContainer || !WWDC_DATA) return;

    const allFeatures = [
      { icon: '🤖', label: 'Siri AI', type: 'AI', sub: '自然对话 + 屏幕感知 + 跨 App 执行' },
      { icon: '🎨', label: 'Image Playground', type: 'AI', sub: 'photorealistic style + describe to change' },
      { icon: '🔍', label: 'Safari Notify Me', type: 'AI', sub: '网页变化监控，补货/降价通知' },
      { icon: '✉️', label: 'Messages 一键建议', type: 'AI', sub: '基于上下文创建提醒/笔记' },
      { icon: '📬', label: 'Mail Top Hits 排名', type: 'AI', sub: '搜索结果相关性提升' },
      { icon: '📸', label: 'Photos Spatial Reframing', type: 'AI', sub: '拍完后重新智能构图' },
      { icon: '🧹', label: 'Photos Clean Up 升级', type: 'AI', sub: '更精准移除不需要的元素' },
      { icon: '🗺️', label: 'Apple Maps Flyover 增强', type: 'AI', sub: 'AI + 航拍影像，更详细建筑细节' },
      { icon: '🏠', label: 'Home App AI', type: 'AI', sub: '智能合并通知、描述录像、AI搜索' },
      { icon: '📱', label: 'iOS 27', type: 'OS', sub: 'Siri AI + Camera mode + AI 编辑 + 儿童安全' },
      { icon: '📲', label: 'iPadOS 27', type: 'OS', sub: 'Siri AI + 外接硬盘 5x 提速 + Visual Intelligence' },
      { icon: '💻', label: 'macOS 27 Golden Gate', type: 'OS', sub: 'Siri AI + Visual Intelligence + 统一 toolbar' },
      { icon: '⌚', label: 'watchOS 27', type: 'OS', sub: 'Siri AI + Dynamic app grid + Find My 整合' },
      { icon: '🥽', label: 'visionOS 27', type: 'OS', sub: 'Siri AI + 全景转空间场景 + Wi-Fi 3x 提速' },
      { icon: '🛡️', label: 'Child Account Setup', type: 'Safety', sub: '简化设置，推荐 App 组合' },
      { icon: '🌐', label: 'Ask to Browse', type: 'Safety', sub: '网页浏览需家长批准' },
      { icon: '⏰', label: 'Time Allowances', type: 'Safety', sub: '娱乐/游戏/社交每日时长上限' },
      { icon: '📅', label: 'Schedules', type: 'Safety', sub: '使用时间段设置（如上课时间）' },
      { icon: '🔒', label: 'Screen Time Redesigned', type: 'Safety', sub: '全新设计家长控制界面' },
      { icon: '🔧', label: 'Foundation Models API', type: 'Developer', sub: 'Swift API 访问 on-device 模型 + Claude/Gemini' },
      { icon: '🔌', label: 'App Intents', type: 'Developer', sub: '第三方 App 接入 Siri 和 Spotlight 语义索引' },
      { icon: '⚡', label: 'Core AI', type: 'Developer', sub: '设备端模型运行框架，无 token 成本' },
      { icon: '👁️', label: 'Visual Intelligence API', type: 'Developer', sub: '屏幕/相机/图像理解' },
      { icon: '🚀', label: 'App 启动提速30%', type: 'Performance', sub: 'iPhone / iPad' },
      { icon: '📷', label: 'Photos 加载提速 70%', type: 'Performance', sub: '拍摄后立即查看' },
      { icon: '📡', label: 'AirDrop 提速 80%', type: 'Performance', sub: '无 Wi-Fi 网络下的文件传输' },
      { icon: '💾', label: 'iPad 外接硬盘 5x', type: 'Performance', sub: 'Files app 浏览和传输' },
      { icon: '✨', label: 'Liquid Glass', type: 'Design', sub: 'ultra-clear → fully tinted 可调透明度' },
      { icon: '🎯', label: 'App icons 更清晰', type: 'Design', sub: '锐度和定义感提升' },
      { icon: '🔲', label: 'Mac toolbar 统一', type: 'Design', sub: 'edge-to-edge sidebars + colored icons' },
      { icon: '❤️', label: 'Health Cycle Tracking', type: 'Health', sub: 'perimenopause / menopause 支持' },
      { icon: '🎧', label: 'AirPods Custom EQ', type: 'Health', sub: '个性化声音调整' },
      { icon: '🏋️', label: 'GymKit on iPhone', type: 'Health', sub: '连接健身设备获取精准数据' },
      { icon: '📸', label: 'Spatial Reframing', type: 'Photos', sub: '智能重新构图' },
      { icon: '🧹', label: 'Clean Up 升级', type: 'Photos', sub: '精准移除元素' },
      { icon: '🔔', label: 'Notify Me', type: 'Safari', sub: '网页变化监控通知' },
      { icon: '💬', label: '一键建议', type: 'Messages', sub: '上下文感知创建提醒/笔记' },
      { icon: '🌄', label: '全景转空间场景', type: 'Vision', sub: 'Apple Vision Pro' },
      { icon: '🏠', label: 'Personal Environments', type: 'Vision', sub: 'Apple Vision Pro' },
    ];

    function renderItems(filter) {
      const filtered = filter === 'all' ? allFeatures : allFeatures.filter(f => f.type === filter);
      itemsContainer.innerHTML = filtered.map(f => `
        <div class="filtered-item" role="listitem">
          <span class="fi-icon" aria-hidden="true">${f.icon}</span>
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
        filterTags.querySelectorAll('.filter-tag').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-pressed', 'false');
        });
        tag.classList.add('active');
        tag.setAttribute('aria-pressed', 'true');
        renderItems(tag.dataset.filter);
      });
    });
  }

  /* ---- Glass Slider ---- */
  function initGlassSlider() {
    const slider = document.getElementById('glassSlider');
    const cards = document.getElementById('glassDemoCards');
    if (!slider || !cards) return;

    // Maps slider 0-100 to a rich glass appearance across 3 cards
    // ultra-clear (0) -> medium (50) -> fully tinted (100)
    function getGlassStyle(baseVal) {
      const t = baseVal / 100;
      // blur: 0px (clear) to 24px (frosted)
      const blur = Math.round(0 + t * 24);
      // alpha: 0.6 (clear glass) to 0.95 (dense tinted)
      const alpha = 0.6 + t * 0.35;
      // border highlight: subtle at clear, prominent at tinted
      const borderA = 0.15 + t * 0.55;
      // background base: very light at clear, deeper at tinted
      const bgL = Math.round(255 - t * 30);
      // shadow: minimal at clear, pronounced at tinted
      const shadowA = 0.05 + t * 0.2;
      // saturation boost for tinted
      const saturate = 1 + t * 0.4;

      return {
        backdropFilter: `blur(${blur}px) saturate(${Math.round(saturate * 100)}%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${Math.round(saturate * 100)}%)`,
        background: `rgba(${bgL}, ${bgL}, ${Math.round(bgL + 5)}, ${alpha})`,
        border: `1px solid rgba(255, 255, 255, ${borderA.toFixed(2)})`,
        boxShadow: `0 ${Math.round(4 + t * 8)}px ${Math.round(16 + t * 20)}px rgba(0, ${Math.round(113 + t * 50)}, ${Math.round(227 + t * 30)}, ${shadowA.toFixed(2)})`,
      };
    }

    function updateGlass() {
      const val = parseInt(slider.value);
      const cardEls = Array.from(cards.querySelectorAll('.glass-card'));
      if (cardEls.length < 3) return;

      // Three positions: ultra-clear (-25), medium (0), fully tinted (+25)
      const offsets = [-25, 0, 25];
      cardEls.forEach((card, idx) => {
        const raw = val + offsets[idx];
        const v = Math.max(0, Math.min(100, raw));
        Object.assign(card.style, getGlassStyle(v));
      });
    }

    slider.addEventListener('input', updateGlass);
    updateGlass();

    // Update real-time parameter display
    const gpBlur = document.getElementById('gp-blur');
    const gpSat  = document.getElementById('gp-sat');
    const gpAlpha = document.getElementById('gp-alpha');
    const gpBorder = document.getElementById('gp-border');
    const gpShadow = document.getElementById('gp-shadow');

    function updateParams(val) {
      const t = val / 100;
      if (gpBlur)   gpBlur.textContent   = Math.round(0 + t * 24) + 'px';
      if (gpSat)    gpSat.textContent    = Math.round((1 + t * 0.4) * 100) + '%';
      if (gpAlpha)  gpAlpha.textContent  = Math.round((0.6 + t * 0.35) * 100) + '%';
      if (gpBorder) gpBorder.textContent = Math.round((0.15 + t * 0.55) * 100) + '%';
      if (gpShadow) gpShadow.textContent = Math.round((0.05 + t * 0.2) * 100) + '%';
    }

    slider.addEventListener('input', () => updateParams(parseInt(slider.value)));
    updateParams(parseInt(slider.value));
  }

  /* ---- Availability Checker (fixed EU logic + platform selector) ---- */
  function initAvailabilityChecker() {
    const btn = document.getElementById('avCheckBtn');
    const results = document.getElementById('avResults');
    if (!btn || !results) return;

    btn.addEventListener('click', () => {
      const region = document.getElementById('avRegion').value;
      const platform = document.getElementById('avPlatform').value;
      const language = document.getElementById('avLanguage').value;
      const device = document.getElementById('avDevice').value;

      const unsupported = device === 'OLD';
      const results_list = [];

      // --- Platform-device compatibility check ---
      const validPlatformDevice = {
        IOS:       ['IP16', 'IP15P', 'IPM', 'OLD'],
        IPADOS:    ['IP16', 'IP15P', 'IPM', 'OLD'],
        MACOS:     ['MAC', 'OLD'],
        WATCHOS:   ['WATCH', 'VP', 'OLD'],
        VISIONOS:  ['VP', 'OLD'],
        TVOS:      ['IP16', 'IP15P', 'IPM', 'MAC', 'WATCH', 'VP', 'OLD'],
      };
      if (!validPlatformDevice[platform] || !validPlatformDevice[platform].includes(device)) {
        results.innerHTML = '<div class="av-result-item"><div style="font-size:15px;color:var(--text-secondary);padding:8px 0">⚠️ 平台和设备组合不匹配，请重新选择。例如：macOS 请选择 Mac 设备，watchOS 请选择 Apple Watch，visionOS 请选择 Apple Vision Pro。</div></div>';
        return;
      }

      // --- Apple Intelligence ---
      if (unsupported) {
        results_list.push({ label: 'Apple Intelligence', status: 'unavailable', note: '设备不支持（需要 iPhone 15 Pro 或更新 / iPad M1+ / Mac M1+ 等）' });
      } else if (region === 'CN') {
        results_list.push({ label: 'Apple Intelligence', status: 'unavailable', note: '中国大陆暂不可用（Apple 正在处理监管要求）' });
      } else if (language === 'OTHER') {
        results_list.push({ label: 'Apple Intelligence', status: 'limited', note: '该语言不在 Apple 当前列出的 16 种支持语言中；实际可用性需以 Apple 后续更新为准' });
      } else {
        results_list.push({ label: 'Apple Intelligence', status: 'available', note: '今年秋季随 iOS 27 等系统更新推出' });
      }

      // --- Siri AI (with EU + platform logic) ---
      if (unsupported) {
        results_list.push({ label: 'Siri AI', status: 'unavailable', note: '设备不支持' });
      } else if (region === 'CN') {
        results_list.push({ label: 'Siri AI', status: 'unavailable', note: '中国大陆暂不可用（监管原因）' });
      } else if (region === 'EU') {
        if (platform === 'IOS' || platform === 'IPADOS') {
          results_list.push({ label: 'Siri AI', status: 'unavailable', note: '欧盟地区 iOS / iPadOS 初期不可用（Apple 正在寻求保护隐私和安全的方式）' });
        } else if (platform === 'WATCHOS') {
          results_list.push({ label: 'Siri AI', status: 'unavailable', note: '欧盟地区 watchOS 27 初期不可用，因为 Siri AI on watchOS 需要配对具备 Siri AI 的 iPhone' });
        } else if (platform === 'MACOS' || platform === 'VISIONOS') {
          results_list.push({ label: 'Siri AI', status: 'available', note: '欧盟地区 Mac / Apple Vision Pro 可用 Siri AI' });
        } else {
          results_list.push({ label: 'Siri AI', status: 'available', note: '欧盟地区可用' });
        }
      } else if (language !== 'EN') {
        results_list.push({ label: 'Siri AI', status: 'beta', note: '今年晚些时候推出英文 Beta，其他语言逐步支持' });
      } else {
        results_list.push({ label: 'Siri AI', status: 'beta', note: '今年晚些时候推出英文 Beta' });
      }

      // --- Image Generation ---
      if (unsupported) {
        results_list.push({ label: '图像生成', status: 'unavailable', note: '设备不支持' });
      } else if (region === 'CN') {
        results_list.push({ label: '图像生成', status: 'unavailable', note: '中国大陆暂不可用' });
      } else {
        results_list.push({ label: '图像生成', status: 'limited', note: '有每日使用限额，iCloud+ 订阅可增加额度' });
      }

      // --- Enhanced on-device model ---
      if (unsupported) {
        results_list.push({ label: '最强 on-device 模型', status: 'unavailable', note: '需要 iPhone 17 Pro / iPhone Air / iPad M4 12GB+ / Mac M3 12GB+ / Vision Pro M5' });
      } else {
        results_list.push({ label: '最强 on-device 模型', status: 'limited', note: '部分高级功能（如 expressive voices）仅在 iPhone 17 Pro / iPhone Air / M4 12GB+ iPad / M3 12GB+ Mac / Vision Pro M5 上可用' });
      }

      results.innerHTML = results_list.map(r => `
        <div class="av-result-item">
          <span class="av-status-dot ${r.status}" aria-hidden="true"></span>
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

    function close() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      overlay?.classList.remove('open');
      overlay?.setAttribute('aria-hidden', 'true');
    }

    closeBtn?.addEventListener('click', close);
    overlay?.addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });
  }

  /* ---- Run ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();