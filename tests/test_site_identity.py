from pathlib import Path
import unittest
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from personalize_site import personalize_html, normalize_text, public_route

class SiteIdentityTests(unittest.TestCase):
    def test_brand_and_contact(self):
        source = '<html><head><title>关于 | Xin Conan</title></head><body><a class="site-brand">Xin Conan</a><a href="mailto:hello@xin-conan.me">hello@xin-conan.me</a></body></html>'
        out = personalize_html(source, 'about.html')
        self.assertIn('关于 | Conan Xin', out)
        self.assertNotIn('hello@xin-conan.me', out)
        self.assertIn('mailto:conanxin@gmail.com', out)
        self.assertIn('data-site-identity="conan-xin-v1"', out)

    def test_code_and_scripts_are_not_rewritten(self):
        protected = '<script>const author="Xin Conan";</script><pre><code>git clone https://github.com/xin-conan/demo</code></pre><textarea>Xin Conan</textarea>'
        source = '<html><head></head><body><p>Xin Conan</p>' + protected + '</body></html>'
        out = personalize_html(source, 'posts/test.html')
        self.assertIn(protected, out)
        self.assertIn('<p>Conan Xin</p>', out)

    def test_research_titles_dates_and_links_unchanged(self):
        content = '<h1 id="research">《水经注》易水研究</h1><p>原作者：郦道元。2026-05-12。</p><a href="/projects/shuge/?q=易水#evidence">史料</a><input id="q" value="Xin Conan">'
        out = personalize_html('<html><head></head><body>'+content+'</body></html>', 'projects/shuge/index.html')
        self.assertIn(content, out)

    def test_old_logo_text_and_placeholder_account(self):
        out = personalize_html('<html><head></head><body><span>XIN_CONAN</span><span>xin-conan</span><a href="https://github.com/xin-conan">@xin-conan</a></body></html>', 'posts/test.html')
        self.assertIn('CONAN_XIN', out)
        self.assertIn('https://github.com/conanxin', out)
        self.assertIn('@conanxin', out)

    def test_metadata_person_only_on_profile_pages(self):
        source = '<html><head><title>Xin Conan</title></head><body><h1>介绍</h1></body></html>'
        out = personalize_html(source, 'about.html')
        self.assertIn('"@type": "Person"', out)
        self.assertIn('"name": "Conan Xin"', out)
        self.assertNotIn('"@type": "Person"', personalize_html(source, 'posts/test.html'))

    def test_idempotence(self):
        first = personalize_html('<html><head><title>Xin Conan</title></head><body>Xin Conan</body></html>', 'index.html')
        self.assertEqual(personalize_html(first, 'index.html'), first)

    def test_navigation_excludes_technical_copies(self):
        self.assertTrue(public_route('projects/shuge-exhibition-v1.0/rooms/room2/index.html'))
        self.assertTrue(public_route('drafts/east-wu-romance-rc2/chapters/001.html'))
        self.assertFalse(public_route('src/posts/index.html'))
        self.assertFalse(public_route('projects/wbw-spacex-mars-cn/source/original/page-1.html'))
        self.assertFalse(public_route('drafts/x/backups/old/index.html'))
        self.assertFalse(public_route('projects/yarvin-moldbug-cn/work/article.body.html'))

if __name__ == '__main__': unittest.main()
