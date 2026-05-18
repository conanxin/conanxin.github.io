/* How2AI 中文课程 — 交互逻辑 (Phase 7C) */
let courseData = [], curatedReadings = [], glossaryData = [], officialReadings = [],
    lectureNotes = [],
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
        const [c, r, g, o, lh, ln] = await Promise.all([
            fetch('data/course.json').then(r => r.json()),
            fetch('data/readings.json').then(r => r.json()),
            fetch('data/glossary.json').then(r => r.json()),
            fetch('data/official_reading_map.json').then(r => r.json()).catch(() => []),
            fetch('data/link_health.json').then(r => r.json()).catch(() => []),
            fetch('data/lecture_notes.json').then(r => r.json()).catch(() => [])
        ]);
        courseData = c;
        curatedReadings = r;
        glossaryData = g;
        officialReadings = o;
        lectureNotes = ln || [];
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
        try { lectureNotes = await fetch('data/lecture_notes.json').then(r => r.json()).catch(() => []); } catch(e){}
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
  lines.push('## 下一步建议\n\n- [ ] 选择一个学习模式并完成对应路线\n- [ ] 至少完成 3 个课程节点\n- [ ] 至少用七角色工作台读完 1 篇论文\n- [ ] 写出一个 Project Proposal\n- [ ] 准备 Final Presentation 和 Final Report\n');
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
                        glossaryLink = '<a href="#glossary-' + match.id + '" class="glossary-link">见术语表</a>';
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
    lines.push('**版本：** Phase 7B Full Lecture Notes');
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
