// ============================================
// SpaceX Mars WBW Chinese page - app.js
// No frameworks, no build, native browser only
// ============================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ====== State ======
const state = {
  theme: localStorage.getItem('wbw-theme') || 'deep-space',
  mode: localStorage.getItem('wbw-mode') || 'immersive',
  data: { sections: [], glossary: [], timeline: [], sources: {} }
};

// ====== Markdown renderer (minimal, no external dep) ======
function renderMarkdown(md) {
  if (!md) return '';
  const lines = md.split('\n');
  const out = [];
  let inList = null;
  let inOL = null;
  let inBlockquote = null;
  let para = [];

  function flushPara() {
    if (para.length) {
      out.push('<p>' + inlineMd(para.join(' ')) + '</p>');
      para = [];
    }
  }
  function flushList() {
    if (inList) { out.push('</ul>'); inList = null; }
    if (inOL) { out.push('</ol>'); inOL = null; }
  }
  function flushBlockquote() {
    if (inBlockquote) { out.push('</blockquote>'); inBlockquote = null; }
  }
  function flushAll() { flushPara(); flushList(); flushBlockquote(); }

  function inlineMd(text) {
    // image
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) =>
      `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.alt='[图片加载失败] '+this.alt;this.style.opacity=.3">`);
    // footnote: ![N](#footnote-...) or [N](#footnote...)
    text = text.replace(/\[(\d+)\]\(#footnote-(\d+-\d+)\)/g, '<sup><a href="#fn-$2" id="fnref-$2">$1</a></sup>');
    text = text.replace(/\[(\d+)\]\(#footnote2-(\d+-\d+)\)/g, '<sup><a href="#fn2-$2" id="fnref2-$2">$1</a></sup>');
    // link
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${inlineMd(t)}</a>`);
    // bold then italic
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return text;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { flushAll(); continue; }

    // Horizontal rule
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      flushAll();
      out.push('<hr>');
      continue;
    }

    // Headings
    const h = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      flushAll();
      const level = h[1].length;
      const text = h[2].trim();
      const id = text.replace(/[^\w一-鿿]+/g, '-').toLowerCase().substring(0, 60);
      out.push(`<h${level} id="${esc(id)}">${inlineMd(text)}</h${level}>`);
      continue;
    }

    // Bold-only line as H4 (sub-section)
    const boldLine = trimmed.match(/^\*\*([^*]+)\*\*\s*[:：]?\s*(.*)$/);
    if (boldLine && boldLine[2]) {
      flushAll();
      out.push(`<h4><strong>${inlineMd(boldLine[1])}</strong>${boldLine[2] ? ' ' + inlineMd(boldLine[2]) : ''}</h4>`);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      flushList();
      flushPara();
      if (!inBlockquote) { out.push('<blockquote>'); inBlockquote = true; }
      out.push(inlineMd(trimmed.slice(1).trim()));
      out.push('<br>');
      continue;
    }

    // Lists
    if (/^[-*+]\s+/.test(trimmed)) {
      flushBlockquote();
      flushPara();
      if (inOL) { out.push('</ol>'); inOL = null; }
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push('<li>' + inlineMd(trimmed.replace(/^[-*+]\s+/, '')) + '</li>');
      continue;
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      flushBlockquote();
      flushPara();
      if (inList) { out.push('</ul>'); inList = null; }
      if (!inOL) { out.push('<ol>'); inOL = true; }
      out.push('<li>' + inlineMd(trimmed.replace(/^\d+\.\s+/, '')) + '</li>');
      continue;
    }

    // Image-only line
    if (trimmed.startsWith('![')) {
      flushAll();
      out.push('<div class="article-img-wrap">' + inlineMd(trimmed) + '</div>');
      continue;
    }

    // Default: paragraph
    flushList();
    flushBlockquote();
    para.push(trimmed);
  }
  flushAll();
  return out.join('\n');
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ====== Data loaders ======
async function loadTranslation() {
  try {
    const res = await fetch('content/translation.zh.md');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();
    return md;
  } catch (e) {
    console.error('Translation load failed:', e);
    return null;
  }
}

async function loadSections() {
  try {
    const res = await fetch('content/translation.sections.json');
    return await res.json();
  } catch (e) { return { sections: [] }; }
}

async function loadBackground() {
  try {
    const res = await fetch('content/background.json');
    return await res.json();
  } catch (e) { return null; }
}

// ====== Renderers ======
function renderArticle(md) {
  const article = $('#article');
  if (!md) {
    article.innerHTML = '<div class="loading">⚠️ 译文加载失败。请检查 content/translation.zh.md 是否可访问。</div>';
    return;
  }
  // Remove the title (we have hero) and the first TOC block
  // Skip lines until the first horizontal rule or "Part 1"
  let content = md;
  // Find the start of Part 1
  const part1Idx = content.indexOf('# 第 1 部分');
  if (part1Idx > 0) content = content.substring(part1Idx);
  // Convert Phase 1 to have a proper H1 too
  article.innerHTML = renderMarkdown(content);
}

function renderGlossary(bg) {
  const grid = $('#glossaryGrid');
  if (!bg?.glossary?.length) {
    grid.innerHTML = '<p class="loading">术语加载失败</p>';
    return;
  }
  grid.innerHTML = bg.glossary.map(g => `
    <div class="glossary-item">
      <h4 class="glossary-term">${esc(g.term)}</h4>
      <p class="glossary-def">${esc(g.definition)}</p>
    </div>
  `).join('');
  state.data.glossary = bg.glossary;
}

function renderTimeline(bg) {
  const tl = $('#timeline');
  if (!bg?.timeline?.length) {
    tl.innerHTML = '<li class="loading">时间线加载失败</li>';
    return;
  }
  const sorted = [...bg.timeline].sort((a, b) => a.date.localeCompare(b.date));
  state.data.timeline = sorted;
  drawTimeline('all');
}

function drawTimeline(cat) {
  const tl = $('#timeline');
  const filtered = cat === 'all' ? state.data.timeline : state.data.timeline.filter(t => t.category === cat);
  tl.innerHTML = filtered.map(t => `
    <li data-cat="${esc(t.category)}">
      <span class="timeline-date">${esc(t.date)}</span>
      <span class="timeline-event">${esc(t.event)}</span>
      <span class="timeline-cat">${esc(t.category)}</span>
    </li>
  `).join('');
}

function renderSources(bg) {
  const grid = $('#sourcesGrid');
  if (!bg?.sources) {
    grid.innerHTML = '<p class="loading">资料加载失败</p>';
    return;
  }
  const blocks = [];
  for (const [key, list] of Object.entries(bg.sources)) {
    if (!Array.isArray(list) || !list.length) continue;
    const title = {
      primary: '原文与系列',
      biography: '主要参考书',
      official: '官方资料',
      updates_2015_2026: '2015-2026 进展追踪',
      academic: '学术资料'
    }[key] || key;
    blocks.push(`
      <div class="source-block">
        <h3>${esc(title)}</h3>
        <ul>${list.map(item => `<li>${inlineLinks(item)}</li>`).join('')}</ul>
      </div>
    `);
  }
  grid.innerHTML = blocks.join('');
}

function inlineLinks(text) {
  return esc(text).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

// ====== Theme + Mode ======
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('wbw-theme', theme);
  $$('[data-theme]').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
}

function applyMode(mode) {
  state.mode = mode;
  document.documentElement.setAttribute('data-mode', mode);
  localStorage.setItem('wbw-mode', mode);
  $$('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
}

// ====== Progress bar ======
function updateProgress() {
  const article = $('#article');
  if (!article) return;
  const top = article.getBoundingClientRect().top;
  const h = article.offsetHeight;
  const scrolled = Math.max(0, -top);
  const pct = Math.min(100, (scrolled / Math.max(1, h - window.innerHeight)) * 100);
  $('#progressFill').style.width = pct + '%';
}

// ====== TOC scroll spy ======
function updateTOC() {
  const headings = $$('.article h1, .article h2, .article h3');
  if (!headings.length) return;
  const scrollY = window.scrollY + 100;
  let active = null;
  for (const h of headings) {
    if (h.offsetTop <= scrollY) active = h;
    else break;
  }
  $$('.toc-link').forEach(a => a.classList.remove('active'));
  if (active && active.id) {
    const link = $(`.toc-link[href="#${active.id}"]`);
    if (link) link.classList.add('active');
  }
}

// ====== Starfield ======
function startStarfield() {
  const c = $('#starfield');
  if (!c) return;
  const ctx = c.getContext('2d');
  let stars = [];
  function resize() {
    c.width = c.offsetWidth;
    c.height = c.offsetHeight;
    stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 1.5,
      v: Math.random() * 0.3 + 0.1
    }));
  }
  resize();
  window.addEventListener('resize', resize);
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#fff';
    for (const s of stars) {
      ctx.globalAlpha = 0.4 + Math.random() * 0.6;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      s.y += s.v;
      if (s.y > c.height) { s.y = 0; s.x = Math.random() * c.width; }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

// ====== Search ======
function setupSearch() {
  const overlay = $('#searchOverlay');
  const input = $('#searchInput');
  const results = $('#searchResults');
  const open = () => {
    overlay.hidden = false;
    input.focus();
    setTimeout(() => input.select(), 50);
  };
  const close = () => { overlay.hidden = true; input.value = ''; results.innerHTML = ''; };

  $('#searchToggle')?.addEventListener('click', open);
  $('#searchClose')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
    if (e.key === 'Escape' && !overlay.hidden) close();
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; return; }
    const text = window._articleText || '';
    const sentences = text.split(/(?<=[。！？\n])/);
    const hits = sentences.filter(s => s.toLowerCase().includes(q)).slice(0, 20);
    if (!hits.length) {
      results.innerHTML = '<div class="hit">无结果</div>';
      return;
    }
    results.innerHTML = hits.map(h => {
      const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return `<div class="hit">${esc(h).replace(re, '<mark>$1</mark>').substring(0, 400)}${h.length > 400 ? '…' : ''}</div>`;
    }).join('');
  });
}

// ====== Init ======
async function init() {
  applyTheme(state.theme);
  applyMode(state.mode);

  // Theme + mode buttons
  $$('[data-theme]').forEach(b => b.addEventListener('click', () => applyTheme(b.dataset.theme)));
  $$('[data-mode]').forEach(b => b.addEventListener('click', () => applyMode(b.dataset.mode)));

  // TOC toggle (mobile)
  $('#tocToggle')?.addEventListener('click', () => $('#toc').classList.toggle('open'));
  document.addEventListener('click', (e) => {
    const toc = $('#toc');
    if (window.innerWidth > 768) return;
    if (!toc.contains(e.target) && !e.target.closest('#tocToggle')) {
      toc.classList.remove('open');
    }
  });

  // Load data
  const [md, bg] = await Promise.all([loadTranslation(), loadBackground()]);
  if (md) {
    window._articleText = md;
    renderArticle(md);
    updateProgress();
    updateTOC();
  } else {
    $('#article').innerHTML = '<div class="loading">⚠️ 译文加载失败</div>';
  }
  if (bg) {
    renderGlossary(bg);
    renderTimeline(bg);
    renderSources(bg);
    // Update hero stat with actual char count
    if (md) {
      const cc = (md.match(/[\u4e00-\u9fff]/g) || []).length;
      const el = $('#stat-chars');
      if (el) el.textContent = cc.toLocaleString();
    }
  }

  // Scroll listeners
  window.addEventListener('scroll', () => {
    updateProgress();
    updateTOC();
  }, { passive: true });

  // Filter buttons
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawTimeline(btn.dataset.cat);
    });
  });

  // Glossary search
  $('#glossarySearch')?.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    $$('.glossary-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? '' : 'none';
    });
  });

  startStarfield();
  setupSearch();
}

// Boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
