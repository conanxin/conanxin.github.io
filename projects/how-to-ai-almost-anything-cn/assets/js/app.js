/* How2AI 中文课程 — 交互逻辑 (Phase 2) */
let courseData = [], curatedReadings = [], glossaryData = [], officialReadings = [],
    currentFilter = 'all', currentReadingCat = 'all', currentRole = 'Peer Reviewer',
    currentReadingSource = 'curated', currentOfficialCat = 'all',
    _progress = {}, _notes = {};

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderTimeline();
    renderSessions();
    renderReadings();
    renderGlossary();
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

async function loadData() {
    try {
        const [c, r, g, o] = await Promise.all([
            fetch('data/course.json').then(r => r.json()),
            fetch('data/readings.json').then(r => r.json()),
            fetch('data/glossary.json').then(r => r.json()),
            fetch('data/official_reading_map.json').then(r => r.json()).catch(() => [])
        ]);
        courseData = c;
        curatedReadings = r;
        glossaryData = g;
        officialReadings = o;
    } catch (e) {
        console.error('Failed to load data:', e);
        // Fallback: try individual loads
        try { courseData = await fetch('data/course.json').then(r => r.json()); } catch(e){}
        try { curatedReadings = await fetch('data/readings.json').then(r => r.json()); } catch(e){}
        try { glossaryData = await fetch('data/glossary.json').then(r => r.json()); } catch(e){}
        try { officialReadings = await fetch('data/official_reading_map.json').then(r => r.json()); } catch(e){}
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
                    ${s.slides_url ? `<a class="session-link" href="${s.slides_url}" target="_blank" rel="noopener">📄 Slides PDF</a>` : ''}
                    ${s.video_url ? `<a class="session-link" href="${s.video_url}" target="_blank" rel="noopener">🎥 视频</a>` : ''}
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
        <div class="glossary-item">
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
    const notes = getAllNotes();
    const completed = Object.keys(getProgress());
    const readingStatus = getReadingStatus();
    let md = `# How2AI 中文课程 — 学习笔记导出\n\n**导出时间**: ${new Date().toLocaleString('zh-CN')}\n**课程进度**: ${completed.length}/23 节完成\n\n---\n\n## 📊 学习进度\n\n`;
    md += `### 课程完成情况\n`;
    courseData.filter(s => s.session_type !== 'special').forEach(s => {
        const done = !!getProgress()[s.id];
        md += `- [${done ? 'x' : ' '}] Week ${s.week}: ${s.zh_title}\n`;
    });
    md += `\n### 精选阅读状态\n`;
    curatedReadings.forEach(r => {
        const st = readingStatus[r.id] || 'unread';
        const icons = {unread:'⬜', reading:'🔵', done:'✅', skip:'⏭️'};
        md += `- ${icons[st] || '⬜'} ${r.zh_title || r.title}\n`;
    });
    md += `\n---\n\n## 📝 详细笔记\n\n`;
    courseData.filter(s => s.session_type !== 'special' && notes[s.id]).forEach(s => {
        md += `### Week ${s.week} · ${s.zh_title}\n\n${notes[s.id]}\n\n---\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `how2ai-all-notes-${new Date().toISOString().slice(0,10)}.md`;
    a.click();
    showToast('完整笔记已导出 📤');
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

function showToast(msg) {
    const div = document.createElement('div');
    div.style = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;z-index:9999;animation:fadeIn 0.3s;';
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 300); }, 2500);
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


// ============================================================
// PHASE 5D: Learning UX Enhancement
// ============================================================

let currentLearningMode = localStorage.getItem('how2ai_mode') || null;
let currentWorkbenchPaper = null;
let currentWorkbenchRole = 'Peer Reviewer';
const WORKBENCH_NOTES_KEY = 'how2ai_workbench_notes';
const PROJECT_PROGRESS_KEY = 'how2ai_project_progress';
const READING_STATUS_KEY = 'how2ai_reading_status';
const PROJECT_STEPS = ['topic','proposal','lit-review','data-task','baseline',
                       'midterm','error-analysis','ablation',
                       'final-presentation','final-report'];

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
    if (!currentWorkbenchPaper) { showToast('请先选择一篇论文','warning'); return; }
    saveWorkbenchNote();
    var p = currentWorkbenchPaper;
    var notes = getWorkbenchNotes();
    var diffEmoji = {beginner:'🟢入门',intermediate:'🟡进阶',advanced:'🔴高级'};
    var now = new Date().toLocaleString('zh-CN');
    var allNotes = Object.entries(notes)
        .filter(function(kv){return kv[0].startsWith(p.id+'_');})
        .map(function(kv){
            var role = kv[0].replace(p.id+'_','');
            return '### ' + role + '

' + (kv[1]||'_（未记录）_');
        }).join('

');
    var md = '# 七角色阅读笔记：' + (p.zh_title||p.title) + '

' +
        '**导出时间：** ' + now + '  
' +
        '**论文：** ' + p.title + '  
' +
        '**中文标题：** ' + (p.zh_title||'') + '  
' +
        '**作者：** ' + p.authors + ' (' + p.year + ')  
' +
        '**分类：** ' + p.category + '  
' +
        '**难度：** ' + (diffEmoji[p.difficulty]||'') + '  
' +
        '**推荐顺序：** #' + p.recommended_order + '  
' +
        '**学习路径：** ' + p.reading_path + '  
' +
        '**原文链接：** ' + p.url + '

---

## 七角色笔记

' +
        (allNotes||'_（无笔记）_') + '

---

## 下一步行动建议

' +
        '- [ ] 选择下一个角色重新阅读
- [ ] 将笔记整合到 Literature Review
- [ ] 思考是否有 follow-up research question
';
    downloadMarkdown(md, '七角色笔记_'+p.id+'_'+now.split(' ')[0].replace(/\//g,'-')+'.md');
    showToast('Markdown 已导出','success');
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
    var state = {};
    PROJECT_STEPS.forEach(function(step) {
        var cb = document.getElementById('pp-'+step);
        if (cb) state[step] = cb.checked;
    });
    var stepLabels = {
        'topic':'选题方向','proposal':'Proposal 草案','lit-review':'Literature Review',
        'data-task':'数据与任务定义','baseline':'Baseline','midterm':'Midterm Report',
        'error-analysis':'Error Analysis','ablation':'Ablation Study',
        'final-presentation':'Final Presentation','final-report':'Final Report'
    };
    var now = new Date().toLocaleString('zh-CN');
    var lines = PROJECT_STEPS.map(function(step) {
        return (state[step]?'✅':'⬜') + ' **' + stepLabels[step] + '**';
    });
    var total = PROJECT_STEPS.length;
    var done = Object.values(state).filter(Boolean).length;
    var pct = Math.round((done/total)*100);
    var undone = Object.entries(state).filter(function(kv){return !kv[1];}).map(function(kv){return kv[0];});
    var nextSteps = undone.length ? undone.map(function(k){return '- [ ] ' + stepLabels[k];}).join('
') : '（所有阶段已完成 🎉）';
    var md = '# How2AI 研究项目进度

' +
        '**导出时间：** ' + now + '  
' +
        '**项目完成度：** ' + done + '/' + total + ' (' + pct + '%)

' +
        '## 项目检查清单

' + lines.join('
') + '

---

## 下一步行动

' + nextSteps + '
';
    downloadMarkdown(md, 'How2AI项目进度_'+now.split(' ')[0].replace(/\//g,'-')+'.md');
    showToast('项目笔记已导出','success');
}

function downloadMarkdown(content, filename) {
    var blob = new Blob(['\ufeff'+content], {type:'text/markdown;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

// Enhanced exportAllNotes with Phase 5D data
var _originalExportAllNotes = typeof exportAllNotes !== 'undefined' ? exportAllNotes : null;
window.exportAllNotes = function() {
    var modeNames = { general: '快速通识模式', paper: '论文精读模式', project: '项目实战模式' };
    var mode = localStorage.getItem('how2ai_mode');
    var modeName = mode ? modeNames[mode] : '未选择';
    var sessionNotes = JSON.parse(localStorage.getItem('how2ai_notes')||'{}');
    var sessionLines = Object.entries(sessionNotes).map(function(kv) {
        var s = courseData.find(function(c){return c.id===kv[0];});
        return '### ' + (s?(s.zh_title||s.original_title):kv[0]) + '

' + (kv[1]||'_（未记录）_');
    }).join('

');
    var readingStatus = JSON.parse(localStorage.getItem(READING_STATUS_KEY)||'{}');
    var readingLines = curatedReadings.map(function(r) {
        var done = readingStatus[r.id]==='completed';
        var note = readingStatus[r.id+'_note']||'';
        return '- [' + (done?'x':' ') + '] **' + (r.zh_title||r.title) + '**' + (note?'
  '+note:'');
    }).join('
');
    var projState = JSON.parse(localStorage.getItem(PROJECT_PROGRESS_KEY)||'{}');
    var stepLabels = {
        'topic':'选题方向','proposal':'Proposal 草案','lit-review':'Literature Review',
        'data-task':'数据与任务定义','baseline':'Baseline','midterm':'Midterm Report',
        'error-analysis':'Error Analysis','ablation':'Ablation Study',
        'final-presentation':'Final Presentation','final-report':'Final Report'
    };
    var projLines = PROJECT_STEPS.map(function(s) {
        return '- [' + (projState[s]?'x':' ') + '] ' + stepLabels[s];
    }).join('
');
    var now = new Date().toLocaleString('zh-CN');
    var md = '# How2AI 中文课程 — 完整学习笔记

' +
        '**导出时间：** ' + now + '  
' +
        '**学习模式：** ' + modeName + '  
' +
        '**页面版本：** Phase 5D Learning UX

' +
        '---

## 学习模式

' + modeName + '

---

## 课程笔记

' +
        (sessionLines||'_（无课程笔记）_') + '

---

## 阅读进度

' +
        (readingLines||'_（无阅读记录）_') + '

---

## 项目进度

' +
        (projLines||'_（无项目进度）_') + '

---

*由 How2AI 中文课程导览页导出 | https://conanxin.github.io/drafts/how-to-ai-almost-anything-cn/*
';
    downloadMarkdown(md, 'How2AI完整笔记_'+now.split(' ')[0].replace(/\//g,'-')+'.md');
    showToast('完整笔记已导出','success');
};


    });
}
