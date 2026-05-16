/* === YANG FUDONG: FRAGRANT RIVER - App Logic === */

let worksData = null;
let sectionsData = null;
let sourcesData = null;
let currentFloor = 1;
let selectedWorkId = null;
let activeThemeFilter = null;
let tourIndex = 0;
let tourRoute = [];
let audioOn = false;

/* ---------- DATA LOADING ---------- */
async function loadData() {
  try {
    const [w, s, src] = await Promise.all([
      fetch('data/works.json').then(r => r.ok ? r.json() : Promise.reject('works.json')),
      fetch('data/sections.json').then(r => r.ok ? r.json() : Promise.reject('sections.json')),
      fetch('data/sources.json').then(r => r.ok ? r.json() : Promise.reject('sources.json'))
    ]);
    worksData = w;
    sectionsData = s;
    sourcesData = src;
    initApp();
  } catch (e) {
    console.warn('JSON load failed, using inline fallback:', e);
    useInlineFallback();
  }
}

function useInlineFallback() {
  // Minimal inline data so the page still works when opened via file://
  worksData = {
    exhibition: {
      title_zh: "杨福东:香河", title_en: "Yang Fudong: Fragrant River",
      venue: "UCCA 尤伦斯当代艺术中心,北京", dates: "2025.11.22 - 2026.05.31",
      curators: "田霏宇 Philip Tinari、刘倩兮 Chelsea Qianxi Liu"
    },
    works: [
      { number: 1, title_zh: "少年少年", title_en: "Young Man, Young Man", year: "2025", medium_zh: "5 频彩色有声 16 毫米胶片影像装置", duration: "每频约 9'54''-13'20''", floor: 1, zone: "一层西侧", themes: ["成长", "记忆重构", "1980年代", "青春"], interpretation: "以16毫米彩色胶片重构杨福东80年代在北京军旅大院的少年记忆。奔跑、练武、等公交、游泳、穿越玉米地--仿佛一个永不结束的漫长夏天。", source_note: "来源:UCCA 官方电子手册" },
      { number: 2, title_zh: "乐郊私语", title_en: "Private Notes from a Land of Bliss", year: "2025", medium_zh: "15 联画装置", duration: "", floor: 1, zone: "一层中部", themes: ["文人出行", "绘画电影", "长卷", "迷宫"], interpretation: "受南宋马远《西园雅集图》启发,以15联画装置唤起古典文人出行母题,与《香河》迷宫形成对照。", source_note: "来源:UCCA 官方电子手册" },
      { number: 3, title_zh: "善意的谎言之一", title_en: "White Lie I", year: "2025", medium_zh: "布面丙烯、铅笔、木炭、玻璃、摄影图片", duration: "", floor: 1, zone: "一层中部", themes: ["虚构", "绘画", "记忆碎片"], interpretation: "混合媒介绘画,探讨记忆重构中真实与虚构的边界。", source_note: "来源:UCCA 官方电子手册" },
      { number: 4, title_zh: "善意的谎言之二", title_en: "White Lie II", year: "2025", medium_zh: "布面丙烯、铅笔、木炭、塑料布、镜子、摄影图片", duration: "", floor: 1, zone: "一层中部", themes: ["虚构", "镜子", "反射"], interpretation: "加入镜子与塑料布,暗示记忆的不可靠性。", source_note: "来源:UCCA 官方电子手册" },
      { number: 5, title_zh: "县长县长", title_en: "County Magistrate, County Magistrate", year: "2024-2025", medium_zh: "彩色有声单频数字影像", duration: "22'07''", floor: 1, zone: "一层东侧", themes: ["迁移", " dusk", "山村", "家园"], interpretation: "一场未指明的集体迁移。村民在暮色中沿山路前行,空置房屋仍保留温度。", source_note: "来源:UCCA 官方电子手册" },
      { number: 6, title_zh: "在颐和园", title_en: "At the Summer Palace", year: "2024-2025", medium_zh: "彩色有声单频 16 毫米胶片影像", duration: "39'16''", floor: 1, zone: "一层东侧", themes: ["时间错位", "梦境", "父子"], interpretation: "跟随男人与小男孩漫步颐和园。时间悄然脱轨,如慵懒午后半醒的梦。", source_note: "来源:UCCA 官方电子手册" },
      { number: 7, title_zh: "轻风不动", title_en: "Unmoved by Gentle Breezes", year: "2025", medium_zh: "数码图片和影像", duration: "", floor: 1, zone: "一层东侧", themes: ["时间痕迹", "光影", "静物"], interpretation: "捕捉微风不动之时的光影滞留,探讨时间在图像表面的沉积。", source_note: "来源:UCCA 官方电子手册" },
      { number: 8, title_zh: "\"香河\"系列黑白摄影", title_en: "\"Fragrant River\" Series, Black-and-White Photograph", year: "2025", medium_zh: "收藏级喷墨打印", duration: "", floor: 2, zone: "二层入口区域", themes: ["摄影", "黑白", "香河", "档案"], interpretation: "与15频装置同名的黑白摄影系列,凝固为可反复凝视的切片。", source_note: "来源:UCCA 官方电子手册" },
      { number: 9, title_zh: "香河", title_en: "Fragrant River", year: "2016-2025", medium_zh: "15 频黑白有声数码影像装置", duration: "每频约 20'42''-33'01''", floor: 2, zone: "二层核心迷宫", themes: ["家乡", "时间", "春节", "母亲", "迷宫"], interpretation: "展览核心。15个屏幕分布在9个多层嵌套空间中,时间转化为散落各处的空间形态。", source_note: "来源:UCCA 官方电子手册" },
      { number: 10, title_zh: "一二五六七:杨福东《香河》纪录片", title_en: "Sunday Monday Tuesday Friday Saturday: A Documentary on Yang Fudong's Fragrant River", year: "2016-2025", medium_zh: "彩色有声单频影像(纪录片)", duration: "约 108'", floor: 2, zone: "二层核心区旁", themes: ["纪录片", "幕后", "创作过程"], interpretation: "张京华导演记录《香河》从2016拍摄到2025后期的漫长过程。", source_note: "来源:UCCA 官方电子手册" },
      { number: 11, title_zh: "哺乳期", title_en: "Breastfeeding", year: "2025", medium_zh: "家具影像装置", duration: "", floor: 2, zone: "二层核心区", themes: ["家具", "旧物", "记忆空间", "CRT电视"], interpretation: "以80-90年代老旧家具和电视机为中心,老式CRT播放2000年代初的家庭录像。", source_note: "来源:UCCA 官方电子手册" },
      { number: 12, title_zh: "青春", title_en: "Youth", year: "2025", medium_zh: "档案照片翻拍制作", duration: "", floor: 2, zone: "二层核心区", themes: ["档案", "青春", "老照片"], interpretation: "对档案照片翻拍再制作,青春作为时间命题被反复书写。", source_note: "来源:UCCA 官方电子手册" },
      { number: 13, title_zh: "后房-嘿,天亮了", title_en: "Backyard - Hey! Sun is Rising", year: "2001", medium_zh: "单频影像,35毫米黑白电影胶片转DVD", duration: "13'00''", floor: 2, zone: "二层早期作品区", themes: ["早期作品", "黑白", "军装", "梦游"], interpretation: "身着旧式军装的男子在凌晨城市中游荡,如梦游。早期探索影像赋形情绪的代表作。", source_note: "来源:UCCA 官方电子手册" },
      { number: 14, title_zh: "父亲的烟火", title_en: "Father's Fireworks", year: "2025", medium_zh: "单频数字影像", duration: "约 4'30''", floor: 2, zone: "二层核心区", themes: ["父亲", "烟火", "家庭"], interpretation: "以烟火为意象,捕捉父亲形象在记忆与现实中闪烁的瞬间。", source_note: "来源:UCCA 官方电子手册" },
      { number: 15, title_zh: "新年快乐", title_en: "Happy New Year", year: "2002-2025", medium_zh: "数码打印,共27张", duration: "", floor: 2, zone: "二层核心区", themes: ["春节", "时间跨度", "家庭"], interpretation: "跨度超过二十年的27张数码打印,记录时间在不同媒介与家庭场景中的沉积。", source_note: "来源:UCCA 官方电子手册" },
      { number: 16, title_zh: "早期作品", title_en: "Early Works", year: "1992-2002", medium_zh: "油画、35毫米黑白电影、行为记录等", duration: "《陌生天堂》76'", floor: 2, zone: "二层早期作品区", themes: ["早期创作", "陌生天堂", "文献"], interpretation: "汇集1990年代至2002年早期创作,包括《江南造船厂·速写》《别处:93表演记录》《陌生天堂》等。", source_note: "来源:UCCA 官方电子手册" }
    ]
  };
  sectionsData = {
    sections: [
      { id: "xianghe-as-metaphor", number: 1, title_zh: "作为隐喻的\"香河\"", title_en: "Xianghe as Metaphor", text_zh: "书写家乡几乎是每位创作者都无法回避的命题。杨福东刻意剥离了香河作为地点的具体性,将其抽象为一种与时间有关的感知。它不指向此刻,也不完全指向过去,而是超越了现实时间的另一重时态。", keywords: ["家乡", "怀旧", "异质时间", "隐喻"], related_works: [8,9,10,11,14], viewing_tip: "点击8-11、14号作品,感受香河如何从真实地名溶解为时间与记忆的容器。" },
      { id: "out-of-place-out-of-time", number: 2, title_zh: "恍若隔世的意境感", title_en: "Out of Place, Out of Time", text_zh: "杨福东对时间线的处理总是非线性和多重交错的。展览空间本身同样充满象征性:拒绝单一参观路线,多通道多方向,观众可能徘徊、折返甚至迷失。光线与梦境般的超现实场景,构建出时间与空间双重疏离的世界。", keywords: ["非线性", "时空疏离", "梦境", "超现实"], related_works: [2,5,6,9,13], viewing_tip: "点击9号《香河》,在迷宫中尝试折返徘徊,体会空间如何成为时间的物质化形态。" },
      { id: "form-as-narrative", number: 3, title_zh: "形式作为叙事", title_en: "Form as Narrative", text_zh: "胶片质感的旧影效果,迷离飘忽的氛围,人物漫无目的又似出神入神。通过放慢和重复动作拉长时间;多频装置让空间从不同方位展现却无法定位;消除对话的静默蓄积起\"记忆深刻但又不真实\"的意识流动。", keywords: ["胶片质感", "静默", "慢动作", "多频装置"], related_works: [1,2,6,7,9,11], viewing_tip: "对比1号16毫米彩色胶片与9号黑白数码质感;注意11号老式CRT如何将影像延伸至家具空间。" },
      { id: "imagined-film", number: 4, title_zh: "想象中的电影", title_en: "The Imagined Film", text_zh: "杨福东自2009年起探索\"美术馆电影\"或\"空间电影\"。在\"香河\"中,15频装置在交错空间中展开影像时间叙事;《乐郊私语》探讨电影与长卷绘画的关联。此外还融入\"图书馆电影计划\"--将项目视作精神生活图书馆的开篇藏书。", keywords: ["文人电影", "图书馆电影计划", "绘画电影", "空间电影"], related_works: [2,9,10,16], viewing_tip: "将2号手卷逻辑与9号迷宫多频叙事并置,思考电影如何突破银幕边界成为空间中的想象。" }
    ]
  };
  sourcesData = {
    sources: [
      { id: "ucca-exhibition-page", title: "UCCA 官方展览页", url: "https://ucca.org.cn/en/exhibition/yang-fudong/", type: "webpage", publisher: "UCCA Center for Contemporary Art", date_accessed: "2026-05-16", notes: "展览概述、策展人信息、作品列表、装置照片、视频、公共项目。" },
      { id: "ucca-exhibition-guide-pdf", title: "UCCA 官方电子手册 PDF", url: "https://ucca.org.cn/en/download/4/0/a/123a5d-3b4c3b-2a49de/yang_fudong_fragrant_river.pdf", type: "pdf", publisher: "UCCA Center for Contemporary Art", date_accessed: "2026-05-16", notes: "16页双语手册,含平面图、16件作品、四个策展章节。" }
    ],
    image_attribution: "本页面未直接嵌入UCCA官网受版权保护的高清图像。视觉元素为CSS生成占位图。",
    copyright_disclaimer: "本页面为基于公开资料整理的非官方学习型线上导览草稿,仅供个人研究。"
  };
  initApp();
}

