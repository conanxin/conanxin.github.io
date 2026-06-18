/* =========================================================
   Calvin and Hobbes · 完整性的代价
   静态页面脚本 —— 导航 / 折叠 / 回到顶部
   ========================================================= */

(function () {
  'use strict';

  // ---------- 1. 回到顶部按钮 ----------
  var btn = document.getElementById('back-to-top');
  if (btn) {
    // 节流避免抖动
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 480) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- 2. 移动端顶栏滚动淡化（保留阅读区焦点） ----------
  // 当前未启用特殊行为，预留扩展点。

  // ---------- 3. 内部锚点平滑跳转补偿 ----------
  // 大多数现代浏览器已支持 CSS scroll-behavior: smooth，
  // 但部分旧浏览器需要兼容处理。这里用 JS 兜底。
  var anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 12;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ---------- 4. 折叠区展开状态保存（sessionStorage） ----------
  // 让用户在翻译/背景资料区点击展开后，刷新页面保留展开项。
  try {
    var blocks = document.querySelectorAll('.bg-block');
    blocks.forEach(function (b, idx) {
      var key = 'chi-bg-' + idx;
      var saved = sessionStorage.getItem(key);
      if (saved === '1') b.setAttribute('open', '');
      b.addEventListener('toggle', function () {
        sessionStorage.setItem(key, b.hasAttribute('open') ? '1' : '0');
      });
    });
  } catch (err) {
    // sessionStorage 不可用时静默忽略
  }
})();