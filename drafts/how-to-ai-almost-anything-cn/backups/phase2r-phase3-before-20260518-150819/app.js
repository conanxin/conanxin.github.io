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
    c.innerHTML = f.map(r => `
        <div class="reading-card">
            <span class="reading-category cat-${r.category}">${r.category}</span>
            <div class="reading-title">${r.title}</div>
            <div class="reading-title-zh">${r.zh_title || ''}</div>
            <div class="reading-authors">${r.authors || ''} · ${r.year || ''}</div>
            <div class="reading-why">${r.why_it_matters || ''}</div>
            ${r.chinese_reading_guide ? `<div class="reading-guide"><strong>📖 中文导读：</strong>${r.chinese_reading_guide}</div>` : ''}
            <a class="reading-link" href="${r.url}" target="_blank" rel="noopener">🔗 论文链接 ↗</a>
        </div>`).join('');
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

function exportNote(sessionId) {
    const s = courseData.find(s => s.id === sessionId);
    const note = _notes[sessionId] || '';
    const md = `# ${s ? s.zh_title : sessionId} 学习笔记\n\n**Week ${s ? s.week : ''} · ${s ? s.original_title : ''}**\n\n## 笔记内容\n\n${note || '_（空）_'}\n\n---\n*由 How2AI 中文课程页面导出*`;
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
    const fill = document.getElementById('progressFill');
    if (fill) fill.setAttribute('style', 'width:' + pct + '%');
    const pctEl = document.getElementById('progressPercent');
    if (pctEl) pctEl.textContent = pct + '%';
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