/* ---------- INIT ---------- */
function initApp() {
  renderHeroMeta();
  renderFloorPlan();
  renderSections();
  renderTimeline();
  renderSources();
  initNotes();
  initAudioToggle();
  setupTour();
  renderSpaceGrid();
    initWalkthroughs();
  // Hash navigation for direct work links
  if (window.location.hash) {
    const num = parseInt(window.location.hash.replace('#work-', ''), 10);
    if (num) setTimeout(() => selectWork(num), 300);
  }
}

function renderHeroMeta() {
  const e = worksData.exhibition;
  const el = document.getElementById('hero-meta');
  if (el) {
    el.innerHTML = `
      <span>${e.venue}</span> · <span>${e.dates}</span><br>
      <span>策展人 ${e.curators}</span>
    `;
  }
  const kw = document.getElementById('hero-keywords');
  if (kw && e.keywords) {
    kw.innerHTML = e.keywords.map(k => `<span class="keyword-chip">${k}</span>`).join('');
  }
}

/* ---------- FLOOR PLAN ---------- */
function renderFloorPlan() {
  const container = document.getElementById('floor-plan-svg');
  if (!container) return;
  const works = worksData.works;
  const floorWorks = works.filter(w => w.floor === currentFloor);

  // Simplified SVG floor plan - abstracted rooms and corridors
  const isFirst = currentFloor === 1;
  const viewW = 640; const viewH = 420;
  let svg = `<svg viewBox="0 0 ${viewW} ${viewH}" xmlns="http://www.w3.org/2000/svg">`;

  if (isFirst) {
    // First floor: three main zones + corridor
    svg += `<rect class="room" data-zone="west" x="20" y="20" width="180" height="180" rx="2" />`;
    svg += `<text class="room-label" x="110" y="110" text-anchor="middle">西侧厅 / West</text>`;
    svg += `<rect class="room" data-zone="center" x="220" y="20" width="240" height="180" rx="2" />`;
    svg += `<text class="room-label" x="340" y="110" text-anchor="middle">中央厅 / Center</text>`;
    svg += `<rect class="room" data-zone="east" x="480" y="20" width="140" height="180" rx="2" />`;
    svg += `<text class="room-label" x="550" y="110" text-anchor="middle">东侧厅 / East</text>`;
    // lower corridor area
    svg += `<rect class="room" data-zone="corridor" x="20" y="220" width="600" height="80" rx="2" />`;
    svg += `<text class="room-label" x="320" y="265" text-anchor="middle">通道 / Corridor</text>`;
    // bottom rooms
    svg += `<rect class="room" data-zone="south" x="20" y="320" width="300" height="80" rx="2" />`;
    svg += `<text class="room-label" x="170" y="365" text-anchor="middle">南厅 / South</text>`;
    svg += `<rect class="room" data-zone="southeast" x="340" y="320" width="280" height="80" rx="2" />`;
    svg += `<text class="room-label" x="480" y="365" text-anchor="middle">东南厅 / SE</text>`;

    // Work dots
    const dots = [
      { n: 1, x: 110, y: 60 },
      { n: 2, x: 340, y: 60 },
      { n: 3, x: 280, y: 140 },
      { n: 4, x: 400, y: 140 },
      { n: 5, x: 550, y: 60 },
      { n: 6, x: 520, y: 140 },
      { n: 7, x: 170, y: 365 }
    ];
    dots.forEach(d => {
      svg += `<circle class="work-dot" data-num="${d.n}" cx="${d.x}" cy="${d.y}" r="7" />`;
      svg += `<text class="work-num" x="${d.x}" y="${d.y+1}">${d.n}</text>`;
    });
  } else {
    // Second floor: labyrinth core + surrounding rooms
    svg += `<rect class="room" data-zone="entry" x="20" y="20" width="120" height="100" rx="2" />`;
    svg += `<text class="room-label" x="80" y="70" text-anchor="middle">入口 / Entry</text>`;
    // labyrinth core (9 nested chambers suggested)
    svg += `<rect class="room" data-zone="core" x="160" y="20" width="320" height="280" rx="2" />`;
    svg += `<text class="room-label" x="320" y="40" text-anchor="middle">核心迷宫 · 香河 Core Labyrinth</text>`;
    // inner chambers
    svg += `<rect class="room" data-zone="chamber" x="180" y="60" width="90" height="70" rx="2" />`;
    svg += `<rect class="room" data-zone="chamber" x="290" y="60" width="90" height="70" rx="2" />`;
    svg += `<rect class="room" data-zone="chamber" x="400" y="60" width="60" height="70" rx="2" />`;
    svg += `<rect class="room" data-zone="chamber" x="180" y="150" width="90" height="70" rx="2" />`;
    svg += `<rect class="room" data-zone="chamber" x="290" y="150" width="90" height="70" rx="2" />`;
    svg += `<rect class="room" data-zone="chamber" x="400" y="150" width="60" height="70" rx="2" />`;
    // right wing
    svg += `<rect class="room" data-zone="east2" x="500" y="20" width="120" height="120" rx="2" />`;
    svg += `<text class="room-label" x="560" y="80" text-anchor="middle">东翼 / East</text>`;
    // bottom
    svg += `<rect class="room" data-zone="south2" x="160" y="320" width="200" height="80" rx="2" />`;
    svg += `<text class="room-label" x="260" y="365" text-anchor="middle">南厅 / South</text>`;
    svg += `<rect class="room" data-zone="early" x="380" y="320" width="240" height="80" rx="2" />`;
    svg += `<text class="room-label" x="500" y="365" text-anchor="middle">早期作品 / Early Works</text>`;

    const dots = [
      { n: 8, x: 80, y: 50 },
      { n: 9, x: 320, y: 110 },
      { n: 10, x: 560, y: 50 },
      { n: 11, x: 225, y: 195 },
      { n: 12, x: 335, y: 195 },
      { n: 13, x: 500, y: 365 },
      { n: 14, x: 430, y: 195 },
      { n: 15, x: 260, y: 365 },
      { n: 16, x: 430, y: 365 }
    ];
    dots.forEach(d => {
      svg += `<circle class="work-dot" data-num="${d.n}" cx="${d.x}" cy="${d.y}" r="7" />`;
      svg += `<text class="work-num" x="${d.x}" y="${d.y+1}">${d.n}</text>`;
    });
  }

  svg += `</svg>`;
  container.innerHTML = svg;

  // Bind interactions
  container.querySelectorAll('.work-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const num = parseInt(dot.dataset.num, 10);
      selectWork(num);
    });
  });
  container.querySelectorAll('.room').forEach(room => {
    room.addEventListener('click', () => {
      // Highlight works in this zone
      const zone = room.dataset.zone;
      // Could add zone filtering here
    });
  });
}

