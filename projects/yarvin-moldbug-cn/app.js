/* ====================================================================
   Curtis Yarvin 思想导读 — Application Script
   - Theme switcher (cathedral / patchwork / ink)
   - Reading mode (annotated / immersive / compact)
   - Hero starfield canvas
   - Reading progress bar
   - TOC scroll-spy + drawer
   - Search overlay (Cmd/Ctrl+K)
   - Dynamic rendering of glossary / timeline / sources / context / patchwork
   ==================================================================== */

(function () {
  'use strict';

  // ---------- Config ----------
  const DATA_URL = 'content/background.json';
  const STORAGE_THEME = 'yarvin-theme';
  const STORAGE_MODE = 'yarvin-reading-mode';
  const STORAGE_TOC_DRAWER = 'yarvin-toc-seen';

  // ---------- Hero starfield ----------
  function initStarfield() {
    const canvas = document.getElementById('heroStars');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 120;
    let w, h;
    let raf = null;

    function resize() {
      w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function makeStars() {
      stars = [];
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * cw,
          y: Math.random() * ch,
          r: Math.random() * 1.2 + 0.2,
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05,
          a: Math.random() * 0.7 + 0.3,
          da: (Math.random() - 0.5) * 0.005
        });
      }
    }

    function tick() {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);
      const theme = document.documentElement.getAttribute('data-theme') || 'cathedral';
      const fillColor = theme === 'ink' ? '#1a1a1a' : '#ffffff';
      ctx.fillStyle = fillColor;
      stars.forEach(s => {
        s.x += s.vx; s.y += s.vy;
        s.a += s.da;
        if (s.a < 0.1) s.da = Math.abs(s.da);
        if (s.a > 0.95) s.da = -Math.abs(s.da);
        if (s.x < 0) s.x = cw;
        if (s.x > cw) s.x = 0;
        if (s.y < 0) s.y = ch;
        if (s.y > ch) s.y = 0;
        ctx.globalAlpha = s.a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    resize();
    makeStars();
    tick();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); makeStars(); }, 200);
    });
  }

  // ---------- Reading progress bar ----------
  function initProgressBar() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      const pct = height > 0 ? (scrolled / height) * 100 : 0;
      bar.style.width = pct + '%';
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Theme switcher ----------
  function initTheme() {
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      syncToolbar('data-theme', saved);
    }
    document.querySelectorAll('.toolbar__btn[data-theme]').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_THEME, theme);
        syncToolbar('data-theme', theme);
      });
    });
  }

  // ---------- Reading mode ----------
  function initReadingMode() {
    const saved = localStorage.getItem(STORAGE_MODE);
    if (saved) {
      document.documentElement.setAttribute('data-reading-mode', saved);
      syncToolbar('data-reading-mode', saved);
    }
    document.querySelectorAll('.toolbar__btn[data-reading-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-reading-mode');
        document.documentElement.setAttribute('data-reading-mode', mode);
        localStorage.setItem(STORAGE_MODE, mode);
        syncToolbar('data-reading-mode', mode);
      });
    });
  }

  function syncToolbar(attr, value) {
    const sel = '.toolbar__btn[' + attr + '="' + value + '"]';
    document.querySelectorAll('.toolbar__btn[' + attr + ']').forEach(b => b.classList.remove('is-active'));
    const btn = document.querySelector(sel);
    if (btn) btn.classList.add('is-active');
  }

  // ---------- Keyboard focus for in-page navigation and deep links ----------
  function initAnchorFocus() {
    const focusAnchor = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      const focusTarget = target.matches('section') ? (target.querySelector('h2') || target) : target;
      if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
      focusTarget.classList.add('reader-anchor-focus');
      focusTarget.focus({ preventScroll: true });
    };
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || !document.getElementById(link.getAttribute('href').slice(1))) return;
      // Hashchange does not fire when the user clicks the same link twice.
      window.requestAnimationFrame(focusAnchor);
    });
    window.addEventListener('hashchange', () => window.requestAnimationFrame(focusAnchor));
    if (window.location.hash) window.requestAnimationFrame(focusAnchor);
  }

  // ---------- Grouped reading-location tracker (desktop + mobile TOC) ----------
  function initTocScrollSpy() {
    const root = document.getElementById('tocList');
    const position = document.getElementById('tocPosition');
    const drawerList = document.getElementById('tocListDrawer');
    const floating = document.getElementById('floatingToc');
    const resumeLink = document.getElementById('resumeReading');
    const locationKey = 'yarvin-last-location-p10';
    if (!root) return;

    const targets = [];
    let group = 'chapters';
    root.querySelectorAll(':scope > li').forEach(item => {
      if (item.classList.contains('toc-list__group-label')) {
        group = item.dataset.tocGroup;
        return;
      }
      const link = item.querySelector('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href').slice(1);
      const element = document.getElementById(id);
      if (!element) return;
      targets.push({ id, element, group, label: link.textContent.trim() });
    });
    if (!targets.length) return;

    const headings = {
      chapters: '正文',
      concepts: '背景与概念',
      evidence: '证据与延伸'
    };
    const chapterCount = targets.filter(item => item.group === 'chapters').length;
    // Offer an opt-in resume action. Never override an explicit #deep-link.
    if (resumeLink) {
      let last = null;
      try { last = window.localStorage.getItem(locationKey); } catch (_) { /* storage unavailable */ }
      const found = targets.find(t => t.id === last);
      if (found && found.id !== targets[0].id) {
        resumeLink.href = '#' + found.id;
        resumeLink.textContent = '继续上次阅读：' + found.label;
        resumeLink.hidden = false;
      }
    }
    let persisted = null;
    function update() {
      const offset = window.matchMedia('(max-width: 600px)').matches ? 78 : 125;
      let active = targets[0];
      // Targets are in document order; compare viewport coordinates rather
      // than offsetTop, which can change when a nested offsetParent is added.
      targets.forEach(target => {
        if (target.element.getBoundingClientRect().top <= offset) {
          active = target;
        }
      });
      [root, drawerList].filter(Boolean).forEach(list => {
        list.querySelectorAll('a[href^="#"]').forEach(link => {
          const selected = link.getAttribute('href') === '#' + active.id;
          link.classList.toggle('is-active', selected);
          if (selected) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });

      const chapterNumber = active.group === 'chapters'
        ? targets.filter(item => item.group === 'chapters').findIndex(item => item.id === active.id) + 1
        : null;
      const concise = chapterNumber
        ? '第 ' + chapterNumber + ' 章'
        : active.label;
      const location = headings[active.group] + ' · ' + concise;
      if (position) position.textContent = '当前位置：' + location;
      if (window.scrollY > 350 && active.id !== persisted) {
        try {
          window.localStorage.setItem(locationKey, active.id);
          persisted = active.id;
        } catch (_) { /* private mode or storage disabled */ }
      }
      if (floating) {
        floating.textContent = chapterNumber
          ? '≡ 目录 · ' + chapterNumber + '/' + chapterCount
          : '≡ 目录 · ' + concise;
        floating.setAttribute('aria-label', '打开内容导航，当前位置：' + location);
      }
    }
    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('hashchange', update);
    update();
  }

  // ---------- Mobile TOC drawer + longform floating entry ----------
  function initTocDrawer() {
    const drawer = document.getElementById('tocDrawer');
    const btnOpen = document.getElementById('btnToc');
    const btnClose = document.getElementById('btnTocClose');
    const floating = document.getElementById('floatingToc');
    const toolbar = document.querySelector('.toolbar');
    const list = document.getElementById('tocListDrawer');
    const tocList = document.getElementById('tocList');
    if (!drawer || !btnOpen) return;
    if (list && tocList) list.innerHTML = tocList.innerHTML;
    let lastTrigger = btnOpen;

    function updateTriggers(expanded) {
      [btnOpen, floating].filter(Boolean).forEach(button => {
        button.setAttribute('aria-expanded', String(expanded));
      });
    }
    function updateFloating() {
      if (!floating) return;
      const narrow = window.matchMedia('(max-width: 600px)').matches;
      const toolbarPassed = toolbar && toolbar.getBoundingClientRect().bottom < 0;
      floating.hidden = !narrow || !toolbarPassed;
    }
    function open(trigger) {
      lastTrigger = trigger || btnOpen;
      drawer.hidden = false;
      updateTriggers(true);
      document.body.style.overflow = 'hidden';
      if (btnClose) btnClose.focus({ preventScroll: true });
    }
    function close(restoreFocus = true) {
      drawer.hidden = true;
      updateTriggers(false);
      document.body.style.overflow = '';
      if (restoreFocus && lastTrigger) lastTrigger.focus({ preventScroll: true });
    }
    btnOpen.addEventListener('click', () => open(btnOpen));
    if (floating) floating.addEventListener('click', () => open(floating));
    if (btnClose) btnClose.addEventListener('click', () => close());
    drawer.addEventListener('click', event => {
      if (event.target === drawer) close();
    });
    if (list) list.addEventListener('click', event => {
      if (event.target.closest('a[href^="#"]')) close(false);
    });
    drawer.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const focusables = [btnClose, ...drawer.querySelectorAll('a[href]')].filter(Boolean);
      if (!focusables.length) return;
      if (event.shiftKey && document.activeElement === focusables[0]) {
        event.preventDefault();
        focusables[focusables.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === focusables[focusables.length - 1]) {
        event.preventDefault();
        focusables[0].focus();
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !drawer.hidden) close();
    });
    document.addEventListener('scroll', updateFloating, { passive: true });
    window.addEventListener('resize', updateFloating);
    updateFloating();
  }

  // ---------- Back to top ----------
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    const onScroll = () => {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Search overlay with real keyboard navigation ----------
  function initSearch(corpus) {
    const overlay = document.getElementById('searchOverlay');
    const btn = document.getElementById('btnSearch');
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    if (!overlay || !btn || !input || !results) return;

    function open() {
      overlay.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      input.focus({ preventScroll: true });
    }
    function close(restoreFocus = true) {
      overlay.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      input.value = '';
      results.innerHTML = '';
      if (restoreFocus) btn.focus({ preventScroll: true });
    }
    btn.addEventListener('click', open);
    overlay.addEventListener('click', event => {
      if (event.target === overlay) close();
    });
    document.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        open();
      }
      if (event.key === 'Escape' && !overlay.hidden) close();
    });

    function escapeMarkup(value) {
      return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function highlight(text, query) {
      const at = text.toLowerCase().indexOf(query.toLowerCase());
      if (at < 0) return escapeMarkup(text);
      return escapeMarkup(text.slice(0, at)) + '<mark>' +
        escapeMarkup(text.slice(at, at + query.length)) + '</mark>' +
        escapeMarkup(text.slice(at + query.length));
    }
    function snippetAround(text, idx, len) {
      const start = Math.max(0, idx - 40);
      const end = Math.min(text.length, idx + len + 40);
      return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
    }
    function selectResult(element) {
      const href = element.getAttribute('data-href');
      if (!href || !document.getElementById(href)) return;
      close(false);
      window.location.hash = href;
    }
    function focusResult(key) {
      const items = Array.from(results.querySelectorAll('.search-result'));
      if (!items.length) return false;
      const active = items.indexOf(document.activeElement);
      const next = key === 'ArrowDown'
        ? (active + 1) % items.length
        : (active <= 0 ? items.length - 1 : active - 1);
      items[next].focus();
      return true;
    }
    function doSearch(query) {
      if (!query || query.length < 2) {
        results.innerHTML = '<p class="search-empty">输入至少 2 个字符开始搜索</p>';
        return;
      }
      const lower = query.toLowerCase();
      const hits = [];
      corpus.forEach(doc => {
        const lowerText = doc.text.toLowerCase();
        let idx = lowerText.indexOf(lower);
        while (idx !== -1 && hits.length < 50) {
          hits.push({ title: doc.title, href: doc.href, text: doc.text, matchIdx: idx, matchLen: query.length });
          idx = lowerText.indexOf(lower, idx + query.length);
        }
      });
      if (!hits.length) {
        results.innerHTML = '<p class="search-empty">未找到匹配项</p>';
        return;
      }
      results.innerHTML = hits.slice(0, 20).map(h => {
        const snippet = snippetAround(h.text, h.matchIdx, h.matchLen);
        return '<button type="button" class="search-result" data-href="' + escapeMarkup(h.href) + '">' +
          '<span class="search-result__title">' + escapeMarkup(h.title) + '</span>' +
          '<span class="search-result__snippet">' + highlight(snippet, query) + '</span></button>';
      }).join('');
    }
    results.addEventListener('click', event => {
      const target = event.target.closest('.search-result');
      if (target) selectResult(target);
    });
    results.addEventListener('keydown', event => {
      if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && focusResult(event.key)) {
        event.preventDefault();
      }
    });
    input.addEventListener('keydown', event => {
      if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && focusResult(event.key)) {
        event.preventDefault();
      } else if (event.key === 'Enter') {
        const first = results.querySelector('.search-result');
        if (first) {
          event.preventDefault();
          selectResult(first);
        }
      }
    });
    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => doSearch(input.value.trim()), 150);
    });
  }

  // Expose for next part
  window.__yarvinApp = { initStarfield, initProgressBar, initTheme, initReadingMode, initAnchorFocus, initTocScrollSpy, initTocDrawer, initBackToTop, initSearch };
})();

