"""P8 mainline design contract for the unified Yarvin reader.

This covers visual-system integration and theme/mode controls only. It does not
approve or modify translation content, the P7 draft, or the source ledgers.
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects" / "yarvin-moldbug-cn"
HTML = (PROJECT / "index.html").read_text(encoding="utf-8")
CSS = (PROJECT / "styles.css").read_text(encoding="utf-8")
GLOBAL_CSS = (ROOT / "assets" / "site" / "design.css").read_text(encoding="utf-8")


def css_blocks(source, selector):
    pattern = re.escape(selector) + r"\s*\{([^}]*)\}"
    return [match.group(1) for match in re.finditer(pattern, source)]


class YarvinDesignContractP8Tests(unittest.TestCase):
    def test_reader_has_all_three_theme_and_mode_controls(self):
        themes = re.findall(r'<button[^>]*data-theme="([^"]+)"', HTML)
        modes = re.findall(r'<button[^>]*data-reading-mode="([^"]+)"', HTML)
        self.assertEqual(set(themes), {"cathedral", "patchwork", "ink"})
        self.assertEqual(set(modes), {"annotated", "immersive", "compact"})
        self.assertIn('<html lang="zh-CN" data-theme="cathedral" data-reading-mode="annotated">', HTML)
        self.assertIn('href="styles.css?v=20261021-p8"', HTML)

    def test_local_palette_aliases_use_global_design_tokens(self):
        roots = re.findall(r"(?m)^:root\s*\{([^}]*)\}", CSS)
        self.assertEqual(len(roots), 1, "do not create a second local design-system root")
        root = roots[0]
        for token in (
            "--bg", "--bg-2", "--bg-3", "--fg", "--fg-2", "--fg-3",
            "--accent", "--accent-2", "--link", "--link-hover",
            "--quote-bg", "--quote-border", "--meta-bg", "--hr",
        ):
            self.assertRegex(root, re.escape(token) + r":\s*var\(--site-[\w-]+\)")
        self.assertIn("--site-bg:#f8f7f4", GLOBAL_CSS)
        self.assertIn("--site-green:#294b40", GLOBAL_CSS)
        self.assertIn("--site-accent:#995b3f", GLOBAL_CSS)
        self.assertNotRegex(root, r"#[0-9a-fA-F]{3,8}\b")

    def test_content_theme_accents_are_not_hardcoded_to_brand_chrome(self):
        eyebrow = css_blocks(CSS, "body.site-unified .hero__eyebrow")
        self.assertGreaterEqual(len(eyebrow), 1)
        self.assertIn("color: var(--accent);", eyebrow[0])
        meta = css_blocks(CSS, "body.site-unified .article-meta")
        self.assertEqual(len(meta), 1)
        self.assertIn("border-left-color: var(--accent);", meta[0])
        # The active toolbar and primary CTA intentionally remain site-green.
        active_toolbar = css_blocks(CSS, "body.site-unified .toolbar .toolbar__btn.is-active")
        primary = css_blocks(CSS, "body.site-unified .btn--primary")
        self.assertTrue(active_toolbar and "var(--site-green)" in active_toolbar[0])
        self.assertTrue(primary and "var(--site-green)" in primary[0])

    def test_quotes_respect_theme_surface_and_border_tokens(self):
        quotes = css_blocks(CSS, "body.site-unified .article-quote")
        self.assertEqual(len(quotes), 2)
        for block in quotes:
            self.assertIn("var(--quote-bg)", block)
            self.assertIn("var(--quote-border)", block)
        self.assertIn('[data-theme="patchwork"]', CSS)
        self.assertIn("--quote-bg: var(--site-paper);", CSS)
        self.assertIn('[data-theme="ink"]', CSS)
        self.assertIn("--quote-border: var(--site-ink);", CSS)

    def test_reading_mode_values_are_preserved(self):
        self.assertRegex(CSS, r'\[data-reading-mode="immersive"\]\s*\{[^}]*--font-size:\s*19px;[^}]*--line-height:\s*2\.05;')
        self.assertRegex(CSS, r'\[data-reading-mode="compact"\]\s*\{[^}]*--font-size:\s*16px;[^}]*--line-height:\s*1\.65;')
        self.assertIn("var(--font-size)/var(--line-height) var(--site-serif)", CSS)

    def test_p7_translation_and_editorial_draft_are_outside_scope(self):
        article = HTML.split('<article class="article" id="article">', 1)[1].split("</article>", 1)[0]
        self.assertEqual(len(re.findall(r'<h2 id="([^"]+)" class="article-h2">', article)), 9)
        self.assertNotIn("这篇文章，我差不多拖了五年才动笔", article)
        self.assertIn('id="preface-draft-section"', HTML)
        self.assertEqual(HTML.count('class="preface-editorial__paragraph"'), 4)
        self.assertEqual(HTML.count('class="preface-editorial__decision"'), 4)


if __name__ == "__main__":
    unittest.main()
