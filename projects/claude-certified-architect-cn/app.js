/* CLAUDE-CCA-CN-PAGE-1 · app.js
 * Interactive logic for the CCA-F Chinese study dashboard.
 * Aligned to actual CSS class names:
 *   - domain tabs/panels: .active
 *   - roadmap switcher/panels: .active
 *   - copy button state: .copy-btn.copied
 *   - back-to-top: .show  (display:block on #backToTop)
 * No external deps. Vanilla JS. Every bind is guarded with no-op fallbacks.
 */
(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ============================================================
   * 1) Progress bar driven by #checklist-root checkboxes
   *    Persist to localStorage (cca-cn-checklist).
   * ============================================================ */
  function updateProgress() {
    const root = $('#checklist-root');
    if (!root) return;
    const boxes = $$('input[type="checkbox"]', root);
    const total = boxes.length;
    const done = boxes.filter(b => b.checked).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    const fill = $('#progressFill');
    const text = $('#progressText');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = '完成度 ' + done + ' / ' + total + ' · ' + pct + '%';
    try {
      localStorage.setItem('cca-cn-checklist', JSON.stringify(boxes.map(b => b.checked)));
    } catch (e) { /* storage may be disabled */ }
  }

  function bindChecklist() {
    const root = $('#checklist-root');
    if (!root) return;
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('cca-cn-checklist') || 'null'); } catch (e) {}
    if (Array.isArray(saved)) {
      $$('input[type="checkbox"]', root).forEach((b, i) => {
        if (typeof saved[i] === 'boolean') b.checked = saved[i];
      });
    }
    root.addEventListener('change', e => {
      if (e.target && e.target.matches('input[type="checkbox"]')) updateProgress();
    });
    const reset = $('#resetChecklist');
    if (reset) reset.addEventListener('click', () => {
      $$('input[type="checkbox"]', root).forEach(b => (b.checked = false));
      updateProgress();
    });
    updateProgress();
  }

  /* ============================================================
   * 2) Back-to-top button (#backToTop + .show class → display:block)
   * ============================================================ */
  function bindBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;
    const onScroll = () => {
      if (window.scrollY > 400) btn.classList.add('show');
      else btn.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
   * 3) Generic tab/panel switcher.
   *    Selector:   [data-target="<panelId>"]   or   [data-roadmap="<panelId>"]
   *    Button active class:  .active
   *    Panel active class:   .active  (added to the target panel)
   * ============================================================ */
  function bindTabGroup(buttonAttr, panelSelectorFn) {
    const buttons = $$('[' + buttonAttr + ']');
    if (buttons.length === 0) return;
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute(buttonAttr);
        buttons.forEach(b => b.classList.toggle('active', b === btn));
        panelSelectorFn(target).forEach(panel => {
          panel.classList.toggle('active', panel.id === target);
        });
      });
    });
  }

  function bindDomainTabs() {
    bindTabGroup('data-target', (target) => $$('.domain-panel'));
  }

  function bindRoadmapTabs() {
    bindTabGroup('data-roadmap', (target) => $$('.roadmap-panel'));
  }

  /* ============================================================
   * 4) Resource table filter (domain / priority / type)
   *    Rows have data-domain / data-priority / data-type attributes.
   * ============================================================ */
  function bindResourceFilter() {
    const table = $('#resourceTable');
    const fDomain = $('#flt-domain');
    const fPriority = $('#flt-priority');
    const fType = $('#flt-type');
    if (!table) return;
    const rows = $$('tr[data-domain]', table);
    const apply = () => {
      const dv = fDomain ? fDomain.value : 'all';
      const pv = fPriority ? fPriority.value : 'all';
      const tv = fType ? fType.value : 'all';
      rows.forEach(r => {
        const d = r.getAttribute('data-domain') || '';
        const p = r.getAttribute('data-priority') || '';
        const t = r.getAttribute('data-type') || '';
        const ok =
          (dv === 'all' || d === dv) &&
          (pv === 'all' || p === pv) &&
          (tv === 'all' || t === tv);
        r.style.display = ok ? '' : 'none';
      });
    };
    [fDomain, fPriority, fType].forEach(sel => {
      if (sel) sel.addEventListener('change', apply);
    });
    apply();
  }

  /* ============================================================
   * 5) Copy-prompt buttons.
   *    Each <button class="copy-btn"> lives inside <div class="prompt-card"
   *    data-prompt="...">. We find the host .prompt-card and copy its
   *    data-prompt attribute to the clipboard.
   * ============================================================ */
  function flashCopied(btn) {
    const old = btn.textContent;
    btn.textContent = '已复制 ✓';
    btn.classList.add('copied');
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = old;
      btn.classList.remove('copied');
      btn.disabled = false;
    }, 1400);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* swallow */ }
    document.body.removeChild(ta);
  }

  function bindPromptCopy() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.copy-btn');
      if (!btn) return;
      const host = btn.closest('.prompt-card');
      if (!host) return;
      const text = host.getAttribute('data-prompt') || '';
      if (!text) return;
      e.preventDefault();
      Promise.resolve(copyText(text)).then(() => flashCopied(btn));
    });
  }

  /* ============================================================
   * 6) Personal notes autosave (#personal input/textarea)
   * ============================================================ */
  function bindPersonal() {
    const root = $('#personal');
    if (!root) return;
    const fields = $$('input, textarea', root);
    const key = 'cca-cn-personal-v1';
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) {}
    if (saved && typeof saved === 'object') {
      fields.forEach(f => {
        if (saved[f.name] != null && f.name) f.value = saved[f.name];
      });
    }
    const persist = () => {
      const data = {};
      fields.forEach(f => { if (f.name) data[f.name] = f.value; });
      try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
    };
    fields.forEach(f => f.addEventListener('input', persist));
  }

  /* ============================================================
   * Boot
   * ============================================================ */
  function boot() {
    bindChecklist();
    bindBackToTop();
    bindDomainTabs();
    bindRoadmapTabs();
    bindResourceFilter();
    bindPromptCopy();
    bindPersonal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
