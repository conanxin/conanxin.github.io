/* How2AI 中文课程 — 交互逻辑 (Phase 8A) */
let courseData = [], curatedReadings = [], glossaryData = [], officialReadings = [],
    lectureNotes = [], thematicRoutes = [],
    currentFilter = 'all', currentReadingCat = 'all', currentRole = 'Peer Reviewer',
    currentReadingSource = 'curated', currentOfficialCat = 'all',
    _progress = {}, _notes = {};

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderTimeline();
    renderSessions();
    renderReadings();
    renderGlossary();
    renderLectureNotes();
    setupEventListeners();
    setupNavTabs();
    setupSevenRoles();
    setupReadingSourceToggle();
    setupLearningModes();
    setupWorkbench();
    setupProjectProgress();
    renderThematicRoutes();
    buildSessionRouteMap();
    buildReadingRouteMap();
    renderSessionRouteBadges();
    renderReadingRouteBadges();
    renderGlossaryRouteBadges();
    handleRouteHash();
    setupLearningModeRouteRecommend();
    loadProgress();
    loadNotes();
    animateProgress();
    updateStats();
    initModuleBadges();
});

/* Phase 6C: Link health state */
let linkHealth = {}; // url -> {status, label, fallback_url}

const LINK_STATUS_LABELS = {
    'OK': '✅ 可访问',
    'REDIRECT_OK': '✅ 跳转可访问',
    'TIMEOUT_PROBABLY_OK': '⚠️ 可能可访问',
    'MANUAL_BROWSER_CHECK_RECOMMENDED': '🌐 浏览器复核',
    'SCHEDULE_LISTED_BUT_UNREACHABLE': '🔗 官方列出但不可达',
    'PAYWALL_OR_ACCESS_RESTRICTED': '🔐 需要权限',
    'SKIPPED_NETWORK_RESTRICTED': '⏭️ 网络受限',
    'UNKNOWN': '❓ 未检测',
};

const FALLBACK_SCHEDULE = 'https://mit-mi.github.io/how2ai-course/spring2025/schedule/';

function getLinkHealthBadge(url) {
    if (!url) return '';
    var entry = linkHealth[url];
    if (!entry) return '';
    var status = entry.status || 'UNKNOWN';
    var label = LINK_STATUS_LABELS[status] || status;
    if (status === 'OK' || status === 'REDIRECT_OK' || status === 'TIMEOUT_PROBABLY_OK') {
        return ' <span class="link-badge link-ok" title="' + label + '">' + label + '</span>';
    }
    var fallback = entry.fallback_url || (entry.type === 'slides_pdf' ? FALLBACK_SCHEDULE : '');
    var tooltip = label;
    if (fallback && status !== 'OK') {
        tooltip += ' — 备用：官方 Schedule';
    }
    var badge = ' <span class="link-badge link-warn" title="' + tooltip + '">' + label + '</span>';
    if (fallback && status !== 'OK') {
        badge += ' <a href="' + fallback + '" target="_blank" rel="noopener" class="link-fallback">📍 官方 Schedule</a>';
    }
    return badge;
}

async function loadData() {
    try {
        const [c, r, g, o, lh, ln, tr] = await Promise.all([
            fetch('data/course.json').then(r => r.json()),
            fetch('data/readings.json').then(r => r.json()),
            fetch('data/glossary.json').then(r => r.json()),
            fetch('data/official_reading_map.json').then(r => r.json()).catch(() => []),
            fetch('data/link_health.json').then(r => r.json()).catch(() => []),
            fetch('data/lecture_notes.json').then(r => r.json()).catch(() => []),
            fetch('data/thematic_routes.json').then(r => r.json()).catch(() => [])
        ]);
        courseData = c;
        curatedReadings = r;
        glossaryData = g;
        officialReadings = o;
        lectureNotes = ln || [];
        thematicRoutes = typeof tr !== 'undefined' ? tr : [];
        // Build link health lookup by URL
        if (Array.isArray(lh)) {
            lh.forEach(function(entry) {
                linkHealth[entry.url] = entry;
            });
        }
    } catch (e) {
        console.error('Failed to load data:', e);
        try { courseData = await fetch('data/course.json').then(r => r.json()); } catch(e){}
        try { curatedReadings = await fetch('data/readings.json').then(r => r.json()); } catch(e){}
        try { glossaryData = await fetch('data/glossary.json').then(r => r.json()); } catch(e){}
        try { officialReadings = await fetch('data/official_reading_map.json').then(r => r.json()); } catch(e){}
        try { lectureNotes = await fetch('data/lecture_notes.json').then(r => r.json()); } catch(e){ lectureNotes = []; }
        try { thematicRoutes = await fetch('data/thematic_routes.json').then(r => r.json()); } catch(e){ thematicRoutes = []; }
    }
}

function scrollToSection(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }

/* ---- Navigation tabs ---- */
function setupNavTabs() {
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            currentFilter = tab.dataset.filter;
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderSessions();
            renderTimeline();
        });
    });
}

/* ---- Module name mapping ---- */
function getModuleName(mod) {
    const n = {
        'mod0-intro': '导论',
        'mod1-foundations': '基础',
        'mod2-multimodal': '多模态',
        'mod3-llm': '大模型',
        'mod4-interactive': '交互',
        'intro': '导论',
        'foundation': '基础',
        'foundations': '基础',
        'multimodal': '多模态',
        'llm': '大模型',
        'interaction': '交互',
        'discussion': '讨论',
        'project': '项目'
    };
    return n[mod] || mod;
}

/* ---- Timeline ---- */
function renderTimeline() {
    const c = document.getElementById('timelineContainer');
    if (!c) return;
    const f = getFilteredSessions();
    c.innerHTML = f.map(s => `
        <div class="timeline-item ${s.session_type === 'special' ? 'timeline-special' : ''}" data-id="${s.id}" data-module="${s.module}">
            <span class="timeline-week">W${s.week}</span>
            <span class="timeline-title">${s.zh_title || s.original_title}</span>
            <span class="timeline-module mod-${s.module}">${getModuleName(s.module)}</span>
            ${isSessionCompleted(s.id) ? '<span title="已浏览">✅</span>' : ''}
        </div>`).join('');
    c.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            const card = document.querySelector(`.session-card[data-id="${id}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => openSession(id), 400);
            }
        });
    });
}

/* ---- Sessions ---- */
function getFilteredSessions() {
    if (currentFilter === 'all') return courseData;
    return courseData.filter(s => s.module === currentFilter);
}

function renderSessions() {
    const c = document.getElementById('sessionCards');
    if (!c) return;
    const f = getFilteredSessions();
    c.innerHTML = f.map(s => {
        if (s.session_type === 'special') {
            return `<div class="session-card session-special" data-id="${s.id}">
                <div class="session-card-header">
                    <span class="session-expand-icon">－</span>
                    <div class="session-meta">
                        <span class="session-week-badge">Week ${s.week} · ${s.date}</span>
                        <div class="session-title-row">
                            <span class="session-title-zh">${s.zh_title}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        return `<div class="session-card ${s.session_type === 'project' ? 'session-project-type' : ''}" data-id="${s.id}" data-module="${s.module}">
            <div class="session-card-header" onclick="toggleSession('${s.id}')">
                <span class="session-expand-icon">${s.session_type === 'project' ? '🚀' : '▼'}</span>
                <div class="session-meta">
                    <span class="session-week-badge">Week ${s.week} · ${s.date}</span>
                    <div class="session-title-row">
                        <span class="session-title-zh">${s.zh_title}</span>
                        ${s.original_title ? `<span class="session-title-en">${s.original_title}</span>` : ''}
                    </div>
                    <div class="module-label-badge">${s.module_label || getModuleName(s.module)}</div>
                </div>
                ${isSessionCompleted(s.id) ? '<span title="已浏览">✅</span>' : ''}
            </div>
            <div class="session-body">
                ${s.module_label ? `<div class="session-module-tag">📚 ${s.module_label}</div>` : ''}
                ${s.source_refs && s.source_refs.length ? `<div class="session-source-ref">📌 源自: ${Array.isArray(s.source_refs) ? s.source_refs.join(', ') : s.source_refs}</div>` : ''}
                ${s.zh_summary ? `<p class="session-summary">${s.zh_summary}</p>` : ''}
                ${s.key_concepts && s.key_concepts.length ? `<div class="session-concepts">${s.key_concepts.map(c => `<span class="concept-tag">${c}</span>`).join('')}</div>` : ''}
                ${s.learning_objectives && s.learning_objectives.length ? `<div class="session-objectives"><div class="session-objectives-title">📚 学习目标</div><ul>${s.learning_objectives.map(o => `<li>${o}</li>`).join('')}</ul></div>` : ''}
                ${s.practice_prompt ? `<div class="session-practice"><div class="session-practice-title">💡 思考与练习</div><p>${s.practice_prompt}</p></div>` : ''}
                ${s.project_connection ? `<div class="session-project"><div class="session-project-title">🚀 课程项目关联</div><p>${s.project_connection}</p></div>` : ''}
                <div class="session-links">
                    ${s.slides_url ? `<a class="session-link" href="${s.slides_url}" target="_blank" rel="noopener">📄 Slides PDF</a>${getLinkHealthBadge(s.slides_url)}` : ''}
                    ${s.video_url ? `<a class="session-link" href="${s.video_url}" target="_blank" rel="noopener">🎥 视频</a>${getLinkHealthBadge(s.video_url)}` : ''}
                </div>
                ${s.practice_prompt ? `<button class="session-quiz-btn" onclick="openQuiz('${s.id}')">🧠 打开思考题</button>` : ''}
                <button class="session-notes-btn" onclick="openNotes('${s.id}')">📝 学习笔记</button>
                <label class="session-checklist">
                    <input type="checkbox" ${isSessionCompleted(s.id) ? 'checked' : ''} onchange="toggleSessionComplete('${s.id}', this.checked)">
                    标记为已完成
                </label>
            </div>
        </div>`;
    }).join('');
}

function toggleSession(id) {
    const card = document.querySelector(`.session-card[data-id="${id}"]`);
    if (!card) return;
    const wasOpen = card.classList.contains('open');
    document.querySelectorAll('.session-card.open').forEach(c => c.classList.remove('open'));
    if (!wasOpen) {
        card.classList.add('open');
        markSessionViewed(id);
        saveProgress();
    }
}

function openSession(id) {
    const card = document.querySelector(`.session-card[data-id="${id}"]`);
    if (!card) return;
    document.querySelectorAll('.session-card.open').forEach(c => c.classList.remove('open'));
    card.classList.add('open');
    markSessionViewed(id);
    saveProgress();
}

/* ---- Readings ---- */
function setupReadingSourceToggle() {
    document.querySelectorAll('.source-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => switchReadingSource(btn.dataset.source));
    });
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentReadingCat = btn.dataset.cat;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCuratedReadings();
        });
    });
    document.querySelectorAll('.filter-btn-official').forEach(btn => {
        btn.addEventListener('click', () => {
            currentOfficialCat = btn.dataset.cat;
            document.querySelectorAll('.filter-btn-official').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderOfficialReadings();
        });
    });
}

function switchReadingSource(source) {
    currentReadingSource = source;
    document.querySelectorAll('.source-toggle-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.source-toggle-btn[data-source="${source}"]`)?.classList.add('active');
    document.getElementById('curatedFilterBar').style.display = source === 'curated' ? '' : 'none';
    document.getElementById('readingsGrid').style.display = source === 'curated' ? '' : 'none';
    document.getElementById('officialFilterBar').style.display = source === 'official' ? '' : 'none';
    document.getElementById('officialReadingsGrid').style.display = source === 'official' ? '' : 'none';
    if (source === 'official' && officialReadings.length) renderOfficialReadings();
}

function renderCuratedReadings() {
    const c = document.getElementById('readingsGrid');
    if (!c) return;
    const f = currentReadingCat === 'all' ? curatedReadings : curatedReadings.filter(r => r.category === currentReadingCat);
    const readingStatus = getReadingStatus();
    c.innerHTML = f.map(r => {
        const st = readingStatus[r.id] || 'unread';
        return `
        <div class="reading-card" data-id="${r.id}">
            <span class="reading-category cat-${r.category}">${r.category}</span>
            <div class="reading-title">${r.title}</div>
            <div class="reading-title-zh">${r.zh_title || ''}</div>
            <div class="reading-authors">${r.authors || ''} · ${r.year || ''}</div>
            <div class="reading-why">${r.why_it_matters || ''}</div>
            ${r.chinese_reading_guide ? `<div class="reading-guide"><strong>📖 中文导读：</strong>${r.chinese_reading_guide}</div>` : ''}
            <a class="reading-link" href="${r.url}" target="_blank" rel="noopener">🔗 论文链接 ↗</a>
            <div class="reading-status-selector">
                <button class="status-btn ${st === 'unread' ? 'active-unread' : ''}" onclick="setReadingStatus('${r.id}','unread')">待读</button>
                <button class="status-btn ${st === 'reading' ? 'active-reading' : ''}" onclick="setReadingStatus('${r.id}','reading')">在读</button>
                <button class="status-btn ${st === 'done' ? 'active-done' : ''}" onclick="setReadingStatus('${r.id}','done')">已读</button>
                <button class="status-btn ${st === 'skip' ? 'active-skip' : ''}" onclick="setReadingStatus('${r.id}','skip')">跳过</button>
            </div>
        </div>`;
    }).join('');
}

function renderOfficialReadings() {
    const c = document.getElementById('officialReadingsGrid');
    if (!c || !officialReadings.length) return;
    const f = currentOfficialCat === 'all' ? officialReadings : officialReadings.filter(r => r.reading_role === currentOfficialCat);
    c.innerHTML = f.map(r => `
        <div class="reading-card reading-card-official ${r.needs_manual_review ? 'needs-review' : ''}">
            <span class="reading-category cat-${r.reading_role}">${r.reading_role === 'core_reading' ? '核心' : r.reading_role === 'discussion_reading' ? '讨论' : r.reading_role === 'project_reference' ? '项目' : '补充'}</span>
            <div class="reading-title">${r.original_title}</div>
            <div class="reading-meta">Week ${r.session_week} · ${r.session_date} · ${r.type}</div>
            <a class="reading-link" href="${r.url}" target="_blank" rel="noopener">🔗 ${r.license_note || '链接'} ↗</a>
            ${r.needs_manual_review ? '<span class="review-note">⚠️ 学术平台需手动验证</span>' : ''}
        </div>`).join('');
}

function renderReadings() {
    renderCuratedReadings();
    if (officialReadings.length) renderOfficialReadings();
}

/* ---- Glossary ---- */
function renderGlossaryRouteBadges() {
    // Glossary items do not currently carry route associations;
    // route badges are rendered per session/reading only.
}
function renderGlossary(query = '') {
    const c = document.getElementById('glossaryGrid');
    if (!c || !glossaryData.length) return;
    const q = query.trim().toLowerCase();
    const f = q ? glossaryData.filter(g =>
        (g.term_en && g.term_en.toLowerCase().includes(q)) ||
        (g.term_zh && g.term_zh.toLowerCase().includes(q)) ||
        (g.definition_zh && g.definition_zh.toLowerCase().includes(q)) ||
        (g.definition && g.definition.toLowerCase().includes(q))
    ) : glossaryData;
    c.innerHTML = f.map(g => `
        <div class="glossary-item" id="glossary-${g.id || ''}">
            <div class="glossary-term">${g.term_en || g.term || ''}</div>
            <div class="glossary-zh">${g.term_zh || g.zh || ''}</div>
            <div class="glossary-def">${g.definition_zh || g.definition || ''}</div>
            ${g.related_sessions && g.related_sessions.length ? `<div class="glossary-sessions">相关课程: ${g.related_sessions.join(', ')}</div>` : ''}
        </div>`).join('');
}

/* ---- Seven Roles ---- */
function setupSevenRoles() {
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentRole = btn.dataset.role;
            document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.role-detail').forEach(d => d.classList.remove('active'));
            document.getElementById('roleDetail' + currentRole)?.classList.add('active');
            document.getElementById('roleDetail' + currentRole)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });
}

