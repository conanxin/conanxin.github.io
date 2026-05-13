document.addEventListener('DOMContentLoaded', () => {
  // 1. Timeline node click to expand detail
  document.querySelectorAll('.timeline-node').forEach(node => {
    const detail = node.querySelector('.timeline-detail');
    if (detail) {
      node.setAttribute('tabindex', '0');
      node.setAttribute('role', 'button');
      node.setAttribute('aria-expanded', 'false');

      const toggle = () => {
        const isActive = detail.classList.toggle('active');
        node.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      };

      node.addEventListener('click', toggle);
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    }
  });

  // 2. Evidence level filter
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  filterBtns.forEach(btn => {
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Toggle active state
      btn.classList.toggle('active');
      btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
      
      // Get all active filters
      const activeFilters = Array.from(filterBtns)
        .filter(b => b.classList.contains('active'))
        .map(b => b.dataset.filter);
      
      // Filter claims
      document.querySelectorAll('.claim-item').forEach(item => {
        const level = item.dataset.level;
        if (activeFilters.length === 0 || activeFilters.includes(level)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 3. View mode toggle (verified / interview / ethics)
  const viewBtns = document.querySelectorAll('.view-btn[data-view]');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      
      // Update button states
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Show/hide sections
      document.querySelectorAll('.section-block').forEach(section => {
        if (view === 'all') {
          section.style.display = '';
        } else if (view === 'verified') {
          section.style.display = section.dataset.verified === 'true' ? '' : 'none';
        } else if (view === 'interview') {
          section.style.display = section.dataset.interview === 'true' ? '' : 'none';
        } else if (view === 'ethics') {
          section.style.display = section.dataset.ethics === 'true' ? '' : 'none';
        }
      });
    });
  });

  // 4. Interview accordion
  document.querySelectorAll('.interview-header').forEach(header => {
    const content = header.nextElementSibling;
    const arrow = header.querySelector('.arrow');
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');

    const toggle = () => {
      if (content.classList.contains('active')) {
        content.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        if (arrow) arrow.textContent = '▶';
      } else {
        content.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        if (arrow) arrow.textContent = '▼';
      }
    };

    header.addEventListener('click', toggle);
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // 5. Source footnote scroll
  document.querySelectorAll('a[href^="#source-"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.style.background = '#fff3e0';
        setTimeout(() => { target.style.background = ''; }, 2000);
      }
    });
  });

  // Smooth scroll for TOC links
  document.querySelectorAll('.toc a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Reading progress / section highlight
  const sections = document.querySelectorAll('section[id]');
  const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  
  function updateActiveSection() {
    let current = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) {
        current = section.id;
      }
    });
    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();
});
