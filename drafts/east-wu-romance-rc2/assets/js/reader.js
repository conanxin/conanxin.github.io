/* 《赤壁以东：东吴演义》阅读器脚本 */

// 1. 阅读进度条
function initProgressBar() {
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  document.body.appendChild(bar);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}

// 2. 返回顶部
function initBackToTop() {
  const btn = document.createElement('a');
  btn.className = 'back-to-top';
  btn.href = '#';
  btn.textContent = '↑';
  btn.title = '返回顶部';
  btn.setAttribute('aria-label', '返回顶部');
  document.body.appendChild(btn);
  
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 3. 本地阅读进度存储（章节级）
function getChapterNumber() {
  const match = window.location.pathname.match(/(\d{3})_/);
  return match ? match[1] : null;
}

function saveReadingProgress() {
  const num = getChapterNumber();
  if (!num) return;
  try {
    const saved = JSON.parse(localStorage.getItem('ewr_reading_progress') || '{}');
    saved[num] = { visited: true, at: Date.now() };
    localStorage.setItem('ewr_reading_progress', JSON.stringify(saved));
  } catch (e) {}
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initBackToTop();
  saveReadingProgress();
});