/* ====================================================================
   Second IIFE: data-driven renderers (glossary, timeline, sources, etc.)
   Separated to keep file size balanced.
   ==================================================================== */
(function () {
  'use strict';

  // The first IIFE's DATA_URL is lexical/private; declare this dependency
  // here so background data, search and filters initialize correctly.
  const DATA_URL = 'content/background.json';

  // ---------- Helpers ----------
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function linkify(text) {
    const esc = escapeHtml(text);
    return esc.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  // ---------- Context cards ----------
  function renderContext(data) {
    const grid = document.getElementById('contextGrid');
    if (!grid) return;
    const cards = [];
    cards.push({ title: '关于 421.news', body: data.article_context.what_is_421 });
    cards.push({ title: '作者 Juan Ruocco', body: data.article_context.author_intro });
    cards.push({ title: '本文定位', body: data.article_context.this_post_role });
    cards.push({ title: '核心问题', body: data.article_context.core_question });
    cards.push({ title: 'Yarvin 是谁', body: data.yarvin_context.real_name + '，' + data.yarvin_context.tech_work });
    cards.push({ title: 'Yarvin 的核心主张', body: data.yarvin_context.key_claim });
    cards.push({ title: 'Yarvin 提出的方案', body: data.yarvin_context.proposed_solution });
    grid.innerHTML = cards.map(c =>
      '<div class="context-card">' +
      '<h3 class="context-card__title">' + escapeHtml(c.title) + '</h3>' +
      '<p class="context-card__body">' + linkify(c.body) + '</p>' +
      '</div>'
    ).join('');
  }

  // ---------- Glossary ----------
  function renderGlossary(items) {
    const grid = document.getElementById('glossaryGrid');
    if (!grid) return;
    grid.innerHTML = items.map(g =>
      '<div class="glossary-card" data-term="' + escapeHtml(g.term.toLowerCase()) + '">' +
      '<h3 class="glossary-card__term">' + escapeHtml(g.term) + '</h3>' +
      '<p class="glossary-card__def">' + linkify(g.definition) + '</p>' +
      '</div>'
    ).join('');

    const filter = document.getElementById('glossaryFilter');
    if (filter) {
      filter.addEventListener('input', () => {
        const q = filter.value.trim().toLowerCase();
        grid.querySelectorAll('.glossary-card').forEach(card => {
          const term = card.getAttribute('data-term');
          const text = card.textContent.toLowerCase();
          card.classList.toggle('is-hidden', q && !term.includes(q) && !text.includes(q));
        });
      });
    }
  }

  // ---------- Timeline ----------
  function renderTimeline(items) {
    const list = document.getElementById('timeline');
    const filter = document.getElementById('timelineFilter');
    if (!list) return;

    const cats = Array.from(new Set(items.map(i => i.category))).sort();
    const catLabels = {
      yarvin: 'Yarvin',
      background: '思想背景',
      meme: '模因传播'
    };

    if (filter) {
      filter.innerHTML = '<button class="is-active" data-cat="all">全部</button>' +
        cats.map(c => '<button data-cat="' + c + '">' + (catLabels[c] || c) + '</button>').join('');
      filter.addEventListener('click', e => {
        const btn = e.target.closest('button');
        if (!btn) return;
        filter.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.getAttribute('data-cat');
        list.querySelectorAll('li').forEach(li => {
          li.classList.toggle('is-hidden', cat !== 'all' && li.getAttribute('data-cat') !== cat);
        });
      });
    }

    list.innerHTML = items.map(i =>
      '<li data-cat="' + escapeHtml(i.category) + '">' +
      '<span class="timeline__date">' + escapeHtml(i.date) + '</span>' +
      escapeHtml(i.event) +
      '<span class="timeline__cat">' + (catLabels[i.category] || i.category) + '</span>' +
      '</li>'
    ).join('');
  }

  // ---------- Sources ----------
  function renderSources(data) {
    const grid = document.getElementById('sourcesGrid');
    if (!grid) return;
    const blocks = [
      { title: 'Yarvin 原文', items: data.sources.official_texts },
      { title: '思想先驱', items: data.sources.critical_readings },
      { title: '421.news 相关文章', items: data.sources.related_421_articles },
      { title: '延伸探索', items: data.sources.further_exploration }
    ];
    grid.innerHTML = blocks.map(b =>
      '<div class="source-block">' +
      '<h3 class="source-block__title">' + escapeHtml(b.title) + '</h3>' +
      '<ul>' + b.items.map(item => {
        const t = escapeHtml(item).replace(/\*([^*]+)\*/g, '<em>$1</em>');
        // Auto-link Yarvin texts
        if (item.includes('Patchwork')) {
          return '<li><a href="https://www.unqualified-reservations.org/2008/11/patchwork-positive-vision-part-1/" target="_blank" rel="noopener">Patchwork: A Positive Vision</a></li>';
        }
        if (item.includes('A Gentle Introduction')) {
          return '<li><a href="https://www.unqualified-reservations.org/2009/01/gentle-introduction-to-unqualified/" target="_blank" rel="noopener">A Gentle Introduction to Unqualified Reservations</a></li>';
        }
        if (item.includes('Open Letter')) {
          return '<li><a href="https://www.unqualified-reservations.org/2008/04/open-letter-to-open-minded-progressives/" target="_blank" rel="noopener">An Open Letter to Open-Minded Progressives</a></li>';
        }
        if (item.includes('Gray Mirror Substack')) {
          return '<li><a href="https://graymirror.substack.com" target="_blank" rel="noopener">Gray Mirror Substack</a></li>';
        }
        if (item.includes('Industrial Society')) {
          return '<li><a href="https://www.washingtonpost.com/wp-srv/national/longterm/unabomber/text.htm" target="_blank" rel="noopener">Industrial Society and Its Future</a></li>';
        }
        return '<li>' + t + '</li>';
      }).join('') + '</ul></div>'
    ).join('');
  }

  // ---------- Reading paths ----------
  function renderReadingPaths(paths) {
    const grid = document.getElementById('readingPaths');
    if (!grid) return;
    const labels = {
      casual_reader: '🍺 休闲读者',
      serious_thinker: '🧠 严肃思考者',
      tech_aligned: '⚙️ 技术视角',
      critical_reader: '🛡️ 批判性读者'
    };
    grid.innerHTML = Object.keys(paths).map(k =>
      '<div class="reading-path">' +
      '<h3 class="reading-path__title">' + (labels[k] || k) + '</h3>' +
      '<ol>' + paths[k].map(s => '<li>' + linkify(s) + '</li>').join('') + '</ol>' +
      '</div>'
    ).join('');
  }

  // ---------- Patchwork grid (decorative visualization) ----------
  function renderPatchwork() {
    const viz = document.getElementById('patchworkViz');
    if (!viz) return;
    const cells = [];
    // Generate a "mosaic" pattern: 8 large city-states + ~50 small
    const bigPositions = [[1,1,3,2], [5,0,2,3], [8,2,2,2], [2,5,3,2], [7,4,2,3], [0,3,2,2], [10,1,2,2], [4,4,3,2]];
    bigPositions.forEach((p, i) => {
      cells.push({ col: p[0], row: p[1], w: p[2], h: p[3], label: '城邦 ' + (i+1), big: true });
    });
    for (let i = 0; i < 28; i++) {
      const col = Math.floor(Math.random() * 12);
      const row = Math.floor(Math.random() * 8);
      if (cells.some(c => col >= c.col && col < c.col + c.w && row >= c.row && row < c.row + c.h)) continue;
      cells.push({ col, row, w: 1, h: 1, label: 'μ' + i, big: false });
    }
    viz.innerHTML = cells.map(c =>
      '<div class="patch-cell' + (c.big ? ' patch-cell--big' : '') + '"' +
      ' style="grid-column: ' + (c.col + 1) + ' / span ' + c.w + '; grid-row: ' + (c.row + 1) + ' / span ' + c.h + ';"' +
      ' title="' + c.label + '">' + c.label + '</div>'
    ).join('');
  }

  // ---------- Build search corpus from article DOM + glossary + timeline ----------
  function buildSearchCorpus(data) {
    const corpus = [];
    // Article sections
    document.querySelectorAll('.article h2[id]').forEach(h2 => {
      const id = h2.getAttribute('id');
      let text = '';
      let el = h2.nextElementSibling;
      while (el && el.tagName !== 'H2') {
        text += ' ' + el.textContent;
        el = el.nextElementSibling;
      }
      corpus.push({ title: h2.textContent.trim(), href: id, anchor: id, text: text });
    });
    // Glossary
    if (data.glossary) {
      data.glossary.forEach(g => {
        corpus.push({ title: '术语: ' + g.term, href: 'glossary-section', anchor: 'glossary-section', text: g.term + ' ' + g.definition });
      });
    }
    // Timeline
    if (data.timeline) {
      data.timeline.forEach(t => {
        corpus.push({ title: t.date + ' · ' + (t.event.slice(0, 30)), href: 'timeline-section', anchor: 'timeline-section', text: t.event });
      });
    }
    return corpus;
  }

  // ---------- Bootstrap ----------
  function init() {
    // Things that don't need data
    window.__yarvinApp.initStarfield();
    window.__yarvinApp.initProgressBar();
    window.__yarvinApp.initTheme();
    window.__yarvinApp.initReadingMode();
    window.__yarvinApp.initAnchorFocus();
    window.__yarvinApp.initTocScrollSpy();
    window.__yarvinApp.initTocDrawer();
    window.__yarvinApp.initBackToTop();
    renderPatchwork();

    // Fetch data
    fetch(DATA_URL)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        renderContext(data);
        renderGlossary(data.glossary || []);
        renderTimeline(data.timeline || []);
        renderSources(data);
        renderReadingPaths(data.reading_paths || {});
        const corpus = buildSearchCorpus(data);
        window.__yarvinApp.initSearch(corpus);
      })
      .catch(err => {
        console.error('Failed to load background.json:', err);
        ['contextGrid', 'glossaryGrid', 'timeline', 'sourcesGrid', 'readingPaths'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = '<p style="color: var(--fg-3);">数据加载失败: ' + escapeHtml(err.message) + '</p>';
        });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();