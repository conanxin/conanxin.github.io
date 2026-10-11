"""Regression tests for templates/ exclusion in scripts/build_site.py.

Stage 2A: verify that templates/ source files do not appear in .site-build,
that template placeholder strings do not leak to Pages, and that existing
published pages still build correctly after the exclusion change.

Note: build_site.py requires the output directory to be:
  - a child of the source directory (build_site.py:237 safety check)
  - non-existent at invocation time (build_site.py:238 — it creates the dir itself)
Tests therefore compute unique non-existent paths inside the repo. Each test
relies on `addCleanup` to remove the directory after the test completes.
"""
from pathlib import Path
import shutil
import subprocess
import sys
import unittest
import uuid

BUILDER = Path(__file__).resolve().parents[1] / 'scripts' / 'build_site.py'
REPO = Path(__file__).resolve().parents[1]

# These placeholder strings appear ONLY in templates/, never in real content.
# If any of them is found in a built HTML, the templates/ exclusion has failed.
PLACEHOLDERS = (
    'TEMPLATE_ARTICLE_PLACEHOLDER_TITLE',
    'TEMPLATE_PROJECT_PLACEHOLDER_TITLE',
    'TEMPLATE_EXHIBITION_PLACEHOLDER_TITLE',
    'TEMPLATE_REFERENCE_PLACEHOLDER_TITLE',
)

# Monotonic counter so each call within one process gets a fresh suffix.
# Previous test_id values used `os.getpid()` + `id(_unique_output_path)`,
# both of which were identical for every call in the same process —
# the function was not actually unique, which caused races between
# setUp / cleanup / parallel-style test ordering.
_CALL_COUNTER = [0]


def _unique_output_path() -> Path:
    """Return a non-existent path inside REPO that build_site.py can create itself.

    Truly unique across calls within one process and across CI runs because:
      - uuid.uuid4() is globally unique per invocation
      - The call counter guarantees two calls in the same line of code still differ
      - The path stays under REPO because build_site.py enforces that its output
        be a child of the source root.
    """
    _CALL_COUNTER[0] += 1
    return REPO / f'.test-build-{uuid.uuid4().hex[:8]}-{_CALL_COUNTER[0]}'


def _run_build(output: Path) -> None:
    """Run build_site.py into `output`. Asserts exit 0.

    `output` must NOT exist on entry — build_site.py creates it via mkdir.
    """
    if output.exists():
        # Clean up a leftover from a previous failed run before invoking build_site.
        shutil.rmtree(output, ignore_errors=True)
    result = subprocess.run(
        [sys.executable, str(BUILDER), '--source', str(REPO), '--output', str(output)],
        capture_output=True, text=True, timeout=180, cwd=str(REPO),
    )
    assert result.returncode == 0, (
        f"build_site.py failed (exit={result.returncode}):\n"
        f"stderr:\n{result.stderr}\n"
        f"stdout:\n{result.stdout}"
    )


