#!/usr/bin/env python3
"""Phase 5D JS injection script — injects learning UX JS into app.js"""
import re, sys

APPJS = '/home/ubuntu/conanxin.github.io/drafts/how-to-ai-almost-anything-cn/assets/js/app.js'

PHASE5D_JS = '''

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
}

function clearModeHighlights() {
    document.querySelectorAll('.mode-card').forEach(function(c){ c.classList.remove('mode-selected'); });
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
            return '### ' + role + '\n\n' + (kv[1]||'_（未记录）_');
        }).join('\n\n');
    var md = '# 七角色阅读笔记：' + (p.zh_title||p.title) + '\n\n' +
        '**导出时间：** ' + now + '  \n' +
        '**论文：** ' + p.title + '  \n' +
        '**中文标题：** ' + (p.zh_title||'') + '  \n' +
        '**作者：** ' + p.authors + ' (' + p.year + ')  \n' +
        '**分类：** ' + p.category + '  \n' +
        '**难度：** ' + (diffEmoji[p.difficulty]||'') + '  \n' +
        '**推荐顺序：** #' + p.recommended_order + '  \n' +
        '**学习路径：** ' + p.reading_path + '  \n' +
        '**原文链接：** ' + p.url + '\n\n---\n\n## 七角色笔记\n\n' +
        (allNotes||'_（无笔记）_') + '\n\n---\n\n## 下一步行动建议\n\n' +
        '- [ ] 选择下一个角色重新阅读\n- [ ] 将笔记整合到 Literature Review\n- [ ] 思考是否有 follow-up research question\n';
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
    var nextSteps = undone.length ? undone.map(function(k){return '- [ ] ' + stepLabels[k];}).join('\n') : '（所有阶段已完成 🎉）';
    var md = '# How2AI 研究项目进度\n\n' +
        '**导出时间：** ' + now + '  \n' +
        '**项目完成度：** ' + done + '/' + total + ' (' + pct + '%)\n\n' +
        '## 项目检查清单\n\n' + lines.join('\n') + '\n\n---\n\n## 下一步行动\n\n' + nextSteps + '\n';
    downloadMarkdown(md, 'How2AI项目进度_'+now.split(' ')[0].replace(/\//g,'-')+'.md');
    showToast('项目笔记已导出','success');
}

function downloadMarkdown(content, filename) {
    var blob = new Blob(['\\ufeff'+content], {type:'text/markdown;charset=utf-8'});
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
        return '### ' + (s?(s.zh_title||s.original_title):kv[0]) + '\n\n' + (kv[1]||'_（未记录）_');
    }).join('\n\n');
    var readingStatus = JSON.parse(localStorage.getItem(READING_STATUS_KEY)||'{}');
    var readingLines = curatedReadings.map(function(r) {
        var done = readingStatus[r.id]==='completed';
        var note = readingStatus[r.id+'_note']||'';
        return '- [' + (done?'x':' ') + '] **' + (r.zh_title||r.title) + '**' + (note?'\n  '+note:'');
    }).join('\n');
    var projState = JSON.parse(localStorage.getItem(PROJECT_PROGRESS_KEY)||'{}');
    var stepLabels = {
        'topic':'选题方向','proposal':'Proposal 草案','lit-review':'Literature Review',
        'data-task':'数据与任务定义','baseline':'Baseline','midterm':'Midterm Report',
        'error-analysis':'Error Analysis','ablation':'Ablation Study',
        'final-presentation':'Final Presentation','final-report':'Final Report'
    };
    var projLines = PROJECT_STEPS.map(function(s) {
        return '- [' + (projState[s]?'x':' ') + '] ' + stepLabels[s];
    }).join('\n');
    var now = new Date().toLocaleString('zh-CN');
    var md = '# How2AI 中文课程 — 完整学习笔记\n\n' +
        '**导出时间：** ' + now + '  \n' +
        '**学习模式：** ' + modeName + '  \n' +
        '**页面版本：** Phase 5D Learning UX\n\n' +
        '---\n\n## 学习模式\n\n' + modeName + '\n\n---\n\n## 课程笔记\n\n' +
        (sessionLines||'_（无课程笔记）_') + '\n\n---\n\n## 阅读进度\n\n' +
        (readingLines||'_（无阅读记录）_') + '\n\n---\n\n## 项目进度\n\n' +
        (projLines||'_（无项目进度）_') + '\n\n---\n\n*由 How2AI 中文课程导览页导出 | https://conanxin.github.io/drafts/how-to-ai-almost-anything-cn/*\n';
    downloadMarkdown(md, 'How2AI完整笔记_'+now.split(' ')[0].replace(/\//g,'-')+'.md');
    showToast('完整笔记已导出','success');
};

'''

def main():
    with open(APPJS, 'r') as f:
        app_js = f.read()

    lines = app_js.split('\n')
    end_idx = len(lines) - 1
    while end_idx >= 0 and lines[end_idx].strip() != '});':
        end_idx -= 1
    print("Found closing at line: " + str(end_idx+1))

    new_lines = list(lines[:end_idx])
    new_lines.append(PHASE5D_JS)
    new_lines.extend(lines[end_idx:])
    new_app = '\n'.join(new_lines)

    old_init = '''    await loadData();
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
});'''

    new_init = '''    await loadData();
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
});'''

    if old_init in new_app:
        new_app = new_app.replace(old_init, new_init)
        print("DOMContentLoaded updated OK")
    else:
        print("WARNING: Could not find DOMContentLoaded pattern")
        sys.exit(1)

    with open(APPJS, 'w') as f:
        f.write(new_app)
    print("app.js saved. Length: " + str(len(new_app)))

    checks = [
        'function setupLearningModes',
        'function setupWorkbench',
        'function setupProjectProgress',
        'function downloadMarkdown',
        'const PROJECT_STEPS',
    ]
    for check in checks:
        found = check in new_app
        print("  " + ("OK" if found else "MISSING") + ": " + check)

if __name__ == '__main__':
    main()