function switchFloor(floor) {
  currentFloor = floor;
  document.getElementById('btn-floor1').classList.toggle('active', floor === 1);
  document.getElementById('btn-floor2').classList.toggle('active', floor === 2);
  renderFloorPlan();
  // Keep selection if on this floor
  if (selectedWorkId) {
    const w = worksData.works.find(x => x.number === selectedWorkId);
    if (w && w.floor !== floor) clearWorkPanel();
  }
}

/* ---------- WORK PANEL ---------- */
function selectWork(num) {
  selectedWorkId = num;
  const w = worksData.works.find(x => x.number === num);
  if (!w) return;

  // Highlight dot
  document.querySelectorAll('.work-dot').forEach(d => d.classList.toggle('active', parseInt(d.dataset.num, 10) === num));

  const panel = document.getElementById('work-panel');
  const chips = (w.themes || []).map(t =>
    `<span class="chip ${t === activeThemeFilter ? 'active-filter' : ''}" data-theme="${t}">${t}</span>`
  ).join('');
  panel.innerHTML = `
    ${renderMediaArea(w)}
    <div class="panel-num">NO. ${w.number} · ${w.floor === 1 ? '一层' : '二层'} · ${w.zone}</div>
    <h3>${w.title_zh}</h3>
    <span class="panel-en">${w.title_en}</span>
    <div class="panel-meta">
      <strong>年份</strong> ${w.year}<br>
      <strong>媒介</strong> ${w.medium_zh}<br>
      ${w.duration ? `<strong>时长</strong> ${w.duration}<br>` : ''}
    </div>
    ${w.suggested_duration ? `<div class="panel-duration">⏱ 建议停留 ${w.suggested_duration}</div>` : ''}
    <div class="panel-desc">${w.interpretation}</div>
    ${w.viewing_tip ? `<div class="panel-viewing-tip"><strong>现场观看提示</strong>:${w.viewing_tip}</div>` : ''}
    ${w.related_works ? `<div class="panel-related"><strong>关联作品</strong>:${w.related_works.map(n => `<a onclick="selectWork(${n})" style="color:var(--accent-warm);cursor:pointer;text-decoration:underline">#${n}</a>`).join('、')}</div>` : ''}
    <div class="panel-chips">${chips}</div>
    <div class="panel-source">${w.source_note}</div>
  `;
  panel.classList.remove('empty');

  // Bind chip clicks
  panel.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const theme = chip.dataset.theme;
      toggleThemeFilter(theme);
    });
  });

  // Scroll panel into view on mobile
  if (window.innerWidth < 960) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearWorkPanel() {
  selectedWorkId = null;
  const panel = document.getElementById('work-panel');
  panel.classList.add('empty');
  panel.innerHTML = `<p>在左侧平面图中点击作品编号,查看详细信息。</p><p style="margin-top:0.5rem;font-size:0.8rem;color:#555">Click a work number on the floor plan.</p>`;
  document.querySelectorAll('.work-dot').forEach(d => d.classList.remove('active'));
}

