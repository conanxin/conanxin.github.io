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
        self.output = _unique_output_path()
        # Defensive cleanup of any pre-existing path with this exact name
        # (extremely unlikely now that names are uuid-based, but cheap insurance).
        if self.output.exists():
            shutil.rmtree(self.output, ignore_errors=True)
        # Defensive sweep: remove any leftover .test-build-* from previous
        # interrupted runs in the SAME test process — these are real,
        # separate outputs that may otherwise collide with subsequent builds
        # when the next test sees the old directory still on disk and
        # build_site.py refuses to overwrite it.
        for stale in REPO.glob('.test-build-*'):
            if stale == self.output:
                continue
            shutil.rmtree(stale, ignore_errors=True)
        self.addCleanup(shutil.rmtree, str(self.output), True)
        # Also register a final sweep to remove any *new* .test-build-*
        # directories this test created, even if the cleanup() above bailed.
        def _final_sweep():
            for leftover in REPO.glob('.test-build-*'):
                shutil.rmtree(leftover, ignore_errors=True)
        self.addCleanup(_final_sweep)

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


if __name__ == '__main__':
    unittest.main()