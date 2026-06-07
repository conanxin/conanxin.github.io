# Release Notes — v1.0

**Project:** Kurt Vonnegut PBS NOW 2005 Interview  
**Version:** 1.0  
**Date:** 2026-06-07  
**URL:** https://conanxin.github.io/projects/vonnegut-pbs-now-2005-interview/

---

## What's New in v1.0

### Complete Bilingual Interview

All 51 transcript segments now include both English original and Chinese translation. Three reading modes are available:

- **English mode** — Full English interview text
- **Chinese mode** — Full Chinese translation, no English fallback
- **Bilingual mode** — English and Chinese stacked within each Q&A turn

### Literary Interview Flow Redesign (Phase 9)

The interview body has been completely restructured from a "quote card wall" into a continuous literary interview reading experience:

- Each Q&A segment renders as `<article class="turn turn-question|turn-answer">`
- Speaker badge always appears before content, never after
- Questions and answers are visually distinct but not like chat bubbles
- Annotations and theme tags are de-emphasized and moved to a subtle footer

### Q/A Visual Hierarchy (Phase 9.2)

Desktop layout uses subtle left-offset differentiation:

| | Interviewer (Question) | Vonnegut (Answer) |
|--|--|--|
| Width | 74% | 88% |
| Offset | `margin-left: 0` | `margin-left: 38px` |
| Background | Cool green tint | Warm cream tint |
| Font size | 1.01rem / 1.78 lh | 1.1rem / 1.96 lh |
| Badge | Green `#355f54` | Brown `#8b4513` |

On mobile (≤768px), the offset is removed and only color + font size differences remain.

### Transcript Completeness (Phase 7)

All 51 segments verified with complete `zh_content`. No English fallback in Chinese mode. No duplicate segment rendering.

### Phase Log

| Phase | Commit | Summary |
|-------|--------|---------|
| Phase 5 | `614ae4b` | Initial build |
| Phase 6 | `1ce987a` | Post-launch QA |
| Phase 7 | `e0628ed` | Chinese mode completeness |
| Phase 8 | `41ed192` | Speaker position normalization |
| Phase 9 | `d28b584` | Literary interview flow redesign |
| Phase 9.2 | `b9eb728` | Q/A visual hierarchy enhancement |

---

## Known Limitations

- GitHub Pages rebuild takes ~1-2 minutes after push
- Some PBS video links may be unavailable (archived/redirected)
- Personal notebook notes are stored in localStorage only (not persistent across devices)

---

## Planned Future Work

- Envelope Story special feature (expandable themed card)
- Mobile app-style swipe navigation for Q&A turns
- PDF export of interview text
- Dark mode support