/* ---- Notes ---- */
function openNotes(sessionId) {
    const s = courseData.find(s => s.id === sessionId);
    if (!s) return;
    const note = _notes[sessionId] || '';
    const m = document.getElementById('notesModal');
    const b = document.getElementById('notesBody');
    if (!m || !b) return;
    b.innerHTML = `
        <h2 style="font-size:18px;color:#fff;margin-bottom:8px;">📝 学习笔记</h2>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">Week ${s.week} · ${s.zh_title}</p>
        <div style="border-left:3px solid var(--accent);padding-left:12px;margin-bottom:16px;">
            <p style="font-size:14px;color:var(--text-secondary);line-height:1.7;">${s.zh_summary || s.original_topics ? (s.zh_summary || s.original_topics.join('、')) : '暂无内容摘要'}</p>
        </div>
        <div style="margin-bottom:12px;">
            <label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:6px;">💬 我的笔记</label>
            <textarea id="noteTextarea" placeholder="在这里写下你的学习笔记...支持 Markdown 格式" style="width:100%;min-height:200px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:12px;color:var(--text-primary);font-family:var(--font-mono);font-size:13px;resize:vertical;outline:none;">${note}</textarea>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button onclick="saveNote('${sessionId}')" style="background:var(--accent);color:#fff;border:none;border-radius:var(--radius-sm);padding:8px 16px;cursor:pointer;font-size:13px;">💾 保存笔记</button>
            <button onclick="exportNote('${sessionId}')" style="background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:8px 16px;cursor:pointer;font-size:13px;">📤 导出为 Markdown</button>
            <button onclick="clearNote('${sessionId}')" style="background:transparent;color:var(--text-muted);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:8px 16px;cursor:pointer;font-size:13px;">🗑️ 清空</button>
        </div>`;
    m.classList.add('open');
}

function saveNote(sessionId) {
    const ta = document.getElementById('noteTextarea');
    if (!ta) return;
    _notes[sessionId] = ta.value;
    localStorage.setItem('how2ai_notes', JSON.stringify(_notes));
    showToast('笔记已保存 💾');
}

function loadNotes() {
    try { _notes = JSON.parse(localStorage.getItem('how2ai_notes') || '{}'); } catch { _notes = {}; }
}

function getReadingStatus() {
    try { return JSON.parse(localStorage.getItem('how2ai_reading_status') || '{}'); } catch { return {}; }
}
function saveReadingStatus(status) {
    localStorage.setItem('how2ai_reading_status', JSON.stringify(status));
}
function setReadingStatus(id, status) {
    const s = getReadingStatus();
    s[id] = status;
    saveReadingStatus(s);
    showToast('阅读状态已更新');
    animateProgress();
}

function getAllNotes() {
    try { return JSON.parse(localStorage.getItem('how2ai_notes') || '{}'); } catch { return {}; }
}

function exportAllNotes() {
  var sessionNotes = (typeof getSessionNotes !== 'undefined') ? getSessionNotes() : {};
  var readingStatus = (typeof getReadingStatus !== 'undefined') ? getReadingStatus() : {};
  var projectProgress = (typeof getProjectProgress !== 'undefined') ? getProjectProgress() : {};
  var projectMilestones = (typeof getProjectMilestones !== 'undefined') ? getProjectMilestones() : [];
  var workbenchNotes = (typeof getWorkbenchNotes !== 'undefined') ? getWorkbenchNotes() : {};
  var learningMode = localStorage.getItem('how2ai_mode') || '未选择';
  var lines = [];
  lines.push('# How2AI 中文课程学习笔记\n\n导出时间：' + new Date().toLocaleString('zh-CN') + '\n当前学习模式：' + learningMode + '\n\n## Session 笔记\n');
  var hasSessionNotes = false;
  Object.keys(sessionNotes).forEach(function(sessionId) {
    var note = (sessionNotes[sessionId] || '').trim();
    if (!note) return;
    hasSessionNotes = true;
    var session = (state.sessions || []).find(function(s) { return s.id === sessionId; });
    lines.push('### ' + (session ? (session.zh_title || session.original_title || sessionId) : sessionId) + '\n\n' + note + '\n\n');
  });
  if (!hasSessionNotes) lines.push('（尚无 session 笔记）\n\n');
  lines.push('## 阅读状态\n');
  var hasReadingStatus = false;
  Object.keys(readingStatus).forEach(function(readingId) {
    hasReadingStatus = true;
    var reading = (state.curatedReadings || []).find(function(r) { return r.id === readingId; });
    lines.push('- ' + (reading ? (reading.zh_title || reading.title || readingId) : readingId) + '：' + readingStatus[readingId] + '\n');
  });
  if (!hasReadingStatus) lines.push('（尚无阅读状态记录）\n');
  lines.push('\n## 讲义阅读进度\n');
  if (typeof lectureNotes !== 'undefined' && lectureNotes && lectureNotes.length > 0) {
    var lnRead = 0;
    lectureNotes.forEach(function(n) {
      var st = getLectureNoteStatus(n.session_id);
      if (st === 'read') lnRead++;
      var c = (state.sessions || []).find(function(s) { return s.id === n.session_id; });
      lines.push('- [' + (st === 'read' ? 'x' : ' ') + '] ' + (c ? (c.zh_title || c.original_title || n.session_id) : n.session_id) + '\n');
    });
    lines.push('\n**进度：' + lnRead + ' / ' + lectureNotes.length + ' 已读**\n');
  } else {
    lines.push('（尚无讲义数据）\n');
  }
  lines.push('\n## 项目进度\n');
  projectMilestones.forEach(function(item) {
    var done = projectProgress[item.id] ? 'x' : ' ';
    lines.push('- [' + done + '] ' + item.title + '：' + item.desc + '\n');
  });
  lines.push('\n## 七角色论文工作台笔记\n');
  var hasWorkbench = false;
  Object.keys(workbenchNotes).forEach(function(paperId) {
    var paperNotes = workbenchNotes[paperId] || {};
    var paper = (state.curatedReadings || []).find(function(r) { return r.id === paperId; });
    lines.push('### ' + (paper ? (paper.zh_title || paper.title || paperId) : paperId) + '\n\n');
    Object.keys(paperNotes).forEach(function(role) {
      var note = (paperNotes[role] || '').trim();
      if (!note) return;
      hasWorkbench = true;
      lines.push('#### ' + role + '\n\n' + note + '\n\n');
    });
  });
  if (!hasWorkbench) lines.push('（尚无七角色工作台笔记）\n\n');
  // Thematic routes progress
  if (typeof thematicRoutes !== 'undefined' && thematicRoutes && thematicRoutes.length > 0) {
    lines.push('\n## 专题学习路线进度\n');
    thematicRoutes.forEach(function(route) {
      var prog = getRouteProgressData(route.id);
      lines.push('- **' + route.title + '**：' + prog.done + ' / ' + prog.total + ' 里程碑完成\n');
      route.milestones.forEach(function(m) {
        var done = prog.milestones && prog.milestones[m.id] ? 'x' : ' ';
        lines.push('  - [' + done + '] ' + m.label + '\n');
      });
    });
  }
  lines.push('\n## 下一步建议\n\n- [ ] 选择一个学习模式并完成对应路线\n- [ ] 至少完成 3 个课程节点\n- [ ] 至少用七角色工作台读完 1 篇论文\n- [ ] 写出一个 Project Proposal\n- [ ] 准备 Final Presentation 和 Final Report\n');
  downloadMarkdown(lines.join(''), 'how2ai-full-learning-notes.md');
}

function exportNote(sessionId) {
    const s = courseData.find(s => s.id === sessionId);
    const note = _notes[sessionId] || '';
    const md = `# ${s ? s.zh_title : sessionId} 学习笔记\n\n**Week ${s ? s.week : ''} · ${s ? s.original_title : ''}**\n\n---\n\n## 本节摘要\n\n${s ? (s.zh_summary || s.original_topics ? (s.zh_summary || s.original_topics.join('、')) : '') : ''}\n\n## 关键概念\n\n${s && s.key_concepts ? s.key_concepts.map(c => `- ${c}`).join('\n') : ''}\n\n## 学习笔记\n\n${note || '_（空）_'}\n\n---\n*由 How2AI 中文课程页面导出 · ${new Date().toLocaleString('zh-CN')}*`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `how2ai-note-${sessionId}.md`;
    a.click();
}

function clearNote(sessionId) {
    if (!confirm('确定清空这条笔记？')) return;
    delete _notes[sessionId];
    localStorage.setItem('how2ai_notes', JSON.stringify(_notes));
    const ta = document.getElementById('noteTextarea');
    if (ta) ta.value = '';
    showToast('笔记已清空');
}


/* ---- Quiz ---- */
function openQuiz(sessionId) {
    const s = courseData.find(s => s.id === sessionId);
    if (!s || !s.practice_prompt) return;
    const m = document.getElementById('quizModal');
    const b = document.getElementById('quizBody');
    if (!m || !b) return;
    b.innerHTML = `
        <h2 style="font-size:18px;color:#fff;margin-bottom:8px;">💡 思考题</h2>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px;">Week ${s.week} · ${s.zh_title}</p>
        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:20px;margin-bottom:20px;">
            <p style="font-size:15px;color:var(--text-primary);line-height:1.8;">${s.practice_prompt}</p>
        </div>
        <div style="background:rgba(102,126,234,.05);border:1px solid rgba(102,126,234,.15);border-radius:var(--radius-sm);padding:16px;margin-bottom:20px;font-size:13px;color:var(--text-muted);">
            <p style="margin-bottom:8px;">💬 提示：这个题目没有标准答案，重要的是思考过程。</p>
            <p>📝 建议：把你的思考记录在笔记中，下次课程前回顾。</p>
        </div>
        <div style="margin-top:20px;">
            <textarea placeholder="在这里写下你的思考..." style="width:100%;min-height:120px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:12px;color:var(--text-primary);font-family:var(--font-sans);font-size:13px;resize:vertical;outline:none;" id="quizAnswer"></textarea>
        </div>`;
    m.classList.add('open');
}

function closeQuiz() { document.getElementById('quizModal')?.classList.remove('open'); }
function closeModal() { document.getElementById('sessionModal')?.classList.remove('open'); }
function closeNotes() { document.getElementById('notesModal')?.classList.remove('open'); }

/* ---- Progress ---- */
function getProgress() {
    try { return JSON.parse(localStorage.getItem('how2ai_progress') || '{}'); } catch { return {}; }
}

function saveProgress() {
    localStorage.setItem('how2ai_progress', JSON.stringify(_progress));
}

function markSessionViewed(id) { _progress[id] = true; }

function isSessionCompleted(id) { return !!getProgress()[id]; }

function loadProgress() { _progress = getProgress(); }

function toggleSessionComplete(id, checked) {
    _progress = getProgress();
    if (checked) { _progress[id] = true; }
    else { delete _progress[id]; }
    saveProgress();
    animateProgress();
    updateStats();
}