/* ---------- THEME FILTER ---------- */
function toggleThemeFilter(theme) {
  if (activeThemeFilter === theme) {
    activeThemeFilter = null;
  } else {
    activeThemeFilter = theme;
  }
  renderFloorPlan();
  // Re-highlight if selected work matches filter
  if (selectedWorkId) {
    const w = worksData.works.find(x => x.number === selectedWorkId);
    if (w && (!activeThemeFilter || w.themes.includes(activeThemeFilter))) {
      selectWork(selectedWorkId);
    } else {
      clearWorkPanel();
    }
  }
  // Dim dots that don't match
  document.querySelectorAll('.work-dot').forEach(dot => {
    const num = parseInt(dot.dataset.num, 10);
    const work = worksData.works.find(x => x.number === num);
    const match = !activeThemeFilter || (work && work.themes && work.themes.includes(activeThemeFilter));
    dot.style.opacity = match ? '1' : '0.25';
  });
  // Update filter button
  const btn = document.getElementById('btn-filter');
  if (btn) {
    btn.textContent = activeThemeFilter ? `筛选: ${activeThemeFilter} ✕` : '主题筛选';
    btn.classList.toggle('active', !!activeThemeFilter);
  }
}

/* ---------- SECTIONS ---------- */
function renderSections() {
  const container = document.getElementById('sections-scroll');
  if (!container || !sectionsData) return;
  container.innerHTML = sectionsData.sections.map(sec => `
    <div class="section-card">
      <span class="sec-num">CHAPTER ${sec.number}</span>
      <h3>${sec.title_zh}</h3>
      <span class="sec-en">${sec.title_en}</span>
      <p>${sec.text_zh}</p>
      <div class="sec-keywords">
        ${sec.keywords.map(k => `<span class="chip">${k}</span>`).join('')}
      </div>
      <div class="sec-works">关联作品:<strong>${sec.related_works.join(', ')}</strong></div>
      <div class="viewing-tip">
        <strong>观看提示</strong>:${sec.viewing_tip}
      </div>
    </div>
  `).join('');
}