class TemplateExclusionTests(unittest.TestCase):
    """Stage 2A: templates/ source files must never reach .site-build."""

    def setUp(self):
        # Each test gets its own uniquely-named output directory. The uuid +
        # monotonic counter guarantee no two calls in one process (or across
        # concurrent test processes) ever pick the same path, so this test
        # owns self.output and only self.output. Other concurrent tests own
        # their own .test-build-* directories; we must NEVER touch them, or
        # we will race with their cleanup and break their builds.
        self.output = _unique_output_path()
        # Defensive cleanup of any pre-existing path with this exact name
        # (only happens if a previous interrupted run left the SAME uuid
        # behind, which is astronomically unlikely, but cheap insurance
        # for the path WE own).
        if self.output.exists():
            shutil.rmtree(self.output, ignore_errors=True)
        self.addCleanup(shutil.rmtree, str(self.output), True)

    def test_templates_in_excludes_set_in_builder(self):
        """scripts/build_site.py must reference 'templates' in its excludes set."""
        src = BUILDER.read_text(encoding='utf-8')
        self.assertIn(
            "'templates'", src,
            "scripts/build_site.py must include 'templates' in the excludes set "
            "(see the `any(x in {...} for x in rel.parts)` check inside build()). "
            "Without this, any file under templates/ would be copied into .site-build.",
        )

    def test_template_files_not_copied_to_build(self):
        """No templates/ file may appear anywhere in the build output."""
        _run_build(self.output)
        leaked = [
            p for p in self.output.rglob('*')
            if 'templates' in p.relative_to(self.output).parts
        ]
        self.assertEqual(
            leaked, [],
            f"templates/ files must NOT appear in build output; leaked: {leaked}",
        )

    def test_template_placeholders_not_public(self):
        """Placeholder strings (TEMPLATE_*_PLACEHOLDER_*) must not appear in built HTML."""
        _run_build(self.output)
        offenders = []
        for html_file in self.output.rglob('*.html'):
            try:
                content = html_file.read_text(encoding='utf-8')
            except UnicodeDecodeError:
                continue
            for ph in PLACEHOLDERS:
                if ph in content:
                    offenders.append((str(html_file.relative_to(self.output)), ph))
        self.assertEqual(
            offenders, [],
            f"Template placeholders must NOT appear in built HTML: {offenders}",
        )

    def test_existing_articles_still_themed(self):
        """Existing published pages must still receive site-unified after the exclusion change."""
        samples = [
            'about.html',
            'index.html',
            'posts/chinese-ai-silicon-valley-power.html',
            'projects/shuge-exhibition-v1.0/rooms/room2/index.html',
        ]
        for s in samples:
            self.assertTrue((REPO / s).exists(), f"sample source file not found: {s}")
        _run_build(self.output)
        for sample in samples:
            target = self.output / sample
            self.assertTrue(target.exists(), f"{sample} missing from build output")
            content = target.read_text(encoding='utf-8')
            self.assertIn(
                'site-unified', content,
                f"{sample} must still be themed (have site-unified class)",
            )
            self.assertIn(
                'data-site-theme="unified-v1"', content,
                f"{sample} must still have data-site-theme attribute",
            )

    def test_existing_pages_preserve_inline_scripts_and_controls(self):
        """Inline scripts + form controls in existing pages must survive transform()."""
        _run_build(self.output)
        target = self.output / 'posts/chinese-ai-silicon-valley-power.html'
        self.assertTrue(target.exists())
        content = target.read_text(encoding='utf-8')
        self.assertIn('function updateTime', content,
            "inline script body must survive transform (script preservation invariant)")
        self.assertIn('class="site-header"', content,
            "site-header must still be injected for non-home pages")

    def test_site_guide_with_code_block_example_is_themed(self):
        """Regression: site-guide/index.html contains the literal text
        `data-site-theme="unified-v1"` inside a <pre><code> code example
        (a sample HTML snippet shown to readers). The previous whole-string
        scan in transform() matched that literal text and silently skipped
        theme injection for the entire page — three CI runs in a row failed
        with AssertionError: ('/site-guide/', 'no theme').

        The structured body.attrs check must NOT be fooled by attribute-like
        text inside code samples; the page must still receive site-unified
        on its real <body> element.
        """
        # Confirm the source actually contains the offending literal so this
        # test stays meaningful if the code example is ever rewritten.
        source = (REPO / 'site-guide' / 'index.html').read_text(encoding='utf-8')
        self.assertIn(
            'data-site-theme="unified-v1"', source,
            "site-guide source must contain the literal data-site-theme attribute "
            "inside its <pre><code> example for this regression test to be valid",
        )
        _run_build(self.output)
        target = self.output / 'site-guide' / 'index.html'
        self.assertTrue(target.exists(),
            "site-guide/index.html must exist in build output")
        content = target.read_text(encoding='utf-8')
        # The substring scan would match ANY occurrence, including the code
        # example text. To prove the real <body> element was themed (not just
        # the document content) we must locate the actual <body ...> opening tag.
        import re
        body_open_match = re.search(r'<body\b[^>]*>', content)
        self.assertIsNotNone(body_open_match,
            "site-guide output must have a <body> opening tag")
        body_open = body_open_match.group(0)
        self.assertIn('data-site-theme="unified-v1"', body_open,
            "site-guide <body> opening tag must carry data-site-theme=\"unified-v1\" "
            "(structured check, not a raw substring scan of the document text)")
        self.assertRegex(body_open, r'class="[^"]*\bsite-unified\b[^"]*"',
            "site-guide <body> opening tag must carry the site-unified class")
        # And the source code example must STILL be present (we must not have
        # accidentally rewritten the user-authored text inside <pre><code>).
        # The source escapes only `<` and `>` to entities; double-quotes
        # around the example attribute values stay as plain `"`.
        self.assertIn('&lt;body class="site-unified"', content,
            "site-guide output must still contain the literal code example "
            "showing the unified body markup (the example text inside "
            "<pre><code> must survive transform() untouched)")

    def test_build_is_idempotent(self):
        """Running build_site.py twice on the same source must produce
        identical HTML output for every HTML page.

        The second build must NOT duplicate theme injection, leak the
        previously-injected attributes back into the source view, or rewrite
        any content. This protects against regressions where the
        'already-themed' short-circuit becomes destructive.
        """
        output_a = _unique_output_path()
        output_b = _unique_output_path()
        # Both outputs are owned by this test; clean them up only here.
        self.addCleanup(shutil.rmtree, str(output_a), True)
        self.addCleanup(shutil.rmtree, str(output_b), True)
        _run_build(output_a)
        _run_build(output_b)
        # Compare every HTML file in both outputs, keyed by relative path.
        def _read_htmls(root: Path) -> dict:
            out = {}
            for p in root.rglob('*.html'):
                rel = p.relative_to(root)
                out[rel.as_posix()] = p.read_text(encoding='utf-8')
            return out
        a_html = _read_htmls(output_a)
        b_html = _read_htmls(output_b)
        self.assertEqual(set(a_html.keys()), set(b_html.keys()),
            f"Second build created a different set of HTML files than first "
            f"build.\nOnly in A: {sorted(set(a_html)-set(b_html))}\n"
            f"Only in B: {sorted(set(b_html)-set(a_html))}")
        diffs = sorted(rel for rel in a_html if a_html[rel] != b_html[rel])
        self.assertEqual(diffs, [],
            f"Second build produced different content for {len(diffs)} HTML "
            f"file(s); first vs second must be byte-identical:\n{diffs}")


if __name__ == '__main__':
    unittest.main()