function animateProgress() {
    const total = courseData.filter(s => s.session_type !== 'special').length;
    const completed = Object.keys(getProgress()).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    // Hero progress bar
    const fill = document.querySelector('.progress-bar-fill');
    if (fill) fill.setAttribute('style', 'width:' + pct + '%');
    // Hero progress numbers
    const numEl = document.getElementById('heroProgressSessions');
    if (numEl) numEl.textContent = completed + '/' + total;
    // Hero readings progress
    const readTotal = curatedReadings.length;
    const readDone = Object.keys(JSON.parse(localStorage.getItem('how2ai_reading_status') || '{}')).length;
    const rEl = document.getElementById('heroProgressReadings');
    if (rEl) rEl.textContent = readDone + '/' + readTotal;
    // Module progress bar
    updateModuleProgressBar();
}

function updateModuleProgressBar() {
    const segments = document.querySelectorAll('.module-progress-segment');
    if (!segments.length) return;
    const mods = ['mod0-intro','mod1-foundations','mod2-multimodal','mod3-llm','mod4-interactive'];
    mods.forEach((mod, i) => {
        const seg = segments[i];
        if (!seg) return;
        const modSessions = courseData.filter(s => s.module === mod && s.session_type !== 'special');
        if (!modSessions.length) return;
        const done = modSessions.filter(s => getProgress()[s.id]).length;
        const pct = Math.round((done / modSessions.length) * 100);
        seg.classList.remove('active','done');
        if (pct === 100) seg.classList.add('done');
        else if (pct > 0) seg.classList.add('active');
        seg.setAttribute('title', `${getModuleName(mod)}: ${done}/${modSessions.length} 完成`);
    });
}

function updateStats() {
    const ss = document.getElementById('stat-sessions');
    const sr = document.getElementById('stat-readings');
    const sg = document.getElementById('stat-glossary');
    if (ss) ss.textContent = courseData.filter(s => s.session_type !== 'special').length;
    if (sr) sr.textContent = curatedReadings.length + '+';
    if (sg) sg.textContent = glossaryData.length;
}

function initModuleBadges() {
    // Add module badge colors
    const modColors = {
        'mod0-intro': '#9b59b6',
        'mod1-foundations': '#3498db',
        'mod2-multimodal': '#e74c3c',
        'mod3-llm': '#f39c12',
        'mod4-interactive': '#27ae60'
    };
    // Inject CSS variables for modules
    const style = document.createElement('style');
    let css = '';
    for (const [mod, color] of Object.entries(modColors)) {
        css += `.mod-${mod} { background: ${color}20; color: ${color}; border-color: ${color}40; }\n`;
        css += `.timeline-module.mod-${mod} { background: ${color}20; color: ${color}; }\n`;
    }
    style.textContent = css;
    document.head.appendChild(style);
}

/* ---- Event listeners ---- */
function setupEventListeners() {
    // Reading filter buttons (curated)
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentReadingCat = btn.dataset.cat;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCuratedReadings();
        });
    });

    // Glossary search
    const si = document.getElementById('glossarySearch');
    if (si) {
        si.addEventListener('input', () => {
            renderGlossary(si.value);
        });
    }

    // Modal close buttons
    document.getElementById('modalClose')?.addEventListener('click', closeModal);
    document.getElementById('modalBackdrop')?.addEventListener('click', closeModal);
    document.getElementById('quizClose')?.addEventListener('click', closeQuiz);
    document.getElementById('quizBackdrop')?.addEventListener('click', closeQuiz);
    document.getElementById('notesClose')?.addEventListener('click', closeNotes);
    document.getElementById('notesBackdrop')?.addEventListener('click', closeNotes);

    // Scroll shadow on nav
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navTabs');
        if (nav) nav.style.boxShadow = window.scrollY > 200 ? '0 4px 20px rgba(0,0,0,0.5)' : 'none';
        animateProgress();
    });
}

/* ============================================================
// PHASE 5D: Learning UX Enhancement
// ============================================================ */

let currentLearningMode = localStorage.getItem('how2ai_mode') || null;
let currentWorkbenchPaper = null;
let currentWorkbenchRole = 'Peer Reviewer';
const WORKBENCH_NOTES_KEY = 'how2ai_workbench_notes';
const PROJECT_PROGRESS_KEY = 'how2ai_project_progress';
const READING_STATUS_KEY = 'how2ai_reading_status';
const PROJECT_STEPS = ['topic','proposal','lit-review','data-task','baseline',
                       'midterm','error-analysis','ablation',
                       'final-presentation','final-report'];

// Phase 6C: Milestones with precise week numbers from official MIT schedule
const PROJECT_MILESTONES = [
    { id: 'topic',         title: '选题方向',             desc: '确定你的研究方向或应用场景' },
    { id: 'proposal',      title: 'Proposal 草案',         desc: 'Week 3/2.20 Presentation · Week 4/2.25 Report — 写出研究问题的 Motivation 和 Related Work 概述' },
    { id: 'lit-review',    title: 'Literature Review',    desc: '梳理相关工作，找到研究空白' },
    { id: 'data-task',     title: '数据与任务定义',       desc: '明确数据集、评估指标和任务边界' },
    { id: 'baseline',      title: 'Baseline',             desc: '实现或引用已有方法作为基准' },
    { id: 'midterm',       title: 'Midterm Report',       desc: 'Week 9/4.3 — 中期报告：方法概述和初步实验结果' },
    { id: 'error-analysis',title: 'Error Analysis',       desc: '分析错误案例，找到改进方向' },
    { id: 'ablation',      title: 'Ablation Study',       desc: '消融实验：验证每个组件的贡献' },
    { id: 'final-presentation', title: 'Final Presentation', desc: 'Week 14/5.8 — 展示最终项目结果、关键发现、demo 或实验结果，并接受 Q&A' },
    { id: 'final-report',  title: 'Final Report',         desc: 'Week 16/5.20 — 提交一份类似 research paper 的完整报告，包含研究问题、方法、实验、分析、局限与讨论' },
];

function getProjectProgress() {
    try { return JSON.parse(localStorage.getItem(PROJECT_PROGRESS_KEY) || '{}'); }
    catch(e) { return {}; }
}

function getProjectMilestones() {
    return PROJECT_MILESTONES;
}

function setupLearningModes() {
    if (currentLearningMode) {
        highlightMode(currentLearningMode);
        updateModeStatus();
    }
    document.querySelectorAll('.mode-card').forEach(function(card) {
        card.addEventListener('click', function() {
            var mode = card.dataset.mode;
            if (currentLearningMode === mode) {
                currentLearningMode = null;
                localStorage.removeItem('how2ai_mode');
                clearModeHighlights();
                updateModeStatus();
            } else {
                currentLearningMode = mode;
                localStorage.setItem('how2ai_mode', mode);
                highlightMode(mode);
                updateModeStatus();
            }
            showToast('学习模式已切换', 'info');
        });
    });
    var resetBtn = document.getElementById('resetModeBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            currentLearningMode = null;
            localStorage.removeItem('how2ai_mode');
            clearModeHighlights();
            updateModeStatus();
            showToast('学习模式已重置', 'info');
        });
    }
}

function highlightMode(mode) {
    clearModeHighlights();
    var card = document.getElementById('mode-' + mode);
    if (card) card.classList.add('mode-selected');
    // Update .mode-check text
    document.querySelectorAll('.mode-card').forEach(function(c) {
        var check = c.querySelector('.mode-check');
        if (!check) return;
        if (c.id === 'mode-' + mode) {
            check.textContent = '\u2713 当前模式';
        } else {
            check.textContent = '选择此模式';
        }
    });
}

function clearModeHighlights() {
    document.querySelectorAll('.mode-card').forEach(function(c){ c.classList.remove('mode-selected'); });
    document.querySelectorAll('.mode-check').forEach(function(el){ el.textContent = '选择此模式'; });
}

function updateModeStatus() {
    var el = document.getElementById('modeStatus');
    if (!el) return;
    var names = { general: '快速通识模式', paper: '论文精读模式', project: '项目实战模式' };
    el.textContent = currentLearningMode && names[currentLearningMode] ? '当前：' + names[currentLearningMode] : '';
}