/* ---------- TIMELINE ---------- */
function renderTimeline() {
  const container = document.getElementById('timeline');
  if (!container) return;
  const items = [
    { year: '1997', title: '构想萌芽', desc: '杨福东完成首部长片《陌生天堂》后不久,萌生以家乡香河为灵感创作的想法。' },
    { year: '1997-2002', title: '《陌生天堂》', desc: '35毫米黑白电影,76分钟。奠定"意会电影"质感。' },
    { year: '2001', title: '《后房-嘿,天亮了》', desc: '早期代表作,35毫米黑白胶片转DVD,13分钟。' },
    { year: '2002-2025', title: '《新年快乐》持续拍摄', desc: '以"新年快乐"为题的系列数码打印,跨越二十余年。' },
    { year: '2003-2007', title: '《竹林七贤》', desc: '五部35毫米黑白电影,探索知识分子精神状态。' },
    { year: '2009', title: '《离信之雾》', desc: '开始探索影像与装置结合的"美术馆电影"/"空间电影"。' },
    { year: '2016.01', title: '《香河》实地拍摄', desc: '带领团队在香河县城与附近村庄辗转拍摄47天。' },
    { year: '2018', title: '个展"明日早朝"', desc: '将电影拍摄现场直接移入美术馆,成为过程性行为探索。' },
    { year: '2020', title: '个展"无限的山峰"', desc: '提出"绘画电影"概念,融合绘画、摄影与影像装置。' },
    { year: '2024-2025', title: '新作拍摄与后期', desc: '《县长县长》《在颐和园》《少年少年》《乐郊私语》等新作完成。' },
    { year: '2025.秋', title: '《香河》后期完成', desc: '15频黑白数码影像装置最终完成,总后期制作历时近十年。' },
    { year: '2025.11.22', title: '展览开幕', desc: 'UCCA 尤伦斯当代艺术中心,北京。策展人:田霏宇、刘倩兮。' },
    { year: '2026.05.31', title: '展览闭幕', desc: '展期持续至2026年5月31日。' }
  ];
  container.innerHTML = items.map(it => `
    <div class="timeline-item">
      <div class="timeline-year">${it.year}</div>
      <div class="timeline-title">${it.title}</div>
      <div class="timeline-desc">${it.desc}</div>
    </div>
  `).join('');
}

/* ---------- MAZE TOUR ---------- */
function setupTour() {
  tourRoute = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  document.getElementById('btn-tour')?.addEventListener('click', startTour);
  document.getElementById('btn-tour-next')?.addEventListener('click', tourNext);
  document.getElementById('btn-tour-prev')?.addEventListener('click', tourPrev);
  document.getElementById('btn-tour-reset')?.addEventListener('click', resetTour);
}

/* ---------- WALKTHROUGH ROUTES ---------- */
const WALKTHROUGHS = {
  'quick': {
    label: '30分钟快速看展',
    works: [9, 1, 6, 15],
    stops: ['floor-plan', 'fragrant-river-core', 'work-09', 'work-01', 'work-06', 'work-15', 'notes']
  },
  'fragrant-river': {
    label: '只看《香河》深度路线',
    works: [9, 8, 10],
    stops: ['fragrant-river-core', 'work-09', 'work-08', 'work-10', 'sections']
  },
  'hometown-family': {
    label: '家乡、母亲与春节路线',
    works: [9, 11, 14, 15, 5],
    stops: ['work-09', 'work-11', 'work-14', 'work-15', 'work-05', 'notes']
  }
};

