"""Stage 2B regression: preserve the independently themed SpaceX long-form reader."""
from pathlib import Path
import sys
import unittest

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO / 'scripts'))
from build_site import (SPECIAL_PROJECT_PATH, Structure, classify, inline_scripts,
                        raw_controls, transform)


def native_source():
    return (REPO / SPECIAL_PROJECT_PATH).read_text(encoding='utf-8')


def body_attrs(markup):
    return next(node.attrs for node in Structure(markup).nodes if node.tag == 'body')


class NativeSpaceXThemeTests(unittest.TestCase):
    def test_exact_route_is_opted_out_of_unified_theme(self):
        self.assertEqual(classify(SPECIAL_PROJECT_PATH), 'special')
        for path in ('projects/shuge/index.html',
                     'projects/wbw-spacex-mars-cn/source/old.html',
                     'projects/other/index.html', 'index.html'):
            self.assertNotEqual(classify(path), 'special', path)

    def test_native_theme_keeps_global_chrome_and_main_skip(self):
        built, record = transform(native_source(), SPECIAL_PROJECT_PATH)
        attrs = body_attrs(built)
        self.assertEqual(record['status'], 'themed')
        self.assertEqual(record['kind'], 'special')
        self.assertEqual(attrs['data-site-theme'], 'project-native')
        self.assertEqual(attrs['data-site-kind'], 'special')
        self.assertNotIn('site-unified', attrs.get('class', '').split())
        self.assertIn('data-theme="deep-space"', built)
        self.assertIn('data-reading-mode="immersive"', built)
        self.assertIn('href="/assets/site/design.css"', built)
        self.assertEqual(built.count('class="site-header"'), 1)
        self.assertEqual(built.count('class="site-footer"'), 1)
        self.assertIn('class="site-skip" href="#main"', built)
        self.assertIn('<main class="main" id="main">', built)
        self.assertIn('<header class="hero" id="hero">', built)

    def test_original_assets_controls_and_tables_are_not_changed(self):
        source = native_source()
        built, _ = transform(source, SPECIAL_PROJECT_PATH)
        self.assertEqual(inline_scripts(source), inline_scripts(built))
        self.assertEqual(raw_controls(source), raw_controls(built))
        self.assertIn('href="styles.css?v=20260614-v11"', built)
        self.assertIn('id="starfield"', built)
        self.assertNotIn('class="site-table-scroll"', built)
        self.assertIn('id="tocToggle"', built)
        self.assertIn('data-reading-mode="annotated"', built)
        self.assertIn('data-theme="mars-sand"', built)

    def test_unrelated_full_html_remains_unified(self):
        source = '<!doctype html><html><head><title>Test</title></head><body><main><h1>Test</h1></main></body></html>'
        built, record = transform(source, 'projects/other/index.html')
        attrs = body_attrs(built)
        self.assertEqual(record['kind'], 'content')
        self.assertEqual(attrs['data-site-theme'], 'unified-v1')
        self.assertIn('site-unified', attrs.get('class', '').split())
        self.assertIn('href="#site-main-start"', built)

    def test_native_build_is_idempotent(self):
        first, _ = transform(native_source(), SPECIAL_PROJECT_PATH)
        second, record = transform(first, SPECIAL_PROJECT_PATH)
        self.assertEqual(first, second)
        self.assertEqual(record['status'], 'already')


if __name__ == '__main__':
    unittest.main()
