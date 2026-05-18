#!/usr/bin/env python3
"""Append Phase 5D CSS to styles.css"""
import re

CSS_FILE = '/home/ubuntu/conanxin.github.io/drafts/how-to-ai-almost-anything-cn/assets/css/styles.css'

PHASE5D_CSS = '''

/* ============================================================
   PHASE 5D: Learning UX Enhancement
   ============================================================ */

/* --- Learning Modes --- */
.mode-card {
    background: var(--card-bg);
    border: 2px solid var(--border-color);
    border-radius: 16px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    flex: 1;
    min-width: 200px;
}
.mode-card:hover {
    border-color: var(--accent-purple);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
.mode-card.mode-selected {
    border-color: var(--accent-purple);
    background: rgba(147, 51, 234, 0.1);
    box-shadow: 0 4px 20px rgba(147, 51, 234, 0.25);
}
.mode-card-icon {
    font-size: 2.5rem;
    margin-bottom: 12px;
    display: block;
}
.mode-card-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
}
.mode-card-target {
    font-size: 0.85rem;
    color: var(--accent-purple);
    font-weight: 600;
    margin-bottom: 10px;
}
.mode-card-desc {
    font-size: 0.8rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 10px;
}
.mode-card-output {
    font-size: 0.75rem;
    color: var(--text-secondary);
    background: var(--bg-secondary);
    border-radius: 8px;
    padding: 8px 10px;
}
.mode-card-output strong {
    color: var(--accent-green);
}
.modes-grid {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}
.mode-actions {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 12px;
}

/* --- Course Is Not --- */
.course-is-not-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
}
.course-is-not {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 20px;
}
.course-is-not.not {
    border-left: 4px solid #e74c3c;
}
.course-is-not.is {
    border-left: 4px solid #27ae60;
}
.course-is-not-title {
    font-weight: 700;
    font-size: 0.95rem;
    margin-bottom: 8px;
    color: var(--text-primary);
}
.course-is-not ul {
    margin: 0;
    padding-left: 16px;
}
.course-is-not li {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 4px;
    line-height: 1.5;
}

/* --- Module Core Questions --- */
.module-intro-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 12px;
}
.module-intro-badge {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 8px;
}
.module-intro-core-q {
    font-size: 1rem;
    font-weight: 700;
    color: var(--accent-purple);
    margin-bottom: 8px;
}
.module-intro-learning {
    font-size: 0.82rem;
    color: var(--text-secondary);
    padding-left: 16px;
    margin-bottom: 4px;
}
.module-intro-who {
    font-size: 0.8rem;
    color: var(--accent-green);
    font-style: italic;
    margin-top: 6px;
}

/* --- Workbench --- */
.workbench-container {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 28px;
    margin-top: 32px;
}
.workbench-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 8px;
}
.workbench-desc {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 20px;
}
.workbench-selector {
    margin-bottom: 20px;
}
.workbench-selector label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 6px;
    color: var(--text-secondary);
}
.workbench-selector select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 0.9rem;
}
.workbench-paper-info {
    margin-top: 10px;
    padding: 10px 14px;
    background: var(--bg-secondary);
    border-radius: 8px;
    font-size: 0.82rem;
}
.wb-paper-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 6px;
}
.wb-diff-badge {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
}
.wb-path-badge {
    font-size: 0.72rem;
    padding: 2px 8px;
    background: var(--accent-purple);
    color: white;
    border-radius: 4px;
}
.wb-order {
    font-size: 0.72rem;
    color: var(--text-secondary);
}
.wb-paper-link {
    font-size: 0.72rem;
    color: var(--accent-purple);
    text-decoration: none;
}
.wb-paper-authors {
    color: var(--text-secondary);
    font-size: 0.78rem;
}
.workbench-tabs {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 16px;
}
.workbench-tab {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
}
.workbench-tab.active {
    background: var(--accent-purple);
    color: white;
    border-color: var(--accent-purple);
}
.workbench-tab:hover:not(.active) {
    border-color: var(--accent-purple);
    color: var(--accent-purple);
}
.workbench-prompt {
    background: var(--bg-secondary);
    border-left: 3px solid var(--accent-purple);
    padding: 12px 16px;
    border-radius: 0 8px 8px 0;
    font-size: 0.88rem;
    color: var(--text-primary);
    margin-bottom: 12px;
    line-height: 1.5;
}
.workbench-textarea {
    width: 100%;
    min-height: 160px;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 0.88rem;
    resize: vertical;
    font-family: inherit;
    line-height: 1.6;
    box-sizing: border-box;
}
.workbench-actions {
    display: flex;
    gap: 10px;
    margin-top: 12px;
}

/* --- Project Progress System --- */
.project-progress-system {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 28px;
    margin-top: 32px;
}
.pp-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 6px;
}
.pp-desc {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 20px;
}
.pp-checklist {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
    margin-bottom: 20px;
}
.pp-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    background: var(--bg-secondary);
    border-radius: 10px;
    transition: background 0.2s;
}
.pp-item:has(input:checked) {
    background: rgba(39, 174, 96, 0.1);
}
.pp-item input[type="checkbox"] {
    margin-top: 2px;
    width: 16px;
    height: 16px;
    cursor: pointer;
    flex-shrink: 0;
}
.pp-item label {
    font-size: 0.82rem;
    color: var(--text-primary);
    cursor: pointer;
}
.pp-item label strong {
    display: block;
    font-size: 0.85rem;
    margin-bottom: 2px;
}
.pp-item label span {
    font-size: 0.75rem;
    color: var(--text-secondary);
}
.pp-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}
.pp-progress-bar-wrap {
    flex: 1;
    height: 8px;
    background: var(--border-color);
    border-radius: 4px;
    overflow: hidden;
}
.pp-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-purple), var(--accent-green));
    border-radius: 4px;
    width: 0%;
    transition: width 0.5s ease;
}
.pp-progress-text {
    font-size: 0.8rem;
    color: var(--text-secondary);
    white-space: nowrap;
}
.pp-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

/* --- Reduced info density defaults --- */
.official-readings-container .toggle-official {
    margin-bottom: 16px;
}
.official-readings-container .official-full {
    display: none;
}
.official-readings-container .official-full.show {
    display: block;
}
.source-links-container .toggle-source {
    margin-bottom: 16px;
}
.glossary-grid {
    max-height: 400px;
    overflow-y: auto;
}
.glossary-hot {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 8px;
    margin-bottom: 16px;
}
.session-card .session-summary {
    display: block;
}
.session-card .session-full {
    display: none;
}
.session-card.expanded .session-summary {
    display: none;
}
.session-card.expanded .session-full {
    display: block;
}

/* --- Responsive Phase 5D --- */
@media (max-width: 768px) {
    .modes-grid {
        flex-direction: column;
    }
    .mode-card {
        min-width: unset;
    }
    .workbench-tabs {
        gap: 4px;
    }
    .workbench-tab {
        padding: 6px 8px;
        font-size: 0.75rem;
    }
    .pp-checklist {
        grid-template-columns: 1fr;
    }
    .course-is-not-grid {
        grid-template-columns: 1fr;
    }
    .workbench-container,
    .project-progress-system {
        padding: 16px;
    }
}
'''

def main():
    with open(CSS_FILE, 'r') as f:
        css = f.read()

    if '/* PHASE 5D' in css:
        print("Phase 5D CSS already present, skipping")
        return

    css += PHASE5D_CSS

    with open(CSS_FILE, 'w') as f:
        f.write(css)
    print("Phase 5D CSS appended. New length: " + str(len(css)))

if __name__ == '__main__':
    main()