let activeWalkthrough = null;
let walkthroughIndex = 0;

function startWalkthrough(id) {
  activeWalkthrough = id;
  walkthroughIndex = 0;
  const wt = WALKTHROUGHS[id];
  if (!wt) return;

  // Update UI
  document.querySelectorAll('.walkthrough-card').forEach(c => c.classList.toggle('active', c.dataset.wt === id));
  document.getElementById(`btn-wt-${id}-start`).style.display = 'none';
  document.getElementById(`btn-wt-${id}-next`).style.display = 'inline-flex';

  // Jump to first work
  if (wt.works.length > 0) {
    const first = wt.works[0];
    const w = worksData.works.find(x => x.number === first);
    if (w && w.floor !== currentFloor) switchFloor(w.floor);
    selectWork(first);
    updateWalkthroughProgress();
  }
}

function walkthroughNext() {
  if (!activeWalkthrough) return;
  const wt = WALKTHROUGHS[activeWalkthrough];
  walkthroughIndex++;
  if (walkthroughIndex >= wt.works.length) {
    showToast(`「${wt.label}」路线完成！`);
    resetWalkthrough();
    return;
  }
  const num = wt.works[walkthroughIndex];
  const w = worksData.works.find(x => x.number === num);
  if (w && w.floor !== currentFloor) switchFloor(w.floor);
  selectWork(num);
  updateWalkthroughProgress();
}

function resetWalkthrough() {
  if (activeWalkthrough) {
    document.getElementById(`btn-wt-${activeWalkthrough}-start`).style.display = 'inline-flex';
    document.getElementById(`btn-wt-${activeWalkthrough}-next`).style.display = 'none';
  }
  activeWalkthrough = null;
  walkthroughIndex = 0;
  document.querySelectorAll('.walkthrough-card').forEach(c => c.classList.remove('active'));
  updateWalkthroughProgress();
}

function updateWalkthroughProgress() {
  for (const id of Object.keys(WALKTHROUGHS)) {
    const el = document.getElementById(`wt-progress-${id}`);
    if (!el) continue;
    if (activeWalkthrough === id) {
      const wt = WALKTHROUGHS[id];
      el.textContent = `进度: ${walkthroughIndex + 1} / ${wt.works.length} · 当前: work-${wt.works[walkthroughIndex]}`;
    } else {
      el.textContent = '';
    }
  }
}

// Bind walkthrough buttons on init
function initWalkthroughs() {
  for (const id of Object.keys(WALKTHROUGHS)) {
    document.getElementById(`btn-wt-${id}-start`)?.addEventListener('click', (e) => { e.stopPropagation(); startWalkthrough(id); });
    document.getElementById(`btn-wt-${id}-next`)?.addEventListener('click', (e) => { e.stopPropagation(); walkthroughNext(); });
  }
}

function startTour() {
  tourIndex = 0;
  runTourStep();
}
function tourNext() { if (tourIndex < tourRoute.length - 1) { tourIndex++; runTourStep(); } }
function tourPrev() { if (tourIndex > 0) { tourIndex--; runTourStep(); } }
function resetTour() { tourIndex = 0; updateTourProgress(); clearWorkPanel(); }

function runTourStep() {
  const num = tourRoute[tourIndex];
  const w = worksData.works.find(x => x.number === num);
  if (w && w.floor !== currentFloor) switchFloor(w.floor);
  selectWork(num);
  updateTourProgress();
}

function updateTourProgress() {
  const el = document.getElementById('tour-progress');
  if (el) el.textContent = `迷宫游览 ${tourIndex + 1} / ${tourRoute.length}`;
}

/* ---------- NOTES ---------- */
function initNotes() {
  const ta = document.getElementById('notes-area');
  const status = document.getElementById('notes-status');
  if (!ta) return;
  const saved = localStorage.getItem('yang-fudong-notes');
  if (saved) ta.value = saved;
  ta.addEventListener('input', () => {
    localStorage.setItem('yang-fudong-notes', ta.value);
    if (status) status.textContent = '已自动保存到本地';
    setTimeout(() => { if (status) status.textContent = ''; }, 2000);
  });
}

/* ---------- AUDIO TOGGLE ---------- */
function initAudioToggle() {
  const btn = document.getElementById('audio-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    audioOn = !audioOn;
    btn.classList.toggle('on', audioOn);
    btn.setAttribute('aria-pressed', audioOn);
    // Placeholder: no real audio is loaded due to copyright
    showToast(audioOn ? '环境声模式:已开启(占位状态,未接入音频)' : '环境声模式:已关闭');
  });
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#222;border:1px solid #444;color:#ccc;padding:0.6rem 1rem;border-radius:4px;font-size:0.82rem;z-index:200;opacity:0;transition:opacity 0.3s;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

/* ---------- SOURCES ---------- */
function renderSources() {
  const container = document.getElementById('sources-list');
  if (!container || !sourcesData) return;
  container.innerHTML = sourcesData.sources.map(s => `
    <p>
      <strong>[${s.type === 'pdf' ? 'PDF' : 'Web'}]</strong>
      <a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title}</a>
      - ${s.publisher} ${s.date_accessed ? `(访问于 ${s.date_accessed})` : ''}
      ${s.notes ? `<br><span style="color:#555;font-size:0.78rem">${s.notes}</span>` : ''}
    </p>
  `).join('') + `
    <p style="margin-top:1rem;color:#555;font-size:0.78rem;border-top:1px solid #333;padding-top:0.8rem">
      ${sourcesData.image_attribution || ''}
    </p>
    <p style="color:#555;font-size:0.78rem">
      ${sourcesData.copyright_disclaimer || ''}
    </p>
  `;
}

