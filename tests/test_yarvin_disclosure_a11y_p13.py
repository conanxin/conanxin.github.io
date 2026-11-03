"""P13 disclosure-and-table deep-link accessibility, without changing source text."""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "projects" / "yarvin-moldbug-cn"
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
JS = (ROOT / "app.js").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")


class YarvinP13DisclosureTests(unittest.TestCase):
    def test_three_disclosures_are_uniquely_named(self):
        expected = {
            "passage-details-ch5": "第 5 章「红丸」",
            "passage-details-ch7": "第 7 章「Patchwork」",
            "passage-details-ch9": "第 9 章「国际法」",
        }
        matches = re.findall(
            r'<details class="passage-review__details" id="([^"]+)"><summary>([^<]+)</summary>', HTML
        )
        self.assertEqual(len(matches), 3)
        self.assertEqual(set(x[0] for x in matches), set(expected))
        for item_id, label in matches:
            self.assertTrue(label.startswith(expected[item_id]))
            self.assertIn("待审问题", label)
            self.assertEqual(HTML.count('id="' + item_id + '"'), 1)

    def test_hash_navigation_opens_native_details_and_focuses_summary(self):
        self.assertIn("const disclosure = target.closest('details')", JS)
        self.assertIn("if (wasClosed) disclosure.open = true", JS)
        self.assertIn("target.querySelector(':scope > summary') || target", JS)
        self.assertIn("focusTarget.scrollIntoView({ block: 'start', behavior: 'auto' })", JS)
        self.assertIn("focusTarget.focus({ preventScroll: true })", JS)
        self.assertIn("window.addEventListener('hashchange'", JS)
        self.assertIn("function initResearchTableKeyboard()", JS)
        self.assertIn("event.target !== region", JS)
        self.assertIn("region.scrollWidth - region.clientWidth", JS)
        self.assertIn("window.__yarvinApp.initResearchTableKeyboard()", JS)

    def test_both_tables_explain_keyboard_overflow(self):
        self.assertEqual(HTML.count('class="reader-table-hint"'), 2)
        self.assertIn('id="neocameralismTableHint"', HTML)
        self.assertIn('id="triLayerTableHint"', HTML)
        self.assertIn('aria-describedby="neocameralismTableHint"', HTML)
        self.assertIn('aria-describedby="triLayerTableHint"', HTML)
        self.assertIn("表格可左右滚动", HTML)
        self.assertIn("键盘用户", HTML)
        self.assertIn("body.site-unified .reader-table-hint", CSS)

    def test_native_details_keep_p7_pending_state(self):
        article = HTML.split('<article class="article" id="article">', 1)[1].split("</article>", 1)[0]
        self.assertEqual(len(re.findall(r'<h2 id="([^"]+)" class="article-h2">', article)), 9)
        self.assertNotIn("这篇文章，我差不多拖了五年才动笔", article)
        self.assertEqual(HTML.count('class="preface-editorial__paragraph"'), 4)
        self.assertEqual(HTML.count('data-approval="PENDING"'), 8)
        self.assertIn('id="triLayerHeadings"', HTML)

    def test_project_scoped_tokens_and_cache(self):
        self.assertIn('href="styles.css?v=20261022-p13"', HTML)
        self.assertIn('src="app.js?v=20261022-p13"', HTML)
        self.assertIn("outline: 2px solid var(--site-accent)", CSS)
        self.assertIn("var(--site-muted)", CSS)
        self.assertNotIn('data-theme="project-native"', HTML)


if __name__ == "__main__":
    unittest.main()
