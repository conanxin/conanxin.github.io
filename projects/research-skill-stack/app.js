/* Research Skill Stack — v1.0 · 2026-06-15
   纯静态、无依赖。功能：主题切换 / TOC 跟随 / 阅读进度 / 折叠 / 复制 / 错误桶展开 / 7-day 勾选 / log 本地缓存。
*/
(function () {
  'use strict';

  var STORAGE = {
    theme: 'rss.theme',
    log: 'rss.log',
    days: 'rss.days'
  };

  // ---------------- theme toggle ----------------
  function initTheme() {
    var root = document.documentElement;
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var saved = null;
    try { saved = localStorage.getItem(STORAGE.theme); } catch (e) {}
    if (saved === 'lab' || saved === 'notebook') root.setAttribute('data-theme', saved);
    btn.addEventListener('click', function () {
      var cur = root.getAttribute('data-theme') || 'notebook';
      var nxt = cur === 'notebook' ? 'lab' : 'notebook';
      root.setAttribute('data-theme', nxt);
      try { localStorage.setItem(STORAGE.theme, nxt); } catch (e) {}
    });
  }

  // ---------------- TOC active + read progress ----------------
  function initToc() {
    var links = document.querySelectorAll('.toc-link');
    if (!links.length) return;
    var targets = [];
    links.forEach(function (a) {
      var id = a.getAttribute('data-target');
      var el = document.getElementById(id);
      if (el) targets.push({ el: el, link: a });
    });
    if (!targets.length) return;

    var progress = document.getElementById('readProgress');
    var pct = document.getElementById('readPct');

    function onScroll() {
      var winH = window.innerHeight;
      var docH = document.documentElement.scrollHeight - winH;
      var sc = window.scrollY;
      var ratio = docH > 0 ? Math.min(1, sc / docH) : 0;
      if (progress) progress.style.width = (ratio * 100).toFixed(1) + '%';
      if (pct) pct.textContent = Math.round(ratio * 100) + '%';

      // active section: the last one whose top is above 30% viewport
      var pivot = sc + winH * 0.3;
      var active = null;
      for (var i = 0; i < targets.length; i++) {
        var top = targets[i].el.getBoundingClientRect().top + sc;
        if (top <= pivot) active = targets[i];
        else break;
      }
      links.forEach(function (l) { l.classList.remove('is-active'); });
      if (active) active.link.classList.add('is-active');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  // ---------------- Error bucket expand ----------------
  function initBuckets() {
    var buckets = document.querySelectorAll('.error-bucket .bucket-row');
    buckets.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var li = btn.closest('.error-bucket');
        if (!li) return;
        li.classList.toggle('is-open');
      });
    });
  }

  // ---------------- 7-day plan progress ----------------
  function initPlan() {
    var days = document.querySelectorAll('.day-card');
    if (!days.length) return;
    var doneCount = 0;
    var progress = document.getElementById('planProgress');
    var counter = progress ? progress.querySelector('span') : null;

    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE.days) || '{}'); } catch (e) {}
    saved = saved || {};

    days.forEach(function (card) {
      var id = card.getAttribute('data-day');
      var tasks = card.querySelectorAll('.day-tasks li');
      var dayDone = true;
      tasks.forEach(function (t, i) {
        var key = id + ':' + i;
        if (saved[key]) t.classList.add('is-done');
        if (!t.classList.contains('is-done')) dayDone = false;
        t.addEventListener('click', function () {
          t.classList.toggle('is-done');
          var cur = null;
          try { cur = JSON.parse(localStorage.getItem(STORAGE.days) || '{}'); } catch (e) {}
          cur = cur || {};
          if (t.classList.contains('is-done')) cur[key] = 1; else delete cur[key];
          try { localStorage.setItem(STORAGE.days, JSON.stringify(cur)); } catch (e) {}
          recalc();
        });
      });
      if (dayDone) card.classList.add('is-done');
    });

    function recalc() {
      var n = 0;
      document.querySelectorAll('.day-card').forEach(function (c) {
        var all = c.querySelectorAll('.day-tasks li');
        var done = c.querySelectorAll('.day-tasks li.is-done');
        if (all.length && all.length === done.length) {
          c.classList.add('is-done'); n++;
        } else {
          c.classList.remove('is-done');
        }
      });
      doneCount = n;
      if (counter) counter.textContent = String(doneCount);
    }
    recalc();
  }

  // ---------------- Log template ----------------
  function initLog() {
    var form = document.getElementById('logForm');
    if (!form) return;
    var copyBtn = document.getElementById('logCopy');
    var resetBtn = document.getElementById('logReset');
    var toast = document.getElementById('logToast');

    // restore
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE.log) || '{}'); } catch (e) {}
    saved = saved || {};
    ['hypothesis','setup','expectation','result','updated_belief'].forEach(function (k) {
      var el = form.querySelector('[name="' + k + '"]');
      if (el && saved[k]) el.value = saved[k];
      if (el) el.addEventListener('input', function () {
        var cur = null;
        try { cur = JSON.parse(localStorage.getItem(STORAGE.log) || '{}'); } catch (e) {}
        cur = cur || {};
        cur[k] = el.value;
        try { localStorage.setItem(STORAGE.log, JSON.stringify(cur)); } catch (e) {}
      });
    });

    if (copyBtn) copyBtn.addEventListener('click', function () {
      var md = '# Research Log · ' + new Date().toISOString().slice(0, 10) + '\n\n';
      ['hypothesis','setup','expectation','result','updated_belief'].forEach(function (k) {
        var el = form.querySelector('[name="' + k + '"]');
        var labels = {
          hypothesis: 'Hypothesis · 假设',
          setup: 'Setup · 设置',
          expectation: 'Expectation · 预期',
          result: 'Result · 结果',
          updated_belief: 'Updated Belief · 修正后的判断'
        };
        md += '## ' + labels[k] + '\n' + ((el && el.value) || '_(empty)_') + '\n\n';
      });
      copyText(md).then(function () {
        if (toast) {
          toast.textContent = '已复制为 Markdown ✓';
          toast.classList.add('is-show');
          setTimeout(function () { toast.classList.remove('is-show'); }, 1800);
        }
      }).catch(function () {
        if (toast) {
          toast.textContent = '复制失败，请手动选择';
          toast.classList.add('is-show');
          setTimeout(function () { toast.classList.remove('is-show'); }, 1800);
        }
      });
    });

    if (resetBtn) resetBtn.addEventListener('click', function () {
      try { localStorage.removeItem(STORAGE.log); } catch (e) {}
      if (toast) {
        toast.textContent = '已清空';
        toast.classList.add('is-show');
        setTimeout(function () { toast.classList.remove('is-show'); }, 1200);
      }
    });
  }

  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(t);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error('exec failed'));
      } catch (e) { reject(e); }
    });
  }

  // ---------------- smooth anchor focus ----------------
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var id = a.getAttribute('href').slice(1);
        if (!id) return;
        var el = document.getElementById(id);
        if (!el) return;
        ev.preventDefault();
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
        history.replaceState(null, '', '#' + id);
      });
    });
  }

  // ---------------- boot ----------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  function boot() {
    initTheme();
    initToc();
    initBuckets();
    initPlan();
    initLog();
    initAnchors();
  }
})();