/* ---------- INTERNAL REFERENCE IMAGE MODE ---------- */

// [initInternalMediaMode removed for public candidate]

// [loadMediaData removed for public candidate]



/* ---------- MEDIA AREA ---------- */
function renderMediaArea(w) {
  const m = w.media || {};

  // 1. User-provided media (self-taken / licensed) — highest priority
  if (m.thumbnail) {
    return renderUserMedia(w, m);
  }

  // 2. SVG placeholder — fallback for missing works (public-safe, no remote fallback)
  const phPath = `assets/placeholders/work-${String(w.number).padStart(2,'0')}-placeholder.svg`;
  return renderPlaceholderMedia(w, phPath);
}

function renderUserMedia(w, m) {
  return `
    <div class="media-area" data-media-state="user">
      <div class="media-state-badge">自摄/授权素材</div>
      <img src="${m.thumbnail}" alt="${w.title_zh} 作品图" loading="lazy">
      ${m.credit ? `<div class="media-credit">${m.credit}</div>` : ''}
    </div>
  `;
}

// [renderInternalMedia removed for public candidate]

function renderPlaceholderMedia(w, phPath) {
  return `
    <div class="media-area" data-media-state="placeholder">
      <div class="media-state-badge placeholder">占位视觉</div>
      <img src="${phPath}" alt="${w.title_zh} 占位图" loading="lazy"
           onerror="this.parentElement.innerHTML=renderGenericPlaceholderHTML(${w.number})">
      <div class="media-pending-label">◫ Media pending · 待补充现场照片</div>
    </div>
  `;
}

function renderPlaceholderMediaHTML(num) {
  const w = worksData.works.find(x => x.number === num);
  const title = w ? w.title_zh : '';
  return `<div class="media-placeholder">
    <span class="ph-icon">◫</span>
    <div>${title || '作品'}</div>
    <div class="ph-text">Media pending · 待补充现场照片</div>
    <div class="ph-text">请将照片放入 assets/inbox/ 并更新 manifest.json</div>
  </div>`;
}

function renderGenericPlaceholderHTML(num) {
  return renderPlaceholderMediaHTML(num);
}

/* ---------- MEDIA LIGHTBOX ---------- */
/* [Lightbox simplified for public candidate - only for self/licensed media] */
function openMediaLightbox(workNumber, index) {
  const w = worksData.works.find(x => x.number === workNumber);
  if (!w || !w.media || !w.media.thumbnail) return;
  const title = w.title_zh || '';

  let lb = document.getElementById('media-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'media-lightbox';
    lb.style.cssText = 'display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.92);align-items:center;justify-content:center;padding:2rem;';
    lb.innerHTML = `
      <div style="position:relative;max-width:90vw;max-height:90vh">
        <button onclick="closeMediaLightbox()" style="position:absolute;top:-2rem;right:0;background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer">&times;</button>
        <img id="lb-img" src="" style="max-width:90vw;max-height:70vh;object-fit:contain;display:block">
        <div id="lb-meta" style="margin-top:0.8rem;color:#ccc;font-size:0.8rem;max-width:600px"></div>
      </div>
    `;
    lb.addEventListener('click', e => { if (e.target === lb) closeMediaLightbox(); });
    document.body.appendChild(lb);
  }
  const m = w.media;
  document.getElementById('lb-img').src = m.thumbnail;
  document.getElementById('lb-meta').innerHTML = `
    <p><strong>${title}</strong></p>
    <p>${m.credit ? 'Credit: ' + m.credit : ''}</p>
    <p>${m.rightsNote ? m.rightsNote : '自摄/授权素材 / Self-taken or licensed media'}</p>
  `;
  lb.style.display = 'flex';
}

function closeMediaLightbox() {
  const lb = document.getElementById('media-lightbox');
  if (lb) lb.style.display = 'none';
}

/* ---------- ROUTE SELECTOR ---------- */
const ROUTES = {
  'first-visit': { label: '初次进入', works: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16] },
  'fragrant-river': { label: '只看《香河》', works: [8,9,10,11,12,14,15] },
  'film-maze': { label: '影像迷宫', works: [1,5,6,9,10,13] },
  'hometown': { label: '家乡与怀旧', works: [5,8,9,11,14,15] }
};

function activateRoute(routeId) {
  // Update UI
  document.querySelectorAll('.route-card').forEach(c => c.classList.toggle('active', c.dataset.route === routeId));
  const route = ROUTES[routeId];
  const hint = document.getElementById('route-active-hint');
  if (hint && route) {
    hint.textContent = `已选择「${route.label}」路线 · 点击作品编号 ${route.works.join(' → ')} 依次浏览`;
  }
  // Set tour to this route
  tourRoute = [...route.works];
  tourIndex = 0;
  // Jump to first work of this route
  const first = route.works[0];
  const w = worksData.works.find(x => x.number === first);
  if (w && w.floor !== currentFloor) switchFloor(w.floor);
  selectWork(first);
  updateTourProgress();
}

