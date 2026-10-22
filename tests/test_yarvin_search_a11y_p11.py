"""P11 accessibility: semantic search dialog, keyboard containment and motion."""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "projects" / "yarvin-moldbug-cn"
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
JS = (ROOT / "app.js").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")


class YarvinSearchA11yP11Tests(unittest.TestCase):
    def test_dialog_has_labelled_input_status_and_explicit_close(self):
        self.assertIn('id="searchOverlay" role="dialog" aria-modal="true" aria-labelledby="searchLabel"', HTML)
        self.assertIn('for="searchInput"', HTML)
        self.assertIn('id="btnSearchClose" aria-label="关闭搜索"', HTML)
        self.assertIn('id="searchResultCount" role="status" aria-live="polite" aria-atomic="true"', HTML)
        self.assertIn('aria-controls="searchResults" aria-describedby="searchResultCount searchHint"', HTML)
        results = HTML.split('id="searchResults"', 1)[1].split('>', 1)[0]
        self.assertNotIn("aria-live", results, "Do not read dozens of full snippets aloud")

    def test_modal_focus_is_isolated_then_restored(self):
        self.assertIn("const siblingInert = new Map()", JS)
        self.assertIn("child.inert = true", JS)
        self.assertIn("element.inert = wasInert", JS)
        self.assertIn("if (event.key !== 'Tab') return", JS)
        self.assertIn("last.focus()", JS)
        self.assertIn("first.focus()", JS)
        self.assertIn("returnFocus.focus({ preventScroll: true })", JS)
        self.assertIn("btnClose.addEventListener('click'", JS)

    def test_result_semantics_and_repeated_navigation(self):
        self.assertIn("count.textContent = '没有匹配项'", JS)
        self.assertIn("count.textContent = '找到'", JS)
        self.assertIn("['ArrowDown', 'ArrowUp', 'Home', 'End']", JS)
        self.assertIn("const sameHash = window.location.hash === '#' + href", JS)
        self.assertIn("target.scrollIntoView({ block: 'start' })", JS)
        self.assertIn("heading.focus({ preventScroll: true })", JS)
        self.assertIn("escapeMarkup(h.title)", JS)
        self.assertIn("escapeMarkup(h.href)", JS)
        self.assertIn("highlight(snippet, query)", JS)

    def test_small_width_search_and_reduced_motion(self):
        self.assertIn("body.site-unified .search-overlay__header", CSS)
        self.assertIn("body.site-unified .search-overlay__close", CSS)
        self.assertIn("max-height: calc(100dvh - 28px)", CSS)
        self.assertIn("overscroll-behavior-y: contain", CSS)
        self.assertIn("@media (prefers-reduced-motion: reduce)", CSS)
        self.assertIn("scroll-behavior: auto !important", CSS)
        self.assertIn("window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'", JS)

    def test_source_and_editorial_content_are_unchanged_by_the_ui(self):
        article = HTML.split('<article class="article" id="article">', 1)[1].split("</article>", 1)[0]
        self.assertEqual(len(re.findall(r'<h2 id="([^"]+)" class="article-h2">', article)), 9)
        self.assertNotIn("这篇文章，我差不多拖了五年才动笔", article)
        self.assertIn('id="preface-draft-section"', HTML)
        self.assertEqual(HTML.count('class="preface-editorial__paragraph"'), 4)
        self.assertEqual(HTML.count('class="preface-editorial__decision"'), 4)
        self.assertIn('href="styles.css?v=20261022-p11"', HTML)
        self.assertIn('src="app.js?v=20261022-p11"', HTML)


if __name__ == "__main__":
    unittest.main()
