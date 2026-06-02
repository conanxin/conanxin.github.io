// main.js — Arrow (1962) Learning Package

// ── Dark Mode ──────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('arrow1962-theme', theme);
  const btn = document.getElementById('themeToggle');
  const fbtn = document.getElementById('floatingThemeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (fbtn) fbtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function initTheme() {
  const saved = localStorage.getItem('arrow1962-theme') || 'light';
  applyTheme(saved);
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });
  document.getElementById('floatingThemeToggle')?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });
}

// ── Sidebar Toggle (mobile) ────────────────────────────────
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  if (!sidebar) return;
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }
  // Close sidebar on link click (mobile)
  sidebar.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) sidebar.classList.remove('show');
    });
  });
}

// ── Search ───────────────────────────────────────────────
function highlightSearch(term) {
  if (!term || term.length < 2) {
    document.querySelectorAll('.search-match').forEach(el => {
      const parent = el.parentNode;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    });
    return;
  }
  const walker = document.createTreeWalker(
    document.body, NodeFilter.SHOW_TEXT, null, false
  );
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (node.parentElement.closest('script, style, noscript')) return;
    if (node.parentElement.classList.contains('search-match')) return;
    const text = node.textContent;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
    if (regex.test(text)) {
      const span = document.createElement('span');
      span.innerHTML = text.replace(regex, '<mark class="search-match">$1</mark>');
      node.parentNode.replaceChild(span, node);
    }
  });
}

function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => highlightSearch(input.value.trim()), 300);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { input.value = ''; highlightSearch(''); }
  });
}

// ── Keyboard shortcut (Ctrl+K → focus search) ───────────
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('searchInput')?.focus();
  }
});

// ── Smooth scroll for anchor links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(el => {
  el.addEventListener('click', (e) => {
    const target = document.querySelector(el.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Active nav link highlighting ──────────────────────────
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#sidebar a, .navbar-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ── Back to top ──────────────────────────────────────────
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'btn btn-sm btn-secondary back-to-top';
  btn.textContent = '⬆';
  btn.style.borderRadius = '50%';
  btn.style.width = '36px';
  btn.style.height = '36px';
  btn.style.padding = '0';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Path card active on scroll ─────────────────────────────
function initPathHighlight() {
  const cards = document.querySelectorAll('.path-card');
  if (!cards.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach(c => c.classList.remove('active'));
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  cards.forEach(card => observer.observe(card));
}

// ── Init all ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initSearch();
  initActiveNav();
  initBackToTop();
  initPathHighlight();
});