/* ---------- ATMOSPHERE MODES ---------- */
function setAtmosphere(mode) {
  document.body.classList.remove('mode-darkroom', 'mode-booklet', 'mode-projector');
  if (mode !== 'normal') document.body.classList.add(`mode-${mode}`);
  document.querySelectorAll('.atmosphere-bar .btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  showToast(`展厅氛围:${mode === 'normal' ? '正常' : mode === 'darkroom' ? '暗房' : mode === 'booklet' ? '手册' : '投影'}`);
}

/* ---------- FRAGRANT RIVER 9 SPACES ---------- */
const SPACES = [
  { id: 1, label: '入口前厅', screens: 1, keywords: ['迎接','母亲','日常'], feeling: '进入的第一个空间,画面温和,像是被邀请进入一个家庭的日常。光线比外部走廊稍暗,你开始适应展厅的暗房氛围。', relation: '对应作品《香河》中母亲筹备春节庆典的开场,也暗示观众从现实进入记忆迷宫的过渡。' },
  { id: 2, label: '南向小室', screens: 2, keywords: ['劳作','重复','时间'], feeling: '两个屏幕同时播放手工劳作的循环画面。时间在重复的动作中被拉长,你开始感觉到一种北方村庄特有的缓慢节奏。', relation: '对应"时间通过重复工作被测量"的策展论述,与《轻风不动》形成跨楼层呼应。' },
  { id: 3, label: '东向通道', screens: 1, keywords: ['穿行','过渡','迷失'], feeling: '这是一个连接性空间,只有一个屏幕。你不是在"观看",而是在"经过"。影像内容似乎被你的移动本身激活。', relation: '艺术家强调的"观众移动成为时间展开的手段",迷宫没有固定起点与终点的空间证明。' },
  { id: 4, label: '中央大室', screens: 3, keywords: ['春节','仪式','聚集'], feeling: '三个屏幕从不同角度同时呈现同一个村庄春节场景。你站在中央,被环绕。声音从不同方向传来,形成一种节日的嘈杂与温暖。', relation: '展览核心高潮,对应"春节庆典"母题,也是《哺乳期》家具装置中老式电视播放的家庭录像的精神内核。' },
  { id: 5, label: '北向暗室', screens: 2, keywords: ['生老病死','深夜','静默'], feeling: '这是迷宫中最暗的房间。两个屏幕的黑白影像呈现生老病死的片段。你可能想在这里停留更久,也可能想快点离开--这种矛盾本身就是作品的意图。', relation: '与《县长县长》中"暮色中的集体迁移"、《父亲的烟火》中转瞬即逝的明亮形成生死对照。' },
  { id: 6, label: '西向回廊', screens: 1, keywords: ['回声','记忆','往返'], feeling: '你在这里折返。屏幕中的影像似乎是你刚刚在另一个房间看到过的画面,但角度不同、光线不同、情绪也不同。记忆就是这样不可靠。', relation: '对应策展章节"恍若隔世"中"观众可能徘徊、折返、甚至迷失方向"的空间设计。' },
  { id: 7, label: '上层夹层', screens: 2, keywords: ['俯瞰','全局',' children'], feeling: '向上几步,视角改变。两个屏幕呈现从高处俯瞰村庄的画面,与之前平视的劳作场景形成空间层次。你突然意识到自己在一个多层嵌套的结构中。', relation: '对应"9个多层嵌套且相互连接的空间"的建筑描述,也是"记忆里迷宫模样的村庄"的立体化呈现。' },
  { id: 8, label: '下沉凹室', screens: 2, keywords: ['梦境','超现实','裂隙'], feeling: '空间下沉,你需要低头或坐下。两个屏幕呈现梦境般的超现实场景--有人从远方薄雾中消失,有人从往昔回音中浮现。这是迷宫中最接近"恍若隔世"的空间。', relation: '对应策展章节"恍若隔世的意境感"的核心体验空间,与《在颐和园》中"半醒的梦"形成跨楼层共振。' },
  { id: 9, label: '出口过渡', screens: 1, keywords: ['离别','未完成','开放'], feeling: '最后一个空间,只有一个屏幕。影像似乎没有结局,母亲仍在准备春节,村庄仍在继续。你被 gently 推回现实,但故事显然没有结束。', relation: '对应"图书馆电影计划"的开放性--作品是"极度个人的藏书目录,同时开放地静待观众阅读"。' }
];

function renderSpaceGrid() {
  const grid = document.getElementById('space-grid');
  if (!grid) return;
  grid.innerHTML = SPACES.map(s => `
    <div class="space-node" data-space="${s.id}" onclick="showSpaceDetail(${s.id})">
      <div class="space-id">SPACE ${s.id}</div>
      <div class="space-label">${s.label}</div>
      <div class="screen-count">${s.screens} 屏幕</div>
    </div>
  `).join('');
}

function showSpaceDetail(id) {
  const s = SPACES.find(x => x.id === id);
  if (!s) return;
  document.querySelectorAll('.space-node').forEach(n => n.classList.toggle('active', parseInt(n.dataset.space, 10) === id));
  const detail = document.getElementById('space-detail');
  detail.classList.remove('empty');
  detail.innerHTML = `
    <h4>空间 ${s.id}:${s.label} · ${s.screens} 屏幕</h4>
    <div class="detail-themes">${s.keywords.map(k => `<span class="chip">${k}</span>`).join('')}</div>
    <div class="detail-feeling"><strong>可能的观看感受</strong>:${s.feeling}</div>
    <div class="detail-relation"><strong>与展览主题的关联</strong>:${s.relation}</div>
  `;
}

/* ---------- KEYBOARD SHORTCUTS ---------- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') clearWorkPanel();
  if (e.key === 'ArrowRight' && selectedWorkId) {
    const next = worksData.works.find(w => w.number === selectedWorkId + 1);
    if (next) selectWork(next.number);
  }
  if (e.key === 'ArrowLeft' && selectedWorkId) {
    const prev = worksData.works.find(w => w.number === selectedWorkId - 1);
    if (prev) selectWork(prev.number);
  }
});

/* ---------- START ---------- */
loadData();
