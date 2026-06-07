# If This Isn't Nice
## Kurt Vonnegut PBS NOW 2005 Interview · v1.0

> **STATUS: v1.0 · Complete**  
> A bilingual literary web edition of Kurt Vonnegut's 2005 PBS NOW interview with David Brancaccio.

**Public URL:** https://conanxin.github.io/projects/vonnegut-pbs-now-2005-interview/

---

## About This Page

This page presents the interview as an interactive **literary reading experience**, featuring:

- **Full bilingual presentation** — English and Chinese sides by side
- **Three reading modes** — English / 中文 / 双语 (bilingual)
- **Literary interview flow** — Q&A styled as a continuous reading text, not a quote card wall
- **Distinct Q/A hierarchy** — Interviewer questions lighter/narrower, Vonnegut answers heavier/wider
- **Theme navigation** — Filter by topic: Creative Process, Politics & Society, Humor & Philosophy, Personal Stories
- **Interactive annotations** — Hover over highlighted terms for context
- **Personal notebook** — Add your own notes, export as Markdown
- **Full-text search** — Search across the interview
- **Keyboard shortcuts** — Press `?` for the full list
- **Print-ready layout** — Optimized for printing

## Interview Background

| Field | Detail |
|-------|--------|
| **Guest** | Kurt Vonnegut (1922–2007) |
| **Interviewer** | David Brancaccio |
| **Show** | PBS NOW |
| **Air date** | October 7, 2005 |
| **Re-aired** | April 11, 2007 (memorial) |
| **Note** | Vonnegut passed away April 11, 2007 |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `E` | English mode |
| `C` | Chinese mode |
| `B` | Bilingual mode |
| `P` | Print |
| `?` | Shortcut help |

## Phase History (v1.0)

| Phase | Description |
|-------|-------------|
| Phase 5 | Initial build: full bilingual interview page |
| Phase 6 | Post-launch QA: date fixes, PBS link fixes, loading UX |
| Phase 7 | Chinese mode completeness audit: all 51 segments now have `zh_content` |
| Phase 7.1 | GitHub Pages cache verification |
| Phase 8 | Normalize transcript turns: speaker badge always first, remove duplicate rendering |
| Phase 9 | Redesign into literary interview flow: replace quote cards with `.turn` system |
| Phase 9.2 | Q/A visual hierarchy: 74% vs 88% width, offset indentation, color differentiation |

## Local Usage

Open directly in a browser:
```bash
open index.html
```

Or serve locally:
```bash
python3 -m http.server 8080
# Then visit: http://127.0.0.1:8080/
```

## Built With

- HTML5 + CSS3 + Vanilla JavaScript
- OpenClaw Agent staged build workflow