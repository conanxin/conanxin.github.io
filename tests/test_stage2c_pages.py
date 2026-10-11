"""Stage 2C: real publication pages keep the four reusable templates valid."""
from pathlib import Path
import sys
import unittest

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO / "scripts"))
from build_site import Structure, transform
from personalize_site import personalize_html

TEMPLATES = ("article", "project", "exhibition", "reference")
PUBLIC = {
    "posts/site-design-evidence-layers.html": ("template-article", "article"),
    "projects/site-design-lab/index.html": ("template-project", "content"),
}
REQUIRED = ("intro", "body", "evidence", "citation", "tech-log")


def document(path):
    return (REPO / path).read_text(encoding="utf-8")


def check_nesting(test, html):
    parser = Structure(html)
    mains = [n for n in parser.nodes if n.tag == "main"]
    articles = [n for n in parser.nodes if n.tag == "article"]
    test.assertEqual(len(mains), 1)
    test.assertEqual(len(articles), 1)
    main, article = mains[0], articles[0]
    test.assertIsNotNone(main.end)
    test.assertIsNotNone(article.end)
    test.assertIn("site-home", main.attrs.get("class", "").split())
    test.assertEqual(parser.nodes[article.parent], main)
    test.assertGreater(main.close_start, article.end,
                       "Article must close before </main> (HTML nesting)")
    test.assertIn("</article>\n</main>", html)


class Stage2CPublicationTests(unittest.TestCase):
    def test_all_four_source_templates_are_valid_full_html(self):
        for kind in TEMPLATES:
            with self.subTest(template=kind):
                path = f"templates/site/{kind}/index.html"
                source = document(path)
                self.assertIn("<!DOCTYPE html>", source)
                self.assertIn("<head>", source)
                self.assertIn("<body>", source)
                self.assertIn("TEMPLATE_", source)
                self.assertIn(f'class="template-{kind}"', source)
                self.assertNotIn('class="site-header"', source)
                check_nesting(self, source)

    def test_published_pilots_have_real_content_and_source_links(self):
        for path, (cls, kind) in PUBLIC.items():
            with self.subTest(path=path):
                source = document(path)
                self.assertNotIn("TEMPLATE_", source)
                self.assertIn(f'class="{cls}"', source)
                self.assertIn('name="description"', source)
                self.assertIn('https://github.com/conanxin/conanxin.github.io/', source)
                self.assertIn('id="intro"', source)
                self.assertIn('id="evidence"', source)
                self.assertIn('id="citation"', source)
                self.assertIn('class="tech-log"', source)
                check_nesting(self, source)
                built, record = transform(source, path)
                self.assertEqual(record["kind"], kind)
                self.assertEqual(record["status"], "themed")
                self.assertEqual(built.count('class="site-header"'), 1)
                self.assertEqual(built.count('class="site-footer"'), 1)
                self.assertIn('data-site-theme="unified-v1"', built)
                self.assertIn('href="#site-main-start"', built)
                personalized = personalize_html(built, path)
                self.assertIn('data-site-identity="conan-xin-v1"', personalized)
                self.assertIn('class="site-brand" href="/">Conan Xin', personalized)
                self.assertNotIn('hello@xin-conan.me', personalized)

    def test_article_and_project_link_to_each_other(self):
        article = document("posts/site-design-evidence-layers.html")
        project = document("projects/site-design-lab/index.html")
        self.assertIn('href="/projects/site-design-lab/"', article)
        self.assertIn('href="/posts/site-design-evidence-layers.html"', project)
        self.assertIn("PR #12", article)
        self.assertIn("PR #12", project)

    def test_no_existing_research_text_is_required_for_pilot(self):
        for path in PUBLIC:
            source = document(path)
            self.assertNotIn("TEMPLATE_", source)
            self.assertNotIn("lorem ipsum", source.lower())
            self.assertGreater(len(source), 2000)


if __name__ == "__main__":
    unittest.main()
