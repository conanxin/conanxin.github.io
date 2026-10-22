"""P12 grouped navigation dialog and comparison-table accessibility contract."""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "projects" / "yarvin-moldbug-cn"
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
JS = (ROOT / "app.js").read_text(encoding="utf-8")


class YarvinTocDialogP12Tests(unittest.TestCase):
    def test_modal_drawer_has_accessible_name_and_description(self):
        self.assertIn('id="tocDrawer" role="dialog" aria-modal="true" aria-labelledby="tocDrawerLabel" aria-describedby="tocDrawerIntro"', HTML)
        self.assertIn('id="tocDrawerLabel">内容导航', HTML)
        self.assertIn('id="tocDrawerIntro">正文 9 章 · 辅助资料 12 项', HTML)
        self.assertIn('id="btnTocClose" type="button" aria-label="关闭章节目录"', HTML)
        self.assertIn('id="tocListDrawer"', HTML)

    def test_background_inert_and_scroll_lock_are_reversible(self):
        self.assertIn('const siblingInert = new Map()', JS)
        self.assertIn('siblingInert.set(child, child.inert)', JS)
        self.assertIn('child.inert = true', JS)
        self.assertIn('element.inert = wasInert', JS)
        self.assertIn("priorOverflow = document.body.style.overflow", JS)
        self.assertIn("document.body.style.overflow = priorOverflow", JS)
        self.assertIn("setBackgroundInert(true)", JS)
        self.assertIn("setBackgroundInert(false)", JS)

    def test_keyboard_focus_escape_and_nested_dialog_guard(self):
        self.assertIn("function initTocDrawer()", JS)
        self.assertIn("event.key !== 'Tab'", JS)
        self.assertIn("event.shiftKey && (document.activeElement === first", JS)
        self.assertIn("const trigger = lastTrigger && lastTrigger.isConnected", JS)
        self.assertIn("trigger.focus({ preventScroll: true })", JS)
        self.assertIn("event.stopImmediatePropagation()", JS)
        self.assertIn("if (event.target.closest('a[href^=\"#\"]')) close(false)", JS)

    def test_both_tables_have_captions_scoped_headers(self):
        self.assertEqual(HTML.count('<caption class="reader-table-caption">'), 2)
        self.assertEqual(HTML.count('<th scope="col">'), 7)
        self.assertEqual(HTML.count('<th scope="row">'), 15)
        self.assertIn('role="region" aria-label="两种制度模型对照表，可横向滚动" tabindex="0"', HTML)
        self.assertIn('role="region" tabindex="0" aria-label="九章标题对应关系，可横向滚动"', HTML)
        self.assertIn("body.site-unified .reader-table-caption", CSS)
        self.assertIn('body.site-unified .toc-drawer__panel', CSS)

    def test_no_change_to_frozen_reader_content(self):
        article = HTML.split('<article class="article" id="article">', 1)[1].split("</article>", 1)[0]
        self.assertEqual(len(re.findall(r'<h2 id="([^"]+)" class="article-h2">', article)), 9)
        self.assertNotIn("这篇文章，我差不多拖了五年才动笔", article)
        self.assertIn('id="preface-draft-section"', HTML)
        self.assertIn('href="styles.css?v=20261022-p13"', HTML)
        self.assertIn('src="app.js?v=20261022-p13"', HTML)


if __name__ == "__main__":
    unittest.main()
