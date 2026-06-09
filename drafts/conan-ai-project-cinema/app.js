/**
 * Conan AI Project Cinema — CP-1A
 * Lightweight JS interactions:
 * - Scroll progress bar
 * - Section enter animations
 * - Project card expand
 * - Reduced motion support
 */

(function () {
  'use strict';

  // ── Reduced motion check ──
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // ── Scroll Progress Bar ──
  const progressBar = document.getElementById('scrollProgress');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = pct + '%';
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ── Section Enter Animations (IntersectionObserver) ──
  if (!prefersReducedMotion) {
    const scenes = document.querySelectorAll('.scene');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    scenes.forEach((scene) => observer.observe(scene));
  } else {
    // If reduced motion, just show all scenes immediately
    document.querySelectorAll('.scene').forEach((scene) => {
      scene.classList.add('visible');
    });
  }

  // ── Project Card Expand ──
  const tooltip = document.getElementById('expandTooltip');
  const cards = document.querySelectorAll('.project-card');

  let hideTimeout;

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const desc = card.getAttribute('data-desc') || 'No description available.';
      tooltip.textContent = desc;
      tooltip.classList.add('show');

      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        tooltip.classList.remove('show');
      }, 3000);
    });
  });

  // Hide tooltip on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.project-card') && tooltip) {
      tooltip.classList.remove('show');
      clearTimeout(hideTimeout);
    }
  });

  // ── Constellation node interaction ──
  const constellationNodes = document.querySelectorAll('.const-node');
  constellationNodes.forEach((node) => {
    node.addEventListener('click', () => {
      const label = node.getAttribute('data-label');
      // Could link to project page in future phases
      console.log('[Cinema] Constellation node clicked:', label);
    });
  });

  // ── Agent strip horizontal scroll with mouse wheel ──
  const agentStrip = document.getElementById('agentStrip');
  if (agentStrip) {
    agentStrip.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        agentStrip.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

})();
