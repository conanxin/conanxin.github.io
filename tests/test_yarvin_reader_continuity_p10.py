"""P10 design-mainline regression for keyboard deep links and opt-in resume."""
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1] / "projects" / "yarvin-moldbug-cn"
HTML=(ROOT/"index.html").read_text(encoding="utf-8")
JS=(ROOT/"app.js").read_text(encoding="utf-8")
CSS=(ROOT/"styles.css").read_text(encoding="utf-8")


class ReaderContinuityP10Tests(unittest.TestCase):
    def test_resume_is_opt_in_and_hidden_until_saved_progress(self):
        self.assertIn('id="resumeReading" class="btn btn--ghost" hidden',HTML)
        self.assertIn("window.localStorage.getItem(locationKey)",JS)
        self.assertIn("window.localStorage.setItem(locationKey, active.id)",JS)
        self.assertIn("if (found && found.id !== targets[0].id)",JS)
        self.assertIn("resumeLink.hidden = false",JS)
        self.assertIn('body.site-unified #resumeReading[hidden]',CSS)

    def test_navigation_focus_never_forces_scroll(self):
        self.assertIn("function initAnchorFocus()",JS)
        self.assertIn("target.querySelector('h2') || target",JS)
        self.assertIn("focusTarget.focus({ preventScroll: true })",JS)
        self.assertIn("window.addEventListener('hashchange'",JS)
        self.assertIn("window.__yarvinApp.initAnchorFocus()",JS)
        self.assertIn("body.site-unified .reader-anchor-focus:focus",CSS)

    def test_navigation_sources_preserved(self):
        self.assertIn('href="styles.css?v=20261022-p11"',HTML)
        self.assertIn('src="app.js?v=20261022-p11"',HTML)
        self.assertEqual(HTML.count('class="preface-editorial__paragraph"'),4)
        self.assertEqual(HTML.count('class="preface-editorial__decision"'),4)
        article=HTML.split('<article class="article" id="article">',1)[1].split("</article>",1)[0]
        self.assertNotIn("这篇文章，我差不多拖了五年才动笔",article)
        self.assertNotIn('id="resumeReading"',article)


if __name__=="__main__":
    unittest.main()
