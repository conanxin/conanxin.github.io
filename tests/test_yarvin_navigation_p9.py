"""P9 Yarvin longform navigation: all content remains reachable and separated.

This verifies static navigation/IA only; Chromium checks current-position
highlighting in both desktop sidebar and mobile drawer.
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "projects" / "yarvin-moldbug-cn"
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
JS = (ROOT / "app.js").read_text(encoding="utf-8")

CHAPTERS = [
    "mencius-moldbug",
    "blogger-from-cradle-to-grave",
    "land-sloterdijk-yarvin",
    "yarvin-for-beginners",
    "a-gentle-introduction",
    "american-history-whig",
    "patchwork-final-solution",
    "cathedral-overuse",
    "closing-remarks",
]
CONCEPTS = [
    "context-section",
    "cathedral-section",
    "neocameralism-section",
    "patchwork-section",
    "glossary-section",
    "timeline-section",
    "sources-section",
]
EVIDENCE = [
    "source-ledger-section",
    "passage-review-section",
    "tri-layer-section",
    "preface-draft-section",
    "reading-paths",
]


def section_between(prefix, end):
    return HTML.split(prefix, 1)[1].split(end, 1)[0]


class YarvinNavigationP9Tests(unittest.TestCase):
    def test_complete_sidebar_in_document_order(self):
        toc = section_between('<ul class="toc-list" id="tocList">', '</ul>')
        chapter = section_between('<article class="article" id="article">', "</article>")
        self.assertEqual(re.findall(r'<h2 id="([^"]+)" class="article-h2">', chapter), CHAPTERS)
        links = re.findall(r'<a href="#([^"]+)">', toc)
        self.assertEqual(links, CHAPTERS + CONCEPTS + EVIDENCE)
        self.assertEqual(len(links), 21)
        self.assertEqual(len(set(links)), 21)
        for anchor in links:
            self.assertEqual(HTML.count('id="' + anchor + '"'), 1)

    def test_group_headers_have_exact_counts(self):
        toc = section_between('<ul class="toc-list" id="tocList">', '</ul>')
        groups = re.findall(r'<li class="toc-list__group-label" data-toc-group="([^"]+)">([^<]+)<span>([^<]+)</span></li>', toc)
        self.assertEqual([g[0] for g in groups], ["chapters", "concepts", "evidence"])
        self.assertEqual([g[2].strip() for g in groups], ["9 章", "7 项", "5 项"])
        self.assertIn('id="tocPosition"', HTML)
        self.assertIn('id="tocListDrawer"', HTML)
        self.assertIn('正文 9 章 · 辅助资料 12 项', HTML)

    def test_editorial_bridge_has_three_paths_to_every_auxiliary_module(self):
        nav = section_between('<nav class="reader-transition__nav" aria-label="辅助阅读导航">', '</nav>')
        self.assertEqual(nav.count('class="reader-transition__path"'), 3)
        links = re.findall(r'<a href="#([^"]+)">', nav)
        self.assertEqual(links, CONCEPTS + EVIDENCE)
        self.assertIn('data-reading-path="concepts"', nav)
        self.assertIn('data-reading-path="evidence"', nav)
        self.assertIn('data-reading-path="reading"', nav)
        self.assertIn('补译草案（', nav) if '补译草案（' in nav else self.assertIn('补译草案 · 待审', nav)

    def test_location_tracking_mirrors_to_mobile_and_is_accessible(self):
        self.assertIn("const drawerList = document.getElementById('tocListDrawer');", JS)
        self.assertIn("link.setAttribute('aria-current', 'location')", JS)
        self.assertIn("link.removeAttribute('aria-current')", JS)
        self.assertIn("floating.setAttribute('aria-label', '打开内容导航，当前位置：' + location)", JS)
        self.assertIn('getBoundingClientRect().top <= offset', JS)
        self.assertIn('toc-list__group-label', JS)
        self.assertIn('toc-list a[aria-current="location"]', CSS)

    def test_navigation_respects_canonical_site_design(self):
        self.assertIn('href="styles.css?v=20261021-p9"', HTML)
        self.assertIn('var(--site-green)', CSS)
        self.assertIn('var(--site-line)', CSS)
        self.assertIn('var(--site-serif)', CSS)
        self.assertNotIn('data-theme="project-native"', HTML)

    def test_translation_and_p7_review_stay_independent(self):
        article = section_between('<article class="article" id="article">', "</article>")
        self.assertEqual(len(re.findall(r'<h2 id="([^"]+)" class="article-h2">', article)), 9)
        self.assertNotIn('data-p7-paragraph-id', article)
        self.assertIn('id="preface-draft-section"', HTML)
        self.assertEqual(HTML.count('class="preface-editorial__paragraph"'), 4)
        self.assertEqual(HTML.count('class="preface-editorial__decision"'), 4)


if __name__ == "__main__":
    unittest.main()
