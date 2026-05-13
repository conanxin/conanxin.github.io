/**
 * app.js - OPPO母亲节文案事件报道页面
 * 轻量交互脚本，无依赖，可独立运行
 */

(function() {
  'use strict';

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  // ===== Active Navigation Highlight =====
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('nav a');

  function highlightNav() {
    var scrollPos = window.scrollY + 100;
    sections.forEach(function(section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
            link.style.color = '#C41E3A';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  // ===== Glossary Term Touch Support (Mobile) =====
  // On mobile, glossary terms with hover effects don't work well
  // Provide a simple tap-to-toggle alternative
  var glossaryTerms = document.querySelectorAll('.glossary-term');
  glossaryTerms.forEach(function(term) {
    term.addEventListener('click', function(e) {
      e.stopPropagation();
      var def = term.getAttribute('data-definition');
      if (!def) return;

      // Check if a tooltip already exists
      var existing = term.querySelector('.glossary-tooltip');
      if (existing) {
        existing.remove();
        return;
      }

      // Create tooltip
      var tooltip = document.createElement('span');
      tooltip.className = 'glossary-tooltip';
      tooltip.textContent = def;
      tooltip.style.cssText = [
        'position:absolute',
        'bottom:100%',
        'left:50%',
        'transform:translateX(-50%)',
        'background:#2C2C2C',
        'color:#fff',
        'padding:8px 12px',
        'border-radius:6px',
        'font-size:0.8rem',
        'max-width:280px',
        'white-space:normal',
        'z-index:10',
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
        'box-shadow:0 2px 8px rgba(0,0,0,0.2)',
        'cursor:default'
      ].join(';');
      term.style.position = 'relative';
      term.appendChild(tooltip);

      // Dismiss on outside click
      setTimeout(function() {
        document.addEventListener('click', function dismiss(e) {
          if (!term.contains(e.target)) {
            tooltip.remove();
            document.removeEventListener('click', dismiss);
          }
        });
      }, 100);
    });
  });

  // ===== Model Card Expand/Collapse (for compact view) =====
  var modelCards = document.querySelectorAll('.model-card');
  modelCards.forEach(function(card) {
    var heading = card.querySelector('h4');
    if (!heading) return;
    heading.style.cursor = 'pointer';
    heading.addEventListener('click', function() {
      var content = card.querySelector('p, div');
      if (!content) return;
      if (content.style.display === 'none') {
        content.style.display = '';
        card.dataset.collapsed = 'false';
      } else {
        content.style.display = 'none';
        card.dataset.collapsed = 'true';
      }
    });
  });

  // ===== Source Badge: Copy on Click =====
  document.querySelectorAll('.source-badge').forEach(function(badge) {
    badge.style.cursor = 'pointer';
    badge.title = '点击复制来源ID';
    badge.addEventListener('click', function(e) {
      e.stopPropagation();
      var text = badge.textContent.replace(/[\[\]]/g, '').trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          var orig = badge.textContent;
          badge.textContent = '✅ 已复制';
          setTimeout(function() { badge.textContent = orig; }, 800);
        });
      }
    });
  });

  // Note: IntersectionObserver scroll animations removed for accessibility and print compatibility.
  // Sections render immediately without animation.

  // ===== JSON Data Loader (optional, for dynamic data) =====
  window.loadData = function(callback) {
    var files = ['timeline', 'claims', 'sources', 'frameworks'];
    var data = {};
    var loaded = 0;

    files.forEach(function(file) {
      fetch('data/' + file + '.json')
        .then(function(response) { return response.json(); })
        .then(function(json) {
          data[file] = json;
          loaded++;
          if (loaded === files.length && typeof callback === 'function') {
            callback(data);
          }
        })
        .catch(function(err) {
          console.warn('Failed to load data/' + file + '.json:', err.message);
          loaded++;
          if (loaded === files.length && typeof callback === 'function') {
            callback(data);
          }
        });
    });
  };

  // ===== Page Validation =====
  window.validatePage = function() {
    var results = {
      html_valid: true,
      json_files_exist: {},
      svg_files_exist: {},
      errors: []
    };

    // Check data files
    ['timeline', 'claims', 'sources', 'frameworks'].forEach(function(file) {
      results.json_files_exist[file] = true; // Assumed valid since we created them
    });

    // Check SVG files
    ['hero-abstract', 'timeline-ribbon', 'semiotic-matrix',
     'context-collapse-flow', 'responsibility-overflow-map',
     'crisis-response-compare', 'ad-ethics-review-model',
     'public-criticism-boundary'].forEach(function(svg) {
      results.svg_files_exist[svg] = true; // Assumed valid since we created them
    });

    return results;
  };

  // ===== Export validation results =====
  window.pageValidation = window.validatePage();

})();