// --- Seven Roles Workbench ---
function setupWorkbench() {
    renderWorkbenchPaperOptions();
    var select = document.getElementById('workbenchPaperSelect');
    if (select) {
        select.addEventListener('change', function(e) {
            var paperId = e.target.value;
            currentWorkbenchPaper = paperId ? curatedReadings.find(function(r){return r.id===paperId;}) : null;
            renderWorkbenchInfo();
            renderWorkbenchPrompt();
            loadWorkbenchNote();
        });
    }
    var tabs = document.getElementById('workbenchTabs');
    if (tabs) {
        tabs.addEventListener('click', function(e) {
            if (!e.target.classList.contains('workbench-tab')) return;
            saveWorkbenchNote();
            currentWorkbenchRole = e.target.dataset.role;
            document.querySelectorAll('.workbench-tab').forEach(function(t){t.classList.remove('active');});
            e.target.classList.add('active');
            renderWorkbenchPrompt();
            loadWorkbenchNote();
        });
    }
    var saveBtn = document.getElementById('saveWorkbenchBtn');
    if (saveBtn) saveBtn.addEventListener('click', function(){ saveWorkbenchNote(); showToast('笔记已保存','success'); });
    var exportBtn = document.getElementById('exportWorkbenchBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportWorkbenchMarkdown);
}

function renderWorkbenchPaperOptions() {
    var select = document.getElementById('workbenchPaperSelect');
    if (!select) return;
    var sorted = curatedReadings.slice().sort(function(a,b){return (a.recommended_order||99)-(b.recommended_order||99);});
    var diffEmoji = { beginner: '🟢', intermediate: '🟡', advanced: '🔴' };
    sorted.forEach(function(r) {
        var opt = document.createElement('option');
        opt.value = r.id;
        opt.textContent = (diffEmoji[r.difficulty]||'⚪') + ' ' + (r.zh_title||r.title) + ' (' + r.recommended_order + ')';
        select.appendChild(opt);
    });
}

function renderWorkbenchInfo() {
    var info = document.getElementById('workbenchPaperInfo');
    if (!info) return;
    if (!currentWorkbenchPaper) { info.innerHTML=''; return; }
    var p = currentWorkbenchPaper;
    var diffColors = {beginner:'#27ae60',intermediate:'#f39c12',advanced:'#e74c3c'};
    var diffLabels = {beginner:'入门',intermediate:'进阶',advanced:'高级'};
    var pathLabels = {'快速通识':'🧭','论文精读':'📖','项目实战':'🚀','全部':'📚'};
    var color = diffColors[p.difficulty]||'#888';
    var label = diffLabels[p.difficulty]||p.difficulty||'';
    var pathLabel = pathLabels[p.reading_path]||'📚';
    info.innerHTML = '<div class="wb-paper-meta">' +
        '<span class="wb-diff-badge" style="background:'+color+'20;color:'+color+'">'+label+'</span>' +
        '<span class="wb-path-badge">'+pathLabel+' '+p.reading_path+'</span>' +
        '<span class="wb-order">推荐顺序 #'+p.recommended_order+'</span>' +
        '<a href="'+p.url+'" target="_blank" class="wb-paper-link">🔗 原论文</a></div>' +
        '<div class="wb-paper-authors">'+p.authors+' ('+p.year+')</div>';
}

function renderWorkbenchPrompt() {
    var prompt = document.getElementById('workbenchPrompt');
    if (!prompt) return;
    var prompts = {
        'Peer Reviewer': '如果你是 NeurIPS / ICLR 审稿人，这篇论文是否应该被接收？为什么？',
        'Archaeologist': '这篇论文之前有哪些前史？它发表后影响了哪些后续工作？',
        'Academic Researcher': '这篇论文打开了什么新的后续研究问题？',
        'Industry Practitioner': '如果你是大厂研究总监，你会如何向老板解释为什么值得投入实现它？',
        'Hacker': '我能否在一周内做出这篇论文的最小可运行 demo？',
        'Private Investigator': '作者为什么会想到这个题目？他们的教育、工作经历和研究脉络如何导向它？',
        'Social Impact Assessor': '这项技术落地后可能带来哪些正面影响、负面风险和治理问题？'
    };
    prompt.textContent = prompts[currentWorkbenchRole]||'';
}

function getWorkbenchNotes() {
    try { return JSON.parse(localStorage.getItem(WORKBENCH_NOTES_KEY))||{}; } catch(e){ return {}; }
}

function saveWorkbenchNote() {
    var textarea = document.getElementById('workbenchTextarea');
    if (!textarea || !currentWorkbenchPaper) return;
    var notes = getWorkbenchNotes();
    var key = currentWorkbenchPaper.id + '_' + currentWorkbenchRole;
    notes[key] = textarea.value;
    localStorage.setItem(WORKBENCH_NOTES_KEY, JSON.stringify(notes));
}

function loadWorkbenchNote() {
    var textarea = document.getElementById('workbenchTextarea');
    if (!textarea) return;
    if (!currentWorkbenchPaper) { textarea.value=''; return; }
    var notes = getWorkbenchNotes();
    var key = currentWorkbenchPaper.id + '_' + currentWorkbenchRole;
    textarea.value = notes[key]||'';
}

function exportWorkbenchMarkdown() {
  var paperSelect = document.getElementById('workbench-paper-select');
  var paperId = paperSelect ? paperSelect.value : '';
  var paper = (state.curatedReadings || []).find(function(r) { return r.id === paperId; });
  if (!paper) { alert('请先选择一篇论文。'); return; }
  var roleLabels = {
    peer: 'Peer Reviewer · 评审',
    arch: 'Archaeologist · 考古',
    academic: 'Academic Researcher · 后续研究',
    industry: 'Industry Practitioner · 工业落地',
    hacker: 'Hacker · 快速原型',
    investigator: 'Private Investigator · 作者路径',
    social: 'Social Impact Assessor · 社会影响'
  };
  var notes = getWorkbenchNotes();
  var paperNotes = notes[paperId] || {};
  var lines = [];
  lines.push('# 七角色论文阅读笔记\n\n导出时间：' + new Date().toLocaleString('zh-CN') + '\n\n## 论文信息\n\n- 英文标题：' + (paper.title || '') + '\n- 中文标题：' + (paper.zh_title || '') + '\n- 分类：' + (paper.category || '') + '\n- 难度：' + (paper.difficulty || '') + '\n- 推荐顺序：' + (paper.recommended_order || '') + '\n\n## 七角色笔记\n');
  Object.keys(roleLabels).forEach(function(roleKey) {
    lines.push('### ' + roleLabels[roleKey] + '\n\n' + ((paperNotes[roleKey] || '').trim() || '（尚未填写）') + '\n\n');
  });
  lines.push('## 下一步行动建议\n\n- [ ] 用一句话总结这篇论文的核心贡献\n- [ ] 补充至少 2 篇前史或后续论文\n- [ ] 思考一个最小可运行 demo\n- [ ] 思考是否有 follow-up research question\n');
  downloadMarkdown('how2ai-paper-workbench-' + sanitizeFilename(paper.zh_title || paper.title || paperId) + '.md', lines.join(''));
}

// --- Project Progress System ---
function setupProjectProgress() {
    loadProjectProgress();
    document.querySelectorAll('.pp-item input[type="checkbox"]').forEach(function(cb) {
        cb.addEventListener('change', function() {
            saveProjectProgress();
            updateProjectProgressBar();
        });
    });
    var resetBtn = document.getElementById('resetProjectProgressBtn');
    if (resetBtn) resetBtn.addEventListener('click', function() {
        if (!confirm('确定重置所有项目进度？笔记将保留。')) return;
        localStorage.removeItem(PROJECT_PROGRESS_KEY);
        document.querySelectorAll('.pp-item input[type="checkbox"]').forEach(function(c){c.checked=false;});
        updateProjectProgressBar();
        showToast('项目进度已重置','info');
    });
    var exportBtn = document.getElementById('exportProjectNotesBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportProjectMarkdown);
}

function loadProjectProgress() {
    try {
        var saved = JSON.parse(localStorage.getItem(PROJECT_PROGRESS_KEY)||'{}');
        PROJECT_STEPS.forEach(function(step) {
            var cb = document.getElementById('pp-'+step);
            if (cb && saved[step]) cb.checked = true;
        });
    } catch(e){}
    updateProjectProgressBar();
}

function saveProjectProgress() {
    var state = {};
    PROJECT_STEPS.forEach(function(step) {
        var cb = document.getElementById('pp-'+step);
        if (cb) state[step] = cb.checked;
    });
    localStorage.setItem(PROJECT_PROGRESS_KEY, JSON.stringify(state));
}

/* === Phase 7B: Lecture Notes === */
function renderLectureNotes() {
    var container = document.getElementById('lectureNotesContainer');
    if (!container) return;
    if (!lectureNotes || lectureNotes.length === 0) {
        container.innerHTML = '<p style="color:#888;font-size:14px;text-align:center;padding:32px;">讲义数据暂不可用</p>';
        return;
    }
    // Course map for session info
    var courseMap = {};
    if (courseData) {
        courseData.forEach(function(s) { courseMap[s.id] = s; });
    }
    // Glossary map for terms
    var glossaryMap = {};
    if (glossaryData) {
        glossaryData.forEach(function(g) { glossaryMap[g.id] = g; });
    }
    var html = '';
    lectureNotes.forEach(function(note, idx) {
        var course = courseMap[note.session_id] || {};
        var isFirst = idx === 0;
        var badgeClass = note.lecture_type === 'lecture' ? 'badge-lecture' :
                         note.lecture_type === 'discussion' ? 'badge-discussion' : 'badge-project';
        html += '<div class="lecture-note-card" id="ln-' + note.session_id + '">';
        // Header
        html += '<div class="lecture-note-header' + (isFirst ? '' : '') + '" onclick="toggleLectureNote(\'' + note.session_id + '\')">';
        html += '<div class="lecture-note-meta">';
        html += '<span class="session-badge ' + badgeClass + '">' + (note.lecture_type || 'lecture') + '</span>';
        if (note.note_status === 'pilot') {
            html += '<span class="session-badge badge-pilot">试点</span>';
        }
        html += '<span class="lecture-note-title">' + (course.zh_title || note.session_id) + '</span>';
        html += '</div>';
        html += '<span class="lecture-note-toggle" id="ln-toggle-' + note.session_id + '">▶</span>';
        // Status button
        var status = getLectureNoteStatus(note.session_id);
        html += '<button class="lecture-note-status-btn status-' + status + '" id="ln-status-' + note.session_id + '" onclick="event.stopPropagation();toggleLectureNoteRead(\'' + note.session_id + '\')">' + (status === 'read' ? '已读' : '待读') + '</button>';
        html += '</div>';
        // Body
        html += '<div class="lecture-note-body' + (isFirst ? ' open' : '') + (status === 'read' ? ' read' : '') + '" id="ln-body-' + note.session_id + '">';

        // One sentence
        if (note.one_sentence) {
            html += '<div class="one-sentence">' + escHtml(note.one_sentence) + '</div>';
        }

        // Core question
        if (note.core_question) {
            html += '<p class="section-label">核心问题</p>';
            html += '<p class="core-question">' + escHtml(note.core_question) + '</p>';
        }

        // Why it matters
        if (note.why_it_matters) {
            html += '<p class="section-label">为什么重要</p>';
            html += '<p class="why-matters">' + escHtml(note.why_it_matters) + '</p>';
        }

        // Concepts - pills
        if (note.concepts && note.concepts.length > 0) {
            html += '<p class="section-label">核心概念</p>';
            html += '<div class="concepts-grid">';
            note.concepts.forEach(function(c) {
                var glossaryLink = '';
                if (glossaryData && glossaryData.length > 0) {
                    // Try to find matching glossary entry
                    var match = glossaryData.find(function(g) {
                        return g.term_en === c.term_en || g.term_zh === c.term;
                    });
                    if (match) {
                        glossaryLink = '<a href="#glossary-' + match.id + '" class="glossary-anchor-link">见术语表</a>';
                    }
                }
                html += '<span class="concept-pill">';
                html += escHtml(c.term);
                if (c.term_en) html += ' <span class="term-en">(' + escHtml(c.term_en) + ')</span>';
                if (glossaryLink) html += glossaryLink;
                html += '</span>';
            });
            html += '</div>';
            // Concept details
            note.concepts.forEach(function(c) {
                html += '<div class="concept-detail">';
                html += '<div class="concept-term">' + escHtml(c.term);
                if (c.term_en) html += '<span class="concept-term-en">' + escHtml(c.term_en) + '</span>';
                html += '</div>';
                if (c.explanation) {
                    html += '<p class="concept-explanation">' + escHtml(c.explanation) + '</p>';
                }
                if (c.common_misunderstanding) {
                    html += '<div class="concept-misunderstanding">' + escHtml(c.common_misunderstanding) + '</div>';
                }
                html += '</div>';
            });
        }

        // Reading guide
        if (note.reading_guide && note.reading_guide.length > 0) {
            html += '<p class="section-label">必读材料导读</p>';
            note.reading_guide.forEach(function(rg) {
                html += '<div class="reading-guide-item">';
                html += '<div class="reading-title">📄 ' + escHtml(rg.title || '未命名阅读材料') + '</div>';
                if (rg.why_read) {
                    html += '<p class="reading-why"><strong>为什么读：</strong>' + escHtml(rg.why_read) + '</p>';
                }
                if (rg.how_to_read) {
                    html += '<p class="reading-how"><strong>怎么读：</strong>' + escHtml(rg.how_to_read) + '</p>';
                }
                if (rg.key_questions && rg.key_questions.length > 0) {
                    html += '<p class="reading-questions"><strong>关键问题：</strong><ul>';
                    rg.key_questions.forEach(function(q) {
                        html += '<li>' + escHtml(q) + '</li>';
                    });
                    html += '</ul></p>';
                }
                html += '</div>';
            });
        }

        // Connections
        if (note.connection_to_previous || note.connection_to_next) {
            html += '<p class="section-label">前后课程关系</p>';
            html += '<div class="connection-row">';
            if (note.connection_to_previous) {
                html += '<div class="connection-box"><strong>← 前置课程：</strong>' + escHtml(note.connection_to_previous) + '</div>';
            }
            if (note.connection_to_next) {
                html += '<div class="connection-box"><strong>→ 后续课程：</strong>' + escHtml(note.connection_to_next) + '</div>';
            }
            html += '</div>';
        }

        // Project ideas
        if (note.project_ideas && note.project_ideas.length > 0) {
            html += '<p class="section-label">项目化方向</p>';
            note.project_ideas.forEach(function(pi) {
                var diffClass = pi.difficulty === 'beginner' ? 'diff-beginner' :
                                pi.difficulty === 'intermediate' ? 'diff-intermediate' : 'diff-advanced';
                html += '<div class="project-idea-card">';
                html += '<div class="project-idea-header">';
                html += '<span class="project-title">' + escHtml(pi.title || '未命名项目') + '</span>';
                html += '<span class="diff-badge ' + diffClass + '">' + (pi.difficulty || 'intermediate') + '</span>';
                html += '</div>';
                if (pi.description) {
                    html += '<p class="project-desc">' + escHtml(pi.description) + '</p>';
                }
                if (pi.data_needed) {
                    html += '<p class="project-data">📊 数据需求：' + escHtml(pi.data_needed) + '</p>';
                }
                if (pi.possible_output) {
                    html += '<p class="project-output">📤 预期产出：' + escHtml(pi.possible_output) + '</p>';
                }
                html += '</div>';
            });
        }

        // Reflection questions
        if (note.reflection_questions && note.reflection_questions.length > 0) {
            html += '<p class="section-label">思考题</p>';
            html += '<ul class="reflection-list">';
            note.reflection_questions.forEach(function(q) {
                html += '<li>' + escHtml(q) + '</li>';
            });
            html += '</ul>';
        }

        // Mini assignment
        if (note.mini_assignment) {
            html += '<div class="mini-assignment">' + escHtml(note.mini_assignment) + '</div>';
        }

        html += '</div>'; // .lecture-note-body
        html += '</div>'; // .lecture-note-card
    });

    container.innerHTML = html;
    updateLectureNotesProgress();
}

function toggleLectureNote(sessionId) {
    var body = document.getElementById('ln-body-' + sessionId);
    var toggle = document.getElementById('ln-toggle-' + sessionId);
    var header = document.querySelector('#ln-' + sessionId + ' .lecture-note-header');
    if (!body) return;
    var isOpen = body.classList.contains('open');
    if (isOpen) {
        body.classList.remove('open');
        if (toggle) toggle.textContent = '▶';
        if (header) header.classList.remove('expanded');
    } else {
        body.classList.add('open');
        if (toggle) toggle.textContent = '▼';
        if (header) header.classList.add('expanded');
    }
}

function expandAllLectureNotes() {
    document.querySelectorAll('.lecture-note-body').forEach(function(b) { b.classList.add('open'); });
    document.querySelectorAll('.lecture-note-toggle').forEach(function(t) { t.textContent = '▼'; });
    document.querySelectorAll('.lecture-note-header').forEach(function(h) { h.classList.add('expanded'); });
}

function collapseAllLectureNotes() {
    document.querySelectorAll('.lecture-note-body').forEach(function(b) { b.classList.remove('open'); });
    document.querySelectorAll('.lecture-note-toggle').forEach(function(t) { t.textContent = '▶'; });
    document.querySelectorAll('.lecture-note-header').forEach(function(h) { h.classList.remove('expanded'); });
}

var LECTURE_NOTE_STATUS_KEY = 'how2ai_lecture_note_status';

function getLectureNoteStatus(sessionId) {
    try {
        var stored = JSON.parse(localStorage.getItem(LECTURE_NOTE_STATUS_KEY) || '{}');
        return stored[sessionId] || 'unread';
    } catch(e) { return 'unread'; }
}

function setLectureNoteStatus(sessionId, status) {
    try {
        var stored = JSON.parse(localStorage.getItem(LECTURE_NOTE_STATUS_KEY) || '{}');
        stored[sessionId] = status;
        localStorage.setItem(LECTURE_NOTE_STATUS_KEY, JSON.stringify(stored));
        updateLectureNotesProgress();
        var btn = document.getElementById('ln-status-' + sessionId);
        if (btn) {
            btn.textContent = status === 'read' ? '已读' : '待读';
            btn.className = 'lecture-note-status-btn status-' + status;
        }
    } catch(e) {}
}

function toggleLectureNoteRead(sessionId) {
    var current = getLectureNoteStatus(sessionId);
    setLectureNoteStatus(sessionId, current === 'read' ? 'unread' : 'read');
}

function updateLectureNotesProgress() {
    if (!lectureNotes || lectureNotes.length === 0) return;
    var readCount = lectureNotes.filter(function(n) { return getLectureNoteStatus(n.session_id) === 'read'; }).length;
    var total = lectureNotes.length;
    var el = document.getElementById('lectureNotesProgressText');
    if (el) el.textContent = '已读 ' + readCount + ' / ' + total;
    var bar = document.getElementById('lectureNotesProgressBar');
    if (bar) bar.style.width = Math.round((readCount / total) * 100) + '%';
}

function markAllLectureNotesRead() {
    if (!lectureNotes) return;
    try {
        var stored = JSON.parse(localStorage.getItem(LECTURE_NOTE_STATUS_KEY) || '{}');
        lectureNotes.forEach(function(n) { stored[n.session_id] = 'read'; });
        localStorage.setItem(LECTURE_NOTE_STATUS_KEY, JSON.stringify(stored));
        document.querySelectorAll('.lecture-note-status-btn').forEach(function(btn) {
            btn.textContent = '已读';
            btn.className = 'lecture-note-status-btn status-read';
        });
        updateLectureNotesProgress();
        showToast('所有讲义已标为已读', 'success');
    } catch(e) {}
}

function markAllLectureNotesUnread() {
    if (!lectureNotes) return;
    try {
        var stored = JSON.parse(localStorage.getItem(LECTURE_NOTE_STATUS_KEY) || '{}');
        lectureNotes.forEach(function(n) { stored[n.session_id] = 'unread'; });
        localStorage.setItem(LECTURE_NOTE_STATUS_KEY, JSON.stringify(stored));
        document.querySelectorAll('.lecture-note-status-btn').forEach(function(btn) {
            btn.textContent = '待读';
            btn.className = 'lecture-note-status-btn status-unread';
        });
        updateLectureNotesProgress();
        showToast('所有讲义已标为待读', 'info');
    } catch(e) {}
}

function filterLectureNotesByModule(mod) {
    if (!lectureNotes) return;
    var cards = document.querySelectorAll('.lecture-note-card');
    var activeFilter = mod || 'all';
    cards.forEach(function(card) {
        var noteId = card.id.replace('ln-', '');
        var note = lectureNotes.find(function(n) { return n.session_id === noteId; });
        if (!note) { card.style.display = 'none'; return; }
        var moduleMap = {
            'mod0': 'mod0-intro',
            'mod1': 'mod1-foundations',
            'mod2': 'mod2-multimodal',
            'mod3': 'mod3-llm',
            'mod4': 'mod4-interactive',
            'special': 'special'
        };
        var targetModule = moduleMap[activeFilter];
        var noteModule = note.module || '';
        var noteType = note.lecture_type || '';
        var show = false;
        if (activeFilter === 'all') {
            show = true;
        } else if (targetModule === 'special') {
            show = (noteType === 'special' || noteType === 'project');
        } else {
            show = (noteModule === targetModule);
        }
        card.style.display = show ? '' : 'none';
    });
    // Update active filter button
    document.querySelectorAll('.lecture-module-filter .btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    var activeBtn = document.getElementById('filter-' + activeFilter);
    if (activeBtn) activeBtn.classList.add('active');
}

function exportLectureNotesMarkdown() {
    if (!lectureNotes || lectureNotes.length === 0) {
        showToast('无讲义数据可导出', 'error');
        return;
    }
    var courseMap = {};
    if (courseData) {
        courseData.forEach(function(s) { courseMap[s.id] = s; });
    }
    var now = new Date().toLocaleString('zh-CN');
    var lines = [];
    lines.push('# How2AI 中文课程 — 试点讲义笔记');
    lines.push('');
    lines.push('**课程名称：** MIT MAS.S60 — How to AI (Almost) Anything 中文导览');
    lines.push('**导出时间：** ' + now);
    lines.push('**版本：** Phase 7C Notes Polish');
    var readCount = lectureNotes.filter(function(n) { return getLectureNoteStatus(n.session_id) === 'read'; }).length;
    lines.push('**讲义总数：** ' + lectureNotes.length + ' | **已读：** ' + readCount + ' | **待读：** ' + (lectureNotes.length - readCount));
    lines.push('');
    lines.push('---');
    lines.push('');
    lectureNotes.forEach(function(note) {
        var course = courseMap[note.session_id] || {};
        var noteStatus = getLectureNoteStatus(note.session_id);
        lines.push('## ' + (course.zh_title || note.session_id) + ' [' + noteStatus + ']');
        lines.push('');
        lines.push('**原始标题：** ' + (course.original_title || 'N/A'));
        lines.push('**课程类型：** ' + (note.lecture_type || 'lecture'));
        lines.push('**状态：** ' + (note.note_status || 'unknown'));
        lines.push('**阅读状态：** ' + (noteStatus === 'read' ? '✅ 已读' : '⏳ 待读'));
        lines.push('');
        if (note.one_sentence) {
            lines.push('### 一句话');
            lines.push(note.one_sentence);
            lines.push('');
        }
        if (note.core_question) {
            lines.push('### 核心问题');
            lines.push(note.core_question);
            lines.push('');
        }
        if (note.why_it_matters) {
            lines.push('### 为什么重要');
            lines.push(note.why_it_matters);
            lines.push('');
        }
        if (note.concepts && note.concepts.length > 0) {
            lines.push('### 核心概念');
            note.concepts.forEach(function(c) {
                lines.push('- **' + c.term + (c.term_en ? ' (' + c.term_en + ')' : '') + '**：' + (c.explanation || ''));
                if (c.common_misunderstanding) {
                    lines.push('  - ⚠️ 常见误区：' + c.common_misunderstanding);
                }
            });
            lines.push('');
        }
        if (note.reading_guide && note.reading_guide.length > 0) {
            lines.push('### 必读材料导读');
            note.reading_guide.forEach(function(rg) {
                lines.push('**' + (rg.title || '未命名阅读材料') + '**');
                if (rg.why_read) lines.push('- 为什么读：' + rg.why_read);
                if (rg.how_to_read) lines.push('- 怎么读：' + rg.how_to_read);
                if (rg.key_questions && rg.key_questions.length > 0) {
                    lines.push('- 关键问题：');
                    rg.key_questions.forEach(function(q) { lines.push('  - ' + q); });
                }
                lines.push('');
            });
        }
        if (note.project_ideas && note.project_ideas.length > 0) {
            lines.push('### 项目化方向');
            note.project_ideas.forEach(function(pi) {
                lines.push('- **' + (pi.title || '未命名项目') + '** [' + (pi.difficulty || 'intermediate') + ']');
                if (pi.description) lines.push('  - ' + pi.description);
                if (pi.data_needed) lines.push('  - 数据需求：' + pi.data_needed);
                if (pi.possible_output) lines.push('  - 预期产出：' + pi.possible_output);
            });
            lines.push('');
        }
        if (note.reflection_questions && note.reflection_questions.length > 0) {
            lines.push('### 思考题');
            note.reflection_questions.forEach(function(q) {
                lines.push('- ' + q);
            });
            lines.push('');
        }
        if (note.mini_assignment) {
            lines.push('### Mini Assignment');
            lines.push(note.mini_assignment);
            lines.push('');
        }
        lines.push('---');
        lines.push('');
    });
    lines.push('*本文件由 How2AI 中文课程导览页 Phase 7C 全课程讲义系统导出 | https://conanxin.github.io/projects/how-to-ai-almost-anything-cn/*');
    var md = lines.join('\n');
    var filename = 'how2ai-lecture-notes-' + now.split(' ')[0].replace(/\//g, '-') + '.md';
    downloadMarkdown(md, filename);
    showToast('试点讲义已导出为 Markdown', 'success');
}

/* ========== Thematic Learning Routes ========== */

var _routeProgress = {};
var ROUTE_PROGRESS_KEY = 'how2ai_route_progress';

function getRouteProgress() {
    try { return JSON.parse(localStorage.getItem(ROUTE_PROGRESS_KEY) || '{}'); } catch { return {}; }
}
function saveRouteProgress(progress) {
    localStorage.setItem(ROUTE_PROGRESS_KEY, JSON.stringify(progress));
}
function setRouteMilestone(routeId, milestoneId, done) {
    var progress = getRouteProgress();
    if (!progress[routeId]) progress[routeId] = { milestones: {} };
    progress[routeId].milestones[milestoneId] = done;
    saveRouteProgress(progress);
    updateRouteCardProgress(routeId);
}
function toggleRouteMilestone(routeId, milestoneId) {
    var progress = getRouteProgress();
    if (!progress[routeId]) progress[routeId] = { milestones: {} };
    var current = progress[routeId].milestones[milestoneId] || false;
    progress[routeId].milestones[milestoneId] = !current;
    saveRouteProgress(progress);
    updateRouteCardProgress(routeId);
}
function updateRouteCardProgress(routeId) {
    var route = thematicRoutes.find(function(r) { return r.id === routeId; });
    if (!route) return;
    var progress = getRouteProgress();
    var routeProg = progress[routeId] || { milestones: {} };
    var milestones = route.milestones || [];
    var done = milestones.filter(function(m) { return routeProg.milestones[m.id]; }).length;
    var card = document.querySelector('[data-route-id="' + routeId + '"]');
    if (!card) return;
    var bar = card.querySelector('.route-progress-bar-fill');
    var count = card.querySelector('.route-progress-count');
    if (bar) bar.style.width = (milestones.length > 0 ? (done / milestones.length * 100) : 0) + '%';
    if (count) count.textContent = done + ' / ' + milestones.length;
    var badge = card.querySelector('.route-completion-badge');
    if (badge) {
        if (done === milestones.length && milestones.length > 0) {
            badge.textContent = 'done';
            badge.className = 'route-completion-badge badge-complete';
        } else {
            badge.textContent = done + ' / ' + milestones.length;
            badge.className = 'route-completion-badge';
        }
    }
}
function getRouteProgressData(routeId) {
    var route = thematicRoutes.find(function(r) { return r.id === routeId; });
    if (!route) return { done: 0, total: 0, milestones: {} };
    var progress = getRouteProgress();
    var routeProg = progress[routeId] || { milestones: {} };
    var milestones = route.milestones || [];
    var done = milestones.filter(function(m) { return routeProg.milestones[m.id]; }).length;
    return { done: done, total: milestones.length, milestones: routeProg.milestones };
}
function renderThematicRoutes() {
    var container = document.getElementById('thematicRoutesContainer');
    if (!container) return;
    if (!thematicRoutes || thematicRoutes.length === 0) {
        container.innerHTML = '<p class="text-muted">&#x4E13;&#x9898;&#x8DEF;&#x7EBF;&#x6570;&#x636E;&#x6682;&#x4E0D;&#x53EF;&#x7528;&#x3002;</p>';
        return;
    }
    var html = renderRouteTabs();
    html += '<div class="route-grid">';
    thematicRoutes.forEach(function(route) {
        var prog = getRouteProgressData(route.id);
        var done = prog.done;
        var total = prog.total;
        var pct = total > 0 ? (done / total * 100) : 0;
        var difficultyLabel = { beginner: '&#x5165;&#x95E8;', intermediate: '&#x8FDB;&#x9636;', advanced: '&#x6DF1;&#x5165;' }[route.difficulty] || route.difficulty;
        var difficultyClass = 'diff-' + route.difficulty;
        var isComplete = (done === total && total > 0);
        html += '<div class="route-card' + (isComplete ? ' route-card-complete' : '') + '" data-route-id="' + route.id + '">';
        html += '<div class="route-card-header" onclick="toggleRouteCard(\'' + route.id + '\')">';
        html += '<div class="route-title-row">';
        html += '<h3 class="route-title">' + escHtml(route.title) + '</h3>';
        html += '<span class="route-completion-badge' + (isComplete ? ' badge-complete' : '') + '">' + (isComplete ? '&#x2713; &#x5B8C;&#x6210;' : (done + ' / ' + total)) + '</span>';
        html += '</div>';
        html += '<p class="route-subtitle">' + escHtml(route.subtitle) + '</p>';
        html += '<div class="route-meta">';
        html += '<span class="route-difficulty ' + difficultyClass + '">' + difficultyLabel + '</span>';
        html += '<span class="route-time">' + escHtml(route.estimated_time) + '</span>';
        html += '<span class="route-type">' + escHtml(route.route_type) + '</span>';
        html += '</div>';
        html += '<div class="route-progress">';
        html += '<div class="route-progress-bar"><div class="route-progress-bar-fill" style="width:' + pct + '%"></div></div>';
        html += '<span class="route-progress-count">' + done + ' / ' + total + '</span>';
        html += '</div>';
        html += '</div>';
        html += '<div class="route-card-body" id="routeBody-' + route.id + '" style="display:none">';
        html += '<div class="route-description"><p>' + escHtml(route.description) + '</p></div>';
        if (route.route_summary) html += '<div class="route-rs-summary">' + escHtml(route.route_summary) + '</div>';
        if (route.target_learners) html += '<div class="route-rs-row"><span class="route-rs-lbl">\u9002\u5408\u4EBA\u7FA4\uFF1A</span><span class="route-rs-val">' + escHtml(route.target_learners) + '</span></div>';
        if (route.final_output) html += '<div class="route-rs-row"><span class="route-rs-lbl">\u6700\u7EC8\u4EA7\u51FA\uFF1A</span><span class="route-rs-val">' + escHtml(route.final_output) + '</span></div>';
        html += '<div class="route-copy-row"><button class="route-copy-btn" onclick="copyRouteLink(\'' + route.id + '\')">\u2B07 \u590D\u5236\u8DEF\u7EBF\u94FE\u63A5</button></div>';

        // Session list
        html += '<div class="route-section-label">&#x8BFE;&#x7A0B;&#x8282;&#x70B9;</div>';
        html += '<ul class="route-session-list">';
        route.session_ids.forEach(function(sid) {
            var session = courseData.find(function(s) { return s.id === sid; });
            if (session) {
                html += '<li>';
                html += '<a href="#sessions" class="route-session-link" onclick="scrollToSessionFromRoute(\'' + sid + '\')">';
                html += '<span class="session-week">Week ' + (session.week || '') + '</span> ';
                html += '<span class="session-zh-title">' + escHtml(session.zh_title || session.original_title || sid) + '</span>';
                html += '</a>';
                html += '</li>';
            }
        });
        html += '</ul>';

        // Readings
        if (route.reading_ids && route.reading_ids.length > 0) {
            html += '<div class="route-section-label">&#x63A8;&#x8350;&#x9605;&#x8BFB;</div>';
            html += '<ul class="route-reading-list">';
            route.reading_ids.forEach(function(rid) {
                var reading = curatedReadings.find(function(r) { return r.id === rid; });
                if (reading) {
                    html += '<li><a href="#readings" class="route-reading-link" onclick="switchReadingSource(\'curated\'); setTimeout(function(){ openReading(\'' + rid + '\'); }, 100);">';
                    html += escHtml(reading.title_zh || reading.title || rid) + '</a></li>';
                }
            });
            html += '</ul>';
        }

        // Glossary terms
        if (route.glossary_terms && route.glossary_terms.length > 0) {
            html += '<div class="route-section-label">&#x76F8;&#x5173;&#x672F;&#x8BED;</div>';
            html += '<div class="route-glossary-list">';
            route.glossary_terms.forEach(function(term) {
                var gEntry = glossaryData.find(function(g) { return g.term_en === term || g.term_zh === term; });
                if (gEntry) {
                    html += '<a href="#glossary" class="route-glossary-link glossary-anchor-link" onclick="event.preventDefault(); var el=document.getElementById(\'glossary-' + gEntry.id + '\'); if(el){el.scrollIntoView({behavior:\'smooth\'});el.classList.add(\'highlight\');setTimeout(function(){el.classList.remove(\'highlight\');},2000);}">' + escHtml(term) + '</a>';
                } else {
                    html += '<span class="route-glossary-chip">' + escHtml(term) + '</span>';
                }
            });
            html += '</div>';
        }

        // Milestones
        if (route.milestones && route.milestones.length > 0) {
            html += '<div class="route-section-label">&#x91CC;&#x7A0B;&#x7891;&#x7387;&#x6807;</div>';
            html += '<ul class="route-milestones">';
            var prog2 = getRouteProgressData(route.id);
            route.milestones.forEach(function(m) {
                var checked = prog2.milestones && prog2.milestones[m.id] ? 'checked' : '';
                html += '<li>';
                html += '<label class="route-milestone-label">';
                html += '<input type="checkbox" ' + checked + ' onchange="toggleRouteMilestone(\'' + route.id + '\', \'' + m.id + '\')">';
                html += '<span class="milestone-label-text">' + escHtml(m.label) + '</span>';
                html += '</label>';
                html += '<p class="milestone-desc">' + escHtml(m.description) + '</p>';
                html += '</li>';
            });
            html += '</ul>';
        }

        // Quiz
        html += renderQuizForRoute(route.id);

        // Actions
        html += '<div class="route-actions">';
        html += '<button class="btn-export-route" onclick="exportRouteMarkdown(\'' + route.id + '\')">&#x1F4E4; &#x5BFC;&#x51FA;&#x8DEF;&#x7EBF; Markdown</button>';
        html += '<button class="btn-route-report" onclick="exportRouteLearningReport(\'' + route.id + '\')">&#x1F4CA; &#x751F;&#x6210;&#x8DEF;&#x7EBF;&#x5B66;&#x4E60;&#x62A5;&#x544A;</button>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
}
function toggleRouteCard(routeId) {
    var card = document.querySelector('[data-route-id="' + routeId + '"]');
    var body = document.getElementById('routeBody-' + routeId);
    if (!card || !body) return;
    var isExpanded = card.classList.contains('expanded');
    if (isExpanded) {
        card.classList.remove('expanded');
        body.style.display = 'none';
    } else {
        card.classList.add('expanded');
        body.style.display = 'block';
    }
}
function scrollToSessionFromRoute(sessionId) {
    switchReadingSource('curated');
    document.querySelectorAll('.tab-btn').forEach(function(t) { t.classList.remove('active'); });
    var tabAll = document.querySelector('.tab-btn[data-filter="all"]');
    if (tabAll) tabAll.classList.add('active');
    currentFilter = 'all';
    closeAllSessions();
    renderSessions();
    setTimeout(function() { openSession(sessionId); }, 100);
}
function exportRouteMarkdown(routeId) {
    var route = thematicRoutes.find(function(r) { return r.id === routeId; });
    if (!route) return;
    var prog = getRouteProgressData(routeId);
    var lines = [];
    lines.push('# ' + route.title + '\n\n');
    lines.push('> ' + route.subtitle + '\n\n');
    lines.push('**' + '&#x9002;&#x5408;&#x5BF9;&#x8C61;：** ' + route.audience + '\n\n');
    lines.push('**' + '&#x5B66;&#x4E60;&#x76EE;&#x6807;：** ' + route.goal + '\n\n');
    lines.push('**' + '&#x96BE;&#x5EA6;：** ' + route.difficulty + ' | **' + '&#x9884;&#x8BA1;&#x65F6;&#x95F4;：** ' + route.estimated_time + '\n\n');
    lines.push('---\n\n');
    lines.push('## ' + '&#x8BFE;&#x7A0B;&#x8282;&#x70B9;' + '\n\n');
    route.session_ids.forEach(function(sid) {
        var session = courseData.find(function(s) { return s.id === sid; });
        if (session) {
            lines.push('- **Week ' + (session.week || '') + '** ' + (session.zh_title || session.original_title || sid) + '\n');
        }
    });
    if (route.reading_ids && route.reading_ids.length > 0) {
        lines.push('\n## ' + '&#x63A8;&#x8350;&#x9605;&#x8BFB;' + '\n\n');
        route.reading_ids.forEach(function(rid) {
            var reading = curatedReadings.find(function(r) { return r.id === rid; });
            if (reading) {
                lines.push('- ' + (reading.title_zh || reading.title || rid) + '\n');
            }
        });
    }
    if (route.glossary_terms && route.glossary_terms.length > 0) {
        lines.push('\n## ' + '&#x76F8;&#x5173;&#x672F;&#x8BED;' + '\n\n');
        route.glossary_terms.forEach(function(term) {
            var gEntry = glossaryData.find(function(g) { return g.term_en === term || g.term_zh === term; });
            lines.push('- ' + term + (gEntry ? ' (' + gEntry.term_zh + ')' : '') + '\n');
        });
    }
    if (route.milestones && route.milestones.length > 0) {
        lines.push('\n## ' + '&#x91CC;&#x7A0B;&#x7891;&#x7387;&#x6807;（' + prog.done + ' / ' + prog.total + '）\n\n');
        route.milestones.forEach(function(m) {
            var done = prog.milestones && prog.milestones[m.id] ? '[x]' : '[ ]';
            lines.push('- ' + done + ' **' + m.label + '**\n');
            lines.push('  ' + m.description + '\n');
        });
    }
    lines.push('\n## ' + '&#x6700;&#x7EC8;&#x4EA7;&#x51FA;' + '\n\n' + route.final_output + '\n\n');
    lines.push('## ' + '&#x9879;&#x76EE; prompt\n\n' + route.project_prompt + '\n');
    downloadMarkdown(lines.join(''), route.id + '-learning-route.md');
    showToast('&#x8DEF;&#x7EBF;&#x5DF2;&#x5BFC;&#x51FA;&#x4E3A; Markdown &#x1F4E4;');
}
function exportAllRoutesMarkdown() {
    var lines = [];
    lines.push('# How2AI ' + '&#x4E13;&#x9898;&#x5B66;&#x4E60;&#x8DEF;&#x7EBF; ' + '&#x2014; ' + '&#x5168;&#x90E8;&#x5BFC;&#x51FA;' + '\n\n');
    lines.push('' + '&#x5BFC;&#x51FA;&#x65F6;&#x95F4;：** ' + new Date().toLocaleString('zh-CN') + '\n\n');
    thematicRoutes.forEach(function(route) {
        var prog = getRouteProgressData(route.id);
        lines.push('## ' + route.title + '\n\n');
        lines.push('> ' + route.subtitle + '\n\n');
        lines.push('**' + '&#x96BE;&#x5EA6;：** ' + route.difficulty + ' | **' + '&#x9884;&#x8BA1;&#x65F6;&#x95F4;：** ' + route.estimated_time + '\n\n');
        lines.push('**' + '&#x5B8C;&#x6210;&#x5EA6;：** ' + prog.done + ' / ' + prog.total + ' ' + '&#x91CC;&#x7A0B;&#x7891;&#x7387;&#x6807;' + '\n\n');
        if (route.milestones && route.milestones.length > 0) {
            route.milestones.forEach(function(m) {
                var done = prog.milestones && prog.milestones[m.id] ? '[x]' : '[ ]';
                lines.push('- ' + done + ' **' + m.label + '**\n');
            });
        }
        lines.push('\n---\n\n');
    });
    downloadMarkdown(lines.join(''), 'how2ai-all-routes-progress.md');
    showToast('&#x6240;&#x6709;&#x8DEF;&#x7EBF;&#x8FC7;&#x5EA6;&#x5DF2;&#x5BFC;&#x51FA; &#x1F4E4;');
}

/* ========== Phase 8B: Route Learning System ========== */

/* ---- Route Landing Tabs + URL Hash ---- */
var ACTIVE_ROUTE_KEY = 'how2ai_active_route';
var ROUTE_QUIZ_SCORES_KEY = 'how2ai_route_quiz_scores';

function getActiveRoute() {
    try {
        var h = window.location.hash;
        if (h && h.startsWith('#route-')) return h.slice(7);
    } catch(e){}
    try { return localStorage.getItem(ACTIVE_ROUTE_KEY) || 'all'; } catch(e) { return 'all'; }
}
function setActiveRoute(routeId) {
    try {
        if (routeId === 'all') {
            window.location.hash = '';
            localStorage.removeItem(ACTIVE_ROUTE_KEY);
        } else {
            window.location.hash = 'route-' + routeId;
            localStorage.setItem(ACTIVE_ROUTE_KEY, routeId);
        }
    } catch(e){}
}
function handleRouteHash() {
    var routeId = getActiveRoute();
    if (routeId && routeId !== 'all') {
        var btn = document.querySelector('[data-route-tab="' + routeId + '"]');
        if (btn) btn.click();
    }
}

/* ---- Session <-> Route Reverse Map ---- */
var _sessionRouteMap = null;
function buildSessionRouteMap() {
    if (_sessionRouteMap) return _sessionRouteMap;
    _sessionRouteMap = {};
    try {
        thematicRoutes.forEach(function(route) {
            (route.session_ids || []).forEach(function(sid) {
                if (!_sessionRouteMap[sid]) _sessionRouteMap[sid] = [];
                _sessionRouteMap[sid].push(route);
            });
        });
    } catch(e){}
    return _sessionRouteMap;
}
function getRoutesForSession(sessionId) {
    try { return buildSessionRouteMap()[sessionId] || []; } catch(e) { return []; }
}
function renderSessionRouteBadges(sessionId) {
    var routes = getRoutesForSession(sessionId);
    if (!routes.length) return '';
    var html = '';
    routes.forEach(function(route) {
        html += '<span class="session-route-badge" onclick="event.stopPropagation(); setActiveRoute(\'' + route.id + '\'); scrollToThematicRoutes();">' + escHtml(route.title) + '</span>';
    });
    return '<div class="session-route-badges">' + html + '</div>';
}
function scrollToThematicRoutes() {
    var el = document.getElementById('thematicRoutesContainer');
    if (el) el.scrollIntoView({behavior: 'smooth'});
}

/* ---- Reading <-> Route Reverse Map ---- */
var _readingRouteMap = null;
function buildReadingRouteMap() {
    if (_readingRouteMap) return _readingRouteMap;
    _readingRouteMap = {};
    try {
        thematicRoutes.forEach(function(route) {
            (route.reading_ids || []).forEach(function(rid) {
                if (!_readingRouteMap[rid]) _readingRouteMap[rid] = [];
                _readingRouteMap[rid].push(route);
            });
        });
    } catch(e){}
    return _readingRouteMap;
}
function getRoutesForReading(readingId) {
    try { return buildReadingRouteMap()[readingId] || []; } catch(e) { return []; }
}
function renderReadingRouteBadges(readingId) {
    var routes = getRoutesForReading(readingId);
    if (!routes.length) return '';
    var html = '';
    routes.forEach(function(route) {
        html += '<span class="reading-route-badge" onclick="event.stopPropagation(); setActiveRoute(\'' + route.id + '\'); scrollToThematicRoutes();">' + escHtml(route.title) + '</span>';
    });
    return '<div class="reading-route-badges">' + html + '</div>';
}

/* ---- Quiz System ---- */
function getRouteQuizScores() {
    try { return JSON.parse(localStorage.getItem(ROUTE_QUIZ_SCORES_KEY) || '{}'); } catch(e) { return {}; }
}
function saveRouteQuizScore(routeId, score) {
    try {
        var scores = getRouteQuizScores();
        var prev = scores[routeId];
        scores[routeId] = { score: score, date: new Date().toISOString(), best: prev && prev.best ? Math.max(prev.best, score) : score };
        localStorage.setItem(ROUTE_QUIZ_SCORES_KEY, JSON.stringify(scores));
    } catch(e){}
}
function getRouteQuizScoreData(routeId) {
    try { return getRouteQuizScores()[routeId] || null; } catch(e) { return null; }
}

function renderQuizForRoute(routeId) {
    var route = thematicRoutes.find(function(r){ return r.id === routeId; });
    if (!route || !route.quiz || !route.quiz.length) return '';
    var scoreData = getRouteQuizScoreData(routeId);
    var html = '<div class="quiz-container" id="quiz-' + routeId + '">';
    html += '<div class="quiz-header">';
    html += '<span class="quiz-title">\u2714 Mini Quiz</span>';
    if (scoreData) {
        html += '<span class="quiz-score">' + scoreData.score + '/5';
        if (scoreData.best && scoreData.best > scoreData.score) html += ' (\u6700\u4F73: ' + scoreData.best + '/5)';
        html += '</span>';
    }
    html += '<button class="quiz-retake-btn" onclick="resetQuizForRoute(\'' + routeId + '\')">\u21BA \u91CD\u505A</button>';
    html += '<button class="quiz-retry-mistakes-btn" onclick="retryRouteMistakes(\'' + routeId + '\')">\u21BA \u5355\u91CD\u505A\u9519\u9898</button>';
    html += '</div>';
    html += '<div class="quiz-disclaimer">\u2757 \u672C Quiz \u4E3A\u672C\u4E2D\u6587\u5BFC\u89C8\u81EA\u5236\u7EC3\u4E60\uFF0C\u4EE3\u8868\u4E0D\u4E86 MIT \u5B98\u65B9\u4F5C\u4E1A\u3002</div>';
    route.quiz.forEach(function(q, idx) {
        html += '<div class="quiz-question" id="qq-' + routeId + '-' + idx + '">';
        html += '<p class="quiz-q-text"><strong>Q' + (idx+1) + '.</strong> ' + escHtml(q.question) + '</p>';
        html += '<div class="quiz-options">';
        q.options.forEach(function(opt, oi) {
            html += '<label class="quiz-option-label">';
            html += '<input type="radio" name="q-' + routeId + '-' + idx + '" value="' + oi + '" onchange="handleQuizAnswer(\'' + routeId + '\', ' + idx + ', ' + oi + ', ' + q.answer + ')">';
            html += '<span class="quiz-option-text">' + escHtml(opt) + '</span>';
            html += '</label>';
        });
        html += '</div>';
        html += '<div class="quiz-feedback" id="qf-' + routeId + '-' + idx + '" style="display:none"></div>';
        html += '</div>';
    });
    html += '</div>';
    html += '<div class="mistake-review-box" id="mistake-review-' + routeId + '"></div>';
    return html;
}

function handleQuizAnswer(routeId, qIdx, selected, correctAnswer) {
    var feedbackEl = document.getElementById('qf-' + routeId + '-' + qIdx);
    if (!feedbackEl) return;
    feedbackEl.style.display = 'block';
    var isCorrect = selected === correctAnswer;
    feedbackEl.className = 'quiz-feedback ' + (isCorrect ? 'quiz-correct' : 'quiz-incorrect');
    var route = thematicRoutes.find(function(r){ return r.id === routeId; });
    var q = route.quiz[qIdx];
    var optText = q.options[correctAnswer] || '';
    feedbackEl.innerHTML = isCorrect
        ? '\u2714 \u6B63\u786E\uFF01 ' + escHtml(q.explanation)
        : '\u2718 \u9519\u8BEF\uFF0C\u6B63\u786E\u7B54\u6848\u662F\uFF1A' + escHtml(optText) + '\u3002 ' + escHtml(q.explanation);
    var inputs = feedbackEl.parentElement.querySelectorAll('input[type="radio"]');
    inputs.forEach(function(inp){ inp.disabled = true; });
    var correctCount = 0;
    var answered = 0;
    for (var i = 0; i < route.quiz.length; i++) {
        var checked = document.querySelector('input[name="q-' + routeId + '-' + i + '"]:checked');
        if (checked) {
            answered++;
            if (parseInt(checked.value) === route.quiz[i].answer) correctCount++;
        }
    }
    saveRouteQuizAnswer(routeId, String(qIdx), selected);
    saveRouteQuizScore(routeId, correctCount);
    var scoreEl = document.querySelector('#quiz-' + routeId + ' .quiz-score');
    if (scoreEl) scoreEl.textContent = correctCount + '/5';
    if (answered === route.quiz.length) {
        var mrEl = document.getElementById('mistake-review-' + routeId);
        if (mrEl) mrEl.innerHTML = renderRouteMistakeReview(route);
    }
}

function resetQuizForRoute(routeId) {
    var quizEl = document.getElementById('quiz-' + routeId);
    if (!quizEl) return;
    var keysToRemove = [];
    for (var i = 0; i < localStorage.length; i++) { var key = localStorage.key(i); if (key && key.indexOf('how2ai_route_' + routeId) === 0) keysToRemove.push(key); }
    keysToRemove.forEach(function(k){ localStorage.removeItem(k); });
    var newHtml = renderQuizForRoute(routeId);
    quizEl.outerHTML = newHtml;
}


/* === Phase 8C === */
function getRouteQuizAnswers(routeId){try{return JSON.parse(getLS('how2ai_route_quiz_answers')||'{}');}catch(e){return {};}}
function saveRouteQuizAnswer(routeId,questionId,selectedIndex){var a=getRouteQuizAnswers(routeId);a[routeId+'_'+questionId]=parseInt(selectedIndex);setLS('how2ai_route_quiz_answers',JSON.stringify(a));}
function getRouteQuizMistakes(routeId){
    var a=getRouteQuizAnswers(routeId);var route=thematicRoutes.find(function(r){return r.id===routeId;});if(!route||!route.quiz)return[];
    var mistakes=[];route.quiz.forEach(function(q,idx){var sv=a[routeId+'_'+String(idx)];if(sv!==undefined&&sv!==null&&sv!==q.answer)mistakes.push({idx:idx,question:q,userAnswer:sv});});return mistakes;
}
function renderRouteMistakeReview(route){
    var mistakes=getRouteQuizMistakes(route.id);var html='';
    if(mistakes.length===0){html+='<div class="mr-empty">\u2714 \u5F53\u524D\u6CA1\u6709\u9519\u9898\uFF0C\u5B8C\u70B9\uFF01</div>';}
    else{html+='<div class="mr-header">\u9519\u9898\u56DE\u987E\uFF08'+mistakes.length+'\u9898\uFF09</div>';
    mistakes.forEach(function(m){var q=m.question;html+='<div class="mr-item">';
    html+='<p class="mr-q"><strong>Q'+(m.idx+1)+'.</strong> '+escHtml(q.question)+'</p>';
    html+='<p class="mr-wrong">\u6211\u7684\u7B54\u6848\uFF1A'+escHtml(q.options[m.userAnswer]||'N/A')+'</p>';
    html+='<p class="mr-correct">\u6B63\u786E\u7B54\u6848\uFF1A'+escHtml(q.options[q.answer])+'</p>';
    html+='<p class="mr-exp">\u89E3\u91CA\uFF1A'+escHtml(q.explanation)+'</p>';html+='</div>';});}
    return html;
}
function retryRouteMistakes(routeId){
    var quizEl=document.getElementById('quiz-'+routeId);if(!quizEl)return;
    var route=thematicRoutes.find(function(r){return r.id===routeId;});
    var a=getRouteQuizAnswers(routeId);var na={};
    for(var k in a){var idx=parseInt(k.split('_').pop());if(a[k]===route.quiz[idx].answer)na[k]=a[k];}
    setLS('how2ai_route_quiz_answers',JSON.stringify(na));saveRouteQuizScore(routeId,0);
    quizEl.outerHTML=renderQuizForRoute(routeId);
}
function copyRouteLink(routeId){
    var url=window.location.origin+window.location.pathname+'#'+routeId;
    var cb=function(){showToast('\u5DF2\u590D\u5236\u8DEF\u7EBF\u94FE\u63A5','success');};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(cb).catch(function(){fallbackCopy(url,cb);});else fallbackCopy(url,cb);
}
function fallbackCopy(text,cb){var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');cb();}catch(e){}document.body.removeChild(ta);}
function generateRouteNextWeekPlan(routeId){
    var route=thematicRoutes.find(function(r){return r.id===routeId;});if(!route)return[];
    var prog=getRouteProgressData(routeId);var quizSc=getRouteQuizScoreData(routeId);var mistakes=getRouteQuizMistakes(routeId);
    var rsDone=0;(route.session_ids||[]).forEach(function(sid){var s2=courseData.find(function(c){return c.id===sid;});if(s2)rsDone++;});
    var rrDone=0;(route.reading_ids||[]).forEach(function(rid){var r2=curatedReadings.find(function(c){return c.id===rid;});if(r2)rrDone++;});
    var plan=[];var pct=prog.total>0?prog.done/prog.total:0;
    if(pct<0.3)plan.push('\u5148\u5B8C\u6210\u8DEF\u7EBF\u7684\u524D2\u4E2A\u91CC\u7A0B\u7891\u7387\u6807\uFF0C\u6253\u597D\u57FA\u7840');
    if(quizSc&&quizSc.score<3)plan.push('\u91CD\u505A\u9519\u9898\uFF0C\u6DF1\u5165\u7406\u89E3\u76F8\u5173\u672F\u8BED');
    if(rrDone<2){var nrid=(route.reading_ids||[])[rrDone];if(nrid){var r3=curatedReadings.find(function(c){return c.id===nrid;});if(r3)plan.push('\u9605\u8BFB\u63A8\u8350\u8BFB\u6587\uFF1A'+(r3.title_zh||r3.title||nrid));}}
    if(rsDone<2){var nsid=(route.session_ids||[])[rsDone];if(nsid){var s3=courseData.find(function(c){return c.id===nsid;});if(s3)plan.push('\u5B8C\u6210\u63A8\u8350\u8BFE\u7A0B\u8282\u70B9\uFF1AWeek '+(s3.week||'')+' '+(s3.zh_title||s3.original_title||''));}}
    if(plan.length===0)plan.push('\u7EC3\u4E60\u5DF2\u5B66\u5185\u5BB9\uFF0C\u5C1D\u8BD5\u5199\u4E00\u4E2A\u9879\u76EE\u63D0\u6848\u6216\u5B9E\u9A8C demo');
    return plan;
}
function setLS(k,v){try{localStorage.setItem(k,v);}catch(e){}}


/* ---- Route Learning Report Export ---- */
function exportRouteLearningReport(routeId) {
    var route = thematicRoutes.find(function(r){ return r.id === routeId; });
    if (!route) return;
    var prog = getRouteProgressData(routeId);
    var quiz = getRouteQuizScoreData(routeId);
    var completedSessions = [];
    (route.session_ids || []).forEach(function(sid) {
        var sess = courseData.find(function(c){ return c.id === sid; });
        if (sess) completedSessions.push(sess);
    });
    var completedReadings = [];
    (route.reading_ids || []).forEach(function(rid) {
        var r = curatedReadings.find(function(c){ return c.id === rid; });
        if (r) completedReadings.push(r);
    });
    var lines = [];
    lines.push('# How2AI \u4E13\u9898\u8DEF\u7EBF\u5B66\u4E60\u62A5\u544A\uFF1A' + route.title + '\n\n');
    var now = new Date().toLocaleString('zh-CN');
    var curMode = (typeof getCurrentMode === 'function' ? getCurrentMode() : 'overview');
    var modeNames = { overview: '\u5FEB\u901F\u901A\u5FD7\u6A21\u5F0F', deep_dive: '\u8BBA\u6587\u7CBE\u8BFB\u6A21\u5F0F', project: '\u9879\u76EE\u5B9E\u6218\u6A21\u5F0F' };
    lines.push('**\u5BFC\u51FA\u65F6\u95F4\uFF1A**' + now + '  |  **\u8DEF\u7EBF\u94FE\u63A5\uFF1A**https://conanxin.github.io/projects/how-to-ai-almost-anything-cn/#' + routeId + '  |  **\u5B66\u4E60\u6A21\u5F0F\uFF1A**' + (modeNames[curMode]||curMode) + '\n\n');
    lines.push('---\n\n## 1. \u8DEF\u7EBF\u76EE\u6807\n\n' + (route.route_summary || route.goal || '') + '\n\n');
    lines.push('**\u9002\u5408\u4EBA\u7FA4\uFF1A**' + (route.target_learners || route.audience || '') + '  |  **\u9884\u8BA1\u65F6\u95F4\uFF1A**' + (route.estimated_time || '') + '  |  **\u6700\u7EC8\u4EA7\u51FA\uFF1A**' + (route.final_output || '') + '\n\n');
    lines.push('---\n\n## 2. \u5F53\u524D\u8FDB\u5EA6\n\n');
    var quizSc = getRouteQuizScoreData(routeId);
    var mistakes = getRouteQuizMistakes(routeId);
    var rsDone = 0; (route.session_ids||[]).forEach(function(sid){var s2=courseData.find(function(c){return c.id===sid;});if(s2)rsDone++;});
    var rrDone = 0; (route.reading_ids||[]).forEach(function(rid){var r2=curatedReadings.find(function(c){return c.id===rid;});if(r2)rrDone++;});
    lines.push('- **Milestones:** ' + prog.done + '/' + prog.total + '\n');
    lines.push('- **Quiz\u5F97\u5206:** ' + (quizSc ? quizSc.score + '/5 (\u6700\u4F73: ' + (quizSc.best||quizSc.score) + '/5, \u9519\u9898: ' + mistakes.length + '\u9898)' : '\u6682\u672A\u5B58\u5728') + '\n');
    lines.push('- **\u63A8\u8350\u8BFE\u7A0B\u8282\u70B9:** ' + rsDone + '/' + (route.session_ids||[]).length + '\n');
    lines.push('- **\u63A8\u8350\u8BFB\u6587:** ' + rrDone + '/' + (route.reading_ids||[]).length + '\n\n');
    lines.push('---\n\n## 3. \u5DF2\u5B8C\u6210\u91CC\u7A0B\u7891\u7387\u6807\n\n');
    (route.milestones || []).forEach(function(m) {
        var done = prog.milestones && prog.milestones[m.id] ? '[x]' : '[ ]';
        lines.push('- ' + done + ' **' + m.label + '**  ' + m.description + '\n');
    });
    lines.push('\n---\n\n## 4. Quiz \u7ED3\u679C\u4E0E\u9519\u9898\u56DE\u987E\n\n');
    if (quizSc) {
        lines.push('- **\u5F53\u524D\u5F97\u5206:** ' + quizSc.score + '/5  (\u6700\u4F73: ' + (quizSc.best||quizSc.score) + '/5)\n');
        lines.push('- **\u9519\u9898\u6570:** ' + mistakes.length + '\n\n');
        if (mistakes.length > 0) {
            mistakes.forEach(function(m) {
                lines.push('- **Q'+(m.idx+1)+':** ' + m.question.question + '\n  \u6211\u7684\u7B54\u6848: ' + (m.question.options[m.userAnswer]||'N/A') + '  \u6B63\u786E\u7B54\u6848: ' + m.question.options[m.question.answer] + '\n  \u89E3\u91CA: ' + m.question.explanation + '\n');
            });
        } else {
            lines.push('\u2714 \u5168\u90E8\u6B63\u786E\uFF0C\u5B8C\u70B9\uFF01\n');
        }
    } else {
        lines.push('\u6682\u65E0\u5B66\u4E60\u8BB0\u5F55\u3002\n');
    }
    lines.push('\n---\n\n## 5. \u5DF2\u5B66\u4E60\u8BFE\u7A0B\u8282\u70B9 (' + completedSessions.length + ' \u63A8\u8350/' + (route.session_ids||[]).length + ')\n\n');
    completedSessions.forEach(function(sess) {
        lines.push('- **Week ' + (sess.week||'') + '** ' + (sess.zh_title||sess.original_title||'') + '\n');
    });
    lines.push('\n---\n\n## 6. \u5DF2\u9605\u8BFB\u8BBA\u6587 (' + completedReadings.length + ' \u63A8\u8350/' + (route.reading_ids||[]).length + ')\n\n');
    completedReadings.forEach(function(r) {
        lines.push('- ' + (r.title_zh||r.title||'') + ' ' + (r.authors?'\u2014 '+r.authors:'') + '\n');
    });
    lines.push('\n---\n\n## 7. \u6838\u5FC3\u672F\u8BED\n\n');
    (route.glossary_terms||[]).forEach(function(t) {
        var g = glossaryData.find(function(g2){ return g2.term_en===t || g2.term_zh===t; });
        lines.push('- **' + t + '**' + (g && g.term_zh ? ' \u2014 ' + g.term_zh : '') + '\n');
    });
    lines.push('\n---\n\n## 8. \u6211\u7684\u7406\u89E3\u603B\u7ED3\n\n');
    lines.push('_\n\u5728\u6B64\u8F93\u5165\u4F60\u5BF9\u672C\u8DEF\u7EBF\u6838\u5FC3\u6982\u5FF5\u7684\u7406\u89E3\u3002\n_\n\n');
    lines.push('\n---\n\n## 9. \u4E0B\u4E00\u5468\u5B66\u4E60\u8BA1\u5212\n\n');
    var nwp = generateRouteNextWeekPlan(routeId);
    nwp.forEach(function(item){ lines.push('- [ ] ' + item + '\n'); });
    lines.push('\n---\n\n## 10. \u6211\u7684\u7406\u89E3\u603B\u7ED3\n\n');
    lines.push('_\u5728\u6B64\u8F93\u5165\u4F60\u5BF9\u672C\u8DEF\u7EBF\u6838\u5FC3\u6982\u5FF5\u7684\u7406\u89E3\u3002_\n\n');
    lines.push('\u6211\u8BA4\u4E3A\u8FD9\u8DEF\u7EBF\u7684\u6838\u5FC3\u95EE\u9898\u662F\uFF1A\u2014\n\n\n');
    lines.push('\u6211\u6700\u60F3\u7EE7\u7EED\u6DF1\u5165\u7684\u662F\uFF1A\u2014\n\n\n');
    lines.push('\u6211\u53EF\u4EE5\u505A\u7684\u4E00\u4E2A demo/proposal \u662F\uFF1A\u2014\n\n\n');
    lines.push('\n---\n\n*\u672C\u62A5\u544A\u7531 How2AI \u4E2D\u6587\u5BFC\u89C8\u81EA\u52A8\u751F\u6210\uFF0C\u4EE3\u8868\u4E86\u5B66\u4E60\u8BB0\u5F55\uFF0C\u4E0D\u662F MIT \u5B98\u65B9\u6587\u6863\u3002*\n');
    downloadMarkdown(lines.join(''), route.id + '-learning-report.md');
    showToast('\u8DEF\u7EBF\u5B66\u4E60\u62A5\u544A\u5DF2\u5BFC\u51FA', 'success');
}

/* ---- Learning Mode Route Recommendations ---- */
var LEARNING_MODE_RECOMMENDATIONS = {
    overview: ['multisensory-ai', 'multimodal-foundation-models'],
    deep_dive: ['multimodal-foundation-models', 'interactive-agents'],
    project: ['research-project-track', 'interactive-agents']
};

function getRouteRecommendationHTML() {
    var mode = typeof currentMode !== 'undefined' ? currentMode : null;
    if (!mode || !LEARNING_MODE_RECOMMENDATIONS[mode]) return '';
    var recRouteIds = LEARNING_MODE_RECOMMENDATIONS[mode];
    var html = '<div class="mode-route-recommendation">';
    html += '<span class="mode-rec-label">\u2705 \u63A8\u8350\u7ED9\u4F60\u7684\u8DEF\u7EBF\uFF1A</span>';
    recRouteIds.forEach(function(rid) {
        var route = thematicRoutes.find(function(r){ return r.id === rid; });
        if (route) {
            html += '<button class="mode-rec-btn" onclick="setActiveRoute(\'' + route.id + '\'); scrollToThematicRoutes();">';
            html += escHtml(route.title) + '</button>';
        }
    });
    html += '</div>';
    return html;
}

/* ---- Route Tab Rendering ---- */
function renderRouteTabs() {
    var html = '<div class="route-tabs">';
    html += '<button class="route-tab-btn' + (getActiveRoute() === 'all' ? ' active' : '') + '" data-route-tab="all" onclick="switchRouteTab(\'all\')">\u5168\u90E8\u8DEF\u7EBF</button>';
    thematicRoutes.forEach(function(route) {
        html += '<button class="route-tab-btn' + (getActiveRoute() === route.id ? ' active' : '') + '" data-route-tab="' + route.id + '" onclick="switchRouteTab(\'' + route.id + '\')">' + escHtml(route.title) + '</button>';
    });
    html += '</div>';
    html += getRouteRecommendationHTML();
    return html;
}

function switchRouteTab(routeId) {
    setActiveRoute(routeId);
    document.querySelectorAll('.route-tab-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-route-tab') === routeId);
    });
    document.querySelectorAll('.route-card').forEach(function(card) {
        if (routeId === 'all') {
            card.style.display = '';
        } else {
            card.style.display = card.getAttribute('data-route-id') === routeId ? '' : 'none';
        }
    });
    var recEl = document.querySelector('.mode-route-recommendation');
    if (recEl) {
        var newRecHtml = getRouteRecommendationHTML();
        recEl.outerHTML = newRecHtml;
    }
}



function escHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function showToast(msg, type) {
    var toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:10px 18px;border-radius:6px;font-size:14px;z-index:9999;color:#fff;background:' + (type === 'error' ? '#e74c3c' : '#27ae60') + ';box-shadow:0 2px 8px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);
    setTimeout(function() { document.body.removeChild(toast); }, 3000);
}

function updateProjectProgressBar() {
    var total = PROJECT_STEPS.length;
    var done = PROJECT_STEPS.filter(function(step) {
        var cb = document.getElementById('pp-'+step);
        return cb && cb.checked;
    }).length;
    var pct = Math.round((done/total)*100);
    var bar = document.getElementById('ppProgressBar');
    var text = document.getElementById('ppProgressText');
    if (bar) bar.style.width = pct+'%';
    if (text) text.textContent = done+'/'+total+' 已完成 ('+pct+'%)';
}

function exportProjectMarkdown() {
  var progress = getProjectProgress();
  var milestones = getProjectMilestones();
  var lines = [];
  lines.push('# How2AI 研究项目进度\n\n导出时间：' + new Date().toLocaleString('zh-CN') + '\n\n## 项目里程碑\n');
  milestones.forEach(function(item) {
    var done = progress[item.id] ? 'x' : ' ';
    lines.push('- [' + done + '] ' + item.title + '：' + item.desc + '\n');
  });
  lines.push('\n## 下一步建议\n\n- [ ] 明确研究问题和模态边界\n- [ ] 整理数据来源与评估指标\n- [ ] 实现 baseline\n- [ ] 规划 error analysis 与 ablation study\n- [ ] 准备 Final Presentation 与 Final Report\n');
  downloadMarkdown('how2ai-project-progress.md', lines.join(''));
}

function downloadMarkdown(content, filename) {
    var blob = new Blob(['\ufeff'+content], {type:'text/markdown;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

// Enhanced exportAllNotes with Phase 5D data
window.exportAllNotes = function() {
    var modeNames = { general: '快速通识模式', paper: '论文精读模式', project: '项目实战模式' };
    var mode = localStorage.getItem('how2ai_mode');
    var modeName = mode ? modeNames[mode] : '未选择';
    var sessionNotes = JSON.parse(localStorage.getItem('how2ai_notes')||'{}');
    var sessionLines = Object.entries(sessionNotes).map(function(kv) {
        var s = (window.courseData||[]).find(function(c){return c.id===kv[0];});
        return '### ' + (s?(s.zh_title||s.original_title):kv[0]) + '\n\n' + (kv[1]||'_（未记录）_');
    }).join('\n\n');
    var readingStatus = JSON.parse(localStorage.getItem(window.READING_STATUS_KEY||'how2ai_reading_status')||'{}');
    var readingLines = (window.curatedReadings||[]).map(function(r) {
        var done = readingStatus[r.id]==='completed';
        var note = readingStatus[r.id+'_note']||'';
        return '- [' + (done?'x':' ') + '] **' + (r.zh_title||r.title) + '**' + (note?'\n  '+note:'');
    }).join('\n');
    var projState = JSON.parse(localStorage.getItem(window.PROJECT_PROGRESS_KEY||'how2ai_project_progress')||'{}');
    var stepLabels = {
        'topic':'选题方向','proposal':'Proposal 草案','lit-review':'Literature Review',
        'data-task':'数据与任务定义','baseline':'Baseline','midterm':'Midterm Report',
        'error-analysis':'Error Analysis','ablation':'Ablation Study',
        'final-presentation':'Final Presentation','final-report':'Final Report'
    };
    var projLines = (window.PROJECT_STEPS||[]).map(function(s) {
        return '- [' + (projState[s]?'x':' ') + '] ' + stepLabels[s];
    }).join('\n');
    var now = new Date().toLocaleString('zh-CN');
    var md = [
        '# How2AI 中文课程 \u2014 完整学习笔记',
        '',
        '**\u5bfc\u51fa\u65f6\u95f4\uff1a** ' + now + '  ',
        '**\u5b66\u4e60\u6a21\u5f0f\uff1a** ' + modeName + '  ',
        '**\u9875\u9762\u7248\u672c\uff1a** Phase 6B-R2 Polish',
        '',
        '---',
        '',
        '## \u5b66\u4e60\u6a21\u5f0f',
        '',
        modeName,
        '',
        '---',
        '',
        '## \u8bfe\u7a0b\u7b14\u8bb0',
        '',
        sessionLines||'_(\u65e0\u8bfe\u7a0b\u7b14\u8bb0) _',
        '',
        '---',
        '',
        '## \u9605\u8bfb\u72b6\u6001',
        '',
        readingLines||'_(\u65e0\u9605\u8bfb\u72b6\u6001) _',
        '',
        '---',
        '',
        '## \u9879\u76ee\u8fdb\u5ea6',
        '',
        projLines||'_(\u65e0\u9879\u76ee\u8fdb\u5ea6) _',
        '',
        '*\u7531 How2AI \u4e2d\u6587\u8bfe\u7a0b\u5bfc\u89a8\u9875\u5bfc\u51fa | https://conanxin.github.io/projects/how-to-ai-almost-anything-cn/*'
    ].join('\n');
    downloadMarkdown(md, 'How2AI\u5b8c\u6574\u7b14\u8bb0_'+now.split(' ')[0].replace(/\//g,'-')+'.md');
    showToast('\u5b8c\u6574\u7b14\u8bb0\u5df2\u5bfc\u51fa','success');
};

function exportProjectProposalTemplate() {
  var md = [
    '# How2AI Project Proposal',
    '',
    '## 1. 研究问题',
    '',
    '## 2. 为什么这个模态重要',
    '',
    '## 3. 相关工作',
    '',
    '## 4. 数据来源',
    '',
    '## 5. 模型/架构方案',
    '',
    '## 6. 评估指标',
    '',
    '## 7. Baseline',
    '',
    '## 8. 风险与限制',
    '',
    '## 9. Midterm 目标',
    '',
    '## 10. Final 目标',
    ''
  ].join('\n');
  downloadMarkdown('how2ai-project-proposal-template.md', md);
}


function exportFinalReportTemplate() {
  var md = [
    '# How2AI Final Report',
    '',
    '## Abstract',
    '',
    '## 1. Introduction',
    '',
    '## 2. Related Work',
    '',
    '## 3. Data and Task Definition',
    '',
    '## 4. Method',
    '',
    '## 5. Experiments',
    '',
    '## 6. Error Analysis',
    '',
    '## 7. Ablation Study',
    '',
    '## 8. Limitations',
    '',
    '## 9. Social Impact',
    '',
    '## 10. Conclusion',
    ''
  ].join('\n');
  downloadMarkdown('how2ai-final-report-template.md', md);
}
